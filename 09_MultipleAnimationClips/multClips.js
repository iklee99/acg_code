/*
    multClips.js: multiple animation clip들 중 선택해서 play 하도록 함

    loadFBX 함수를 추가하여 FBX 파일을 비동기적으로 로드할 수 있도록 했습니다.
    fbxFiles 배열에 여러 FBX 파일의 경로를 지정했습니다.
    모든 FBX 파일을 Promise.all을 사용하여 동시에 로드합니다.
    첫 번째 FBX 객체를 클론하여 기본 객체 (baseObject) 로 사용하고, 나머지 FBX 객체에서 애니메이션 클립만 추출하여 기본 객체에 추가합니다.
    GUI에 애니메이션 클립 이름을 기반으로한 선택 메뉴를 추가하여 사용자가 클립을 선택하고 재생할 수 있게 했습니다.
    await는 async 함수 내부에서만 사용될 수 있습니다. init 함수를 async로 선언해야 합니다.
    clock의 인스턴스가 생성되기 전에 animate 함수가 호출되면 오류가 발생할 수 있습니다.
    clock = new THREE.Clock();를 init 함수의 가장 위쪽으로 이동시켜 animate 함수가 호출될 때 clock이 정상적으로 초기화된 상태로 있도록 해야 합니다.

*/
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { FBXLoader } from 'https://threejs.org/examples/jsm/loaders/FBXLoader.js';

let scene, camera, renderer, mixer, clock;
let controls, gridHelper; 

const fbxFiles = [
    '../models/character2/Idle.fbx',
    '../models/character2/HipHopDancing.fbx',
    '../models/character2/SlowRun.fbx',
    '../models/character2/SneakWalk.fbx',
    '../models/character2/Taunt.fbx',
    '../models/character2/Walking.fbx'
];

let actions = [];
let baseObject;    // to hold the main object

init();
animate();

async function init() {

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

    // load all fbx files simultaneously
    const loadedFBX = await Promise.all(fbxFiles.map(file => loadFBX(loader, file)));
    
    baseObject = loadedFBX[0]; // Use the first loaded FBX as the base object

    // Iterate over loaded FBX files to extract the animation clips
    // Add the animation clips to the baseObject's animations array
    loadedFBX.forEach(fbx => {
        let clip = fbx.animations[0];
        clip.name = fbx.name;  // Set the animation name
        baseObject.animations.push(clip);
    });

    mixer = new THREE.AnimationMixer(baseObject);
    // make actions for all animation clips
    actions = baseObject.animations.map(clip => mixer.clipAction(clip));
    actions[0].play(); // Play the first animation by default
    scene.add(baseObject);

    renameBones(baseObject);

    baseObject.traverse(child => {
        if (child instanceof THREE.SkinnedMesh) {
            displayBoneHierarchy(child);
        }
    });

    console.log(baseObject);

    // GUI 추가
    const gui = new dat.GUI();
    const settings = {
        'Show Bone Tree': true,
        clip: 'Idle'
    };
    gui.add(settings, 'Show Bone Tree').name('Bone Tree').onChange((value) => {
        document.getElementById('boneTree').style.display = value ? 'block' : 'none';
    });
    gui.add(settings, 'clip', baseObject.animations.map(clip => clip.name)).onChange((clipName) => {
        actions.forEach(action => action.stop());
        const selectedClip = actions.find(action => action.getClip().name === clipName);
        selectedClip.play();
    });

    // Window resize event
    window.addEventListener('resize', onWindowResize, false);
}

function loadFBX(loader, url) {
    return new Promise((resolve, reject) => {
        loader.load(url, (object) => {
            object.name = url.split('/').pop().split('.')[0]; // Set the name based on filename
            let objectsToRemove = [];
            object.traverse(child => {
                if (child instanceof THREE.Light || child instanceof THREE.Camera) {
                    objectsToRemove.push(child);
                }
            });
            objectsToRemove.forEach(child => {
                object.remove(child);
            });
            resolve(object);
        }, undefined, reject);
    });
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

