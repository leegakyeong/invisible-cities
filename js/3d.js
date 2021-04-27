import * as THREE from '../lib/three.module.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { OrbitControls } from '../lib/OrbitControls.js';
import { Interaction } from '../lib/three.interaction.module.js';
import { HDRCubeTextureLoader } from '../lib/HDRCubeTextureLoader.js';

const clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// scene.background = new THREE.Color('rgb(127, 84, 255)');
scene.background = new THREE.CubeTextureLoader()
.setPath('models/desert/')
.load([
  'px.png',
  'nx.png',
  'py.png',
  'ny.png',
  'pz.png',
  'nz.png',
]);

// const geometry = new THREE.BoxGeometry();
// const material = new THREE.MeshBasicMaterial();
// material.map = new THREE.CubeTextureLoader()
// .setPath('models/desert/')
// .load([
//   'px.png',
//   'nx.png',
//   'py.png',
//   'ny.png',
//   'pz.png',
//   'nz.png',
// ]);
// material.alphaMap = new THREE.CubeTextureLoader()
// .setPath('models/desert/opacity/')
// .load([
//   'px.png',
//   'nx.png',
//   'py.png',
//   'ny.png',
//   'pz.png',
//   'nz.png',
// ]);
// const bgCube = new THREE.Mesh(geometry, material);
// // bgCube.scale.set(1000, 1000, 1000);
// scene.add(bgCube);

const envMap = new HDRCubeTextureLoader()
.setPath('models/hdr/')
.load([
  'px.hdr',
  'nx.hdr',
  'py.hdr',
  'ny.hdr',
  'pz.hdr',
  'nz.hdr',
]);
scene.environment = envMap;

const light = new THREE.DirectionalLight();
scene.add(light);

const loader = new GLTFLoader();

const mixers = [];

const interaction = new Interaction(renderer, scene, camera);

let isDragging = false;

let cloudPlane;

