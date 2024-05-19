import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';





function scale(number, inMin, inMax, outMin, outMax) {
    return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}


//////////////////////
/* CONSTANT DIMENSIONS */
//////////////////////
const SCALE = 1;

const INNER_CILINDER_RADIUS = 1 * SCALE;
const INNER_CILINDER_HEIGHT = 5 * SCALE;

const TOP_RING_RADIUS = INNER_CILINDER_RADIUS + INNER_CILINDER_RADIUS;
const TOP_RING_HEIGHT = INNER_CILINDER_HEIGHT / 4;
const TOP_RING_HOLE_RADIUS = INNER_CILINDER_RADIUS;


const MIDDLE_RING_HEIGHT = INNER_CILINDER_HEIGHT / 4;
const MIDDLE_RING_HOLE_RADIUS = TOP_RING_RADIUS;
const MIDDLE_RING_RADIUS = TOP_RING_RADIUS + INNER_CILINDER_RADIUS;


const BASE_RING_RADIUS = MIDDLE_RING_RADIUS + INNER_CILINDER_RADIUS;
const BASE_RING_HEIGHT = INNER_CILINDER_HEIGHT / 4;
const BASE_RING_HOLE_RADIUS = MIDDLE_RING_RADIUS;





//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer, controls, freeCamera;


var baseRing, middleRing, topRing;



var material;

//objects to be manipulated

var moveBase = false;
var moveMiddle = false;
var moveTop = false;

//activated while key is pressed



var wireframeFlag = true;

var pickedObject = false;

//materials

var materials = []

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene() {
    'use strict';
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x6eddff);

    material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: wireframeFlag });
    materials.push(material);

    createCarrossel(10, 0, 10);
    createSkydome();
    scene.add(new THREE.AxesHelper(10));
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

//free view
function createFreeCamera() {
    'use strict';
    freeCamera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );
    freeCamera.position.x = 50;
    freeCamera.position.y = 40;
    freeCamera.position.z = 50;
    freeCamera.lookAt(scene.position);
}




/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
var ambientLight = new THREE.AmbientLight(0xffffff); // soft white light

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createCarrossel(x, y, z) {
    'use strict';
    var carrossel = new THREE.Object3D();
    carrossel.position.set(x, y, z);
    createInnerCilinder(carrossel);
    addCarrosselBaseLevel(carrossel);
    addCarrosselMiddleLevel(carrossel);
    addCarrosselTopLevel(carrossel);
    scene.add(carrossel);

}

function createInnerCilinder(obj) {
    'use strict';
    var geometry = new THREE.CylinderGeometry(INNER_CILINDER_RADIUS, INNER_CILINDER_RADIUS, INNER_CILINDER_HEIGHT, 20);

    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    var cylinder = new THREE.Mesh(geometry, material);

    cylinder.position.set(0, INNER_CILINDER_HEIGHT / 2, 0);

    obj.add(cylinder);

}

function addCarrosselBaseLevel(obj) {
    'use strict';

    // Create a path for the shape of the cylinder
    var shape = new THREE.Shape();
    var radius = BASE_RING_RADIUS; // Radius of the cylinder
    var height = BASE_RING_HEIGHT; // Height of the cylinder
    var holeRadius = BASE_RING_HOLE_RADIUS; // Radius of the hole

    // Outer circle
    shape.moveTo(radius, 0);
    for (var i = 0; i <= 360; i += 5) {
        var angle = (i * Math.PI) / 180;
        var x = radius * Math.cos(angle);
        var y = radius * Math.sin(angle);
        shape.lineTo(x, y);
    }

    // Inner circle (hole)
    var hole = new THREE.Path();
    hole.moveTo(holeRadius, 0);
    for (var i = 0; i <= 360; i += 5) {
        var angle = (i * Math.PI) / 180;
        var x = holeRadius * Math.cos(angle);
        var y = holeRadius * Math.sin(angle);
        hole.lineTo(x, y);
    }
    shape.holes.push(hole);

    // Extrude the shape to create the cylinder
    var extrudeSettings = {
        steps: 1,
        depth: -height,
        bevelEnabled: false
    };

    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Rotate the geometry to change the cylinder axis to y
    geometry.rotateX(Math.PI / 2);
    // Create a material
    var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    // Create a mesh and add it to the scene

    baseRing = new THREE.Mesh(geometry, material);
    baseRing.position.set(0, 0, 0);
    obj.add(baseRing);

    baseRing.update = function () {
        baseRing.position.y += 0.1;
    }

    baseRing.fall = function () {
        if (baseRing.position.y > 0)
            baseRing.position.y -= 0.05;
    }

}

