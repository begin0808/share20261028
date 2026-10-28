import * as THREE from 'three';
import { G, m, group, mat, glow, textTexture, PALETTE as P } from './kit.js';

// 每一幀會呼叫的動畫函式 (t 秒, dt 秒)
export const animators = [];
const anim = fn => animators.push(fn);

const TAU = Math.PI * 2;
const bob = (obj, amp = 0.12, speed = 1.6, phase = Math.random() * TAU) => {
  const y0 = obj.position.y;
  anim(t => { obj.position.y = y0 + Math.sin(t * speed + phase) * amp; });
  return obj;
};
const spin = (obj, speed = 0.5, axis = 'y') => {
  anim((t, dt) => { obj.rotation[axis] += dt * speed; });
  return obj;
};

/* ---------- 小零件 ---------- */
const post = (x, z, h, color = P.wood, r = 0.05) => m(G.cyl(r, r, h, 6), color, [x, h / 2, z]);
const ball = (r, color, pos) => m(G.sphere(r, 10, 8), color, pos);
const net = (w, h, y, color = '#f4efe6') => m(G.box(0.03, h, w), mat(color, { transparent: true, opacity: 0.85 }), [0, y, 0]);
function racket(color, pos, rot) {
  return group(
    m(G.torus(0.14, 0.025, 4, 12), color, [0, 0.2, 0]),
    m(G.cyl(0.13, 0.13, 0.01, 12), mat('#f4efe6', { transparent: true, opacity: 0.7 }), [0, 0.2, 0], [Math.PI / 2, 0, 0]),
    m(G.cyl(0.025, 0.025, 0.3, 6), P.woodDark, [0, -0.08, 0]),
  ).translateX(pos[0]).translateY(pos[1]).translateZ(pos[2]).rotateX(rot[0]).rotateZ(rot[2] || 0);
}
function sign(text, color, w = 1.2, h = 0.34) {
  const tex = textTexture(text, { w: 512, h: Math.round(512 * h / w), bg: '#fffaf2', fg: color, size: 150 * h / w * 1.9 });
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
  return face;
}

/* ---------- 樹、花、石頭 ---------- */
export function tree(rand, scale = 1) {
  const kind = rand();
  const leaf = [P.leaf, P.leafDark, P.leafLight, '#7cbf55', '#5fa84a'][Math.floor(rand() * 5)];
  const g = new THREE.Group();
  if (kind < 0.45) {
    g.add(m(G.cyl(0.09, 0.13, 0.7, 5), P.trunk, [0, 0.35, 0]));
    g.add(m(G.ball(0.55, 0), leaf, [0, 1.05, 0]));
    g.add(m(G.ball(0.4, 0), leaf, [0.25, 1.4, 0.1]));
  } else if (kind < 0.8) {
    g.add(m(G.cyl(0.08, 0.12, 0.5, 5), P.trunk, [0, 0.25, 0]));
    g.add(m(G.cone(0.6, 1.0, 6), leaf, [0, 0.95, 0]));
    g.add(m(G.cone(0.45, 0.8, 6), leaf, [0, 1.45, 0]));
  } else {
    // 開花的樹
    const bloom = ['#f6b5c8', '#f9d27a', '#f3a2a2'][Math.floor(rand() * 3)];
    g.add(m(G.cyl(0.08, 0.12, 0.6, 5), P.trunk, [0, 0.3, 0]));
    g.add(m(G.ball(0.5, 0), bloom, [0, 0.95, 0]));
    g.add(m(G.ball(0.32, 0), bloom, [-0.25, 1.25, 0.1]));
  }
  g.scale.setScalar(scale * (0.8 + rand() * 0.5));
  g.rotation.y = rand() * TAU;
  return g;
}

export function flowerPatch(rand) {
  const g = new THREE.Group();
  const cols = ['#f6b5c8', '#fff1a8', '#f7a072', '#c9b6f2', '#ffffff'];
  for (let i = 0; i < 5; i++) {
    const a = rand() * TAU, r = rand() * 0.35;
    g.add(m(G.ball(0.08, 0), cols[Math.floor(rand() * cols.length)], [Math.cos(a) * r, 0.12, Math.sin(a) * r]));
  }
  g.add(m(G.ball(0.22, 0), P.leafDark, [0, 0.05, 0], [0, 0, 0], [1, 0.4, 1]));
  return g;
}

export function rock(rand, s = 1) {
  const r = m(G.ball(0.3 * s, 0), ['#c9bba5', '#b5a68e', '#d8ccb6'][Math.floor(rand() * 3)], [0, 0.1 * s, 0]);
  r.scale.set(1 + rand() * 0.5, 0.6 + rand() * 0.3, 1);
  r.rotation.y = rand() * TAU;
  return r;
}

export function lamp(x, z) {
  return group(
    m(G.cyl(0.04, 0.06, 1.4, 6), '#5b4b42', [x, 0.7, z]),
    m(G.box(0.22, 0.26, 0.22), glow('#ffd27a', '#f6ead2'), [x, 1.5, z]),
    m(G.cone(0.2, 0.15, 4), '#5b4b42', [x, 1.7, z], [0, Math.PI / 4, 0]),
  );
}

