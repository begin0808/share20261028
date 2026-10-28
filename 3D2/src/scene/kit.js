import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// 共用材質快取：同色共用一個材質，減少 GPU 負擔
const matCache = new Map();
export function mat(color, opts = {}) {
  const key = color + JSON.stringify(opts);
  if (!matCache.has(key)) {
    matCache.set(key, new THREE.MeshStandardMaterial({
      color, flatShading: true, roughness: 0.92, metalness: 0, ...opts,
    }));
  }
  return matCache.get(key);
}

// 夜晚會亮起的窗戶、燈籠：統一控制 emissiveIntensity
export const glowMats = [];
export function glow(color, base = '#3a2a1a') {
  const m = new THREE.MeshStandardMaterial({
    color: base, emissive: color, emissiveIntensity: 0, flatShading: true, roughness: 0.6,
  });
  glowMats.push(m);
  return m;
}

const geoCache = new Map();
function cached(key, make) {
  if (!geoCache.has(key)) geoCache.set(key, make());
  return geoCache.get(key);
}

export const G = {
  box: (w = 1, h = 1, d = 1) => cached(`b${w},${h},${d}`, () => new THREE.BoxGeometry(w, h, d)),
  cyl: (rt = 0.5, rb = 0.5, h = 1, s = 8) => cached(`c${rt},${rb},${h},${s}`, () => new THREE.CylinderGeometry(rt, rb, h, s)),
  cone: (r = 0.5, h = 1, s = 8) => cached(`k${r},${h},${s}`, () => new THREE.ConeGeometry(r, h, s)),
  ball: (r = 0.5, d = 1) => cached(`s${r},${d}`, () => new THREE.IcosahedronGeometry(r, d)),
  sphere: (r = 0.5, w = 12, h = 8) => cached(`p${r},${w},${h}`, () => new THREE.SphereGeometry(r, w, h)),
  torus: (r = 0.5, t = 0.1, rs = 6, ts = 12, arc = Math.PI * 2) =>
    cached(`t${r},${t},${rs},${ts},${arc}`, () => new THREE.TorusGeometry(r, t, rs, ts, arc)),
};

// m(幾何, 顏色或材質, [x,y,z], [rx,ry,rz], 縮放)
export function m(geo, color, pos = [0, 0, 0], rot = [0, 0, 0], scale = 1) {
  const mesh = new THREE.Mesh(geo, typeof color === 'string' ? mat(color) : color);
  mesh.position.set(...pos);
  mesh.rotation.set(...rot);
  if (Array.isArray(scale)) mesh.scale.set(...scale);
  else mesh.scale.setScalar(scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function group(...children) {
  const g = new THREE.Group();
  children.flat().forEach(ch => ch && g.add(ch));
  return g;
}

// 把不會動的裝飾依材質合併成少數幾個網格，大幅減少繪製次數
export function mergeStatic(parent, objects) {
  parent.updateMatrixWorld(true);
  const inv = parent.matrixWorld.clone().invert();
  const buckets = new Map();
  const rel = new THREE.Matrix4();
  for (const obj of objects) {
    obj.updateMatrixWorld(true);
    obj.traverse(o => {
      if (!o.isMesh) return;
      const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry.clone();
      for (const k of Object.keys(g.attributes)) {
        if (k !== 'position' && k !== 'normal' && !(k === 'color' && o.material.vertexColors)) g.deleteAttribute(k);
      }
      g.applyMatrix4(rel.multiplyMatrices(inv, o.matrixWorld));
      if (!buckets.has(o.material)) buckets.set(o.material, []);
      buckets.get(o.material).push(g);
    });
    obj.removeFromParent();
  }
  for (const [material, geos] of buckets) {
    const mesh = new THREE.Mesh(mergeGeometries(geos, false), material);
    mesh.castShadow = mesh.receiveShadow = true;
    parent.add(mesh);
    geos.forEach(g => g.dispose());
  }
}

// 可重現的亂數（同一座島每次長得一樣）
export function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return ((s >>> 0) % 100000) / 100000;
  };
}

// 依座標雜湊的擾動，讓重複頂點移動一致，保持模型密合
export function hashNoise(x, y, z, seed = 0) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719 + seed * 4.123) * 43758.5453;
  return n - Math.floor(n);
}

export function jitter(geo, amount, seed = 0, filter = () => true) {
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (!filter(x, y, z)) continue;
    const kx = Math.round(x * 100) / 100, ky = Math.round(y * 100) / 100, kz = Math.round(z * 100) / 100;
    p.setXYZ(i,
      x + (hashNoise(kx, ky, kz, seed) - 0.5) * amount,
      y + (hashNoise(kz, kx, ky, seed + 1) - 0.5) * amount * 0.6,
      z + (hashNoise(ky, kz, kx, seed + 2) - 0.5) * amount);
  }
  geo.computeVertexNormals();
  return geo;
}

// 畫布貼圖（招牌、旗幟文字）
export function textTexture(text, { w = 512, h = 128, bg = '#fffaf2', fg = '#3b2f2a', font = 900, size = 64, border } = {}) {
  const cv = document.createElement('canvas');
  cv.width = w; cv.height = h;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  if (border) {
    ctx.strokeStyle = border; ctx.lineWidth = 10;
    ctx.strokeRect(8, 8, w - 16, h - 16);
  }
  ctx.fillStyle = fg;
  ctx.font = `${font} ${size}px "Huninn","Noto Sans TC","Microsoft JhengHei",sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h / 2 + 4);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export const PALETTE = {
  wood: '#b07a4f', woodDark: '#8a5a3a', woodLight: '#d6a874',
  stone: '#efe3cc', stoneDark: '#cdbd9f', cream: '#fff4de', white: '#fbf7ef',
  roofRed: '#d0644a', leaf: '#6fb352', leafDark: '#4f9443', leafLight: '#93c95e',
  trunk: '#8a5a3a', dark: '#4a4040', metal: '#b9c2c9', water: '#7cc9e8',
};
