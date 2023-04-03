import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x444444);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(2, 2, 4);

const ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xFFFFFF, 1); // color, intensity
light.position.set( 1, 10, 6);
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set(0,0,0);
controls.update();

const axesHelper = new THREE.AxesHelper(2.5);
scene.add(axesHelper);

//Add meshes here
const geometry = new THREE.BoxGeometry( 1, 1, 1);
const material1 = new THREE.MeshPhongMaterial({color: new THREE.Color('skyblue')});
const material2 = new THREE.MeshPhongMaterial({color: new THREE.Color(0xFFA500)});
const material3 = new THREE.MeshPhongMaterial({color: new THREE.Color(0x20B2AA)});
const cube1 = new THREE.Mesh(geometry, material1);
const cube2 = new THREE.Mesh(geometry, material2); 
const cube3 = new THREE.Mesh(geometry, material3); 
cube1.position.x = -1.5;
cube2.position.x = 0;
cube3.position.x = 1.5; 
scene.add(cube1);
scene.add(cube2);
scene.add(cube3);

window.addEventListener('resize', resize, false);

requestAnimationFrame(render);

function render(time){
    time *= 0.001;                    // convert time to seconds
    cube1.rotation.x = time;
    cube2.rotation.y = time; 
    cube3.rotation.z = time;  
    renderer.render( scene, camera );
    requestAnimationFrame( render );
}

function resize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}