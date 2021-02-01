import BlockSideSmoothness from "/JS/Main/Data/GameData/Blocks/BlockSmoothness.js";

import {
  rotate2DArray,
  merge2DArray,
  flip2DArray,
  flip2DArrayDiagonal,
} from "./ArrayFunctions.js";

export default function layerSideSmoothness(block, blockMap, surroundingBlocks, diagonalSurroundingBlocks) {
  for (let i = 0; i < block.sides.length; i++) {
    //layers side smoothness
    if (
      surroundingBlocks[i] ?.blockData ?.type !== "solid"
        && surroundingBlocks[i] !== undefined
    ) {
      let sideMap = BlockSideSmoothness[block.blockData.sideSmoothness].sideMap;
      //randomly flips side textures to add variety
      if (block.RenderData.sideSmoothnessInts === undefined) {
        block.RenderData.sideSmoothnessInts = [
          getRandomInt(0, 1),
          getRandomInt(0, 1),
          getRandomInt(0, 1),
          getRandomInt(0, 1),
        ];
      }
      if (block.RenderData.sideSmoothnessInts[i]) {
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
    //layers corner smoothness
    if (
      surroundingBlocks[i] ?.blockData ?.type !== "solid"
        && !surroundingBlocks[(i + 1) % 4]
        && surroundingBlocks[(i + 1) % 4] !== undefined
    ) {
      let cornerMap = BlockSideSmoothness[block.blockData.sideSmoothness].cornerMap;
      //randomly flips side textures to add variety
      if (block.RenderData.cornerSmoothnessInts === undefined) {
        block.RenderData.cornerSmoothnessInts = [
          getRandomInt(0, 1),
          getRandomInt(0, 1),
          getRandomInt(0, 1),
          getRandomInt(0, 1),
        ];
      }
      if (block.RenderData.cornerSmoothnessInts[i]) {
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
    //layers inside corner side smoothness
    const iIncremented = (i + 1) % 4,
      side1Smoothness = surroundingBlocks[i] ?.blockData ?.sideSmoothness,
      side2Smoothness = surroundingBlocks[iIncremented] ?.blockData ?.sideSmoothness;
    if (
      side1Smoothness
        && side1Smoothness === side2Smoothness
        && diagonalSurroundingBlocks[i] ?.blockData ?.type !== "solid"
    ) {
      let insideCornerMap = BlockSideSmoothness[block.blockData.sideSmoothness].insideCornerMap;
      //randomly flips side textures to add variety
      if (block.RenderData.cornerSmoothnessInts === undefined) {
        block.RenderData.cornerSmoothnessInts = [
          getRandomInt(0, 1),
          getRandomInt(0, 1),
          getRandomInt(0, 1),
          getRandomInt(0, 1),
        ];
      }
      if (block.RenderData.cornerSmoothnessInts[i]) {
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