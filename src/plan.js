import { ROOMS, WALLS } from './house.js'

const FILLS = {
  yingshi: '#e3d9e3', canting: '#f0e2cc', chufang: '#e6e3da', xiyi: '#e6e3da',
  gongwei1: '#e0e4e4', ciwo1: '#f0e2cc', ciwo2: '#f0e2cc', chuzang: '#ece4d4',
  xuanguan: '#e6e3da', qiju: '#f0e2cc', shufang: '#f0e2cc', jianshen: '#f0e2cc',
  yimao: '#ece4d4', keting: '#f0e2cc', gongwei2: '#e0e4e4', zhuwo: '#f0e2cc',
  zhuwei: '#e0e4e4', yangtai: '#dfe8df'
}

export function setupPlan(canvas, onPick) {
  const g = canvas.getContext('2d')
  const W = canvas.width, H = canvas.height
  const s = Math.min((W - 70) / 19.8, (H - 70) / 14.4)
  const ox = (W - 19.8 * s) / 2
  const oz = (H - 14.4 * s) / 2
  const X = x => ox + x * s
  const Z = z => oz + z * s

  function draw() {
    g.fillStyle = '#f7f3ea'
    g.fillRect(0, 0, W, H)
    for (const r of ROOMS) {
      const [x0, z0, x1, z1] = r.rect
      g.fillStyle = FILLS[r.id] || '#f0e2cc'
      g.fillRect(X(x0), Z(z0), (x1 - x0) * s, (z1 - z0) * s)
    }
    g.lineCap = 'square'
    for (const w of WALLS) {
      const t = (w.t || 0.12) * s
      g.strokeStyle = '#3f3a33'
      g.lineWidth = t
      g.beginPath()
      g.moveTo(X(w.x0), Z(w.z0))
      g.lineTo(X(w.x1), Z(w.z1))
      g.stroke()
      const len = Math.hypot(w.x1 - w.x0, w.z1 - w.z0)
      const dx = (w.x1 - w.x0) / len, dz = (w.z1 - w.z0) / len
      for (const o of (w.open || [])) {
        g.strokeStyle = o.type === 'door' || o.type === 'open' || o.type === 'slide' ? '#f7f3ea' : '#bcd4dc'
        g.lineWidth = t * 0.8
        g.beginPath()
        g.moveTo(X(w.x0 + dx * o.a), Z(w.z0 + dz * o.a))
        g.lineTo(X(w.x0 + dx * o.b), Z(w.z0 + dz * o.b))
        g.stroke()
      }
    }
    g.textAlign = 'center'
    for (const r of ROOMS) {
      const [x0, z0, x1, z1] = r.rect
      const cx = X((x0 + x1) / 2), cz = Z((z0 + z1) / 2)
      g.fillStyle = '#4a3f2e'
      g.font = '600 13px "PingFang SC", sans-serif'
      g.fillText(r.name, cx, cz)
      g.fillStyle = '#8a7a5f'
      g.font = '11px "PingFang SC", sans-serif'
      g.fillText(r.area + '㎡', cx, cz + 16)
    }
    g.fillStyle = '#4a3f2e'
    g.beginPath()
    g.arc(34, H - 40, 16, 0, 7)
    g.fill()
    g.fillStyle = '#f7f3ea'
    g.beginPath()
    g.moveTo(34, H - 52)
    g.lineTo(28, H - 32)
    g.lineTo(34, H - 37)
    g.lineTo(40, H - 32)
    g.closePath()
    g.fill()
    g.fillStyle = '#4a3f2e'
    g.font = '10px sans-serif'
    g.fillText('N', 34, H - 62)
  }

  canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect()
    const px = (e.clientX - rect.left) * (W / rect.width)
    const pz = (e.clientY - rect.top) * (H / rect.height)
    const x = (px - ox) / s, z = (pz - oz) / s
    const room = ROOMS.find(r => x >= r.rect[0] && x <= r.rect[2] && z >= r.rect[1] && z <= r.rect[3])
    if (room) onPick(room)
  })

  draw()
}
