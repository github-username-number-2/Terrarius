import ColorPalette from "../ColorPalette.js";

import BlockData from "./BlockData.js";

//tr:0 === null === transparent
const BlockSmoothness = {
  rough: {
    sideMap: [
      ["tr:0", "bk:0", "bk:0", "bk:0", "tr:0", "bk:0", "bk:0", "tr:0"],
      ["bk:0", "un:0", "un:0", "un:0", "bk:0", "un:0", "un:0", "bk:0"],
    ],
    cornerMap: [
      ["un:0", "un:0", "un:0", "un:0", "un:0", "un:0", "tr:0", "tr:0"],
      ["un:0", "un:0", "un:0", "un:0", "un:0", "un:0", "bk:0", "tr:0"],
    ],
    endMap: [
      //
    ],
    insideCornerMap: [
      ["un:0", "un:0", "un:0", "un:0", "un:0", "un:0", "un:0", "bk:0"],
      ["un:0", "un:0", "un:0", "un:0", "un:0", "un:0", "un:0", "un:0"],
    ],

    //block has n * pixelWidth shorter hit box on this side
    //used for partially transparent sides
    blockHitbox: -1,
  },
};

//replaces color abbreviations with hexadecimal color values and fills unused space
Object.keys(BlockSmoothness).forEach(blockName => {
  const textureMaps = [
    BlockSmoothness[blockName].sideMap,
    BlockSmoothness[blockName].cornerMap,
    BlockSmoothness[blockName].endMap,
    BlockSmoothness[blockName].insideCornerMap,
  ];

  textureMaps.forEach(textureMap => {
    textureMap.length = BlockData.yBlockPixels;

    for (let yIndex = 0; yIndex < textureMap.length; yIndex++) {
      let yArray = textureMap[yIndex];
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
              `Color with identifier ${pixel.join(":")} not found in color palette in block with name ${blockName} in /JS/Main/Data/GameData/BlockSmoothness.js`
            );
          }
        } else {
          yArray[xIndex] = undefined;
        }
      }
    }
  });
});

export default BlockSmoothness;