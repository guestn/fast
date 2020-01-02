import * as THREE from 'three';

export const createMaterial = ({
  bumpMap,
  color,
  emissive = 0x000000,
  envMap,
  flatShading = false,
  map,
  name,
  normalMap,
  shininess = 30,
  side,
  specular = 0x000000,
  type,
  wireframe = false,
}, assets) => {
  const material = new THREE[type]({
    color,
    emissive,
    flatShading,
    name,
    shininess,
    side: THREE[side],
    specular,
    wireframe,
  });
  if (map) {
    material.map = assets[map.name];
    material.map.wrapT = THREE[map.wrapping] || THREE.RepeatWrapping;
    material.map.wrapS = THREE[map.wrapping] || THREE.RepeatWrapping;
    if (map.repeat) material.map.repeat.set(...map.repeat);
    if (map.offset) material.map.repeat.set(...map.offset);
  }
  if (normalMap) {
    material.normalMap = assets[normalMap.name];
    material.normalMap.wrapT = THREE[normalMap.wrapping] || THREE.RepeatWrapping;
    material.normalMap.wrapS = THREE[normalMap.wrapping] || THREE.RepeatWrapping;
    if (normalMap.repeat) material.normalMap.repeat.set(...normalMap.repeat);
    if (normalMap.offset) material.normalMap.repeat.set(...normalMap.offset);
    if (normalMap.normalScale) material.normalScale.set(...normalMap.normalScale);
  }
  if (bumpMap) {
    material.bumpMap = assets[bumpMap.name];
    material.bumpMap.wrapT = THREE[bumpMap.wrapping] || THREE.RepeatWrapping;
    material.bumpMap.wrapS = THREE[bumpMap.wrapping] || THREE.RepeatWrapping;
    if (bumpMap.repeat) material.normalMap.repeat.set(...bumpMap.repeat);
    if (bumpMap.offset) material.normalMap.repeat.set(...bumpMap.offset);
   // if (normalMap.normalScale) material.normalScale.set(...bumpMap.normalScale);
  }
  if (envMap) {
    material.envMap = assets[envMap.name];
  }
  return material;
};
