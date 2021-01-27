import Block from "/JS/Main/Classes/Block.js";

function createBlock(x, y, blockName) {
  //air blocks are null
  return blockName === "air" ? null : new Block(x, y, blockName);
}

const WorldGenerator = {
  initialize(width, height, seed = defaultRandom()) {
    this.seed = seed;
    this.noiseSeed = getSeededInt(1, 65536);

    Math.seedrandom(seed);
    noise.seed(this.noiseSeed);

    this.width = width;
    this.height = height;

    this.map = [];
    for (let y = 0; y < height; y++) {
      this.map[y] = [];
      for (let x = 0; x < width; x++) {
        this.map[y][x] = null;
      }
    }
  },

  fillMap(fillBlock) {
    const width = this.width,
      height = this.height;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.map[y][x] = createBlock(x, y, fillBlock);
      }
    }
  },

  getBlock(x, y) {
    return this.map[y] ?.[x];
  },
  getSideTextures(x, y) {
    return this.map[y] ?.[x] ?.sides || null;
  },
  setBlock(x, y, block) {
    !this.isMapEdge(x, y) && (this.map[y][x] = createBlock(x, y, block));
  },
  setSideTexture(x, y, side, texture) {
    !this.isMapEdge(x, y) && (this.map[y][x].sides[side] = texture);
  },

  fillXRow(y, fillBlock) {
    const width = this.width;
    for (let x = 0; x < this.width; x++) {
      this.setBlock(x, y, fillBlock);
    }
  },
  fillYRow(x, fillBlock) {
    const height = this.height;
    for (let y = 0; y < height; y++) {
      this.setBlock(x, y, fillBlock);
    }
  },
  fillArea(xPos, yPos, width, height, fillBlock) {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        this.setBlock(x + xPos, y + yPos, fillBlock);
      }
    }
  },

  fillSideTexture(xPos, yPos, width, height, texture, side) {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (this.map[y + yPos][x + xPos]) {
          this.setSideTexture(x + xPos, y + yPos, side, texture);
        }
      }
    }
  },

  setExposedSideTextures(x, y, texture) {
    const surroundingBlocks = [
      this.getBlock(x, y - 1),
      this.getBlock(x + 1, y),
      this.getBlock(x, y + 1),
      this.getBlock(x - 1, y),
    ];
    for (let i = 0; i < 4; i++) {
      if (!surroundingBlocks[i] && surroundingBlocks[i] !== undefined) {
        this.setSideTexture(x, y, i, texture);
      }
    }
  },

  fillExposedSideTextures(xPos, yPos, width, height, sideTexture, targetBlockTypes) {
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (this.map[y + yPos][x + xPos]) {
          this.setExposedSideTextures(x + xPos, y + yPos, sideTexture);
        }
      }
    }
  },

  fillAreaRandom(xPos, yPos, width, height, fillBlock, density) {
    const fillNumber = width * height,
      blockCount = Math.round(fillNumber * density);

    const blocks = [];
    for (let i = 0; i < fillNumber; i++) {
      blocks[i] = [i % width, Math.floor(i / width)];
    }
    for (let i = 0; i < blockCount; i++) {
      const randomInt = getSeededInt(0, blocks.length - 1);

      const coords = blocks.splice(randomInt, 1)[0];
      this.setBlock(coords[0] + xPos, coords[1] + yPos, fillBlock);
    }
  },

  createWave(width, height, density) {
    //
  },

  isMapEdge(x, y) {
    return x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1;
  },
};

export default WorldGenerator; 