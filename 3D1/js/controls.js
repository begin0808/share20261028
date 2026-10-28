// 國立南大附中 3D 校園導覽 — 鳥瞰相機操控
// 滑鼠：左鍵平移（可切換為旋轉）、右鍵旋轉／俯仰、滾輪縮放至游標位置
// 觸控：單指平移、雙指捏合縮放／旋轉、雙指上下滑調整俯角
(function () {
  "use strict";
  const TN = window.TN;
  const DEG = Math.PI / 180;

  TN.Controls = function (camera, dom) {
    const W = TN.world;
    const c = {
      target: new THREE.Vector3(0, 0, -40),
      dist: 760, yaw: 0, pitch: 52 * DEG,
      minDist: 18, maxDist: 1500, minPitch: 10 * DEG, maxPitch: 89.5 * DEG,
      enabled: true, leftMode: "pan", anim: null,
      onClick: null, onChange: null, onUserMove: null
    };
    const bounds = { x0: -300, x1: 300, z0: -440, z1: 320 };

    c.update = function () {
      c.dist = THREE.MathUtils.clamp(c.dist, c.minDist, c.maxDist);
      c.pitch = THREE.MathUtils.clamp(c.pitch, c.minPitch, c.maxPitch);
      c.target.x = THREE.MathUtils.clamp(c.target.x, bounds.x0, bounds.x1);
      c.target.z = THREE.MathUtils.clamp(c.target.z, bounds.z0, bounds.z1);
      const cp = Math.cos(c.pitch);
      camera.position.set(
        c.target.x + c.dist * Math.sin(c.yaw) * cp,
        c.target.y + c.dist * Math.sin(c.pitch),
        c.target.z + c.dist * Math.cos(c.yaw) * cp
      );
      camera.rotation.order = "YXZ";
      camera.rotation.set(-c.pitch, c.yaw, 0);
      if (c.onChange) c.onChange();
    };

    // ───────── 動畫飛行 ─────────
    c.flyTo = function (to, ms) {
      const from = { x: c.target.x, y: c.target.y, z: c.target.z, dist: c.dist, yaw: c.yaw, pitch: c.pitch };
      let dyaw = (to.yaw != null ? to.yaw : c.yaw) - c.yaw;
      dyaw = Math.atan2(Math.sin(dyaw), Math.cos(dyaw));
      const dest = {
        x: to.x != null ? to.x : from.x, y: to.y != null ? to.y : 0, z: to.z != null ? to.z : from.z,
        dist: to.dist || from.dist, yaw: from.yaw + dyaw, pitch: to.pitch != null ? to.pitch : from.pitch
      };
      c.anim = { from, dest, t0: performance.now(), ms: ms || 1200, done: to.done };
    };
    c.step = function (now) {
      const a = c.anim; if (!a) return false;
      let t = Math.min(1, (now - a.t0) / a.ms);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      // 遠距飛行時先拉高再降落
      const span = Math.hypot(a.dest.x - a.from.x, a.dest.z - a.from.z);
      const lift = Math.sin(Math.PI * e) * Math.min(span * 0.35, 260);
      c.target.set(a.from.x + (a.dest.x - a.from.x) * e, a.from.y + (a.dest.y - a.from.y) * e, a.from.z + (a.dest.z - a.from.z) * e);
      c.dist = a.from.dist + (a.dest.dist - a.from.dist) * e + lift;
      c.yaw = a.from.yaw + (a.dest.yaw - a.from.yaw) * e;
      c.pitch = a.from.pitch + (a.dest.pitch - a.from.pitch) * e;
      c.update();
      if (t >= 1) { c.anim = null; if (a.done) a.done(); }
      return true;
    };
    const stopAnim = () => { if (c.anim) c.anim = null; if (c.onUserMove) c.onUserMove(); };

    // ───────── 基本操作（供按鈕與鍵盤使用） ─────────
    c.panScreen = function (dxM, dzM) {
      // 以畫面方向平移（公尺）：dx 右、dz 前
      const s = Math.sin(c.yaw), co = Math.cos(c.yaw);
      c.target.x += dxM * co - dzM * s;
      c.target.z += -dxM * s - dzM * co;
      c.update();
    };
    c.zoomBy = function (f, cx, cy) {
      let p0 = null;
      if (cx != null) p0 = W.groundPoint(cx, cy);
      const old = c.dist;
      c.dist = THREE.MathUtils.clamp(c.dist * f, c.minDist, c.maxDist);
      if (p0) {
        const k = 1 - c.dist / old;
        c.target.x += (p0.x - c.target.x) * k; c.target.z += (p0.z - c.target.z) * k;
      }
      c.update();
    };
    c.rotateBy = function (dyaw, dpitch) { c.yaw += dyaw; c.pitch += dpitch || 0; c.update(); };

    // ───────── 指標事件 ─────────
    const pts = new Map();
    let mode = null, last = null, downAt = null, moved = 0, pinch = null;
    dom.addEventListener("contextmenu", (e) => e.preventDefault());

    dom.addEventListener("pointerdown", (e) => {
      if (!c.enabled) return;
      dom.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 1) {
        downAt = { x: e.clientX, y: e.clientY, t: performance.now() }; moved = 0;
        if (e.pointerType === "touch") mode = "pan";
        else if (e.button === 0) mode = e.shiftKey ? (c.leftMode === "pan" ? "rotate" : "pan") : c.leftMode;
        else if (e.button === 2) mode = c.leftMode === "pan" ? "rotate" : "pan";
        else mode = "rotate";
        last = { x: e.clientX, y: e.clientY };
      } else if (pts.size === 2) {
        mode = "pinch"; pinch = pinchInfo(); moved = 99;
      }
      stopAnim();
    });

    function pinchInfo() {
      const [a, b] = [...pts.values()];
      return { d: Math.hypot(a.x - b.x, a.y - b.y), ang: Math.atan2(b.y - a.y, b.x - a.x), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
    }

    dom.addEventListener("pointermove", (e) => {
      if (!c.enabled || !pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (mode === "pinch" && pts.size >= 2) {
        const p = pinchInfo();
        c.zoomBy(pinch.d / Math.max(p.d, 1), p.cx, p.cy);
        let da = p.ang - pinch.ang; da = Math.atan2(Math.sin(da), Math.cos(da));
        c.yaw -= da;
        c.pitch += (p.cy - pinch.cy) * 0.006;
        pinch = p; c.update();
        return;
      }
      if (!last) return;
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      moved += Math.abs(dx) + Math.abs(dy);
      if (mode === "pan") {
        const a = W.groundPoint(last.x, last.y), b = W.groundPoint(e.clientX, e.clientY);
        if (a && b) { c.target.x += a.x - b.x; c.target.z += a.z - b.z; c.update(); }
      } else if (mode === "rotate") {
        c.yaw -= dx * 0.006; c.pitch += dy * 0.005; c.update();
      }
      last = { x: e.clientX, y: e.clientY };
    });

    const end = (e) => {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pts.size === 1 && mode === "pinch") {
        const p = [...pts.values()][0]; last = { x: p.x, y: p.y }; mode = "pan"; return;
      }
      if (pts.size === 0) {
        if (downAt && moved < 7 && performance.now() - downAt.t < 600 && c.onClick && e.type === "pointerup") c.onClick(e.clientX, e.clientY);
        mode = null; last = null; downAt = null;
      }
    };
    dom.addEventListener("pointerup", end);
    dom.addEventListener("pointercancel", end);

    dom.addEventListener("wheel", (e) => {
      if (!c.enabled) return;
      e.preventDefault(); stopAnim();
      const f = Math.exp(Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), 120) * 0.0016);
      c.zoomBy(f, e.clientX, e.clientY);
    }, { passive: false });

    c.update();
    return c;
  };
})();
