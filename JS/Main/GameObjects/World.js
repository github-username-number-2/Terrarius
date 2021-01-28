/*
need to heavily optimize updateChunkImage function down to the last hundredth of a millisecond to decrease initial load time and reduce latency on block manipulation

need to finish workerUpdateChunkImage function

on initial startup, a square of chunks will be loaded around the player
chunks will be gradually loaded around the player until all are loaded
when the game is saved, the chunk image map will be converted to data URIs and save in the file
if this is implemented, save files may be significantly longer (hundreds of gigabytes)
*/

import BlockTextures from "/JS/Main/Data/GameData/Blocks/BlockTextures.js";
//import BlockSideTextures from "/JS/Main/Data/GameData/Blocks/BlockSideTextures.js";
//import BlockSideSmoothness from "/JS/Main/Data/GameData/Blocks/BlockSmoothness.js";

import BlockData from "/JS/Main/Data/GameData/Blocks/BlockData.js";
import ChunkData from "/JS/Main/Data/GameData/ChunkData.js";

import Block from "/JS/Main/Classes/Block.js";

import Player from "./Player.js";

import generateWorld from "/JS/Main/Functions/WorldGeneration/GenerateWorld.js";
import layerSideTextures from "/JS/Main/Functions/LayerSideTextures.js";
import layerSideSmoothness from "/JS/Main/Functions/LayerSideSmoothness.js";

const secondaryCanvas = document.createElement("canvas"),
  sctx = secondaryCanvas.getContext("2d");

secondaryCanvas.width = BlockData.blockSize * ChunkData.chunkWidth;
secondaryCanvas.height = BlockData.blockSize * ChunkData.chunkHeight;

const secondaryCanvasWidth = secondaryCanvas.width,
  secondaryCanvasHeight = secondaryCanvas.height;

const { blockSize, chunkImageFormat } = BlockData;

const { chunkWidth, chunkHeight } = ChunkData;

const { xBlockPixels, yBlockPixels } = BlockData;

const pixelWidth = blockSize / xBlockPixels,
  pixelHeight = blockSize / yBlockPixels;

const canvasWidth = canvas.width,
  canvasHeight = canvas.height;

const xBlocks = canvasWidth / blockSize,
  yBlocks = canvasHeight / blockSize;

const xChunks = xBlocks / chunkWidth,
  yChunks = yBlocks / chunkHeight;

const xRenderChunks = xChunks + 1,
  yRenderChunks = yChunks + 1;

function createBlock(x, y, blockName) {
  return blockName === "air" ? null : new Block(x, y, blockName);
}

/*
the world is stored in nested arrays
on startup, groups of blocks are drawn to a seperate canvas and saved as an image into another group of nested arrays
this prevnts the need to render every pixel, of every block, every frame
instead it is just drawing images

world map, chunk image map and block pixel maps are stored in y, x arrays
map[y][x]
*/

