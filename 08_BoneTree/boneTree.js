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
    gridHelper.position.set(0, -0.001, 0);
    scene.add( gridHelper );

    // FBX Loader
    let loader = new FBXLoader();
    loader.load('./models/character2/Hip Hop Dancing.fbx', (object) => {
        mixer = new THREE.AnimationMixer(object);
        let action = mixer.clipAction(object.animations[0]);
        action.play();
        scene.add(object);

        renameBones(object);         // bone 이름 변경: 앞부분의 "mixamorig" 제거

        //printBoneHierarchy(object);  // bone 계층 구조를 출력하는 함수를 호출

        object.traverse(child => {
            if (child instanceof THREE.SkinnedMesh) {
                displayBoneHierarchy(child);
            }
        });
    });

    // GUI 추가
    const gui = new dat.GUI();
    const settings = {
        'Show Bone Tree': true
    };
    gui.add(settings, 'Show Bone Tree').name('Bone Tree').onChange((value) => {
        document.getElementById('boneTree').style.display = value ? 'block' : 'none';
    });

    // Clock
    clock = new THREE.Clock();

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

/*
function printBoneHierarchy(object) {
    object.traverse(child => {
        if (child instanceof THREE.SkinnedMesh) {
            console.log("Bone Hierarchy:");
            child.skeleton.bones.forEach(bone => {
                console.log(bone.name);  // 본의 이름을 출력
            });
        }
    });
}
*/

function createBoneTree(bone, ulElement) {
    let li = document.createElement('li');
    li.textContent = bone.name;
    ulElement.appendChild(li);

    if (bone.children.length > 0) {
        let childUl = document.createElement('ul');
        childUl.style.marginLeft = '10px';  // 들여쓰기 간격 조정
        childUl.style.paddingLeft = '5px';  // 들여쓰기 간격 조정
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