/* ---------- 50 個社團小模型 ---------- */
const B = {
  pingpong(cc) {
    return group(
      m(G.box(1.6, 0.08, 0.9), '#3f8a6b', [0, 0.62, 0]),
      m(G.box(1.6, 0.01, 0.03), P.white, [0, 0.665, 0]),
      [-0.7, 0.7].flatMap(x => [-0.35, 0.35].map(z => m(G.cyl(0.03, 0.03, 0.6, 5), P.dark, [x, 0.3, z]))),
      m(G.box(0.02, 0.12, 0.98), P.white, [0, 0.72, 0]),
      m(G.cyl(0.15, 0.15, 0.03, 12), '#d64545', [-0.45, 0.68, 0.1], [0, 0, 0.1]),
      m(G.cyl(0.15, 0.15, 0.03, 12), cc, [0.45, 0.68, -0.15]),
      bob(ball(0.05, '#ffffff', [0.2, 1.0, 0.1]), 0.25, 4),
    );
  },
  hoop(cc) {
    return group(
      m(G.box(0.4, 0.15, 0.4), P.dark, [-0.65, 0.07, 0]),
      m(G.cyl(0.06, 0.06, 2.1, 6), '#6a6f78', [-0.65, 1.05, 0]),
      m(G.box(0.4, 0.06, 0.06), '#6a6f78', [-0.48, 2.0, 0]),
      m(G.box(0.06, 0.62, 0.92), P.white, [-0.28, 2.0, 0]),
      m(G.box(0.07, 0.24, 0.32), cc, [-0.27, 1.92, 0]),
      m(G.torus(0.18, 0.025, 4, 12), '#e0602a', [-0.06, 1.78, 0], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.17, 0.11, 0.25, 8, 1), mat('#ffffff', { transparent: true, opacity: 0.55 }), [-0.06, 1.64, 0]),
      bob(ball(0.16, '#e47b2c', [0.45, 0.9, 0.2]), 0.7, 3.2),
    );
  },
  volley(cc, club) {
    const high = club.id === 'volley2';
    return group(
      post(0, -0.8, 1.5, '#6a6f78'), post(0, 0.8, 1.5, '#6a6f78'),
      net(1.6, 0.45, 1.2),
      m(G.box(0.04, 0.05, 1.62), P.white, [0, 1.43, 0]),
      bob(group(ball(0.17, '#f4d35e', [0, 0, 0]), m(G.torus(0.17, 0.02, 4, 12), '#3c7fc4', [0, 0, 0])).translateX(0.5).translateY(high ? 1.9 : 0.6).translateZ(0.2), high ? 0.3 : 0.4, 2.5),
    );
  },
  pickle(cc) {
    return group(
      post(0, -0.75, 0.7, P.dark), post(0, 0.75, 0.7, P.dark),
      net(1.5, 0.3, 0.52),
      m(G.box(0.36, 0.04, 0.3), cc, [-0.5, 0.5, 0.2], [0.3, 0, 0.2]),
      m(G.cyl(0.03, 0.03, 0.2, 5), P.dark, [-0.5, 0.38, 0.38], [0.3, 0, 0.2]),
      bob(ball(0.1, '#d4e157', [0.4, 0.8, -0.2]), 0.25, 3),
      m(G.cyl(0.13, 0.13, 0.5, 8), '#6fae3c', [0.55, 0.13, 0.55], [0, 0, Math.PI / 2]),
    );
  },
  baseball() {
    const g = group(
      m(G.cyl(0.95, 0.95, 0.04, 4), '#d9a66b', [0, 0.02, 0], [0, Math.PI / 4, 0]),
      m(G.cyl(0.2, 0.25, 0.1, 8), '#c98f55', [0, 0.06, 0]),
      [[0.6, 0], [0, 0.6], [-0.6, 0], [0, -0.6]].map(([x, z]) => m(G.box(0.15, 0.04, 0.15), P.white, [x, 0.06, z], [0, Math.PI / 4, 0])),
      m(G.cyl(0.05, 0.08, 1.0, 6), P.woodLight, [0.3, 0.6, 0.35], [0, 0, -0.35]),
      ball(0.1, '#ffffff', [-0.2, 0.75, -0.1]),
      m(G.sphere(0.2, 8, 6), '#9b5b2f', [-0.45, 0.13, 0.3], [0, 0, 0], [1, 0.6, 1]),
    );
    bob(g.children[g.children.length - 2], 0.25, 3);
    return g;
  },
  badminton(cc) {
    const sc = group(m(G.cone(0.1, 0.2, 8), '#ffffff', [0, 0.1, 0], [Math.PI, 0, 0]), m(G.sphere(0.05, 8, 6), cc, [0, 0, 0]));
    sc.position.set(0.3, 1.5, 0.1); sc.rotation.z = 0.8;
    bob(sc, 0.3, 2.2);
    return group(
      post(0, -0.8, 1.3, P.white), post(0, 0.8, 1.3, P.white),
      net(1.6, 0.35, 1.08),
      racket(cc, [-0.5, 0.35, 0.3], [0.2, 0, 0.6]),
      sc,
    );
  },
  diabolo(cc) {
    const dia = group(
      m(G.cyl(0.25, 0.05, 0.25, 10), cc, [0, 0.13, 0]),
      m(G.cyl(0.05, 0.25, 0.25, 10), cc, [0, -0.13, 0]),
    );
    dia.position.y = 1.25; dia.rotation.z = Math.PI / 2;
    spin(dia, 6, 'x'); bob(dia, 0.2, 2);
    return group(
      m(G.cyl(0.02, 0.02, 0.8, 5), P.woodDark, [-0.55, 0.8, 0], [0, 0, 0.5]),
      m(G.cyl(0.02, 0.02, 0.8, 5), P.woodDark, [0.55, 0.8, 0], [0, 0, -0.5]),
      m(G.box(1.0, 0.01, 0.01), P.white, [0, 1.1, 0]),
      dia,
      // 毽子
      group(m(G.cyl(0.08, 0.08, 0.05, 8), '#d9b44a', [0, 0, 0]), m(G.cone(0.1, 0.3, 6), '#e86a5a', [0, 0.17, 0], [Math.PI, 0, 0])).translateX(0.5).translateY(0.1).translateZ(0.5),
    );
  },
  bunker() {
    const bags = [];
    for (let row = 0; row < 3; row++) for (let i = 0; i < 4 - row; i++) {
      bags.push(m(G.sphere(0.2, 8, 5), '#bfa77a', [-0.5 + i * 0.36 + row * 0.18, 0.12 + row * 0.2, -0.45], [0, 0, 0], [1, 0.55, 0.7]));
    }
    const target = group(
      m(G.cyl(0.4, 0.4, 0.05, 16), P.white, [0, 0, 0], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.28, 0.28, 0.06, 16), '#d64545', [0, 0, 0], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.15, 0.15, 0.07, 16), P.white, [0, 0, 0], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.06, 0.06, 0.08, 12), '#d64545', [0, 0, 0], [Math.PI / 2, 0, 0]),
    );
    target.position.set(0.3, 1.05, 0.35);
    return group(bags,
      m(G.box(0.45, 0.45, 0.45), P.wood, [0.55, 0.22, 0.4]),
      m(G.box(0.3, 0.3, 0.3), P.woodDark, [0.6, 0.6, 0.4], [0, 0.4, 0]),
      post(0.3, 0.3, 0.7, P.woodDark), target,
      m(G.box(0.5, 0.02, 0.6), '#6b7d4a', [-0.4, 0.5, 0.3], [0.2, 0, 0.1]),
    );
  },
  band(cc) {
    return group(
      m(G.box(0.9, 0.12, 0.35), '#2e2a2a', [0, 0.85, 0.15]),
      m(G.box(0.8, 0.03, 0.2), '#ffffff', [0, 0.92, 0.2]),
      post(-0.35, 0.15, 0.8, '#555'), post(0.35, 0.15, 0.8, '#555'),
      m(G.box(0.55, 0.65, 0.35), '#2e2a2a', [-0.45, 0.33, -0.45]),
      m(G.box(0.45, 0.45, 0.02), '#6a5f58', [-0.45, 0.36, -0.27]),
      m(G.cyl(0.015, 0.015, 1.3, 5), '#555', [0.55, 0.65, -0.3]),
      m(G.sphere(0.07, 8, 6), '#aaa', [0.55, 1.35, -0.3]),
      bob(note(cc, [0.2, 1.6, -0.2]), 0.18, 2),
    );
  },
  drum(cc) {
    const shell = cc;
    return group(
      m(G.cyl(0.38, 0.38, 0.35, 14), shell, [0, 0.4, -0.15], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.33, 0.33, 0.37, 14), '#f7f2e8', [0, 0.4, -0.15], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.2, 0.2, 0.2, 12), shell, [-0.45, 0.65, 0.2]),
      m(G.cyl(0.18, 0.18, 0.18, 12), shell, [0.25, 0.85, -0.05], [0.4, 0, 0]),
      m(G.cyl(0.23, 0.23, 0.22, 12), shell, [0.5, 0.5, 0.25]),
      post(-0.45, 0.2, 0.55, '#888', 0.02),
      m(G.cyl(0.3, 0.3, 0.015, 14), '#e3b94a', [-0.7, 1.3, -0.3], [0.25, 0, 0.1]),
      post(-0.7, -0.3, 1.3, '#888', 0.02),
      m(G.cyl(0.26, 0.26, 0.015, 14), '#e3b94a', [0.75, 1.15, -0.3], [-0.25, 0, -0.1]),
      post(0.75, -0.3, 1.15, '#888', 0.02),
      m(G.cyl(0.2, 0.2, 0.08, 10), '#333', [0, 0.45, 0.6]),
    );
  },
  amp() {
    const gtr = group(
      m(G.box(0.55, 0.32, 0.08), '#d23c3c', [0, 0, 0], [0, 0, 0.5]),
      m(G.box(0.7, 0.07, 0.05), '#2b2b2b', [0.42, 0.25, 0], [0, 0, 0.5]),
    );
    gtr.position.set(0.45, 0.8, 0.35); gtr.rotation.set(0.2, -0.5, 1.0);
    return group(
      m(G.box(0.8, 0.55, 0.45), '#2a2626', [-0.2, 0.28, -0.25]),
      m(G.box(0.8, 0.55, 0.45), '#2a2626', [-0.2, 0.84, -0.25]),
      m(G.box(0.7, 0.45, 0.02), '#5a524c', [-0.2, 0.28, -0.02]),
      m(G.box(0.7, 0.45, 0.02), '#5a524c', [-0.2, 0.84, -0.02]),
      m(G.box(0.8, 0.12, 0.45), '#c9a24a', [-0.2, 1.17, -0.25]),
      gtr,
      m(G.box(0.12, 0.35, 0.03), '#f2c94c', [0.2, 1.6, 0.0], [0, 0, 0.3]),
    );
  },
  guitar(cc, club) {
    const body = club.id === 'guitarB' ? '#c0603a' : '#d6a35f';
    const gtr = group(
      m(G.cyl(0.42, 0.42, 0.18, 14), body, [0, 0, 0], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.32, 0.32, 0.18, 14), body, [0, 0.5, 0], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.11, 0.11, 0.19, 12), '#3a2a1e', [0, 0.32, 0.01], [Math.PI / 2, 0, 0]),
      m(G.box(0.12, 0.9, 0.08), '#6b4428', [0, 1.15, 0.02]),
      m(G.box(0.18, 0.22, 0.07), '#4a2e1b', [0, 1.68, 0.02]),
    );
    gtr.position.set(0, 0.5, 0); gtr.rotation.set(-0.2, 0.3, 0.12);
    return group(gtr, m(G.box(0.6, 0.05, 0.3), P.woodDark, [0, 0.05, 0.1]), bob(note(cc, [0.6, 1.8, 0]), 0.2, 2.2));
  },
  ukulele(cc) {
    const u = group(
      m(G.cyl(0.25, 0.25, 0.12, 12), '#e6b878', [0, 0, 0], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.19, 0.19, 0.12, 12), '#e6b878', [0, 0.3, 0], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.07, 0.07, 0.13, 10), '#3a2a1e', [0, 0.2, 0.01], [Math.PI / 2, 0, 0]),
      m(G.box(0.08, 0.55, 0.06), '#7a4e2e', [0, 0.7, 0.01]),
    );
    u.position.set(-0.1, 0.4, 0); u.rotation.set(-0.2, 0.2, -0.25);
    const hib = group([0, 1, 2, 3, 4].map(i => m(G.sphere(0.1, 6, 4), '#f0567a', [Math.cos(i * 1.26) * 0.1, 0, Math.sin(i * 1.26) * 0.1], [0, 0, 0], [1, 0.4, 1])), m(G.sphere(0.04, 6, 4), '#ffd84a', [0, 0.04, 0]));
    hib.position.set(0.5, 0.1, 0.3);
    return group(u, hib,
      m(G.cyl(0.04, 0.06, 1.3, 5), '#9a6a3c', [0.55, 0.65, -0.4], [0, 0, -0.15]),
      [0, 1, 2, 3].map(i => m(G.box(0.6, 0.02, 0.18), '#5fa84a', [0.65 + Math.cos(i * 1.57) * 0.25, 1.3, -0.4 + Math.sin(i * 1.57) * 0.25], [0, i * 1.57, -0.35])),
    );
  },
  horn(cc) {
    const gold = '#e3b94a';
    return group(
      m(G.torus(0.3, 0.07, 6, 14), gold, [0, 0.7, 0], [0, Math.PI / 2, 0]),
      m(G.cone(0.32, 0.6, 12, 1), gold, [0, 1.25, 0.15], [-0.4, 0, 0]),
      m(G.cyl(0.07, 0.07, 0.4, 8), gold, [0, 0.35, 0]),
      // 譜架
      post(0.6, 0.2, 1.0, '#555', 0.02),
      m(G.box(0.45, 0.32, 0.02), '#333', [0.6, 1.05, 0.25], [-0.4, 0, 0]),
      m(G.box(0.38, 0.26, 0.01), '#fffaf0', [0.6, 1.06, 0.27], [-0.4, 0, 0]),
      bob(note(cc, [-0.5, 1.7, 0]), 0.2, 2.4),
    );
  },
  dance(cc, club) {
    const tiles = [];
    const cols = club.id === 'breaking' ? [cc, '#3b2f2a'] : [cc, '#ffd166'];
    for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) {
      const tm = glow(cols[(i + j + 2) % 2], cols[(i + j + 2) % 2]);
      tm.userData.always = true;
      const tile = m(G.box(0.5, 0.06, 0.5), tm, [i * 0.52, 0.03, j * 0.52]);
      const ph = (i + 2) * 0.7 + (j + 2) * 1.3;
      anim(t => { tm.emissiveIntensity = 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(t * 3 + ph)); });
      tiles.push(tile);
    }
    return group(tiles,
      m(G.box(0.55, 0.3, 0.18), '#3a3a3a', [0.55, 0.21, -0.75]),
      m(G.cyl(0.09, 0.09, 0.19, 10), '#777', [0.42, 0.21, -0.65], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.09, 0.09, 0.19, 10), '#777', [0.68, 0.21, -0.65], [Math.PI / 2, 0, 0]),
      m(G.torus(0.25, 0.03, 4, 10, Math.PI), '#666', [0.55, 0.36, -0.75]),
    );
  },
  balloons() {
    const cols = ['#f05a6b', '#ffd166', '#5fc0e8', '#9b7fd1', '#7ed37e'];
    const g = group(m(G.box(0.25, 0.15, 0.25), '#8a7a6a', [0, 0.08, 0]));
    cols.forEach((col, i) => {
      const a = i / cols.length * TAU, h = 1.4 + (i % 2) * 0.35;
      const bx = Math.cos(a) * 0.4, bz = Math.sin(a) * 0.4;
      const bl = group(m(G.sphere(0.24, 10, 8), col, [0, 0, 0], [0, 0, 0], [1, 1.2, 1]), m(G.cone(0.05, 0.08, 6), col, [0, -0.3, 0], [Math.PI, 0, 0]));
      bl.position.set(bx, h, bz);
      bob(bl, 0.08, 1.4 + i * 0.2);
      g.add(bl);
      const len = Math.hypot(bx, h - 0.4, bz);
      const s = m(G.cyl(0.006, 0.006, len, 3), '#ffffff', [bx / 2, (h + 0.15) / 2, bz / 2]);
      s.lookAt(new THREE.Vector3(bx, h, bz)); s.rotateX(Math.PI / 2);
      g.add(s);
    });
    return g;
  },
  drink(cc) {
    return group(
      m(G.cyl(0.32, 0.26, 0.9, 14), mat('#ffffff', { transparent: true, opacity: 0.45 }), [0, 0.45, 0]),
      m(G.cyl(0.29, 0.25, 0.35, 14), '#c98e5b', [0, 0.2, 0]),
      m(G.cyl(0.3, 0.29, 0.35, 14), '#f2d6b3', [0, 0.55, 0]),
      [0, 1, 2, 3, 4, 5].map(i => ball(0.06, '#3a2418', [Math.cos(i) * 0.15, 0.08, Math.sin(i) * 0.15])),
      m(G.cyl(0.04, 0.04, 1.2, 6), cc, [0.08, 0.95, 0], [0, 0, -0.15]),
      m(G.cyl(0.34, 0.34, 0.05, 14), '#ffffff', [0, 0.92, 0]),
      m(G.cyl(0.13, 0.15, 0.5, 10), P.metal, [0.6, 0.25, 0.3], [0, 0, 0], 1),
      m(G.cyl(0.08, 0.13, 0.15, 10), P.metal, [0.6, 0.57, 0.3]),
      ball(0.13, '#ffd166', [-0.55, 0.13, 0.35]),
    );
  },
  camera(cc) {
    return group(
      [0, 1, 2].map(i => {
        const a = i / 3 * TAU;
        return m(G.cyl(0.02, 0.02, 1.1, 4), '#4a4040', [Math.cos(a) * 0.22, 0.5, Math.sin(a) * 0.22], [Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25]);
      }),
      m(G.box(0.55, 0.35, 0.25), '#2f2b2b', [0, 1.2, 0]),
      m(G.cyl(0.14, 0.16, 0.3, 12), '#555', [0, 1.2, 0.25], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.11, 0.11, 0.01, 12), '#6fa8dc', [0, 1.2, 0.41], [Math.PI / 2, 0, 0]),
      m(G.box(0.15, 0.1, 0.1), cc, [0.15, 1.42, 0]),
      m(G.box(0.12, 0.06, 0.06), '#e6e6e6', [-0.17, 1.41, 0]),
    );
  },
  magic(cc) {
    const ears = group(
      m(G.sphere(0.07, 8, 6), '#ffffff', [-0.06, 0.15, 0], [0, 0, 0.15], [1, 2.6, 0.6]),
      m(G.sphere(0.07, 8, 6), '#ffffff', [0.06, 0.15, 0], [0, 0, -0.15], [1, 2.6, 0.6]),
      m(G.sphere(0.13, 8, 6), '#ffffff', [0, 0, 0]),
    );
    ears.position.set(0, 0.92, 0);
    bob(ears, 0.06, 2.5);
    return group(
      m(G.cyl(0.42, 0.42, 0.04, 16), '#2a2433', [0, 0.04, 0]),
      m(G.cyl(0.25, 0.27, 0.75, 16), '#2a2433', [0, 0.43, 0]),
      m(G.cyl(0.27, 0.27, 0.1, 16), cc, [0, 0.15, 0]),
      ears,
      m(G.cyl(0.025, 0.025, 0.8, 6), '#1e1e1e', [0.55, 0.45, 0.2], [0, 0, 0.6]),
      m(G.cyl(0.027, 0.027, 0.12, 6), '#ffffff', [0.78, 0.78, 0.2], [0, 0, 0.6]),
      [0, 1, 2].map(i => m(G.box(0.22, 0.01, 0.32), i === 1 ? '#d64545' : '#ffffff', [-0.55 + i * 0.12, 0.02 + i * 0.01, 0.3], [0, i * 0.3, 0])),
    );
  },
  film(cc) {
    const reel = m(G.cyl(0.25, 0.25, 0.06, 12), '#3a3a3a', [0.55, 0.95, 0.35], [Math.PI / 2, 0, 0]);
    spin(reel, 1.5, 'y');
    return group(
      post(-0.65, -0.3, 1.5, '#555', 0.03), post(0.65, -0.3, 1.5, '#555', 0.03),
      m(G.box(1.4, 0.85, 0.04), '#fbf7ef', [0, 1.15, -0.3]),
      m(G.box(1.2, 0.65, 0.01), glow('#bfe3f2', '#e6eef2'), [0, 1.15, -0.27]),
      m(G.box(0.45, 0.3, 0.35), '#4a4a52', [0.55, 0.55, 0.35]),
      m(G.box(0.1, 0.4, 0.1), '#4a4a52', [0.55, 0.2, 0.35]),
      reel,
      m(G.box(0.4, 0.28, 0.03), '#2a2a2a', [-0.45, 0.16, 0.45], [-0.3, 0.3, 0]),
      m(G.box(0.4, 0.07, 0.03), cc, [-0.45, 0.35, 0.4], [-0.5, 0.3, 0]),
    );
  },
  sketch(cc) {
    const pencil = group(
      m(G.cyl(0.08, 0.08, 1.1, 6), '#ffd166', [0, 0, 0]),
      m(G.cone(0.08, 0.22, 6), '#f2d6b3', [0, -0.66, 0], [Math.PI, 0, 0]),
      m(G.cyl(0.081, 0.081, 0.15, 6), '#f4a3b5', [0, 0.6, 0]),
    );
    pencil.position.set(0.6, 0.65, 0.25); pencil.rotation.z = 0.35;
    return group(
      m(G.box(0.05, 1.5, 0.05), P.wood, [-0.3, 0.75, -0.2], [0.15, 0, 0.12]),
      m(G.box(0.05, 1.5, 0.05), P.wood, [0.3, 0.75, -0.2], [0.15, 0, -0.12]),
      m(G.box(0.05, 1.3, 0.05), P.wood, [0, 0.65, -0.55], [-0.35, 0, 0]),
      m(G.box(0.9, 0.7, 0.04), '#fffdf8', [0, 1.15, -0.1], [0.15, 0, 0]),
      m(G.sphere(0.13, 8, 6), cc, [-0.05, 1.22, -0.06], [0.15, 0, 0], [1, 1, 0.2]),
      m(G.box(0.3, 0.12, 0.01), '#4f8fd6', [0.1, 0.98, -0.05], [0.15, 0, 0]),
      m(G.box(0.7, 0.04, 0.12), P.woodDark, [0, 0.8, -0.05]),
      pencil,
    );
  },
  manga(cc) {
    const cols = ['#f05a6b', '#5fc0e8', '#ffd166', '#9b7fd1', '#7ed37e'];
    const bubble = group(
      m(G.sphere(0.32, 12, 8), '#ffffff', [0, 0, 0], [0, 0, 0], [1.3, 0.9, 0.4]),
      m(G.cone(0.1, 0.25, 4), '#ffffff', [-0.2, -0.3, 0], [0, 0, 0.6]),
      [-0.15, 0, 0.15].map(x => ball(0.04, '#3b2f2a', [x, 0, 0.13])),
    );
    bubble.position.set(0.3, 1.6, 0);
    bob(bubble, 0.1, 1.8);
    return group(
      cols.map((col, i) => m(G.box(0.55, 0.12, 0.4), col, [-0.2, 0.06 + i * 0.12, 0], [0, i * 0.18 - 0.3, 0])),
      m(G.box(0.12, 0.55, 0.4), cc, [0.35, 0.27, 0.2], [0, 0.2, 0.15]),
      bubble,
    );
  },
  dice(cc) {
    const die = (s, color, pos, rot) => {
      const g = group(m(G.box(s, s, s), color, [0, 0, 0]));
      const pip = (x, y, z) => g.add(m(G.sphere(s * 0.08, 6, 4), color === '#ffffff' ? '#d64545' : '#ffffff', [x, y, z], [0, 0, 0], [1, 1, 0.4]));
      pip(0, 0, s / 2); // 1
      pip(-s * 0.22, s / 2, -s * 0.22); pip(s * 0.22, s / 2, s * 0.22); // 2
      pip(s / 2, 0, 0); pip(s / 2, s * 0.25, s * 0.25); pip(s / 2, -s * 0.25, -s * 0.25); // 3
      g.position.set(...pos); g.rotation.set(...rot);
      return g;
    };
    const meeple = (color, x, z) => group(
      m(G.box(0.22, 0.25, 0.1), color, [x, 0.13, z]),
      m(G.box(0.36, 0.08, 0.1), color, [x, 0.28, z]),
      ball(0.08, color, [x, 0.38, z]),
    );
    const d = die(0.6, '#ffffff', [-0.2, 0.9, -0.1], [0.5, 0.6, 0.3]);
    bob(d, 0.15, 1.6); spin(d, 0.6, 'y');
    return group(
      m(G.box(1.4, 0.04, 1.0), '#c9a87a', [0, 0.02, 0]),
      d,
      die(0.35, cc, [0.45, 0.2, 0.25], [0, 0.3, 0]),
      meeple('#f05a6b', -0.5, 0.3), meeple('#5fc0e8', 0.0, 0.35), meeple('#ffd166', 0.45, -0.3),
    );
  },
  arcade(cc) {
    const scr = glow('#7fe0ff', '#203040'); scr.userData.always = true; scr.emissiveIntensity = 0.6;
    return group(
      m(G.box(0.8, 1.6, 0.6), cc, [0, 0.8, -0.1]),
      m(G.box(0.62, 0.48, 0.04), scr, [0, 1.15, 0.21], [-0.15, 0, 0]),
      m(G.box(0.8, 0.12, 0.35), '#2e2a2a', [0, 0.75, 0.3], [0.2, 0, 0]),
      m(G.cyl(0.02, 0.02, 0.15, 5), '#2e2a2a', [-0.2, 0.88, 0.32]),
      ball(0.05, '#f05a6b', [-0.2, 0.96, 0.32]),
      ball(0.04, '#ffd166', [0.1, 0.84, 0.36]), ball(0.04, '#5fc0e8', [0.22, 0.84, 0.36]),
      m(G.box(0.8, 0.22, 0.6), '#fff1c2', [0, 1.7, -0.1]),
    );
  },
  mic(cc) {
    return group(
      m(G.cyl(0.25, 0.3, 0.05, 12), '#333', [0, 0.03, 0]),
      m(G.cyl(0.025, 0.025, 1.2, 6), '#555', [0, 0.6, 0]),
      m(G.cyl(0.1, 0.07, 0.3, 10), '#333', [0, 1.3, 0.05], [0.4, 0, 0]),
      m(G.sphere(0.13, 10, 8), '#c9c9c9', [0, 1.5, 0.12]),
      m(G.torus(0.1, 0.012, 4, 12), cc, [0, 1.38, 0.08], [Math.PI / 2 + 0.4, 0, 0]),
      m(G.box(0.7, 0.4, 0.25), '#2f2b2b', [0.55, 0.2, -0.35]),
      m(G.cyl(0.12, 0.12, 0.26, 10), cc, [0.4, 0.2, -0.35], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.12, 0.12, 0.26, 10), cc, [0.7, 0.2, -0.35], [Math.PI / 2, 0, 0]),
      m(G.box(0.08, 0.04, 0.5), '#ffd166', [-0.4, 0.4, 0.2], [0, 0.4, 0.3]),
    );
  },
  yarn(cc) {
    const ballYarn = (col, pos, r) => group(
      m(G.sphere(r, 10, 8), col, [0, 0, 0]),
      m(G.torus(r * 0.95, r * 0.08, 4, 14), col, [0, 0, 0], [0.5, 0.3, 0]),
      m(G.torus(r * 0.95, r * 0.08, 4, 14), col, [0, 0, 0], [1.4, 0.8, 0]),
    ).translateX(pos[0]).translateY(pos[1]).translateZ(pos[2]);
    return group(
      m(G.cyl(0.55, 0.45, 0.35, 10), P.woodLight, [0, 0.18, 0]),
      m(G.cyl(0.5, 0.5, 0.05, 10), P.woodDark, [0, 0.35, 0]),
      ballYarn(cc, [-0.15, 0.6, 0], 0.28),
      ballYarn('#f4a3b5', [0.25, 0.55, 0.15], 0.22),
      ballYarn('#5fc0e8', [0.15, 0.55, -0.25], 0.2),
      m(G.cyl(0.02, 0.02, 0.9, 5), '#c0c0c0', [-0.1, 0.9, 0.1], [0.3, 0, 0.5]),
      m(G.cyl(0.02, 0.02, 0.9, 5), '#c0c0c0', [0.05, 0.9, 0.1], [0.3, 0, -0.4]),
    );
  },
  flowers(cc) {
    const g = group(
      m(G.cyl(0.2, 0.28, 0.6, 10), cc, [0, 0.3, 0]),
      m(G.cyl(0.24, 0.2, 0.12, 10), cc, [0, 0.66, 0]),
    );
    const cols = ['#f05a6b', '#ffd166', '#ffffff', '#f4a3b5', '#c9b6f2', '#f7a072'];
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * TAU, r = 0.12 + (i % 3) * 0.07, h = 1.05 + (i % 4) * 0.15;
      g.add(m(G.cyl(0.012, 0.012, h - 0.6, 4), P.leafDark, [Math.cos(a) * r * 0.5, 0.6 + (h - 0.6) / 2, Math.sin(a) * r * 0.5], [Math.sin(a) * 0.25, 0, -Math.cos(a) * 0.25]));
      g.add(m(G.ball(0.1, 0), cols[i % cols.length], [Math.cos(a) * r * 1.2, h, Math.sin(a) * r * 1.2]));
    }
    g.add(m(G.ball(0.15, 0), P.leaf, [0.15, 0.85, 0.1], [0, 0, 0], [1, 0.5, 1]));
    g.add(flowerPatch(Math.random).translateX(0.6).translateZ(0.4));
    g.add(flowerPatch(Math.random).translateX(-0.6).translateZ(0.3));
    return g;
  },
  book(cc) {
    const quill = group(
      m(G.cone(0.08, 0.6, 4), '#ffffff', [0, 0.3, 0], [0, 0, 0], [1, 1, 0.3]),
      m(G.cyl(0.01, 0.01, 0.2, 4), '#555', [0, -0.05, 0]),
    );
    quill.position.set(0.55, 1.0, 0.1); quill.rotation.z = -0.4;
    bob(quill, 0.08, 2);
    return group(
      m(G.box(0.08, 0.6, 0.08), P.woodDark, [0, 0.3, 0]),
      m(G.box(0.6, 0.04, 0.8), cc, [-0.3, 0.68, 0], [0, 0, 0.2]),
      m(G.box(0.6, 0.04, 0.8), cc, [0.3, 0.68, 0], [0, 0, -0.2]),
      m(G.box(0.56, 0.06, 0.74), '#fffdf5', [-0.3, 0.72, 0], [0, 0, 0.2]),
      m(G.box(0.56, 0.06, 0.74), '#fffdf5', [0.3, 0.72, 0], [0, 0, -0.2]),
      [0, 1, 2].map(i => m(G.box(0.35, 0.01, 0.03), '#9a897b', [-0.3, 0.77, -0.2 + i * 0.15], [0, 0, 0.2])),
      quill,
      m(G.cyl(0.08, 0.09, 0.15, 8), '#2b2b3b', [-0.55, 0.08, 0.45]),
    );
  },
  tvcam(cc) {
    const onair = glow('#ff4d4d', '#5a1a1a'); onair.userData.always = true;
    anim(t => { onair.emissiveIntensity = Math.sin(t * 4) > 0 ? 1.2 : 0.1; });
    return group(
      m(G.cyl(0.04, 0.04, 0.9, 6), '#555', [-0.3, 0.45, 0]),
      m(G.cyl(0.3, 0.3, 0.04, 3), '#555', [-0.3, 0.05, 0]),
      m(G.box(0.4, 0.35, 0.65), '#3a3a42', [-0.3, 1.05, 0]),
      m(G.cyl(0.14, 0.14, 0.3, 10), '#222', [-0.3, 1.05, 0.45], [Math.PI / 2, 0, 0]),
      m(G.box(0.08, 0.06, 0.08), onair, [-0.3, 1.28, 0.2]),
      m(G.box(0.7, 0.55, 0.45), cc, [0.5, 0.3, -0.2]),
      m(G.box(0.55, 0.4, 0.02), glow('#a8e6ff', '#2a3a4a'), [0.45, 0.32, 0.03]),
      m(G.cyl(0.01, 0.01, 0.4, 3), '#555', [0.6, 0.75, -0.2], [0, 0, 0.5]),
      m(G.cyl(0.01, 0.01, 0.4, 3), '#555', [0.4, 0.75, -0.2], [0, 0, -0.5]),
    );
  },
  torii() {
    const red = '#d9483b';
    return group(
      m(G.cyl(0.07, 0.09, 1.6, 8), red, [-0.55, 0.8, 0]),
      m(G.cyl(0.07, 0.09, 1.6, 8), red, [0.55, 0.8, 0]),
      m(G.box(1.6, 0.12, 0.2), '#2b2b2b', [0, 1.7, 0]),
      m(G.box(1.45, 0.1, 0.16), red, [0, 1.58, 0]),
      m(G.box(1.3, 0.08, 0.12), red, [0, 1.3, 0]),
      m(G.box(0.08, 0.3, 0.06), red, [0, 1.45, 0]),
      // 石燈籠
      m(G.box(0.18, 0.08, 0.18), '#c9c2b5', [0.75, 0.04, 0.55]),
      m(G.cyl(0.04, 0.04, 0.35, 6), '#c9c2b5', [0.75, 0.25, 0.55]),
      m(G.box(0.2, 0.18, 0.2), glow('#ffcf70', '#d8d0c2'), [0.75, 0.5, 0.55]),
      m(G.cone(0.2, 0.15, 4), '#c9c2b5', [0.75, 0.66, 0.55], [0, Math.PI / 4, 0]),
    );
  },
  hanok(cc) {
    const roof = m(G.cyl(0.05, 0.85, 0.4, 4), '#4a5566', [0, 1.45, 0], [0, Math.PI / 4, 0], [1.2, 1, 0.8]);
    return group(
      m(G.box(1.1, 0.12, 0.7), '#d8ccb6', [0, 0.06, 0]),
      [-0.4, 0.4].flatMap(x => [-0.22, 0.22].map(z => m(G.cyl(0.05, 0.05, 1.1, 6), '#8a4a32', [x, 0.65, z]))),
      m(G.box(1.0, 0.12, 0.55), '#2f7a6a', [0, 1.18, 0]),
      roof,
      m(G.cyl(0.18, 0.18, 0.03, 16), '#ffffff', [0, 0.65, 0.25], [Math.PI / 2, 0, 0]),
      m(G.cyl(0.13, 0.13, 0.04, 16, 1), '#d64545', [0, 0.69, 0.25], [Math.PI / 2, 0, 0], [1, 1, 0.5]),
      m(G.cyl(0.13, 0.13, 0.04, 16), '#2f5fb0', [0, 0.61, 0.25], [Math.PI / 2, 0, 0], [1, 1, 0.5]),
    );
  },
  podium(cc) {
    const lect = x => group(
      m(G.cyl(0.22, 0.32, 0.9, 4), cc, [x, 0.45, 0], [0, Math.PI / 4, 0]),
      m(G.box(0.5, 0.05, 0.4), P.woodDark, [x, 0.92, 0], [0, 0, x > 0 ? 0.2 : -0.2]),
      m(G.cyl(0.01, 0.01, 0.25, 4), '#555', [x * 0.85, 1.05, 0]),
      ball(0.04, '#333', [x * 0.85, 1.18, 0]),
    );
    const scale = group(
      m(G.cyl(0.02, 0.02, 0.7, 5), '#c9a24a', [0, 0.35, 0]),
      m(G.box(0.6, 0.03, 0.03), '#c9a24a', [0, 0.7, 0]),
      m(G.cyl(0.12, 0.08, 0.04, 10), '#c9a24a', [-0.3, 0.5, 0]),
      m(G.cyl(0.12, 0.08, 0.04, 10), '#c9a24a', [0.3, 0.5, 0]),
    );
    scale.position.set(0, 0.8, -0.4);
    anim(t => { scale.rotation.z = Math.sin(t * 1.2) * 0.12; });
    return group(lect(-0.55), lect(0.55), m(G.box(0.3, 0.8, 0.3), '#efe3cc', [0, 0.4, -0.4]), scale);
  },
  keyboard(cc) {
    const keys = [];
    for (let r = 0; r < 4; r++) for (let k = 0; k < 8; k++) {
      keys.push(m(G.box(0.13, 0.06, 0.13), (r === 3 && k > 1 && k < 6) ? '#ffffff' : (r + k) % 7 === 0 ? cc : '#f7f2e8', [-0.56 + k * 0.16, 0.13, -0.24 + r * 0.16]));
    }
    return group(
      m(G.box(1.4, 0.1, 0.75), '#5a5560', [0, 0.05, 0], [0.08, 0, 0]),
      keys,
      m(G.box(0.95, 0.6, 0.05), '#2e2a2a', [0, 0.9, -0.55]),
      m(G.box(0.85, 0.5, 0.02), glow('#bde7ff', '#dfefff'), [0, 0.9, -0.52]),
      m(G.box(0.1, 0.5, 0.1), '#2e2a2a', [0, 0.35, -0.6]),
    );
  },
  crane() {
    const yellow = '#f2b134';
    const jib = group(
      m(G.box(2.0, 0.1, 0.12), yellow, [0.4, 0, 0]),
      m(G.box(0.25, 0.2, 0.2), '#7a7a7a', [-0.5, -0.1, 0]),
      m(G.cyl(0.006, 0.006, 0.7, 3), '#333', [1.1, -0.35, 0]),
      m(G.box(0.25, 0.15, 0.25), '#d0644a', [1.1, -0.75, 0]),
    );
    jib.position.y = 2.3;
    anim(t => { jib.rotation.y = Math.sin(t * 0.3) * 0.8; });
    return group(
      m(G.box(0.25, 2.3, 0.25), yellow, [-0.4, 1.15, 0]),
      [0.4, 0.9, 1.4, 1.9].map(y => m(G.box(0.28, 0.04, 0.28), '#c48a1e', [-0.4, y, 0])),
      jib,
      m(G.box(0.6, 0.55, 0.6), '#c7c2bb', [0.4, 0.28, 0.2]),
      m(G.box(0.62, 0.05, 0.62), '#9a958e', [0.4, 0.58, 0.2]),
      [[0.08, -0.12], [0.72, -0.12], [0.08, 0.52], [0.72, 0.52]].map(([x, z]) => m(G.box(0.04, 0.95, 0.04), P.woodLight, [x, 0.47, z])),
    );
  },
  microscope(cc) {
    return group(
      m(G.box(0.6, 0.08, 0.45), '#3a3a42', [0, 0.04, 0]),
      m(G.box(0.12, 0.8, 0.15), '#e8e8ec', [-0.18, 0.45, -0.1], [0, 0, 0.1]),
      m(G.box(0.4, 0.05, 0.35), '#3a3a42', [0.05, 0.45, 0]),
      m(G.cyl(0.08, 0.08, 0.55, 10), '#e8e8ec', [0.05, 0.95, 0], [0, 0, -0.35]),
      m(G.cyl(0.05, 0.05, 0.2, 8), '#3a3a42', [0.18, 0.62, 0]),
      m(G.cyl(0.05, 0.07, 0.15, 8), '#3a3a42', [-0.05, 1.26, 0], [0, 0, -0.35]),
      m(G.cyl(0.16, 0.16, 0.03, 12), mat('#ffffff', { transparent: true, opacity: 0.6 }), [0.5, 0.06, 0.35]),
      ball(0.04, cc, [0.48, 0.09, 0.33]), ball(0.03, '#7ed37e', [0.55, 0.09, 0.38]),
      m(G.box(0.15, 0.6, 0.15), '#bfe3f2', [-0.6, 0.3, 0.3]),
      m(G.cone(0.2, 0.3, 8), cc, [-0.6, 0.75, 0.3]),
    );
  },
  computer(cc) {
    const code = glow('#8ff0b0', '#1f2a2a'); code.userData.always = true; code.emissiveIntensity = 0.5;
    return group(
      m(G.box(1.4, 0.06, 0.7), P.woodLight, [0, 0.65, 0]),
      [-0.6, 0.6].map(x => m(G.box(0.06, 0.65, 0.6), P.woodDark, [x, 0.32, 0])),
      m(G.box(0.8, 0.5, 0.04), '#2e2a2a', [-0.15, 1.05, -0.2]),
      m(G.box(0.72, 0.42, 0.02), code, [-0.15, 1.05, -0.17]),
      m(G.box(0.06, 0.2, 0.06), '#2e2a2a', [-0.15, 0.75, -0.22]),
      m(G.box(0.5, 0.02, 0.18), '#e6e6e6', [-0.15, 0.69, 0.12]),
      m(G.box(0.4, 0.02, 0.3), '#9aa3ad', [0.42, 0.69, 0.1]),
      m(G.box(0.4, 0.28, 0.02), cc, [0.42, 0.83, -0.05], [-0.3, 0, 0]),
    );
  },
  books(cc) {
    const cols = ['#d64545', '#4f8fd6', '#ffd166', '#3fae98', '#9b7fd1', '#e8794a', '#7a5a3a'];
    const shelf = group(m(G.box(1.2, 1.6, 0.4), P.woodDark, [0, 0.8, -0.2]));
    for (let s = 0; s < 3; s++) {
      let x = -0.5;
      while (x < 0.45) {
        const w = 0.08 + Math.random() * 0.06, h = 0.32 + Math.random() * 0.1;
        shelf.add(m(G.box(w, h, 0.3), cols[Math.floor(Math.random() * cols.length)], [x + w / 2, 0.15 + s * 0.5 + h / 2, -0.05]));
        x += w + 0.01;
      }
      shelf.add(m(G.box(1.1, 0.04, 0.35), P.wood, [0, 0.13 + s * 0.5, -0.05]));
    }
    return group(shelf,
      m(G.box(0.4, 0.1, 0.3), cc, [0.4, 0.05, 0.45]),
      m(G.box(0.35, 0.1, 0.28), '#f7f2e8', [0.42, 0.15, 0.45], [0, 0.3, 0]),
      m(G.box(0.38, 0.1, 0.3), '#4f8fd6', [0.4, 0.25, 0.45], [0, -0.2, 0]),
    );
  },
  flask(cc) {
    const fl = (x, z, col, s) => group(
      m(G.cone(0.22 * s, 0.4 * s, 10), mat('#ffffff', { transparent: true, opacity: 0.45 }), [x, 0.85 + 0.2 * s, z]),
      m(G.cone(0.17 * s, 0.22 * s, 10), col, [x, 0.8 + 0.11 * s, z]),
      m(G.cyl(0.06 * s, 0.06 * s, 0.25 * s, 8), mat('#ffffff', { transparent: true, opacity: 0.45 }), [x, 0.85 + 0.5 * s, z]),
    );
    const bubbles = [0, 1, 2].map(i => {
      const b = ball(0.035, cc, [-0.3, 1.3 + i * 0.15, 0]);
      const ph = i * 2;
      anim(t => { const k = (t * 0.6 + ph / 6) % 1; b.position.y = 1.25 + k * 0.6; b.scale.setScalar(1 - k * 0.6); });
      return b;
    });
    return group(
      m(G.box(1.3, 0.08, 0.6), '#f2f2f2', [0, 0.72, 0]),
      [-0.55, 0.55].map(x => m(G.box(0.08, 0.7, 0.55), '#9aa3ad', [x, 0.35, 0])),
      fl(-0.3, 0, cc, 1), fl(0.15, 0.1, '#7ed37e', 0.8), fl(0.45, -0.1, '#5fc0e8', 0.7),
      bubbles,
    );
  },
  globe(cc) {
    const earth = group(
      m(G.sphere(0.4, 16, 12), '#5fb0e0', [0, 0, 0]),
      m(G.ball(0.16, 0), '#7ed37e', [0.27, 0.15, 0.2]),
      m(G.ball(0.13, 0), '#7ed37e', [-0.2, -0.1, 0.3]),
      m(G.ball(0.12, 0), '#7ed37e', [-0.1, 0.25, -0.28]),
    );
    earth.position.y = 1.2; earth.rotation.z = 0.4;
    spin(earth, 0.5);
    const plane = group(
      m(G.cone(0.12, 0.6, 3), '#ffffff', [0, 0, 0], [0, 0, -Math.PI / 2], [1, 1, 0.25]),
      m(G.box(0.08, 0.01, 0.5), '#ffffff', [0.05, 0, 0]),
    );
    const pg = group(plane); plane.position.set(0.75, 0, 0); plane.rotation.y = Math.PI / 2;
    pg.position.y = 1.3;
    spin(pg, 1.2);
    return group(
      m(G.cyl(0.25, 0.3, 0.08, 10), P.woodDark, [0, 0.04, 0]),
      m(G.cyl(0.03, 0.03, 0.8, 6), '#c9a24a', [0, 0.45, 0]),
      m(G.torus(0.48, 0.02, 4, 20, Math.PI), '#c9a24a', [0, 1.2, 0], [0, 0, 0.4 - Math.PI / 2]),
      earth, pg,
      m(G.box(0.4, 0.5, 0.18), cc, [0.6, 0.25, 0.35]),
      m(G.box(0.15, 0.06, 0.04), '#3b2f2a', [0.6, 0.53, 0.35]),
    );
  },
  chart(cc) {
    const bars = [0.4, 0.6, 0.5, 0.9, 1.2].map((h, i) => {
      const b = m(G.box(0.18, h, 0.18), i === 4 ? cc : '#7ec98a', [-0.45 + i * 0.22, h / 2, -0.15]);
      return b;
    });
    const arrow = group(
      m(G.box(1.1, 0.06, 0.06), '#e05a4a', [0, 0, 0]),
      m(G.cone(0.12, 0.25, 4), '#e05a4a', [0.6, 0, 0], [0, 0, -Math.PI / 2]),
    );
    arrow.position.set(0, 1.0, 0.15); arrow.rotation.z = 0.55;
    bob(arrow, 0.06, 2);
    const coin = (x, y, z) => m(G.cyl(0.14, 0.14, 0.05, 12), '#e9c24a', [x, y, z]);
    return group(bars, arrow, [0, 1, 2, 3].map(i => coin(0.55, 0.03 + i * 0.055, 0.45)), coin(0.25, 0.03, 0.55), coin(0.3, 0.085, 0.5));
  },
  radio(cc) {
    const blink = glow('#ff5a5a', '#7a2a2a'); blink.userData.always = true;
    anim(t => { blink.emissiveIntensity = (Math.sin(t * 3) > 0.6) ? 1.5 : 0.05; });
    const segs = [0, 1, 2, 3].map(i => m(G.cyl(0.18 - i * 0.04, 0.22 - i * 0.04, 0.5, 4), i % 2 ? '#ffffff' : '#e05a4a', [-0.4, 0.25 + i * 0.5, -0.2], [0, Math.PI / 4, 0]));
    const waves = [0, 1, 2].map(i => {
      const w = m(G.torus(0.2 + i * 0.15, 0.02, 4, 16, Math.PI / 2), mat(cc, { transparent: true, opacity: 0.8 }), [-0.4, 2.15, -0.2], [0, 0, Math.PI / 4]);
      anim(t => { const k = (t * 0.7 + i / 3) % 1; w.scale.setScalar(0.6 + k * 1.2); w.material.opacity = 1 - k; });
      return w;
    });
    return group(segs, m(G.sphere(0.07, 8, 6), blink, [-0.4, 2.1, -0.2]), waves,
      m(G.box(0.7, 0.45, 0.3), '#c98f55', [0.4, 0.23, 0.3]),
      m(G.cyl(0.14, 0.14, 0.02, 12), '#3b2f2a', [0.28, 0.25, 0.46], [Math.PI / 2, 0, 0]),
      m(G.box(0.2, 0.12, 0.02), '#fff1c2', [0.58, 0.3, 0.46]),
      m(G.cyl(0.01, 0.01, 0.5, 3), '#555', [0.6, 0.65, 0.3], [0, 0, -0.4]),
    );
  },
  recycle() {
    const bin = (x, col) => group(
      m(G.cyl(0.18, 0.15, 0.5, 8), col, [x, 0.25, 0]),
      m(G.cyl(0.2, 0.2, 0.06, 8), col, [x, 0.53, 0]),
      m(G.box(0.12, 0.08, 0.02), '#ffffff', [x, 0.3, 0.17]),
    );
    const arrows = group([0, 1, 2].map(i => m(G.cone(0.1, 0.18, 3), '#3fae78', [Math.cos(i * 2.09) * 0.2, Math.sin(i * 2.09) * 0.2, 0], [0, 0, i * 2.09])));
    arrows.position.set(0, 1.3, 0);
    spin(arrows, 1, 'z');
    return group(bin(-0.45, '#4f8fd6'), bin(0, '#3fae78'), bin(0.45, '#f2b134'), arrows,
      m(G.cyl(0.04, 0.05, 0.35, 5), P.trunk, [0.2, 0.17, 0.5]),
      m(G.ball(0.22, 0), P.leafLight, [0.2, 0.45, 0.5]),
      m(G.box(0.25, 0.25, 0.2), '#c9a87a', [-0.4, 0.12, 0.5], [0, 0.4, 0]),
    );
  },
  tent(cc) {
    const flame = m(G.cone(0.13, 0.35, 5), glow('#ffb347', '#ff8c3a'), [0.55, 0.25, 0.45]);
    flame.material.userData.always = true; flame.material.emissiveIntensity = 0.8;
    anim(t => { flame.scale.y = 1 + Math.sin(t * 12) * 0.15; });
    return group(
      m(G.cyl(0.01, 0.6, 0.9, 3), '#6f9d4a', [-0.2, 0.45, -0.1], [0, Math.PI / 2, 0], [1, 1, 1.5]),
      m(G.cyl(0.01, 0.3, 0.6, 3), '#3d5a2c', [-0.2, 0.3, 0.33], [0, Math.PI / 2, 0], [1, 1, 0.1]),
      [0, 1, 2].map(i => m(G.cyl(0.04, 0.04, 0.35, 5), P.woodDark, [0.55, 0.05, 0.45], [Math.PI / 2, i * 1.05, 0])),
      flame,
      post(0.6, -0.4, 1.4, P.woodDark, 0.025),
      m(G.box(0.02, 0.25, 0.4), cc, [0.6, 1.25, -0.2]),
    );
  },
  circus(cc) {
    const stripes = [0, 1, 2, 3, 4, 5].map(i => m(G.box(0.05, 0.6, 0.3), i % 2 ? '#ffffff' : cc, [Math.cos(i * TAU / 6) * 0.5, 0.3, Math.sin(i * TAU / 6) * 0.5], [0, -i * TAU / 6, 0]));
    const balls = [0, 1, 2].map(i => {
      const b = ball(0.09, ['#f05a6b', '#ffd166', '#5fc0e8'][i], [0.75, 1, 0.4]);
      anim(t => { const a = t * 3 + i * 2.09; b.position.set(0.75 + Math.cos(a) * 0.25, 1.2 + Math.sin(a) * 0.35, 0.4); });
      return b;
    });
    return group(
      m(G.cyl(0.55, 0.55, 0.6, 12), '#fff4de', [0, 0.3, 0]),
      stripes,
      m(G.cone(0.7, 0.6, 12), cc, [0, 0.9, 0]),
      m(G.cyl(0.01, 0.01, 0.3, 4), '#555', [0, 1.3, 0]),
      m(G.box(0.02, 0.12, 0.2), '#ffd166', [0, 1.4, 0.1]),
      m(G.box(0.3, 0.4, 0.02), '#3b2f2a', [0, 0.2, 0.55]),
      balls,
      m(G.cone(0.12, 0.3, 10), '#f2b134', [-0.7, 0.4, 0.45], [0, 0, Math.PI / 2]),
    );
  },
  barn() {
    const cow = group(
      m(G.box(0.5, 0.28, 0.25), '#ffffff', [0, 0.32, 0]),
      m(G.box(0.15, 0.1, 0.26), '#2b2b2b', [0.05, 0.4, 0]),
      m(G.box(0.18, 0.18, 0.18), '#ffffff', [0.32, 0.45, 0]),
      m(G.box(0.1, 0.08, 0.16), '#f4a3b5', [0.43, 0.4, 0]),
      [[-0.18, -0.08], [-0.18, 0.08], [0.18, -0.08], [0.18, 0.08]].map(([x, z]) => m(G.box(0.07, 0.2, 0.07), '#ffffff', [x, 0.1, z])),
    );
    cow.position.set(0.35, 0, 0.45); cow.rotation.y = -0.6;
    const head = cow.children[2];
    anim(t => { head.rotation.z = Math.sin(t * 1.5) * 0.15 - 0.1; });
    return group(
      m(G.box(0.85, 0.65, 0.7), '#c8503e', [-0.35, 0.33, -0.3]),
      m(G.cyl(0.01, 0.6, 0.45, 4), '#7a3a2e', [-0.35, 0.87, -0.3], [0, Math.PI / 4, 0], [1.2, 1, 0.95]),
      m(G.box(0.35, 0.4, 0.02), '#ffffff', [-0.35, 0.22, 0.06]),
      m(G.box(0.3, 0.02, 0.02), '#ffffff', [-0.35, 0.22, 0.07], [0, 0, 0.8]),
      cow,
      [-0.75, -0.4, -0.05, 0.3, 0.65].map(x => m(G.box(0.05, 0.3, 0.05), P.woodLight, [x, 0.15, 0.8])),
      m(G.box(1.45, 0.04, 0.03), P.woodLight, [-0.05, 0.22, 0.8]),
    );
  },
  clover() {
    const leaf = '#4caf50';
    const clover = group(
      [0, 1, 2, 3].map(i => m(G.sphere(0.18, 8, 6), leaf, [Math.cos(i * TAU / 4 + 0.78) * 0.17, Math.sin(i * TAU / 4 + 0.78) * 0.17, 0], [0, 0, 0], [1, 1, 0.3])),
      m(G.sphere(0.07, 8, 6), '#ffffff', [0, 0, 0.04]),
    );
    clover.position.set(-0.35, 1.35, 0);
    anim(t => { clover.rotation.y = Math.sin(t) * 0.5; });
    const rows = [];
    for (let r = 0; r < 3; r++) {
      rows.push(m(G.box(0.25, 0.1, 0.9), '#8a5a3a', [0.1 + r * 0.32, 0.05, 0]));
      for (let k = 0; k < 3; k++) rows.push(m(G.cone(0.08, 0.2, 5), r === 1 ? '#f2b134' : '#6fb352', [0.1 + r * 0.32, 0.18, -0.3 + k * 0.3]));
    }
    return group(post(-0.35, 0, 1.2, P.woodDark, 0.035), clover, rows,
      m(G.cyl(0.12, 0.14, 0.22, 8), '#5fc0e8', [-0.55, 0.11, 0.5]),
      m(G.cyl(0.02, 0.03, 0.25, 5), '#5fc0e8', [-0.4, 0.2, 0.5], [0, 0, -0.9]),
    );
  },
};

