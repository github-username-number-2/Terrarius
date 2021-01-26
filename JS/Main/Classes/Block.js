import BlockData from "/JS/Main/Data/GameData/Blocks/BlockData.js";

const Block = class {
  constructor(blockName) {
    this.blockName = blockName;

    //sides are used to identify types of grasses, etc.
    //top, bottom, left, right
    this.sides = [null, null, null, null];
  }
};

export default Block;