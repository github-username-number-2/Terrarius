import WorldGenerationData from "/JS/Main/Data/GameData/WorldGenerationData.js";

import WorldGenerator from "./WorldGenerator.js";


/*
important info here:

you have access to this library:
  https://github.com/josephg/noisejs

it is accessible through the noise variable
you do not need to call noise.seed it is already taken care of
*/


async function generateWorld(size, evilBiome, seed, updateFunction = () => { }) {
  size = WorldGenerationData.sizes[size];
  const { width, height } = size;

  updateFunction("Generating World", 0);

  WorldGenerator.initialize(width, height, seed);


  //fills layers
  //fills world with last layer if total layer height falls short
  WorldGenerator.fillMap(
    WorldGenerationData.layers[
      WorldGenerationData.layers.length - 1
    ].block
  );

  const layerHeights = [];
  WorldGenerationData.layers.forEach(layer => {
    const layerHeight = Math.floor(height * layer.height);

    WorldGenerator.fillArea(
      //0 blocks from left edge
      0,
      //adds up previous layer heights
      layerHeights.reduce((a, b) => a + b, 0),
      width,
      layerHeight,
      layer.block,
    );
    
    layerHeights.push(layerHeight);
  });

  let y = 180, operator = 0;
  for (let i = 0; i < WorldGenerator.width; i++) {
    WorldGenerator.fillArea(i, y, 1, i, "dirt");
    operator ? y++ : y--;
    y >= 180 && (operator = 0);
    y <= 170 && (operator = 1);
  }

  WorldGenerator.fillArea(440, 170, 20, 10, "air");

  WorldGenerator.fillExposedSideTextures(0, 170, width, 11, "grass");

  WorldGenerator.setBlock(450, 179, "oakTreeLeftStump");

  WorldGenerator.fillAreaRandom(
    196,
    30,
    12,
    12,
    "dirt",
    0.5,
  );

  return {
    map: WorldGenerator.map,
    playerX: WorldGenerator.map.length / 2,
    playerY: 10,
  };
}

export default generateWorld;