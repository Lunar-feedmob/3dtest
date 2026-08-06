import * as THREE from 'three'

export const WALL_H = 2.9
export const EXT_T = 0.24
export const INT_T = 0.12

export const ROOMS = [
  { id: 'yingshi', name: '多功能影音室', area: '17.0', rect: [0, 0, 2.8, 5.9], yaw: Math.PI / 2 },
  { id: 'canting', name: '餐厅', area: '16.5', rect: [2.8, 0, 6.1, 5.9], yaw: Math.PI },
  { id: 'chufang', name: '厨房', area: '9.0', rect: [6.1, 0, 9.1, 3.0], yaw: Math.PI },
  { id: 'xiyi', name: '洗衣房', area: '5.0', rect: [9.1, 0, 11.1, 2.5], yaw: Math.PI },
  { id: 'gongwei1', name: '公卫1', area: '4.5', rect: [11.1, 0, 13.0, 2.4], yaw: Math.PI },
  { id: 'ciwo1', name: '次卧1', area: '12.0', rect: [13.0, 0, 16.2, 3.9], yaw: Math.PI },
  { id: 'ciwo2', name: '次卧2', area: '13.0', rect: [16.2, 0, 19.8, 3.9], yaw: Math.PI },
  { id: 'chuzang', name: '储藏室', area: '6.0', rect: [16.9, 3.9, 19.8, 5.9], yaw: Math.PI },
  { id: 'xuanguan', name: '玄关', area: '7.0', rect: [0, 5.9, 2.8, 8.4], yaw: -Math.PI / 2 },
  { id: 'qiju', name: '家庭起居厅', area: '22.0', rect: [4.4, 5.9, 9.3, 8.6], yaw: Math.PI / 2 },
  { id: 'shufang', name: '书房', area: '12.0', rect: [9.3, 5.9, 12.9, 8.9], yaw: 0 },
  { id: 'jianshen', name: '健身房', area: '11.0', rect: [13.6, 5.9, 16.9, 8.9], yaw: 0 },
  { id: 'yimao', name: '衣帽间', area: '6.5', rect: [16.9, 5.9, 19.8, 7.9], yaw: Math.PI },
  { id: 'keting', name: '客厅', area: '32.0', rect: [0, 8.4, 5.6, 11.9], yaw: 0 },
  { id: 'gongwei2', name: '公卫2', area: '5.0', rect: [9.3, 8.9, 11.6, 11.9], yaw: -Math.PI / 2 },
  { id: 'zhuwo', name: '主卧', area: '20.0', rect: [11.6, 8.9, 16.9, 12.4], yaw: Math.PI / 2 },
  { id: 'zhuwei', name: '主卫', area: '8.0', rect: [16.9, 7.9, 19.8, 12.4], yaw: -Math.PI / 2 },
  { id: 'yangtai', name: '景观阳台', area: '16.0', rect: [0, 11.9, 12.4, 14.4], yaw: 0 }
]

