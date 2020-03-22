import { GrassMaterial } from '../custom/geometries/grass';

export const materialsIndex = [
  {
    name: 'green',
    type: 'MeshLambertMaterial',
    color: 0x3f451c,
    side: 'FrontSide',
    wireframe: false,
  },
  {
    name: 'mappedFlat',
    type: 'MeshPhongMaterial',
    color: 0xffffff,
    map: {
      name: 'UVGrid',
      repeat: [1, 1],
    },
    side: 'FrontSide',
    wireframe: false,
    emissive: 0x000022,
    shininess: 100,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  },
  {
    name: 'wireFrame',
    type: 'MeshPhongMaterial',
    color: 0xff0000,
    side: 'FrontSide',
    wireframe: true,
    wireframeLinewidth: 5,
    emissive: 0x000000,
  },
  {
    name: 'road',
    type: 'MeshPhongMaterial',
    color: 0xaaaaaa,
    map: {
      name: 'Road_Map',
      wrapping: 'MirroredRepeatWrapping',
      repeat: [2, 1],
    },
    // lightMap: {
    //   name: 'LightMap_Map',
    //   repeat: [0.25, 0.25],
    //   lightMapIntensity: 0.5,//0.1,
    //   //wrapping: 'MirroredRepeatWrapping',
    // },
    normalMap: {
      name: 'Road_Normal',
      wrapping: 'MirroredRepeatWrapping',
      normalScale: [0.5, 0.5],
    },
    shininess: 1,
    specular: 0x777777,
    side: 'FrontSide',
    wireframe: false,
    emissive: 0x000000,
    clipping: true,
  },
  {
    name: 'roadRacingLine',
    type: 'MeshPhongMaterial',
    color: 0x000000,
    map: {
      name: 'RoadRacingLine_Map',
      wrapping: 'MirroredRepeatWrapping',
      repeat: [2, 1],
    },
  
    // normalMap: {
    //   name: 'Road_Normal',
    //   wrapping: 'MirroredRepeatWrapping',
    //   normalScale: [0.5, 0.5],
    // },
    shininess: 1,
    transparent: true,
    opacity: 0.5,
    specular: 0x444444,
    side: 'FrontSide',
    wireframe: false,
    clipping: true,
    //blending: 'MultiplyBlending',
  },
  {
    name: 'GrassMaterial',
    type: 'MeshLambertMaterial',
    color: 0xdddddd,
    customMaterial: GrassMaterial,
    map: {
      name: 'Grass_Map',
      repeat: [1.5, 1.5],
      wrapping: 'MirroredRepeatWrapping',
    },
    normalMap: {
      name: 'Grass_Normal',
      normalScale: [1, 1],
    },

    // lightMap: {
    //   name: 'LightMap_Map',
    //   repeat: [1, 1],
    //   lightMapIntensity: 0.1,
    // },
    side: 'FrontSide',
    wireframe: false,
    emissive: 0x000000,
    shininess: 0,
  },
  {
    name: 'LongGrassMaterial',
    type: 'MeshLambertMaterial',
    color: 0x555555,
    //customMaterial: GrassMaterial,
    map: {
      name: 'LongGrass_Map',
      repeat: [1, 3],
      wrapping: 'MirroredRepeatWrapping',
      rotation: Math.PI * 0.5,
    },
    //flatShading: true,
    // normalMap: {
    //   name: 'Grass_Normal',
    //   normalScale: [1, 1],
    // },

    // lightMap: {
    //   name: 'LightMap_Map',
    //   repeat: [1, 1],
    //   lightMapIntensity: 0.1,
    // },
    side: 'FrontSide',
    wireframe: false,
    emissive: 0x000000,
    shininess: 0,
  },
  {
    name: 'kerb',
    type: 'MeshPhongMaterial',
    color: 0xaaaaaa,
    map: {
      name: 'Concrete_Map',
      wrapping: 'RepeatWrapping',
      repeat: [1, 1],
    },
    normalMap: {
      name: 'Concrete_Normal',
      wrapping: 'RepeatWrapping',
      repeat: [1, 1],
      normalScale: [1, 1],
    },
    shininess: 0,
    specular: 0x000000,
    side: 'FrontSide',
    wireframe: false,
    emissive: 0x000000,
    clipping: true,
  },
  {
    name: 'guardRails',
    type: 'MeshPhongMaterial',
    color: 0xffffff,
    map: {
      name: 'GuardRails_Map',
      wrapping: 'RepeatWrapping',
      repeat: [1, 4],
    },
    normalMap: {
      name: 'GuardRails_Normal',
      wrapping: 'RepeatWrapping',
      repeat: [1, 4],
    },
    shininess: 100,
    specular: 0xaaaaaa,
    side: 'DoubleSide',
    wireframe: false,
    emissive: 0x000000,
    clipping: true,
    useVertexColors: true,

  },
  {
    name: 'skyline',
    type: 'MeshPhongMaterial',
    color: 0xffffff,
    map: {
      name: 'Skyline_Map',
      wrapping: 'RepeatWrapping',
      repeat: [10, 1],
    },
    shininess: 0,
    smartAlpha: true,
    specular: 0xaaaaaa,
    side: 'DoubleSide',
    wireframe: false,
    emissive: 0x000000,
    transparent: true,
  },
  {
    name: 'LocationIcon',
    type: 'SpriteMaterial',
    color: 0xffffff,
    map: {
      name: 'LocationIcon_Map',
    },
  },
];
