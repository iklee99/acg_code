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
    camera.position.set(0, 80, 400);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // orbit control
    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set(0,0,0);
    controls.update();

    // Lighting
    let ambientLight = new THREE.AmbientLight(0x222222, 1);
    scene.add(ambientLight);
    let directionalLight = new THREE.DirectionalLight(0xcccccc, 0.8);
    directionalLight.position.set(200, 200, 0);
    scene.add(directionalLight);
    let pointLight = new THREE.PointLight(0x999999, 0.5);
    pointLight.position.set(0, 100, 200);
    scene.add(pointLight);

    // grid helper
    gridHelper = new THREE.GridHelper(800, 50, 0x222222, 0x444444);
    gridHelper.position.set(0, -0.01, 0);
    scene.add( gridHelper );

    // FBX Loader
    let loader = new FBXLoader();
    loader.load('../models/character2/Idle.fbx', (object) => {
        let objectsToRemove = [];

        object.traverse(child => {
            // light나 camera가 포함되어 있을 경우 제거할 리스트에 담아 둠
            if (child instanceof THREE.Light || child instanceof THREE.Camera) {
                objectsToRemove.push(child);
            }
        });

        objectsToRemove.forEach(child => {   // 제거 리스트에 담긴 것들을 제거
            object.remove(child);
        });

        mixer = new THREE.AnimationMixer(object);
        let action = mixer.clipAction(object.animations[0]);
        action.play();
        scene.add(object);
        console.log(object);
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

