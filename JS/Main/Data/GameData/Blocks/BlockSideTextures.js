import ColorPalette from "../ColorPalette.js";

import BlockData from "./BlockData.js";

//tr:0 === null === transparent
const BlockSideTextures = {
  grass: {
    //top side
    sideMap: [
      ["gn:0", "gn:0", "gn:0", "gn:0", "gn:0", "gn:0", "gn:0", "gn:0"],
      ["gn:0", "gn:0", "gn:0", "gn:0", "gn:0", "gn:0", "gn:0", "gn:0"],
      ["gn:0", "gn:0", "gn:1", "gn:0", "gn:1", "gn:1", "gn:0", "gn:1"],
      ["gn:1", "gn:1", "un:0", "gn:1", "un:0", "un:0", "gn:1", "un:0"],
    ],
    //top-right corner
    cornerMap: [
      ["un:0", "un:0", "un:0", "un:0", "gn:0", "gn:0", "gn:0", "gn:0"],
      ["un:0", "un:0", "un:0", "un:0", "gn:0", "gn:1", "gn:0", "gn:0"],
      ["un:0", "un:0", "un:0", "un:0", "gn:1", "gn:1", "gn:0", "gn:0"],
      ["un:0", "un:0", "un:0", "un:0", "gn:1", "gn:1", "gn:1", "gn:0"],
    ],
    //end on right side
    endMap: [
      ["gn:0", "gn:0", "gn:0", "gn:0", "gn:0", "gn:0", "gn:0", "gn:0"],
      ["gn:0", "gn:0", "gn:0", "gn:0", "gn:0", "gn:0", "gn:0", "gn:0"],
      ["gn:0", "gn:0", "gn:1", "gn:0", "gn:1", "gn:1", "gn:0", "gn:1"],
      ["gn:1", "gn:1", "un:0", "gn:1", "un:0", "un:0", "gn:1", "un:0"],
    ],
  },
};

//replaces color abbreviations with hexadecimal color values and fills unused space
Object.keys(BlockSideTextures).forEach(blockName => {
  const textureMaps = [
    BlockSideTextures[blockName].sideMap,
    BlockSideTextures[blockName].cornerMap,
    BlockSideTextures[blockName].endMap,
  ];

  textureMaps.forEach(textureMap => {
    textureMap.length = BlockData.yBlockPixels;

    for (let yIndex = 0; yIndex < textureMap.length; yIndex++) {
      let yArray = textureMap[yIndex];

      //fills remaining arrays
      textureMap[yIndex] = yArray || (yArray = []);
      yArray.length = BlockData.xBlockPixels;

      for (let xIndex = 0; xIndex < yArray.length; xIndex++) {
        let pixel = yArray[xIndex];

        //if pixel is not already hexadecimal
        if (pixel && pixel.indexOf("#")) {
          pixel = pixel.split(":");
          try {
            yArray[xIndex] = ColorPalette[pixel[0]][pixel[1]];
          } catch (error) {
            throw new RangeError(
              `Color with identifier ${pixel.join(":")} not found in color palette in block with name ${blockName} in /JS/Main/Data/GameData/BlockSideTextures.js`
            );
          }
        } else {
          yArray[xIndex] = undefined;
        }
      }
    }
  });
});

export default BlockSideTextures;