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



//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer, controls, freeCamera;




var material;

//objects to be manipulated



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
    scene.add(carrossel);

}

function createInnerCilinder(obj) {
    'use strict';
    var geometry = new THREE.CylinderGeometry(1, 1, 2, 32);

    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    var cylinder = new THREE.Mesh(geometry, material);


    obj.add(cylinder);

}

function addCarrosselBaseLevel(obj) {
    'use strict';

    var extrudeSettings = {
        amount: 2,
        steps: 1,
        bevelEnabled: false,
        curveSegments: 8
    };





}

function addCarrosselMiddleLevel() {
    'use strict';
}

function addCarrosselTopLevel() {
    'use strict';
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


    if (!inAnimation) {
        switch (e.keyCode) {
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
}




///////////////////////
/* KEY UP CALLBACK */
///////////////////////

function onKeyUp(e) {
    'use strict';
    switch (e.keyCode) {
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
