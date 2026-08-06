import * as THREE from 'three';

export function createScene() {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  document.getElementById('app').appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa9c4d8);
  scene.fog = new THREE.Fog(0xa9c4d8, 60, 140);

  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.05, 300);
  camera.rotation.order = 'YXZ';

  const hemi = new THREE.HemisphereLight(0xdfe8f2, 0x8a7a66, 0.55);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.22);
  scene.add(ambient);

  const sun = new THREE.DirectionalLight(0xfff2dd, 3.0);
  sun.position.set(14, 22, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -22;
  sun.shadow.camera.right = 22;
  sun.shadow.camera.top = 22;
  sun.shadow.camera.bottom = -22;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 70;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  scene.add(sun);
  scene.add(sun.target);

  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(80, 48),
    new THREE.MeshStandardMaterial({ color: 0x8fa283, roughness: 1 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.12;
  ground.receiveShadow = true;
  scene.add(ground);

  const indoorLights = [];
  const glowMats = [];

  const state = { isDay: true };

  function setDayNight(isDay) {
    state.isDay = isDay;
    if (isDay) {
      scene.background.set(0xa9c4d8);
      scene.fog.color.set(0xa9c4d8);
      sun.intensity = 3.0;
      sun.color.set(0xfff2dd);
      hemi.intensity = 0.55;
      ambient.intensity = 0.22;
      indoorLights.forEach(l => { l.intensity = 1.2; });
      glowMats.forEach(m => { m.emissiveIntensity = 0.15; });
    } else {
      scene.background.set(0x0a0f1e);
      scene.fog.color.set(0x0a0f1e);
      sun.intensity = 0.25;
      sun.color.set(0x8fa8d8);
      hemi.intensity = 0.1;
      ambient.intensity = 0.06;
      indoorLights.forEach(l => { l.intensity = 9; });
      glowMats.forEach(m => { m.emissiveIntensity = 2.2; });
    }
  }

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return { renderer, scene, camera, sun, hemi, ambient, indoorLights, glowMats, setDayNight, state };
}
