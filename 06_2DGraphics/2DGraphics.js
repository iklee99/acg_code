// Three.js - Camera for 2D Graphics

import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

// renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const width = window.innerWidth;
const height = window.innerHeight;

// OrthographicCamera: left, right, top, button, near, far
const camera = new THREE.OrthographicCamera(-width/2, width/2, height/2, -height/2, 0.01, 1000);
camera.position.set(0, 0, 4);
camera.lookAt(0, 0, 0);

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);
scene.add(camera);

// lines
{
   const material = new THREE.LineBasicMaterial({
      color: 0x0000ff
   });
   
   const points = [];
   points.push( new THREE.Vector3( -200, 0, 0 ) );
   points.push( new THREE.Vector3( 0, 200, 0 ) );
   points.push( new THREE.Vector3( 200, 0, 0 ) );
   
   const geometry = new THREE.BufferGeometry().setFromPoints( points );
   
   const line = new THREE.Line( geometry, material );
   scene.add( line );
}

window.addEventListener( 'resize', resize, false);
requestAnimationFrame(render);


function render(time){
    requestAnimationFrame( render ); 
    renderer.render( scene, camera );
}

function resize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}