function note(color, pos) {
  return group(
    m(G.sphere(0.09, 8, 6), color, [0, 0, 0], [0, 0, 0.4], [1.3, 1, 0.6]),
    m(G.box(0.025, 0.4, 0.025), color, [0.09, 0.2, 0]),
    m(G.box(0.12, 0.04, 0.025), color, [0.15, 0.38, 0], [0, 0, -0.4]),
  ).translateX(pos[0]).translateY(pos[1]).translateZ(pos[2]);
}

export function clubProp(club, color) {
  const build = B[club.prop];
  return build ? build(color, club) : group(m(G.box(0.8, 0.8, 0.8), color, [0, 0.4, 0]));
}

/* ---------- 各島地標 ---------- */
export const LANDMARKS = {
  stadium(cc) {
    const field = group(
      m(G.cyl(2.3, 2.3, 0.08, 28), '#c8664a', [0, 0.04, 0], [0, 0, 0], [1.35, 1, 1]),
      m(G.cyl(1.7, 1.7, 0.1, 28), '#7cc25a', [0, 0.05, 0], [0, 0, 0], [1.35, 1, 1]),
      m(G.box(0.03, 0.02, 3.2), '#ffffff', [0, 0.11, 0]),
      m(G.torus(0.45, 0.02, 3, 20), '#ffffff', [0, 0.11, 0], [Math.PI / 2, 0, 0]),
      [-1.9, 1.9].map(x => m(G.box(0.05, 0.4, 0.9), '#ffffff', [x, 0.3, 0])),
    );
    const trophy = group(
      m(G.box(0.5, 0.4, 0.5), '#efe3cc', [0, 0.2, 0]),
      m(G.cyl(0.12, 0.2, 0.15, 10), '#e9c24a', [0, 0.47, 0]),
      m(G.cyl(0.04, 0.04, 0.3, 8), '#e9c24a', [0, 0.7, 0]),
      m(G.cyl(0.32, 0.14, 0.45, 12), '#e9c24a', [0, 1.05, 0]),
      m(G.torus(0.14, 0.035, 4, 10), '#e9c24a', [-0.32, 1.1, 0]),
      m(G.torus(0.14, 0.035, 4, 10), '#e9c24a', [0.32, 1.1, 0]),
      m(G.ball(0.12, 0), cc, [0, 1.42, 0]),
    );
    trophy.position.set(0, 0.1, 0);
    spin(trophy, 0.4);
    const bleach = [0, 1, 2].map(i => m(G.box(2.4, 0.22, 0.35), i === 2 ? cc : '#efe3cc', [0, 0.11 + i * 0.22, -2.6 - i * 0.3]));
    return group(field, trophy, bleach);
  },
  stage(cc) {
    const shell = m(new THREE.CylinderGeometry(2.0, 2.0, 2.4, 16, 1, true, -Math.PI / 2, Math.PI), mat('#fff4de', { side: THREE.DoubleSide }), [0, 1.4, -0.4]);
    const spots = [-1.6, 1.6].map(x => group(
      post(x, 0.9, 2.2, '#555', 0.05),
      m(G.cyl(0.15, 0.22, 0.3, 8), '#333', [x, 2.2, 0.9], [0.8, 0, 0]),
      m(G.cyl(0.14, 0.14, 0.02, 8), glow('#fff3b0', '#fff3b0'), [x, 2.1, 1.05], [0.8, 0, 0]),
    ));
    const notes = [0, 1, 2].map(i => bob(note(['#f05a6b', '#ffd166', '#5fc0e8'][i], [-0.8 + i * 0.8, 2.9 + (i % 2) * 0.4, 0]), 0.25, 1.4 + i * 0.3));
    return group(
      m(G.cyl(2.2, 2.3, 0.4, 16, 1), '#b07a4f', [0, 0.2, 0]),
      m(G.cyl(2.0, 2.0, 0.05, 16), cc, [0, 0.42, 0]),
      shell, spots, notes,
      m(G.box(0.4, 0.7, 0.4), '#2a2626', [-1.3, 0.8, -0.4]),
      m(G.box(0.4, 0.7, 0.4), '#2a2626', [1.3, 0.8, -0.4]),
      m(G.cyl(0.025, 0.025, 1.2, 6), '#555', [0, 1.0, 0.6]),
      m(G.sphere(0.08, 8, 6), '#aaa', [0, 1.65, 0.6]),
    );
  },
  carousel(cc) {
    const rot = new THREE.Group();
    const horses = [0, 1, 2, 3, 4, 5].map(i => {
      const a = i / 6 * TAU;
      const h = group(
        m(G.cyl(0.02, 0.02, 1.8, 4), '#e9c24a', [0, 0.9, 0]),
        m(G.box(0.55, 0.25, 0.2), ['#ffffff', '#f6b5c8', '#bfe3f2'][i % 3], [0, 0.85, 0]),
        m(G.box(0.15, 0.3, 0.15), ['#ffffff', '#f6b5c8', '#bfe3f2'][i % 3], [0.25, 1.05, 0], [0, 0, -0.3]),
        m(G.box(0.12, 0.08, 0.22), cc, [-0.05, 1.0, 0]),
      );
      h.position.set(Math.cos(a) * 1.35, 0.2, Math.sin(a) * 1.35);
      h.rotation.y = -a;
      const ph = i * 1.1;
      const parts = [[h.children[1], 0.85], [h.children[2], 1.05], [h.children[3], 1.0]];
      anim(t => { for (const [o, y] of parts) o.position.y = y + Math.sin(t * 2 + ph) * 0.15; });
      return h;
    });
    const roofCols = [0, 1, 2, 3, 4, 5, 6, 7].map(i => m(new THREE.ConeGeometry(2.0, 0.9, 8, 1, true, i * TAU / 8, TAU / 8), mat(i % 2 ? '#ffffff' : cc, { side: THREE.DoubleSide }), [0, 2.65, 0]));
    rot.add(m(G.cyl(1.9, 1.9, 0.2, 16), '#f4e6c8', [0, 0.2, 0]), ...horses, m(G.cyl(0.18, 0.18, 2.2, 10), '#e9c24a', [0, 1.3, 0]),
      m(G.cyl(2.0, 2.0, 0.2, 16), cc, [0, 2.2, 0]), ...roofCols, m(G.ball(0.15, 1), '#e9c24a', [0, 3.2, 0]));
    spin(rot, 0.35);
    return group(m(G.cyl(2.05, 2.15, 0.15, 16), '#d6c1a0', [0, 0.07, 0]), rot);
  },
  gazebo(cc) {
    const pillars = [0, 1, 2, 3, 4, 5].map(i => m(G.cyl(0.08, 0.08, 1.8, 6), '#fff4de', [Math.cos(i * TAU / 6) * 1.3, 1.05, Math.sin(i * TAU / 6) * 1.3]));
    const pond = m(G.cyl(0.9, 0.9, 0.06, 12), mat(P.water, { roughness: 0.3 }), [2.3, 0.04, 1.4], [0, 0, 0], [1.3, 1, 1]);
    const pads = [0, 1, 2].map(i => m(G.cyl(0.15, 0.15, 0.02, 8), '#6fb352', [2.0 + i * 0.35, 0.09, 1.2 + (i % 2) * 0.4]));
    return group(
      m(G.cyl(1.6, 1.7, 0.2, 6), '#efe3cc', [0, 0.1, 0]),
      pillars,
      m(G.cyl(1.7, 1.6, 0.15, 6), cc, [0, 2.0, 0]),
      m(G.cone(1.9, 1.0, 6), cc, [0, 2.6, 0]),
      m(G.ball(0.15, 0), '#e9c24a', [0, 3.15, 0]),
      m(G.box(1.2, 0.1, 0.35), P.wood, [0, 0.55, 0]),
      [-0.5, 0.5].map(x => m(G.box(0.08, 0.35, 0.3), P.woodDark, [x, 0.33, 0])),
      pond, pads,
    );
  },
  observatory(cc) {
    const dome = group(
      m(G.sphere(1.25, 16, 8), '#e8edf2', [0, 0, 0], [0, 0, 0], 1),
      m(G.box(0.4, 1.3, 2.6), '#3b4a5a', [0, 0.1, 0], [0, 0, -0.4]),
      m(G.cyl(0.18, 0.25, 1.6, 10), '#3b4a5a', [0.65, 0.75, 0], [0, 0, -0.7]),
    );
    dome.position.y = 2.6;
    spin(dome, 0.15);
    return group(
      m(G.cyl(1.3, 1.5, 2.6, 12), '#fff4de', [0, 1.3, 0]),
      m(G.cyl(1.35, 1.35, 0.15, 12), cc, [0, 2.55, 0]),
      dome,
      m(G.box(0.55, 0.9, 0.1), P.woodDark, [0, 0.45, 1.45]),
      [0, 1, 2, 3].map(i => m(G.box(0.3, 0.35, 0.08), glow('#ffe39a', '#cfe7f7'), [Math.cos(i * TAU / 4 + 0.6) * 1.35, 1.6, Math.sin(i * TAU / 4 + 0.6) * 1.35], [0, -(i * TAU / 4 + 0.6) + Math.PI / 2, 0])),
    );
  },
  windmill(cc) {
    const blades = group([0, 1, 2, 3].map(i => group(
      m(G.box(0.12, 1.6, 0.04), P.woodDark, [0, 0.85, 0]),
      m(G.box(0.4, 1.3, 0.02), '#fff4de', [0.22, 0.95, 0]),
    ).rotateZ(i * Math.PI / 2)));
    blades.position.set(0, 3.2, 0.95);
    spin(blades, 0.8, 'z');
    const hay = (x, z) => m(G.cyl(0.35, 0.35, 0.6, 10), '#e7c66a', [x, 0.35, z], [Math.PI / 2, 0, 0.3]);
    return group(
      m(G.cyl(0.75, 1.15, 3.0, 8), '#fff4de', [0, 1.5, 0]),
      m(G.cone(1.0, 1.0, 8), cc, [0, 3.5, 0]),
      m(G.box(0.4, 0.4, 0.5), P.woodDark, [0, 3.2, 0.7]),
      blades,
      m(G.box(0.5, 0.8, 0.1), P.woodDark, [0, 0.4, 1.12]),
      m(G.box(0.3, 0.3, 0.08), glow('#ffe39a', '#cfe7f7'), [0, 2.0, 0.95]),
      hay(1.6, 0.6), hay(1.9, -0.2), hay(-1.7, 0.8),
    );
  },
};

