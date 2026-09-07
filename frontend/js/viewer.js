/* ============ 3D HUMANOID ============ */
const SKIN = 0x545e73;
const HEAD_COLOR = 0x6b7488;
const HL_PRIMARY = 0xff5d5d;
const HL_SECONDARY = 0xff9b85;

const ARRAY_PARTS = new Set(['obliques','shoulders','biceps','triceps','forearms','quads','hamstrings','calves']);

function makeMat(color){
  return new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.08 });
}

function box(w,h,d,x,y,z,color){
  const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), makeMat(color));
  m.position.set(x,y,z);
  return m;
}
function cyl(r,h,x,y,z,color){
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r,r*0.9,h,12), makeMat(color));
  m.position.set(x,y,z);
  return m;
}
function ball(r,x,y,z,color){
  const m = new THREE.Mesh(new THREE.SphereGeometry(r,16,16), makeMat(color));
  m.position.set(x,y,z);
  return m;
}

// Builds the figure, returns { group, parts } where parts[muscleKey] = mesh | [meshes]
function buildHumanoid(){
  const group = new THREE.Group();
  const parts = {};

  const pelvis = box(0.46,0.26,0.28, 0,0.9,0, SKIN); group.add(pelvis);
  const chest = box(0.5,0.36,0.16, 0,1.36,0.1, SKIN); group.add(chest); parts.chest = chest;
  const abs = box(0.38,0.26,0.13, 0,1.06,0.1, SKIN); group.add(abs); parts.abs = abs;
  const obliqueL = box(0.11,0.3,0.16, -0.27,1.1,0.03, SKIN); group.add(obliqueL);
  const obliqueR = box(0.11,0.3,0.16, 0.27,1.1,0.03, SKIN); group.add(obliqueR);
  parts.obliques = [obliqueL, obliqueR];
  const lats = box(0.46,0.3,0.13, 0,1.32,-0.12, SKIN); group.add(lats); parts.lats = lats;
  const traps = box(0.36,0.16,0.13, 0,1.56,-0.1, SKIN); group.add(traps); parts.traps = traps;
  const lowerback = box(0.32,0.16,0.11, 0,1.0,-0.11, SKIN); group.add(lowerback); parts.lowerback = lowerback;
  const glutes = box(0.42,0.24,0.15, 0,0.86,-0.11, SKIN); group.add(glutes); parts.glutes = glutes;

  const neck = cyl(0.075,0.12, 0,1.68,0, HEAD_COLOR); group.add(neck); parts.neck = neck;
  const head = ball(0.16, 0,1.86,0, HEAD_COLOR); group.add(head);

  const shoulderL = ball(0.1, -0.32,1.58,0, SKIN);
  const shoulderR = ball(0.1, 0.32,1.58,0, SKIN);
  group.add(shoulderL, shoulderR); parts.shoulders = [shoulderL, shoulderR];

  const bicepsArr = [], tricepsArr = [], forearmsArr = [], quadsArr = [], hamstringsArr = [], calvesArr = [];
  const armPivots = [];
  [-1,1].forEach(side => {
    const shoulderX = side*0.32, shoulderY = 1.58;
    const armPivot = new THREE.Group();
    armPivot.position.set(shoulderX, shoulderY, 0);
    group.add(armPivot);
    armPivots.push(armPivot);

    const bi = box(0.12,0.34,0.1, 0,-0.17,0.08, SKIN); armPivot.add(bi); bicepsArr.push(bi);
    const tri = box(0.12,0.34,0.1, 0,-0.17,-0.08, SKIN); armPivot.add(tri); tricepsArr.push(tri);
    const fa = cyl(0.06,0.3, 0,-0.49,0, SKIN); armPivot.add(fa); forearmsArr.push(fa);
    const hand = ball(0.07, 0,-0.68,0, SKIN); armPivot.add(hand);

    const thighX = side*0.16;
    const qd = box(0.19,0.5,0.12, thighX,0.56,0.08, SKIN); group.add(qd); quadsArr.push(qd);
    const hs = box(0.19,0.5,0.12, thighX,0.56,-0.08, SKIN); group.add(hs); hamstringsArr.push(hs);
    const cf = cyl(0.09,0.4, thighX,0.14,0, SKIN); group.add(cf); calvesArr.push(cf);
    const foot = box(0.1,0.06,0.22, thighX,-0.09,0.05, HEAD_COLOR); group.add(foot);
  });
  parts.biceps = bicepsArr; parts.triceps = tricepsArr; parts.forearms = forearmsArr;
  parts.quads = quadsArr; parts.hamstrings = hamstringsArr; parts.calves = calvesArr;

  // store base colors for reset
  Object.keys(parts).forEach(key => {
    const arr = ARRAY_PARTS.has(key) ? parts[key] : [parts[key]];
    arr.forEach(m => { m.userData.baseColor = m.material.color.getHex(); });
  });

  return { group, parts, armPivots };
}

function resetHighlights(parts){
  Object.keys(parts).forEach(key => {
    const arr = ARRAY_PARTS.has(key) ? parts[key] : [parts[key]];
    arr.forEach(m => {
      m.material.color.setHex(m.userData.baseColor);
      m.material.emissive.setHex(0x000000);
    });
  });
}

function applyHighlight(parts, key, color, emissiveIntensity){
  if (!parts[key]) return;
  const arr = ARRAY_PARTS.has(key) ? parts[key] : [parts[key]];
  arr.forEach(m => {
    m.material.color.setHex(color);
    m.material.emissive.setHex(color);
    m.material.emissiveIntensity = emissiveIntensity;
  });
}