export const WALLS = [
  { x0: 0, z0: 0, x1: 19.8, z1: 0, t: EXT_T, ext: true, open: [
    { a: 0.6, b: 2.2, type: 'win' }, { a: 3.2, b: 5.7, type: 'win' }, { a: 6.6, b: 8.6, type: 'win' },
    { a: 9.4, b: 10.8, type: 'win' }, { a: 11.4, b: 12.7, type: 'win' }, { a: 13.5, b: 15.7, type: 'win' },
    { a: 16.8, b: 19.2, type: 'win' } ] },
  { x0: 19.8, z0: 0, x1: 19.8, z1: 12.4, t: EXT_T, ext: true, open: [
    { a: 0.8, b: 3.0, type: 'win' }, { a: 4.3, b: 5.5, type: 'win' }, { a: 8.6, b: 11.6, type: 'win' } ] },
  { x0: 19.8, z0: 12.4, x1: 12.4, z1: 12.4, t: EXT_T, ext: true, open: [
    { a: 0.4, b: 2.6, type: 'win' }, { a: 3.8, b: 6.9, type: 'win' } ] },
  { x0: 12.4, z0: 12.4, x1: 12.4, z1: 14.4, t: EXT_T, ext: true },
  { x0: 12.4, z0: 14.4, x1: 0, z1: 14.4, t: EXT_T, ext: true, open: [ { a: 0.1, b: 12.3, type: 'rail' } ] },
  { x0: 0, z0: 14.4, x1: 0, z1: 0, t: EXT_T, ext: true, open: [
    { a: 0, b: 2.5, type: 'rail' }, { a: 3.2, b: 5.2, type: 'win' }, { a: 6.9, b: 7.9, type: 'door' } ] },

  { x0: 2.8, z0: 0, x1: 2.8, z1: 5.9, open: [ { a: 4.7, b: 5.6, type: 'door' } ] },
  { x0: 0, z0: 5.9, x1: 2.8, z1: 5.9 },
  { x0: 0, z0: 8.4, x1: 2.8, z1: 8.4 },
  { x0: 2.8, z0: 5.9, x1: 2.8, z1: 8.4, open: [ { a: 0.2, b: 2.3, type: 'open' } ] },
  { x0: 6.1, z0: 0, x1: 6.1, z1: 3.0 },
  { x0: 6.1, z0: 3.0, x1: 9.1, z1: 3.0, open: [ { a: 1.5, b: 2.4, type: 'door' } ] },
  { x0: 9.1, z0: 0, x1: 9.1, z1: 2.5 },
  { x0: 9.1, z0: 2.5, x1: 11.1, z1: 2.5, open: [ { a: 0.3, b: 1.1, type: 'door' } ] },
  { x0: 11.1, z0: 0, x1: 11.1, z1: 2.4 },
  { x0: 11.1, z0: 2.4, x1: 13.0, z1: 2.4, open: [ { a: 0.8, b: 1.6, type: 'door' } ] },
  { x0: 13.0, z0: 0, x1: 13.0, z1: 3.9 },
  { x0: 13.0, z0: 3.9, x1: 16.2, z1: 3.9, open: [ { a: 0.3, b: 1.1, type: 'door' } ] },
  { x0: 16.2, z0: 0, x1: 16.2, z1: 3.9 },
  { x0: 16.2, z0: 3.9, x1: 19.8, z1: 3.9, open: [ { a: 0.3, b: 1.1, type: 'door' } ] },
  { x0: 16.9, z0: 3.9, x1: 16.9, z1: 5.9, open: [ { a: 0.7, b: 1.5, type: 'door' } ] },
  { x0: 9.3, z0: 5.9, x1: 12.9, z1: 5.9, open: [ { a: 2.3, b: 3.1, type: 'door' } ] },
  { x0: 12.9, z0: 5.9, x1: 13.6, z1: 5.9, open: [ { a: 0, b: 0.7, type: 'open' } ] },
  { x0: 13.6, z0: 5.9, x1: 16.9, z1: 5.9, open: [ { a: 0.4, b: 1.2, type: 'door' } ] },
  { x0: 9.3, z0: 5.9, x1: 9.3, z1: 8.9 },
  { x0: 12.9, z0: 5.9, x1: 12.9, z1: 8.9 },
  { x0: 13.6, z0: 5.9, x1: 13.6, z1: 8.9 },
  { x0: 16.9, z0: 5.9, x1: 16.9, z1: 7.9 },
  { x0: 16.9, z0: 7.9, x1: 19.8, z1: 7.9, open: [ { a: 0.7, b: 1.5, type: 'door' } ] },
  { x0: 16.9, z0: 7.9, x1: 16.9, z1: 12.4, open: [ { a: 1.7, b: 2.5, type: 'door' } ] },
  { x0: 9.3, z0: 8.9, x1: 11.6, z1: 8.9 },
  { x0: 11.6, z0: 8.9, x1: 12.9, z1: 8.9 },
  { x0: 12.9, z0: 8.9, x1: 13.6, z1: 8.9, open: [ { a: 0.05, b: 0.65, type: 'open' } ] },
  { x0: 13.6, z0: 8.9, x1: 16.9, z1: 8.9 },
  { x0: 9.3, z0: 8.9, x1: 9.3, z1: 11.9, open: [ { a: 0.5, b: 1.3, type: 'door' } ] },
  { x0: 11.6, z0: 8.9, x1: 11.6, z1: 11.9 },
  { x0: 0, z0: 11.9, x1: 12.4, z1: 11.9, open: [
    { a: 2.6, b: 5.0, type: 'glass' }, { a: 7.4, b: 9.8, type: 'slide' }, { a: 10.2, b: 11.8, type: 'glass' } ] },
  { x0: 12.4, z0: 11.9, x1: 12.4, z1: 12.4 }
]

