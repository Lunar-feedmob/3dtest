import * as THREE from 'three'

export class Player {
  constructor(camera, colliders) {
    this.camera = camera
    this.colliders = colliders
    this.pos = new THREE.Vector3(1.5, 0, 7.2)
    this.yaw = -Math.PI / 2
    this.pitch = 0
    this.keys = {}
    this.enabled = false
    this.r = 0.3
    this.eye = 1.6
    window.addEventListener('keydown', e => { if (this.enabled) this.keys[e.code] = true })
    window.addEventListener('keyup', e => { this.keys[e.code] = false })
  }

  free(x, z) {
    for (const c of this.colliders) {
      const cx = Math.max(c.x0, Math.min(x, c.x1))
      const cz = Math.max(c.z0, Math.min(z, c.z1))
      const dx = x - cx, dz = z - cz
      if (dx * dx + dz * dz < this.r * this.r) return false
    }
    return true
  }

  jumpTo(x, z, yaw) {
    const offs = [[0, 0], [0.5, 0], [-0.5, 0], [0, 0.5], [0, -0.5], [0.7, 0.7], [-0.7, 0.7], [0.7, -0.7], [-0.7, -0.7], [1, 0], [-1, 0], [0, 1], [0, -1]]
    for (const [ox, oz] of offs) {
      if (this.free(x + ox, z + oz)) { this.pos.set(x + ox, 0, z + oz); break }
    }
    if (yaw !== undefined) this.yaw = yaw
    this.pitch = 0
    this.update(0)
  }

  rotate(dx, dy) {
    this.yaw -= dx * 0.0022
    this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch - dy * 0.0022))
  }

  update(dt) {
    if (!this.enabled) return
    const f = { x: -Math.sin(this.yaw), z: -Math.cos(this.yaw) }
    const r = { x: Math.cos(this.yaw), z: -Math.sin(this.yaw) }
    let ix = 0, iz = 0
    if (this.keys['KeyW']) iz += 1
    if (this.keys['KeyS']) iz -= 1
    if (this.keys['KeyD']) ix += 1
    if (this.keys['KeyA']) ix -= 1
    if (ix || iz) {
      const l = Math.hypot(ix, iz)
      ix /= l
      iz /= l
      const sp = (this.keys['ShiftLeft'] || this.keys['ShiftRight']) ? 2.8 : 1.5
      const nx = this.pos.x + (f.x * iz + r.x * ix) * sp * dt
      const nz = this.pos.z + (f.z * iz + r.z * ix) * sp * dt
      if (this.free(nx, this.pos.z)) this.pos.x = nx
      if (this.free(this.pos.x, nz)) this.pos.z = nz
    }
    this.camera.position.set(this.pos.x, this.eye, this.pos.z)
    this.camera.rotation.y = this.yaw
    this.camera.rotation.x = this.pitch
  }
}
