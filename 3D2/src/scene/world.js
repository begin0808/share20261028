import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { HorizontalTiltShiftShader } from 'three/addons/shaders/HorizontalTiltShiftShader.js';
import { VerticalTiltShiftShader } from 'three/addons/shaders/VerticalTiltShiftShader.js';

import { CATEGORIES, CLUBS, clubsOf } from '../data/clubs.js';
import { G, m, mat, group, glowMats, rng, textTexture, mergeStatic, PALETTE as P } from './kit.js';
import { buildIsland, scatter } from './island.js';
import { clubProp, LANDMARKS, hubBuilding, noticeBoard, lamp, tree, animators } from './props.js';

const TAU = Math.PI * 2;
const UP = new THREE.Vector3(0, 1, 0);
const RING = 31;
const HUB_R = 8.5;
const HEIGHTS = [2.5, 0.5, -1.2, 1.8, -0.6, 1.2];
const islandRadius = n => 5.4 + n * 0.52;

/* ---------- 時間調色盤（依小時插值） ---------- */
const PAL = {
  night: { top: '#17234f', bottom: '#4b5b96', fog: '#3d4a7c', sun: '#c9d5ff', sunI: 1.0, hemiS: '#8e9ad6', hemiG: '#463c52', hemiI: 1.05, cloud: '#7d88ba', stars: 1, lights: 1.4 },
  dawn: { top: '#7092d0', bottom: '#ffcfa8', fog: '#f2c9ad', sun: '#ffb27a', sunI: 1.4, hemiS: '#c9d6f2', hemiG: '#e8c2a0', hemiI: 0.8, cloud: '#ffe2cf', stars: 0, lights: 0.5 },
  day: { top: '#6db7e8', bottom: '#f5f0e2', fog: '#d9edf3', sun: '#fff2dc', sunI: 2.6, hemiS: '#d2e9ff', hemiG: '#f0d9bb', hemiI: 1.15, cloud: '#ffffff', stars: 0, lights: 0 },
  dusk: { top: '#6a7cbc', bottom: '#ffc49c', fog: '#f4ccb4', sun: '#ffb27a', sunI: 2.0, hemiS: '#c4c2e6', hemiG: '#f0c2a2', hemiI: 1.0, cloud: '#f8e0d2', stars: 0.15, lights: 0.9 },
};
const KEYS = [[0, 'night'], [5, 'night'], [6.3, 'dawn'], [8, 'day'], [16, 'day'], [17.6, 'dusk'], [19, 'night'], [24, 'night']];
const tmpA = new THREE.Color(), tmpB = new THREE.Color();
function paletteAt(hour) {
  let i = 0;
  while (i < KEYS.length - 1 && KEYS[i + 1][0] <= hour) i++;
  const [h0, k0] = KEYS[i], [h1, k1] = KEYS[Math.min(i + 1, KEYS.length - 1)];
  const t = h1 === h0 ? 0 : THREE.MathUtils.smoothstep(hour, h0, h1);
  const a = PAL[k0], b = PAL[k1], out = {};
  for (const k in a) {
    if (typeof a[k] === 'number') out[k] = a[k] + (b[k] - a[k]) * t;
    else out[k] = tmpA.set(a[k]).lerp(tmpB.set(b[k]), t).getHex();
  }
  return out;
}

