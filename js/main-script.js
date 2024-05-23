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

const baseRadius = 1 * SCALE;
const baseHeight = 5 * SCALE;

const innerCarrocelRadius = baseRadius + baseRadius;
const TOP_RING_HEIGHT = baseHeight / 4;
const TOP_RING_HOLE_RADIUS = baseRadius;


const MIDDLE_RING_HOLE_RADIUS = innerCarrocelRadius;
const middleCarrocelRadius = innerCarrocelRadius + baseRadius;


const outerCarrocelRadius = middleCarrocelRadius + baseRadius;

const BASE_RING_HOLE_RADIUS = middleCarrocelRadius;




const curveSegments = 32;

const carrocelHeight = baseHeight / 4;


const limitHeightUp = baseHeight / 2;
const limitHeightDown = 0.2;



//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer, controls, freeCamera;

const obj_names = ['dodecahedron', 'icosahedron', 'torus', 'torusKnot', 'cube', 'hyperboloid', 'cylinder', 'cone'];




var material;

//objects to be manipulated

var innerRing, middleRing, outerRing;

var objects = [];


//activated while key is pressed

var moveInner = false;
var moveMiddle = false;
var moveOuter = false;


var wireframeFlag = true;

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
    carrossel.position.set(x, y + baseHeight / 2, z);
    createInnerRing(carrossel);
    addCarrosselBaseLevel(carrossel);
    addCarrosselMiddleLevel(carrossel);
    addCarrosselTopLevel(carrossel);
    scene.add(carrossel);

}

function addCarrosselBaseLevel(obj) {
    'use strict';

    var geometry = new THREE.CylinderGeometry(baseRadius, baseRadius, baseHeight, curveSegments);

    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    var cylinder = new THREE.Mesh(geometry, material);

    obj.add(cylinder);


}

function createInnerRing(obj) {
    'use strict';

    innerRing = new THREE.Object3D();

    innerRing.dir = 'U';

    var shape = new THREE.Shape();
    var arcStartAngle = 0; // Start angle of the arc
    var arcEndAngle = Math.PI * 2; // End angle of the arc

    shape.moveTo(baseRadius, 0);
    shape.absarc(0, 0, baseRadius, arcStartAngle, arcEndAngle, false);
    shape.lineTo(innerCarrocelRadius, 0);
    shape.absarc(0, 0, innerCarrocelRadius, arcEndAngle, arcStartAngle, true);
    shape.lineTo(baseRadius, 0);

    // Define extrude settings
    var extrudeSettings = {
        steps: 100, // Number of steps for extrusion
        depth: carrocelHeight, // Depth of extrusion
        bevelEnabled: false, // Disable bevel
        bevelThickness: 0, // Bevel thickness
        bevelSize: 0, // Bevel size
        bevelSegments: 0 // Number of bevel segments
    };
    // Create a geometry by extruding the ring shape
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Create a material
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    // Create a mesh using the geometry and material
    var mesh = new THREE.Mesh(geometry, material);

    mesh.rotateX(Math.PI / 2);
    mesh.position.set(0, -carrocelHeight / 2, 0);

    //random sorting obj_names and then creating items each pi/4 radians
    obj_names.sort(() => Math.random() - 0.5);
    for (let i = 0; i < obj_names.length; i++) {
        let x = Math.cos((Math.PI / 4) * i) * (baseRadius + ((innerCarrocelRadius - baseRadius) / 2));
        let z = Math.sin((Math.PI / 4) * i) * (baseRadius + ((innerCarrocelRadius - baseRadius) / 2));
        switch (obj_names[i]) {
            case 'dodecahedron':
                createDodecahedron(x, z, .3, innerRing);
                break;
            case 'icosahedron':
                createIcosahedron(x, z, .4, innerRing);
                break;
            case 'torus':
                createTorus(x, z, 0.2, 0.2, innerRing);
                break;
            case 'torusKnot':
                createTorusKnot(x, z, .1, 0.1, 100, 16, 2, 3, innerRing);
                break;
            case 'cube':
                createCube(x, z, innerRing);
                break;
            case 'hyperboloid':
                createHyperboloidOneSheet(innerRing, .1, .1, .1, 32, 32, x, z);
                break;
            case 'cylinder':
                createCylinder(.2, .2, .2, x, z, innerRing);
                break;
            case 'cone':
                createCone(innerRing, .5, .5, x, z);
                break;
            default:
                break;
        }
    }

    innerRing.add(mesh);
    obj.add(innerRing);

}