function highlightExercise(parts, exercise){
  resetHighlights(parts);
  applyHighlight(parts, exercise.primary, HL_PRIMARY, 0.55);
  (exercise.secondary || []).forEach(k => applyHighlight(parts, k, HL_SECONDARY, 0.3));
}

/* ============ BOXING PUNCH SYSTEM ============ */
// armIndex 0 = left (side -1), 1 = right (side 1)
const PUNCH_PRESETS = {
  1: { armIndex: 0, label: 'Jab',           rot: { x: -2.05, y: 0,    z: 0    }, twist: 0 },
  2: { armIndex: 1, label: 'Cross',         rot: { x: -2.15, y: 0,    z: 0    }, twist: 0.18 },
  3: { armIndex: 0, label: 'Left Hook',     rot: { x: -1.1,  y: 0,    z: 1.35 }, twist: 0.12 },
  4: { armIndex: 1, label: 'Right Hook',    rot: { x: -1.1,  y: 0,    z: -1.35}, twist: -0.12 },
  5: { armIndex: 0, label: 'Left Uppercut', rot: { x: -1.7,  y: 0,    z: 0.55 }, twist: 0.1 },
  6: { armIndex: 1, label: 'Right Uppercut',rot: { x: -1.7,  y: 0,    z: -0.55}, twist: -0.1 },
};

/* ============ VIEWER CONTROLLER ============ */
// Creates a Three.js viewer inside `container` for `exercise`. Returns a cleanup fn.
function createViewer(container, exercise){
  const width = container.clientWidth, height = container.clientHeight;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, width/height, 0.1, 20);
  camera.position.set(0, 1.25, 3.1);
  camera.lookAt(0, 1.1, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(2, 3, 2);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5eead4, 0.4);
  rim.position.set(-2, 1, -2);
  scene.add(rim);

  const { group, parts, armPivots } = buildHumanoid();
  scene.add(group);
  highlightExercise(parts, exercise);

  let targetRotY = 0, dragging = false, lastX = 0, idleT = 0;
  const dom = renderer.domElement;
  dom.style.cursor = 'grab';
  dom.style.touchAction = 'none';

  // punch queue: each item { armIndex, rot, twist }, played sequentially by the render loop
  const punchQueue = [];
  let activePunch = null; // { pivot, target, twist, phase, hold }

  function stepPunches(){
    if (!activePunch && punchQueue.length) {
      const p = punchQueue.shift();
      activePunch = { pivot: armPivots[p.armIndex], target: p.rot, twist: p.twist || 0, phase: 'extend', hold: 5 };
    }
    if (!activePunch) return;
    const ap = activePunch;
    if (ap.phase === 'extend') {
      ap.pivot.rotation.x += (ap.target.x - ap.pivot.rotation.x) * 0.5;
      ap.pivot.rotation.z += (ap.target.z - ap.pivot.rotation.z) * 0.5;
      targetRotY += (ap.twist - 0) * 0.02;
      if (Math.abs(ap.target.x - ap.pivot.rotation.x) < 0.05 && Math.abs(ap.target.z - ap.pivot.rotation.z) < 0.05) {
        ap.phase = 'hold';
      }
    } else if (ap.phase === 'hold') {
      ap.hold -= 1;
      if (ap.hold <= 0) ap.phase = 'retract';
    } else if (ap.phase === 'retract') {
      ap.pivot.rotation.x += (0 - ap.pivot.rotation.x) * 0.35;
      ap.pivot.rotation.z += (0 - ap.pivot.rotation.z) * 0.35;
      if (Math.abs(ap.pivot.rotation.x) < 0.03 && Math.abs(ap.pivot.rotation.z) < 0.03) {
        ap.pivot.rotation.x = 0; ap.pivot.rotation.z = 0;
        activePunch = null;
      }
    }
  }

  function onDown(e){ dragging = true; lastX = (e.touches ? e.touches[0].clientX : e.clientX); dom.style.cursor = 'grabbing'; idleT = 0; }
  function onMove(e){
    if (!dragging) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const dx = x - lastX; lastX = x;
    targetRotY += dx * 0.012;
  }
  function onUp(){ dragging = false; dom.style.cursor = 'grab'; idleT = 0; }

  dom.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);

  let raf = null;
  function animate(){
    raf = requestAnimationFrame(animate);
    stepPunches();
    if (!dragging) {
      idleT += 1;
      if (idleT > 90 && !activePunch) targetRotY += 0.0025; // gentle auto-rotate after idling
    }
    group.rotation.y += (targetRotY - group.rotation.y) * 0.15;
    const breathe = 1 + Math.sin(Date.now()*0.0015) * 0.006;
    group.scale.set(breathe, breathe, breathe);
    renderer.render(scene, camera);
  }
  animate();

  let ro = null;
  if (window.ResizeObserver) {
    ro = new ResizeObserver(() => {
      const w = container.clientWidth, h = container.clientHeight;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    ro.observe(container);
  }

  function setView(mode){
    if (mode === 'front') targetRotY = 0;
    else if (mode === 'side') targetRotY = Math.PI/2;
    else if (mode === 'back') targetRotY = Math.PI;
    idleT = 0;
  }

  function setExercise(newExercise){
    exercise = newExercise;
    highlightExercise(parts, exercise);
  }

  function queuePunch(num){
    const p = PUNCH_PRESETS[num];
    if (p) punchQueue.push(p);
  }

  function cleanup(){
    cancelAnimationFrame(raf);
    dom.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    if (ro) ro.disconnect();
    renderer.dispose();
    scene.traverse(obj => { if (obj.geometry) obj.geometry.dispose(); if (obj.material) obj.material.dispose(); });
    if (dom.parentNode) dom.parentNode.removeChild(dom);
  }

  return { cleanup, setView, setExercise, queuePunch };
}
