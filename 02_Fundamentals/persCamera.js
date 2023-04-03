import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x444444);

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(3, 3, 4);

const ambient = new THREE.AmbientLight(0x404040);
scene.add(ambient);

const light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set( 1, 10, 6);
scene.add(light);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set(0,0,0);
controls.update();

const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

const geometry = new THREE.BoxGeometry( 1, 1, 1);
const material = new THREE.MeshLambertMaterial({color: new THREE.Color('skyblue')});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

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