import * as THREE from 'three'; //imports all three namespace stuff
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'; //allows 3D Models to load in glTF format
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const container = document.getElementById("model-container");
const renderer = new THREE.WebGLRenderer({antialias : true, alpha: true}); //creates renderer instance
renderer.outputColorSpace = THREE.SRGBColorSpace; //defines color space, note that `THREE.SRGBColorSpace is default` 
// renderer.setSize( window.innerWidth, window.innerHeight ); //sets renderer dimensions
renderer.setClearColor(0x321017); //sets default color
renderer.setPixelRatio(window.innerWidth / window.innerHeight); //sets aspect ratio (px)

renderer.setSize(container.clientWidth, container.clientHeight);

container.appendChild(renderer.domElement);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; //adds shadows

renderer.setClearColor(0x000000, 0);

const scene = new THREE.Scene(); // creates scene instance
const camera = new THREE.PerspectiveCamera( 90, container.clientWidth / container.clientHeight, 0.1, 1000 ); //(FOV, Aspect Ratio [width / height], "near", "far")
camera.position.set(25, 25, 25);
camera.lookAt(0,0,0);
camera.updateProjectionMatrix();

const controls = new OrbitControls(camera, renderer.domElement) //arg 1: ref. to camera object, arg 2: dom element
controls.enableDamping = true; //smooth rotation
controls.enablePan = true; //allows camera to shift around
controls.minDistance = 0.01;
controls.maxDistance = 100; // min/max zoom distance
controls.minPolarAngle = 0;
controls.maxPolarAngle = 5; //how far up/down u can look
controls.autoRotate = false;
controls.target = new THREE.Vector3(0,0.1,0); //center of rotation
controls.update(); //applies changes to const controls

const groundGeometry = new THREE.PlaneGeometry(0.1, 0.1, 32, 32); //(w of plane, l of plane, w segment, height segment)
groundGeometry.rotateX(-Math.PI / 2); // defining a plane automatically makes it horizontal, .: rotate it by 90º aka π/2 rad
const groundMaterial = new THREE.MeshStandardMaterial({ //defines texture
    color: 0x321017,
    side: THREE.DoubleSide //three renders one side by defualt, need to spec. 2 sides in case of issues w shadows
})
const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial); //creates mesh based off of ground material + ground geometry
groundMesh.castShadow = true;
groundMesh.receiveShadow = true; //floor now gets shadows
scene.add(groundMesh)

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment()).texture;
scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.0));

const loader = new GLTFLoader().setPath('./forest_demo/'); //calls the gltf loader, sets path/folder to pull scene from
loader.load('scene.gltf', async (gltf) => {

  const parser = gltf.parser;

  gltf.scene.traverse(async (child) => {
    if (!child.isMesh) return;

    const mat = child.material;
    const ext =
      mat.userData?.gltfExtensions
        ?.KHR_materials_pbrSpecularGlossiness;

    let diffuseMap = null;
    let baseColor = new THREE.Color(0xffffff);

    if (ext) {
      // Resolve diffuse texture properly
      if (ext.diffuseTexture) {
        diffuseMap = await parser.getDependency(
          'texture',
          ext.diffuseTexture.index
        );
        diffuseMap.colorSpace = THREE.SRGBColorSpace;
      }

      // Resolve diffuse color
      if (ext.diffuseFactor) {
        baseColor.fromArray(ext.diffuseFactor);
      }
    }

    const newMat = new THREE.MeshStandardMaterial({
      map: diffuseMap,
      color: baseColor,
      metalness: 0.0,
      roughness: 0.9
    });

    // AO handling (optional)
    if (mat.aoMap) {
      newMat.aoMap = mat.aoMap;
      if (!child.geometry.attributes.uv2) {
        child.geometry.setAttribute(
          'uv2',
          new THREE.BufferAttribute(
            child.geometry.attributes.uv.array,
            2
          )
        );
      }
    }

    child.material = newMat;
  });

  gltf.scene.traverse((obj) => {
  if (obj.isMesh && obj.material.map) {
    obj.material.transparent = true;
    obj.material.alphaTest = 0.1;   // Minecraft-style cutoff
    obj.material.depthWrite = false;
    obj.material.needsUpdate = true;
  }
});

  window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

  scene.add(gltf.scene);
});
function onWindowResize() {
  const newWidth = window.innerWidth;
  const newHeight = window.innerHeight;

  renderer.setSize(newWidth, newHeight);
  camera.aspect = newWidth / newHeight;
  camera.updateProjectionMatrix();
}

window.addEventListener('resize', onWindowResize, false);

function animate(){ //creates function to animate scene
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera); //renders scene
}

animate(); //calls function animate 