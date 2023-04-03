// Text

import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';

// global variables
let scene, camera, renderer, orbit, stats;
let axesHelper, arrowHelper, gridHelper; 

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

// Stats
stats = new Stats();
stats.showPanel(0);  // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

// axes Helper
axesHelper = new THREE.AxesHelper(2.5);
scene.add(axesHelper);

// arrow Helper
const dir = new THREE.Vector3( 2, 1, 1 );
dir.normalize();
const origin = new THREE.Vector3( .5, .5, .5 );
arrowHelper = new THREE.ArrowHelper( dir, origin, 2, 0xf5831c);
scene.add(arrowHelper);

// grid helper
gridHelper = new THREE.GridHelper(7, 20);
gridHelper.position.set(0, -0.001, 0);
scene.add( gridHelper );

// GUI
guiSetup(); 

// Handling resize event

window.addEventListener('resize', resize, false);

requestAnimationFrame(animate);

function animate(time){
    //axesHelper.visible = guiControls.axes;
    stats.begin(); 
        renderer.render( scene, camera );
    stats.end();
    requestAnimationFrame( animate );
}

function resize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function guiSetup() {
    const guiControls = new function() {
        this.axes = true;
        this.arrow = true; 
        this.grid = true; 
        this.arrowLength = 2; 
        this.arrowHeadLength = 2 * 0.2;
        this.arrowHeadWidth = 2 * 0.2 * 0.2; 
        this.arrowColor = 0xf5831c; 
        this.helper = 'axes';
        this.resetArrow = function() {
            this.arrowLength = 2; 
            this.arrowHeadLength = 2 * 0.2;
            this.arrowHeadWidth = 2 * 0.2 * 0.2; 
            this.arrowColor = 0xf5831c; 
            arrowHelper.setLength(2, 2 * 0.2, 2 * 0.2 * 0.2); 
            arrowHelper.setColor(this.arrowColor);
        }
        this.resetView = function() {
            orbit.reset(); 
            orbit.target.set(0, 0, 0);
            orbit.update();
        }
    }
    
    const gui = new dat.GUI();
    
    const folderVis = gui.addFolder('Visibility');
    const axesVisibleControl = folderVis.add(guiControls, 'axes').onChange(function() {
        axesHelper.visible = guiControls.axes;
    });
    const arrowVisibleControl = folderVis.add(guiControls, 'arrow').onChange(function() {
        arrowHelper.visible = guiControls.arrow;
    });
    const gridVisibleControl = folderVis.add(guiControls, 'grid').onChange(function() {
        gridHelper.visible = guiControls.grid;
    });
    folderVis.add(guiControls, 'helper', [ 'axes', 'arrow', 'grid' ] ).onChange(function(value) {
        if (value == 'axes') {
            axesHelper.visible = true;
            arrowHelper.visible = gridHelper.visible = false; 
            axesVisibleControl.setValue(true);
            arrowVisibleControl.setValue(false);
            gridVisibleControl.setValue(false);
        }
        else if (value == 'arrow') {
            axesHelper.visible = false;
            arrowHelper.visible = true;
            gridHelper.visible = false; 
            axesVisibleControl.setValue(false);
            arrowVisibleControl.setValue(true);
            gridVisibleControl.setValue(false);
        }
        else if (value == 'grid') {
            axesHelper.visible = false;
            arrowHelper.visible = false;
            gridHelper.visible = true; 
            axesVisibleControl.setValue(false);
            arrowVisibleControl.setValue(false);
            gridVisibleControl.setValue(true);
        }
    });
    folderVis.open(); 
    
    const folderArrow = gui.addFolder('arrowHelper');
    const arrowLengthControl = folderArrow.add(guiControls, 'arrowLength', 1.0, 5.0);
    arrowLengthControl.step(0.1).name('length').onChange(function() {
        arrowHelper.setLength(guiControls.arrowLength, guiControls.arrowHeadLength, guiControls.arrowHeadWidth);
    }); 
    const arrowHeadLengthControl = folderArrow.add(guiControls, 'arrowHeadLength', 0.1, 2.0);
    arrowHeadLengthControl.step(0.1).name('head length').onChange(function() {
        arrowHelper.setLength(guiControls.arrowLength, guiControls.arrowHeadLength, guiControls.arrowHeadWidth);
    }); 
    const arrowHeadWidthControl = folderArrow.add(guiControls, 'arrowHeadWidth', 0.01, 1.0);
    arrowHeadWidthControl.step(0.01).name('head width').onChange(function() {
        arrowHelper.setLength(guiControls.arrowLength, guiControls.arrowHeadLength, guiControls.arrowHeadWidth);
    }); 
    const arrowColorControl = folderArrow.addColor(guiControls, 'arrowColor').onChange(function() {
        arrowHelper.setColor(guiControls.arrowColor);
    });
    folderArrow.add(guiControls, 'resetArrow').name('reset arrow').onChange(function() {
        arrowLengthControl.setValue(2);
        arrowHeadLengthControl.setValue(2 * 0.2);
        arrowHeadWidthControl.setValue(2 * 0.2 * 0.2);
        arrowColorControl.setValue(0xf5831c);
    });
    
    folderArrow.open(); 
    
    gui.add(guiControls, 'resetView').name('reset view');
}


