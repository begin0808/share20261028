// 國立南大附中 3D 校園導覽 — 校園路線導航
// 以平面圖道路中心線建立路網，出入口投影到最近路段後以 Dijkstra 求最短步行路線。
(function () {
  "use strict";
  const TN = window.TN, C = window.CAMPUS;

  const Nav = (TN.nav = { route: null, sim: null });
  const nodes = {}, adj = {};
  Object.entries(C.roads.nodes).forEach(([k, [x, y]]) => { const w = TN.px2w(x, y); nodes[k] = new THREE.Vector2(w.x, w.z); adj[k] = []; });
  const edges = C.roads.edges.map(([a, b, kind]) => {
    const len = nodes[a].distanceTo(nodes[b]);
    adj[a].push([b, len]); adj[b].push([a, len]);
    return { a, b, kind, len };
  });

  function project(p) {
    let best = null;
    edges.forEach((e) => {
      const A = nodes[e.a], B = nodes[e.b], AB = B.clone().sub(A);
      const t = THREE.MathUtils.clamp(p.clone().sub(A).dot(AB) / AB.lengthSq(), 0, 1);
      const q = A.clone().addScaledVector(AB, t), d = q.distanceTo(p);
      if (!best || d < best.d) best = { e, t, q, d };
    });
    return best;
  }

  TN.doorOf = function (id) {
    const b = TN.byId[id], d = b.door || [(b.rect[0] + b.rect[2]) / 2, (b.rect[1] + b.rect[3]) / 2];
    const w = TN.px2w(d[0], d[1]);
    return new THREE.Vector2(w.x, w.z);
  };

  Nav.compute = function (fromId, toId) {
    const P = TN.doorOf(fromId), Q = TN.doorOf(toId);
    const ps = project(P), pe = project(Q);
    const dist = {}, prev = {}, done = {};
    Object.keys(nodes).forEach((k) => (dist[k] = Infinity));
    dist[ps.e.a] = ps.q.distanceTo(nodes[ps.e.a]); prev[ps.e.a] = "S";
    dist[ps.e.b] = ps.q.distanceTo(nodes[ps.e.b]); prev[ps.e.b] = "S";
    for (;;) {
      let u = null;
      for (const k in dist) if (!done[k] && dist[k] < Infinity && (u === null || dist[k] < dist[u])) u = k;
      if (u === null) break;
      done[u] = true;
      adj[u].forEach(([v, l]) => { if (dist[u] + l < dist[v]) { dist[v] = dist[u] + l; prev[v] = u; } });
    }
    let bestLen = Infinity, bestEnd = null;
    [pe.e.a, pe.e.b].forEach((k) => { const L = dist[k] + pe.q.distanceTo(nodes[k]); if (L < bestLen) { bestLen = L; bestEnd = k; } });
    let chain = [];
    if (ps.e === pe.e && ps.q.distanceTo(pe.q) <= bestLen) { bestLen = ps.q.distanceTo(pe.q); }
    else { for (let k = bestEnd; k && k !== "S"; k = prev[k]) chain.unshift(nodes[k]); }
    const pts = [P, ps.q, ...chain, pe.q, Q].filter((p, i, arr) => i === 0 || p.distanceTo(arr[i - 1]) > 0.5);
    let length = 0; for (let i = 1; i < pts.length; i++) length += pts[i].distanceTo(pts[i - 1]);
    return { from: fromId, to: toId, pts, length };
  };

  // ───────── 路線繪製 ─────────
  let arrowTex;
  function arrowTexture() {
    if (arrowTex) return arrowTex;
    const cv = document.createElement("canvas"); cv.width = 64; cv.height = 64;
    const g = cv.getContext("2d");
    g.fillStyle = "#ff3d68"; g.fillRect(0, 0, 64, 64);
    g.strokeStyle = "#ffffff"; g.lineWidth = 9; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); g.moveTo(18, 14); g.lineTo(40, 32); g.lineTo(18, 50); g.stroke();
    arrowTex = new THREE.CanvasTexture(cv); arrowTex.encoding = THREE.sRGBEncoding;
    arrowTex.wrapS = THREE.RepeatWrapping; arrowTex.anisotropy = 8;
    return arrowTex;
  }
  function ribbon(pts, width, y) {
    const pos = [], uv = [], idx = [];
    let u = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1], d = b.clone().sub(a), len = d.length();
      const n = new THREE.Vector2(-d.y, d.x).normalize().multiplyScalar(width / 2);
      const base = pos.length / 3;
      pos.push(a.x + n.x, y, a.y + n.y, a.x - n.x, y, a.y - n.y, b.x + n.x, y, b.y + n.y, b.x - n.x, y, b.y - n.y);
      const u1 = u + len / width;
      uv.push(u, 1, u, 0, u1, 1, u1, 0);
      idx.push(base, base + 2, base + 1, base + 1, base + 2, base + 3);
      u = u1;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    return g;
  }
  function pin(color, label) {
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.4 });
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 9, 8), mat); pole.position.y = 4.5;
    const ball = new THREE.Mesh(new THREE.SphereGeometry(1.6, 18, 12), mat); ball.position.y = 9.5;
    const disc = new THREE.Mesh(new THREE.CircleGeometry(3, 28), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.35, depthWrite: false }));
    disc.rotation.x = -Math.PI / 2; disc.position.y = 0.7;
    g.add(pole, ball, disc); g.userData.label = label;
    return g;
  }

  Nav.show = function (route) {
    Nav.clear();
    const W = TN.world, group = new THREE.Group();
    const mat = new THREE.MeshBasicMaterial({ map: arrowTexture(), transparent: true, opacity: 0.95, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4 });
    const rib = new THREE.Mesh(ribbon(route.pts, 3.2, 0.9), mat); rib.renderOrder = 4;
    // 轉角圓盤，讓路線看起來連續
    route.pts.slice(1, -1).forEach((p) => {
      const d = new THREE.Mesh(new THREE.CircleGeometry(1.6, 20), new THREE.MeshBasicMaterial({ color: 0xff3d68, depthWrite: false }));
      d.rotation.x = -Math.PI / 2; d.position.set(p.x, 0.88, p.y); group.add(d);
    });
    const a = pin(0x22c55e, "起點"), b = pin(0xff3d68, "終點");
    a.position.set(route.pts[0].x, 0, route.pts[0].y); b.position.set(route.pts[route.pts.length - 1].x, 0, route.pts[route.pts.length - 1].y);
    group.add(rib, a, b);
    W.scene.add(group);
    Nav.route = Object.assign({ group, mat }, route);
    // 累積距離表（模擬帶路用）
    const cum = [0]; for (let i = 1; i < route.pts.length; i++) cum.push(cum[i - 1] + route.pts[i].distanceTo(route.pts[i - 1]));
    Nav.route.cum = cum;
    return Nav.route;
  };
  Nav.clear = function () {
    Nav.stopSim();
    if (Nav.route) { TN.world.scene.remove(Nav.route.group); Nav.route.group.traverse((o) => o.geometry && o.geometry.dispose()); }
    Nav.route = null;
  };
  Nav.pointAt = function (s) {
    const r = Nav.route, cum = r.cum, pts = r.pts;
    s = THREE.MathUtils.clamp(s, 0, r.length);
    let i = 1; while (i < cum.length - 1 && cum[i] < s) i++;
    const t = (s - cum[i - 1]) / Math.max(cum[i] - cum[i - 1], 1e-6);
    const p = pts[i - 1].clone().lerp(pts[i], t);
    const dir = pts[i].clone().sub(pts[i - 1]).normalize();
    return { p, dir };
  };

  // ───────── 模擬帶路 ─────────
  let guide;
  function guideMesh() {
    if (guide) return guide;
    guide = new THREE.Group();
    const m = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x38bdf8, emissiveIntensity: 0.9 });
    const body = new THREE.Mesh(new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.9, 1.6, 6, 12) : new THREE.SphereGeometry(1.2, 16, 12), m); body.position.y = 1.8;
    const halo = new THREE.Mesh(new THREE.RingGeometry(2.2, 3, 32), new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false }));
    halo.rotation.x = -Math.PI / 2; halo.position.y = 1;
    guide.add(body, halo);
    return guide;
  }
  Nav.startSim = function (speed, onProgress, onDone) {
    if (!Nav.route) return;
    Nav.stopSim();
    const g = guideMesh(); TN.world.scene.add(g);
    Nav.sim = { s: 0, speed, onProgress, onDone, heading: null, camDist: 75, camPitch: 0.62 };
  };
  Nav.stopSim = function () { if (Nav.sim) { TN.world.scene.remove(guide); Nav.sim = null; } };
  Nav.tick = function (dt, t, controls) {
    if (Nav.route) Nav.route.mat.map.offset.x = -t * 1.2;
    const sim = Nav.sim; if (!sim) return;
    sim.s += dt * sim.speed;
    const { p, dir } = Nav.pointAt(sim.s);
    guide.position.set(p.x, 0, p.y);
    const want = Math.atan2(-dir.x, -dir.y); // 相機在行進方向的後方
    if (sim.heading == null) sim.heading = want;
    let d = want - sim.heading; d = Math.atan2(Math.sin(d), Math.cos(d));
    sim.heading += d * Math.min(1, dt * 2.5);
    // 相機跟隨：位於導引點後方
    controls.target.set(p.x, 0, p.y);
    controls.yaw = sim.heading; controls.dist += (sim.camDist - controls.dist) * Math.min(1, dt * 2);
    controls.pitch += (sim.camPitch - controls.pitch) * Math.min(1, dt * 2);
    controls.update();
    if (sim.onProgress) sim.onProgress(sim.s / Nav.route.length);
    if (sim.s >= Nav.route.length) { const done = sim.onDone; Nav.stopSim(); if (done) done(); }
  };
})();
