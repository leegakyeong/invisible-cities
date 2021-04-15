import * as THREE from '../lib/three.module.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { OrbitControls } from '../lib/OrbitControls.js';

const clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color('rgb(127, 84, 255)');

const light = new THREE.DirectionalLight();
scene.add(light);

const loader = new GLTFLoader();

// title
let invisiblecitiesMixer;
loader.load('models/invisiblecities.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(-20, 20, 0);
  gltf.scene.rotateX(Math.PI / 2);
  if (gltf.animations.length > 0) {
    invisiblecitiesMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(clip) {
      invisiblecitiesMixer.clipAction(clip).play();
    });
  }
}, undefined, function(err) {
  console.error(err);
});

// INVISIBLE CITIES
let headMixer;
loader.load('models/head.gltf', function(gltf) {
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
}, undefined, function(err) {
  console.error(err);
});

// HABITANTS
let walkingmanMixer;
loader.load('models/walkingman.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(5, 5, 5);
  gltf.scene.position.set(0, 0, 0);
  // gltf.scene.rotateX(Math.PI / 2);
  if (gltf.animations.length > 0) {
    walkingmanMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(clip) {
      walkingmanMixer.clipAction(clip).play();
    });
  }
}, undefined, function(err) {
  console.error(err);
});

// ABOUT PROJECT
let knightMixer;
loader.load('models/knight.gltf', function(gltf) {
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
}, undefined, function(err) {
  console.error(err);
});

// DATA SILO
let instagramMixer;
loader.load('models/instagram.gltf', function(gltf) {
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
}, undefined, function(err) {
  console.error(err);
});

// INSTAGRAM
let milkMixer;
loader.load('models/milk.gltf', function(gltf) {
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
}, undefined, function(err) {
  console.error(err);
});

// CREDITS
let spoonMixer;
loader.load('models/spoon.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(4, 4, 4);
  gltf.scene.position.set(0, -10, 0);
  // gltf.scene.rotateX(Math.PI / 2);
  if (gltf.animations.length > 0) {
    spoonMixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(clip) {
      spoonMixer.clipAction(clip).play();
    });
  }
}, undefined, function(err) {
  console.error(err);
});

// FACEBOOK
let handsMixer;
loader.load('models/hands.gltf', function(gltf) {
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
}, undefined, function(err) {
  console.error(err);
});

camera.position.z = 50;

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
  controls.update();
	renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
