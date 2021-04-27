import * as THREE from '../lib/three.module.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { OrbitControls } from '../lib/OrbitControls.js';
import { Interaction } from '../lib/three.interaction.module.js';

const clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color('rgb(127, 84, 255)');

const light = new THREE.DirectionalLight();
scene.add(light);

const loader = new GLTFLoader();

const interaction = new Interaction(renderer, scene, camera);

let isDragging = false;

// title
let invisiblecitiesMixer;
loader.load('models/gltf/3d/IC.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(-20, 20, -10);
  gltf.scene.rotateX(Math.PI / 2);

  if (gltf.animations.length > 0) {
    invisiblecitiesMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(clip) {
      invisiblecitiesMixer.clipAction(clip).play();
    });
  }

  // 화면 전체가 아니라 오브젝트만 회전시키기
  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  gltf.scene.on('mousedown', () => isDragging = true)
  .on('mousemove', (e) => {
    if (isDragging) {
      dx = e.data.originalEvent.pageX - prevX;
      dy = e.data.originalEvent.pageY - prevY;

      const deltaQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(dx), rad(dy), 0));
      gltf.scene.quaternion.multiplyQuaternions(deltaQuat, gltf.scene.quaternion);
    }
    prevX = e.data.originalEvent.pageX;
    prevY = e.data.originalEvent.pageY;
  })
  .on('mouseup', () => isDragging = false)
  .on('mouseout', () => isDragging = false);
}, undefined, function(err) {
  console.error(err);
});

// INVISIBLE CITIES
let headMixer;
loader.load('models/gltf/3d/head.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(4, 4, 4);
  gltf.scene.position.set(-60, 10, 0);
  // gltf.scene.rotateX(Math.PI / 2);

  if (gltf.animations.length > 0) {
    headMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(clip) {
      headMixer.clipAction(clip).play();
    });
  }
  gltf.scene.on('mouseover', () => console.log('INVISIBLE CITIES'));
  gltf.scene.on('click', () => location.href = '/invisible-cities.html');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  gltf.scene.on('mousedown', () => isDragging = true)
  .on('mousemove', (e) => {
    if (isDragging) {
      dx = e.data.originalEvent.pageX - prevX;
      dy = e.data.originalEvent.pageY - prevY;

      const deltaQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(dx), rad(dy), 0));
      gltf.scene.quaternion.multiplyQuaternions(deltaQuat, gltf.scene.quaternion);
    }
    prevX = e.data.originalEvent.pageX;
    prevY = e.data.originalEvent.pageY;
  })
  .on('mouseup', () => isDragging = false)
  .on('mouseout', () => isDragging = false);
}, undefined, function(err) {
  console.error(err);
});

// HABITANTS
let walkingmanMixer;
loader.load('models/gltf/3d/Walk.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(-5, 0, 0);
  // gltf.scene.rotateX(Math.PI / 2);
  if (gltf.animations.length > 0) {
    walkingmanMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(clip) {
      walkingmanMixer.clipAction(clip).play();
    });
  }
  gltf.scene.on('mouseover', () => console.log('HABITANTS')); // 이건 왜 안 뜨지..??
  gltf.scene.on('click', () => location.href = '/habitants.html');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  gltf.scene.on('mousedown', () => isDragging = true)
  .on('mousemove', (e) => {
    if (isDragging) {
      dx = e.data.originalEvent.pageX - prevX;
      dy = e.data.originalEvent.pageY - prevY;

      const deltaQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(dx), rad(dy), 0));
      gltf.scene.quaternion.multiplyQuaternions(deltaQuat, gltf.scene.quaternion);
    }
    prevX = e.data.originalEvent.pageX;
    prevY = e.data.originalEvent.pageY;
  })
  .on('mouseup', () => isDragging = false)
  .on('mouseout', () => isDragging = false);
}, undefined, function(err) {
  console.error(err);
});

// ABOUT PROJECT
let knightMixer;
loader.load('models/gltf/3d/AtomLikeSub.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(20, 0, 0);
  // gltf.scene.rotateX(Math.PI / 2);
  if (gltf.animations.length > 0) {
    knightMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(clip) {
      knightMixer.clipAction(clip).play();
    });
  }
  gltf.scene.on('mouseover', () => console.log('ABOUT PROJECT'));
  gltf.scene.on('click', () => location.href = '/about.html');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  gltf.scene.on('mousedown', () => isDragging = true)
  .on('mousemove', (e) => {
    if (isDragging) {
      dx = e.data.originalEvent.pageX - prevX;
      dy = e.data.originalEvent.pageY - prevY;

      const deltaQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(dx), rad(dy), 0));
      gltf.scene.quaternion.multiplyQuaternions(deltaQuat, gltf.scene.quaternion);
    }
    prevX = e.data.originalEvent.pageX;
    prevY = e.data.originalEvent.pageY;
  })
  .on('mouseup', () => isDragging = false)
  .on('mouseout', () => isDragging = false);
}, undefined, function(err) {
  console.error(err);
});

