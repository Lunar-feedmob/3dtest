import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { createApp } from './scene.js'
import { makeMaterials } from './materials.js'
import { buildHouse, ROOMS } from './house.js'
import { buildFurniture } from './furniture.js'
import { setupLighting } from './lighting.js'
import { Player } from './controls.js'
import { setupPlan } from './plan.js'

const { renderer, scene, camera, ortho, composer } = createApp()
const M = makeMaterials()
const colliders = []
const house = buildHouse(scene, M, colliders)
buildFurniture(scene, M, colliders)
const lighting = setupLighting(scene, renderer, M)
const player = new Player(camera, colliders)

const orbitP = new OrbitControls(camera, renderer.domElement)
const orbitO = new OrbitControls(ortho, renderer.domElement)
for (const o of [orbitP, orbitO]) {
  o.enableDamping = true
  o.dampingFactor = 0.08
  o.enabled = false
  o.maxPolarAngle = Math.PI / 2.02
  o.target.set(9.9, 0, 7.2)
}
orbitO.minZoom = 0.4
orbitO.maxZoom = 4

let mode = 'fp'
let night = false
let locked = false

const crosshair = document.getElementById('crosshair')
const hint = document.getElementById('hint')
const planOverlay = document.getElementById('planOverlay')
const daynightBtn = document.getElementById('daynight')

function exitLock() {
  if (document.pointerLockElement) document.exitPointerLock()
}

document.addEventListener('pointerlockchange', () => {
  locked = document.pointerLockElement === renderer.domElement
})

document.addEventListener('mousemove', e => {
  if (locked && mode === 'fp') player.rotate(e.movementX, e.movementY)
})

renderer.domElement.addEventListener('click', () => {
  if (mode === 'fp' && !locked) renderer.domElement.requestPointerLock()
})

function setMode(m) {
  mode = m
  document.querySelectorAll('[data-mode]').forEach(b => b.classList.toggle('active', b.dataset.mode === m))
  planOverlay.hidden = m !== 'plan'
  const fp = m === 'fp'
  crosshair.style.display = fp ? 'block' : 'none'
  hint.style.display = fp ? 'block' : 'none'
  house.ceiling.visible = fp
  player.enabled = fp
  orbitP.enabled = m === 'bird'
  orbitO.enabled = m === 'axo'
  if (!fp) exitLock()
  if (fp) {
    player.update(0)
  } else if (m === 'bird') {
    camera.position.set(9.9, 21, 25)
    camera.rotation.set(0, 0, 0)
    orbitP.target.set(9.9, 0, 7.2)
    orbitP.update()
  } else if (m === 'axo') {
    ortho.position.set(9.9 + 17, 16, 7.2 + 17)
    orbitO.target.set(9.9, 0, 1.5)
    ortho.zoom = 1
    ortho.updateProjectionMatrix()
    orbitO.update()
  }
}

document.querySelectorAll('[data-mode]').forEach(b => {
  b.addEventListener('click', () => setMode(b.dataset.mode))
})

daynightBtn.addEventListener('click', () => {
  night = !night
  lighting.setNight(night)
  daynightBtn.textContent = night ? '切换白天' : '切换夜晚'
})

function jump(room) {
  const [x0, z0, x1, z1] = room.rect
  player.jumpTo((x0 + x1) / 2, (z0 + z1) / 2, room.yaw)
  setMode('fp')
}

const roomList = document.getElementById('roomList')
for (const r of ROOMS) {
  const b = document.createElement('button')
  b.textContent = r.name
  b.addEventListener('click', () => jump(r))
  roomList.appendChild(b)
}
document.getElementById('planClose').addEventListener('click', () => setMode('fp'))

const planCanvas = document.getElementById('planCanvas')
const planImg = document.getElementById('planImg')
const planSrcBtn = document.getElementById('planSrc')
planSrcBtn.addEventListener('click', () => {
  const showImg = planCanvas.style.display !== 'none'
  planCanvas.style.display = showImg ? 'none' : 'block'
  planImg.hidden = !showImg
  planSrcBtn.textContent = showImg ? '交互图' : '原始户型图'
})

setupPlan(document.getElementById('planCanvas'), jump)

window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight
  renderer.setSize(w, h)
  composer.setSize(w, h)
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  const a = w / h, d = 10.5
  ortho.left = -d * a
  ortho.right = d * a
  ortho.top = d
  ortho.bottom = -d
  ortho.updateProjectionMatrix()
})

player.update(0)
setMode('fp')

const clock = { last: performance.now() }
function tick(now) {
  requestAnimationFrame(tick)
  const dt = Math.min((now - clock.last) / 1000, 0.05)
  clock.last = now
  if (mode === 'fp') player.update(dt)
  else if (mode === 'bird') orbitP.update()
  else if (mode === 'axo') orbitO.update()
  if (mode === 'axo') renderer.render(scene, ortho)
  else composer.render()
}
requestAnimationFrame(t => {
  clock.last = t
  document.getElementById('loading').style.display = 'none'
  tick(t)
})
