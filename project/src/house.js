import * as THREE from 'three';

const OX = 8.1, OZ = 5.55, H = 2.8;
const PX = x => x - OX;
const PZ = z => z - OZ;

let seed = 7;
const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

function canvasTexture(size, draw, rx, ry) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  draw(g, size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function woodTexture() {
  return canvasTexture(512, (g, s) => {
    g.fillStyle = '#c09468';
    g.fillRect(0, 0, s, s);
    const rows = 8;
    for (let i = 0; i < rows; i++) {
      const y = (s / rows) * i;
      const l = 0.9 + rnd() * 0.25;
      g.fillStyle = `rgb(${Math.floor(192 * l)},${Math.floor(148 * l)},${Math.floor(104 * l)})`;
      g.fillRect(0, y, s, s / rows);
      g.strokeStyle = 'rgba(90,60,35,0.55)';
      g.lineWidth = 2;
      g.beginPath(); g.moveTo(0, y); g.lineTo(s, y); g.stroke();
      const jx = rnd() * s;
      g.beginPath(); g.moveTo(jx, y); g.lineTo(jx, y + s / rows); g.stroke();
      g.strokeStyle = 'rgba(120,85,50,0.25)';
      g.lineWidth = 1;
      for (let k = 0; k < 5; k++) {
        const gy = y + rnd() * (s / rows);
        g.beginPath(); g.moveTo(0, gy); g.bezierCurveTo(s * 0.3, gy + 3, s * 0.6, gy - 3, s, gy); g.stroke();
      }
    }
  }, 3, 3);
}

function tileTexture(base, line) {
  return canvasTexture(512, (g, s) => {
    g.fillStyle = base;
    g.fillRect(0, 0, s, s);
    const n = 4, cell = s / n;
    g.strokeStyle = line;
    g.lineWidth = 3;
    for (let i = 0; i <= n; i++) {
      g.beginPath(); g.moveTo(i * cell, 0); g.lineTo(i * cell, s); g.stroke();
      g.beginPath(); g.moveTo(0, i * cell); g.lineTo(s, i * cell); g.stroke();
    }
    for (let i = 0; i < 900; i++) {
      g.fillStyle = `rgba(120,110,95,${rnd() * 0.06})`;
      g.fillRect(rnd() * s, rnd() * s, 2, 2);
    }
  }, 4, 4);
}

export function buildHouse(app) {
  const scene = app.scene;
  const colliders = [];
  const group = new THREE.Group();
  scene.add(group);
  const ceilingGroup = new THREE.Group();
  scene.add(ceilingGroup);

  const M = {
    wallExt: new THREE.MeshStandardMaterial({ color: 0xe8e2d4, roughness: 0.92 }),
    wallInt: new THREE.MeshStandardMaterial({ color: 0xf1ece1, roughness: 0.95 }),
    woodFloor: new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.6 }),
    tile: new THREE.MeshStandardMaterial({ map: tileTexture('#e9e4da', '#d6cfc2'), roughness: 0.35 }),
    tileGray: new THREE.MeshStandardMaterial({ map: tileTexture('#dcd9d2', '#c4c0b8'), roughness: 0.5 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x8a6844, roughness: 0.55 }),
    woodDark: new THREE.MeshStandardMaterial({ color: 0x5d4630, roughness: 0.5 }),
    woodLight: new THREE.MeshStandardMaterial({ color: 0xb28a5e, roughness: 0.5 }),
    fabric: new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 1 }),
    fabricGray: new THREE.MeshStandardMaterial({ color: 0xa89c8a, roughness: 1 }),
    leather: new THREE.MeshStandardMaterial({ color: 0xcfc6b4, roughness: 0.8 }),
    accent: new THREE.MeshStandardMaterial({ color: 0x7a8aa0, roughness: 0.9 }),
    purple: new THREE.MeshStandardMaterial({ color: 0x9a6bb5, roughness: 0.9 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x3a3a3e, roughness: 0.35, metalness: 0.8 }),
    steel: new THREE.MeshStandardMaterial({ color: 0xb8bcc0, roughness: 0.25, metalness: 0.9 }),
    glass: new THREE.MeshStandardMaterial({ color: 0xaac8d8, transparent: true, opacity: 0.22, roughness: 0.08, metalness: 0.1 }),
    white: new THREE.MeshStandardMaterial({ color: 0xf5f5f2, roughness: 0.3 }),
    black: new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.4 }),
    green: new THREE.MeshStandardMaterial({ color: 0x4d7a3f, roughness: 1 }),
    green2: new THREE.MeshStandardMaterial({ color: 0x69955a, roughness: 1 }),
    rug: new THREE.MeshStandardMaterial({ color: 0xcfc4ae, roughness: 1 }),
    rugDark: new THREE.MeshStandardMaterial({ color: 0x9b8f7a, roughness: 1 }),
    bed: new THREE.MeshStandardMaterial({ color: 0xe8e2d6, roughness: 1 }),
    bedBlue: new THREE.MeshStandardMaterial({ color: 0x6d83a0, roughness: 1 }),
    lampGlow: new THREE.MeshStandardMaterial({ color: 0xfff6e0, emissive: 0xffd9a0, emissiveIntensity: 0.15 }),
    tvScreen: new THREE.MeshStandardMaterial({ color: 0x0a0a10, emissive: 0x1d3050, emissiveIntensity: 0.9, roughness: 0.2 }),
    bigScreen: new THREE.MeshStandardMaterial({ color: 0x05070c, emissive: 0x27405e, emissiveIntensity: 1.1, roughness: 0.2 }),
    counter: new THREE.MeshStandardMaterial({ color: 0xe6e1d8, roughness: 0.25 }),
  };
  app.glowMats.push(M.lampGlow);

  function box(w, h, d, mat, x, z, y = null, parent = group, shadow = true) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(PX(x), y === null ? h / 2 : y, PZ(z));
    m.castShadow = shadow;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  function cyl(r, h, mat, x, z, y = null) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 20), mat);
    m.position.set(PX(x), y === null ? h / 2 : y, PZ(z));
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  }

  function col(x0, z0, x1, z1) {
    colliders.push({ minX: PX(x0), maxX: PX(x1), minZ: PZ(z0), maxZ: PZ(z1) });
  }

  function wallX(z, x0, x1, openings = [], t = 0.12, mat = M.wallInt) {
    const ops = [...openings].sort((a, b) => a.a - b.a);
    let cur = x0;
    const solid = (a, b) => {
      if (b - a < 0.01) return;
      box(b - a, H, t, mat, (a + b) / 2, z, H / 2);
      col(a, z - t / 2, b, z + t / 2);
    };
    for (const o of ops) {
      solid(cur, o.a);
      if (o.bottom > 0) {
        box(o.b - o.a, o.bottom, t, mat, (o.a + o.b) / 2, z, o.bottom / 2);
        col(o.a, z - t / 2, o.b, z + t / 2);
      }
      if (o.top < H) box(o.b - o.a, H - o.top, t, mat, (o.a + o.b) / 2, z, (H + o.top) / 2);
      if (o.bottom > 0) {
        box(o.b - o.a, o.top - o.bottom, 0.03, M.glass, (o.a + o.b) / 2, z, (o.bottom + o.top) / 2, group, false);
      }
      cur = o.b;
    }
    solid(cur, x1);
  }

  function wallZ(x, z0, z1, openings = [], t = 0.12, mat = M.wallInt) {
    const ops = [...openings].sort((a, b) => a.a - b.a);
    let cur = z0;
    const solid = (a, b) => {
      if (b - a < 0.01) return;
      box(t, H, b - a, mat, x, (a + b) / 2, H / 2);
      col(x - t / 2, a, x + t / 2, b);
    };
    for (const o of ops) {
      solid(cur, o.a);
      if (o.bottom > 0) {
        box(t, o.bottom, o.b - o.a, mat, x, (o.a + o.b) / 2, o.bottom / 2);
        col(x - t / 2, o.a, x + t / 2, o.b);
      }
      if (o.top < H) box(t, H - o.top, o.b - o.a, mat, x, (o.a + o.b) / 2, (H + o.top) / 2);
      if (o.bottom > 0) {
        box(0.03, o.top - o.bottom, o.b - o.a, M.glass, x, (o.a + o.b) / 2, (o.bottom + o.top) / 2, group, false);
      }
      cur = o.b;
    }
    solid(cur, z1);
  }

  const WIN = (a, b) => ({ a, b, bottom: 0.9, top: 2.4 });
  const WINH = (a, b) => ({ a, b, bottom: 1.3, top: 2.3 });
  const DOOR = (a, b) => ({ a, b, bottom: 0, top: 2.1 });

  wallX(0, 0, 16.2, [WIN(0.9, 2.3), WINH(3.2, 4.2), WIN(5.5, 7.0), WIN(8.5, 10.3), WIN(11.1, 12.1), WIN(13.2, 15.4)], 0.24, M.wallExt);
  wallX(9.5, 0, 10.8, [WIN(0.8, 2.8), WIN(4.2, 6.0), { a: 6.9, b: 9.3, bottom: 0, top: 2.3 }, WIN(9.6, 10.6)], 0.24, M.wallExt);
  wallZ(0, 0, 9.5, [WINH(4.0, 5.0), WIN(6.5, 8.5)], 0.24, M.wallExt);
  wallZ(16.2, 0, 7.6, [WIN(1.0, 3.0), DOOR(6.2, 7.4)], 0.24, M.wallExt);
  wallX(7.6, 10.8, 16.2, [], 0.24, M.wallExt);
  wallZ(10.8, 7.6, 9.5, [], 0.24, M.wallExt);

  wallZ(2.8, 0, 3.4);
  wallZ(4.6, 0, 3.4);
  wallZ(7.6, 0, 3.4);
  wallZ(10.8, 0, 3.4);
  wallZ(12.4, 0, 5.6, [DOOR(4.3, 5.1)]);
  wallX(3.4, 0, 2.8, [DOOR(1.9, 2.7)]);
  wallX(3.4, 2.8, 4.6, [DOOR(3.7, 4.5)]);
  wallX(3.4, 4.6, 7.6, [DOOR(6.6, 7.4)]);
  wallX(3.4, 10.8, 12.4, [DOOR(11.0, 11.8)]);
  wallZ(1.8, 3.4, 5.6, [DOOR(4.6, 5.4)]);
  wallX(5.6, 0, 1.8);
  wallX(5.6, 1.8, 3.6, [DOOR(2.7, 3.5)]);
  wallX(5.6, 3.6, 6.6, [DOOR(3.9, 4.7)]);
  wallX(5.6, 12.4, 16.2);
  wallZ(3.6, 5.6, 9.5);
  wallZ(6.6, 5.6, 9.5);
  wallZ(10.8, 5.6, 7.6);

  box(16.2, 0.1, 7.6, M.tile, 8.1, 3.8, -0.05, group, false).receiveShadow = true;
  box(10.8, 0.1, 1.9, M.tile, 5.4, 8.55, -0.05, group, false);
  box(7.2, 0.1, 1.6, M.tileGray, 7.2, 10.3, -0.05, group, false);

  const woodRooms = [[0, 0, 2.8, 3.4], [4.6, 0, 7.6, 3.4], [0, 5.6, 3.6, 9.5], [3.6, 5.6, 6.6, 9.5], [12.4, 0, 16.2, 5.6], [6.6, 5.6, 10.8, 9.5]];
  for (const [x0, z0, x1, z1] of woodRooms) {
    box(x1 - x0 - 0.1, 0.03, z1 - z0 - 0.1, M.woodFloor, (x0 + x1) / 2, (z0 + z1) / 2, 0.015, group, false);
  }

  box(16.2, 0.08, 7.6, M.white, 8.1, 3.8, H + 0.04, ceilingGroup, false);
  box(10.8, 0.08, 1.9, M.white, 5.4, 8.55, H + 0.04, ceilingGroup, false);

  box(0.08, 2.1, 1.2, M.woodDark, 16.2, 6.8, 1.05);
  box(0.03, 0.1, 0.3, M.steel, 16.05, 6.8, 1.0);
  col(16.0, 6.2, 16.4, 7.4);

  function railing(x0, z0, x1, z1) {
    const w = Math.max(x1 - x0, 0.06), d = Math.max(z1 - z0, 0.06);
    box(w, 0.06, d, M.metal, (x0 + x1) / 2, z0 === z1 ? z0 : (z0 + z1) / 2, 1.1);
    box(w, 0.9, d, M.glass, (x0 + x1) / 2, z0 === z1 ? z0 : (z0 + z1) / 2, 0.6, group, false);
    col(x0 - 0.05, z0 - 0.05, x1 + 0.05, z1 + 0.05);
  }
  railing(3.6, 11.05, 10.8, 11.15);
  railing(3.55, 9.5, 3.65, 11.1);
  railing(10.75, 9.5, 10.85, 11.1);

  function bed(x, z, rot, w, l, matBlue) {
    const g = new THREE.Group();
    g.position.set(PX(x), 0, PZ(z));
    g.rotation.y = rot;
    group.add(g);
    const add = (mw, mh, md, mat, mx, my, mz) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(mw, mh, md), mat);
      m.position.set(mx, my, mz);
      m.castShadow = m.receiveShadow = true;
      g.add(m);
    };
    add(l, 0.28, w, M.woodDark, 0, 0.16, 0);
    add(l - 0.1, 0.22, w - 0.1, M.bed, 0.05, 0.4, 0);
    add(0.1, 1.05, w, M.wood, -l / 2, 0.55, 0);
    add(0.42, 0.14, w * 0.36, M.bed, -l / 2 + 0.32, 0.56, -w * 0.22);
    add(0.42, 0.14, w * 0.36, M.bed, -l / 2 + 0.32, 0.56, w * 0.22);
    add(l * 0.42, 0.07, w - 0.06, matBlue, l * 0.24, 0.52, 0);
    const r = Math.abs(rot) < 0.01 ? { x0: x - l / 2, x1: x + l / 2, z0: z - w / 2, z1: z + w / 2 }
      : { x0: x - l / 2, x1: x + l / 2, z0: z - w / 2, z1: z + w / 2 };
    col(r.x0, r.z0, r.x1, r.z1);
  }

  function sofa(x, z, rot, w, mat = M.fabric) {
    const g = new THREE.Group();
    g.position.set(PX(x), 0, PZ(z));
    g.rotation.y = rot;
    group.add(g);
    const add = (mw, mh, md, m2, mx, my, mz) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(mw, mh, md), m2);
      m.position.set(mx, my, mz);
      m.castShadow = m.receiveShadow = true;
      g.add(m);
    };
    add(w, 0.35, 0.95, mat, 0, 0.22, 0);
    add(w, 0.65, 0.22, mat, 0, 0.62, -0.38);
    add(0.22, 0.5, 0.95, mat, -w / 2 + 0.11, 0.5, 0);
    add(0.22, 0.5, 0.95, mat, w / 2 - 0.11, 0.5, 0);
    const n = Math.max(2, Math.round(w / 0.8));
    for (let i = 0; i < n; i++) {
      add((w - 0.5) / n - 0.04, 0.14, 0.8, M.leather, -((w - 0.5) / 2) + ((w - 0.5) / n) * (i + 0.5), 0.45, 0.03);
    }
    col(x - w / 2, z - 0.55, x + w / 2, z + 0.55);
  }

  function chair(x, z, rot, mat = M.woodDark) {
    const g = new THREE.Group();
    g.position.set(PX(x), 0, PZ(z));
    g.rotation.y = rot;
    group.add(g);
    const add = (mw, mh, md, m2, mx, my, mz) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(mw, mh, md), m2);
      m.position.set(mx, my, mz);
      m.castShadow = true;
      g.add(m);
    };
    add(0.44, 0.06, 0.44, mat, 0, 0.45, 0);
    add(0.44, 0.5, 0.05, mat, 0, 0.72, -0.2);
    add(0.05, 0.45, 0.05, mat, -0.18, 0.22, -0.18);
    add(0.05, 0.45, 0.05, mat, 0.18, 0.22, -0.18);
    add(0.05, 0.45, 0.05, mat, -0.18, 0.22, 0.18);
    add(0.05, 0.45, 0.05, mat, 0.18, 0.22, 0.18);
  }

  function table(x, z, w, d, h = 0.74, mat = M.wood) {
    box(w, 0.05, d, mat, x, z, h);
    box(w - 0.2, h - 0.06, d - 0.2, M.woodDark, x, z, (h - 0.06) / 2, group, false);
  }

  function wardrobe(x, z, rot, w) {
    const g = new THREE.Group();
    g.position.set(PX(x), 0, PZ(z));
    g.rotation.y = rot;
    group.add(g);
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, 2.2, 0.58), M.woodLight);
    m.position.y = 1.1;
    m.castShadow = m.receiveShadow = true;
    g.add(m);
    col(x - (rot === 0 ? w / 2 : 0.3), z - (rot === 0 ? 0.3 : w / 2), x + (rot === 0 ? w / 2 : 0.3), z + (rot === 0 ? 0.3 : w / 2));
  }

  function nightstand(x, z) {
    box(0.45, 0.5, 0.45, M.wood, x, z, 0.25);
  }

  function toilet(x, z, rot) {
    const g = new THREE.Group();
    g.position.set(PX(x), 0, PZ(z));
    g.rotation.y = rot;
    group.add(g);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.55), M.white);
    b.position.set(0, 0.19, 0.05); b.castShadow = true; g.add(b);
    const s = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 0.08, 18), M.white);
    s.position.set(0, 0.42, 0.1); g.add(s);
    const t = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.45, 0.16), M.white);
    t.position.set(0, 0.5, -0.26); t.castShadow = true; g.add(t);
  }

  function vanity(x, z, w = 0.8) {
    box(w, 0.5, 0.5, M.wood, x, z, 0.35);
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.12, 18), M.white);
    b.position.set(PX(x), 0.66, PZ(z));
    group.add(b);
    cyl(0.02, 0.25, M.steel, x, z - 0.2, 0.72);
  }

  function shower(x, z) {
    box(0.95, 0.06, 0.95, M.white, x, z, 0.03);
    box(0.9, 1.9, 0.03, M.glass, x, z - 0.46, 1.0, group, false);
    box(0.03, 1.9, 0.9, M.glass, x + 0.46, z, 1.0, group, false);
    cyl(0.02, 1.2, M.steel, x - 0.4, z - 0.4, 1.5);
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.02, 14), M.steel);
    head.position.set(PX(x - 0.3), 2.1, PZ(z - 0.3));
    group.add(head);
    col(x - 0.48, z - 0.48, x + 0.48, z + 0.48);
  }

  function plant(x, z, s = 1) {
    cyl(0.16 * s, 0.3 * s, M.woodDark, x, z, 0.15 * s);
    const f1 = new THREE.Mesh(new THREE.SphereGeometry(0.28 * s, 10, 8), M.green);
    f1.position.set(PX(x), 0.62 * s, PZ(z)); f1.castShadow = true; group.add(f1);
    const f2 = new THREE.Mesh(new THREE.SphereGeometry(0.2 * s, 10, 8), M.green2);
    f2.position.set(PX(x) + 0.12, 0.85 * s, PZ(z)); f2.castShadow = true; group.add(f2);
  }

  function tv(x, z, rot, size = 1.5) {
    const g = new THREE.Group();
    g.position.set(PX(x), 0, PZ(z));
    g.rotation.y = rot;
    group.add(g);
    const console_ = new THREE.Mesh(new THREE.BoxGeometry(size + 0.4, 0.4, 0.4), M.woodDark);
    console_.position.y = 0.25; console_.castShadow = true; g.add(console_);
    const scr = new THREE.Mesh(new THREE.BoxGeometry(size, size * 0.58, 0.05), M.tvScreen);
    scr.position.y = 1.35; g.add(scr);
  }

  function floorLamp(x, z) {
    cyl(0.14, 0.03, M.metal, x, z, 0.015);
    cyl(0.02, 1.4, M.metal, x, z, 0.72);
    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.3, 16, 1, true), M.lampGlow);
    shade.position.set(PX(x), 1.5, PZ(z));
    group.add(shade);
  }

  function ceilingLamp(x, z) {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.05, 20), M.lampGlow);
    m.position.set(PX(x), H - 0.03, PZ(z));
    ceilingGroup.add(m);
    const l = new THREE.PointLight(0xffd9a8, 1.2, 7, 1.6);
    l.position.set(PX(x), H - 0.25, PZ(z));
    scene.add(l);
    app.indoorLights.push(l);
  }

  function rug(x, z, w, d, mat = M.rug) {
    box(w, 0.025, d, mat, x, z, 0.045, group, false);
  }

  bed(1.35, 1.5, 0, 1.5, 2.0, M.bedBlue);
  nightstand(0.42, 0.4);
  nightstand(0.42, 2.6);
  wardrobe(1.5, 3.05, 0, 2.0);
  rug(1.5, 1.6, 2.2, 1.8);
  ceilingLamp(1.4, 1.7);

  shower(3.25, 0.6);
  toilet(3.05, 1.75, Math.PI / 2);
  vanity(3.75, 2.85, 0.8);
  ceilingLamp(3.7, 1.7);

  const shelf = new THREE.Group();
  shelf.position.set(PX(4.85), 0, PZ(1.7));
  group.add(shelf);
  {
    const fr = new THREE.Mesh(new THREE.BoxGeometry(0.32, 2.2, 2.6), M.wood);
    fr.position.y = 1.1; fr.castShadow = true; shelf.add(fr);
    const bookCols = [0xa0522d, 0x556b2f, 0x4a678b, 0x8b6f47, 0x705062];
    for (let i = 0; i < 4; i++) {
      for (let k = 0; k < 5; k++) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.3, 0.16 + rnd() * 0.2),
          new THREE.MeshStandardMaterial({ color: bookCols[(i + k) % 5], roughness: 0.9 }));
        b.position.set(0.06, 0.45 + i * 0.5, -1.0 + k * 0.5);
        shelf.add(b);
      }
    }
  }
  col(4.65, 0.4, 5.05, 3.0);
  table(6.2, 0.85, 1.5, 0.7, 0.74, M.woodDark);
  chair(6.2, 1.55, Math.PI);
  chair(5.6, 0.35, 0); chair(6.8, 0.35, 0);
  const lounge = new THREE.Group();
  lounge.position.set(PX(6.9), 0, PZ(2.7));
  lounge.rotation.y = -2.4;
  group.add(lounge);
  {
    const a = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.4, 0.7), M.leather);
    a.position.y = 0.25; a.castShadow = true; lounge.add(a);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.15), M.leather);
    b.position.set(0, 0.6, -0.3); b.rotation.x = -0.25; b.castShadow = true; lounge.add(b);
  }
  col(6.5, 2.3, 7.3, 3.1);
  rug(6.1, 1.7, 2.4, 2.2, M.rugDark);
  ceilingLamp(6.1, 1.7);

  table(9.2, 1.7, 1.7, 0.9, 0.74, M.woodLight);
  chair(8.6, 1.0, Math.PI); chair(9.2, 1.0, Math.PI); chair(9.8, 1.0, Math.PI);
  chair(8.6, 2.4, 0); chair(9.2, 2.4, 0); chair(9.8, 2.4, 0);
  chair(8.15, 1.7, Math.PI / 2); chair(10.25, 1.7, -Math.PI / 2);
  col(8.3, 1.2, 10.1, 2.2);
  plant(7.85, 0.35, 0.8);
  ceilingLamp(9.2, 1.7);

  box(1.4, 0.9, 0.62, M.woodLight, 11.6, 0.42, 0.45);
  box(1.4, 0.04, 0.66, M.counter, 11.6, 0.42, 0.92);
  box(0.62, 0.9, 1.2, M.woodLight, 12.05, 1.6, 0.45);
  box(0.66, 0.04, 1.2, M.counter, 12.05, 1.6, 0.92);
  box(0.5, 0.02, 0.35, M.black, 12.05, 1.5, 0.95);
  cyl(0.07, 0.015, M.steel, 12.05, 1.35, 0.96);
  cyl(0.07, 0.015, M.steel, 12.05, 1.68, 0.96);
  box(0.45, 0.12, 0.35, M.steel, 11.6, 0.42, 0.95);
  cyl(0.02, 0.3, M.steel, 11.6, 0.15, 1.05);
  box(0.62, 1.8, 0.62, M.steel, 11.15, 2.95, 0.9);
  col(10.9, 0.1, 12.35, 0.75);
  col(11.75, 1.0, 12.35, 2.25);
  col(10.85, 2.65, 11.5, 3.3);
  ceilingLamp(11.6, 1.7);

  const scr = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.8, 0.08), M.bigScreen);
  scr.position.set(PX(14.3), 1.55, PZ(0.2));
  group.add(scr);
  box(3.4, 0.06, 0.1, M.black, 14.3, 0.2, 2.5);
  box(0.3, 0.55, 0.3, M.black, 12.75, 0.4);
  box(0.3, 0.55, 0.3, M.black, 15.85, 0.4);
  sofa(14.3, 2.2, Math.PI, 2.8, M.leather);
  const treadmill = new THREE.Group();
  treadmill.position.set(PX(15.5), 0, PZ(4.0));
  group.add(treadmill);
  {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.14, 1.7), M.black);
    base.position.y = 0.08; base.castShadow = true; treadmill.add(base);
    const p1 = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.3, 0.05), M.metal);
    p1.position.set(-0.3, 0.7, -0.75); p1.castShadow = true; treadmill.add(p1);
    const p2 = p1.clone(); p2.position.x = 0.3; treadmill.add(p2);
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.3, 0.06), M.tvScreen);
    panel.position.set(0, 1.35, -0.78); panel.rotation.x = 0.4; treadmill.add(panel);
  }
  col(15.1, 3.1, 15.9, 4.9);
  const bike = new THREE.Group();
  bike.position.set(PX(14.2), 0, PZ(4.0));
  group.add(bike);
  {
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.1, 1.1), M.metal);
    base.position.y = 0.06; base.castShadow = true; bike.add(base);
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.8, 0.05), M.metal);
    post.position.set(0, 0.5, -0.35); post.rotation.x = 0.3; bike.add(post);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.05), M.black);
    handle.position.set(0, 0.95, -0.5); bike.add(handle);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.06, 0.3), M.black);
    seat.position.set(0, 0.85, 0.25); bike.add(seat);
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 18), M.black);
    wheel.rotation.z = Math.PI / 2; wheel.position.set(0, 0.3, 0.05); bike.add(wheel);
  }
  col(13.9, 3.4, 14.5, 4.6);
  box(0.65, 0.02, 1.6, M.purple, 13.1, 3.9, 0.03, group, false);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 12), M.purple);
  ball.position.set(PX(13.1), 0.28, PZ(4.75));
  ball.castShadow = true;
  group.add(ball);
  plant(15.8, 2.7, 1);
  rug(14.3, 2.6, 3.2, 2.0, M.rugDark);
  ceilingLamp(14.3, 2.6);

  shower(0.55, 3.95);
  toilet(1.3, 3.9, Math.PI);
  vanity(0.6, 5.1, 0.7);
  ceilingLamp(0.9, 4.5);

  bed(1.45, 7.55, 0, 1.8, 2.2, M.bedBlue);
  nightstand(0.42, 6.25);
  nightstand(0.42, 8.85);
  tv(3.42, 7.55, -Math.PI / 2, 1.4);
  rug(1.9, 7.6, 2.6, 2.4);
  floorLamp(3.1, 9.0);
  ceilingLamp(1.8, 7.5);

  bed(5.25, 7.55, Math.PI, 1.6, 2.1, M.fabricGray);
  nightstand(6.2, 6.55);
  nightstand(6.2, 8.55);
  wardrobe(4.8, 5.95, 0, 1.7);
  rug(5.0, 7.6, 2.4, 2.2);
  ceilingLamp(5.1, 7.5);

  rug(8.7, 7.6, 2.8, 2.4);
  sofa(8.7, 6.35, 0, 2.1);
  sofa(7.25, 7.7, Math.PI / 2, 2.2);
  box(1.2, 0.35, 0.7, M.woodLight, 8.8, 7.7, 0.2);
  box(1.3, 0.04, 0.8, M.counter, 8.8, 7.7, 0.4);
  const arm = new THREE.Group();
  arm.position.set(PX(9.4), 0, PZ(8.75));
  arm.rotation.y = Math.PI + 0.5;
  group.add(arm);
  {
    const a = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.4, 0.75), M.fabricGray);
    a.position.y = 0.25; a.castShadow = true; arm.add(a);
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.6, 0.16), M.fabricGray);
    b.position.set(0, 0.6, -0.32); b.rotation.x = -0.2; b.castShadow = true; arm.add(b);
  }
  col(9.0, 8.35, 9.8, 9.15);
  box(0.06, 2.3, 2.4, M.wood, 10.7, 6.7, 1.15, group, false);
  tv(10.55, 6.7, -Math.PI / 2, 1.6);
  plant(10.3, 9.05, 1.1);
  floorLamp(7.0, 6.05);
  ceilingLamp(8.7, 7.5);
  ceilingLamp(6.0, 4.5);

  box(1.6, 0.95, 0.5, M.woodLight, 13.4, 5.95, 0.48);
  box(1.0, 0.42, 0.35, M.wood, 11.6, 6.9, 0.21);
  rug(15.1, 6.8, 1.2, 1.4, M.rugDark);
  col(12.6, 5.65, 14.2, 6.25);
  ceilingLamp(13.0, 6.6);

  plant(4.2, 10.4, 1.2);
  plant(4.7, 10.1, 0.8);
  plant(4.5, 10.7, 0.9);
  cyl(0.35, 0.4, M.wood, 5.8, 10.4, 0.4);
  cyl(0.05, 0.4, M.wood, 5.8, 10.4, 0.2);
  cyl(0.16, 0.35, M.fabricGray, 6.5, 10.2, 0.18);
  cyl(0.16, 0.35, M.fabricGray, 5.2, 10.7, 0.18);
  box(0.62, 0.85, 0.6, M.white, 10.35, 10.0, 0.43);
  box(0.62, 0.04, 0.62, M.counter, 10.35, 10.0, 0.87);
  box(0.9, 0.85, 0.55, M.woodLight, 10.3, 10.75, 0.43);
  box(0.4, 0.1, 0.35, M.steel, 10.3, 10.75, 0.9);
  col(10.0, 9.65, 10.7, 11.05);

  const rooms = [
    { name: '次卧', x0: 0, z0: 0, x1: 2.8, z1: 3.4 },
    { name: '卫生间', x0: 2.8, z0: 0, x1: 4.6, z1: 3.4 },
    { name: '书房', x0: 4.6, z0: 0, x1: 7.6, z1: 3.4 },
    { name: '餐厅', x0: 7.6, z0: 0, x1: 10.8, z1: 3.4 },
    { name: '厨房', x0: 10.8, z0: 0, x1: 12.4, z1: 3.4 },
    { name: '多功能影音健身房', x0: 12.4, z0: 0, x1: 16.2, z1: 5.6 },
    { name: '主卫', x0: 0, z0: 3.4, x1: 1.8, z1: 5.6 },
    { name: '过道', x0: 1.8, z0: 3.4, x1: 12.4, z1: 5.6 },
    { name: '主卧', x0: 0, z0: 5.6, x1: 3.6, z1: 9.5 },
    { name: '次卧', x0: 3.6, z0: 5.6, x1: 6.6, z1: 9.5 },
    { name: '客厅', x0: 6.6, z0: 5.6, x1: 10.8, z1: 9.5 },
    { name: '玄关', x0: 10.8, z0: 5.6, x1: 16.2, z1: 7.6 },
    { name: '阳台', x0: 3.6, z0: 9.5, x1: 10.8, z1: 11.1 },
  ];

  return {
    colliders,
    rooms,
    spawn: { x: PX(14.6), z: PZ(6.8), yaw: Math.PI / 2 },
    ceilingGroup,
  };
}
