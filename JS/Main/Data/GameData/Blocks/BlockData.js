export default {
  xBlockPixels: 8,
  yBlockPixels: 8,

  //should be blockSize / x or y BlockPixels
  pixelSize: 2,
  
  //in pixels
  blockSize: 16,

  blocks: {
    /*
    blockName: {
      type: "solid", "liquid"

      sideSmoothness: values are in ./BlockSmoothness.js, defines smoothness of side of block when side is exposed
    }
    */
    dirt: {
      type: "solid",

      sideSmoothness: "rough",

      allowedSideTextures: ["grass"],
    },
    stone: {
      type: "solid",

      sideSmoothness: "rough",

      allowedSideTextures: [],
    },
  },
};