import * as THREE from '../lib/three.module.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { TrackballControls } from '../lib/TrackballControls.js';

const clock = new THREE.Clock();
let mixer;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color(0xffffff);

const light = new THREE.DirectionalLight();
scene.add(light);

const loader = new GLTFLoader();

loader.load('models/hands.gltf', function(gltf) {
  scene.add(gltf.scene);
  mixer = new THREE.AnimationMixer(gltf.scene);
  gltf.animations.forEach(function(clip) {
    mixer.clipAction(clip).play();
  });
}, undefined, function(err) {
  console.error(err);
});

camera.position.z = 50;

const controls = new TrackballControls(camera, renderer.domElement);

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
