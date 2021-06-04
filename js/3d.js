import * as THREE from '../lib/three.module.js';
import { GLTFLoader } from '../lib/GLTFLoader.js';
import { OrbitControls } from '../lib/OrbitControls.js';
import { Interaction } from '../lib/three.interaction.module.js';
import { HDRCubeTextureLoader } from '../lib/HDRCubeTextureLoader.js';

const manager = new THREE.LoadingManager();
const loading = document.getElementById('loading');
loading.addEventListener('animationend', () => {
  document.body.removeChild(loading);
});

manager.onLoad = () => {
  loading.classList.add('fadeout');
}

const clock = new THREE.Clock();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(0, 0, 1);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let milkMaterial;

const lightning1Video = document.getElementById('lightning1');
lightning1Video.load();

const lightning2Video = document.getElementById('lightning2');
lightning2Video.load();

const lightning3Video = document.getElementById('lightning3');
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

let desertGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
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
envMap.rotation = Math.PI;
scene.environment = envMap;

const light = new THREE.DirectionalLight();
scene.add(light);

const loader = new GLTFLoader(manager);

const mixers = [];

const interaction = new Interaction(renderer, scene, camera);

const labels = [];

let dragObject;

// title
loader.load('models/gltf/3d/IC.gltf', function(gltf) {
  scene.add(gltf.scene);
  gltf.scene.position.set(0, 35, -40);
  gltf.scene.children[0].material.color = new THREE.Color(0xffffff);

  createMixer(gltf);

  gltf.scene.userData = {
    prevX: 0,
    prevY: 0,
    dx: 0,
    dy: 0,
  };
}, undefined, function(err) {
  console.error(err);
});

// HABITANTS
let actualObjectToRotate; // fakePlane을 만지면 이게 돌아감
loader.load('models/gltf/3d/Walk.gltf', function(gltf) {
  const gltfScene = gltf.scene;
  actualObjectToRotate = gltfScene;

  gltfScene.traverse(function(object) {
    object.frustumCulled = false;
  });

  scene.add(gltfScene);
  gltfScene.position.set(Math.cos(Math.PI/4)*50, 32, -Math.sin(Math.PI/4)*50);
  gltfScene.scale.set(20, 20, 20);
  gltfScene.rotation.z = Math.PI;

  createMixer(gltf);

  gltfScene.userData = {
    prevX: 0,
    prevY: 0,
    dx: 0,
    dy: 0,
  };

  createLabel(gltf, 'HABITANTS', { x: -5.5, y: -40 }, '/habitants.html');
}, undefined, function(err) {
console.error(err);
});

// habitants 대신 마우스 이벤트를 받을 투명한 판
// habitants가 클릭이 안 돼서...
const fakePlane = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 36),
  new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffffff), transparent: true, side: THREE.DoubleSide, opacity: 0, depthWrite: false })
);
scene.add(fakePlane);
fakePlane.position.set(Math.cos(Math.PI/4)*50-5, 15, -Math.sin(Math.PI/4)*50+5);
fakePlane.rotation.y = -Math.PI / 8;
fakePlane.on('mouseover', () => fakePlane.cursor = 'pointer');
fakePlane.on('click', () => {
  if (!dragObject) location.href = '/habitants.html';
});
fakePlane.on('touchend', () => {
  if (!dragObject) location.href = '/habitants.html';
});
fakePlane.name = 'fakePlane';

// ABOUT PROJECT
loader.load('models/gltf/3d/AtomLikeSub.gltf', function(gltf) {
  const gltfScene = gltf.scene;

  scene.add(gltfScene);
  gltfScene.position.set(50, -10, 0);
  gltfScene.scale.set(6, 6, 6);

  createMixer(gltf, 0.2);

  gltfScene.userData = {
    prevX: 0,
    prevY: 0,
    dx: 0,
    dy: 0,
  };


  gltfScene.on('mouseover', () => gltfScene.cursor = 'pointer');
  gltfScene.on('click', () => {
    if (!dragObject) location.href = '/about.html';
  });
  gltfScene.on('touchend', () => {
    if (!dragObject) location.href = '/about.html';
  });

  createLabel(gltf, 'ABOUT PROJECT', { x: -3, y: -8, z: -10 }, '/about.html');
}, undefined, function(err) {
  console.error(err);
});

