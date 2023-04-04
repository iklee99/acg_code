// Text
// from ttf to json fonts: http://gero3.github.io/facetype.js/

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
let tmesh = textMesh('./json-font/ArialUnicode.json', 'First Text', 0.2, 0xff00ff, 0, 0, 0);
scene.add(tmesh); 

// Handling resize event
window.addEventListener('resize', resize, false);

requestAnimationFrame(animate);

function textMesh(fontpath, str, size, color, x, y, z) {
  let mesh; 
  const fontLoader = new FONT.FontLoader();

  // load a font file
  fontLoader.load(fontpath, function (font) {
  
    // create a TextGeometry object
    const textGeometry = new TEXT.TextGeometry(str, {
      font: font,
      size: size,
      height: 0.001,
      curveSegments: 12,
      bevelEnabled: false
    });
  
    // create a MeshBasicMaterial object
    const material = new THREE.MeshBasicMaterial({ color: color });
  
    // create a mesh from the TextGeometry and MeshBasicMaterial objects
    mesh = new THREE.Mesh(textGeometry, material);
    mesh.translateZ(z);
    mesh.translateY(y);
    mesh.translateX(x);
  });  
  return mesh; 
}

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



