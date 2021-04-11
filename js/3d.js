import * as THREE from '../lib/three.module.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { TrackballControls } from '../lib/TrackballControls.js';

const menu = {
  'title': {
    path: 'models/invisiblecities.gltf',
    pos: {},
  },
  'INVISIBLE CITIES': {
    path: 'models/head.gltf',
    pos: {},
  },
  'HABITANTS': {
    path: 'models/walkingman.gltf',
    pos: {},
  },
  'ABOUT PROJECT': {
    path: 'models/knight.gltf',
    pos: {},
  },
  'DATA SILO': {
    path: 'models/instagram.gltf',
    pos: {},
  },
  'INSTAGRAM': {
    path: 'models/milk.gltf',
    pos: {},
  },
  'CREDITS': {
    path: 'models/spoon.gltf',
    pos: {},
  },
  'FACEBOOK': {
    path: 'models/hands.gltf',
    pos: {},
  },
};

const clock = new THREE.Clock();
let mixer;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color('rgb(127, 84, 255)');

const light = new THREE.DirectionalLight();
scene.add(light);

const loader = new GLTFLoader();

for (const [key, value] of Object.entries(menu)) {
  loader.load(value.path, function(gltf) {
    scene.add(gltf.scene);
    if (gltf.animations.length <= 0) {
      mixer = new THREE.AnimationMixer(gltf.scene);
      gltf.animations.forEach(function(clip) {
        mixer.clipAction(clip).play();
      });
    }
  }, undefined, function(err) {
    console.error(err);
  });
}

camera.position.z = 50;

const controls = new TrackballControls(camera, renderer.domElement);
controls.noZoom = true;

function animate() {
	requestAnimationFrame(animate);
  if (mixer) mixer.update(clock.getDelta());
  controls.update();
	renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