// title
loader.load('models/gltf/3d/IC.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(-20, 20, -10);

  createMixer(gltf);

  // 화면 전체가 아니라 오브젝트만 회전시키기
  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

// INVISIBLE CITIES
loader.load('models/gltf/3d/head.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(4, 4, 4);
  gltf.scene.position.set(-60, 10, 0);

  createMixer(gltf);

  gltf.scene.on('mouseover', () => console.log('INVISIBLE CITIES'));
  gltf.scene.on('click', () => location.href = '/invisible-cities.html');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

// HABITANTS
loader.load('models/gltf/3d/Walk.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(-5, 0, 0);

  createMixer(gltf);

  gltf.scene.on('mouseover', () => console.log('HABITANTS')); // 이건 왜 안 뜨지..??
  gltf.scene.on('click', () => location.href = '/habitants.html');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

// ABOUT PROJECT
loader.load('models/gltf/3d/AtomLikeSub.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(20, 0, 0);

  createMixer(gltf, 0.2);

  gltf.scene.on('mouseover', () => console.log('ABOUT PROJECT'));
  gltf.scene.on('click', () => location.href = '/about.html');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

// DATA SILO
loader.load('models/gltf/3d/CloudPlane.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(-20, -20, 0);

  cloudPlane = gltf.scene;

  gltf.scene.on('mouseover', () => console.log('DATA SILO'));
  gltf.scene.on('click', () => location.href = '/data-silo.html');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

// INSTAGRAM
loader.load('models/gltf/3d/milk.gltf', function(gltf) {
  // gltf.scene.material.onBeforeCompile = (shader) => {
  //   shader.uniforms.time = { value: 0 };
  //   shader.uniforms.uLungSpeed = { value: 1.34 };
  //   shader.uniforms.uLungDirection = { value: new THREE.Vector3(0.0,0.0,1.0) };
  //   shader.uniforms.uLungPower = { value: 1.0 };
  //   shader.uniforms.waveMulti = { value: 0.4 };
  //   shader.vertexShader =  'uniform vec3  uLungDirection ;\n' + shader.vertexShader;
  //   shader.vertexShader =  'uniform float time;\n' + shader.vertexShader;
  //   shader.vertexShader =  'uniform float waveMulti ;\n' + shader.vertexShader;
  //   shader.vertexShader =  'uniform float uLungSpeed ;\n' + shader.vertexShader;
  //   shader.vertexShader =  'uniform float uLungPower ;\n' + shader.vertexShader;

  //   shader.vertexShader = shader.vertexShader.replace(
  //     '#include <begin_vertex>',
  //     [
  //       `float offset = sin( time*uLungSpeed + position.y*waveMulti  )*uLungPower;`,
  //       `float offset2 = sin( time*uLungSpeed + (position.y+0.1)*waveMulti  )*uLungPower;`,
  //       'vec3 v0 = uLungDirection*offset;',
  //       'vec3 v1 = vec3(0.0,0.1,0.0);',
  //       'vec3 v2 = uLungDirection*offset2+vec3(0.0,0.1,0.0);',
  //       'float RotF = offset - offset2;',
  //       `vec3 axis = vec3(0.0,0.0,1.0);`,
  //       'float dotProduct = dot( v1, v2 );',
  //       'float angleRadians = acos(dotProduct);',

  //       'float sinA = sin( RotF*10.0*uLungPower );',
  //       'float cosA = cos( RotF*10.0*uLungPower );',
  //       'float oneMinusCosA = 1.0f - cosA;',
  //       'mat3 rotator =  mat3( (axis.x * axis.x * oneMinusCosA) + cosA, (axis.y * axis.x * oneMinusCosA) - (sinA * axis.z),  (axis.z * axis.x * oneMinusCosA) + (sinA * axis.y), (axis.x * axis.y * oneMinusCosA) + (sinA * axis.z),  (axis.y * axis.y * oneMinusCosA) + cosA,(axis.z * axis.y * oneMinusCosA) - (sinA * axis.x),(axis.x * axis.z * oneMinusCosA) - (sinA * axis.y), (axis.y * axis.z * oneMinusCosA) + (sinA * axis.x),(axis.z * axis.z * oneMinusCosA) + cosA );',

  //       'vNormal = rotator*vNormal  ;',
  //       'vec3 transformed = vec3( position ) + uLungDirection* offset;',
  //     ].join('\n')
  //   );
  //   gltf.scene.material.userData.shader = shader;
  //   };

  scene.add(gltf.scene);
  gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(20, -20, 0);

  gltf.scene.on('mouseover', () => console.log('INSTAGRAM'));
  gltf.scene.on('click', () => location.href = 'https://instagram.com');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

// CREDITS
loader.load('models/gltf/3d/spoon.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.scale.set(8, 8, 8);
  gltf.scene.position.set(5, -15, 0);

  createMixer(gltf);

  gltf.scene.on('mouseover', () => console.log('CREDITS'));
  gltf.scene.on('click', () => location.href = '/credits.html');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

// FACEBOOK
loader.load('models/gltf/3d/hands.gltf', function(gltf) {
  scene.add(gltf.scene);
  // gltf.scene.scale.set(0.5, 0.5, 0.5);
  gltf.scene.position.set(30, 20, 0);

  createMixer(gltf);

  gltf.scene.on('mouseover', () => console.log('FACEBOOK'));
  gltf.scene.on('click', () => location.href = 'https://facebook.com');

  let prevX = 0;
  let prevY = 0;
  let dx = 0;
  let dy = 0;
  enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

camera.position.z = 40;

const controls = new OrbitControls(camera, renderer.domElement);
controls.noZoom = true;

function animate() {
	requestAnimationFrame(animate);

  const delta = clock.getDelta();

  mixers.forEach(function(mixer) {
    mixer.update(delta);
  });

  if (cloudPlane) {
    cloudPlane.rotation.x += 0.01 * delta;
    cloudPlane.rotation.z += -0.03 * delta;
  }

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

function createMixer(gltf, timeScale) {
  if (gltf.animations.length > 0) {
    const mixer = new THREE.AnimationMixer(gltf.scene);
    gltf.animations.forEach(function(clip) {
      const action = mixer.clipAction(clip);
      if (timeScale) action.timeScale = timeScale;
      action.play();
    });
    mixers.push(mixer);
  } else {
    console.error('This gltf has no animation.');
  }
}

function enableRotation(gltf, prevX, prevY, dx, dy) {
  gltf.scene.on('mousedown', () => isDragging = true)
  .on('mousemove', (e) => {
    const pageX = e.data.originalEvent.pageX;
    const pageY = e.data.originalEvent.pageY;

    if (isDragging) {
      dx = pageX - prevX;
      dy = pageY - prevY;

      const deltaQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(dx), rad(dy), 0));
      gltf.scene.quaternion.multiplyQuaternions(deltaQuat, gltf.scene.quaternion);
    }
    prevX = pageX;
    prevY = pageY;
  })
  .on('mouseup', () => isDragging = false)
  .on('mouseout', () => isDragging = false);
}
