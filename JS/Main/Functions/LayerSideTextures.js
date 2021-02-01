import BlockSideTextures from "/JS/Main/Data/GameData/Blocks/BlockSideTextures.js";

import {
  rotate2DArray,
  merge2DArray,
  flip2DArray,
  flip2DArrayDiagonal,
} from "./ArrayFunctions.js";

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
      let cornerMap = BlockSideTextures[block.sides[i]].cornerMap;

      //randomly flips corner textures to add variety
      if (block.RenderData.cornerTextureInts === undefined) {
        block.RenderData.cornerTextureInts = [
          getRandomInt(0, 1),
          getRandomInt(0, 1),
          getRandomInt(0, 1),
          getRandomInt(0, 1),
        ];
      }
      if (block.RenderData.cornerTextureInts[i]) {
        cornerMap = flip2DArrayDiagonal(cornerMap, "upward", true);
      }

      const blockCorner = rotate2DArray(
        cornerMap,
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
      side1 === side2
      && block.blockData.allowedSideTextures.includes(side1)
    ) {
      let insideCornerMap = BlockSideTextures[side1].insideCornerMap;

      //randomly flips inside corner textures to add variety
      if (block.RenderData.insideCornerTextureInts === undefined) {
        block.RenderData.insideCornerTextureInts = [
          getRandomInt(0, 1),
          getRandomInt(0, 1),
          getRandomInt(0, 1),
          getRandomInt(0, 1),
        ];
      }
      if (block.RenderData.insideCornerTextureInts[i]) {
        insideCornerMap = flip2DArrayDiagonal(insideCornerMap, "upward", true);
      }

      const insideCorner = rotate2DArray(
        insideCornerMap,
        i,
      );

      blockMap = merge2DArray(blockMap, insideCorner, [undefined]);
    }
  }

  return blockMap;
}