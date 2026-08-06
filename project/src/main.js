import { createScene } from './scene.js';
import { buildHouse } from './house.js';
import { createControls } from './controls.js';
import { initUI } from './ui.js';

const app = createScene();
const house = buildHouse(app);
const controls = createControls(app, house);
const ui = initUI(app, controls);

const clock = { last: performance.now() };

function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - clock.last) / 1000);
  clock.last = now;
  controls.update(dt);
  ui.tick();
  app.renderer.render(app.scene, app.camera);
}
requestAnimationFrame(loop);
