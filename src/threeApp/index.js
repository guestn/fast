// Global imports
import * as THREE from 'three';
// import TWEEN from '@tweenjs/tween.js';
import Ammo from 'ammonext';

// Config
import Config from './sceneConfig/general';

// Components
import Renderer from './components/Renderer';
import Camera from './components/Camera';
import Light from './components/Light';
import Controls from './components/Controls';
import Mesh from './components/Mesh';

// Helpers
import { promisifyLoader } from './helpers/helpers';

// Assets & Materials
import { createMaterial } from './materials/material';
import { assetsIndex } from './sceneConfig/assets';
import { materialsIndex } from './sceneConfig/materials';

// Lights
import { lightsIndex } from './sceneConfig/lights';

// Objects
import { objectsIndex } from './sceneConfig/objects';

// Managers
import Interaction from './managers/interaction';
import DatGUI from './managers/datGUI';

// Stats
import { createStats, updateStatsStart, updateStatsEnd } from './helpers/stats';

// -- End of imports

export default class Main {
  constructor(container, cb, state) {
    this.container = container;
    this.cb = cb;
    this.state = state;
    this.cb.resetObjects = this.resetObjects.bind(this);

    this.initialize();
  }

  initialize() {
    this.createPhysicsWorld();
    this.auxTrans = new Ammo.btTransform();

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(Config.fog.color, Config.fog.near);

    if (window.devicePixelRatio) {
      Config.dpr = window.devicePixelRatio;
    }

    this.renderer = new Renderer(this.scene, this.container);
    this.camera = new Camera(this.renderer.threeRenderer, this.container);
    this.controls = new Controls(this.camera.threeCamera, this.renderer, this.container);
    this.interaction = new Interaction(this.renderer, this.scene, this.camera, this.controls);
    this.clock = new THREE.Clock();
    this.light = this.createLights();

    if (Config.isDev) this.gui = new DatGUI(this);
    if (Config.showStats) this.rS = createStats();

    const texturesAndFiles = this.loadAssets();
    this.createMaterials(texturesAndFiles);
    this.appInitialized = true;
  }

  loadAssets() {
    const FilePromiseLoader = promisifyLoader(new THREE.FileLoader());
    const filesPromises = Object.values(assetsIndex.files).map((file) => (
      FilePromiseLoader.load(file.path)
    ));

    const TexturePromiseLoader = promisifyLoader(new THREE.TextureLoader());
    const texturesPromises = Object.values(assetsIndex.textures).map((texture) => (
      TexturePromiseLoader.load(texture.path)
    ));
    this.texturesAndFiles = { filesPromises, texturesPromises };

    return this.texturesAndFiles;
  }

  createLights() {
    const lights = lightsIndex.map((light) => (
      new Light(light, this.scene)
    ));
    console.log({ lights });
    return lights;
  }

  createMaterials(filesAndTextures) {
    const { filesPromises, texturesPromises } = filesAndTextures;
    Promise.all([...filesPromises, ...texturesPromises])
      .then((r) => {
        const assets = r.reduce((agg, asset, idx) => {
          const fileNames = [
            ...Object.keys(assetsIndex.files),
            ...Object.keys(assetsIndex.textures),
          ];
          return {
            ...agg,
            [fileNames[idx]]: asset,
          };
        }, {});

        const materials = materialsIndex.reduce((agg, materialParams) => ({
          ...agg,
          [materialParams.name]: createMaterial(materialParams, assets),
        }), {});

        return this.createWorld(materials);
      });
  }

  createPhysicsWorld() {
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);
    const overlappingPairCache = new Ammo.btDbvtBroadphase();
    const solver = new Ammo.btSequentialImpulseConstraintSolver();

    const physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      dispatcher, overlappingPairCache, solver, collisionConfiguration,
    );
    physicsWorld.setGravity(new Ammo.btVector3(...Config.gravity));
    physicsWorld.bodies = [];
    this.physicsWorld = physicsWorld;
  }

  createObjects = (materials) => {
    this.objects = objectsIndex.map((object) => (
      new Mesh({
        ...object,
        type: object.type,
        params: object.params,
        position: object.position,
        rotation: object.rotation,
        material: materials[object.material],
        scene: this.scene,
        physics: {
          physicsWorld: this.physicsWorld,
          mass: object.physics.mass,
          friction: object.physics.friction,
          restitution: object.physics.restitution,
          damping: object.physics.damping,
        },
        shadows: object.shadows,
      })
    ));
  }

  createWorld(materials) {
    this.createObjects(materials);
    this.addEventListeners();
    this.animate();
  }

  animate() {
    const deltaTime = this.clock.getDelta();
    const { rS } = this;

    if (Config.showStats) updateStatsStart(rS);
    this.renderer.render(this.scene, this.camera.threeCamera);
    if (Config.showStats) updateStatsEnd(rS);

    // TWEEN.update();
    this.controls.update();
    this.updatePhysics(deltaTime);
    requestAnimationFrame(this.animate.bind(this)); // Bind the main class instead of window object
  }

  updatePhysics(deltaTime) {
    // Step world
    this.physicsWorld.stepSimulation(deltaTime, 10);

    // Update rigid bodies
    for (let i = 0; i < this.physicsWorld.bodies.length; i++) {
      const objThree = this.physicsWorld.bodies[i];
      const objPhys = objThree.userData.physicsBody;
      const motionState = objPhys.getMotionState();
      if (motionState) {
        motionState.getWorldTransform(this.auxTrans);
        const p = this.auxTrans.getOrigin();
        const q = this.auxTrans.getRotation();

        objThree.position.set(p.x(), p.y(), p.z());
        objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
      }
    }
  }

  resetObjects() {
    this.objects.forEach((object) => {
      object.setInitialState();
    });

    if (this.physicsWorld) {
      for (let i = 0; i < this.physicsWorld.bodies.length; i++) {
        const objThree = this.objects[i];
        const objPhys = objThree.mesh.userData.physicsBody;
        if (objPhys && objPhys.getMotionState()) {
          const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler(...objThree.rotation, 'XYZ'));
          const transform = new Ammo.btTransform();
          transform.setIdentity();
          transform.setOrigin(new Ammo.btVector3(...objThree.position));
          transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w));

          const zeroVector = new Ammo.btVector3(0, 0, 0);
          objPhys.setLinearVelocity(zeroVector);
          objPhys.setAngularVelocity(zeroVector);
          objPhys.setWorldTransform(transform);
        }
      }
      // /reset some internal cached data in the broadphase
      // this.physicsWorld.getBroadphase().resetPool(this.physicsWorld.getDispatcher());
      // this.physicsWorld.getConstraintSolver().reset();
    }
  }

  addEventListeners() {
    this.container.addEventListener('keydown', this.keydown, false);
  }

  keydown = (e) => {
    console.log(e.keyCode);
    switch (e.keyCode) {
    case 32: // spacebar
      e.preventDefault();
      if (this.clock.running) {
        this.clock.stop();
        this.showStatus('Paused');
      } else {
        this.clock.start();
        this.showStatus('');
      }
      break;
    default:
      return null;
    }
    return null;
  }

  showStatus = (message) => {
    this.cb.setStatus(message);
  }
}