// DATA SILO
loader.load('models/gltf/3d/CloudPlane.gltf', function(gltf) {
  const gltfScene = gltf.scene;

  const texture = new THREE.TextureLoader().load('models/img/cloud.png');
  texture.format = THREE.RGBAFormat;

  gltfScene.children[0].material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
    transparent: true,
  });
  gltfScene.children[0].name = 'CloudPlane';

  scene.add(gltfScene);
  gltfScene.position.set(Math.cos(Math.PI/4)*50, 40, Math.sin(Math.PI/4)*50);
  gltfScene.scale.set(0.4, 0.4, 0.4);
  gltfScene.rotation.y = -Math.PI/6;

  gltfScene.userData = {
    prevX: 0,
    prevY: 0,
    dx: 0,
    dy: 0,
  };

  gltfScene.on('mouseover', () => gltfScene.cursor = 'pointer');
  gltfScene.on('click', () => {
    if (!dragObject) location.href = '/data-silo.html';
  });
  gltfScene.on('touchend', () => {
    if (!dragObject) location.href = '/data-silo.html';
  });

  createLabel(gltf, 'DATA SILO', { x: 20, y: -16, z: 5 }, '/data-silo.html');
}, undefined, function(err) {
  console.error(err);
});

// INSTAGRAM
loader.load('models/gltf/3d/milk.gltf', function(gltf) {
  const gltfScene = gltf.scene;

  milkMaterial = gltfScene.children[0].material;
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

  scene.add(gltfScene);
  gltfScene.position.set(0, 10, 50);
  gltfScene.scale.set(0.7, 0.7, 0.7);

  gltfScene.userData = {
    prevX: 0,
    prevY: 0,
    dx: 0,
    dy: 0,
  };

  gltfScene.on('mouseover', () => gltfScene.cursor = 'pointer');
  gltfScene.on('click', () => {
    if (!dragObject) location.href = 'https://instagram.com';
  });
  gltfScene.on('touchend', () => {
    if (!dragObject) location.href = 'https://instagram.com';
  });

  createLabel(gltf, 'INSTAGRAM', { x: 20, y: -14, z: 10 }, 'https://instagram.com');
}, undefined, function(err) {
  console.error(err);
});

// CREDITS
loader.load('models/gltf/3d/spoon.gltf', function(gltf) {
  const gltfScene = gltf.scene;

  scene.add(gltfScene);
  gltfScene.position.set(-Math.cos(Math.PI/4)*50, 10, Math.sin(Math.PI/4)*50);
  gltfScene.scale.set(7, 7, 7);

  createMixer(gltf);

  gltfScene.userData = {
    prevX: 0,
    prevY: 0,
    dx: 0,
    dy: 0,
  };

  gltfScene.on('mouseover', () => gltfScene.cursor = 'pointer');
  gltfScene.on('click', () => {
    if (!dragObject) location.href = '/credits.html';
  });
  gltfScene.on('touchend', () => {
    if (!dragObject) location.href = '/credits.html';
  });

  createLabel(gltf, 'CREDITS', { x: 0, y: -32 }, '/credits.html');
}, undefined, function(err) {
  console.error(err);
});

// FACEBOOK
loader.load('models/gltf/3d/hands.gltf', function(gltf) {
  const gltfScene = gltf.scene;

  scene.add(gltfScene);
  gltfScene.position.set(-50, 10, 0);
  // gltfScene.rotation.y = -Math.PI / 4;

  createMixer(gltf);

  gltfScene.userData = {
    prevX: 0,
    prevY: 0,
    dx: 0,
    dy: 0,
  };

  gltfScene.on('mouseover', () => gltfScene.cursor = 'pointer');
  gltfScene.on('click', () => {
    if (!dragObject) location.href = 'https://facebook.com';
  });
  gltfScene.on('touchend', () => {
    if (!dragObject) location.href = 'https://facebook.com';
  });

  createLabel(gltf, 'FACEBOOK', { x: 0, y: 8 }, 'https://facebook.com');
}, undefined, function(err) {
  console.error(err);
});

