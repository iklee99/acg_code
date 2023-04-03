import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';

function main() {

    // renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );
  
    // camera
    const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(0, 0, 12);
  
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);

    // orbit control
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set(0,0,0);
    controls.update();

    // Stats
    const stats = new Stats();
    stats.showPanel(0);  // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild( stats.dom );

    // Lights
    const ambient = new THREE.AmbientLight(0x404040);
    scene.add(ambient); 
    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(-1, 2, 4);
      scene.add(light);
    }
  
    // NOT A GOOD EXAMPLE OF HOW TO MAKE A CUBE!
    // Only trying to make it clear most vertices are unique
    const vertices = [
        // front
        { pos: [-1, -1,  1], norm: [ 0,  0,  1], uv: [0, 0], }, // 0
        { pos: [ 1, -1,  1], norm: [ 0,  0,  1], uv: [1, 0], }, // 1
        { pos: [-1,  1,  1], norm: [ 0,  0,  1], uv: [0, 1], }, // 2
        { pos: [ 1,  1,  1], norm: [ 0,  0,  1], uv: [1, 1], }, // 3
        // right
        { pos: [ 1, -1,  1], norm: [ 1,  0,  0], uv: [0, 0], }, // 4
        { pos: [ 1, -1, -1], norm: [ 1,  0,  0], uv: [1, 0], }, // 5
        { pos: [ 1,  1,  1], norm: [ 1,  0,  0], uv: [0, 1], }, // 6
        { pos: [ 1,  1, -1], norm: [ 1,  0,  0], uv: [1, 1], }, // 7
        // back
        { pos: [ 1, -1, -1], norm: [ 0,  0, -1], uv: [0, 0], }, // 8
        { pos: [-1, -1, -1], norm: [ 0,  0, -1], uv: [1, 0], }, // 9
        { pos: [ 1,  1, -1], norm: [ 0,  0, -1], uv: [0, 1], }, // 10
        { pos: [-1,  1, -1], norm: [ 0,  0, -1], uv: [1, 1], }, // 11
        // left
        { pos: [-1, -1, -1], norm: [-1,  0,  0], uv: [0, 0], }, // 12
        { pos: [-1, -1,  1], norm: [-1,  0,  0], uv: [1, 0], }, // 13
        { pos: [-1,  1, -1], norm: [-1,  0,  0], uv: [0, 1], }, // 14
        { pos: [-1,  1,  1], norm: [-1,  0,  0], uv: [1, 1], }, // 15
        // top
        { pos: [ 1,  1, -1], norm: [ 0,  1,  0], uv: [0, 0], }, // 16
        { pos: [-1,  1, -1], norm: [ 0,  1,  0], uv: [1, 0], }, // 17
        { pos: [ 1,  1,  1], norm: [ 0,  1,  0], uv: [0, 1], }, // 18
        { pos: [-1,  1,  1], norm: [ 0,  1,  0], uv: [1, 1], }, // 19
        // bottom
        { pos: [ 1, -1,  1], norm: [ 0, -1,  0], uv: [0, 0], }, // 20
        { pos: [-1, -1,  1], norm: [ 0, -1,  0], uv: [1, 0], }, // 21
        { pos: [ 1, -1, -1], norm: [ 0, -1,  0], uv: [0, 1], }, // 22
        { pos: [-1, -1, -1], norm: [ 0, -1,  0], uv: [1, 1], }, // 23
    ];

    const numVertices = vertices.length;
    const positionNumComponents = 3;  // position은 x, y, z 세개의 component로 되어 있어요.
    const normalNumComponents = 3; // normal은 x, y, z 세개의 component로 되어 있네요. 
    const uvNumComponents = 2; // uv는 두개의 component로 되어 있음. 
    const positions = new Float32Array(numVertices * positionNumComponents);
    const normals = new Float32Array(numVertices * normalNumComponents);
    const uvs = new Float32Array(numVertices * uvNumComponents);

    let posNdx = 0;
    let nrmNdx = 0;
    let uvNdx = 0;

    for (const vertex of vertices) {
        positions.set(vertex.pos, posNdx);
        normals.set(vertex.norm, nrmNdx);
        uvs.set(vertex.uv, uvNdx);
        posNdx += positionNumComponents;
        nrmNdx += normalNumComponents;
        uvNdx += uvNumComponents;
    }
  
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, positionNumComponents));
    geometry.setAttribute(
        'normal',
        new THREE.BufferAttribute(normals, normalNumComponents));
    geometry.setAttribute(
        'uv',
        new THREE.BufferAttribute(uvs, uvNumComponents));
  
    geometry.setIndex([
        0,  1,  2,   2,  1,  3,  // front
        4,  5,  6,   6,  5,  7,  // right
        8,  9, 10,  10,  9, 11,  // back
        12, 13, 14,  14, 13, 15,  // left
        16, 17, 18,  18, 17, 19,  // top
        20, 21, 22,  22, 21, 23,  // bottom
    ]);
  
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/star.png');
  
    function makeInstance(geometry, color, x) {
        const material = new THREE.MeshPhongMaterial({color, map: texture});

        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        cube.position.x = x;
        return cube;
    }
  
    const cubes = [
        makeInstance(geometry, 0x88FF88,  0),
        makeInstance(geometry, 0x8888FF, -4),
        makeInstance(geometry, 0xFF8888,  4),
    ];
  
    function resizeRendererToDisplaySize(renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
  
    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        stats.begin();
        renderer.render(scene, camera);
        stats.end(); 

        requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);
  }
  
  main();