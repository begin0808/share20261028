// 國立南大附中 3D 校園導覽 — 3D 場景建構
// 地面（道路、田徑場、球場）以 Canvas 依資料繪製；建築依平面圖尺寸程序化建模。
(function () {
  "use strict";
  const C = window.CAMPUS, M = C.map, S = M.metersPerPx;
  const TN = (window.TN = window.TN || {});

  // ───────── 座標換算 ─────────
  TN.px2w = (x, y) => ({ x: (x - M.origin[0]) * S, z: (y - M.origin[1]) * S });
  TN.w2px = (x, z) => [x / S + M.origin[0], z / S + M.origin[1]];
  TN.FLOOR_H = 3.8;
  const FH = TN.FLOOR_H;

  TN.pointInPoly = function (pt, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  };

  // 所有建築與場地（統一索引）
  TN.allPlaces = C.buildings.concat(C.places);
  TN.byId = {};
  TN.allPlaces.forEach((b) => (TN.byId[b.id] = b));

  TN.roomTypes = {
    c1: { label: "高一班級", color: "#36d15a" },
    c2: { label: "高二班級", color: "#4fdcec" },
    c3: { label: "高三班級", color: "#f7e23b" },
    off: { label: "行政處室", color: "#f0a868" },
    sp: { label: "專科教室", color: "#f6c6a4" },
    lab: { label: "實習／實驗室", color: "#b9a4f0" },
    cm: { label: "公共空間", color: "#dfe6ee" },
    sto: { label: "儲藏", color: "#c9c3b8" },
    wc: { label: "廁所", color: "#a9c7e0" },
    st: { label: "樓梯", color: "#9aa3ad" }
  };
  TN.roomTitle = (r) => (/^\d{3}$/.test(r.n) ? r.n + " 班" : r.n);

  // ───────── 外觀配色 ─────────
  const STYLES = {
    ivory: { wall: "#f1ece0", band: "#c7b99b", roof: "#cfc7b8", glass: "#5d7b93" },
    cream: { wall: "#f3eee2", band: "#b7c99a", roof: "#d8d2c4", glass: "#56748c" },
    white: { wall: "#f6f6f2", band: "#b9c6cf", roof: "#dedcd6", glass: "#5a7891" },
    brick: { wall: "#b65a49", band: "#efe4d2", roof: "#c96a5a", glass: "#4b6378" },
    gray: { wall: "#cfcac3", band: "#8c8782", roof: "#8f8b86", glass: "#53697c" },
    peach: { wall: "#f0d6c2", band: "#e59a74", roof: "#a9a6a4", glass: "#56708a" },
    violet: { wall: "#f2f0f7", band: "#7d58a8", roof: "#7d58a8", glass: "#5b6f98" },
    concrete: { wall: "#c4c1bb", band: "#9c9891", roof: "#b7b4ae", glass: "#55687a" },
    wood: { wall: "#e9dcc6", band: "#8b6b4c", roof: "#a85b3c", glass: "#5d6f80" },
    sand: { wall: "#e8d4b4", band: "#b88745", roof: "#c1873f", glass: "#4f6b85" },
    salmon: { wall: "#d9775f", band: "#f1dccd", roof: "#d4402e", glass: "#4b6276" },
    terracotta: { wall: "#9f4f4a", band: "#e9b47f", roof: "#e8a46d", glass: "#4a5f74" },
    red: { wall: "#f0d77a", band: "#c5372d", roof: "#d42d24", glass: "#5b6c7c" },
    rose: { wall: "#f3ebe7", band: "#e3a1a6", roof: "#e9dedb", glass: "#587690" },
    tan: { wall: "#e7d7bf", band: "#9a6a33", roof: "#9a6a33", glass: "#56708a" },
    pink: { wall: "#c9746c", band: "#f2d2cf", roof: "#e8a0a0", glass: "#4f667c" },
    steel: { wall: "#9aa4ad", band: "#6d7780", roof: "#7f8c99", glass: "#55687a" }
  };

  // ───────── 主題 ─────────
  const THEMES = {
    day: { sky: ["#5aa6e6", "#d6ecff"], fog: "#cfe2f2", hemi: ["#e2f0ff", "#6d7a5c", 0.85], sun: ["#fff4e2", 2.3, [260, 420, 210]], win: 0, lamps: false, clay: false, exposure: 1.0 },
    dusk: { sky: ["#38487a", "#f4a466"], fog: "#e0a07a", hemi: ["#ffd6b0", "#4c4a5a", 0.55], sun: ["#ffb26e", 2.0, [-420, 150, 120]], win: 0.45, lamps: true, clay: false, exposure: 1.05 },
    night: { sky: ["#030814", "#17284a"], fog: "#0b1428", hemi: ["#7d95d6", "#1a1d28", 0.22], sun: ["#a9bcff", 0.45, [-200, 380, -150]], win: 1.15, lamps: true, clay: false, exposure: 1.1 },
    model: { sky: ["#e9edf1", "#fbfbfa"], fog: "#eef0f2", hemi: ["#ffffff", "#b9bcc0", 1.0], sun: ["#ffffff", 1.7, [260, 420, 210]], win: 0, lamps: false, clay: true, exposure: 1.0 }
  };

  const PALETTES = {
    normal: {
      outside: "#d3cdbf", lawn: "#77a352", lawn2: "#6b984a", road: "#3e4247", roadEdge: "#9b9a94", roadLine: "#e9e3c9",
      path: "#d9c6a5", plaza: "#e6d9cc", court: "#e8dcd6", apron: "#c9c4bb", flower: "#d76c8e", soil: "#9b6b45",
      street: "#585c62", streetEdge: "#b3afa6", streetText: "rgba(255,255,255,0.85)", field: "#5f9a3f", field2: "#6aa748",
      lanes: ["#c9352f", "#e5622b", "#efc22f", "#47a447", "#59c2d8", "#3f7fd1", "#5b4fb8", "#8e4aa8"], lineW: "#ffffff",
      clay: "#c8643b", courtGreen: "#2f8a4a", courtSurround: "#c4473b", basket: "#5fae86", pickle: "#9ea5ad"
    },
    clay: {
      outside: "#e9e9e6", lawn: "#dfe3d8", lawn2: "#d9ddd2", road: "#b9bcc0", roadEdge: "#d0d2d4", roadLine: "#f5f5f5",
      path: "#ecebe6", plaza: "#f1f0ec", court: "#eeedea", apron: "#e2e2df", flower: "#e6d6dc", soil: "#d8cfc4",
      street: "#c3c5c8", streetEdge: "#dcdcdc", streetText: "rgba(90,90,90,0.8)", field: "#d4dccb", field2: "#d9e0d0",
      lanes: ["#e9c9c4", "#ecd3c3", "#efe4c2", "#cfe2cb", "#cbe4ea", "#c8d6ec", "#d3cfe9", "#ddcde6"], lineW: "#ffffff",
      clay: "#e5d2c6", courtGreen: "#cfdccc", courtSurround: "#e5d0cc", basket: "#d4e2da", pickle: "#dcdee0"
    }
  };

  // ───────── 工具 ─────────
  const col = (h) => new THREE.Color(h);
  function canvasTex(cv, repeat) {
    const t = new THREE.CanvasTexture(cv);
    t.encoding = THREE.sRGBEncoding;
    if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    t.anisotropy = 8;
    return t;
  }
  function shade(hex, f) {
    const c = col(hex); const hsl = {}; c.getHSL(hsl);
    c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l * f)));
    return "#" + c.getHexString();
  }
  let seed = 12345;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  // ───────── 立面材質（2 開間 × 2 樓層 = 8 m × 7.6 m 一個循環） ─────────
  const facadeCache = {};
  const winMats = [];
  function facadeMaterial(styleKey, variant) {
    const key = styleKey + "|" + variant;
    if (facadeCache[key]) return facadeCache[key];
    const st = STYLES[styleKey] || STYLES.white;
    const W = 256, H = 256;
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const em = document.createElement("canvas"); em.width = W; em.height = H;
    const g = cv.getContext("2d"), e = em.getContext("2d");
    g.fillStyle = st.wall; g.fillRect(0, 0, W, H);
    e.fillStyle = "#000"; e.fillRect(0, 0, W, H);
    if (styleKey === "brick" || styleKey === "terracotta" || styleKey === "pink" || styleKey === "salmon") {
      g.strokeStyle = shade(st.wall, 0.86); g.lineWidth = 1;
      for (let y = 0; y < H; y += 6) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    }
    const bw = W / 2, fh = H / 2;
    for (let fy = 0; fy < 2; fy++) {
      // 樓層腰帶
      g.fillStyle = st.band; g.fillRect(0, fy * fh + fh - 10, W, 10);
      for (let bx = 0; bx < 2; bx++) {
        const x0 = bx * bw, y0 = fy * fh;
        if (variant === "end") {
          if (bx === 0) continue;
          const wx = x0 - 18, wy = y0 + 36, ww = 36, wh = 50;
          g.fillStyle = st.glass; g.fillRect(wx, wy, ww, wh);
          g.strokeStyle = "#f4f4f4"; g.lineWidth = 3; g.strokeRect(wx, wy, ww, wh);
          continue;
        }
        if (variant === "industrial") {
          g.fillStyle = shade(st.wall, 0.92);
          for (let k = 0; k < bw; k += 8) g.fillRect(x0 + k, y0, 3, fh - 10);
          g.fillStyle = st.glass; g.fillRect(x0 + 14, y0 + 18, bw - 28, 22);
          continue;
        }
        const wx = x0 + bw * 0.1, wy = y0 + fh * 0.2, ww = bw * 0.8, wh = fh * 0.5;
        const grd = g.createLinearGradient(0, wy, 0, wy + wh);
        grd.addColorStop(0, shade(st.glass, 1.35)); grd.addColorStop(1, shade(st.glass, 0.8));
        g.fillStyle = grd; g.fillRect(wx, wy, ww, wh);
        g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 3; g.strokeRect(wx, wy, ww, wh);
        g.lineWidth = 2; g.beginPath();
        for (let k = 1; k < 4; k++) { g.moveTo(wx + (ww * k) / 4, wy); g.lineTo(wx + (ww * k) / 4, wy + wh); }
        g.moveTo(wx, wy + wh * 0.35); g.lineTo(wx + ww, wy + wh * 0.35); g.stroke();
        // 夜間窗光
        const lit = rand() > 0.35;
        if (lit) {
          e.fillStyle = rand() > 0.3 ? "#ffd89a" : "#cfe6ff";
          e.fillRect(wx + 2, wy + 2, ww - 4, wh - 4);
        }
      }
    }
    const map = canvasTex(cv, true), emap = canvasTex(em, true);
    const mat = new THREE.MeshStandardMaterial({ map, emissiveMap: emap, emissive: col("#000000"), roughness: 0.82, metalness: 0.02 });
    winMats.push(mat);
    facadeCache[key] = mat;
    return mat;
  }
  function texForSize(mat, along, floors) {
    // 依牆面尺寸複製材質並設定重複次數，讓窗戶維持 4 m 開間
    const m = mat.clone();
    m.map = mat.map.clone(); m.map.needsUpdate = true;
    m.emissiveMap = mat.emissiveMap.clone(); m.emissiveMap.needsUpdate = true;
    const rx = Math.max(0.5, along / 8), ry = floors / 2;
    m.map.repeat.set(rx, ry); m.emissiveMap.repeat.set(rx, ry);
    winMats.push(m);
    return m;
  }
  const plainCache = {};
  function plain(hex, opts) {
    const key = hex + JSON.stringify(opts || {});
    if (!plainCache[key]) plainCache[key] = new THREE.MeshStandardMaterial(Object.assign({ color: col(hex), roughness: 0.85, metalness: 0.02 }, opts || {}));
    return plainCache[key];
  }

  // ───────── World ─────────
  const W = (TN.world = {});
  const isMobile = matchMedia("(pointer: coarse)").matches || Math.min(screen.width, screen.height) < 700;

  W.init = function (canvas) {
    THREE.ColorManagement.legacyMode = false;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.75 : 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    W.renderer = renderer;

    const scene = (W.scene = new THREE.Scene());
    const camera = (W.camera = new THREE.PerspectiveCamera(45, 1, 1, 6000));
    scene.fog = new THREE.Fog(0xcfe2f2, 700, 2300);

    // 天空
    const skyGeo = new THREE.SphereGeometry(4000, 32, 16);
    W.skyUni = { top: { value: col("#5aa6e6") }, bottom: { value: col("#d6ecff") } };
    const sky = new THREE.Mesh(skyGeo, new THREE.ShaderMaterial({
      uniforms: W.skyUni, side: THREE.BackSide, depthWrite: false, fog: false,
      vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform vec3 top; uniform vec3 bottom; varying vec3 vP; void main(){ float h = clamp(vP.y*1.6+0.05,0.0,1.0); gl_FragColor = vec4(mix(bottom, top, pow(h,0.8)),1.0); }"
    }));
    sky.renderOrder = -10;
    scene.add(sky);
    W.sky = sky;

    W.hemi = new THREE.HemisphereLight(0xffffff, 0x666666, 0.8);
    scene.add(W.hemi);
    const sun = (W.sun = new THREE.DirectionalLight(0xffffff, 2));
    sun.castShadow = true;
    const sm = isMobile ? 2048 : 4096;
    sun.shadow.mapSize.set(sm, sm);
    const sc = sun.shadow.camera; sc.left = -420; sc.right = 420; sc.top = 420; sc.bottom = -420; sc.near = 10; sc.far = 1600;
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.5;
    sun.target.position.set(0, 0, -40);
    scene.add(sun, sun.target);

    W.root = new THREE.Group(); scene.add(W.root);
    W.pickables = [];
    W.colliders = [];
    W.records = {};

    buildGround();
    C.buildings.forEach(buildBuilding);
    C.places.forEach(buildPlace);
    buildTrees();
    buildGate();
    buildLamps();
    W.columns.finish();

    W.setTheme("day");
  };

  // ───────── 地面 ─────────
  const K = 0.8; // canvas px / 平面圖 px
  function buildGround() {
    const cw = Math.round(M.width * K), ch = Math.round(M.height * K);
    const cv = (W.groundCanvas = document.createElement("canvas"));
    cv.width = cw; cv.height = ch;
    W.groundTex = canvasTex(cv);
    const gw = M.width * S, gh = M.height * S;
    const c = TN.px2w(M.width / 2, M.height / 2);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(gw, gh), new THREE.MeshStandardMaterial({ map: W.groundTex, roughness: 0.95 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(c.x, 0, c.z);
    ground.receiveShadow = true;
    W.root.add(ground);
    W.groundMesh = ground;
    const outer = (W.outerGround = new THREE.Mesh(new THREE.PlaneGeometry(5200, 5200), new THREE.MeshStandardMaterial({ color: col("#d3cdbf"), roughness: 1 })));
    outer.rotation.x = -Math.PI / 2; outer.position.y = -0.3;
    outer.receiveShadow = true;
    W.root.add(outer);
  }

  function paintGround(pal) {
    const cv = W.groundCanvas, g = cv.getContext("2d");
    const P = (v) => v * K; // 平面圖 px → canvas px
    const m2c = (m) => (m / S) * K; // 公尺 → canvas px
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.fillStyle = pal.outside; g.fillRect(0, 0, cv.width, cv.height);

    // 校外道路
    C.streets.forEach((s) => {
      g.lineCap = "butt"; g.lineJoin = "round";
      g.strokeStyle = pal.streetEdge; g.lineWidth = m2c(s.width + 5); strokePts(g, s.pts, P);
      g.strokeStyle = pal.street; g.lineWidth = m2c(s.width); strokePts(g, s.pts, P);
      g.setLineDash([m2c(4), m2c(5)]); g.strokeStyle = pal.roadLine; g.lineWidth = m2c(0.3); strokePts(g, s.pts, P); g.setLineDash([]);
      if (s.name && s.label) {
        const [a, b] = [s.pts[1], s.pts[2]];
        g.save(); g.translate(P(s.label[0]), P(s.label[1])); g.rotate(Math.atan2(b[1] - a[1], b[0] - a[0]));
        g.fillStyle = pal.streetText; g.font = `bold ${m2c(7)}px "Noto Sans TC", sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
        g.fillText(s.name, 0, 0); g.restore();
      }
    });

    // 校地
    g.beginPath(); C.boundary.forEach(([x, y], i) => (i ? g.lineTo(P(x), P(y)) : g.moveTo(P(x), P(y)))); g.closePath();
    g.fillStyle = pal.lawn; g.fill();
    g.save(); g.clip();
    // 草地紋理
    seed = 99;
    for (let i = 0; i < 9000; i++) {
      g.fillStyle = rand() > 0.5 ? pal.lawn2 : shade(pal.lawn, 1.08);
      const r = 2 + rand() * 6;
      g.globalAlpha = 0.35; g.beginPath(); g.arc(rand() * cv.width, rand() * cv.height, r, 0, 7); g.fill();
    }
    g.globalAlpha = 1;

    // 鋪面
    C.pavings.forEach((p) => {
      g.fillStyle = pal[p.color] || pal.plaza;
      if (p.rect) { const [x0, y0, x1, y1] = p.rect; g.fillRect(P(x0), P(y0), P(x1 - x0), P(y1 - y0)); }
      else { const [x, y, r] = p.circle; g.beginPath(); g.arc(P(x), P(y), P(r), 0, 7); g.fill(); }
    });
    // 建物周邊人行道
    g.fillStyle = pal.apron;
    C.buildings.forEach((b) => {
      [b.rect].concat(b.parts || []).forEach(([x0, y0, x1, y1]) => {
        const pad = 1.6 / S;
        g.fillRect(P(x0 - pad), P(y0 - pad), P(x1 - x0 + pad * 2), P(y1 - y0 + pad * 2));
      });
    });

    // 道路
    const nodes = C.roads.nodes;
    const drawEdges = (kind, width, color) => {
      g.strokeStyle = color; g.lineWidth = m2c(width); g.lineCap = "round"; g.lineJoin = "round";
      C.roads.edges.forEach(([a, b, k]) => {
        if (k !== kind) return;
        g.beginPath(); g.moveTo(P(nodes[a][0]), P(nodes[a][1])); g.lineTo(P(nodes[b][0]), P(nodes[b][1])); g.stroke();
      });
    };
    drawEdges("path", 4.4, shade(pal.path, 0.88));
    drawEdges("path", 3.6, pal.path);
    drawEdges("road", 8.2, pal.roadEdge);
    drawEdges("road", 7, pal.road);
    g.setLineDash([m2c(3), m2c(4)]);
    g.strokeStyle = pal.roadLine; g.lineWidth = m2c(0.25); g.lineCap = "butt";
    C.roads.edges.forEach(([a, b, k]) => {
      if (k !== "road") return;
      g.beginPath(); g.moveTo(P(nodes[a][0]), P(nodes[a][1])); g.lineTo(P(nodes[b][0]), P(nodes[b][1])); g.stroke();
    });
    g.setLineDash([]);

    paintTrack(g, pal, P, m2c);
    C.courts.forEach((ct) => paintCourt(g, pal, ct, P, m2c));
    g.restore();

    // 校界圍牆線
    g.beginPath(); C.boundary.forEach(([x, y], i) => (i ? g.lineTo(P(x), P(y)) : g.moveTo(P(x), P(y)))); g.closePath();
    g.strokeStyle = shade(pal.roadEdge, 0.8); g.lineWidth = m2c(0.8); g.stroke();
    W.groundTex.needsUpdate = true;
  }
  function strokePts(g, pts, P) { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(P(x), P(y)) : g.moveTo(P(x), P(y)))); g.stroke(); }

  // 標準 400 m 田徑場：內圈半徑 36.5 m、直道 84.39 m、8 道 × 1.22 m
  TN.TRACK = { cx: 450, cy: 885, r0: 36.5, L: 84.39, lanes: 8, lw: 1.22 };
  function paintTrack(g, pal, P, m2c) {
    const T = TN.TRACK, cx = P(T.cx), cy = P(T.cy), L = m2c(T.L);
    const stadium = (r) => {
      g.beginPath();
      g.arc(cx, cy - L / 2, r, Math.PI, 2 * Math.PI);
      g.lineTo(cx + r, cy + L / 2);
      g.arc(cx, cy + L / 2, r, 0, Math.PI);
      g.closePath();
    };
    const rOut = T.r0 + T.lanes * T.lw;
    g.fillStyle = shade(pal.lanes[0], 0.75); stadium(m2c(rOut + 1.2)); g.fill();
    for (let i = T.lanes - 1; i >= 0; i--) { g.fillStyle = pal.lanes[i]; stadium(m2c(T.r0 + (i + 1) * T.lw)); g.fill(); }
    g.strokeStyle = pal.lineW; g.lineWidth = Math.max(1.2, m2c(0.08));
    for (let i = 0; i <= T.lanes; i++) { stadium(m2c(T.r0 + i * T.lw)); g.stroke(); }
    // 內場草皮（割草條紋）
    stadium(m2c(T.r0)); g.save(); g.clip();
    const top = cy - L / 2 - m2c(T.r0), h = L + m2c(T.r0) * 2, sw = m2c(6);
    for (let y = top, k = 0; y < top + h; y += sw, k++) { g.fillStyle = k % 2 ? pal.field : pal.field2; g.fillRect(cx - m2c(T.r0), y, m2c(T.r0 * 2), sw); }
    // 足球場線（64 × 100 m）
    const fw = m2c(64), fl = m2c(100);
    g.strokeStyle = "rgba(255,255,255,0.85)"; g.lineWidth = Math.max(1.2, m2c(0.12));
    g.strokeRect(cx - fw / 2, cy - fl / 2, fw, fl);
    g.beginPath(); g.moveTo(cx - fw / 2, cy); g.lineTo(cx + fw / 2, cy); g.stroke();
    g.beginPath(); g.arc(cx, cy, m2c(9.15), 0, 7); g.stroke();
    [-1, 1].forEach((s) => {
      g.strokeRect(cx - m2c(20.16), cy + s * fl / 2 - (s > 0 ? m2c(16.5) : 0), m2c(40.32), m2c(16.5));
      g.strokeRect(cx - m2c(9.16), cy + s * fl / 2 - (s > 0 ? m2c(5.5) : 0), m2c(18.32), m2c(5.5));
    });
    g.restore();
    // 起跑線與 100 m 直道標示
    g.fillStyle = pal.lineW;
    g.fillRect(cx + m2c(T.r0), cy + L / 2 - m2c(0.1), m2c(T.lanes * T.lw), m2c(0.25));
  }

  function paintCourt(g, pal, ct, P, m2c) {
    const [x0, y0, x1, y1] = ct.rect;
    const cx = P((x0 + x1) / 2), cy = P((y0 + y1) / 2), w = P(x1 - x0), h = P(y1 - y0);
    const lw = Math.max(1.2, m2c(0.08));
    g.save(); g.translate(cx, cy);
    const line = () => { g.strokeStyle = pal.lineW; g.lineWidth = lw; };
    if (ct.type === "tennis") {
      g.fillStyle = pal.courtSurround; g.fillRect(-w / 2, -h / 2, w, h);
      const L = m2c(23.77), D = m2c(10.97), Ds = m2c(8.23), sv = m2c(6.4);
      g.fillStyle = pal.courtGreen; g.fillRect(-L / 2 - m2c(2), -D / 2 - m2c(1.5), L + m2c(4), D + m2c(3));
      line(); g.strokeRect(-L / 2, -D / 2, L, D); g.strokeRect(-L / 2, -Ds / 2, L, Ds);
      g.beginPath(); g.moveTo(-sv, -Ds / 2); g.lineTo(-sv, Ds / 2); g.moveTo(sv, -Ds / 2); g.lineTo(sv, Ds / 2); g.moveTo(-sv, 0); g.lineTo(sv, 0); g.stroke();
      g.strokeStyle = "#222"; g.lineWidth = lw * 1.6; g.beginPath(); g.moveTo(0, -D / 2 - m2c(0.9)); g.lineTo(0, D / 2 + m2c(0.9)); g.stroke();
    } else if (ct.type === "basket") {
      g.fillStyle = pal.courtSurround; g.fillRect(-w / 2, -h / 2, w, h);
      const L = m2c(28), D = m2c(15);
      g.fillStyle = pal.basket; g.fillRect(-L / 2, -D / 2, L, D);
      line(); g.strokeRect(-L / 2, -D / 2, L, D);
      g.beginPath(); g.moveTo(0, -D / 2); g.lineTo(0, D / 2); g.stroke();
      g.beginPath(); g.arc(0, 0, m2c(1.8), 0, 7); g.stroke();
      [-1, 1].forEach((s) => {
        const bx = s * (L / 2);
        g.strokeRect(s > 0 ? bx - m2c(5.8) : bx, -m2c(2.45), m2c(5.8), m2c(4.9));
        g.beginPath(); g.arc(bx - s * m2c(1.575), 0, m2c(6.75), s > 0 ? Math.PI / 2 : -Math.PI / 2, s > 0 ? Math.PI * 1.5 : Math.PI / 2); g.stroke();
      });
    } else if (ct.type === "volley") {
      g.fillStyle = pal.courtSurround; g.fillRect(-w / 2, -h / 2, w, h);
      const L = m2c(18), D = m2c(9);
      g.fillStyle = pal.courtGreen; g.fillRect(-L / 2, -D / 2, L, D);
      line(); g.strokeRect(-L / 2, -D / 2, L, D);
      g.beginPath(); g.moveTo(-m2c(3), -D / 2); g.lineTo(-m2c(3), D / 2); g.moveTo(m2c(3), -D / 2); g.lineTo(m2c(3), D / 2); g.stroke();
      g.strokeStyle = "#222"; g.lineWidth = lw * 1.6; g.beginPath(); g.moveTo(0, -D / 2 - m2c(0.6)); g.lineTo(0, D / 2 + m2c(0.6)); g.stroke();
    } else if (ct.type === "pickle") {
      g.fillStyle = pal.pickle; g.fillRect(-w / 2, -h / 2, w, h);
      const L = m2c(13.41), D = m2c(6.1);
      [-1, 1].forEach((s) => {
        g.save(); g.translate(0, s * h / 4);
        g.fillStyle = shade(pal.pickle, 0.85); g.fillRect(-D / 2, -L / 2, D, L);
        line(); g.strokeRect(-D / 2, -L / 2, D, L);
        g.beginPath(); g.moveTo(-D / 2, 0); g.lineTo(D / 2, 0); g.stroke();
        g.restore();
      });
    }
    g.restore();
  }

  // ───────── 柱列（全校共用 InstancedMesh） ─────────
  W.columns = {
    list: [],
    add(x, z, h, r) { this.list.push([x, z, h, r || 0.25]); },
    finish() {
      const geo = new THREE.CylinderGeometry(1, 1, 1, 8);
      const mesh = new THREE.InstancedMesh(geo, plain("#e9e6df"), this.list.length);
      const m = new THREE.Matrix4();
      this.list.forEach(([x, z, h, r], i) => { m.makeScale(r, h, r); m.setPosition(x, h / 2, z); mesh.setMatrixAt(i, m); });
      mesh.castShadow = true;
      mesh.userData.clayable = true;
      W.root.add(mesh);
      W.columnMesh = mesh;
    }
  };

  // ───────── 建築 ─────────
  function rectWorld(r) {
    const a = TN.px2w(r[0], r[1]), b = TN.px2w(r[2], r[3]);
    return { x0: a.x, z0: a.z, x1: b.x, z1: b.z, w: b.x - a.x, d: b.z - a.z, cx: (a.x + b.x) / 2, cz: (a.z + b.z) / 2 };
  }
  function addBox(group, rw, y0, h, styleKey, floors, opts) {
    opts = opts || {};
    const st = STYLES[styleKey] || STYLES.white;
    const geo = new THREE.BoxGeometry(rw.w, h, rw.d);
    const along = (len) => texForSize(facadeMaterial(styleKey, opts.variant || "win"), len, floors);
    const ends = (len) => texForSize(facadeMaterial(styleKey, opts.endVariant || "end"), len, floors);
    const longX = rw.w >= rw.d;
    const roofMat = plain(opts.roofColor || st.roof);
    // 面順序：+x, -x, +y, -y, +z, -z
    const mats = [
      longX ? ends(rw.d) : along(rw.d), longX ? ends(rw.d) : along(rw.d),
      roofMat, roofMat,
      longX ? along(rw.w) : ends(rw.w), longX ? along(rw.w) : ends(rw.w)
    ];
    const mesh = new THREE.Mesh(geo, mats);
    mesh.position.set(rw.cx, y0 + h / 2, rw.cz);
    mesh.castShadow = true; mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  }
  function addParapet(group, rw, y, st) {
    const t = 0.35, h = 0.9, mat = plain(shade(st.wall, 0.96));
    [[rw.w, t, rw.cx, rw.z0 + t / 2], [rw.w, t, rw.cx, rw.z1 - t / 2]].forEach(([w, d, x, z]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y + h / 2, z); m.castShadow = true; group.add(m);
    });
    [[t, rw.d, rw.x0 + t / 2, rw.cz], [t, rw.d, rw.x1 - t / 2, rw.cz]].forEach(([w, d, x, z]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y + h / 2, z); m.castShadow = true; group.add(m);
    });
  }
  function gableGeometry(w, d, h, alongX) {
    // 三角稜柱，屋脊沿長軸
    const hw = w / 2, hd = d / 2;
    let v;
    if (alongX) v = [-hw, 0, -hd, hw, 0, -hd, hw, 0, hd, -hw, 0, hd, -hw, h, 0, hw, h, 0];
    else v = [-hw, 0, -hd, hw, 0, -hd, hw, 0, hd, -hw, 0, hd, 0, h, -hd, 0, h, hd];
    const idx = alongX
      ? [0, 4, 5, 0, 5, 1, 2, 5, 4, 2, 4, 3, 3, 4, 0, 1, 5, 2]
      : [0, 4, 1, 3, 2, 5, 0, 3, 5, 0, 5, 4, 1, 4, 5, 1, 5, 2];
    const geo = new THREE.BufferGeometry();
    const pos = []; for (const i of idx) pos.push(v[i * 3], v[i * 3 + 1], v[i * 3 + 2]);
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.computeVertexNormals();
    return geo;
  }

  function buildBuilding(b) {
    const group = new THREE.Group(); group.name = b.id;
    const st = STYLES[b.style] || STYLES.white;
    const rw = rectWorld(b.rect);
    const floors = b.floors || 1;
    const rec = (W.records[b.id] = { data: b, group, rw, floors, body: rw, meshes: [], top: 0 });
    let top = 0;

    if (b.roof === "shed" || b.roof === "canopy") {
      const h = b.h || 4;
      [b.rect].concat(b.parts || []).forEach((r) => {
        const q = rectWorld(r);
        const roof = new THREE.Mesh(new THREE.BoxGeometry(q.w, 0.25, q.d), b.roof === "canopy" ? solarMat() : plain(st.roof));
        roof.position.set(q.cx, h, q.cz); roof.castShadow = true; roof.receiveShadow = true; group.add(roof);
        gridColumns(q, h, 8);
      });
      top = h;
    } else if (b.roof === "stage") {
      const base = new THREE.Mesh(new THREE.BoxGeometry(rw.w, 1.3, rw.d), plain(st.wall));
      base.position.set(rw.cx, 0.65, rw.cz); base.castShadow = base.receiveShadow = true; group.add(base);
      const back = new THREE.Mesh(new THREE.BoxGeometry(1.2, b.h, rw.d), plain(shade(st.wall, 0.9)));
      back.position.set(rw.x1 - 0.6, b.h / 2, rw.cz); back.castShadow = true; group.add(back);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(rw.w + 2, 0.4, rw.d + 2), plain("#8a2f2a"));
      roof.position.set(rw.cx, b.h + 0.2, rw.cz); roof.castShadow = true; group.add(roof);
      W.columns.add(rw.x0 + 0.6, rw.z0 + 0.6, b.h, 0.3); W.columns.add(rw.x0 + 0.6, rw.z1 - 0.6, b.h, 0.3);
      top = b.h + 0.4;
      rec.body = rw;
    } else {
      // 走廊側內縮
      let body = Object.assign({}, rw);
      const CW = 2.6;
      if (b.corridor) {
        if (b.corridor === "N") body.z0 += CW; if (b.corridor === "S") body.z1 -= CW;
        if (b.corridor === "W") body.x0 += CW; if (b.corridor === "E") body.x1 -= CW;
        body.w = body.x1 - body.x0; body.d = body.z1 - body.z0; body.cx = (body.x0 + body.x1) / 2; body.cz = (body.z0 + body.z1) / 2;
      }
      rec.body = body;
      const wallH = b.roof === "vault" ? (b.h || floors * FH) * 0.66 : (b.h || floors * FH);
      const floorsVis = b.h ? Math.max(1, Math.round(wallH / FH)) : floors;
      const variant = b.id === "factory" || b.id === "janitor" || b.id === "recycling" ? "industrial" : "win";
      addBox(group, body, 0, wallH, b.style, floorsVis, { variant });
      (b.parts || []).forEach((r) => addBox(group, rectWorld(r), 0, wallH, b.style, floorsVis, { variant }));
      top = wallH;

      if (b.corridor) buildCorridor(group, b, rw, body, floors, st);

      if (b.roof === "flat") {
        addParapet(group, rw, wallH, st);
        (b.parts || []).forEach((r) => addParapet(group, rectWorld(r), wallH, st));
        // 樓梯間屋突
        const longX = rw.w >= rw.d, len = longX ? rw.w : rw.d;
        if (floors >= 2 && len > 40) {
          [0.2, 0.8].forEach((f) => {
            const pw = longX ? 6 : body.w * 0.7, pd = longX ? body.d * 0.7 : 6;
            const px = longX ? rw.x0 + rw.w * f : body.cx, pz = longX ? body.cz : rw.z0 + rw.d * f;
            const m = new THREE.Mesh(new THREE.BoxGeometry(pw, 3, pd), plain(shade(st.wall, 0.95)));
            m.position.set(px, wallH + 1.5, pz); m.castShadow = true; group.add(m);
          });
        }
        top = wallH + 0.9;
      } else if (b.roof === "gable" || b.roof === "hip") {
        const alongX = rw.w >= rw.d;
        const rh = Math.min(rw.w, rw.d) * (b.roof === "hip" ? 0.22 : 0.3);
        let geo;
        if (b.roof === "hip") {
          geo = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4, 1); geo.rotateY(Math.PI / 4); geo.translate(0, 0.5, 0);
          geo.scale(rw.w + 1.2, rh, rw.d + 1.2);
        } else geo = gableGeometry(rw.w + 1.2, rw.d + 1.2, rh, alongX);
        const roof = new THREE.Mesh(geo, plain(st.roof, { flatShading: true }));
        roof.position.set(rw.cx, wallH, rw.cz); roof.castShadow = true; group.add(roof);
        top = wallH + rh;
      } else if (b.roof === "vault") {
        const rise = (b.h || 12) - wallH;
        const roof = new THREE.Mesh(vaultGeometry(rw, rise, rw.w >= rw.d), plain(st.roof, { side: THREE.DoubleSide }));
        roof.position.set(rw.cx, wallH, rw.cz);
        roof.castShadow = true; group.add(roof);
        top = wallH + rise;
      }

      if (b.tower) {
        const [tx0, ty0, tx1, ty1, tf] = b.tower;
        const q = rectWorld([tx0, ty0, tx1, ty1]);
        addBox(group, q, 0, tf * FH + 1.2, b.style, tf, { variant: "win" });
        addParapet(group, q, tf * FH + 1.2, st);
        top = Math.max(top, tf * FH + 2.1);
      }
      if (b.bridge) {
        const [bx0, by0, bx1, by1, bf] = b.bridge;
        const q = rectWorld([bx0, by0, bx1, by1]);
        const m = addBox(group, q, (bf - 1) * FH, FH, b.style, 1, { variant: "win" });
        m.userData.bid = b.id;
      }
      if (b.basement) {
        // 地下室採光井示意
        const m = new THREE.Mesh(new THREE.BoxGeometry(rw.w * 0.9, 0.5, 1.2), plain("#7f8a90"));
        m.position.set(rw.cx, 0.25, rw.z1 + 1.4); group.add(m);
      }
      W.colliders.push(...[body].concat((b.parts || []).map(rectWorld)).map((q) => ({ x0: q.x0, x1: q.x1, z0: q.z0, z1: q.z1, id: b.id })));
      if (b.tower) { const q = rectWorld(b.tower); W.colliders.push({ x0: q.x0, x1: q.x1, z0: q.z0, z1: q.z1, id: b.id }); }
    }

    rec.top = top;
    group.traverse((o) => {
      if (o.isMesh) { o.userData.bid = b.id; rec.meshes.push(o); W.pickables.push(o); o.userData.clayable = true; }
    });
    W.root.add(group);
  }

  function vaultGeometry(rw, rise, alongX) {
    // 拱頂：沿長軸的半橢圓筒，兩端封山牆
    const span = alongX ? rw.d : rw.w, len = alongX ? rw.w : rw.d, seg = 28;
    const pos = [], idx = [];
    for (let i = 0; i <= seg; i++) {
      const a = (Math.PI * i) / seg, u = Math.cos(a) * span / 2, y = Math.sin(a) * rise;
      for (const s of [-1, 1]) {
        if (alongX) pos.push(s * len / 2, y, u); else pos.push(u, y, s * len / 2);
      }
    }
    for (let i = 0; i < seg; i++) { const a = i * 2, b = a + 1, c = a + 2, d = a + 3; idx.push(a, c, b, b, c, d); }
    for (const s of [-1, 1]) {
      const c0 = pos.length / 3;
      if (alongX) pos.push(s * len / 2, 0, 0); else pos.push(0, 0, s * len / 2);
      for (let i = 0; i <= seg; i++) {
        const a = (Math.PI * i) / seg, u = Math.cos(a) * span / 2, y = Math.sin(a) * rise;
        if (alongX) pos.push(s * len / 2, y, u); else pos.push(u, y, s * len / 2);
      }
      for (let i = 0; i < seg; i++) idx.push(c0, c0 + 1 + i, c0 + 2 + i);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setIndex(idx); geo.computeVertexNormals();
    return geo;
  }

  let _solar;
  function solarMat() {
    if (_solar) return _solar;
    const cv = document.createElement("canvas"); cv.width = cv.height = 128;
    const g = cv.getContext("2d");
    g.fillStyle = "#2b3f63"; g.fillRect(0, 0, 128, 128);
    g.strokeStyle = "#8aa0bf"; g.lineWidth = 2;
    for (let i = 0; i <= 128; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 128); g.moveTo(0, i); g.lineTo(128, i); g.stroke(); }
    const t = canvasTex(cv, true); t.repeat.set(12, 12);
    _solar = new THREE.MeshStandardMaterial({ map: t, roughness: 0.4, metalness: 0.3, transparent: true, opacity: 0.72, side: THREE.DoubleSide, depthWrite: false });
    return _solar;
  }
  function gridColumns(q, h, step) {
    const nx = Math.max(1, Math.round(q.w / step)), nz = Math.max(1, Math.round(q.d / step));
    for (let i = 0; i <= nx; i++) for (const z of [q.z0 + 0.4, q.z1 - 0.4]) W.columns.add(q.x0 + 0.4 + (i * (q.w - 0.8)) / nx, z, h, 0.22);
    for (let j = 1; j < nz; j++) for (const x of [q.x0 + 0.4, q.x1 - 0.4]) W.columns.add(x, q.z0 + 0.4 + (j * (q.d - 0.8)) / nz, h, 0.22);
  }

  function buildCorridor(group, b, rw, body, floors, st) {
    const side = b.corridor;
    const strip = {
      N: { x0: rw.x0, x1: rw.x1, z0: rw.z0, z1: body.z0 }, S: { x0: rw.x0, x1: rw.x1, z0: body.z1, z1: rw.z1 },
      W: { x0: rw.x0, x1: body.x0, z0: rw.z0, z1: rw.z1 }, E: { x0: body.x1, x1: rw.x1, z0: rw.z0, z1: rw.z1 }
    }[side];
    const sw = strip.x1 - strip.x0, sd = strip.z1 - strip.z0, scx = (strip.x0 + strip.x1) / 2, scz = (strip.z0 + strip.z1) / 2;
    const slabMat = plain(shade(st.wall, 0.97)), railMat = plain(st.band);
    for (let f = 1; f <= floors; f++) {
      const y = f * FH;
      const slab = new THREE.Mesh(new THREE.BoxGeometry(sw, 0.3, sd), slabMat);
      slab.position.set(scx, y - 0.15, scz); slab.castShadow = true; slab.receiveShadow = true; group.add(slab);
      if (f < floors) {
        // 欄杆女兒牆（外緣）
        const alongX = side === "N" || side === "S";
        const rail = new THREE.Mesh(new THREE.BoxGeometry(alongX ? sw : 0.25, 1.05, alongX ? 0.25 : sd), railMat);
        const ox = side === "W" ? strip.x0 + 0.12 : side === "E" ? strip.x1 - 0.12 : scx;
        const oz = side === "N" ? strip.z0 + 0.12 : side === "S" ? strip.z1 - 0.12 : scz;
        rail.position.set(ox, y + 0.52, oz); rail.castShadow = true; group.add(rail);
      }
    }
    // 外緣柱列
    const alongX = side === "N" || side === "S", len = alongX ? sw : sd, n = Math.max(1, Math.round(len / 4));
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const x = alongX ? strip.x0 + 0.3 + t * (sw - 0.6) : side === "W" ? strip.x0 + 0.3 : strip.x1 - 0.3;
      const z = alongX ? (side === "N" ? strip.z0 + 0.3 : strip.z1 - 0.3) : strip.z0 + 0.3 + t * (sd - 0.6);
      W.columns.add(x, z, floors * FH, 0.28);
    }
  }

  function buildPlace(p) {
    const rw = rectWorld(p.rect);
    const group = new THREE.Group(); group.name = p.id;
    const rec = (W.records[p.id] = { data: p, group, rw, floors: 0, body: rw, meshes: [], top: 1 });
    if (p.canopy) {
      const roof = new THREE.Mesh(new THREE.BoxGeometry(rw.w, 0.25, rw.d), solarMat());
      roof.position.set(rw.cx, p.canopy, rw.cz); roof.castShadow = true; group.add(roof);
      gridColumns(rw, p.canopy, 9);
      rec.top = p.canopy;
      roof.userData.bid = p.id; rec.meshes.push(roof); W.pickables.push(roof);
    }
    // 不可見的點選範圍
    const pick = new THREE.Mesh(new THREE.BoxGeometry(rw.w, 1, rw.d), new THREE.MeshBasicMaterial());
    pick.position.set(rw.cx, 0.5, rw.cz); pick.visible = false; pick.userData.bid = p.id; pick.userData.isPlace = true;
    group.add(pick); W.pickables.push(pick);
    if (p.id === "track") rec.top = 2;
    W.root.add(group);
  }

  // ───────── 樹木（依平面圖取樣位置） ─────────
  function buildTrees() {
    const pts = (window.CAMPUS_TREES || []).filter(([x, y]) => TN.pointInPoly([x, y], C.boundary));
    const blocked = C.buildings.map((b) => b.rect).concat(C.places.filter((p) => p.canopy || p.id === "track").map((p) => p.rect));
    const ok = pts.filter(([x, y]) => !blocked.some(([x0, y0, x1, y1]) => x > x0 - 6 && x < x1 + 6 && y > y0 - 6 && y < y1 + 6));
    const n = ok.length;
    const trunkGeo = new THREE.CylinderGeometry(0.22, 0.34, 1, 6); trunkGeo.translate(0, 0.5, 0);
    const crownGeo = new THREE.IcosahedronGeometry(1, 1);
    const trunk = new THREE.InstancedMesh(trunkGeo, plain("#6b4e36"), n);
    const crownMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9, flatShading: true });
    const crown = new THREE.InstancedMesh(crownGeo, crownMat, n);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), p = new THREE.Vector3();
    const greens = ["#3f7a35", "#4c8a3b", "#5a9a44", "#36702f", "#6aa64c", "#2f6530"].map(col);
    seed = 4242;
    W.treeBase = [];
    ok.forEach(([x, y, f], i) => {
      const w = TN.px2w(x, y);
      const r = 2.3 + rand() * 1.3 + (f - 0.6) * 1.5, th = 2.2 + rand() * 1.6;
      m.compose(p.set(w.x, 0, w.z), q.identity(), s.set(1, th + r * 0.4, 1)); trunk.setMatrixAt(i, m);
      q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rand() * 6.28);
      m.compose(p.set(w.x, th + r * 0.85, w.z), q, s.set(r, r * (0.85 + rand() * 0.3), r)); crown.setMatrixAt(i, m);
      const c = greens[Math.floor(rand() * greens.length)].clone().offsetHSL(0, 0, (rand() - 0.5) * 0.06);
      crown.setColorAt(i, c); W.treeBase.push(c);
    });
    trunk.castShadow = crown.castShadow = true; crown.receiveShadow = true;
    W.root.add(trunk, crown);
    W.trees = { trunk, crown, n };
    W.treeColliders = ok.map(([x, y]) => { const w = TN.px2w(x, y); return [w.x, w.z]; });
  }

  // ───────── 校門與圓環 ─────────
  function signTexture(lines, w, h, bg, fg) {
    const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
    const g = cv.getContext("2d"); g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = fg; g.textAlign = "center"; g.textBaseline = "middle";
    lines.forEach(([t, size, y]) => { g.font = `900 ${size}px "Noto Sans TC", "Microsoft JhengHei", sans-serif`; g.fillText(t, w / 2, y); });
    return canvasTex(cv);
  }
  function buildGate() {
    const gp = C.places.find((p) => p.id === "gate").door;
    const w = TN.px2w(gp[0], gp[1] - 10);
    const ang = Math.atan2(1272, 1923); // 校界（中山南路）方向
    const gate = new THREE.Group();
    gate.position.set(w.x, 0, w.z); gate.rotation.y = -ang;
    const stone = plain("#6d5446"), wall = plain("#e9e4da");
    // 門柱
    [-9, 9].forEach((x) => {
      const p = new THREE.Mesh(new THREE.BoxGeometry(1.6, 4.2, 1.6), stone); p.position.set(x, 2.1, 0); p.castShadow = true; gate.add(p);
    });
    // 校名景觀牆
    const signMat = new THREE.MeshStandardMaterial({ map: signTexture([["國立臺南大學附屬高級中學", 64, 64]], 1024, 128, "#f2efe8", "#1f4f8f"), roughness: 0.7 });
    const sign = new THREE.Mesh(new THREE.BoxGeometry(16, 2.2, 0.8), [wall, wall, wall, wall, wall, signMat]);
    sign.position.set(-20, 1.1, -1.5); sign.castShadow = true; gate.add(sign);
    // 警衛室與電子看板
    const guard = new THREE.Mesh(new THREE.BoxGeometry(6, 3.2, 4.5), plain("#efe9df")); guard.position.set(15, 1.6, 2.5); guard.castShadow = true; gate.add(guard);
    const ledMat = new THREE.MeshStandardMaterial({ map: signTexture([["歡迎蒞臨南大附中", 50, 46], [C.academicYear + " 學年度 3D 校園導覽", 34, 100]], 512, 140, "#0b1730", "#ffcf4a"), emissive: col("#ffffff"), emissiveIntensity: 0.5, roughness: 0.4 });
    ledMat.emissiveMap = ledMat.map;
    const led = new THREE.Mesh(new THREE.BoxGeometry(7, 2.6, 0.4), [plain("#222"), plain("#222"), plain("#222"), plain("#222"), plain("#222"), ledMat]);
    led.position.set(15, 5, 0.5); led.rotation.y = Math.PI; led.castShadow = true; gate.add(led);
    // 伸縮門
    const rail = new THREE.Mesh(new THREE.BoxGeometry(5, 1.2, 0.3), plain("#c23b2f")); rail.position.set(-6, 0.6, 0.6); gate.add(rail);
    W.root.add(gate);
    gate.traverse((o) => { if (o.isMesh) o.userData.clayable = true; });

    // 圓環：旗桿與花台
    const c = TN.px2w(1462, 970);
    const bed = new THREE.Mesh(new THREE.CylinderGeometry(7, 7.4, 0.6, 40), plain("#5b8f3c")); bed.position.set(c.x, 0.3, c.z); bed.receiveShadow = true; W.root.add(bed);
    const flagCols = ["#c8102e", "#2b6cb0", "#2f9e57"];
    [-2.5, 0, 2.5].forEach((dx, i) => {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 13, 8), plain("#d9dde2", { metalness: 0.6, roughness: 0.3 }));
      pole.position.set(c.x + dx, 6.5, c.z); pole.castShadow = true; W.root.add(pole);
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.6), plain(flagCols[i], { side: THREE.DoubleSide }));
      flag.position.set(c.x + dx + 1.2, 11.9, c.z); W.root.add(flag);
    });
    // 入口廣場大樹景觀
    const pz = TN.px2w(1462, 1490);
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(5.5, 5.8, 0.5, 36), plain("#8f8478")); ring.position.set(pz.x, 0.25, pz.z); W.root.add(ring);
  }

  // ───────── 路燈 ─────────
  function buildLamps() {
    const pts = [];
    const nodes = C.roads.nodes;
    C.roads.edges.forEach(([a, b, k]) => {
      const A = TN.px2w(...nodes[a]), B = TN.px2w(...nodes[b]);
      const dx = B.x - A.x, dz = B.z - A.z, len = Math.hypot(dx, dz);
      const nx = -dz / len, nz = dx / len, off = k === "road" ? 4.6 : 2.6;
      for (let t = 12; t < len - 6; t += 28) pts.push([A.x + (dx * t) / len + nx * off, A.z + (dz * t) / len + nz * off]);
    });
    const post = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07, 0.1, 4.6, 6), plain("#5a6068"), pts.length);
    const headMat = new THREE.MeshStandardMaterial({ color: col("#f3f1e8"), emissive: col("#ffd27a"), emissiveIntensity: 0 });
    const head = new THREE.InstancedMesh(new THREE.SphereGeometry(0.35, 10, 8), headMat, pts.length);
    const m = new THREE.Matrix4();
    pts.forEach(([x, z], i) => { m.makeTranslation(x, 2.3, z); post.setMatrixAt(i, m); m.makeTranslation(x, 4.7, z); head.setMatrixAt(i, m); });
    W.root.add(post, head);
    W.lampMat = headMat;
    // 夜間光暈（Sprite）
    const cv = document.createElement("canvas"); cv.width = cv.height = 64;
    const g = cv.getContext("2d"), grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,220,150,0.9)"); grd.addColorStop(1, "rgba(255,200,120,0)");
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    const glowMat = new THREE.SpriteMaterial({ map: canvasTex(cv), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    W.glows = new THREE.Group();
    pts.forEach(([x, z]) => { const s = new THREE.Sprite(glowMat); s.position.set(x, 4.7, z); s.scale.set(5, 5, 1); W.glows.add(s); });
    W.glows.visible = false;
    W.root.add(W.glows);
  }

  // ───────── 主題切換 ─────────
  let clayMat, clayTree;
  W.theme = "day";
  W.setTheme = function (name) {
    const T = THEMES[name] || THEMES.day; W.theme = name;
    W.skyUni.top.value.set(T.sky[0]); W.skyUni.bottom.value.set(T.sky[1]);
    W.scene.fog.color.set(T.fog);
    W.hemi.color.set(T.hemi[0]); W.hemi.groundColor.set(T.hemi[1]); W.hemi.intensity = T.hemi[2];
    W.sun.color.set(T.sun[0]); W.sun.intensity = T.sun[1]; W.sun.position.set(T.sun[2][0], T.sun[2][1], T.sun[2][2] - 40);
    W.renderer.toneMappingExposure = T.exposure;
    winMats.forEach((m) => { m.emissive.set(T.win > 0 ? "#ffffff" : "#000000"); m.emissiveIntensity = T.win; });
    W.lampMat.emissiveIntensity = T.lamps ? 2.2 : 0;
    W.glows.visible = T.lamps;
    paintGround(T.clay ? PALETTES.clay : PALETTES.normal);
    W.outerGround.material.color.set(T.clay ? PALETTES.clay.outside : PALETTES.normal.outside);
    if (!clayMat) { clayMat = new THREE.MeshStandardMaterial({ color: col("#f7f6f2"), roughness: 0.9 }); clayTree = col("#e3e8dc"); }
    W.root.traverse((o) => {
      if (!o.isMesh || !o.userData.clayable) return;
      // 樓層透視中的建築：改寫暫存的材質，離開透視時再還原
      const u = o.userData;
      const get = () => (u.ghosted ? u.saveMat : o.material);
      const set = (m) => { if (u.ghosted) u.saveMat = m; else o.material = m; };
      if (T.clay) { if (!u.origMat) { u.origMat = get(); set(clayMat); } }
      else if (u.origMat) { set(u.origMat); delete u.origMat; }
    });
    const cr = W.trees.crown;
    for (let i = 0; i < W.trees.n; i++) cr.setColorAt(i, T.clay ? clayTree : W.treeBase[i]);
    cr.instanceColor.needsUpdate = true;
  };

  // ───────── 標記與高亮 ─────────
  W.markers = new Map();
  W.highlight = function (ids, color) {
    W.clearHighlight();
    ids.forEach((id) => {
      const r = W.records[id]; if (!r) return;
      const g = new THREE.Group();
      const rw = r.rw, pad = 2.5;
      const shape = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(rw.x0 - pad, 0, rw.z0 - pad), new THREE.Vector3(rw.x1 + pad, 0, rw.z0 - pad),
        new THREE.Vector3(rw.x1 + pad, 0, rw.z1 + pad), new THREE.Vector3(rw.x0 - pad, 0, rw.z1 + pad)
      ]);
      const ringMat = new THREE.LineBasicMaterial({ color: col(color || "#ff4d6d"), transparent: true, opacity: 0.95, depthTest: false });
      const loop = new THREE.LineLoop(shape, ringMat); loop.position.y = 0.4; loop.renderOrder = 5; g.add(loop);
      const fill = new THREE.Mesh(new THREE.PlaneGeometry(rw.w + pad * 2, rw.d + pad * 2), new THREE.MeshBasicMaterial({ color: col(color || "#ff4d6d"), transparent: true, opacity: 0.22, depthWrite: false }));
      fill.rotation.x = -Math.PI / 2; fill.position.set(rw.cx, 0.3, rw.cz); g.add(fill);
      const pin = new THREE.Group();
      const head = new THREE.Mesh(new THREE.SphereGeometry(2.2, 20, 14), new THREE.MeshStandardMaterial({ color: col(color || "#ff4d6d"), emissive: col(color || "#ff4d6d"), emissiveIntensity: 0.5 }));
      head.position.y = 5.2;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(1.5, 4, 16), head.material); cone.rotation.x = Math.PI; cone.position.y = 2;
      pin.add(head, cone); pin.position.set(rw.cx, r.top + 4, rw.cz);
      pin.userData.baseY = r.top + 4;
      g.add(pin); g.userData.pin = pin;
      W.scene.add(g); W.markers.set(id, g);
    });
  };
  W.clearHighlight = function () { W.markers.forEach((g) => W.scene.remove(g)); W.markers.clear(); };

  // ───────── 樓層透視 ─────────
  const ghostMat = new THREE.MeshStandardMaterial({ color: 0xdde6f0, transparent: true, opacity: 0.12, depthWrite: false });
  W.floorView = null;
  TN.roomLayout = function (id, floor) {
    const r = W.records[id], b = r.data, rooms = (b.rooms && b.rooms[floor]) || [];
    const body = r.body, alongX = r.rw.w >= r.rw.d;
    const total = rooms.reduce((s, x) => s + x.w, 0) || 1;
    let acc = 0;
    return rooms.map((room, i) => {
      const a = acc / total, z = (acc + room.w) / total; acc += room.w;
      const box = alongX
        ? { x0: body.x0 + a * body.w, x1: body.x0 + z * body.w, z0: body.z0, z1: body.z1 }
        : { x0: body.x0, x1: body.x1, z0: body.z0 + a * body.d, z1: body.z0 + z * body.d };
      return { room, i, box, y0: (floor - 1) * FH };
    });
  };
  W.showFloor = function (id, floor, roomIndex) {
    W.exitFloor();
    const r = W.records[id]; if (!r) return;
    r.meshes.forEach((m) => { m.userData.ghosted = true; m.userData.saveMat = m.material; m.material = ghostMat; m.castShadow = false; });
    const g = new THREE.Group();
    const lay = TN.roomLayout(id, floor);
    const y0 = (floor - 1) * FH;
    // 樓板（含走廊）
    const rw = r.rw;
    const plate = new THREE.Mesh(new THREE.BoxGeometry(rw.w, 0.3, rw.d), new THREE.MeshStandardMaterial({ color: 0xf4f1ea }));
    plate.position.set(rw.cx, y0 + 0.15, rw.cz); plate.receiveShadow = true; g.add(plate);
    // 其他樓層線框
    for (let f = 1; f <= r.floors; f++) {
      if (f === floor) continue;
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(rw.w, 0.05, rw.d)), new THREE.LineBasicMaterial({ color: 0x8aa0b6, transparent: true, opacity: 0.6 }));
      e.position.set(rw.cx, (f - 1) * FH, rw.cz); g.add(e);
    }
    const roomMeshes = [];
    lay.forEach(({ room, box }, i) => {
      const w = box.x1 - box.x0 - 0.25, d = box.z1 - box.z0 - 0.25, h = FH * 0.78;
      const ty = TN.roomTypes[room.t] || TN.roomTypes.cm;
      const mat = new THREE.MeshStandardMaterial({ color: col(ty.color), roughness: 0.6, emissive: col(ty.color), emissiveIntensity: 0.12 });
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set((box.x0 + box.x1) / 2, y0 + 0.3 + h / 2, (box.z0 + box.z1) / 2);
      m.castShadow = true; m.userData.roomIndex = i; m.userData.bid = id; m.userData.isRoom = true;
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry), new THREE.LineBasicMaterial({ color: 0x334455, transparent: true, opacity: 0.55 }));
      m.add(edges);
      g.add(m); roomMeshes.push(m);
    });
    W.scene.add(g);
    W.floorView = { id, floor, group: g, rooms: roomMeshes, layout: lay, focus: roomIndex == null ? -1 : roomIndex };
    return W.floorView;
  };
  W.focusRoom = function (i) { if (W.floorView) W.floorView.focus = i; };
  W.exitFloor = function () {
    const fv = W.floorView; if (!fv) return;
    W.scene.remove(fv.group);
    fv.group.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    const r = W.records[fv.id];
    r.meshes.forEach((m) => { m.material = m.userData.saveMat; m.castShadow = true; delete m.userData.ghosted; delete m.userData.saveMat; });
    W.floorView = null;
  };

  // ───────── 每幀動畫 ─────────
  W.tick = function (t) {
    W.sky.position.copy(W.camera.position);
    W.markers.forEach((g) => { const p = g.userData.pin; p.position.y = p.userData.baseY + Math.sin(t * 3) * 0.8; p.rotation.y = t; });
    const fv = W.floorView;
    if (fv) fv.rooms.forEach((m, i) => {
      const on = i === fv.focus;
      m.material.emissiveIntensity = on ? 0.45 + Math.sin(t * 6) * 0.3 : 0.12;
      m.scale.y = on ? 1.08 : 1;
    });
  };

  // ───────── 點選 ─────────
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  W.pick = function (cx, cy) {
    const rect = W.renderer.domElement.getBoundingClientRect();
    ndc.set(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(ndc, W.camera);
    if (W.floorView) {
      const hit = ray.intersectObjects(W.floorView.rooms, false)[0];
      if (hit) return { id: W.floorView.id, room: hit.object.userData.roomIndex };
    }
    const hits = ray.intersectObjects(W.pickables, false);
    // 先取實體建築，其次才是場地範圍
    const solid = hits.find((h) => !h.object.userData.isPlace && !h.object.userData.ghosted);
    const h = solid || hits[0];
    return h ? { id: h.object.userData.bid } : null;
  };
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  W.groundPoint = function (cx, cy, out) {
    const rect = W.renderer.domElement.getBoundingClientRect();
    ndc.set(((cx - rect.left) / rect.width) * 2 - 1, -((cy - rect.top) / rect.height) * 2 + 1);
    ray.setFromCamera(ndc, W.camera);
    return ray.ray.intersectPlane(plane, out || new THREE.Vector3());
  };
})();