const FLOORS = [
  { r: [0, 0, 2.8, 5.9], k: 'carpet' },
  { r: [2.8, 0, 6.1, 5.9], k: 'wood' },
  { r: [6.1, 0, 9.1, 3.0], k: 'grey' },
  { r: [9.1, 0, 11.1, 2.5], k: 'grey' },
  { r: [11.1, 0, 13.0, 2.4], k: 'grey' },
  { r: [13.0, 0, 16.2, 3.9], k: 'wood' },
  { r: [16.2, 0, 19.8, 3.9], k: 'wood' },
  { r: [16.9, 3.9, 19.8, 5.9], k: 'wood' },
  { r: [6.1, 3.0, 9.1, 5.9], k: 'wood' },
  { r: [9.1, 2.5, 13.0, 5.9], k: 'marble' },
  { r: [13.0, 3.9, 16.9, 5.9], k: 'marble' },
  { r: [0, 5.9, 2.8, 8.4], k: 'marble' },
  { r: [2.8, 5.9, 9.3, 8.4], k: 'wood' },
  { r: [5.6, 8.4, 9.3, 11.9], k: 'wood' },
  { r: [0, 8.4, 5.6, 11.9], k: 'wood' },
  { r: [12.9, 5.9, 13.6, 8.9], k: 'wood' },
  { r: [9.3, 5.9, 12.9, 8.9], k: 'wood' },
  { r: [13.6, 5.9, 16.9, 8.9], k: 'wood' },
  { r: [16.9, 5.9, 19.8, 7.9], k: 'wood' },
  { r: [9.3, 8.9, 11.6, 11.9], k: 'grey' },
  { r: [11.6, 8.9, 16.9, 12.4], k: 'wood' },
  { r: [16.9, 7.9, 19.8, 12.4], k: 'grey' },
  { r: [0, 11.9, 12.4, 14.4], k: 'grey' }
]

function box(g, w, h, d, mat, x, y, z) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  m.castShadow = true
  m.receiveShadow = true
  g.add(m)
  return m
}

