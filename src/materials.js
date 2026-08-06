import * as THREE from 'three'

const rnd = (a, b) => a + Math.random() * (b - a)

function ct(size, fn) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  fn(c.getContext('2d'), size)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 8
  return t
}

function normalFrom(canvas, strength = 1) {
  const s = canvas.width
  const src = canvas.getContext('2d').getImageData(0, 0, s, s).data
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')
  const out = g.createImageData(s, s)
  const h = (x, y) => {
    const i = (((y + s) % s) * s + ((x + s) % s)) * 4
    return (src[i] + src[i + 1] + src[i + 2]) / 765
  }
  for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) {
    const dx = (h(x - 1, y) - h(x + 1, y)) * strength
    const dy = (h(x, y - 1) - h(x, y + 1)) * strength
    const l = Math.sqrt(dx * dx + dy * dy + 1)
    const i = (y * s + x) * 4
    out.data[i] = (dx / l * 0.5 + 0.5) * 255
    out.data[i + 1] = (dy / l * 0.5 + 0.5) * 255
    out.data[i + 2] = (1 / l * 0.5 + 0.5) * 255
    out.data[i + 3] = 255
  }
  g.putImageData(out, 0, 0)
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

function woodTex() {
  return ct(512, (g, s) => {
    g.fillStyle = '#a9825c'
    g.fillRect(0, 0, s, s)
    const rows = 8, rh = s / rows
    for (let r = 0; r < rows; r++) {
      const l = rnd(0.82, 1.12)
      g.fillStyle = `rgb(${(172 * l) | 0},${(132 * l) | 0},${(95 * l) | 0})`
      g.fillRect(0, r * rh + 1, s, rh - 2)
      g.strokeStyle = 'rgba(80,55,30,0.28)'
      g.lineWidth = 1
      for (let i = 0; i < 12; i++) {
        g.beginPath()
        const y = r * rh + rnd(3, rh - 3)
        g.moveTo(0, y)
        g.bezierCurveTo(s * 0.3, y + rnd(-4, 4), s * 0.7, y + rnd(-4, 4), s, y)
        g.stroke()
      }
      g.fillStyle = 'rgba(60,40,20,0.5)'
      g.fillRect(0, r * rh, s, 1.5)
      g.fillRect(rnd(0, s), r * rh, 1.5, rh)
    }
  })
}

function marbleTex() {
  return ct(512, (g, s) => {
    g.fillStyle = '#efeae2'
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 26; i++) {
      g.strokeStyle = `rgba(138,138,150,${rnd(0.05, 0.2)})`
      g.lineWidth = rnd(0.6, 2.2)
      g.beginPath()
      let x = rnd(0, s), y = rnd(0, s)
      g.moveTo(x, y)
      for (let k = 0; k < 6; k++) { x += rnd(-90, 90); y += rnd(-90, 90); g.lineTo(x, y) }
      g.stroke()
    }
  })
}

function tileTex(base, grout) {
  return ct(256, (g, s) => {
    g.fillStyle = grout
    g.fillRect(0, 0, s, s)
    g.fillStyle = base
    g.fillRect(2, 2, s / 2 - 3, s / 2 - 3)
    g.fillRect(s / 2 + 1, 2, s / 2 - 3, s / 2 - 3)
    g.fillRect(2, s / 2 + 1, s / 2 - 3, s / 2 - 3)
    g.fillRect(s / 2 + 1, s / 2 + 1, s / 2 - 3, s / 2 - 3)
    g.fillStyle = 'rgba(255,255,255,0.06)'
    for (let i = 0; i < 400; i++) g.fillRect(rnd(0, s), rnd(0, s), 1.5, 1.5)
  })
}

function fabricTex(base) {
  return ct(128, (g, s) => {
    g.fillStyle = base
    g.fillRect(0, 0, s, s)
    for (let i = 0; i < 2400; i++) {
      g.fillStyle = `rgba(0,0,0,${rnd(0.02, 0.08)})`
      g.fillRect(rnd(0, s), rnd(0, s), 1, 1)
    }
    for (let i = 0; i < 1500; i++) {
      g.fillStyle = `rgba(255,255,255,${rnd(0.02, 0.07)})`
      g.fillRect(rnd(0, s), rnd(0, s), 1, 1)
    }
  })
}

function rugTex(base, border) {
  return ct(256, (g, s) => {
    g.fillStyle = base
    g.fillRect(0, 0, s, s)
    g.strokeStyle = border
    g.lineWidth = 10
    g.strokeRect(12, 12, s - 24, s - 24)
    g.lineWidth = 3
    g.strokeRect(30, 30, s - 60, s - 60)
    for (let i = 0; i < 2800; i++) {
      g.fillStyle = `rgba(0,0,0,${rnd(0.02, 0.1)})`
      g.fillRect(rnd(0, s), rnd(0, s), 1, 2)
    }
  })
}

