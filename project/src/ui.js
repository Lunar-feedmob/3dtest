export function initUI(app, controls) {
  const btnFP = document.getElementById('btnFP');
  const btnBird = document.getElementById('btnBird');
  const btnAxo = document.getElementById('btnAxo');
  const btnPlan = document.getElementById('btnPlan');
  const btnLight = document.getElementById('btnLight');
  const planOverlay = document.getElementById('planOverlay');
  const lockTip = document.getElementById('lockTip');
  const crosshair = document.getElementById('crosshair');
  const hint = document.getElementById('hint');
  const roomLabel = document.getElementById('roomLabel');

  const viewBtns = [btnFP, btnBird, btnAxo, btnPlan];

  function setActive(btn) {
    viewBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }

  let planOpen = false;

  function showMode(mode) {
    planOpen = mode === 'plan';
    planOverlay.style.display = planOpen ? 'flex' : 'none';
    if (mode === 'plan') {
      controls.setMode('bird');
      setActive(btnPlan);
      lockTip.style.display = 'none';
      crosshair.style.display = 'none';
      roomLabel.style.display = 'none';
      hint.textContent = '2D 户型图 · 点击其他视角返回 3D';
      return;
    }
    controls.setMode(mode);
    if (mode === 'fp') {
      setActive(btnFP);
      lockTip.style.display = 'flex';
      crosshair.style.display = 'block';
      roomLabel.style.display = 'block';
      hint.textContent = 'WASD 移动 · 鼠标环顾 · Esc 退出 · 1/2/3/4 切换视角';
    } else if (mode === 'bird') {
      setActive(btnBird);
      lockTip.style.display = 'none';
      crosshair.style.display = 'none';
      roomLabel.style.display = 'none';
      hint.textContent = '鸟瞰视角 · 拖拽旋转 · 滚轮缩放';
    } else {
      setActive(btnAxo);
      lockTip.style.display = 'none';
      crosshair.style.display = 'none';
      roomLabel.style.display = 'none';
      hint.textContent = '轴测展示 · 拖拽旋转 · 滚轮缩放';
    }
  }

  btnFP.addEventListener('click', () => showMode('fp'));
  btnBird.addEventListener('click', () => showMode('bird'));
  btnAxo.addEventListener('click', () => showMode('axo'));
  btnPlan.addEventListener('click', () => showMode('plan'));
  planOverlay.addEventListener('click', () => showMode('bird'));

  btnLight.addEventListener('click', () => {
    const isDay = app.state.isDay;
    app.setDayNight(isDay ? false : true);
    btnLight.textContent = isDay ? '白天自然光' : '夜晚灯光';
    btnLight.classList.toggle('active', isDay);
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Digit1') showMode('fp');
    if (e.code === 'Digit2') showMode('bird');
    if (e.code === 'Digit3') showMode('axo');
    if (e.code === 'Digit4') showMode('plan');
  });

  document.addEventListener('pointerlockchange', () => {
    const locked = document.pointerLockElement === app.renderer.domElement;
    if (controls.ctl.mode === 'fp') {
      lockTip.style.display = locked ? 'none' : 'flex';
    }
  });

  function tick() {
    if (controls.ctl.mode === 'fp') {
      roomLabel.textContent = controls.roomAt();
    }
  }

  showMode('fp');
  return { tick };
}
