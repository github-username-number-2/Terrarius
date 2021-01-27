import World from "/JS/Main/GameObjects/World.js";

import BlockData from "/JS/Main/Data/GameData/Blocks/BlockData.js";

const Block = class {
  constructor(x, y, blockName) {
    this.blockName = blockName;

    this.x = x;
    this.y = y;

    this.blockData = BlockData.blocks[blockName];

    //sides are used to identify types of grasses, etc.
    //top, bottom, left, right
    this.sides = [null, null, null, null];
  }

  replace(newBlockName) {
    World.setBlock(this.x, this.y, newBlockName);
  }

  getSurroundingBlocks() {
    const x = this.x,
      y = this.y;
    
    //returns [top, right, bottom, left]
    return [
      World.getBlock(x, y - 1),
      World.getBlock(x + 1, y),
      World.getBlock(x, y + 1),
      World.getBlock(x - 1, y),
    ];
  }
  //returns [top-right, bottom-right, bottom-left, top-left]
  getDiagonalSurroundingBlocks() {
    const x = this.x,
      y = this.y;

    return [
      World.getBlock(x + 1, y - 1),
      World.getBlock(x + 1, y + 1),
      World.getBlock(x - 1, y + 1),
      World.getBlock(x - 1, y - 1),
    ];
  }
};

export default Block;