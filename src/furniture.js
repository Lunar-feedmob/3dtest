import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

function B(g, w, h, d, mat, x, y, z, ry = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  m.rotation.y = ry
  m.castShadow = true
  m.receiveShadow = true
  g.add(m)
  return m
}

function RB(g, w, h, d, r, mat, x, y, z) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2)), mat)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  g.add(m)
  return m
}

function CYL(g, rt, rb, h, mat, x, y, z, seg = 20, rx = 0, rz = 0) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat)
  m.position.set(x, y, z)
  m.rotation.x = rx
  m.rotation.z = rz
  m.castShadow = true
  m.receiveShadow = true
  g.add(m)
  return m
}

function G(scene, x, z, ry) {
  const g = new THREE.Group()
  g.position.set(x, 0, z)
  g.rotation.y = ry || 0
  scene.add(g)
  return g
}

function colC(C, x, z, w, d, ry = 0) {
  const c = Math.abs(Math.cos(ry)), s = Math.abs(Math.sin(ry))
  const hw = (w * c + d * s) / 2, hd = (w * s + d * c) / 2
  C.push({ x0: x - hw, z0: z - hd, x1: x + hw, z1: z + hd })
}

function artTex(c1, c2) {
  const cv = document.createElement('canvas')
  cv.width = cv.height = 128
  const g = cv.getContext('2d')
  const gr = g.createLinearGradient(0, 0, 128, 128)
  gr.addColorStop(0, c1)
  gr.addColorStop(1, c2)
  g.fillStyle = gr
  g.fillRect(0, 0, 128, 128)
  g.fillStyle = 'rgba(255,255,255,0.25)'
  for (let i = 0; i < 5; i++) g.beginPath(), g.arc(Math.random() * 128, Math.random() * 128, 8 + Math.random() * 20, 0, 7), g.fill()
  const t = new THREE.CanvasTexture(cv)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export function buildFurniture(scene, M, C) {
  const sofa = (x, z, ry, seats, mat) => {
    const g = G(scene, x, z, ry)
    const w = seats * 0.72 + 0.44
    RB(g, w, 0.32, 0.95, 0.07, mat, 0, 0.22, 0)
    RB(g, w, 0.62, 0.22, 0.07, mat, 0, 0.62, -0.38)
    RB(g, 0.22, 0.52, 0.95, 0.07, mat, -(w / 2 - 0.11), 0.34, 0)
    RB(g, 0.22, 0.52, 0.95, 0.07, mat, (w / 2 - 0.11), 0.34, 0)
    for (let i = 0; i < seats; i++) {
      const cx = (i - (seats - 1) / 2) * 0.7
      RB(g, 0.64, 0.16, 0.6, 0.06, M.pillow, cx, 0.44, 0.08)
      const bc = RB(g, 0.64, 0.42, 0.14, 0.06, M.pillow, cx, 0.66, -0.26)
      bc.rotation.x = -0.12
    }
    colC(C, x, z, 0.95, w, ry + Math.PI / 2)
    return g
  }

  const coffeeTable = (x, z, w = 1.2, d = 0.7) => {
    const g = G(scene, x, z, 0)
    RB(g, w, 0.06, d, 0.02, M.marble, 0, 0.4, 0)
    B(g, w - 0.2, 0.34, d - 0.2, M.woodDark, 0, 0.2, 0)
    return g
  }

  const chair = (x, z, ry, mat) => {
    const g = G(scene, x, z, ry)
    RB(g, 0.45, 0.08, 0.45, 0.03, mat || M.woodLight, 0, 0.45, 0)
    const b = B(g, 0.45, 0.5, 0.05, mat || M.woodLight, 0, 0.74, -0.2)
    b.rotation.x = 0.08
    for (const [lx, lz] of [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]])
      CYL(g, 0.02, 0.02, 0.45, M.woodDark, lx, 0.22, lz)
    return g
  }

  const bed = (x, z, ry, w) => {
    const g = G(scene, x, z, ry)
    B(g, w + 0.15, 0.22, 2.15, M.woodDark, 0, 0.12, 0)
    B(g, w + 0.15, 1.05, 0.08, M.woodDark, 0, 0.6, -1.08)
    B(g, w + 0.2, 0.06, 0.1, M.led, 0, 1.14, -1.08)
    RB(g, w, 0.24, 2.0, 0.07, M.bed, 0, 0.35, 0.02)
    RB(g, w + 0.06, 0.1, 1.15, 0.04, M.blanket, 0, 0.47, 0.42)
    const p1 = RB(g, 0.62, 0.16, 0.4, 0.07, M.pillow, -w / 4 - 0.05, 0.53, -0.72)
    p1.rotation.x = 0.25
    const p2 = RB(g, 0.62, 0.16, 0.4, 0.07, M.pillow, w / 4 + 0.05, 0.53, -0.72)
    p2.rotation.x = 0.25
    colC(C, x, z, 2.2, w + 0.2, ry)
    return g
  }

  const nightstand = (x, z) => {
    const g = G(scene, x, z, 0)
    RB(g, 0.45, 0.45, 0.4, 0.02, M.woodDark, 0, 0.25, 0)
    CYL(g, 0.05, 0.07, 0.22, M.lamp, 0, 0.6, 0)
    return g
  }

  const wardrobe = (x, z, ry, w) => {
    const g = G(scene, x, z, ry)
    B(g, w, 2.3, 0.6, M.lacquer, 0, 1.15, 0)
    B(g, 0.02, 2.2, 0.62, M.woodDark, 0, 1.15, 0)
    B(g, 0.03, 0.5, 0.03, M.metalDark, -0.08, 1.2, 0.31)
    B(g, 0.03, 0.5, 0.03, M.metalDark, 0.08, 1.2, 0.31)
    colC(C, x, z, 0.6, w, ry + Math.PI / 2)
    return g
  }

  const tvUnit = (x, z, ry, w = 1.8) => {
    const g = G(scene, x, z, ry)
    B(g, w, 0.4, 0.42, M.woodDark, 0, 0.25, 0)
    B(g, w * 0.85, 0.85, 0.05, M.black, 0, 1.45, -0.16)
    const sc = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.82, 0.8), M.screen)
    sc.position.set(0, 1.45, -0.13)
    g.add(sc)
    return g
  }

  const plant = (x, z, s = 1) => {
    const g = G(scene, x, z, 0)
    CYL(g, 0.16 * s, 0.13 * s, 0.3 * s, M.pot, 0, 0.15 * s, 0)
    CYL(g, 0.025 * s, 0.03 * s, 0.5 * s, M.woodDark, 0, 0.5 * s, 0)
    const l1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.28 * s, 0), M.plant)
    l1.position.set(0, 0.95 * s, 0)
    l1.castShadow = true
    g.add(l1)
    const l2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2 * s, 0), M.plant2)
    l2.position.set(0.15 * s, 0.75 * s, 0.1 * s)
    l2.castShadow = true
    g.add(l2)
    const l3 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.18 * s, 0), M.plant2)
    l3.position.set(-0.14 * s, 0.8 * s, -0.08 * s)
    l3.castShadow = true
    g.add(l3)
    return g
  }

  const floorLamp = (x, z) => {
    const g = G(scene, x, z, 0)
    CYL(g, 0.14, 0.16, 0.03, M.metalDark, 0, 0.02, 0)
    CYL(g, 0.015, 0.015, 1.5, M.metalDark, 0, 0.78, 0)
    CYL(g, 0.16, 0.2, 0.3, M.lamp, 0, 1.55, 0)
    return g
  }

  const pendant = (x, z, y = 2.1) => {
    const g = G(scene, x, z, 0)
    CYL(g, 0.008, 0.008, 2.9 - y, M.black, 0, (2.9 + y) / 2, 0)
    CYL(g, 0.16, 0.22, 0.24, M.black, 0, y, 0)
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), M.lamp)
    bulb.position.set(0, y - 0.12, 0)
    g.add(bulb)
    return g
  }

  const curtain = (x, z, ry, w = 0.9) => {
    const geo = new THREE.PlaneGeometry(w, 2.5, 24, 1)
    const p = geo.attributes.position
    for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 16) * 0.07)
    geo.computeVertexNormals()
    const m = new THREE.Mesh(geo, M.curtain)
    m.position.set(x, 1.35, z)
    m.rotation.y = ry
    m.castShadow = true
    scene.add(m)
    return m
  }

  const rug = (x, z, w, d, mat) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat || M.rug)
    m.rotation.x = -Math.PI / 2
    m.position.set(x, 0.015, z)
    m.receiveShadow = true
    scene.add(m)
    return m
  }

  const art = (x, z, ry, w = 1.2, h = 0.8, c1 = '#8a6f4d', c2 = '#d9c8a8') => {
    const g = G(scene, x, z, ry)
    B(g, w + 0.08, h + 0.08, 0.04, M.black, 0, 1.6, 0)
    const t = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: artTex(c1, c2), roughness: 0.8 }))
    t.position.set(0, 1.6, 0.025)
    g.add(t)
    return g
  }

  const toilet = (x, z, ry) => {
    const g = G(scene, x, z, ry)
    RB(g, 0.38, 0.36, 0.55, 0.08, M.ceramic, 0, 0.18, 0.05)
    RB(g, 0.4, 0.07, 0.48, 0.03, M.ceramic, 0, 0.4, 0.08)
    B(g, 0.42, 0.42, 0.16, M.ceramic, 0, 0.62, -0.26)
    return g
  }

  const vanity = (x, z, ry, w = 1.2) => {
    const g = G(scene, x, z, ry)
    B(g, w, 0.5, 0.5, M.woodDark, 0, 0.55, 0)
    B(g, w + 0.06, 0.05, 0.56, M.marble, 0, 0.83, 0)
    CYL(g, 0.17, 0.14, 0.12, M.ceramic, -w / 4, 0.9, 0)
    CYL(g, 0.17, 0.14, 0.12, M.ceramic, w / 4, 0.9, 0)
    CYL(g, 0.015, 0.015, 0.25, M.metal, 0, 0.98, -0.2)
    const mir = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.9), M.mirror)
    mir.position.set(0, 1.7, -0.27)
    g.add(mir)
    return g
  }

  const shower = (x, z, ry) => {
    const g = G(scene, x, z, ry)
    const p1 = B(g, 0.9, 2.0, 0.02, M.glass, 0.45, 1.0, 0)
    p1.castShadow = false
    const p2 = B(g, 0.02, 2.0, 0.9, M.glass, 0, 1.0, 0.45)
    p2.castShadow = false
    B(g, 0.9, 0.04, 0.04, M.metal, 0.45, 2.0, 0)
    B(g, 0.04, 0.04, 0.9, M.metal, 0, 2.0, 0.45)
    CYL(g, 0.02, 0.02, 0.4, M.metal, 0, 2.2, 0.1, 12, Math.PI / 2)
    CYL(g, 0.1, 0.1, 0.02, M.metal, 0, 2.38, 0.28)
    return g
  }

  const bathtub = (x, z, ry) => {
    const g = G(scene, x, z, ry)
    RB(g, 0.8, 0.55, 1.7, 0.06, M.ceramic, 0, 0.28, 0)
    B(g, 0.6, 0.06, 1.5, M.glass, 0, 0.56, 0)
    CYL(g, 0.02, 0.02, 0.3, M.metal, 0, 0.7, -0.75)
    colC(C, x, z, 1.7, 0.8, ry)
    return g
  }

  const desk = (x, z, ry, w = 1.6) => {
    const g = G(scene, x, z, ry)
    B(g, w, 0.05, 0.7, M.woodLight, 0, 0.74, 0)
    B(g, 0.05, 0.72, 0.65, M.woodDark, -(w / 2 - 0.05), 0.37, 0)
    B(g, 0.05, 0.72, 0.65, M.woodDark, (w / 2 - 0.05), 0.37, 0)
    B(g, 0.4, 0.03, 0.25, M.black, 0.3, 0.78, -0.1)
    const scr = B(g, 0.5, 0.32, 0.02, M.black, 0.3, 0.98, -0.2)
    scr.rotation.x = -0.1
    colC(C, x, z, 0.7, w, ry + Math.PI / 2)
    return g
  }

  const deskChair = (x, z, ry) => {
    const g = G(scene, x, z, ry)
    CYL(g, 0.28, 0.3, 0.03, M.metalDark, 0, 0.03, 0)
    CYL(g, 0.03, 0.03, 0.4, M.metalDark, 0, 0.24, 0)
    RB(g, 0.46, 0.08, 0.46, 0.03, M.leather, 0, 0.48, 0)
    const b = RB(g, 0.44, 0.55, 0.08, 0.03, M.leather, 0, 0.82, -0.22)
    b.rotation.x = -0.1
    return g
  }

  const bookshelf = (x, z, ry, w = 2.4) => {
    const g = G(scene, x, z, ry)
    B(g, w, 2.1, 0.32, M.woodDark, 0, 1.05, -0.02)
    const cols = ['#a35', '#47a', '#ca7', '#6a6', '#88a', '#b73']
    for (let s = 0; s < 4; s++) {
      const sy = 0.35 + s * 0.5
      B(g, w - 0.1, 0.03, 0.3, M.woodLight, 0, sy, 0.02)
      let bx = -w / 2 + 0.15
      while (bx < w / 2 - 0.2) {
        const bw = 0.05 + Math.random() * 0.05
        const bh = 0.26 + Math.random() * 0.14
        const bm = new THREE.MeshStandardMaterial({ color: cols[(Math.random() * 6) | 0], roughness: 0.8 })
        B(g, bw, bh, 0.22, bm, bx, sy + bh / 2 + 0.02, 0.02)
        bx += bw + 0.015
        if (Math.random() < 0.15) bx += 0.1
      }
    }
    colC(C, x, z, 0.35, w, ry + Math.PI / 2)
    return g
  }

  const treadmill = (x, z, ry) => {
    const g = G(scene, x, z, ry)
    B(g, 0.75, 0.16, 1.7, M.metalDark, 0, 0.09, 0)
    B(g, 0.55, 0.03, 1.2, M.black, 0, 0.19, 0.15)
    B(g, 0.05, 1.15, 0.06, M.metalDark, -0.33, 0.7, -0.72)
    B(g, 0.05, 1.15, 0.06, M.metalDark, 0.33, 0.7, -0.72)
    const con = B(g, 0.6, 0.35, 0.06, M.black, 0, 1.32, -0.78)
    con.rotation.x = -0.35
    B(g, 0.04, 0.04, 0.7, M.metal, -0.33, 1.05, -0.4)
    B(g, 0.04, 0.04, 0.7, M.metal, 0.33, 1.05, -0.4)
    colC(C, x, z, 1.8, 0.8, ry)
    return g
  }

  const dumbbellRack = (x, z, ry) => {
    const g = G(scene, x, z, ry)
    B(g, 0.45, 1.1, 0.06, M.metalDark, 0, 0.55, -0.5)
    B(g, 0.45, 1.1, 0.06, M.metalDark, 0, 0.55, 0.5)
    for (const sy of [0.45, 0.85]) {
      B(g, 0.45, 0.04, 1.1, M.metal, 0, sy, 0)
      for (let i = -1; i <= 1; i++) {
        CYL(g, 0.02, 0.02, 0.3, M.metal, 0, sy + 0.08, i * 0.35, 12, 0, Math.PI / 2)
        CYL(g, 0.06, 0.06, 0.08, M.black, 0, sy + 0.08, i * 0.35 - 0.14, 12, Math.PI / 2)
        CYL(g, 0.06, 0.06, 0.08, M.black, 0, sy + 0.08, i * 0.35 + 0.14, 12, Math.PI / 2)
      }
    }
    colC(C, x, z, 0.5, 1.2, ry + Math.PI / 2)
    return g
  }

  const recliner = (x, z, ry) => {
    const g = G(scene, x, z, ry)
    RB(g, 0.62, 0.3, 0.62, 0.06, M.leather, 0, 0.25, 0)
    const bk = RB(g, 0.62, 0.85, 0.18, 0.06, M.leather, 0, 0.72, -0.28)
    bk.rotation.x = -0.18
    RB(g, 0.12, 0.42, 0.7, 0.05, M.leather, -0.36, 0.32, 0)
    RB(g, 0.12, 0.42, 0.7, 0.05, M.leather, 0.36, 0.32, 0)
    const fr = RB(g, 0.5, 0.1, 0.45, 0.04, M.leather, 0, 0.35, 0.5)
    fr.rotation.x = 0.4
    colC(C, x, z, 1.0, 0.85, ry)
    return g
  }

  const washer = (x, z, ry) => {
    const g = G(scene, x, z, ry)
    B(g, 0.6, 0.85, 0.6, M.lacquer, 0, 0.43, 0)
    CYL(g, 0.24, 0.24, 0.03, M.black, 0, 0.45, 0.31, 24, Math.PI / 2)
    B(g, 0.55, 0.1, 0.02, M.metalDark, 0, 0.78, 0.31)
    colC(C, x, z, 0.6, 0.6, ry)
    return g
  }

  const shelves = (x, z, ry, w = 2.0) => {
    const g = G(scene, x, z, ry)
    B(g, w, 2.0, 0.4, M.woodLight, 0, 1.0, 0)
    for (let s = 0; s < 4; s++) B(g, w - 0.08, 0.03, 0.36, M.woodDark, 0, 0.4 + s * 0.5, 0.03)
    for (let s = 0; s < 3; s++) {
      const bx = (Math.random() - 0.5) * (w - 0.6)
      B(g, 0.3, 0.25, 0.3, M.fabric2, bx, 0.55 + s * 0.5, 0.02)
    }
    colC(C, x, z, 0.4, w, ry + Math.PI / 2)
    return g
  }

  rug(3.2, 10.2, 3.6, 3.6)
  B(scene, 0.45, 0.45, 2.2, M.woodDark, 0.38, 0.24, 10.2)
  tvUnit(0.4, 10.2, Math.PI / 2, 2.0)
  sofa(4.9, 10.2, -Math.PI / 2, 3, M.fabric)
  sofa(2.8, 8.95, 0.7, 1, M.fabric2)
  sofa(2.8, 11.45, 2.45, 1, M.fabric2)
  coffeeTable(3.5, 10.2)
  floorLamp(5.2, 8.8)
  plant(0.55, 11.5, 1.2)
  curtain(2.3, 11.7, 0)
  curtain(5.3, 11.7, 0)
  art(6.05, 4.5, -Math.PI / 2, 1.4, 0.9)

  rug(7.1, 7.2, 2.8, 2.6)
  sofa(6.15, 7.4, Math.PI / 2, 3, M.fabric)
  sofa(7.5, 6.3, 0, 2, M.fabric)
  coffeeTable(7.6, 7.5, 1.0, 0.6)
  B(scene, 0.4, 0.45, 1.8, M.woodDark, 9.05, 0.24, 7.4)
  tvUnit(9.0, 7.4, -Math.PI / 2, 1.6)
  plant(9.0, 8.55, 1.0)
  pendant(7.6, 7.4, 2.3)

  B(scene, 1.8, 0.06, 0.9, M.woodLight, 4.45, 0.74, 2.7)
  for (const [lx, lz] of [[-0.8, -0.38], [0.8, -0.38], [-0.8, 0.38], [0.8, 0.38]])
    B(scene, 0.07, 0.72, 0.07, M.woodDark, 4.45 + lx, 0.36, 2.7 + lz)
  B(scene, 0.5, 0.06, 0.35, M.plant2, 4.45, 0.8, 2.7)
  for (const cx of [3.85, 4.45, 5.05]) { chair(cx, 2.0, 0, M.leather); chair(cx, 3.4, Math.PI, M.leather) }
  pendant(4.45, 2.7, 1.9)
  B(scene, 0.4, 0.85, 2.0, M.woodDark, 3.1, 0.43, 2.2)

  B(scene, 2.8, 0.9, 0.6, M.lacquer, 7.6, 0.45, 0.42)
  B(scene, 2.86, 0.05, 0.66, M.marble, 7.6, 0.92, 0.42)
  B(scene, 0.6, 0.9, 2.0, M.lacquer, 6.45, 0.45, 1.7)
  B(scene, 0.66, 0.05, 2.06, M.marble, 6.45, 0.92, 1.7)
  B(scene, 2.6, 0.7, 0.35, M.lacquer, 7.6, 1.75, 0.3)
  B(scene, 0.5, 0.03, 0.4, M.black, 7.9, 0.95, 0.42)
  CYL(scene, 0.015, 0.015, 0.3, M.metal, 7.9, 1.1, 0.2)
  B(scene, 0.55, 0.03, 0.75, M.black, 6.45, 0.96, 1.8)
  for (const bz of [1.6, 2.0]) CYL(scene, 0.07, 0.07, 0.02, M.metalDark, 6.45, 0.98, bz)
  B(scene, 0.5, 0.45, 0.6, M.metal, 6.45, 1.9, 1.8)
  B(scene, 0.7, 1.9, 0.7, M.metal, 8.7, 0.95, 2.45)
  colC(C, 7.6, 0.42, 0.6, 2.8)
  colC(C, 6.45, 1.7, 2.0, 0.6)
  colC(C, 8.7, 2.45, 0.7, 0.7)

  washer(9.55, 0.42, 0)
  washer(10.25, 0.42, 0)
  B(scene, 1.4, 0.6, 0.35, M.lacquer, 9.9, 1.6, 0.3)

  vanity(11.7, 0.4, 0, 1.0)
  toilet(12.55, 1.5, -Math.PI / 2)
  shower(11.5, 1.9, Math.PI / 2)

  bed(14.6, 1.5, 0, 1.5)
  nightstand(13.6, 0.35)
  nightstand(15.6, 0.35)
  wardrobe(14.6, 3.55, Math.PI, 1.8)
  art(14.6, 0.17, 0, 1.4, 0.7, '#6a7a8a', '#c8d4dc')

  bed(18.1, 1.5, 0, 1.5)
  nightstand(17.1, 0.35)
  nightstand(19.1, 0.35)
  wardrobe(16.6, 2.4, -Math.PI / 2, 1.6)
  desk(19.4, 2.8, Math.PI / 2, 1.2)

  shelves(18.3, 4.2, Math.PI, 2.4)
  shelves(19.5, 5.2, -Math.PI / 2, 1.2)

  B(scene, 1.4, 0.9, 0.3, M.woodDark, 1.4, 0.45, 6.1)
  B(scene, 1.6, 1.0, 0.35, M.woodLight, 1.4, 0.5, 8.2)
  rug(1.4, 7.2, 1.6, 2.0)

  bookshelf(9.65, 7.3, Math.PI / 2, 2.4)
  desk(12.5, 7.3, Math.PI / 2, 1.6)
  deskChair(11.9, 7.3, Math.PI / 2)
  sofa(11.4, 6.4, 2.6, 1, M.leather)
  floorLamp(11.8, 6.1)
  art(11.1, 8.85, Math.PI, 1.2, 0.8, '#7a5a3a', '#e0d0b0')

  const mirr = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.6), M.mirror)
  mirr.position.set(15.2, 1.5, 5.99)
  scene.add(mirr)
  treadmill(14.4, 7.7, 0)
  dumbbellRack(16.55, 6.7, -Math.PI / 2)
  B(scene, 0.5, 0.45, 1.2, M.leather, 15.9, 0.3, 8.35)
  B(scene, 1.8, 0.03, 0.7, M.yoga, 15.5, 0.02, 6.5)

  shelves(18.3, 6.2, 0, 2.6)
  shelves(19.5, 7.0, -Math.PI / 2, 1.4)

  vanity(10.4, 9.25, 0, 1.2)
  toilet(11.2, 11.5, -Math.PI / 2)
  shower(9.75, 11.35, 0)

  rug(13.9, 10.7, 3.2, 3.0)
  bed(13.3, 10.7, Math.PI / 2, 1.8)
  nightstand(11.95, 9.5)
  nightstand(11.95, 11.9)
  B(scene, 0.45, 0.42, 1.5, M.blanket, 14.8, 0.22, 10.7)
  wardrobe(15.3, 9.2, 0, 1.8)
  plant(16.4, 12.0, 1.1)
  art(11.66, 10.7, Math.PI / 2, 1.6, 0.9, '#8a6f5d', '#e8d8c0')
  curtain(12.8, 12.2, 0)
  curtain(16.1, 12.2, 0)

  vanity(18.3, 12.0, Math.PI, 1.6)
  bathtub(19.3, 10.6, Math.PI / 2)
  toilet(17.35, 11.9, -Math.PI / 2)
  shower(19.2, 8.5, Math.PI)

  const scrTex = artTex('#1a2a4a', '#4a6a9a')
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.5), new THREE.MeshStandardMaterial({ map: scrTex, emissive: 0xffffff, emissiveMap: scrTex, emissiveIntensity: 1.1, color: 0x000000 }))
  scr.position.set(0.19, 1.5, 2.95)
  scr.rotation.y = Math.PI / 2
  scene.add(scr)
  B(scene, 0.06, 1.7, 2.8, M.wallDark, 0.15, 1.5, 2.95)
  recliner(1.9, 2.2, -Math.PI / 2)
  recliner(1.9, 2.95, -Math.PI / 2)
  recliner(1.9, 3.7, -Math.PI / 2)
  B(scene, 0.35, 1.0, 0.35, M.black, 0.35, 0.5, 0.45)
  B(scene, 0.35, 1.0, 0.35, M.black, 0.35, 0.5, 5.45)
  B(scene, 1.2, 0.45, 0.4, M.woodDark, 1.5, 0.23, 5.6)
  B(scene, 0.04, 0.04, 5.6, M.led, 0.16, 2.78, 2.95)
  B(scene, 0.04, 0.04, 5.6, M.led, 2.68, 2.78, 2.95)
  B(scene, 2.6, 0.04, 0.04, M.led, 1.4, 2.78, 0.12)
  B(scene, 2.6, 0.04, 0.04, M.led, 1.4, 2.78, 5.78)
  rug(1.6, 2.95, 2.2, 4.6, M.rugDark)

  sofa(8.7, 13.25, Math.PI / 2 + 0.6, 1, M.fabric2)
  sofa(10.2, 13.25, -Math.PI / 2 - 0.6, 1, M.fabric2)
  CYL(scene, 0.3, 0.3, 0.4, M.woodLight, 9.45, 0.2, 13.3)
  for (const px of [1.0, 2.4, 3.8, 5.0]) {
    B(scene, 1.1, 0.35, 0.4, M.pot, px, 0.18, 14.05)
    plant(px, 14.05, 0.7)
  }
  plant(0.6, 12.4, 1.3)
}