//loadChunkImageMap needs to be called first to create the chunkImage array and load chunk images
//updateChunkImage can then be called to update specific chunk images when needed
//if all chunks are loaded, renderMap can be called to draw the chunks to the screen
const World = {
  renderMap() {
    const startTime = perf();

    let playerX = Player.positionX,
      playerY = Player.positionY;

    const rightRenderLimit = this.width - xBlocks,
      bottomRenderLimit = this.height - yBlocks;

    if (playerX < 0) {
      playerX = 0;
    }
    if (playerX > rightRenderLimit) {
      playerX = rightRenderLimit;
    }
    if (playerY < 0) {
      playerY = 0;
    }
    if (playerY > bottomRenderLimit) {
      playerY = bottomRenderLimit;
    }

    const xChunkStart = Math.floor(playerX / chunkWidth),
      yChunkStart = Math.floor(playerY / chunkHeight);

    const xOffset = playerX - xChunkStart * chunkWidth,
      yOffset = playerY - yChunkStart * chunkHeight;

    const chunkImageMap = this.chunkImageMap;
    for (let y = 0; y < yRenderChunks; y++) {
      for (let x = 0; x < xRenderChunks; x++) {
        let chunk = chunkImageMap[y + yChunkStart];
        if (!chunk) {
          logPerformance("Render World", startTime);
          return;
        }
        chunk = chunk[x + xChunkStart];
        //checks if chunk is loaded
        if (chunk) {
          ctx.drawImage(
            chunk,
            (x * chunkWidth - xOffset) * blockSize,
            (y * chunkHeight - yOffset) * blockSize,
            chunkWidth * blockSize,
            chunkHeight * blockSize,
          );
        }
      }
    }

    logPerformance("Render World", startTime);
  },

  //creates chunk image array and loads all chunk images
  //should be called once, after world generation
  async loadInitialChunkImageMap(updateFunction = () => { }) {
    const worldXChunks = Math.ceil(this.width / chunkWidth),
      worldYChunks = Math.ceil(this.height / chunkHeight); console.log()

    const chunkImageMap = this.chunkImageMap = [],
      chunkDataMap = this.chunkDataMap = [],
      updateChunkImage = this.updateChunkImage;

    for (let y = 0; y < worldYChunks; y++) {
      chunkImageMap[y] = [];
      chunkDataMap[y] = [];
      for (let x = 0; x < worldXChunks; x++) {
        this.updateChunkImage(x, y);

        //breaks up loading time to prevnt lag
        await Timer(5);
      }
      updateFunction("Loading Chunks", y / worldYChunks);
    }
    updateFunction("Loading Chunks", 1);
  },

  //will update specific chunk images
  //loadChunkImageMap needs to be called once to create the chunk image array
  //used on the parent chunk of an updated block
  async updateChunkImage(x, y) {
    const processingStartTime = perf();
    sctx.clearRect(0, 0, secondaryCanvasWidth, secondaryCanvasHeight);

    let loadChunk = false;

    //loops through chunk
    const map = this.map;
    //loops through y
    main: for (let yIndex = 0; yIndex < chunkHeight; yIndex++) {
      //loops through x
      for (let xIndex = 0; xIndex < chunkWidth; xIndex++) {
        let block = map[
          y * chunkHeight + yIndex
        ];
        //if block is past bottom y limit
        if (block === undefined) {
          break main;
        }
        block = block[
          x * chunkWidth + xIndex
        ];
        //if block is past right x limit
        if (block === undefined) {
          continue main;
        }
        if (block === null) {
          //air blocks will be null
          continue;
        }

        //chunk is not blank
        loadChunk = true;

        const surroundingBlocks = block.getSurroundingBlocks(),
          diagonalSurroundingBlocks = block.getDiagonalSurroundingBlocks();

        let blockMap = BlockTextures[block.blockName].map;

        blockMap = layerSideTextures(block, blockMap, surroundingBlocks, diagonalSurroundingBlocks);
        blockMap = layerSideSmoothness(block, blockMap, surroundingBlocks, diagonalSurroundingBlocks);

        //loops through block pixels
        //alternate loops are faster but don't work
        for (let yPixelIndex = 0; yPixelIndex < yBlockPixels; yPixelIndex++) {
          //for (let yPixelIndex = yRowLength; --yPixelIndex;) {
          const pixelRow = blockMap[yPixelIndex];

          for (let xPixelIndex = 0; xPixelIndex < xBlockPixels; xPixelIndex++) {
            //for (let xPixelIndex = xRowLength; --xPixelIndex;) {
            //if pixel is not null
            if (pixelRow[xPixelIndex]) {
              sctx.fillStyle = pixelRow[xPixelIndex];
              sctx.fillRect(
                //index * blockSize finds beginning of block
                //size * pixelIndex finds location within block
                xIndex * blockSize + pixelWidth * xPixelIndex,
                yIndex * blockSize + pixelHeight * yPixelIndex,
                pixelWidth,
                pixelHeight,
              );
            }
          }
        }
      }
    }

    logPerformance("Update Chunk Processing", processingStartTime);

    const dataURLStartTime = perf();

    if (loadChunk) {
      const chunkImage =
        this.chunkDataMap[y][x] =
        secondaryCanvas.toDataURL(chunkImageFormat);

      this.chunkImageMap[y][x] = new Image();
      this.chunkImageMap[y][x].src = chunkImage;
    }

    logPerformance("Update Chunk toDataURL", dataURLStartTime);
  },

  //same as updateChunkImage but uses web workers and Uint8ClampedArray instead of canvas
  workerUpdateChunkImage(x, y) {
    //
  },

  generateMap(size, evilBiome, seed, updateFunction = () => { }) {
    return generateWorld(...arguments).then(data => {
      this.map = data.map;
      this.width = data.map[0].length;
      this.height = data.map.length;

      Player.setOffsetPosition(data.playerX, data.playerY);
    });
  },

  getBlock(x, y) {
    if (this.isMapEdge(x, y)) {
      return undefined;
    }
    return this.map[y][x];
  },
  setBlock(x, y, blockName) {
    this.map[y][x] = createBlock(x, y, blockName);
    this.updateChunkImage(...this.getChunkCoords(x, y));
  },
  getChunkCoords(x, y) {
    return [Math.floor(x / chunkWidth), Math.floor(y / chunkHeight)];
  },

  isMapEdge(x, y) {
    return x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1;
  },

  //0 is 0 degrees, 1 is 90 degrees, 2 is 180 degrees, 3 is 270 degrees
  getClosestCollision(x, y, angle) {
    //
  },
};

export default World;