// Text

import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import * as FONT from 'three/addons/loaders/FontLoader.js';
import * as TEXT from 'three/addons/geometries/TextGeometry.js';

// global variables
let scene, camera, renderer, orbit;
let axesHelper, gridHelper; 

// scene
scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);

// camera
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(2, 2, 8);

// renderer
renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// orbit control
orbit = new OrbitControls( camera, renderer.domElement );
orbit.target.set(0, 0, 0);
orbit.update();

// axes Helper
axesHelper = new THREE.AxesHelper(2.5);
scene.add(axesHelper);

// grid helper
gridHelper = new THREE.GridHelper(7, 20);
gridHelper.position.set(0, -0.001, 0);
scene.add( gridHelper );

// text test
// create a font loader
const fontLoader = new FONT.FontLoader();

// load a font file
fontLoader.load('./json-font/ArialUnicode.json', function (font) {

  // create a TextGeometry object
  const textGeometry = new TEXT.TextGeometry('Hello, world!', {
    font: font,
    size: 0.2,
    height: 0.001,
    curveSegments: 12,
    bevelEnabled: false
  });

  // create a MeshBasicMaterial object
  const material = new THREE.MeshBasicMaterial({ color: 0xff00ff });

  // create a mesh from the TextGeometry and MeshBasicMaterial objects
  const mesh = new THREE.Mesh(textGeometry, material);
  mesh.translateZ(-1);
  mesh.translateY(2);
  mesh.translateX(2);

  // add the mesh to the scene
  scene.add(mesh);
});

// Handling resize event
window.addEventListener('resize', resize, false);

requestAnimationFrame(animate);

function animate(time){
    renderer.render( scene, camera );
    //showText2D("Hello World!", new THREE.Vector3(1, 1, -1));
    requestAnimationFrame( animate );
}

function resize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}



