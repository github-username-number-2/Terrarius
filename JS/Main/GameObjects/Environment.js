import BlockData from "/JS/Main/Data/GameData/Blocks/BlockData.js";
import MobData from "/JS/Main/Data/GameData/Mobs/MobData.js";

import PhysicsData from "/JS/Main/Data/GameData/PhysicsData.js";
import MinimapData from "/JS/Main/Data/GameData/MinimapData.js";

import { Renderer, World } from "/JS/Main/GameObjects/GameObjects.js";

const { blockSize } = BlockData;

const { mobs } = MobData;

const canvasWidth = canvas.width,
  canvasHeight = canvas.height;

const Environment = {
  gravity: PhysicsData.gravity / PhysicsData.gravityLimiter,

  terminalVelocity: PhysicsData.terminalVelocity / PhysicsData.terminalVelocityLimiter,

  minimap: [],

  spawnedMobs: [],

  async loadMinimap() {
    const canvas = document.createElement("canvas");
    //canvas.width = 
  },

  renderBackground() {
    ctx.fillStyle = "#00c1de";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000000";
  },

  spawnMob(x, y, mobName) {
    this.spawnedMobs.push(new mobs[mobName](x, y));
  },
  renderMobs() {
    const startTime = perf();

    for (const mob of this.spawnedMobs) {
      const {
        image,
        width,
        height,
      } = mob;

      const [offsetX, offsetY] = Renderer.getRenderCoords(mob.offsetX, mob.offsetY);

      //if mob location is on screen
      if (
        Renderer.rectIsOnScreen(
          offsetX,
          offsetY,
          width * blockSize,
          height * blockSize,
        )
      ) {
        ctx.drawImage(
          image,
          offsetX,
          offsetY,
          width * blockSize,
          height * blockSize,
        );
      }
    }

    logPerformance("Render Mobs", startTime);
  },
  updateMobs() {
    const [playerX, playerY] = Player.getOffsetPosition();

    for (const mob of this.spawnedMobs) {

      const AIVelocity = mob.AI(playerX, playerY);

      mob.xVelocity += AIVelocity[0];
      mob.yVelocity += AIVelocity[1];

      mob.yVelocity += this.gravity;
      mob.yVelocity > this.terminalVelocity && (mob.yVelocity = this.terminalVelocity);

      const velocity = Environment.getAdjustedVelocity(
        mob.offsetX,
        mob.offsetY,
        mob.xVelocity,
        mob.yVelocity,
        mob.hitbox,
        mob.collisions.blocks,
        mob.collisions.mapEdge,
      );

      mob.xVelocity = velocity[0];
      mob.yVelocity = velocity[1];

      mob.offsetX = _.round(mob.offsetX + mob.xVelocity, 4);
      mob.offsetY = _.round(mob.offsetY + mob.yVelocity, 4);
    }
  },

  //will reutrn object position based on velocity and collisions
  getAdjustedVelocity(offsetX, offsetY, velocityX, velocityY, hitbox, blockCollision, mapEdgeCollision) {
    (() => {
      const left = Math.floor(hitbox[0] + offsetX) - 1,
        right = Math.ceil(hitbox[1] + hitbox[2] + offsetX),
        top = Math.floor(hitbox[1] + offsetY) - 1,
        bottom = Math.ceil(hitbox[1] + hitbox[3] + offsetY);

      //checks left
      if (velocityX < 0) {
        let xCollision = -Infinity;
        for (let i = top + 1; i < bottom; i++) {
          const block = World.getBlock(left, i);

          if (
            (blockCollision && block)
            || (mapEdgeCollision && World.isMapEdge(left, i))
          ) {
            const collision = left + 1;
            if (collision > xCollision) {
              xCollision = collision;
            }
          }
        }
        if (offsetX + velocityX < xCollision) {
          velocityX = xCollision - offsetX;
        }
      }
      //checks right
      if (velocityX > 0) {
        let xCollision = Infinity;
        for (let i = top + 1; i < bottom; i++) {
          const block = World.getBlock(right, i);

          if (
            (blockCollision && block)
            || (mapEdgeCollision && World.isMapEdge(right, i))
          ) {
            const collision = right;
            if (collision < xCollision) {
              xCollision = collision;
            }
          }
        }
        const objectRight = offsetX + velocityX + hitbox[0] + hitbox[2];
        if (objectRight > xCollision) {
          velocityX = xCollision - objectRight + velocityX;
        }
      }

      //re-calculates player x to prevent player from going through corners of blocks
      offsetX = _.round(offsetX + velocityX, 4);
    })();
    (() => {
      const left = Math.floor(hitbox[0] + offsetX) - 1,
        right = Math.ceil(hitbox[1] + hitbox[2] + offsetX),
        top = Math.floor(hitbox[1] + offsetY) - 1,
        bottom = Math.ceil(hitbox[1] + hitbox[3] + offsetY);

      //checks top
      if (velocityY < 0) {
        let yCollision = -Infinity;
        for (let i = left + 1; i < right; i++) {
          const block = World.getBlock(i, top);

          if (
            (blockCollision && block)
            || (mapEdgeCollision && World.isMapEdge(i, top))
          ) {
            const collision = top + 1;
            if (collision > yCollision) {
              yCollision = collision;
            }
          }
        }
        if (offsetY + velocityY < yCollision) {
          velocityY = yCollision - offsetY;
        }
      }
      //checks bottom
      if (velocityY > 0) {
        let yCollision = Infinity;
        for (let i = left + 1; i < right; i++) {
          const block = World.getBlock(i, bottom);

          if (
            (blockCollision && block)
            || (mapEdgeCollision && World.isMapEdge(i, bottom))
          ) {
            const collision = bottom;
            if (collision < yCollision) {
              yCollision = collision;
            }
          }
        }
        const objectBottom = offsetY + velocityY + hitbox[1] + hitbox[3];
        if (objectBottom > yCollision) {
          velocityY = yCollision - objectBottom + velocityY;
        }
      }
    })();

    return [_.round(velocityX, 4), _.round(velocityY, 4)];
  },
};

export default Environment;