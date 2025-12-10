import * as THREE from 'three'; //imports all three namespace stuff
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; //allows 3D Models to load in glTF format
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({antialias : true}); //creates renderer instance
renderer.outputColorSpace = THREE.SRGBColorSpace; //defines color space, note that `THREE.SRGBColorSpace is default` 
renderer.setSize( window.innerWidth, window.innerHeight ); //sets renderer dimensions
renderer.setClearColor(0x000000); //sets default color
renderer.setPixelRatio(window.devicePixelRatio); //sets aspect ratio
document.body.appendChild(renderer.domElement); //adds to html file

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //adds shadows

const scene = new THREE.Scene(); // creates scene instance
const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 ); //(FOV, Aspect Ratio [width / height], "near", "far")
camera.position.set(1, 5, 5);
// REFER TO LINE 26 - 
camera.lookAt(0,0,0);

const controls = new OrbitControls(camera, renderer.domElement) //arg 1: ref. to camera object, arg 2: dom element
controls.enableDamping = true; //smooth rotation
controls.enablePan = true; //always stays centered
controls.minDistance = 0.01;
controls.maxDistance = 10; // min/max zoom distance
controls.minPolarAngle = 0;
controls.maxPolarAngle = 5; //how far up/down u can look
controls.autoRotate = true;
controls.autoRotateSpeed = 2; // 1 revolution / 2min
controls.target = new THREE.Vector3(0,0.1,0); //center of rotation - replaces line 15
controls.update(); //applies changes to const controls

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32); //(w of plane, l of plane, w segment, height segment)
groundGeometry.rotateX(-Math.PI / 2); // defining a plane automatically makes it horizontal, .: rotate it by 90º aka π/2 rad
const groundMaterial = new THREE.MeshStandardMaterial({ //defines texture
    color: 0x676767,
    side: THREE.DoubleSide //three renders one side by defualt, need to spec. 2 sides in case of issues w shadows
})
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial); //creates mesh based off of ground material + ground geometry
groundMesh.castShadow = false;
groundMesh.receiveShadow = true; //floor now gets shadows
scene.add(groundMesh)

const spotLight = new THREE.SpotLight(0xf2e2bd, 3, 100, 0.15, 1.5); //color, intensity, distance, edges
spotLight.position.set(0,10,0); //sets distance
spotLight.castShadow = true; //casts shadow
scene.add(spotLight); 

const loader = new GLTFLoader().setPath('assets/3DModelAssets/fender_jaguar_guitar/'); //calls the gltf loader w/ path to load the model
loader.load('scene.gltf', (gltf) => { // arg 1: name of gltf file, arg 2: callback fcn, called when model is done laoding
    const mesh = gltf.scene; //extracts mesh, assigns to var

    mesh.traverse((child) => { //all assc. meshes cast & receive shadows now
        if(child.isMesh){
            child.castShadow = true;
            child.receiveShadow =  true;
        }
    });

    mesh.position.set(0,1,0); //positions mesh
    mesh.scale.set(2,2,2); //size
    scene.add(mesh);
})
function animate(){ //creates function to animate scene
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera); //renders scene
}

animate(); //calls function animate 

// # cramming ts at 11:37 pm with a yt tutorial and determination 