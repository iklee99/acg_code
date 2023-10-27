import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'https://threejs.org/examples/jsm/loaders/FBXLoader.js';

let scene, camera, renderer, mixer, clock;
let controls, gridHelper; 

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 100, 500);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // orbit control
    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set(0,0,0);
    controls.update();

    // Lighting
    let ambientLight = new THREE.AmbientLight(0x888888, 0.4);
    scene.add(ambientLight);
    let directionalLight = new THREE.DirectionalLight(0xaaaaaa, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    // grid helper
    gridHelper = new THREE.GridHelper(800, 50, 0x222222, 0x444444);
    gridHelper.position.set(0, -0.01, 0);
    scene.add( gridHelper );

    // FBX Loader
    let loader = new FBXLoader();
    loader.load('./models/character2/Idle.fbx', (object) => {
        mixer = new THREE.AnimationMixer(object);
        let action = mixer.clipAction(object.animations[0]);
        action.play();
        scene.add(object);
    });

    // Clock
    clock = new THREE.Clock();

    // Window resize event
    window.addEventListener('resize', onWindowResize, false);
}

function animate() {
    requestAnimationFrame(animate);
    let delta = clock.getDelta();
    if (mixer) mixer.update(delta);
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