// INVISIBLE CITIES
loader.load('models/gltf/3d/head.gltf', function(gltf) {
  const gltfScene = gltf.scene;

  scene.add(gltfScene);
  gltfScene.position.set(-Math.cos(Math.PI/4)*50, 20, -Math.sin(Math.PI/4)*50);
  gltfScene.scale.set(1.7, 1.7, 1.7);

  createMixer(gltf);

  gltfScene.userData = {
    prevX: 0,
    prevY: 0,
    dx: 0,
    dy: 0,
  };

  gltfScene.on('mouseover', () => gltfScene.cursor = 'pointer');
  gltfScene.on('click', () => {
    if (!dragObject) location.href = '/invisible-cities.html';
  });
  gltfScene.on('touchend', () => {
    if (!dragObject) location.href = '/invisible-cities.html';
  });

  createLabel(gltf, 'INVISIBLE CITIES', { x: -10, y: -18 }, '/invisible-cities.html');
}, undefined, function(err) {
  console.error(err);
});

// material for 2d objects
const plainWhiteMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffffff)});

loader.load('models/gltf/2d/check.glb', function(gltf) {
  const gltfScene = gltf.scene;
  gltfScene.children[4].material = plainWhiteMaterial;

  scene.add(gltfScene);
  gltfScene.position.set(-Math.cos(Math.PI/3)*50-20, 30, -Math.sin(Math.PI/3)*5-60);
  gltfScene.scale.set(30, 30, 30);
  gltfScene.rotation.x = Math.PI;
  gltfScene.rotation.y = -Math.PI / 8;
}, undefined, function(err) {
  console.error(err);
});

loader.load('models/gltf/2d/card.glb', function(gltf) {
  const gltfScene = gltf.scene;
  gltfScene.children[4].material = plainWhiteMaterial;

  scene.add(gltfScene);
  gltfScene.position.set(Math.cos(Math.PI/3)*50-10, 35, -Math.sin(Math.PI/3)*50-20);
  gltfScene.scale.set(20, 20, 20);
  gltfScene.rotation.y = Math.PI;
  gltfScene.rotation.x = Math.PI / 8;
}, undefined, function(err) {
  console.error(err);
});

loader.load('models/gltf/2d/stairs.glb', function(gltf) {
  const gltfScene = gltf.scene;
  gltfScene.children[4].material = plainWhiteMaterial;

  scene.add(gltfScene);
  gltfScene.position.set(Math.cos(Math.PI/3)*50+30, 80, Math.sin(Math.PI/3)*50+60);
  gltfScene.scale.set(24, 24, 24);
  gltfScene.rotation.y = Math.PI / 4;
}, undefined, function(err) {
  console.error(err);
});

loader.load('models/gltf/2d/string.glb', function(gltf) {
  const gltfScene = gltf.scene;
  gltfScene.children[4].material = plainWhiteMaterial;

  scene.add(gltfScene);
  gltfScene.position.set(-50, 20, 10);
  gltfScene.scale.set(15, 15, 15);
  gltfScene.rotation.y = -Math.PI / 2;
  gltfScene.rotation.z = Math.PI;
}, undefined, function(err) {
  console.error(err);
});

// lightning 1
loader.load('models/gltf/3d/CloudPlane.gltf', function(gltf) {
  const texture = new THREE.VideoTexture(lightning1Video);
  texture.format = THREE.RGBAFormat;

  const gltfScene = gltf.scene;
  const material = gltfScene.children[0].material;

  gltfScene.position.set(0, 300, -500); // 앞
  gltfScene.scale.set(12, 12, 12);
  gltfScene.rotation.y = Math.PI / 2;

  material.transparent = true;
  material.map = texture;
  material.emissive = new THREE.Color('rgb(255, 255, 255)');
  material.emissiveMap = texture;
  material.emissiveIntensity = 90;

  scene.add(gltfScene);
});

// lightning 2
loader.load('models/gltf/3d/CloudPlane.gltf', function(gltf) {
  const texture = new THREE.VideoTexture(lightning2Video);
  texture.format = THREE.RGBAFormat;

  const gltfScene = gltf.scene;
  const material = gltfScene.children[0].material;

  gltfScene.position.set(-500, 300, 0); // 왼쪽
  gltfScene.scale.set(12, 12, 12);

  material.transparent = true;
  material.map = texture;
  material.emissive = new THREE.Color('rgb(255, 255, 255)');
  material.emissiveMap = texture;
  material.emissiveIntensity  = 90;

  scene.add(gltfScene);
});