function addCarrosselMiddleLevel(obj) {
    'use strict';

    middleRing = new THREE.Object3D();

    middleRing.dir = 'U';

    var shape = new THREE.Shape();
    var arcStartAngle = 0; // Start angle of the arc
    var arcEndAngle = Math.PI * 2; // End angle of the arc

    shape.moveTo(innerCarrocelRadius, 0);
    shape.absarc(0, 0, innerCarrocelRadius, arcStartAngle, arcEndAngle, false);
    shape.lineTo(middleCarrocelRadius, 0);
    shape.absarc(0, 0, middleCarrocelRadius, arcEndAngle, arcStartAngle, true);
    shape.lineTo(innerCarrocelRadius, 0);

    // Define extrude settings
    var extrudeSettings = {
        steps: 100, // Number of steps for extrusion
        depth: carrocelHeight, // Depth of extrusion
        bevelEnabled: false, // Disable bevel
        bevelThickness: 0, // Bevel thickness
        bevelSize: 0, // Bevel size
        bevelSegments: 0 // Number of bevel segments
    };
    // Create a geometry by extruding the ring shape
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Create a material
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Create a mesh using the geometry and material
    var mesh = new THREE.Mesh(geometry, material);

    mesh.rotateX(Math.PI / 2);
    mesh.position.set(0, -carrocelHeight / 2, 0);

    middleRing.add(mesh);

    obj_names.sort(() => Math.random() - 0.5);
    for (let i = 0; i < obj_names.length; i++) {
        let x = Math.cos((Math.PI / 4) * i) * (innerCarrocelRadius + ((middleCarrocelRadius - innerCarrocelRadius) / 2));
        let z = Math.sin((Math.PI / 4) * i) * (innerCarrocelRadius + ((middleCarrocelRadius - innerCarrocelRadius) / 2));
        switch (obj_names[i]) {
            case 'dodecahedron':
                createDodecahedron(x, z, .3, middleRing);
                break;
            case 'icosahedron':
                createIcosahedron(x, z, .4, middleRing);
                break;
            case 'torus':
                createTorus(x, z, 0.2, 0.2, middleRing);
                break;
            case 'torusKnot':
                createTorusKnot(x, z, .1, 0.1, 100, 16, 2, 3, middleRing);
                break;
            case 'cube':
                createCube(x, z, middleRing);
                break;
            case 'hyperboloid':
                createHyperboloidOneSheet(middleRing, .1, .1, .1, 32, 32, x, z);
                break;
            case 'cylinder':
                createCylinder(.2, .2, .2, x, z, middleRing);
                break;
            case 'cone':
                createCone(middleRing, .5, .5, x, z);
                break;
            default:
                break;
        }
    }

    obj.add(middleRing);
}

function addCarrosselTopLevel(obj) {
    'use strict';

    outerRing = new THREE.Object3D();

    outerRing.dir = 'U';

    var shape = new THREE.Shape();
    var arcStartAngle = 0; // Start angle of the arc
    var arcEndAngle = Math.PI * 2; // End angle of the arc

    shape.moveTo(middleCarrocelRadius, 0);
    shape.absarc(0, 0, middleCarrocelRadius, arcStartAngle, arcEndAngle, false);
    shape.lineTo(outerCarrocelRadius, 0);
    shape.absarc(0, 0, outerCarrocelRadius, arcEndAngle, arcStartAngle, true);
    shape.lineTo(middleCarrocelRadius, 0);

    // Define extrude settings
    var extrudeSettings = {
        steps: 100, // Number of steps for extrusion
        depth: carrocelHeight, // Depth of extrusion
        bevelEnabled: false, // Disable bevel
        bevelThickness: 0, // Bevel thickness
        bevelSize: 0, // Bevel size
        bevelSegments: 0 // Number of bevel segments
    };
    // Create a geometry by extruding the ring shape
    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    // Create a material
    var material = new THREE.MeshBasicMaterial({ color: 0x0000ff });

    // Create a mesh using the geometry and material
    var mesh = new THREE.Mesh(geometry, material);

    mesh.rotateX(Math.PI / 2);
    mesh.position.set(0, -carrocelHeight / 2, 0);

    outerRing.add(mesh);

    obj_names.sort(() => Math.random() - 0.5);
    for (let i = 0; i < obj_names.length; i++) {
        let x = Math.cos((Math.PI / 4) * i) * (middleCarrocelRadius + ((outerCarrocelRadius - middleCarrocelRadius) / 2));
        let z = Math.sin((Math.PI / 4) * i) * (middleCarrocelRadius + ((outerCarrocelRadius - middleCarrocelRadius) / 2));
        switch (obj_names[i]) {
            case 'dodecahedron':
                createDodecahedron(x, z, .3, outerRing);
                break;
            case 'icosahedron':
                createIcosahedron(x, z, .4, outerRing);
                break;
            case 'torus':
                createTorus(x, z, 0.2, 0.2, outerRing);
                break;
            case 'torusKnot':
                createTorusKnot(x, z, .1, 0.1, 100, 16, 2, 3, outerRing);
                break;
            case 'cube':
                createCube(x, z, outerRing);
                break;
            case 'hyperboloid':
                createHyperboloidOneSheet(outerRing, .1, .1, .1, 32, 32, x, z);
                break;
            case 'cylinder':
                createCylinder(.2, .2, .2, x, z, outerRing);
                break;
            case 'cone':
                createCone(outerRing, .5, .5, x, z);
                break;
            default:
                break;
        }
    }

    obj.add(outerRing);
}



