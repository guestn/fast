import * as THREE from 'three';
import { createInstancedMesh } from '../../helpers/InstancedBufferGeometry';
import { InstancesStandardMaterial, InstancesDepthMaterial } from '../materials/InstancesStandardMaterials';
import { computeFrenetFrames } from '../../helpers/curveHelpers';

const fences1 = (trackParams) => {
  const shape = new THREE.Shape([
    new THREE.Vector2(-0.5, -(trackParams.trackHalfWidth + trackParams.vergeWidth + 0.2)),
    new THREE.Vector2(-3, -(trackParams.trackHalfWidth + trackParams.vergeWidth + 0.2)),
    new THREE.Vector2(-3.5, -(trackParams.trackHalfWidth + trackParams.vergeWidth - 0.3)),
  ]);
  return shape;
};

const fences2 = (trackParams) => {
  const shape = new THREE.Shape([
    new THREE.Vector2(-0.5, (trackParams.trackHalfWidth + trackParams.vergeWidth + 0.2)),
    new THREE.Vector2(-3, (trackParams.trackHalfWidth + trackParams.vergeWidth + 0.2)),
    new THREE.Vector2(-3.5, (trackParams.trackHalfWidth + trackParams.vergeWidth - 0.3)),
  ]);
  return shape;
};

export const fencesCrossSection = (trackParams) => [fences1(trackParams), fences2(trackParams)];

export const decorateFences = (fences, scene, trackParams) => {
  const geometry = fencePostGeometry();

  const pointsCount = Math.floor(trackParams.steps);

  const material = new InstancesStandardMaterial({
    color: 0xaaaaaa,
    side: THREE.DoubleSide,
    userData: {
      faceToQuat: true,
    },
    shininess: 100,
    specular: 0xffffff,
  });

  const depthMaterial = new InstancesDepthMaterial({
    depthPacking: THREE.RGBADepthPacking,
    alphaTest: 0.5,
    userData: {
      faceToQuat: true,
    },
  });

  const points = trackParams.centerLine.getSpacedPoints(pointsCount);
  const { binormals } = computeFrenetFrames(trackParams.centerLine, pointsCount);

  const adjustedPoints = points.reduce((a, p, i) => {
    return [
      ...a,
      p.clone().sub(binormals[i].clone().multiplyScalar(7)),
      p.clone().sub(binormals[i].clone().multiplyScalar(-7)),
    ];
  }, []);

  const positions = [];
  const quaternions = [];
  const dummyQuat = new THREE.Quaternion();
  const x = new THREE.Vector3(1, 0, 0);
  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < 1000; i += 1) {
    positions.push(
      adjustedPoints[i].x,
      adjustedPoints[i].y,
      adjustedPoints[i].z,
    );
    const angleX = binormals[i].angleTo(x);
    dummyQuat.setFromAxisAngle(up, angleX);

    quaternions.push(
      dummyQuat.x,
      dummyQuat.y,
      dummyQuat.z,
      dummyQuat.w,
    );
  }

  const instancedMesh = createInstancedMesh({
    geometry,
    count: 1000,
    offset: new THREE.Vector3(0, 0, 0), // treeHeight * 0.5,
    name: `fencePostInstance-${0}`,
    material,
    depthMaterial,
    positions,
    quaternions,
    scaleFunc: () => 1,
    shadow: {
      cast: true,
      receive: true,
    },
  });

  // const test = geometry.clone();
  // test.rotateY(Math.PI * 0.5);
  // scene.add(
  //   new THREE.Mesh(
  //     test,
  //     new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide, specular: 0xffffff, shininess: 100 }),
  //   ),
  // );
  // scene.add(instancedMesh);
};


const fencePostGeometry = () => {
  const vertices = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.2, 0, 0),
    new THREE.Vector3(0, 3, 0),
    new THREE.Vector3(0.2, 3, 0),
    new THREE.Vector3(0.5, 3.5, 0),
    new THREE.Vector3(0.7, 3.5, 0),

    new THREE.Vector3(0, 0, 0.2),
    new THREE.Vector3(0, 3, 0.2),
    new THREE.Vector3(0.5, 3.5, 0.2),
  ];

  const faces = [
    new THREE.Face3(0, 1, 2),
    new THREE.Face3(1, 2, 3),
    new THREE.Face3(2, 3, 4),
    new THREE.Face3(3, 5, 4),

    // new THREE.Face3(6, 0, 3),
    // new THREE.Face3(6, 3, 7),

    // new THREE.Face3(7, 3, 5),
    // new THREE.Face3(5, 8, 7),
  ];

  const geometry = new THREE.Geometry();
  geometry.vertices = vertices;
  geometry.faces = faces;
  geometry.computeFaceNormals();
  geometry.computeFlatVertexNormals();

  const bufferGeometry = new THREE.BufferGeometry().fromGeometry(geometry);

  return bufferGeometry;
};
