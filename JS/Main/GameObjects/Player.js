import BlockData from "/JS/Main/Data/GameData/Blocks/BlockData.js";
import ChunkData from "/JS/Main/Data/GameData/ChunkData.js";
import PlayerData from "/JS/Main/Data/GameData/PlayerData.js";

import BlockSideTextures from "/JS/Main/Data/GameData/Blocks/BlockSideTextures.js";

import { World, Environment, Input } from "./GameObjects.js";


const { hitbox } = PlayerData;
const { blockSize } = BlockData;

const xBlocks = canvas.width / blockSize,
  yBlocks = canvas.height / blockSize;

const Player = {
  //in blocks
  width: PlayerData.width,
  height: PlayerData.height,

  xVelocity: 0,
  yVelocity: 0,

  //values: spectator, normal
  cameraMode: "normal",

  controls: PlayerData.controls,

  hitbox: hitbox,
  movementSpeed: PlayerData.movementSpeed / PlayerData.movementLimiter,
  spectatorSpeed: PlayerData.spectatorSpeed,
  jumpHeight: PlayerData.jumpHeight / PlayerData.jumpLimiter,

  render() {
    const rightRenderLimit = World.width - xBlocks,
      bottomRenderLimit = World.height - yBlocks;

    let xRender = canvas.width / 2,
      yRender = canvas.height / 2;

    const { positionX, positionY } = this;

    const { width, height } = this;

    if (positionX < 0) {
      xRender -= Math.abs(positionX * blockSize);
    }
    if (positionX > rightRenderLimit) {
      xRender += (positionX - rightRenderLimit) * blockSize;
    }
    if (positionY < 0) {
      yRender -= Math.abs(positionY * blockSize);
    }
    if (positionY > bottomRenderLimit) {
      yRender += (positionY - bottomRenderLimit) * blockSize;
    }

    ctx.fillStyle = "#000000";

    ctx.fillRect(
      xRender - width / 2 * blockSize,
      yRender - height / 2 * blockSize,
      width * blockSize,
      height * blockSize,
    );
  },

  update() {
    const startTime = perf();

    let scheduledX, scheduledY;

    if (this.cameraMode === "spectator") {
      scheduledX = scheduledY = 0;

      if (this.controlActive("left")) {
        scheduledX -= this.spectatorSpeed;
      }
      if (this.controlActive("right")) {
        scheduledX += this.spectatorSpeed;
      }
      if (this.controlActive("up")) {
        scheduledY -= this.spectatorSpeed;
      }
      if (this.controlActive("down")) {
        scheduledY += this.spectatorSpeed;
      }
    } else if (this.cameraMode === "normal") {
      scheduledX = this.xVelocity;
      scheduledY = this.yVelocity;

      let {
        movementSpeed,
        jumpHeight,
      } = this;

      if (this.controlActive("left")) {
        scheduledX -= movementSpeed;
      }
      if (this.controlActive("right")) {
        scheduledX += movementSpeed;
      }
      if (this.controlActive("up")) {
        this.isStanding && (scheduledY -= jumpHeight);
      }
      if (this.controlActive("down")) {
        scheduledY += movementSpeed;
      }

      scheduledY += Environment.gravity;

      //limits max velocity to terminal velocity
      scheduledY > Environment.terminalVelocity && (scheduledY = Environment.terminalVelocity);
    }

    const position = this.getOffsetPosition();

    const velocity = Environment.getAdjustedVelocity(
      ...position,
      scheduledX,
      scheduledY,
      this.hitbox,
      this.cameraMode !== "spectator",
      true,
    );

    this.xVelocity = velocity[0];
    this.yVelocity = velocity[1];

    this.positionX = _.round(this.positionX + this.xVelocity, 4);
    this.positionY = _.round(this.positionY + this.yVelocity, 4);

    logPerformance("Update Player", startTime);
  },

  controlActive(controlName) {
    for (const control of this.controls[controlName]) {
      if (Input.active(control)) {
        return true;
      }
    }
    return false;
  },

  setOffsetPosition(x, y) {
    this.positionX = x - (canvas.width / blockSize - this.width) / 2;
    this.positionY = y - (canvas.height / blockSize - this.height) / 2;
  },
  getOffsetPosition() {
    return [
      this.positionX + (canvas.width / blockSize - this.width) / 2,
      this.positionY + (canvas.height / blockSize - this.height) / 2,
    ];
  },

  //moves relative to the player's current position
  //move(-2, 5)
  move(x, y) {
    const position = this.getOffsetPosition();
    this.setOffsetPosition(position[0] + x, position[1] + y);
  },

  get isStanding() {
    const [offsetX, offsetY] = this.getOffsetPosition();

    const left = Math.floor(hitbox[0] + offsetX) - 1,
      right = Math.ceil(hitbox[1] + hitbox[2] + offsetX),
      bottom = Math.ceil(hitbox[1] + hitbox[3] + offsetY);

    let scheduledY = this.yVelocity, yCollision = Infinity;
    for (let i = left + 1; i < right; i++) {
      const block = World.getBlock(i, bottom);

      if (block || World.isMapEdge(i, bottom)) {
        const collision = bottom;
        if (collision < yCollision) {
          yCollision = collision;
        }
      }
    }
    const playerBottom = offsetY + scheduledY + hitbox[1] + hitbox[3];

    return playerBottom === yCollision;
  },
};

export default Player;