function createDodecahedron(x, z, radius, obj) {
    const geometry = new THREE.DodecahedronGeometry(radius);
    const material = new THREE.MeshBasicMaterial({ color: 0x0 });
    const dodecahedron = new THREE.Mesh(geometry, material);
    dodecahedron.position.set(x, (-carrocelHeight / 2) + radius, z);
    obj.add(dodecahedron);
    objects.push(dodecahedron);

    dodecahedron.angVel = undefined;
    dodecahedron.rotate = function () {
        if (dodecahedron.angVel == undefined) {
            dodecahedron.angVel = Math.random() * 0.1;
        }
        dodecahedron.rotateY(dodecahedron.angVel);
    }
}

function createIcosahedron(x, z, radius, obj) {
    const geometry = new THREE.IcosahedronGeometry(radius);
    const material = new THREE.MeshBasicMaterial({ color: 0x000 });
    const icosahedron = new THREE.Mesh(geometry, material);
    icosahedron.position.set(x, -carrocelHeight / 2 + radius, z);
    obj.add(icosahedron);
    objects.push(icosahedron);

    icosahedron.angVel = undefined;
    icosahedron.rotate = function () {
        if (icosahedron.angVel == undefined) {
            icosahedron.angVel = Math.random() * 0.1;
        }
        icosahedron.rotateY(icosahedron.angVel);
    }
}

function createTorus(x, z, radius, tubeRadius, obj) {
    const geometry = new THREE.TorusGeometry(radius, tubeRadius);
    const material = new THREE.MeshBasicMaterial({ color: 0x00 });
    const torus = new THREE.Mesh(geometry, material);
    torus.position.set(x, -carrocelHeight / 2 + radius, z);
    obj.add(torus);
    objects.push(torus);

    torus.angVel = undefined;
    torus.rotate = function () {
        if (torus.angVel == undefined) {
            torus.angVel = Math.random() * 0.1;
        }
        torus.rotateY(torus.angVel);
    }
}

function createTorusKnot(x, z, radius, tubeRadius, tubularSegments, radialSegments, p, q, obj) {
    const geometry = new THREE.TorusKnotGeometry(radius, tubeRadius, tubularSegments, radialSegments, p, q);
    const material = new THREE.MeshBasicMaterial({ color: 0x0 });
    const torusKnot = new THREE.Mesh(geometry, material);
    torusKnot.position.set(x, -carrocelHeight / 2 + radius, z);
    obj.add(torusKnot);
    objects.push(torusKnot);

    torusKnot.angVel = undefined;
    torusKnot.rotate = function () {
        if (torusKnot.angVel == undefined) {
            torusKnot.angVel = Math.random() * 0.1;
        }
        torusKnot.rotateY(torusKnot.angVel);
    }
}

function createCube(x, z, obj) {
    'use strict';

    var geometry = new THREE.BoxGeometry(.4, .4, .4);

    var material = new THREE.MeshBasicMaterial({ color: 0x0000 });
    var cube = new THREE.Mesh(geometry, material);


    cube.position.set(x, -carrocelHeight / 2 + 0.2, z);

    obj.add(cube);
    objects.push(cube);

    cube.angVel = undefined;
    cube.rotate = function () {
        if (cube.angVel == undefined) {
            cube.angVel = Math.random() * 0.1;
        }
        cube.rotateY(cube.angVel);
    }
}

