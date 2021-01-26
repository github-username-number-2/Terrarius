import ColorPalette from "../ColorPalette.js";

const BlockTextures = {
  dirt: {
    map: [
      ["bn:1", "bn:1", "bn:1", "bn:1", "bn:1", "bn:1", "bn:1", "bn:1"],
      ["bn:1", "bn:1", "bn:1", "bn:0", "bn:0", "bn:1", "bn:1", "bn:0"],
      ["bn:0", "bn:0", "bn:0", "bn:0", "bn:0", "bn:0", "bn:0", "bn:0"],
      ["bn:0", "bn:0", "bn:1", "bn:1", "bn:0", "bn:0", "bn:0", "bn:0"],
      ["bn:0", "bn:0", "bn:1", "bn:1", "bn:1", "bn:1", "bn:1", "bn:1"],
      ["bn:1", "bn:1", "bn:1", "bn:1", "bn:1", "bn:0", "bn:0", "bn:0"],
      ["bn:1", "bn:0", "bn:0", "bn:0", "bn:0", "bn:0", "bn:1", "bn:1"],
      ["bn:0", "bn:0", "bn:0", "bn:1", "bn:1", "bn:1", "bn:1", "bn:1"],
    ],
  },
  stone: {
    map: [
      ["#545454","#292929","#3d3d3d","#545454","#545454","#3d3d3d","#292929","#545454"],["#545454","#4f4f4f","#292929","#3d3d3d","#545454","#292929","#292929","#545454"],["#545454","#3d3d3d","#292929","#292929","#4f4f4f","#292929","#3d3d3d","#545454"],["#292929","#292929","#292929","#3d3d3d","#4f4f4f","#292929","#4f4f4f","#545454"],["#3d3d3d","#4f4f4f","#292929","#4f4f4f","#545454","#3d3d3d","#292929","#292929"],["#4f4f4f","#292929","#292929","#545454","#545454","#4f4f4f","#292929","#4f4f4f"],["#545454","#292929","#3d3d3d","#292929","#292929","#292929","#3d3d3d","#3d3d3d"],["#545454","#292929","#545454","#545454","#4f4f4f","#292929","#4f4f4f","#545454"],
    ],
  },
};

//replaces color abbreviations with hexadecimal color values
Object.keys(BlockTextures).forEach(blockName => {
  BlockTextures[blockName].map.forEach(yArray => {
    yArray.forEach((pixel, index) => {
      //if pixel is not already hexadecimal
      if (pixel && pixel.indexOf("#")) {
        pixel = pixel.split(":");
        try {
          yArray[index] = ColorPalette[pixel[0]][pixel[1]];
        } catch (error) {
          throw new RangeError(
            `Color with identifier ${pixel.join(":")} not found in color palette in block with name ${blockName} in /JS/Main/Data/GameData/Blocks/BlockTextures.js`
          );
        }
      }
    });
  });
});

export default BlockTextures;