/* ---------- 中央社團中心 ---------- */
export function hubBuilding() {
  const g = new THREE.Group();
  const wall = '#fff1d6', roof = '#cf6a4c', trim = '#b07a4f';
  // 主建築
  g.add(m(G.box(6.0, 2.0, 2.6), wall, [0, 1.0, -1.6]));
  g.add(m(G.cyl(0.01, 2.2, 1.1, 4), roof, [0, 2.55, -1.6], [0, Math.PI / 4, 0], [2.0, 1, 0.9]));
  for (let i = 0; i < 6; i++) {
    if (i === 2 || i === 3) continue;
    g.add(m(G.box(0.55, 0.6, 0.05), glow('#ffd98a', '#a9d3e6'), [-2.4 + i * 0.95, 1.2, -0.28]));
  }
  // 鐘塔
  g.add(m(G.box(1.6, 4.4, 1.6), wall, [0, 2.2, -1.2]));
  g.add(m(G.box(1.75, 0.2, 1.75), trim, [0, 4.4, -1.2]));
  g.add(m(G.cone(1.3, 1.6, 4), roof, [0, 5.3, -1.2], [0, Math.PI / 4, 0]));
  g.add(m(G.cyl(0.03, 0.03, 0.8, 4), '#555', [0, 6.4, -1.2]));
  const clockTex = makeClockTexture();
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.55, 24), new THREE.MeshStandardMaterial({ map: clockTex, roughness: 0.8 }));
  face.position.set(0, 3.5, -0.39);
  g.add(face);
  // 時針分針（依現在時間轉動）
  const hHand = m(G.box(0.05, 0.28, 0.02), '#3b2f2a', [0, 0, 0]); hHand.geometry = hHand.geometry.clone().translate(0, 0.12, 0);
  const mHand = m(G.box(0.035, 0.42, 0.02), '#3b2f2a', [0, 0, 0]); mHand.geometry = mHand.geometry.clone().translate(0, 0.19, 0);
  const hands = group(hHand, mHand); hands.position.set(0, 3.5, -0.36);
  g.add(hands);
  anim(() => {
    const d = new Date();
    const mins = d.getMinutes() + d.getSeconds() / 60;
    mHand.rotation.z = -mins / 60 * TAU;
    hHand.rotation.z = -((d.getHours() % 12) + mins / 60) / 12 * TAU;
  });
  // 大門
  g.add(m(G.box(1.0, 1.3, 0.1), trim, [0, 0.65, -0.36]));
  g.add(m(G.box(0.9, 0.08, 0.6), '#efe3cc', [0, 0.04, -0.05]));
  // 招牌
  const s = sign('南大附中社團中心', '#3b2f2a', 3.2, 0.5);
  s.position.set(0, 1.85, -0.27);
  g.add(s);
  // 旗桿
  g.add(m(G.cyl(0.05, 0.05, 4.2, 6), '#d8d8d8', [-3.6, 2.1, 0.6]));
  const flag = m(G.box(0.02, 0.6, 1.0), '#e39b2d', [-3.6, 3.85, 1.12]);
  anim(t => { flag.rotation.y = Math.sin(t * 2.2) * 0.25; });
  g.add(flag);
  return g;
}