function addCarrosselMiddleLevel(obj) {
    'use strict';
    // Create a path for the shape of the cylinder
    var shape = new THREE.Shape();
    var radius = MIDDLE_RING_RADIUS; // Radius of the cylinder
    var height = MIDDLE_RING_HEIGHT; // Height of the cylinder
    var holeRadius = MIDDLE_RING_HOLE_RADIUS; // Radius of the hole

    // Outer circle
    shape.moveTo(radius, 0);
    for (var i = 0; i <= 360; i += 5) {
        var angle = (i * Math.PI) / 180;
        var x = radius * Math.cos(angle);
        var y = radius * Math.sin(angle);
        shape.lineTo(x, y);
    }

    // Inner circle (hole)
    var hole = new THREE.Path();
    hole.moveTo(holeRadius, 0);
    for (var i = 0; i <= 360; i += 5) {
        var angle = (i * Math.PI) / 180;
        var x = holeRadius * Math.cos(angle);
        var y = holeRadius * Math.sin(angle);
        hole.lineTo(x, y);
    }
    shape.holes.push(hole);

    // Extrude the shape to create the cylinder
    var extrudeSettings = {
        steps: 1,
        depth: -height,
        bevelEnabled: false
    };

    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Rotate the geometry to change the cylinder axis to y
    geometry.rotateX(Math.PI / 2);
    // Create a material
    var material = new THREE.MeshBasicMaterial({ color: 0x00006f });
    // Create a mesh and add it to the scene

    middleRing = new THREE.Mesh(geometry, material);

    middleRing.position.set(0, MIDDLE_RING_HEIGHT, 0);
    obj.add(middleRing);

    middleRing.update = function () {
        middleRing.position.y += 0.1;
    }

    middleRing.fall = function () {
        if (middleRing.position.y > 0)
            middleRing.position.y -= 0.05;
    }
}

function addCarrosselTopLevel(obj) {
    'use strict';
    // Create a path for the shape of the cylinder
    var shape = new THREE.Shape();
    var radius = TOP_RING_RADIUS; // Radius of the cylinder
    var height = TOP_RING_HEIGHT; // Height of the cylinder
    var holeRadius = TOP_RING_HOLE_RADIUS; // Radius of the hole

    // Outer circle
    shape.moveTo(radius, 0);
    for (var i = 0; i <= 360; i += 5) {
        var angle = (i * Math.PI) / 180;
        var x = radius * Math.cos(angle);
        var y = radius * Math.sin(angle);
        shape.lineTo(x, y);
    }

    // Inner circle (hole)
    var hole = new THREE.Path();
    hole.moveTo(holeRadius, 0);

    for (var i = 0; i <= 360; i += 5) {
        var angle = (i * Math.PI) / 180;
        var x = holeRadius * Math.cos(angle);
        var y = holeRadius * Math.sin(angle);
        hole.lineTo(x, y);
    }
    shape.holes.push(hole);

    // Extrude the shape to create the cylinder
    var extrudeSettings = {
        steps: 1,
        depth: -height,
        bevelEnabled: false
    };

    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Rotate the geometry to change the cylinder axis to y
    geometry.rotateX(Math.PI / 2);
    // Create a material
    var material = new THREE.MeshBasicMaterial({ color: 0x00003f });
    // Create a mesh and add it to the scene
    topRing = new THREE.Mesh(geometry, material);
    topRing.position.set(0, BASE_RING_HEIGHT + MIDDLE_RING_HEIGHT, 0);

    topRing.update = function () {
        topRing.position.y += 0.1;
    }

    topRing.fall = function () {
        if (topRing.position.y > 0)
            topRing.position.y -= 0.05;
    }

    obj.add(topRing);

}