export function makeMaterials() {
  const M = {}
  const wood = woodTex()
  const marble = marbleTex()
  const tile = tileTex('#e7e2d8', '#c9c2b4')
  const tileGrey = tileTex('#d9d9d6', '#b5b5b2')
  const fab = fabricTex('#cfc4b2')
  const fab2 = fabricTex('#9aa0a8')
  const lea = fabricTex('#5a3a30')
  const bedT = fabricTex('#efe9df')
  const bla = fabricTex('#b7a98f')
  const pil = fabricTex('#f5f1e8')
  const rugT = rugTex('#cbbfa8', '#8a7a5f')
  const rugD = rugTex('#4a4048', '#2a222c')
  const car = fabricTex('#3d3742')

  const woodN = normalFrom(wood.image, 1.4)
  const marbleN = normalFrom(marble.image, 0.35)
  const tileN = normalFrom(tile.image, 1.8)
  const tileGreyN = normalFrom(tileGrey.image, 1.8)
  const fabN = normalFrom(fab.image, 0.9)
  const fab2N = normalFrom(fab2.image, 0.9)
  const leaN = normalFrom(lea.image, 0.7)
  const bedN = normalFrom(bedT.image, 0.9)
  const blaN = normalFrom(bla.image, 1.1)
  const pilN = normalFrom(pil.image, 0.9)
  const rugN = normalFrom(rugT.image, 2.2)
  const rugDN = normalFrom(rugD.image, 2.2)
  const carN = normalFrom(car.image, 1.2)

  const std = (o, n, s) => {
    const m = new THREE.MeshStandardMaterial(o)
    if (n) { m.normalMap = n; m.normalScale.set(s, s) }
    return m
  }

  M.wall = std({ color: 0xece7de, roughness: 0.92 })
  M.wallDark = std({ color: 0x45454e, roughness: 0.9 })
  M.ceil = std({ color: 0xf5f2ec, roughness: 0.95 })
  M.glass = new THREE.MeshPhysicalMaterial({ color: 0xbfd8dd, roughness: 0.06, metalness: 0, transparent: true, opacity: 0.16, side: THREE.DoubleSide, envMapIntensity: 1.2, depthWrite: false })
  M.mirror = std({ color: 0xdfe8ea, metalness: 1, roughness: 0.04, envMapIntensity: 1.6 })
  M.metal = std({ color: 0xb8b8bc, metalness: 0.9, roughness: 0.3 })
  M.metalDark = std({ color: 0x3a3a3e, metalness: 0.8, roughness: 0.4 })
  M.black = std({ color: 0x141416, metalness: 0.4, roughness: 0.5 })
  M.woodDark = std({ color: 0x6b4a32, roughness: 0.55 }, woodN, 0.3)
  M.woodLight = std({ color: 0xc8a878, roughness: 0.6 }, woodN, 0.3)
  M.lacquer = std({ color: 0xf2efe8, roughness: 0.35 })
  M.marble = std({ map: marble, roughness: 0.25 }, marbleN, 0.4)
  M.ceramic = std({ color: 0xf8f8f6, roughness: 0.12 })
  M.fabric = std({ map: fab, roughness: 0.95 }, fabN, 0.6)
  M.fabric2 = std({ map: fab2, roughness: 0.95 }, fab2N, 0.6)
  M.leather = std({ map: lea, roughness: 0.7 }, leaN, 0.5)
  M.bed = std({ map: bedT, roughness: 0.9 }, bedN, 0.6)
  M.blanket = std({ map: bla, roughness: 0.95 }, blaN, 0.8)
  M.pillow = std({ map: pil, roughness: 0.95 }, pilN, 0.6)
  M.plant = std({ color: 0x3f7a3a, roughness: 0.85, flatShading: true })
  M.plant2 = std({ color: 0x579350, roughness: 0.85, flatShading: true })
  M.pot = std({ color: 0xb0a89a, roughness: 0.8 })
  M.curtain = std({ color: 0xe8e2d4, roughness: 1, side: THREE.DoubleSide }, fabN, 0.4)
  M.screen = std({ color: 0x0a0a0c, emissive: 0x2a3c50, emissiveIntensity: 0.6, roughness: 0.2 })
  M.led = std({ color: 0x332211, emissive: 0xffb46b, emissiveIntensity: 0.4 })
  M.lamp = std({ color: 0xf5e8d0, emissive: 0xffd9a0, emissiveIntensity: 0.15 })
  M.down = std({ color: 0xffffff, emissive: 0xfff2dd, emissiveIntensity: 0.3 })
  M.rug = std({ map: rugT, roughness: 1 }, rugN, 1.2)
  M.rugDark = std({ map: rugD, roughness: 1 }, rugDN, 1.2)
  M.yoga = std({ color: 0x7a6fa0, roughness: 0.9 }, fabN, 0.4)

  const bases = {
    wood: std({ map: wood, roughness: 0.5 }, woodN, 0.6),
    tile: std({ map: tile, roughness: 0.35 }, tileN, 0.7),
    grey: std({ map: tileGrey, roughness: 0.5 }, tileGreyN, 0.7),
    marble: std({ map: marble, roughness: 0.2 }, marbleN, 0.4),
    carpet: std({ map: car, roughness: 1 }, carN, 1.0)
  }
  M.floor = (kind, w, d) => {
    const base = bases[kind] || bases.wood
    const t = base.map.clone()
    t.needsUpdate = true
    t.repeat.set(Math.max(0.5, w / 2.2), Math.max(0.5, d / 2.2))
    const m = new THREE.MeshStandardMaterial({ map: t, roughness: base.roughness })
    if (base.normalMap) {
      const n = base.normalMap.clone()
      n.needsUpdate = true
      n.repeat.copy(t.repeat)
      m.normalMap = n
      m.normalScale.copy(base.normalScale)
    }
    return m
  }
  return M
}
