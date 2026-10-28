// 國立南大附中 3D 校園導覽 — 地面漫步模式
// W/S 或 ↑/↓ 前進後退、A/D 或 ←/→ 轉向、Shift 奔跑、滑鼠拖曳環顧；行動裝置使用左下搖桿。
(function () {
  "use strict";
  const TN = window.TN, C = window.CAMPUS;

  const Walk = (TN.walk = { active: false, fp: false, run: false, kind: "boy" });
  const keys = {};
  let avatar, limbs, cam, dom;
  const st = { x: 0, z: 0, h: 0, look: 0.18, dist: 7, phase: 0, speed: 0, camPos: new THREE.Vector3() };
  const joy = { x: 0, y: 0 };

  // ───────── 角色（程序化低多邊形學生） ─────────
  function makeStudent(kind) {
    const g = new THREE.Group();
    const M = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 });
    const skin = M(0xf1c9a5), shirt = M(0xf7f7f4), navy = M(0x23365e), hair = M(0x1f1a17), shoe = M(0x222222), bag = M(kind === "girl" ? 0xd9536f : 0x2f7dd1);
    const box = (w, h, d, m, x, y, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); o.castShadow = true; g.add(o); return o; };
    const pivot = (x, y, z) => { const p = new THREE.Group(); p.position.set(x, y, z); g.add(p); return p; };
    const legL = pivot(-0.11, 0.86, 0), legR = pivot(0.11, 0.86, 0);
    [legL, legR].forEach((p) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.8, 0.18), kind === "girl" ? skin : navy); leg.position.y = -0.4; leg.castShadow = true; p.add(leg);
      const s = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.28), shoe); s.position.set(0, -0.82, -0.04); p.add(s);
    });
    if (kind === "girl") {
      const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.34, 0.42, 12), navy); skirt.position.y = 0.82; skirt.castShadow = true; g.add(skirt);
    } else box(0.38, 0.22, 0.22, navy, 0, 0.92, 0);
    box(0.42, 0.55, 0.24, shirt, 0, 1.28, 0);
    box(0.1, 0.06, 0.02, navy, 0, 1.46, -0.125); // 領帶／領結
    const armL = pivot(-0.27, 1.52, 0), armR = pivot(0.27, 1.52, 0);
    [armL, armR].forEach((p) => {
      const a = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.14), shirt); a.position.y = -0.27; a.castShadow = true; p.add(a);
      const hnd = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), skin); hnd.position.y = -0.58; p.add(hnd);
    });
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), skin); head.position.y = 1.78; head.castShadow = true; g.add(head);
    const hr = new THREE.Mesh(new THREE.SphereGeometry(0.215, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), hair); hr.position.set(0, 1.8, 0.02); g.add(hr);
    if (kind === "girl") { const pony = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.42, 0.12), hair); pony.position.set(0, 1.6, 0.17); g.add(pony); }
    box(0.34, 0.42, 0.16, bag, 0, 1.3, 0.2);
    g.scale.setScalar(1.15);
    return { g, legL, legR, armL, armR };
  }

  Walk.setKind = function (kind) {
    Walk.kind = kind;
    if (avatar) TN.world.scene.remove(avatar);
    const s = makeStudent(kind); avatar = s.g; limbs = s;
    if (Walk.active) { TN.world.scene.add(avatar); avatar.visible = !Walk.fp; }
  };

  Walk.start = function (spawn, camera, domEl) {
    cam = camera; dom = domEl;
    if (!avatar) Walk.setKind(Walk.kind);
    const w = TN.px2w(spawn.at[0], spawn.at[1]);
    st.x = w.x; st.z = w.z; st.h = ((spawn.heading || 0) * Math.PI) / 180; st.look = 0.18;
    TN.world.scene.add(avatar); avatar.visible = !Walk.fp;
    Walk.active = true;
    placeCam(true);
  };
  Walk.stop = function () { Walk.active = false; if (avatar) TN.world.scene.remove(avatar); Object.keys(keys).forEach((k) => (keys[k] = false)); };
  Walk.position = () => ({ x: st.x, z: st.z, h: st.h });
  Walk.setJoy = (x, y) => { joy.x = x; joy.y = y; };
  Walk.toggleView = () => { Walk.fp = !Walk.fp; if (avatar) avatar.visible = !Walk.fp; return Walk.fp; };

  // ───────── 輸入 ─────────
  const map = { KeyW: "f", ArrowUp: "f", KeyS: "b", ArrowDown: "b", KeyA: "l", ArrowLeft: "l", KeyD: "r", ArrowRight: "r", KeyQ: "sl", KeyE: "sr" };
  window.addEventListener("keydown", (e) => {
    if (!Walk.active || /INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
    if (map[e.code]) { keys[map[e.code]] = true; e.preventDefault(); }
    if (e.key === "Shift") Walk.run = true;
  });
  window.addEventListener("keyup", (e) => {
    if (map[e.code]) keys[map[e.code]] = false;
    if (e.key === "Shift") Walk.run = false;
  });
  Walk.press = (k, on) => (keys[k] = on);

  let drag = null;
  Walk.bindPointer = function (el) {
    el.addEventListener("pointerdown", (e) => { if (!Walk.active) return; drag = { x: e.clientX, y: e.clientY, id: e.pointerId }; });
    el.addEventListener("pointermove", (e) => {
      if (!Walk.active || !drag || drag.id !== e.pointerId) return;
      st.h += (e.clientX - drag.x) * 0.005;
      st.look = THREE.MathUtils.clamp(st.look + (e.clientY - drag.y) * 0.004, -0.6, 0.9);
      drag.x = e.clientX; drag.y = e.clientY;
    });
    const up = (e) => { if (drag && drag.id === e.pointerId) drag = null; };
    el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    el.addEventListener("wheel", (e) => { if (Walk.active) { e.preventDefault(); st.dist = THREE.MathUtils.clamp(st.dist * Math.exp(e.deltaY * 0.001), 3, 30); } }, { passive: false });
  };

  // ───────── 碰撞 ─────────
  const R = 0.45;
  function collide(x, z) {
    for (const c of TN.world.colliders) {
      const cx = Math.max(c.x0, Math.min(x, c.x1)), cz = Math.max(c.z0, Math.min(z, c.z1));
      const dx = x - cx, dz = z - cz, d2 = dx * dx + dz * dz;
      if (d2 < R * R) {
        if (d2 < 1e-6) { // 進入建築內部：推到最近的牆面外
          const opts = [[c.x0 - R, z, x - c.x0], [c.x1 + R, z, c.x1 - x], [x, c.z0 - R, z - c.z0], [x, c.z1 + R, c.z1 - z]];
          opts.sort((a, b) => a[2] - b[2]); x = opts[0][0]; z = opts[0][1];
        } else { const d = Math.sqrt(d2); x = cx + (dx / d) * R; z = cz + (dz / d) * R; }
      }
    }
    for (const [tx, tz] of TN.world.treeColliders) {
      const dx = x - tx, dz = z - tz, d2 = dx * dx + dz * dz;
      if (d2 < 0.36 && d2 > 1e-6) { const d = Math.sqrt(d2); x = tx + (dx / d) * 0.6; z = tz + (dz / d) * 0.6; }
    }
    return [x, z];
  }

  function placeCam(snap) {
    const fwd = new THREE.Vector3(Math.sin(st.h), 0, -Math.cos(st.h));
    if (Walk.fp) {
      cam.position.set(st.x, 1.65 * 1.15, st.z);
      cam.rotation.order = "YXZ"; cam.rotation.set(-st.look * 0.8, -st.h, 0);
      return;
    }
    const want = new THREE.Vector3(st.x, 0, st.z).addScaledVector(fwd, -st.dist * Math.cos(st.look)).setY(1.7 + st.dist * Math.sin(st.look) + 0.8);
    if (snap) st.camPos.copy(want); else st.camPos.lerp(want, 0.15);
    cam.position.copy(st.camPos);
    cam.rotation.order = "YXZ";
    cam.lookAt(st.x, 1.75, st.z);
  }

  Walk.tick = function (dt) {
    if (!Walk.active) return null;
    const turn = (keys.r ? 1 : 0) - (keys.l ? 1 : 0) + joy.x;
    const move = (keys.f ? 1 : 0) - (keys.b ? 1 : 0) - joy.y;
    const strafe = (keys.sr ? 1 : 0) - (keys.sl ? 1 : 0);
    st.h += THREE.MathUtils.clamp(turn, -1, 1) * dt * 2.2;
    const spd = (Walk.run ? 9 : 4) * THREE.MathUtils.clamp(move, -1, 1);
    const fx = Math.sin(st.h), fz = -Math.cos(st.h);
    let nx = st.x + fx * spd * dt + Math.cos(st.h) * strafe * 3 * dt, nz = st.z + fz * spd * dt + Math.sin(st.h) * strafe * 3 * dt;
    [nx, nz] = collide(nx, nz);
    if (TN.pointInPoly(TN.w2px(nx, nz), C.boundary)) { st.x = nx; st.z = nz; }
    st.speed = Math.abs(spd) + Math.abs(strafe) * 3;
    // 走路擺動
    st.phase += dt * (st.speed > 0.1 ? st.speed * 2.2 : 0);
    const sw = st.speed > 0.1 ? Math.sin(st.phase) * Math.min(0.9, 0.25 + st.speed * 0.06) : 0;
    limbs.legL.rotation.x = sw; limbs.legR.rotation.x = -sw; limbs.armL.rotation.x = -sw * 0.8; limbs.armR.rotation.x = sw * 0.8;
    avatar.position.set(st.x, st.speed > 0.1 ? Math.abs(Math.sin(st.phase)) * 0.06 : 0, st.z);
    avatar.rotation.y = -st.h;
    placeCam(false);
    return { x: st.x, z: st.z, h: st.h };
  };
})();
