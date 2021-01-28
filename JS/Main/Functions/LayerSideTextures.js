import BlockSideTextures from "/JS/Main/Data/GameData/Blocks/BlockSideTextures.js";

import {
  rotate2DArray,
  merge2DArray,
  flip2DArray,
} from "./ArrayFunctions.js";
//import rotate2DArray from "./Rotate2DArray.js";
//import merge2DArray from "./Merge2DArray.js";
//import flip2DArray from "./Flip2DArray.js";

export default function layerSideTextures(block, blockMap, surroundingBlocks, diagonalSurroundingBlocks) {
  for (let i = 0; i < block.sides.length; i++) {
    //layers side texture
    if (block.sides[i]) {
      let sideMap = BlockSideTextures[block.sides[i]].sideMap;
      //randomly flips side textures to add variety
      if (block.RenderData.sideTextureInts === undefined) {
        block.RenderData.sideTextureInts = [
          getRandomInt(0, 1),
          getRandomInt(0, 1),
          getRandomInt(0, 1),
          getRandomInt(0, 1),
        ];
      }
      if (block.RenderData.sideTextureInts[i]) {
        sideMap = flip2DArray(sideMap, "x", true);
      }

      const blockSide = rotate2DArray(
        sideMap,
        i,
      );

      blockMap = merge2DArray(blockMap, blockSide, [undefined]);
    }
  }
  for (let i = 0; i < block.sides.length; i++) {
    //layers corner side textures
    if (block.sides[i] && block.sides[i] === block.sides[(i + 1) % 4]) {
      const blockCorner = rotate2DArray(
        BlockSideTextures[block.sides[i]].cornerMap,
        i,
      );

      blockMap = merge2DArray(blockMap, blockCorner, [undefined]);
    }
  }
  for (let i = 0; i < block.sides.length; i++) {
    //layers inside corner side textures
    const iIncremented = (i + 1) % 4,
      side1 = surroundingBlocks[i] ?.sides[iIncremented],
      side2 = surroundingBlocks[iIncremented] ?.sides[i];
    if (
      surroundingBlocks[i]
      && side1 === side2
      && block.blockData.allowedSideTextures.includes(side1)
    ) {
      const insideCorner = rotate2DArray(
        BlockSideTextures[side1].insideCornerMap,
        i,
      );

      blockMap = merge2DArray(blockMap, insideCorner, [undefined]);
    }
  }

  return blockMap;
}