// DATA SILO
let instagramMixer;
loader.load('models/gltf/3d/CloudPlane.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(-20, -20, 0);
  // gltf.scene.rotateX(Math.PI / 2);
  if (gltf.animations.length > 0) {
    instagramMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(clip) {
      instagramMixer.clipAction(clip).play();
    });
  }
  gltf.scene.on('mouseover', () => console.log('DATA SILO'));
  gltf.scene.on('click', () => location.href = '/data-silo.html');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  gltf.scene.on('mousedown', () => isDragging = true)
  .on('mousemove', (e) => {
    if (isDragging) {
      dx = e.data.originalEvent.pageX - prevX;
      dy = e.data.originalEvent.pageY - prevY;

      const deltaQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(dx), rad(dy), 0));
      gltf.scene.quaternion.multiplyQuaternions(deltaQuat, gltf.scene.quaternion);
    }
    prevX = e.data.originalEvent.pageX;
    prevY = e.data.originalEvent.pageY;
  })
  .on('mouseup', () => isDragging = false)
  .on('mouseout', () => isDragging = false);
}, undefined, function(err) {
  console.error(err);
});

// INSTAGRAM
let milkMixer;
loader.load('models/gltf/3d/milk.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(20, -20, 0);
  // gltf.scene.rotateX(Math.PI / 2);
  if (gltf.animations.length > 0) {
    milkMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(clip) {
      milkMixer.clipAction(clip).play();
    });
  }
  gltf.scene.on('mouseover', () => console.log('INSTAGRAM'));
  gltf.scene.on('click', () => location.href = 'https://instagram.com');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  gltf.scene.on('mousedown', () => isDragging = true)
  .on('mousemove', (e) => {
    if (isDragging) {
      dx = e.data.originalEvent.pageX - prevX;
      dy = e.data.originalEvent.pageY - prevY;

      const deltaQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(dx), rad(dy), 0));
      gltf.scene.quaternion.multiplyQuaternions(deltaQuat, gltf.scene.quaternion);
    }
    prevX = e.data.originalEvent.pageX;
    prevY = e.data.originalEvent.pageY;
  })
  .on('mouseup', () => isDragging = false)
  .on('mouseout', () => isDragging = false);
}, undefined, function(err) {
  console.error(err);
});

// CREDITS
let spoonMixer;
loader.load('models/gltf/3d/spoon.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(8, 8, 8);
  gltf.scene.position.set(5, -15, 0);
  // gltf.scene.rotateX(Math.PI / 2);
  if (gltf.animations.length > 0) {
    spoonMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(clip) {
      spoonMixer.clipAction(clip).play();
    });
  }
  gltf.scene.on('mouseover', () => console.log('CREDITS'));
  gltf.scene.on('click', () => location.href = '/credits.html');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  gltf.scene.on('mousedown', () => isDragging = true)
  .on('mousemove', (e) => {
    if (isDragging) {
      dx = e.data.originalEvent.pageX - prevX;
      dy = e.data.originalEvent.pageY - prevY;

      const deltaQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(dx), rad(dy), 0));
      gltf.scene.quaternion.multiplyQuaternions(deltaQuat, gltf.scene.quaternion);
    }
    prevX = e.data.originalEvent.pageX;
    prevY = e.data.originalEvent.pageY;
  })
  .on('mouseup', () => isDragging = false)
  .on('mouseout', () => isDragging = false);
}, undefined, function(err) {
  console.error(err);
});

// FACEBOOK
let handsMixer;
loader.load('models/gltf/3d/hands.gltf', function(gltf) {
  scene.add(gltf.scene);
  // gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(30, 20, 0);
  // gltf.scene.rotateX(Math.PI / 2);
  if (gltf.animations.length > 0) {
    handsMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(clip) {
      handsMixer.clipAction(clip).play();
    });
  }
  gltf.scene.on('mouseover', () => console.log('FACEBOOK'));
  gltf.scene.on('click', () => location.href = 'https://facebook.com');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  gltf.scene.on('mousedown', () => isDragging = true)
  .on('mousemove', (e) => {
    if (isDragging) {
      dx = e.data.originalEvent.pageX - prevX;
      dy = e.data.originalEvent.pageY - prevY;

      const deltaQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(dx), rad(dy), 0));
      gltf.scene.quaternion.multiplyQuaternions(deltaQuat, gltf.scene.quaternion);
    }
    prevX = e.data.originalEvent.pageX;
    prevY = e.data.originalEvent.pageY;
  })
  .on('mouseup', () => isDragging = false)
  .on('mouseout', () => isDragging = false);
}, undefined, function(err) {
  console.error(err);
});

camera.position.z = 40;

const controls = new OrbitControls(camera, renderer.domElement);
controls.noZoom = true;

function animate() {
	requestAnimationFrame(animate);
  if (invisiblecitiesMixer) invisiblecitiesMixer.update(clock.getDelta());
  if (headMixer) headMixer.update(clock.getDelta());
  if (walkingmanMixer) walkingmanMixer.update(clock.getDelta());
  if (knightMixer) knightMixer.update(clock.getDelta());
  if (instagramMixer) instagramMixer.update(clock.getDelta());
  if (milkMixer) milkMixer.update(clock.getDelta());
  if (spoonMixer) spoonMixer.update(clock.getDelta());
  if (handsMixer) handsMixer.update(clock.getDelta());

  controls.enabled = isDragging ? false : true;
  controls.update();

	renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

function rad(deg) {
  return deg * Math.PI / 180;
}
