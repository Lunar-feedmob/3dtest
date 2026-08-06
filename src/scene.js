import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'

export function createApp() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.12
  document.getElementById('app').appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0xc3d7e2)
  scene.fog = new THREE.Fog(0xc3d7e2, 60, 160)

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.05, 300)
  camera.rotation.order = 'YXZ'

  const aspect = window.innerWidth / window.innerHeight
  const d = 10.5
  const ortho = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 0.1, 300)

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(90, 48),
    new THREE.MeshStandardMaterial({ color: 0x9db48c, roughness: 1 })
  )
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -0.06
  ground.receiveShadow = true
  scene.add(ground)

  const composer = new EffectComposer(renderer)
  composer.addPass(new RenderPass(scene, camera))
  const ssao = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight)
  ssao.kernelRadius = 0.4
  ssao.minDistance = 0.0005
  ssao.maxDistance = 0.05
  composer.addPass(ssao)
  composer.addPass(new OutputPass())

  return { renderer, scene, camera, ortho, composer }
}
