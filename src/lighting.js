import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js'

export function setupLighting(scene, renderer, M) {
  RectAreaLightUniformsLib.init()
  const hemi = new THREE.HemisphereLight(0xdfe8ff, 0x8a7a66, 0.5)
  scene.add(hemi)
  const amb = new THREE.AmbientLight(0xffffff, 0.12)
  scene.add(amb)

  const sun = new THREE.DirectionalLight(0xfff1dc, 3.0)
  sun.position.set(14, 18, 30)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left = -24
  sun.shadow.camera.right = 24
  sun.shadow.camera.top = 24
  sun.shadow.camera.bottom = -24
  sun.shadow.camera.near = 1
  sun.shadow.camera.far = 80
  sun.shadow.bias = -0.0004
  sun.target.position.set(9.9, 0, 5)
  scene.add(sun, sun.target)

  const cove = new THREE.RectAreaLight(0xfff0da, 1.5, 4.6, 3.0)
  cove.position.set(2.8, 2.86, 10.15)
  cove.lookAt(2.8, 0, 10.15)
  scene.add(cove)

  const cove2 = new THREE.RectAreaLight(0xfff0da, 1.2, 4.0, 2.2)
  cove2.position.set(7.0, 2.86, 7.2)
  cove2.lookAt(7.0, 0, 7.2)
  scene.add(cove2)

  const daylight = new THREE.RectAreaLight(0xdfeaff, 2.5, 11.5, 2.1)
  daylight.position.set(6.2, 1.4, 11.95)
  daylight.lookAt(6.2, 1.0, 7.0)
  scene.add(daylight)

  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
  scene.environmentIntensity = 0.45

  const spots = [[3, 10.2], [5, 9.5], [7.3, 7], [7.5, 6.2], [4.45, 2.7], [7.6, 1.5], [10.1, 1.2], [12, 1.2], [14.6, 2], [18, 2], [18.3, 4.9], [1.4, 7.1], [7, 7.2], [11.1, 7.4], [15.2, 7.4], [18.3, 6.9], [10.4, 10.4], [14.2, 10.6], [18.3, 10.1], [1.5, 3], [6, 13], [9.5, 13.2], [13.2, 7.2]]
  for (const [x, z] of spots) {
    const d = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 0.03, 16), M.down)
    d.position.set(x, 2.87, z)
    scene.add(d)
  }

  const pts = [[3, 10.2, 12], [7.3, 7, 12], [4.45, 2.7, 10], [7.6, 1.5, 8], [14.6, 2, 10], [18, 2, 10], [11.1, 7.4, 10], [15.2, 7.4, 10], [10.4, 10.4, 8], [14.2, 10.6, 12], [18.3, 10.1, 10], [1.4, 7.1, 7], [1.5, 3, 9], [18.3, 6.9, 7], [6, 13, 8]]
  const lights = pts.map(([x, z, i]) => {
    const l = new THREE.PointLight(0xffd9a8, 0, 10, 1.8)
    l.position.set(x, 2.55, z)
    l.userData.i = i
    scene.add(l)
    return l
  })

  function setNight(n) {
    sun.intensity = n ? 0.05 : 3.0
    sun.color.set(n ? 0x7a8ec8 : 0xfff1dc)
    hemi.intensity = n ? 0.06 : 0.5
    amb.intensity = n ? 0.03 : 0.12
    scene.environmentIntensity = n ? 0.1 : 0.45
    scene.background.set(n ? 0x0a0e18 : 0xc3d7e2)
    scene.fog.color.set(n ? 0x0a0e18 : 0xc3d7e2)
    for (const l of lights) l.intensity = n ? l.userData.i : 0
    cove.intensity = n ? 4.0 : 1.5
    cove2.intensity = n ? 3.0 : 1.2
    daylight.intensity = n ? 0.12 : 2.5
    M.led.emissiveIntensity = n ? 2.4 : 0.4
    M.lamp.emissiveIntensity = n ? 2.0 : 0.15
    M.down.emissiveIntensity = n ? 2.0 : 0.3
    M.screen.emissiveIntensity = n ? 1.0 : 0.6
  }

  return { setNight }
}
