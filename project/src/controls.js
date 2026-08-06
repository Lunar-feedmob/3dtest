import * as THREE from 'three';

export function createControls(app, house) {
  const camera = app.camera;
  const dom = app.renderer.domElement;

  const ctl = {
    mode: 'fp',
    pos: new THREE.Vector3(house.spawn.x, 1.6, house.spawn.z),
    yaw: house.spawn.yaw,
    pitch: 0,
    keys: {},
    orbit: { theta: 0.6, phi: 0.9, radius: 26, target: new THREE.Vector3(0, 0, 0) },
    locked: false,
  };

  const EYE = 1.6, R = 0.28, SPEED = 3.2;

  function collides(x, z) {
    for (const c of house.colliders) {
      if (x > c.minX - R && x < c.maxX + R && z > c.minZ - R && z < c.maxZ + R) return true;
    }
    return false;
  }

  function setMode(mode) {
    ctl.mode = mode;
    if (mode === 'fp') {
      house.ceilingGroup.visible = true;
      camera.position.copy(ctl.pos);
      camera.rotation.set(ctl.pitch, ctl.yaw, 0);
    } else {
      if (document.pointerLockElement === dom) document.exitPointerLock();
      house.ceilingGroup.visible = false;
      if (mode === 'bird') {
        ctl.orbit.theta = 0;
        ctl.orbit.phi = 0.18;
        ctl.orbit.radius = 26;
      } else if (mode === 'axo') {
        ctl.orbit.theta = 0.72;
        ctl.orbit.phi = 0.95;
        ctl.orbit.radius = 24;
      }
    }
  }

  document.addEventListener('keydown', e => { ctl.keys[e.code] = true; });
  document.addEventListener('keyup', e => { ctl.keys[e.code] = false; });

  dom.addEventListener('click', () => {
    if (ctl.mode === 'fp' && !ctl.locked) dom.requestPointerLock();
  });

  document.addEventListener('pointerlockchange', () => {
    ctl.locked = document.pointerLockElement === dom;
  });

  document.addEventListener('mousemove', e => {
    if (ctl.mode === 'fp' && ctl.locked) {
      ctl.yaw -= e.movementX * 0.0022;
      ctl.pitch -= e.movementY * 0.0022;
      ctl.pitch = Math.max(-1.45, Math.min(1.45, ctl.pitch));
    } else if ((ctl.mode === 'bird' || ctl.mode === 'axo') && dragging) {
      ctl.orbit.theta -= e.movementX * 0.005;
      ctl.orbit.phi -= e.movementY * 0.005;
      ctl.orbit.phi = Math.max(0.08, Math.min(1.45, ctl.orbit.phi));
    }
  });

  let dragging = false;
  dom.addEventListener('mousedown', () => { dragging = true; });
  document.addEventListener('mouseup', () => { dragging = false; });

  dom.addEventListener('wheel', e => {
    if (ctl.mode === 'fp') return;
    ctl.orbit.radius = Math.max(6, Math.min(45, ctl.orbit.radius + e.deltaY * 0.02));
  }, { passive: true });

  function updateFP(dt) {
    const k = ctl.keys;
    let f = 0, r = 0;
    if (k['KeyW'] || k['ArrowUp']) f += 1;
    if (k['KeyS'] || k['ArrowDown']) f -= 1;
    if (k['KeyD'] || k['ArrowRight']) r += 1;
    if (k['KeyA'] || k['ArrowLeft']) r -= 1;
    if (f !== 0 || r !== 0) {
      const len = Math.hypot(f, r);
      f /= len; r /= len;
      const sp = (k['ShiftLeft'] || k['ShiftRight']) ? SPEED * 1.7 : SPEED;
      const sin = Math.sin(ctl.yaw), cos = Math.cos(ctl.yaw);
      const dx = (-sin * f + cos * r) * sp * dt;
      const dz = (-cos * f - sin * r) * sp * dt;
      if (!collides(ctl.pos.x + dx, ctl.pos.z)) ctl.pos.x += dx;
      if (!collides(ctl.pos.x, ctl.pos.z + dz)) ctl.pos.z += dz;
    }
    ctl.pos.y = EYE;
    camera.position.copy(ctl.pos);
    camera.rotation.set(ctl.pitch, ctl.yaw, 0);
  }

  function updateOrbit() {
    const o = ctl.orbit;
    const sp = Math.sin(o.phi), cp = Math.cos(o.phi);
    camera.position.set(
      o.target.x + o.radius * sp * Math.sin(o.theta),
      o.radius * cp,
      o.target.z + o.radius * sp * Math.cos(o.theta)
    );
    camera.lookAt(o.target);
  }

  function roomAt() {
    const x = ctl.pos.x + 8.1, z = ctl.pos.z + 5.55;
    for (const r of house.rooms) {
      if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) return r.name;
    }
    return '';
  }

  function update(dt) {
    if (ctl.mode === 'fp') updateFP(dt);
    else updateOrbit();
  }

  return { ctl, update, setMode, roomAt };
}
