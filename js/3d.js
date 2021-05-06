import * as THREE from '../lib/three.module.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { OrbitControls } from '../lib/OrbitControls.js';
import { Interaction } from '../lib/three.interaction.module.js';
import { HDRCubeTextureLoader } from '../lib/HDRCubeTextureLoader.js';

const clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let milkMaterial;

const lightning1Video = document.getElementById('lightning1');
lightning1Video.load();

const lightning2Video = document.getElementById('lightning1');
lightning2Video.load();

const lightning3Video = document.getElementById('lightning1');
lightning3Video.load();

let lightning1Time = 0;
let lightning2Time = -1;
let lightning3Time = -2;

const skyUrls = [
  './models/sky/px.png',
  './models/sky/nx.png',
  './models/sky/py.png',
  './models/sky/ny.png',
  './models/sky/pz.png',
  './models/sky/nz.png',
];
const skyLoader = new THREE.CubeTextureLoader();
scene.background = skyLoader.load(skyUrls);

const desertMaterialArray = []; // setPath 같은 걸로 한꺼번에 가져오면 오류가 나서..ㅜㅜ
let mapTexturePX = new THREE.TextureLoader().load('./models/desert/px.png');
let mapTextureNX = new THREE.TextureLoader().load('./models/desert/nx.png');
let mapTexturePY = new THREE.TextureLoader().load('./models/desert/py.png');
let mapTextureNY = new THREE.TextureLoader().load('./models/desert/ny.png');
let mapTexturePZ = new THREE.TextureLoader().load('./models/desert/pz.png');
let mapTextureNZ = new THREE.TextureLoader().load('./models/desert/nz.png');

let alphaMapTexturePX = new THREE.TextureLoader().load('./models/desert/opacity/px.png');
let alphaMapTextureNX = new THREE.TextureLoader().load('./models/desert/opacity/nx.png');
let alphaMapTexturePY = new THREE.TextureLoader().load('./models/desert/opacity/py.png');
let alphaMapTextureNY = new THREE.TextureLoader().load('./models/desert/opacity/ny.png');
let alphaMapTexturePZ = new THREE.TextureLoader().load('./models/desert/opacity/pz.png');
let alphaMapTextureNZ = new THREE.TextureLoader().load('./models/desert/opacity/nz.png');

desertMaterialArray.push(new THREE.MeshBasicMaterial({ map: mapTexturePX, alphaMap: alphaMapTexturePX, transparent: true }));
desertMaterialArray.push(new THREE.MeshBasicMaterial({ map: mapTextureNX, alphaMap: alphaMapTextureNX, transparent: true }));
desertMaterialArray.push(new THREE.MeshBasicMaterial({ map: mapTexturePY, alphaMap: alphaMapTexturePY, transparent: true }));
desertMaterialArray.push(new THREE.MeshBasicMaterial({ map: mapTextureNY, alphaMap: alphaMapTextureNY, transparent: true }));
desertMaterialArray.push(new THREE.MeshBasicMaterial({ map: mapTexturePZ, alphaMap: alphaMapTexturePZ, transparent: true }));
desertMaterialArray.push(new THREE.MeshBasicMaterial({ map: mapTextureNZ, alphaMap: alphaMapTextureNZ, transparent: true }));

for (let i = 0; i < 6; i++) desertMaterialArray[i].side = THREE.DoubleSide;

let desertGeometry = new THREE.BoxGeometry( 1000, 1000, 1000);
let desert = new THREE.Mesh(desertGeometry, desertMaterialArray);
scene.add(desert);

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
  gltf.scene.position.set(0, 15, -40);

  createMixer(gltf);

  // let prevX = 0;
  // let prevY = 0;
  // let dx = 0;
  // let dy = 0;
  // enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

// HABITANTS
loader.load('models/gltf/3d/Walk.gltf', function(gltf) {
scene.add(gltf.scene);
gltf.scene.position.set(Math.cos(Math.PI/4)*50, -10, -Math.sin(Math.PI/4)*50);
gltf.scene.scale.set(10, 10, 10);

createMixer(gltf);

gltf.scene.on('mouseover', () => console.log('HABITANTS')); // 이건 왜 안 뜨지..??
gltf.scene.on('click', () => location.href = '/habitants.html');

// let prevX = 0;
// let prevY = 0;
// let dx = 0;
// let dy = 0;
// enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
console.error(err);
});

