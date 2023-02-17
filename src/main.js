//Mindshow Grumpy Cat by Tipatat Chennavasin [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/eG1Y1s88sKq)
//Apple Green by Quaternius (https://poly.pizza/m/3VXWnjDOEw)
//Hamburger by jeremy [CC-BY] (https://creativecommons.org/licenses/by/3.0/) via Poly Pizza (https://poly.pizza/m/fNdEHvI86Hu)
//Sushi Nigiri by Quaternius (https://poly.pizza/m/ea93ie9bKj)

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

let controller;

window.THREE = THREE;


const cubeSize = 0.5;
const nbPas = 20;

let gameCubeMesh;
function loadRandomFood(x, y, z, food) {
    console.log(food);
    const loader = new GLTFLoader();
    loader.setPath('assets/models/');
    if (food == "hamburger") {
        loader.load('food/Hamburger.glb', gltfReader);
    }
    else if (food == "apple") {
        loader.load('food/Apple.glb', gltfReader);
    }
    else if (food == "sushi") {
        loader.load('food/Sushi.glb', gltfReader);
    }

    function gltfReader(gltf) {
        let testModel = null;

        testModel = gltf.scene;

        if (testModel != null) {
            console.log("Model loaded:  " + gltf.asset);
            gltf.scene.position.set(x, y, z);
            console.log(gltf.scene.position)
            gltf.scene.name = "food";
            gltf.scene.scale.set(0.05, 0.05, 0.05);
            gameCubeMesh.add(gltf.scene);
        } else {
            console.log("Load FAILED.");
        }
    }
}

function remove3DobjectByName(objName) {
    var selectedObject = scene.getObjectByName(objName);
    scene.remove(selectedObject);
    //animate();
}


const width = 840;
const height = 680;

let points;

const jeu = document.getElementById("jeu");

let score = document.getElementById("points");
let scoretxt = document.getElementById("txt");

function updatePoints() {
    score.textContent = " " + points;
    if (points >= 2) {
        scoretxt.textContent = " points";
    } else if (points == 1) {
        scoretxt.textContent = " point"
    }
    else { scoretxt.textContent = "" }
}

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 20);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
renderer.xr.enabled = true;
jeu.appendChild(renderer.domElement);

document.body.appendChild(ARButton.createButton(renderer));

const controls = new OrbitControls(camera, jeu);


//Controller
controller = renderer.xr.getController(0);
controller.addEventListener('select', onSelect);
scene.add(controller);

function onSelect() {

    createGameScene();
}



function onWindowResize() {

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

}