////////////////////////
/* SKYDOME */
////////////////////////

function createSkydome() {
    'use strict';
    var geometry = new THREE.SphereGeometry(100, 60, 40);
    const texture = new THREE.TextureLoader().load('images/Sky.jpg');

    var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
}

//////////////////////
/* CHANGE WIREFRAME */
//////////////////////

function changeWireframe() {
    for (var i = 0; i < materials.length; i++) {
        materials[i].wireframe = wireframeFlag;
    }

}


//////////////////////
/* CHECK COLLISIONS */
//////////////////////

/* function checkCollisions() {
    'use strict';
    var boundingBox = new THREE.Box3().setFromObject();
    let boxSize = new THREE.Vector3();
    var center = boundingBox.getCenter(boxSize);
    //console.log(center);
    for (var i = 0; i < objects.length; i++) {
        //console.log(objects[i].position);
        if (center.distanceToSquared(objects[i].position) < (claw.colision_radius + OBJECTS_COLL_RADIUS) ** 2) {
            inAnimation = true;
            setBoolsFalse();
            objects[i].position.set(0, -CLAW_HEIGHT - 0.3, 0);
            claw.add(objects[i]);
            objectInClaw = objects[i];
            return;
        }
    }
}
 */

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////


////////////
/* UPDATE */
////////////

function update() {
    'use strict';
    if (moveBase) {
        baseRing.update();
    } else {
        baseRing.fall();
    }
    if (moveMiddle) {
        middleRing.update();
    } else {
        middleRing.fall();
    }
    if (moveTop) {
        topRing.update();
    } else {
        topRing.fall();
    }
    //checkCollisions();
    changeWireframe();
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////

function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    createScene();
    createFreeCamera();

    camera = freeCamera;

    controls = new OrbitControls(freeCamera, renderer.domElement); // Initialize controls globally
    freeCamera.position.set(30, 35, 50);
    controls.update(); // Call update after camera position is set
    render();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
    document.getElementById('key-7').classList.add('pressed');
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
let lastTime = 0;
let frameCount = 0;
let lastFrameTime = performance.now();
let fps = 0;

function animate(currentTime) {
    'use strict';
    const deltaTime = currentTime - lastTime;
    if (deltaTime < 1000 / 60) { // 60 fps
        requestAnimationFrame(animate);
        return;
    }
    lastTime = currentTime;
    update();
    render();
    requestAnimationFrame(animate);

    // Calculate FPS
    frameCount++;
    const now = performance.now();
    const duration = now - lastFrameTime;
    if (duration >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFrameTime = now;
        console.log('FPS:', fps);
    }
}
requestAnimationFrame(animate);

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
}


///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////

function onKeyDown(e) {


    switch (e.keyCode) {

        // key 1
        case 49:
            moveBase = true;
            break;
        //key 2
        case 50:
            moveMiddle = true;
            break;
        //key 3
        case 51:
            moveTop = true;
            break;

        case 87: //W
        case 119: //w
            break;
        case 83: //S
        case 115: //s
            break;
        case 81: //Q    
        case 113: //q
            break;
        case 65: //A
        case 97: //a
            break;

        case 69: //E
        case 101: //e

            break;
        case 68: //D
        case 100: //d
            break;
        case 82: //R
        case 114: //r

            break;
        case 70: //F
        case 102: //f
            break;
        case 55: //7

    }

}




///////////////////////
/* KEY UP CALLBACK */
///////////////////////

function onKeyUp(e) {
    'use strict';
    switch (e.keyCode) {

        // key 1
        case 49:
            moveBase = false;
            break;
        //key 2
        case 50:
            moveMiddle = false;
            break;
        //key 3
        case 51:
            moveTop = false;
            break;

        case 87: //W
        case 119: //w
            break;
        case 83: //S
        case 115: //s
            break;
        case 81: //Q
        case 113: //q
            break;
        case 69: //E
        case 101: //e

            break;
        case 65: //A
        case 97: //a


            break;
        case 68: //D
        case 100: //d

            break;
        case 82: //R
        case 114: //r
            break;
        case 70: //F
        case 102: //f
            break;
    }
}


init();
animate();