function buildWall(g, M, w, colliders) {
  const t = w.t || INT_T
  const h = WALL_H
  const horiz = Math.abs(w.z1 - w.z0) < 1e-6
  const len = horiz ? Math.abs(w.x1 - w.x0) : Math.abs(w.z1 - w.z0)
  const os = [...(w.open || [])].sort((a, b) => a.a - b.a)
  const pieces = []
  let cur = 0
  for (const o of os) {
    if (o.a > cur) pieces.push({ a: cur, b: o.a, kind: 'solid' })
    pieces.push({ a: o.a, b: o.b, kind: o.type })
    cur = o.b
  }
  if (cur < len) pieces.push({ a: cur, b: len, kind: 'solid' })

  for (const p of pieces) {
    const pl = p.b - p.a
    const mid = (p.a + p.b) / 2
    const x = horiz ? w.x0 + mid : w.x0
    const z = horiz ? w.z0 : w.z0 + mid
    const wDim = horiz ? pl : t
    const dDim = horiz ? t : pl
    const pushCol = () => colliders.push({ x0: x - wDim / 2, z0: z - dDim / 2, x1: x + wDim / 2, z1: z + dDim / 2 })

    if (p.kind === 'solid') {
      box(g, wDim, h, dDim, M.wall, x, h / 2, z)
      pushCol()
    } else if (p.kind === 'win') {
      const sill = 0.9, head = 2.4
      box(g, wDim, sill, dDim, M.wall, x, sill / 2, z)
      box(g, wDim, h - head, dDim, M.wall, x, (h + head) / 2, z)
      const gl = box(g, horiz ? pl : 0.02, head - sill, horiz ? 0.02 : pl, M.glass, x, (sill + head) / 2, z)
      gl.castShadow = false
      box(g, wDim, 0.06, dDim, M.metalDark, x, sill + 0.03, z)
      box(g, wDim, 0.06, dDim, M.metalDark, x, head - 0.03, z)
      pushCol()
    } else if (p.kind === 'rail') {
      box(g, wDim, 0.12, dDim, M.wall, x, 0.06, z)
      const gl = box(g, horiz ? pl : 0.02, 1.0, horiz ? 0.02 : pl, M.glass, x, 0.62, z)
      gl.castShadow = false
      box(g, wDim, 0.05, dDim, M.metal, x, 1.14, z)
      pushCol()
    } else if (p.kind === 'glass') {
      box(g, wDim, h - 2.2, dDim, M.wall, x, (h + 2.2) / 2, z)
      const gl = box(g, horiz ? pl : 0.02, 2.14, horiz ? 0.02 : pl, M.glass, x, 1.08, z)
      gl.castShadow = false
      box(g, wDim, 0.05, dDim, M.metalDark, x, 2.18, z)
      box(g, wDim, 0.03, dDim, M.metalDark, x, 0.03, z)
      pushCol()
    } else if (p.kind === 'slide') {
      box(g, wDim, h - 2.2, dDim, M.wall, x, (h + 2.2) / 2, z)
      const half = pl / 2
      const panel = (ca, inset) => {
        const cm = ca + half / 2
        const px = horiz ? w.x0 + cm : w.x0 + inset
        const pz = horiz ? w.z0 + inset : w.z0 + cm
        const gl = box(g, horiz ? half : 0.02, 2.14, horiz ? 0.02 : half, M.glass, px, 1.08, pz)
        gl.castShadow = false
        box(g, horiz ? half : 0.04, 0.05, horiz ? 0.04 : half, M.metalDark, px, 2.16, pz)
        box(g, horiz ? half : 0.04, 0.04, horiz ? 0.04 : half, M.metalDark, px, 0.05, pz)
      }
      panel(p.a, 0)
      panel(p.a, horiz ? -0.08 : 0.08)
      if (horiz) colliders.push({ x0: w.x0 + p.a, z0: w.z0 - t / 2, x1: w.x0 + p.a + half, z1: w.z0 + t / 2 })
      else colliders.push({ x0: w.x0 - t / 2, z0: w.z0 + p.a, x1: w.x0 + t / 2, z1: w.z0 + p.a + half })
    } else {
      box(g, wDim, h - 2.1, dDim, M.wall, x, (h + 2.1) / 2, z)
      if (w.ext) pushCol()
    }
  }
}

export function buildHouse(scene, M, colliders) {
  const g = new THREE.Group()

  for (const f of FLOORS) {
    const [x0, z0, x1, z1] = f.r
    const w = x1 - x0, d = z1 - z0
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), M.floor(f.k, w, d))
    m.rotation.x = -Math.PI / 2
    m.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2)
    m.receiveShadow = true
    g.add(m)
  }

  for (const w of WALLS) buildWall(g, M, w, colliders)

  const shape = new THREE.Shape()
  const pts = [[0, 0], [19.8, 0], [19.8, 12.4], [12.4, 12.4], [12.4, 14.4], [0, 14.4]]
  pts.forEach((p, i) => i === 0 ? shape.moveTo(p[0], p[1]) : shape.lineTo(p[0], p[1]))
  const ceil = new THREE.Mesh(new THREE.ShapeGeometry(shape), M.ceil)
  ceil.rotation.x = Math.PI / 2
  ceil.position.y = WALL_H
  ceil.receiveShadow = true
  g.add(ceil)

  const door = box(g, 0.07, 2.08, 0.98, M.woodDark, 0, 1.05, 7.4)
  door.castShadow = true
  const handle = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), M.metal)
  handle.position.set(0.09, 1.05, 7.0)
  g.add(handle)

  scene.add(g)
  return { group: g, ceiling: ceil }
}