// ABOUT PROJECT
loader.load('models/gltf/3d/AtomLikeSub.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(50, -10, 0);
  gltf.scene.scale.set(3, 3, 3);

  createMixer(gltf, 0.2);

  gltf.scene.on('mouseover', () => console.log('ABOUT PROJECT'));
  gltf.scene.on('click', () => location.href = '/about.html');

  // let prevX = 0;
  // let prevY = 0;
  // let dx = 0;
  // let dy = 0;
  // enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

// DATA SILO
loader.load('models/gltf/3d/CloudPlane.gltf', function(gltf) {
  const video = document.getElementById('cloud');
  video.load();
  video.play();

  const texture = new THREE.VideoTexture(video);
  texture.format =THREE.RGBAFormat;

  gltf.scene.children[0].material.map = texture;

  scene.add(gltf.scene);
  gltf.scene.position.set(Math.cos(Math.PI/4)*50, 0, Math.sin(Math.PI/4)*50);
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  gltf.scene.rotation.y = -Math.PI/6;

  cloudPlane = gltf.scene;

  gltf.scene.on('mouseover', () => console.log('DATA SILO'));
  gltf.scene.on('click', () => location.href = '/data-silo.html');

  // let prevX = 0;
  // let prevY = 0;
  // let dx = 0;
  // let dy = 0;
  // enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

// INSTAGRAM
loader.load('models/gltf/3d/milk.gltf', function(gltf) {
  milkMaterial = gltf.scene.children[0].material;
  milkMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.time = { value: 0 };
    shader.uniforms.uLungSpeed = { value: 1.34 };
    shader.uniforms.uLungDirection = { value: new THREE.Vector3(0.0,0.0,1.0) };
    shader.uniforms.uLungPower = { value: 1.0 };
    shader.uniforms.waveMulti = { value: 0.4 };
    shader.vertexShader =  'uniform vec3  uLungDirection ;\n' + shader.vertexShader;
    shader.vertexShader =  'uniform float time;\n' + shader.vertexShader;
    shader.vertexShader =  'uniform float waveMulti ;\n' + shader.vertexShader;
    shader.vertexShader =  'uniform float uLungSpeed ;\n' + shader.vertexShader;
    shader.vertexShader =  'uniform float uLungPower ;\n' + shader.vertexShader;

    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      [
        `float offset = sin( time*uLungSpeed + position.y*waveMulti  )*uLungPower;`,
        `float offset2 = sin( time*uLungSpeed + (position.y+0.1)*waveMulti  )*uLungPower;`,
        'vec3 v0 = uLungDirection*offset;',
        'vec3 v1 = vec3(0.0,0.1,0.0);',
        'vec3 v2 = uLungDirection*offset2+vec3(0.0,0.1,0.0);',
        'float RotF = offset - offset2;',
        `vec3 axis = vec3(0.0,0.0,1.0);`,
        'float dotProduct = dot( v1, v2 );',
        'float angleRadians = acos(dotProduct);',

        'float sinA = sin( RotF*10.0*uLungPower );',
        'float cosA = cos( RotF*10.0*uLungPower );',
        'float oneMinusCosA = 1.0f - cosA;',
        'mat3 rotator =  mat3( (axis.x * axis.x * oneMinusCosA) + cosA, (axis.y * axis.x * oneMinusCosA) - (sinA * axis.z),  (axis.z * axis.x * oneMinusCosA) + (sinA * axis.y), (axis.x * axis.y * oneMinusCosA) + (sinA * axis.z),  (axis.y * axis.y * oneMinusCosA) + cosA,(axis.z * axis.y * oneMinusCosA) - (sinA * axis.x),(axis.x * axis.z * oneMinusCosA) - (sinA * axis.y), (axis.y * axis.z * oneMinusCosA) + (sinA * axis.x),(axis.z * axis.z * oneMinusCosA) + cosA );',

        'vNormal = rotator*vNormal  ;',
        'vec3 transformed = vec3( position ) + uLungDirection* offset;',
      ].join('\n')
    );
    milkMaterial.userData.shader = shader;
  };

  scene.add(gltf.scene);
  gltf.scene.position.set(0, -10, 50);
  gltf.scene.scale.set(0.7, 0.7, 0.7);

  gltf.scene.on('mouseover', () => console.log('INSTAGRAM'));
  gltf.scene.on('click', () => location.href = 'https://instagram.com');

  // let prevX = 0;
  // let prevY = 0;
  // let dx = 0;
  // let dy = 0;
  // enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

// CREDITS
loader.load('models/gltf/3d/spoon.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(-Math.cos(Math.PI/4)*50, -10, Math.sin(Math.PI/4)*50);
  gltf.scene.scale.set(7, 7, 7);

  createMixer(gltf);

  gltf.scene.on('mouseover', () => console.log('CREDITS'));
  gltf.scene.on('click', () => location.href = '/credits.html');

  // let prevX = 0;
  // let prevY = 0;
  // let dx = 0;
  // let dy = 0;
  // enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

// FACEBOOK
loader.load('models/gltf/3d/hands.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(-50, 0, 0);

  createMixer(gltf);

  gltf.scene.on('mouseover', () => console.log('FACEBOOK'));
  gltf.scene.on('click', () => location.href = 'https://facebook.com');

  // let prevX = 0;
  // let prevY = 0;
  // let dx = 0;
  // let dy = 0;
  // enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

// INVISIBLE CITIES
loader.load('models/gltf/3d/head.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(-Math.cos(Math.PI/4)*50, 0, -Math.sin(Math.PI/4)*50);
  gltf.scene.scale.set(1.2, 1.2, 1.2);

  createMixer(gltf);

  gltf.scene.on('mouseover', () => console.log('INVISIBLE CITIES'));
  gltf.scene.on('click', () => location.href = '/invisible-cities.html');

  // let prevX = 0;
  // let prevY = 0;
  // let dx = 0;
  // let dy = 0;
  // enableRotation(gltf, prevX, prevY, dx, dy);
}, undefined, function(err) {
  console.error(err);
});

loader.load('models/gltf/2d/check.glb', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(-Math.cos(Math.PI/3)*50-20, -10, -Math.sin(Math.PI/3)*5-40);
  gltf.scene.scale.set(16, 16, 16);
  gltf.scene.rotation.x = Math.PI;
}, undefined, function(err) {
  console.error(err);
});

loader.load('models/gltf/2d/card.glb', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(Math.cos(Math.PI/3)*50-10, 15, -Math.sin(Math.PI/3)*50-20);
  gltf.scene.scale.set(15, 15, 15);
}, undefined, function(err) {
  console.error(err);
});

loader.load('models/gltf/2d/stairs.glb', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(Math.cos(Math.PI/3)*50, 10, Math.sin(Math.PI/3)*50);
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.rotation.y = Math.PI/6;
}, undefined, function(err) {
  console.error(err);
});

loader.load('models/gltf/2d/string.glb', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(-50, 0, 0);
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.rotation.y = Math.PI / 2;
}, undefined, function(err) {
  console.error(err);
});