function createHyperboloidOneSheet(obj, a, b, c, segments, heightSegments, posx, posz) {
    var geometry = new THREE.BufferGeometry();
    var vertices = [];
    var indices = [];
    for (var i = 0; i <= segments; i++) {
        var u = i / segments * Math.PI * 2;
        for (var j = 0; j <= heightSegments; j++) {
            var v = (j / heightSegments - 0.5) * Math.PI;
            var x = a * Math.cosh(v) * Math.cos(u);
            var y = b * Math.cosh(v) * Math.sin(u);
            var z = c * Math.sinh(v);
            vertices.push(x, y, z);
        }
    }
    for (var i = 0; i < segments; i++) {
        for (var j = 0; j < heightSegments; j++) {
            var index1 = i * (heightSegments + 1) + j;
            var index2 = (i + 1) * (heightSegments + 1) + j;
            var index3 = (i + 1) * (heightSegments + 1) + (j + 1);
            var index4 = i * (heightSegments + 1) + (j + 1);
            indices.push(index1, index2, index3);
            indices.push(index1, index3, index4);
        }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    var material = new THREE.MeshBasicMaterial({ color: 0x0000, wireframe: false });
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(posx, -carrocelHeight / 2 + a + b, posz);

    mesh.angVel = undefined;
    mesh.rotate = function () {
        if (mesh.angVel == undefined) {
            mesh.angVel = Math.random() * 0.1;
        }
        mesh.rotateY(mesh.angVel);
    }

    obj.add(mesh);
    objects.push(mesh);
}

function createCylinder(radiusTop, radiusBottom, height, posx, posz, obj) {
    var geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0x000 });
    var cylinder = new THREE.Mesh(geometry, material);
    cylinder.position.set(posx, -carrocelHeight / 2 + height / 2, posz);

    cylinder.angVel = undefined;
    cylinder.rotate = function () {
        if (cylinder.angVel == undefined) {
            cylinder.angVel = Math.random() * 0.1;
        }
        cylinder.rotateY(cylinder.angVel);
    }

    obj.add(cylinder);
}

function createCone(obj, radius, height, posx, posz) {
    var geometry = new THREE.ConeGeometry(radius, height, 32, 32);
    var material = new THREE.MeshBasicMaterial({ color: 0x00 });
    var cone = new THREE.Mesh(geometry, material);

    cone.angVel = undefined;
    cone.rotate = function () {
        if (cone.angVel == undefined) {
            cone.angVel = Math.random() * 0.1;
        }
        cone.rotateY(cone.angVel);
    }

    cone.position.set(posx, -carrocelHeight / 2 + height / 2, posz);
    obj.add(cone);
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


///////////////////////
/* HANDLE COLLISIONS */
///////////////////////


////////////
/* UPDATE */
////////////

function update() {
    'use strict';

    for (let i = 0; i < objects.length; i++) {
        objects[i].rotate();
    }
    console.log(innerRing.position.y);
    if (moveInner) {
        if (innerRing.dir == 'U' && innerRing.position.y > limitHeightUp) {
            innerRing.dir = 'D';
        }
        if (innerRing.dir == 'D' && innerRing.position.y < limitHeightDown) {
            innerRing.dir = 'U';
        }
        if (innerRing.dir == 'U') {
            innerRing.position.y += 0.1;
        }
        else {
            innerRing.position.y -= 0.1;
        }
    }
    if (moveMiddle) {
        if (middleRing.dir == 'U' && middleRing.position.y > limitHeightUp) {
            middleRing.dir = 'D';
        }
        if (middleRing.dir == 'D' && middleRing.position.y < limitHeightDown) {
            middleRing.dir = 'U';
        }
        if (middleRing.dir == 'U') {
            middleRing.position.y += 0.1;
        }
        else {
            middleRing.position.y -= 0.1;
        }
    }
    if (moveOuter) {
        if (outerRing.dir == 'U' && outerRing.position.y > limitHeightUp) {
            outerRing.dir = 'D';
        }
        if (outerRing.dir == 'D' && outerRing.position.y < limitHeightDown) {
            outerRing.dir = 'U';
        }
        if (outerRing.dir == 'U') {
            outerRing.position.y += 0.1;
        }
        else {
            outerRing.position.y -= 0.1;
        }
    }
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
    // window.addEventListener("resize", onResize);
    // document.getElementById('key-7').classList.add('pressed');
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
        case 49: //1
            moveInner = true;
            break;
        case 50:
            moveMiddle = true;
            break;
        case 51:
            moveOuter = true;
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
        case 49:
            moveInner = false;
            break;
        case 50:
            moveMiddle = false;
            break;
        case 51:
            moveOuter = false;
            break;
        case 87: //W
        case 119: //w
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