export function createWorld(container) {
  const isMobile = matchMedia('(max-width: 760px)').matches || matchMedia('(pointer: coarse)').matches;

  /* ---------- 渲染器 ---------- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(innerWidth, innerHeight);
  labelRenderer.domElement.className = 'label-layer';
  container.appendChild(labelRenderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog('#d9edf3', 110, 360);

  const camera = new THREE.PerspectiveCamera(38, innerWidth / innerHeight, 0.5, 1500);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 6;
  controls.maxDistance = 340;
  controls.maxPolarAngle = Math.PI * 0.47;
  controls.screenSpacePanning = true;
  controls.zoomToCursor = true;
  controls.keys = { LEFT: 'KeyA', UP: 'KeyW', RIGHT: 'KeyD', BOTTOM: 'KeyS' };
  controls.listenToKeyEvents(window);

  /* ---------- 後製：移軸微縮 ---------- */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const hTilt = new ShaderPass(HorizontalTiltShiftShader);
  const vTilt = new ShaderPass(VerticalTiltShiftShader);
  composer.addPass(hTilt);
  composer.addPass(vTilt);
  composer.addPass(new OutputPass());
  let tiltOn = !isMobile;
  const setTiltSize = () => {
    hTilt.uniforms.h.value = 1.6 / innerWidth;
    vTilt.uniforms.v.value = 1.6 / innerHeight;
    hTilt.uniforms.r.value = vTilt.uniforms.r.value = 0.52;
  };
  setTiltSize();

  /* ---------- 天空 ---------- */
  const skyMat = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      top: { value: new THREE.Color() }, bottom: { value: new THREE.Color() },
      sunDir: { value: new THREE.Vector3(0, 1, 0) }, sunCol: { value: new THREE.Color() }, sunAmt: { value: 1 },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 top; uniform vec3 bottom; uniform vec3 sunDir; uniform vec3 sunCol; uniform float sunAmt; varying vec3 vDir;
      void main(){ float h = clamp(vDir.y*1.4+0.25,0.0,1.0); vec3 c = mix(bottom, top, pow(h,0.8));
      float s = max(dot(normalize(vDir), normalize(sunDir)),0.0); c += sunCol * (pow(s,600.0)*1.2 + pow(s,12.0)*0.25) * sunAmt;
      gl_FragColor = vec4(c,1.0); }`,
  });
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), skyMat);
  scene.add(sky);

  const starGeo = new THREE.BufferGeometry();
  const sp = [];
  for (let i = 0; i < 900; i++) {
    const a = Math.random() * TAU, e = Math.random() * 1.3 + 0.05;
    sp.push(Math.cos(a) * Math.cos(e) * 800, Math.sin(e) * 800, Math.sin(a) * Math.cos(e) * 800);
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  const starMat = new THREE.PointsMaterial({ color: '#fff8e0', size: 2.2, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false });
  scene.add(new THREE.Points(starGeo, starMat));
  const moon = new THREE.Mesh(new THREE.SphereGeometry(14, 20, 14), new THREE.MeshBasicMaterial({ color: '#fff6d8', fog: false, transparent: true, opacity: 0 }));
  scene.add(moon);

  const hemi = new THREE.HemisphereLight('#d2e9ff', '#f0d9bb', 1.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff2dc', 2.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -52, right: 52, top: 52, bottom: -52, near: 10, far: 220 });
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.04;
  scene.add(sun, sun.target);

  /* ---------- 雲海 ---------- */
  const cloudMat = new THREE.MeshStandardMaterial({ color: '#ffffff', flatShading: true, roughness: 1 });
  const cloudSea = new THREE.Group();
  const puffs = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 1), cloudMat, isMobile ? 260 : 420);
  const dummy = new THREE.Object3D();
  const cr = rng(42);
  for (let i = 0; i < puffs.count; i++) {
    const a = cr() * TAU, r = 18 + Math.pow(cr(), 0.7) * 300;
    const s = 5 + cr() * 10 + r * 0.03;
    dummy.position.set(Math.cos(a) * r, -30 + cr() * 5 - (r > 200 ? 4 : 0), Math.sin(a) * r);
    dummy.scale.set(s * (1 + cr() * 0.6), s * (0.45 + cr() * 0.25), s);
    dummy.rotation.set(0, cr() * TAU, 0);
    dummy.updateMatrix();
    puffs.setMatrixAt(i, dummy.matrix);
  }
  puffs.receiveShadow = true;
  cloudSea.add(puffs);
  const cloudFloor = new THREE.Mesh(new THREE.CircleGeometry(700, 32), cloudMat);
  cloudFloor.rotation.x = -Math.PI / 2;
  cloudFloor.position.y = -31;
  cloudSea.add(cloudFloor);
  scene.add(cloudSea);

  // 漂浮在島群之間的小雲
  const driftClouds = [];
  for (let i = 0; i < 14; i++) {
    const g = new THREE.Group();
    const n = 3 + Math.floor(cr() * 4);
    for (let k = 0; k < n; k++) {
      const p = new THREE.Mesh(G.ball(1, 1), cloudMat);
      p.position.set(k * 1.6 - n * 0.8, cr() * 0.6, (cr() - 0.5) * 1.5);
      p.scale.setScalar(1.2 + cr() * 1.3);
      p.scale.y *= 0.7;
      g.add(p);
    }
    const a = cr() * TAU, r = 20 + cr() * 60;
    g.position.set(Math.cos(a) * r, -12 + cr() * 32, Math.sin(a) * r);
    g.userData.speed = 0.6 + cr() * 1.2;
    scene.add(g);
    driftClouds.push(g);
  }

  /* ---------- 島嶼 ---------- */
  const pickRoots = [];
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const islands = {};
  const clubSlots = {};
  const figures = [];
  const labelEls = [];
  const fallsAll = [], floatersAll = [];

  // 外層 div 交給 CSS2DRenderer 定位，內層按鈕才做動畫，避免 transform 互相覆蓋
  function pill(html, cls, onClick) {
    const wrap = document.createElement('div');
    wrap.className = `lbl lbl-${cls}`;
    const el = document.createElement('button');
    el.className = `pill ${cls}`;
    el.innerHTML = html;
    el.addEventListener('click', e => { e.stopPropagation(); onClick?.(); });
    el.addEventListener('pointerdown', e => e.stopPropagation());
    wrap.appendChild(el);
    return wrap;
  }

  // 中央島
  {
    const { root, rand, floaters, statics } = buildIsland({ radius: HUB_R, grass: '#b4da7c', seed: 99 });
    floatersAll.push(...floaters);
    const plaza = m(G.cyl(HUB_R - 1.2, HUB_R - 1.2, 0.06, 24), '#efe3cc', [0, 0.03, 0]);
    plaza.castShadow = false;
    root.add(plaza);
    const b = hubBuilding();
    b.position.z = -1.6;
    root.add(b);
    // 噴水池
    root.add(m(G.cyl(1.3, 1.4, 0.4, 14), '#d8ccb6', [0, 0.2, 3.0]));
    root.add(m(G.cyl(1.1, 1.1, 0.05, 14), mat(P.water, { roughness: 0.2 }), [0, 0.38, 3.0]));
    root.add(m(G.cyl(0.15, 0.2, 0.9, 8), '#d8ccb6', [0, 0.6, 3.0]));
    const spray = m(G.ball(0.35, 1), mat('#bfe8ff', { transparent: true, opacity: 0.75 }), [0, 1.15, 3.0]);
    animators.push(t => spray.scale.setScalar(1 + Math.sin(t * 5) * 0.12));
    root.add(spray);
    const board = noticeBoard();
    board.position.set(4.3, 0, 2.3);
    board.rotation.y = -0.5;
    board.userData.pick = { type: 'feed' };
    root.add(board);
    [[-5.2, 2.2], [5.6, -1.2], [-2.8, 5.4], [2.8, 5.4], [-6.0, -1.0]].forEach(([x, z]) => root.add(lamp(x, z)));
    scatter(root, rand, HUB_R - 0.3, 8, [[0, -2, 4.2], [0, 3, 2], [4.3, 2.3, 1.4], [0, 0, HUB_R - 1.3]], statics);
    mergeStatic(root, statics);
    root.userData.pick = { type: 'hub' };
    scene.add(root);
    pickRoots.push(root);
    const lbl = new CSS2DObject(pill('<b>社團中心</b><small>點公告欄看即時動態</small>', 'hub-pill', () => api.onSelect?.({ type: 'hub' })));
    lbl.position.set(0, 8.4, -2.8);
    root.add(lbl);
    labelEls.push({ el: lbl.element, kind: 'island' });
    islands.hub = { root, center: new THREE.Vector3(0, 0, 0), radius: HUB_R };
    for (let i = 0; i < 10; i++) figures.push({ kind: 'wander', center: new THREE.Vector3(0, 0, 3.0), r: 2.2 + (i % 3) * 0.8, speed: 0.25 + Math.random() * 0.3, phase: Math.random() * TAU, dir: i % 2 ? 1 : -1 });
  }

  CATEGORIES.forEach((cat, ci) => {
    const list = clubsOf(cat.id);
    const R = islandRadius(list.length);
    const ang = -Math.PI / 2 + ci * TAU / 6;
    const center = new THREE.Vector3(Math.cos(ang) * RING, HEIGHTS[ci], Math.sin(ang) * RING);
    const facing = ang + Math.PI; // 面向中央島的方向
    const spacing = TAU / list.length;
    const wfAngle = ci % 2 === 0 ? facing + Math.round(list.length / 2) * spacing : false;
    const { root, rand, floaters, falls, statics } = buildIsland({ radius: R, grass: cat.grass, seed: ci + 1, waterfall: wfAngle });
    root.position.copy(center);
    floatersAll.push(...floaters);
    fallsAll.push(...falls);

    const avoid = falls.map(f => f.avoid);
    // 地標
    const lm = LANDMARKS[cat.landmark](cat.color);
    lm.rotation.y = -facing - Math.PI / 2;
    root.add(lm);
    avoid.push([0, 0, cat.landmark === 'stadium' ? 3.6 : 3.0]);

    // 從橋頭通往地標的石板路
    for (let d = R - 0.6; d > 3.2; d -= 0.75) {
      const tile = m(G.cyl(0.32, 0.32, 0.05, 6), '#efe3cc', [Math.cos(facing) * d + (rand() - 0.5) * 0.2, 0.03, Math.sin(facing) * d + (rand() - 0.5) * 0.2]);
      tile.castShadow = false;
      root.add(tile);
      statics.push(tile);
      avoid.push([tile.position.x, tile.position.z, 0.6]);
    }

    // 社團攤位
    const rr = R - 2.0;
    list.forEach((club, i) => {
      const a = facing + (i + 0.5) * spacing;
      const x = Math.cos(a) * rr, z = Math.sin(a) * rr;
      const slot = new THREE.Group();
      slot.position.set(x, 0, z);
      slot.rotation.y = Math.atan2(Math.cos(a), Math.sin(a));
      const plinth = group(
        m(G.cyl(1.25, 1.32, 0.12, 10), cat.color, [0, 0.06, 0]),
        m(G.cyl(1.15, 1.2, 0.14, 10), P.stone, [0, 0.16, 0]),
      );
      const ringMat = new THREE.MeshBasicMaterial({ color: cat.color, transparent: true, opacity: 0, depthWrite: false });
      const ring = new THREE.Mesh(new THREE.RingGeometry(1.35, 1.6, 24), ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.05;
      const prop = clubProp(club, cat.color);
      prop.position.y = 0.23;
      // 隱形點擊範圍（靜態零件合併後仍點得到社團）
      const hit = new THREE.Mesh(G.cyl(1.3, 1.3, 2.8, 8), hitMat);
      hit.position.y = 1.4;
      slot.add(plinth, ring, prop, hit);
      slot.userData.pick = { type: 'club', id: club.id };
      root.add(slot);
      statics.push(plinth);
      avoid.push([x, z, 1.9]);

      const lbl = new CSS2DObject(pill(`<i style="--c:${cat.color}">${club.emoji}</i>${club.name}`, 'club-pill', () => api.onSelect?.({ type: 'club', id: club.id })));
      lbl.position.set(0, 3.0, 0);
      slot.add(lbl);
      const alert = new CSS2DObject(pill('新動態', 'alert-pill', () => api.onSelect?.({ type: 'club', id: club.id })));
      alert.position.set(0, 4.5, 0);
      alert.visible = false;
      slot.add(alert);

      clubSlots[club.id] = { slot, ring, prop, label: lbl, alert, cat: cat.id, angle: a, islandId: cat.id };
      // 攤位前的社員
      for (let k = 0; k < 2; k++) {
        const off = new THREE.Vector3(k ? 0.75 : -0.75, 0, 1.55).applyAxisAngle(UP, slot.rotation.y);
        figures.push({ kind: 'club', club: club.id, pos: new THREE.Vector3(x, 0, z).add(off).add(center), face: slot.rotation.y + Math.PI, phase: Math.random() * TAU });
      }
    });

    scatter(root, rand, R, Math.round(R * 1.4), avoid, statics);
    mergeStatic(root, statics);
    root.userData.pick = { type: 'island', id: cat.id };
    scene.add(root);
    pickRoots.push(root);

    const lbl = new CSS2DObject(pill(`<i style="--c:${cat.color}"></i><b>${cat.island}</b><small>${cat.name}・${list.length} 社</small>`, 'island-pill', () => api.onSelect?.({ type: 'island', id: cat.id })));
    lbl.position.set(0, 7.2, 0);
    root.add(lbl);
    labelEls.push({ el: lbl.element, kind: 'island', id: cat.id });
    islands[cat.id] = { root, center, radius: R, facing, label: lbl, landmark: lm };

    // 吊橋
    buildBridge(
      new THREE.Vector3(Math.cos(ang) * (HUB_R - 0.4), 0.05, Math.sin(ang) * (HUB_R - 0.4)),
      new THREE.Vector3(center.x + Math.cos(facing) * (R - 0.4), center.y + 0.05, center.z + Math.sin(facing) * (R - 0.4)),
      ci,
    );
  });

  function buildBridge(a, b, idx) {
    const len = a.distanceTo(b);
    const sag = 1.1 + len * 0.04;
    const curve = new THREE.CatmullRomCurve3(Array.from({ length: 9 }, (_, i) => {
      const t = i / 8;
      return new THREE.Vector3().lerpVectors(a, b, t).add(new THREE.Vector3(0, -sag * 4 * t * (1 - t), 0));
    }));
    const n = Math.floor(len / 0.52);
    const planks = new THREE.InstancedMesh(G.box(1.7, 0.1, 0.4), mat(P.woodLight), n);
    planks.castShadow = planks.receiveShadow = true;
    const T = new THREE.Vector3(), X = new THREE.Vector3(), Y = new THREE.Vector3(), M = new THREE.Matrix4();
    const pr = rng(idx + 50);
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n;
      curve.getTangentAt(t, T);
      X.crossVectors(UP, T).normalize();
      Y.crossVectors(T, X);
      M.makeBasis(X, Y, T).setPosition(curve.getPointAt(t));
      M.multiply(new THREE.Matrix4().makeRotationY((pr() - 0.5) * 0.08));
      planks.setMatrixAt(i, M);
      planks.setColorAt(i, new THREE.Color(pr() > 0.5 ? P.woodLight : '#c99566'));
    }
    scene.add(planks);
    const side = (sgn, h) => new THREE.CatmullRomCurve3(curve.getPoints(24).map((p, i, arr) => {
      const t = i / (arr.length - 1);
      curve.getTangentAt(Math.min(Math.max(t, 0.001), 0.999), T);
      X.crossVectors(UP, T).normalize();
      return p.clone().addScaledVector(X, sgn * 0.85).add(new THREE.Vector3(0, h + Math.sin(t * Math.PI) * 0.25, 0));
    }));
    const parts = [];
    const add = o => { scene.add(o); parts.push(o); };
    for (const sgn of [-1, 1]) {
      add(m(new THREE.TubeGeometry(side(sgn, 0.85), 40, 0.04, 4), '#8a6a4a'));
      for (let k = 0; k <= 6; k++) {
        const t = k / 6;
        const p = curve.getPointAt(t);
        curve.getTangentAt(Math.min(Math.max(t, 0.001), 0.999), T);
        X.crossVectors(UP, T).normalize();
        const h = k === 0 || k === 6 ? 1.3 : 0.95;
        add(m(G.cyl(0.06, 0.07, h, 5), P.woodDark, [p.x + X.x * sgn * 0.85, p.y + h / 2 - 0.05, p.z + X.z * sgn * 0.85]));
      }
    }
    mergeStatic(scene, parts);
    // 走在橋上的人
    for (let k = 0; k < 2; k++) figures.push({ kind: 'bridge', curve, phase: Math.random(), speed: 0.025 + Math.random() * 0.02, lane: k ? 0.35 : -0.35 });
  }

  /* ---------- 熱氣球、飛船、飛鳥 ---------- */
  const flyers = [];
  function balloon(colors, seed) {
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      const r = Math.sin(t * Math.PI) * (t < 0.5 ? 1.0 : 1.0 - (t - 0.5) * 0.35) * 2.2 + (t > 0.9 ? 0 : 0);
      pts.push(new THREE.Vector2(Math.max(r, t < 0.1 ? 0.5 : 0.02), t * 5.2 - 1));
    }
    pts[0].x = 0.5;
    const geo = new THREE.LatheGeometry(pts, 12).toNonIndexed();
    const pos = geo.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i += 3) {
      const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3, cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
      const sector = Math.floor((Math.atan2(cz, cx) + Math.PI) / TAU * 12);
      c.set(colors[sector % colors.length]);
      for (let k = 0; k < 3; k++) col.set([c.r, c.g, c.b], (i + k) * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.computeVertexNormals();
    const env = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.8 }));
    env.castShadow = true;
    const g = group(env,
      m(G.box(0.9, 0.7, 0.9), P.wood, [0, -2.4, 0]),
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => m(G.cyl(0.02, 0.02, 1.5, 3), '#6b5a4e', [x * 0.4, -1.6, z * 0.4])),
    );
    const r = rng(seed);
    flyers.push({ obj: g, r: 42 + r() * 22, y: 10 + r() * 12, speed: 0.025 + r() * 0.02, phase: r() * TAU, bobA: 0.8, yaw: 0 });
    scene.add(g);
  }
  balloon(['#e8794a', '#fff4de'], 1);
  balloon(['#9b7fd1', '#ffd166'], 2);
  balloon(['#3fae98', '#fff4de', '#f05a6b'], 3);
  balloon(['#4f8fd6', '#ffffff'], 4);

  {
    const ship = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(1.6, 6, 6, 14), mat('#fff4de'));
    body.rotation.z = Math.PI / 2;
    body.castShadow = true;
    ship.add(body);
    CATEGORIES.forEach((cat, i) => ship.add(m(G.cyl(1.63, 1.63, 0.35, 14), cat.color, [-2.6 + i * 1.05, 0, 0], [0, 0, Math.PI / 2])));
    ship.add(m(G.box(2.4, 0.7, 0.9), P.wood, [0, -2.0, 0]));
    ship.add(m(G.box(2.0, 0.3, 0.92), glow2('#ffe39a'), [0, -1.9, 0]));
    [[0, 1.4, 0], [0, -1.4, 0], [0, 0, 1.4], [0, 0, -1.4]].forEach(([_, y, z]) => ship.add(m(G.box(1.4, y ? 1.3 : 0.12, z ? 1.3 : 0.12), '#e39b2d', [-4.3, y * 0.6, z * 0.6])));
    const prop = m(G.box(0.1, 2.0, 0.25), '#6b5a4e', [-5.0, 0, 0]);
    animators.push((t, dt) => { prop.rotation.x += dt * 14; });
    ship.add(prop);
    const tex = textTexture('南大附中社團群島', { w: 1024, h: 160, bg: '#c0602a', fg: '#fffaf2', size: 96 });
    // 兩面各一張，避免背面文字左右顛倒
    for (const side of [0, Math.PI]) {
      const banner = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 0.8), new THREE.MeshStandardMaterial({ map: tex }));
      banner.position.set(0.3, -3.1, side ? -0.01 : 0.01);
      banner.rotation.y = side;
      ship.add(banner);
    }
    ship.add(m(G.cyl(0.01, 0.01, 0.8, 3), '#555', [-2.2, -2.6, 0]), m(G.cyl(0.01, 0.01, 0.8, 3), '#555', [2.8, -2.6, 0]));
    scene.add(ship);
    flyers.push({ obj: ship, r: 64, y: 24, speed: 0.018, phase: 1.5, bobA: 0.5, yaw: -Math.PI / 2 });
  }
  function glow2(c) { const mm = mat(c, { emissive: c, emissiveIntensity: 0 }); glowMats.push(mm); return mm; }

  const birds = [];
  for (let f = 0; f < 3; f++) {
    const flock = new THREE.Group();
    for (let i = 0; i < 5; i++) {
      const bird = new THREE.Group();
      const wl = m(G.box(0.7, 0.04, 0.3), '#fffaf2', [-0.35, 0, 0]);
      const wr = m(G.box(0.7, 0.04, 0.3), '#fffaf2', [0.35, 0, 0]);
      const pl = new THREE.Group(); pl.add(wl);
      const prr = new THREE.Group(); prr.add(wr);
      bird.add(pl, prr, m(G.box(0.15, 0.12, 0.5), '#fffaf2', [0, 0, 0]));
      bird.position.set((i - 2) * 0.9, Math.abs(i - 2) * -0.1, Math.abs(i - 2) * 0.8);
      bird.userData = { pl, prr, ph: Math.random() * TAU };
      flock.add(bird);
      birds.push(bird);
    }
    scene.add(flock);
    flyers.push({ obj: flock, r: 30 + f * 18, y: 14 + f * 5, speed: 0.08 + f * 0.02, phase: f * 2, bobA: 1.2, yaw: Math.PI });
  }

  /* ---------- 小人（實例化） ---------- */
  const SHIRTS = ['#e8794a', '#4f8fd6', '#3fae98', '#f05a6b', '#ffd166', '#9b7fd1', '#fffaf2', '#5a6b8c'];
  const SKIN = ['#f5d0b0', '#e8b896', '#d9a27e'];
  const bodyMesh = new THREE.InstancedMesh(new THREE.CapsuleGeometry(0.17, 0.32, 3, 8), new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.9 }), figures.length);
  const headMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(0.15, 8, 6), new THREE.MeshStandardMaterial({ flatShading: true, roughness: 0.9 }), figures.length);
  bodyMesh.castShadow = headMesh.castShadow = true;
  figures.forEach((f, i) => {
    bodyMesh.setColorAt(i, new THREE.Color(SHIRTS[i % SHIRTS.length]));
    headMesh.setColorAt(i, new THREE.Color(SKIN[i % SKIN.length]));
  });
  scene.add(bodyMesh, headMesh);

  /* ---------- 合併不會動的模型零件 ---------- */
  // 讓所有動畫在兩個不同時間各跑一次，世界矩陣沒變的網格就是靜態的
  {
    const byRoot = new Map();
    const add = (root, sub) => { if (!byRoot.has(root)) byRoot.set(root, []); byRoot.get(root).push(sub); };
    for (const s of Object.values(clubSlots)) add(islands[s.cat].root, s.prop);
    for (const cat of CATEGORIES) add(islands[cat.id].root, islands[cat.id].landmark);
    const meshes = [];
    for (const subs of byRoot.values()) subs.forEach(sub => sub.traverse(o => { if (o.isMesh) meshes.push(o); }));
    const run = (tt, dt) => { animators.forEach(fn => fn(tt, dt)); scene.updateMatrixWorld(true); };
    run(0.7, 0.016);
    const before = meshes.map(o => o.matrixWorld.clone());
    run(2.3, 0.5);
    const moved = new Set(meshes.filter((o, i) => !o.matrixWorld.equals(before[i])));
    for (const [root, subs] of byRoot) {
      const still = [];
      subs.forEach(sub => sub.traverse(o => { if (o.isMesh && !moved.has(o)) still.push(o); }));
      mergeStatic(root, still);
    }
  }

  /* ---------- 雨 ---------- */
  const RAIN_N = isMobile ? 900 : 1800;
  const rainPos = new Float32Array(RAIN_N * 6);
  const rainGeo = new THREE.BufferGeometry();
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
  for (let i = 0; i < RAIN_N; i++) {
    const x = (Math.random() - 0.5) * 140, y = Math.random() * 70 - 25, z = (Math.random() - 0.5) * 140;
    rainPos.set([x, y, z, x + 0.15, y - 1.2, z], i * 6);
  }
  const rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({ color: '#cfe4f2', transparent: true, opacity: 0.55 }));
  rain.visible = false;
  rain.frustumCulled = false;
  scene.add(rain);

  /* ---------- 狀態 ---------- */
  const state = {
    timeMode: 'auto', manualHour: 12, hour: 12, paused: matchMedia('(prefers-reduced-motion: reduce)').matches,
    labels: true, live: false, focusCat: null, hover: null, alerts: new Set(), night: 0, weather: 'clear',
    inset: { right: 0, bottom: 0, top: 0 },
  };

  /* ---------- 相機飛行 ---------- */
  let flight = null;
  controls.addEventListener('start', () => { flight = null; });
  function flyTo(pos, target, dur = 1.6) {
    flight = { p0: camera.position.clone(), t0: controls.target.clone(), p1: pos, t1: target, start: performance.now(), dur: dur * 1000 };
  }
  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function framed(target, dir, dist) {
    const pos = target.clone().addScaledVector(dir.normalize(), dist);
    // 讓出側邊面板／底部抽屜的空間
    const upp = 2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / innerHeight;
    const fwd = target.clone().sub(pos).normalize();
    const right = new THREE.Vector3().crossVectors(fwd, UP).normalize();
    const camUp = new THREE.Vector3().crossVectors(right, fwd).normalize();
    const shift = right.multiplyScalar(state.inset.right / 2 * upp).add(camUp.multiplyScalar(-(state.inset.bottom - state.inset.top) / 2 * upp));
    return { pos: pos.add(shift), target: target.clone().add(shift) };
  }

  function overviewDist(base) {
    const aspect = innerWidth / innerHeight;
    return base / Math.min(1, aspect / 1.0);
  }

  const api = {
    scene, camera, controls, renderer,
    onSelect: null, onHover: null,
    islands, clubSlots,
    overview(mode = 'angle', dur = 1.8) {
      state.focusCat = null;
      const d = overviewDist(mode === 'top' ? 118 : 100);
      const dir = mode === 'top' ? new THREE.Vector3(0, 1, 0.02) : new THREE.Vector3(0, 0.62, 0.78);
      const f = framed(new THREE.Vector3(0, -2, mode === 'top' ? 2 : 4), dir, d);
      flyTo(f.pos, f.target, dur);
    },
    focusIsland(id, dur = 1.6) {
      const isl = islands[id];
      if (!isl) return;
      state.focusCat = id === 'hub' ? null : id;
      const out = new THREE.Vector3(isl.center.x, 0, isl.center.z).normalize();
      const dir = id === 'hub' ? new THREE.Vector3(0, 0.75, 0.66) : out.clone().multiplyScalar(-0.62).add(new THREE.Vector3(0, 0.78, 0)).add(new THREE.Vector3(-out.z, 0, out.x).multiplyScalar(0.18));
      const f = framed(isl.center.clone().add(new THREE.Vector3(0, 0.8, 0)), dir, isl.radius * (id === 'hub' ? 3.9 : 3.0) + 8);
      flyTo(f.pos, f.target, dur);
    },
    focusClub(id, dur = 1.6) {
      const s = clubSlots[id];
      if (!s) return;
      state.focusCat = s.cat;
      const wp = s.slot.getWorldPosition(new THREE.Vector3());
      const isl = islands[s.cat];
      const out = wp.clone().sub(isl.center).setY(0).normalize();
      const dir = out.multiplyScalar(0.72).add(new THREE.Vector3(0, 0.62, 0));
      const f = framed(wp.add(new THREE.Vector3(0, 1.0, 0)), dir, isMobile ? 21 : 15);
      flyTo(f.pos, f.target, dur);
    },
    setInset(right, bottom, top = 0) { Object.assign(state.inset, { right, bottom, top }); },
    setTimeMode(mode) {
      state.timeMode = mode;
      state.manualHour = { day: 12, dusk: 17.5, night: 21.5 }[mode] ?? state.manualHour;
    },
    get timeMode() { return state.timeMode; },
    get hour() { return state.hour; },
    setPaused(p) { state.paused = p; },
    get paused() { return state.paused; },
    setLabels(on) { state.labels = on; document.body.classList.toggle('no-labels', !on); },
    setTilt(on) { tiltOn = on; },
    get tilt() { return tiltOn; },
    setLive(on) { state.live = on; },
    setWeather(kind) { state.weather = kind; rain.visible = kind === 'rain'; },
    setAlerts(ids) {
      state.alerts = new Set(ids);
      for (const [id, s] of Object.entries(clubSlots)) s.alert.visible = state.alerts.has(id);
    },
    highlightClub(id) {
      for (const [cid, s] of Object.entries(clubSlots)) s.label.element.classList.toggle('picked', cid === id);
    },
  };

  /* ---------- 點選與滑過 ---------- */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let downAt = null;
  function pickAt(x, y) {
    ndc.set(x / innerWidth * 2 - 1, -(y / innerHeight) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(pickRoots, true)[0];
    let o = hit?.object;
    while (o && !o.userData.pick) o = o.parent;
    return o?.userData.pick || null;
  }
  renderer.domElement.addEventListener('pointerdown', e => { downAt = [e.clientX, e.clientY]; });
  renderer.domElement.addEventListener('pointerup', e => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return;
    const p = pickAt(e.clientX, e.clientY);
    if (p) api.onSelect?.(p);
  });
  let hoverQueued = null;
  renderer.domElement.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    hoverQueued = [e.clientX, e.clientY];
  });
  function updateHover() {
    if (!hoverQueued) return;
    const p = pickAt(...hoverQueued);
    hoverQueued = null;
    const key = p ? `${p.type}:${p.id ?? ''}` : null;
    if (key === state.hover) return;
    state.hover = key;
    renderer.domElement.style.cursor = p ? 'pointer' : '';
    for (const l of labelEls) if (l.id) l.el.classList.toggle('hover', p?.type === 'island' && p.id === l.id || p?.type === 'club' && clubSlots[p.id]?.cat === l.id);
    for (const [id, s] of Object.entries(clubSlots)) {
      const on = p?.type === 'club' && p.id === id;
      s.label.element.classList.toggle('peek', on);
      s.hover = on;
    }
    api.onHover?.(p);
  }

  /* ---------- 時間與光線 ---------- */
  const sunDir = new THREE.Vector3();
  function taipeiHour() {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Taipei', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date());
    const h = +parts.find(p => p.type === 'hour').value, mi = +parts.find(p => p.type === 'minute').value;
    return h + mi / 60;
  }
  let shownHour = taipeiHour();
  function applyTime(dt) {
    const target = state.timeMode === 'auto' ? taipeiHour() : state.manualHour;
    // 平滑過渡（取最短方向）
    let diff = target - shownHour;
    if (diff > 12) diff -= 24; if (diff < -12) diff += 24;
    shownHour = (shownHour + diff * Math.min(1, dt * 2.5) + 24) % 24;
    state.hour = shownHour;
    const p = paletteAt(shownHour);
    skyMat.uniforms.top.value.setHex(p.top);
    skyMat.uniforms.bottom.value.setHex(p.bottom);
    scene.fog.color.setHex(p.fog);
    let rainy = state.weather === 'rain' ? 0.35 : state.weather === 'cloudy' ? 0.15 : 0;
    if (rainy) { skyMat.uniforms.top.value.lerp(tmpA.set('#9aa6b2'), rainy); skyMat.uniforms.bottom.value.lerp(tmpA.set('#c9cfd4'), rainy); scene.fog.color.lerp(tmpA.set('#c2c9cf'), rainy); }
    sun.color.setHex(p.sun);
    sun.intensity = p.sunI * (1 - rainy * 0.8);
    hemi.color.setHex(p.hemiS); hemi.groundColor.setHex(p.hemiG); hemi.intensity = p.hemiI;
    cloudMat.color.setHex(p.cloud);
    cloudMat.emissive.setHex(p.cloud).multiplyScalar(0.28);
    starMat.opacity = p.stars * (1 - rainy * 2);
    moon.material.opacity = p.stars;
    state.night = p.lights / 1.4;
    for (const gm of glowMats) if (!gm.userData.always) gm.emissiveIntensity = p.lights;
    // 太陽／月亮方向
    const isDay = shownHour >= 5.5 && shownHour < 18.5;
    const k = isDay ? (shownHour - 5.5) / 13 : ((shownHour + 24 - 18.5) % 24) / 11;
    const az = -Math.PI * 0.15 + k * Math.PI * 0.9;
    const el = 0.35 + Math.sin(k * Math.PI) * 0.75;
    sunDir.set(Math.cos(az) * Math.cos(el), Math.sin(el), Math.sin(az) * Math.cos(el) * 0.6 + 0.5).normalize();
    sun.position.copy(sunDir).multiplyScalar(110);
    skyMat.uniforms.sunDir.value.copy(isDay ? sunDir : new THREE.Vector3(0, -1, 0));
    skyMat.uniforms.sunCol.value.setHex(p.sun);
    skyMat.uniforms.sunAmt.value = isDay ? 1 - rainy * 2 : 0;
    moon.position.copy(sunDir).multiplyScalar(isDay ? -700 : 700);
    renderer.toneMappingExposure = 1.0 + state.night * 0.15;
  }

  /* ---------- 主迴圈 ---------- */
  let last = performance.now();
  let t = 0;
  const Mtx = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), V = new THREE.Vector3(), V2 = new THREE.Vector3();
  const camWorld = new THREE.Vector3();

  function updateFigures(dt) {
    const show = 1 - THREE.MathUtils.smoothstep(state.night, 0.75, 0.95);
    figures.forEach((f, i) => {
      let x, y, z, face;
      if (f.kind === 'club') {
        const live = state.live;
        const jump = live ? Math.max(0, Math.sin(t * 6 + f.phase)) * 0.3 : Math.sin(t * 1.5 + f.phase) * 0.02;
        ({ x, y, z } = f.pos); y += jump; face = f.face + (live ? Math.sin(t * 3 + f.phase) * 0.4 : 0);
      } else if (f.kind === 'wander') {
        const a = f.phase + t * f.speed * f.dir;
        x = f.center.x + Math.cos(a) * f.r; z = f.center.z + Math.sin(a) * f.r; y = Math.abs(Math.sin(t * 8 + f.phase)) * 0.05;
        face = -a + (f.dir > 0 ? 0 : Math.PI);
      } else {
        const u = (f.phase + t * f.speed) % 2;
        const s = u < 1 ? u : 2 - u;
        f.curve.getPointAt(Math.min(Math.max(s, 0.02), 0.98), V);
        f.curve.getTangentAt(Math.min(Math.max(s, 0.02), 0.98), V2);
        V.addScaledVector(V2.clone().cross(UP).normalize(), f.lane);
        ({ x, y, z } = V); y += 0.06 + Math.abs(Math.sin(t * 8 + f.phase * 10)) * 0.05;
        face = Math.atan2(V2.x, V2.z) + (u < 1 ? 0 : Math.PI);
      }
      Q.setFromAxisAngle(UP, face);
      S.setScalar(show);
      Mtx.compose(V.set(x, y + 0.33 * show, z), Q, S);
      bodyMesh.setMatrixAt(i, Mtx);
      Mtx.compose(V.set(x, y + 0.78 * show, z), Q, S);
      headMesh.setMatrixAt(i, Mtx);
    });
    bodyMesh.instanceMatrix.needsUpdate = headMesh.instanceMatrix.needsUpdate = true;
  }

  function updateLabels() {
    camera.getWorldPosition(camWorld);
    const dist = camWorld.distanceTo(controls.target);
    for (const [, s] of Object.entries(clubSlots)) {
      const near = state.focusCat === s.cat || dist < 34 && s.slot.getWorldPosition(V).distanceTo(controls.target) < 16;
      s.label.element.classList.toggle('show', near);
    }
    for (const l of labelEls) l.el.classList.toggle('far', dist > 150);
    // 霧的範圍跟著鏡頭距離走，遠景時島嶼才不會被霧吃掉
    scene.fog.near = Math.max(110, dist + 10);
    scene.fog.far = scene.fog.near + 250;
  }

  function frame() {
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!state.paused) t += dt;
    const adt = state.paused ? 0 : dt;

    if (flight) {
      const k = Math.min(1, (performance.now() - flight.start) / flight.dur);
      const e = ease(k);
      camera.position.lerpVectors(flight.p0, flight.p1, e);
      camera.position.y += Math.sin(k * Math.PI) * flight.p0.distanceTo(flight.p1) * 0.12;
      controls.target.lerpVectors(flight.t0, flight.t1, e);
      if (k >= 1) flight = null;
    }
    controls.update();
    updateHover();
    applyTime(dt);

    if (!state.paused) {
      for (const fn of animators) fn(t, adt);
      cloudSea.rotation.y += adt * 0.006;
      for (const c of driftClouds) {
        c.position.x += adt * c.userData.speed;
        if (c.position.x > 90) c.position.x = -90;
      }
      floatersAll.forEach((f, i) => { f.position.y += Math.sin(t * 0.8 + i) * adt * 0.15; f.rotation.y += adt * 0.1; });
      for (const w of fallsAll) { w.tex.offset.y += adt * 0.9; w.mist.scale.setScalar(1 + Math.sin(t * 3) * 0.1); }
      for (const f of flyers) {
        const a = f.phase + t * f.speed;
        f.obj.position.set(Math.cos(a) * f.r, f.y + Math.sin(t * 0.5 + f.phase) * f.bobA, Math.sin(a) * f.r);
        f.obj.rotation.y = -a + f.yaw;
      }
      for (const b of birds) {
        const w = Math.sin(t * 9 + b.userData.ph) * 0.6;
        b.userData.pl.rotation.z = w; b.userData.prr.rotation.z = -w;
      }
      if (rain.visible) {
        rain.position.copy(controls.target);
        rain.position.y = 0;
        for (let i = 0; i < RAIN_N; i++) {
          let y = rainPos[i * 6 + 1] - adt * 38;
          if (y < -25) y += 70;
          rainPos[i * 6 + 1] = y; rainPos[i * 6 + 4] = y - 1.2;
        }
        rainGeo.attributes.position.needsUpdate = true;
      }
    }
    // 社課進行中：攤位光圈脈動
    for (const s of Object.values(clubSlots)) {
      const on = state.live || state.alerts.has(s.slot.userData.pick.id);
      s.ring.material.opacity = s.hover ? 0.75 : on ? 0.35 + 0.3 * Math.sin(t * 3) : 0;
    }
    sun.target.position.set(controls.target.x * 0.3, 0, controls.target.z * 0.3);
    sun.position.add(sun.target.position);
    updateFigures(dt);
    updateLabels();

    if (tiltOn) composer.render(); else renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    requestAnimationFrame(frame);
  }

  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
    composer.setSize(innerWidth, innerHeight);
    labelRenderer.setSize(innerWidth, innerHeight);
    setTiltSize();
  });

  // 起始鏡頭：從高空俯衝進入
  camera.position.set(0, 150, 160);
  controls.target.set(0, 0, 0);
  api.start = () => requestAnimationFrame(frame);
  api.isMobile = isMobile;
  return api;
}
