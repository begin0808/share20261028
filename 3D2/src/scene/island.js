import * as THREE from 'three';
import { G, m, mat, jitter, rng, hashNoise } from './kit.js';
import { tree, rock, flowerPatch } from './props.js';

const TAU = Math.PI * 2;

// 島底岩層的分層配色（由上而下）
const STRATA = ['#c99a6b', '#b8855a', '#a5744d', '#8f6444', '#7a573d'];

function vertexColorsByHeight(geo, top, bottom, colors, seed) {
  const p = geo.attributes.position;
  const col = new Float32Array(p.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < p.count; i++) {
    const y = p.getY(i);
    const t = THREE.MathUtils.clamp((top - y) / (top - bottom), 0, 0.999);
    const n = hashNoise(Math.round(p.getX(i) * 10), Math.round(y * 10), Math.round(p.getZ(i) * 10), seed);
    c.set(colors[Math.floor(t * colors.length)]);
    c.offsetHSL(0, 0, (n - 0.5) * 0.06);
    col.set([c.r, c.g, c.b], i * 3);
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
}

// 草地頂面：微微起伏、帶色差的手作感
function grassTop(radius, grass, seed) {
  const geo = new THREE.CylinderGeometry(radius, radius * 0.985, 0.7, 12, 1);
  jitter(geo, radius * 0.06, seed, (x, y, z) => Math.hypot(x, z) > radius * 0.5);
  const geo2 = geo.toNonIndexed();
  const p = geo2.attributes.position;
  const col = new Float32Array(p.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < p.count; i += 3) {
    const n = hashNoise(Math.round(p.getX(i) * 3), i % 7, Math.round(p.getZ(i) * 3), seed);
    const side = Math.abs(p.getY(i) - p.getY(i + 1)) > 0.2 || Math.abs(p.getY(i) - p.getY(i + 2)) > 0.2;
    c.set(side ? '#7fb85a' : grass).offsetHSL((n - 0.5) * 0.02, 0, (n - 0.5) * 0.07);
    for (let k = 0; k < 3; k++) col.set([c.r, c.g, c.b], (i + k) * 3);
  }
  geo2.setAttribute('color', new THREE.BufferAttribute(col, 3));
  geo2.computeVertexNormals();
  return geo2;
}

export function buildIsland({ radius, grass = '#a5d36f', seed = 1, waterfall = false, trees = 10, path = true }) {
  const rand = rng(seed * 9973);
  const root = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 });

  // 草地
  const top = new THREE.Mesh(grassTop(radius, grass, seed), bodyMat);
  top.position.y = -0.35;
  top.receiveShadow = true;
  root.add(top);

  // 土層
  const soilGeo = new THREE.CylinderGeometry(radius * 0.985, radius * 0.93, 1.3, 12, 2);
  jitter(soilGeo, radius * 0.05, seed + 3);
  vertexColorsByHeight(soilGeo, 0.65, -0.65, ['#a8774f', '#97683f'], seed);
  const soil = new THREE.Mesh(soilGeo, bodyMat);
  soil.position.y = -1.35;
  soil.castShadow = soil.receiveShadow = true;
  root.add(soil);

  // 倒錐形岩石底部
  const depth = radius * 1.35;
  const coneGeo = new THREE.ConeGeometry(radius * 0.94, depth, 12, 6);
  coneGeo.rotateX(Math.PI);
  jitter(coneGeo, radius * 0.22, seed + 7, (x, y) => y < depth / 2 - 0.01);
  vertexColorsByHeight(coneGeo, depth / 2, -depth / 2, STRATA, seed);
  const cone = new THREE.Mesh(coneGeo, bodyMat);
  cone.position.y = -2.0 - depth / 2;
  cone.castShadow = true;
  root.add(cone);

  // 垂下的藤蔓
  const statics = [];
  const keep = o => { root.add(o); statics.push(o); };
  for (let i = 0; i < Math.round(radius * 1.2); i++) {
    const a = rand() * TAU, r = radius * (0.85 + rand() * 0.08);
    const len = 0.8 + rand() * 2.2;
    keep(m(G.cyl(0.05, 0.02, len, 4), rand() > 0.5 ? '#5fa84a' : '#6fb352', [Math.cos(a) * r, -1.9 - len / 2, Math.sin(a) * r]));
    if (rand() > 0.5) keep(m(G.ball(0.12, 0), '#f6b5c8', [Math.cos(a) * r, -1.9 - len, Math.sin(a) * r]));
  }

  // 底下漂浮的小石塊
  const floaters = [];
  for (let i = 0; i < 3; i++) {
    const a = rand() * TAU, r = radius * (0.6 + rand() * 0.6);
    const g = new THREE.Mesh(jitter(new THREE.IcosahedronGeometry(0.5 + rand() * 0.6, 0), 0.3, seed + i), mat(STRATA[2 + (i % 2)]));
    g.position.set(Math.cos(a) * r, -depth * (0.4 + rand() * 0.4), Math.sin(a) * r);
    g.castShadow = true;
    const cap = m(G.cyl(0.45, 0.4, 0.15, 6), grass, [0, 0.45, 0], [0, 0, 0], 0.9);
    g.add(cap);
    root.add(g);
    floaters.push(g);
  }

  // 瀑布
  const falls = [];
  if (waterfall !== false) falls.push(makeWaterfall(root, radius, waterfall, depth));

  return { root, rand, floaters, falls, depth, statics };
}

