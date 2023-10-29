import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'https://threejs.org/examples/jsm/loaders/FBXLoader.js';

let scene, camera, renderer, mixer, clock;
let controls, gridHelper; 

init();
animate();

function init() {

    // Clock
    clock = new THREE.Clock();

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
    gridHelper.position.set(0, -0.001, 0);
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

        renameBones(object);         // bone 이름 변경: 앞부분의 "mixamorig" 제거

        // bone hierarchy를 display
        object.traverse(child => {
            if (child instanceof THREE.SkinnedMesh) {
                displayBoneHierarchy(child);
            }
        });

        console.log(object);
    });

    // GUI 추가
    const gui = new dat.GUI();
    const settings = {
        'Show Bone Tree': true
    };
    gui.add(settings, 'Show Bone Tree').name('Bone Tree').onChange((value) => {
        document.getElementById('boneTree').style.display = value ? 'block' : 'none';
    });

    // Window resize event
    window.addEventListener('resize', onWindowResize, false);
}

function renameBones(object) {
    object.traverse(child => {
        if (child instanceof THREE.Bone) {
            child.name = child.name.replace("mixamorig", "");
        }
    });
}

function createBoneTree(bone, ulElement) {
    let li = document.createElement('li');
    li.textContent = bone.name;
    ulElement.appendChild(li);

    if (bone.children.length > 0) {
        let childUl = document.createElement('ul');
        childUl.style.marginLeft = '30px';  // 들여쓰기 간격 조정
        childUl.style.paddingLeft = '15px';  // 들여쓰기 간격 조정
        li.appendChild(childUl);
        bone.children.forEach(childBone => {
            createBoneTree(childBone, childUl);
        });
    }
}

function displayBoneHierarchy(skinnedMesh) {
    let rootUl = document.createElement('ul');
    document.getElementById('boneTree').appendChild(rootUl);

    skinnedMesh.skeleton.bones.forEach(bone => {
        if (bone.parent.type !== 'Bone') {  // 최상위 본만 초기 시작점으로 선택
            createBoneTree(bone, rootUl);
        }
    });
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