// lightning 3
loader.load('models/gltf/3d/CloudPlane.gltf', function(gltf) {
  const texture = new THREE.VideoTexture(lightning3Video);
  texture.format = THREE.RGBAFormat;

  const gltfScene = gltf.scene;
  const material = gltfScene.children[0].material;

  gltfScene.position.set(500, 300, 0); // 오른쪽
  gltfScene.scale.set(12, 12, 12);

  material.transparent = true;
  material.map = texture;
  material.emissive = new THREE.Color('rgb(255, 255, 255)');
  material.emissiveMap = texture;
  material.emissiveIntensity = 90;

  scene.add(gltfScene);
});

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.target = new THREE.Vector3(0, 0.8, -1); // 절댓값이 아니라 x, y, z 간의 상대적인 차이가 중요한 듯 (약분(?) 가능)

function animate() {
	requestAnimationFrame(animate);

  const delta = clock.getDelta();

  mixers.forEach((mixer) => mixer.update(delta));

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

  labels.forEach((label) => updateLabelPos(label));

  // controls.enabled = isDragging ? false : true;
  controls.enabled = dragObject ? false : true;
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

function createLabel(gltf, text, margin, url) {
  const div = document.createElement('div');
  div.innerHTML = text;
  div.style.fontFamily = 'Helvetica';
  div.style.fontSize = '14px';
  div.style.backgroundColor = 'white';
  div.style.color = 'black';
  div.style.padding = '4px 16px';
  div.style.whiteSpace = 'nowrap';
  div.style.position = 'absolute';
  div.style.cursor = 'pointer';

  div.onclick = () => location.href = url;

  const vector = gltf.scene.position.clone();
  vector.project(camera);

  const label = { div, gltf, vector, margin };
  updateLabelPos(label);

  document.body.appendChild(div);

  labels.push(label);
}

function updateLabelPos({ div, gltf, vector, margin }) {
  // 3d position to 2d position
  // const vector = new THREE.Vector3();
  // const widthHalf = renderer.domElement.width / 2;
  // const heightHalf = renderer.domElement.height / 2;
  const widthHalf = window.innerWidth / 2;
  const heightHalf = window.innerHeight / 2;
  // label.gltf.scene.updateMatrixWorld();
  // vector.setFromMatrixPosition(label.gltf.scene.matrixWorld);
  vector = gltf.scene.position.clone();
  if (margin.x) vector.x += margin.x;
  if (margin.y) vector.y += margin.y;
  if (margin.z) vector.z += margin.z;
  vector.project(camera);
  if (vector.z <= 1) {
    div.style.display = '';
    vector.x = (vector.x * widthHalf) + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;
    div.style.left = vector.x + 'px';
    div.style.top = vector.y + 'px';
  } else {
    div.style.display = 'none';
  }
  // vector.x = (vector.x * widthHalf) + widthHalf;
  // vector.y = -(vector.y * heightHalf) + heightHalf;
  // div.style.left = vector.x + 'px';
  // div.style.top = vector.y + 'px';
}

// for dragging
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// https://discourse.threejs.org/t/mousedown-event-is-not-getting-triggered/18685
window.addEventListener('pointerdown', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);

  const parentName = intersects[0].object.parent.name;
  const objectName = intersects[0].object.name;
  if (parentName === 'justNull' || parentName === 'Bip001' || parentName === 'Rotator') {
    dragObject = intersects[0].object.parent.parent;
  } else if (objectName === 'Curve' || objectName === 'CloudPlane' || objectName === 'Milk') {
    dragObject = intersects[0].object.parent;
  } else if (parentName === 'Knight012') {
    dragObject = intersects[0].object.parent.parent.parent;
  } else if (objectName === 'fakePlane') {
    dragObject = actualObjectToRotate;
  }
}, false);

window.addEventListener('pointermove', (e) => {
  if (dragObject) {
    const pageX = e.pageX;
    const pageY = e.pageY;

    dragObject.userData.dx = pageX - dragObject.userData.prevX;
    dragObject.userData.dy = pageY - dragObject.userData.prevY;

    const deltaQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(rad(dragObject.userData.dx), rad(dragObject.userData.dy), 0));
    dragObject.quaternion.multiplyQuaternions(deltaQuat, dragObject.quaternion);

    dragObject.userData.prevX = pageX;
    dragObject.userData.prevY = pageY;
  }
}, false);

window.addEventListener('pointerup', () => dragObject = undefined, false);