// 在島上隨機撒樹、石頭、花（避開社團攤位與地標）
export function scatter(root, rand, radius, count, avoid, out = []) {
  let placed = 0, tries = 0;
  while (placed < count && tries < count * 30) {
    tries++;
    const a = rand() * TAU, r = Math.sqrt(rand()) * (radius - 0.6);
    const x = Math.cos(a) * r, z = Math.sin(a) * r;
    if (avoid.some(([ax, az, ar]) => Math.hypot(x - ax, z - az) < ar)) continue;
    const k = rand();
    const obj = k < 0.55 ? tree(rand, 0.9) : k < 0.8 ? flowerPatch(rand) : rock(rand, 0.8 + rand());
    obj.position.set(x, 0, z);
    root.add(obj);
    out.push(obj);
    avoid.push([x, z, k < 0.55 ? 0.9 : 0.5]);
    placed++;
  }
  return out;
}

const waterTex = (() => {
  let tex;
  return () => {
    if (tex) return tex;
    const cv = document.createElement('canvas');
    cv.width = 64; cv.height = 256;
    const ctx = cv.getContext('2d');
    ctx.fillStyle = '#9fdcf2'; ctx.fillRect(0, 0, 64, 256);
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.3 + Math.random() * 0.5})`;
      ctx.fillRect(Math.random() * 64, Math.random() * 256, 2 + Math.random() * 4, 20 + Math.random() * 50);
    }
    tex = new THREE.CanvasTexture(cv);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  };
})();

function makeWaterfall(root, radius, angle, depth) {
  const tex = waterTex().clone();
  tex.needsUpdate = true;
  tex.repeat.set(1, 3);
  const len = depth + 14;
  const mtl = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false });
  const fall = new THREE.Mesh(new THREE.PlaneGeometry(1.1, len), mtl);
  const r = radius + 0.05;
  fall.position.set(Math.cos(angle) * r, -len / 2 + 0.05, Math.sin(angle) * r);
  fall.lookAt(Math.cos(angle) * (r + 5), fall.position.y, Math.sin(angle) * (r + 5));
  root.add(fall);
  // 小溪
  const stream = m(G.box(0.9, 0.06, 2.4), mat('#8fd3ee', { roughness: 0.25 }), [Math.cos(angle) * (radius - 1.1), 0.02, Math.sin(angle) * (radius - 1.1)]);
  stream.rotation.y = -angle + Math.PI / 2;
  stream.castShadow = false;
  root.add(stream);
  const pond = m(G.cyl(0.9, 0.9, 0.05, 10), mat('#8fd3ee', { roughness: 0.25 }), [Math.cos(angle) * (radius - 2.4), 0.03, Math.sin(angle) * (radius - 2.4)]);
  pond.castShadow = false;
  root.add(pond);
  // 底部水霧
  const mist = new THREE.Mesh(G.ball(1.2, 1), new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.6, flatShading: true }));
  mist.position.set(fall.position.x, -len + 0.4, fall.position.z);
  root.add(mist);
  return { tex, mist, avoid: [Math.cos(angle) * (radius - 1.6), Math.sin(angle) * (radius - 1.6), 1.8] };
}