function makeClockTexture() {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 256;
  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#fffaf2'; ctx.beginPath(); ctx.arc(128, 128, 124, 0, TAU); ctx.fill();
  ctx.strokeStyle = '#b07a4f'; ctx.lineWidth = 12; ctx.stroke();
  ctx.fillStyle = '#3b2f2a';
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * TAU;
    ctx.beginPath(); ctx.arc(128 + Math.sin(a) * 95, 128 - Math.cos(a) * 95, i % 3 ? 5 : 9, 0, TAU); ctx.fill();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// 社團公告欄（點擊開啟即時動態）
export function noticeBoard() {
  const s = sign('社團即時動態', '#c0602a', 1.6, 0.36);
  s.position.set(0, 1.62, 0.07);
  const paper = (x, y, col, r) => m(G.box(0.36, 0.42, 0.01), col, [x, y, 0.07], [0, 0, r]);
  return group(
    post(-0.85, 0, 1.6, P.woodDark, 0.06), post(0.85, 0, 1.6, P.woodDark, 0.06),
    m(G.box(1.9, 1.15, 0.1), '#a8784e', [0, 1.05, 0]),
    m(G.box(1.75, 0.65, 0.04), '#d7b98c', [0, 0.92, 0.04]),
    paper(-0.55, 0.92, '#fff7d6', 0.08), paper(-0.1, 0.9, '#ffe3e3', -0.05), paper(0.35, 0.93, '#e0f1ff', 0.1),
    m(G.box(0.3, 0.35, 0.01), '#e8ffe0', [0.72, 0.88, 0.07], [0, 0, -0.08]),
    m(G.cone(1.2, 0.35, 4), '#cf6a4c', [0, 1.85, 0], [0, Math.PI / 4, 0], [1.1, 1, 0.3]),
    s,
  );
}