function createCube(x, y, z) {
    const geometry = new THREE.BoxGeometry(cubeSize / nbPas, cubeSize / nbPas, cubeSize / nbPas);
    const material = new THREE.MeshStandardMaterial({ color: 0x006400 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(x, y, z);
    gameCubeMesh.add(cube);
    return cube;
}


//Adaptation de mon code 2D en 3D, code plus simple
class Snake {
    lastPositions = [];
    direction = [0, -1 / (nbPas * 2), 0];
    blocks = [];
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.head = createCube(x, y, z);
        this.head.material = new THREE.MeshStandardMaterial({ color: 0x34C924 });
        for (let i = 1; i <= 3; i++) {
            this.blocks.push(createCube(0, -i, 0));
            this.lastPositions.push([0, -i, 0]);
        }
    }
    moveBlocks() {
        let n = this.lastPositions.length
        for (let i = 0; i < this.blocks.length; i++) {
            this.blocks[i].position.set(
                this.lastPositions[n - 1 - i][0],
                this.lastPositions[n - 1 - i][1],
                this.lastPositions[n - 1 - i][2]);
        }
    }
    move() {
        this.lastPositions.push([this.x, this.y, this.z]);
        if (this.x < -(cubeSize / 2) || this.x > cubeSize / 2) {
            //out of bounds
            this.x = -this.x;
        }
        if (this.y < -(cubeSize / 2) || this.y > cubeSize / 2) {
            //out of bounds
            this.y = -this.y;
        }
        if (this.z < -(cubeSize / 2) || this.z > cubeSize / 2) {
            //out of bounds
            this.z = -this.z;
        }
        this.x += this.direction[0];
        this.y += this.direction[1];
        this.z += this.direction[2];
        this.head.position.set(this.x, this.y, this.z);
        if (this.lastPositions.length > this.blocks.length + 2) {
            this.lastPositions.shift();
        }
        this.moveBlocks();
    }
    checkCollisionWithBlocks() {
        for (let i = 0; i < this.blocks.length; i++) {
            const block = this.blocks[i];
            if (block.position.x == this.x && block.position.y == this.y && block.position.z == this.z) {
                init();
            }

        }
    }

    update() {
        this.move();
        this.checkCollisionWithBlocks();
    }
    addBlock() {
        this.blocks.push(createCube(
            this.lastPositions[1][0],
            this.lastPositions[1][1],
            this.lastPositions[1][2]
        ));
    }
}

let snake;
const FoodNames = ["hamburger", "apple", "sushi"];

function r_int(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
function r_(min, max) {
    return Math.random() * (max - min) + min;
}
class Food {
    x = 3;
    y = 0;
    z = 0;
    constructor(x, y, z) {
        // this.food = createCube(x, y, z);
        //this.food.material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        loadRandomFood(x, y, z, Food.getRandomFoodName());
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static getRandomFood() {
        return new Food(r_(-cubeSize / 2, cubeSize / 2), r_(-cubeSize / 2, cubeSize / 2), r_(-cubeSize / 2, cubeSize / 2));
    }

    static getRandomFoodName() {
        return FoodNames[r_int(1, 4) - 1];
    }

    collision() {
        if (this.x === snake.x && this.y === snake.y && this.z === snake.z) {
            //scene.remove(this.food);
            remove3DobjectByName("food");
            food = Food.getRandomFood();
            snake.addBlock();
            points++;
        }
    }
}


let food;

function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
}

function init() {
    scene.clear();

    //camera.position.set(0, 0, 100);
    window.addEventListener('resize', onWindowResize);
    //camera.lookAt(scene.position);
    points = 0;


}

init();
let initOk = false;

function createGameScene() {
    if (initOk) {
        return;
    }
    const gameCube = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.BackSide, transparent: true, opacity: 0.1 });
    const lineMat = new THREE.LineBasicMaterial({ color: 0xff0000 });
    gameCubeMesh = new THREE.Mesh(gameCube, cubeMat);
    gameCubeMesh.position.set(0, 0, -1).applyMatrix4(controller.matrixWorld);
    gameCubeMesh.quaternion.setFromRotationMatrix(controller.matrixWorld);
    scene.add(gameCubeMesh);

    let edges = new THREE.EdgesGeometry(gameCube);
    gameCubeMesh.add(new THREE.LineSegments(edges, lineMat));

    const ambient = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambient);

    const frontLight = new THREE.DirectionalLight(0xffffff, 1);
    frontLight.position.set(0, 10, 10);
    scene.add(frontLight);

    snake = new Snake(0, 0, 0);

    food = Food.getRandomFood();

    console.log(dumpObject(scene).join('\n'));

    initOk = true;
}

function updateGame() {
    if (initOk === false) {
        return;
    }
    snake.update();
    food.collision();
    //setTimeout(update, 250);
}

const clock = new THREE.Clock();
let nbFrames = 0;

function render() {
    nbFrames++;
    const elapsed = clock.getElapsedTime();
    renderer.setAnimationLoop(render);
    //requestAnimationFrame(render);
    controls.update();
    if (nbFrames > 15) {
        updateGame();
        nbFrames = 0;
    }

    updatePoints();
    renderer.render(scene, camera);
}
render();

window.addEventListener('keydown', function (e) {
    console.log(e.key);
    switch (e.key) {
        case 'ArrowLeft':
            if (snake.direction[0] == 0) {
                snake.direction = [-1, 0, 0];
            }
            break;
        case 'ArrowRight':
            if (snake.direction[0] == 0) {
                snake.direction = [1, 0, 0];
            }
            break;
        case 'ArrowUp':
            if (snake.direction[1] == 0) {
                snake.direction = [0, 1, 0];
            }
            break;
        case 'ArrowDown':
            if (snake.direction[1] == 0) {
                snake.direction = [0, -1, 0];
            }
            break;
        case '0':
            //On remet la caméra au point de départ
            camera.position.set(0, 0, 100);
        case 'z':
            if (snake.direction[2] == 0) {
                snake.direction = [0, 0, -1];
            }
            break;
        case 's':
            if (snake.direction[2] == 0) {
                snake.direction = [0, 0, 1];
            }
            break;
        default:
            break;
    }
});