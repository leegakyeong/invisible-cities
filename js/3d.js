import * as THREE from '../lib/three.module.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

scene.background = new THREE.Color(0xffffff);

const loader = new GLTFLoader();

loader.load('models/hands.gltf', function(gltf) {
  scene.add(gltf.scene);
}, undefined, function(err) {
  console.error(err);
});

camera.position.z = 50;

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}
animate();