// lightning 1
loader.load('models/gltf/3d/CloudPlane.gltf', function(gltf) {
  const texture = new THREE.VideoTexture(lightning1Video);
  texture.format = THREE.RGBAFormat;

  // gltf.scene.children[0].material.transparent = true;
  gltf.scene.children[0].material.map = texture;

  gltf.scene.position.set(0, 0, 0);
  // gltf.scene.scale.set(100, 100, 100);

  // gltf.scene.rotation.x = -Math.PI / 2;
  gltf.scene.children[0].material.map = texture;
  gltf.scene.children[0].material.emissive = new THREE.Color('rgb(255, 255, 255)');
  gltf.scene.children[0].material.emissiveMap = texture;
  gltf.scene.children[0].material.emissiveIntensity = 90;

  scene.add(gltf.scene);
});

// lightning 2
loader.load('models/gltf/3d/CloudPlane.gltf', function(gltf) {
  const texture = new THREE.VideoTexture(lightning2Video);
  texture.format = THREE.RGBAFormat;

  gltf.scene.children[0].material.transparent = true;
  gltf.scene.children[0].material.map = texture;

  gltf.scene.position.set(0, 100, 0);
  // gltf.scene.scale.set(30, 30, 30);
  // gltf.scene.rotation.x = -Math.PI / 2;
  // gltf.scene.rotation.z = -Math.PI / 4;
  gltf.scene.children[0].material.map = texture;
  gltf.scene.children[0].material.emissive = new THREE.Color('rgb(255, 255, 255)');
  gltf.scene.children[0].material.emissiveMap = texture;
  gltf.scene.children[0].material.emissiveIntensity  = 90;

  scene.add(gltf.scene);
});

// lightning 3
loader.load('models/gltf/3d/CloudPlane.gltf', function(gltf) {
  const texture = new THREE.VideoTexture(lightning3Video);
  texture.format = THREE.RGBAFormat;

  gltf.scene.children[0].material.transparent = true;
  gltf.scene.children[0].material.map = texture;

  gltf.scene.position.set(100, 0, 0);
  // gltf.scene.scale.set(45, 45, 45);
  // gltf.scene.rotation.x = -Math.PI / 2;
  // gltf.scene.rotation.z = Math.PI / 4;
  gltf.scene.children[0].material.map = texture;
  gltf.scene.children[0].material.emissive = new THREE.Color('rgb(255, 255, 255)');
  gltf.scene.children[0].material.emissiveMap = texture;
  gltf.scene.children[0].material.emissiveIntensity = 90;

  scene.add(gltf.scene);
});

camera.position.z = 1;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;

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

  if (milkMaterial && milkMaterial.userData.shader) {
    milkMaterial.userData.shader.uniforms.time.value = performance.now() / 1000;
  }

  lightning1Time += delta;
  lightning2Time += delta;
  lightning3Time += delta;
  if (lightning1Time > 3) {
    lightning1Time = 0;
    lightning1Video.play();
  }
  if (lightning2Time > 3) {
    lightning2Time = 0;
    lightning2Video.play();
  }
  if (lightning3Time > 3) {
    lightning3Time = 0;
    lightning3Video.play();
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
  .on('touchstart', () => isDragging = true)
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
  .on('touchmove', (e) => {
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
  .on('mouseout', () => isDragging = false)
  .on('touchend', () => isDragging = false);
}
