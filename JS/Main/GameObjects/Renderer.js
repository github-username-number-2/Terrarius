import RenderData from "/JS/Main/Data/GameData/RenderData.js";

import {
  Player,
  World,
  Environment,
  WorldEffects,
  Game,
  Input,
  UI,
} from "/JS/Main/GameObjects/GameObjects.js";

import BlockData from "/JS/Main/Data/GameData/Blocks/BlockData.js";

const { blockSize } = BlockData;

/*
update order:
  player

render order:
  environment background
  world map
  environment mobs
  player
  world effects
  UI elements
*/

//prevents need to run multiple game loops on tab switch
document.addEventListener("visibilitychange", event => {
  if (document.visibilityState === "visible") {
    Renderer.lastTime = perf();
  }
});

const Renderer = {
  deltaTime: 1000 / RenderData.deltaTime,
  lastTime: 0,
  accumulatedTime: 0,

  intervals: [],
  timeouts: [],

  updatingPaused: false,

  scheduledUpdateID: null,

  render(time) {
    this.accumulatedTime += time - this.lastTime;

    let FPS = 1000 / (time - this.lastTime);
    FPS = FPS > 58 ? 60 : FPS;

    while (this.accumulatedTime >= 1000 / this.deltaTime) {
      const startTime = perf();


      ctx.clearRect(0, 0, canvas.width, canvas.height);

      try {
        if (Game.currentState === "inGame") {
          if (!this.updatingPaused) {
            Player.update();
            Environment.updateMobs();
          }

          Environment.renderBackground();
          World.renderMap(Player.positionX, Player.positionY);
          Environment.renderMobs();
          Player.render();
          WorldEffects.renderEffects();
        }
        UI.renderElements();
      } catch (error) {
        console.log(`game loop error: ${error}`);
        console.log("error is accessible through global variable with name 'error'");

        window.error = error;

        return;
      }

      if (Player.controlActive("displayStats")) {
        ctx.font = "16px arial";
        ctx.fillStyle = "#000000";
        
        let yPixels = 16;
        
        ctx.fillText("FPS: " + Math.trunc(FPS), 32, yPixels += 16);
        ctx.fillText("Game Time: " + Math.trunc(time) + "ms", 32, yPixels += 16);
        
        if (performance.memory) {
          const statStartTime = perf();

          const usedMemory = performance.memory.totalJSHeapSize,
            remainingMemory = performance.memory.jsHeapSizeLimit - performance.memory.totalJSHeapSize;
          ctx.fillText("Current JS stack size: " + usedMemory + "B", 32, yPixels += 16);
          ctx.fillText("Remaining JS memory: " + remainingMemory + "B", 32, yPixels += 16);
          ctx.fillText("Current JS stack size: " + Math.round(usedMemory / 1000000) + "MB", 32, yPixels += 16);
          ctx.fillText("Remaining JS memory: " + Math.round(remainingMemory / 1000000) + "MB", 32, yPixels += 16);
        
          logPerformance("Display Stats", statStartTime);
        }
        
        getPerformanceLogs().split("\n").forEach(log => {
          ctx.fillText(log, 32, yPixels += 16);
        });
      }


      this.accumulatedTime -= 1000 / this.deltaTime;


      for (const interval of this.intervals) {
        if (perf() - interval.lastRun > interval.time) {
          interval.lastRun = perf() - interval.lastRun - interval.time + perf();
          interval.func();
        }
      }
      for (const timeout of this.timeouts) {
        if (perf() - timeout.lastRun > timeout.time) {
          this.clearTimeout(timeout.name);
          timeout.func();
        }
      }

      logPerformance("Game Loop", startTime);
    }

    this.lastTime = time;

    //important
    this.scheduledUpdateID = requestAnimationFrame(time => this.render(time));
  },

  start() {
    requestAnimationFrame(time => this.render(time));
  },
  pause() {
    cancelAnimationFrame(this.scheduledUpdateID);
  },

  startUpdating() {
    this.updatingPaused = false;
  },
  pauseUpdating() {
    this.updatingPaused = true;
  },

  setInterval(func, time, name) {
    this.intervals.push({
      func,
      time,
      name,
      lastRun: perf(),
    });
  },
  clearInterval(name) {
    this.intervals = this.intervals.filter(
      interval => interval.name !== name
    );
  },
  setTimeout(func, time, name) {
    this.timeouts.push({
      func,
      time,
      name,
      lastRun: perf(),
    });
  },
  clearTimeout(name) {
    this.timeouts = this.timeouts.filter(
      timeout => timeout.name !== name
    );
  },

  //checks whether or not an x y position in screen pixels is within the canvas
  positionIsOnScreen(x, y) {
    return x >= 0
      && x < canvas.width
      && y >= 0
      && y < canvas.height
  },
  rectIsOnScreen(x, y, width, height) {
    return this.positionIsOnScreen(x, y) //top-left
      || this.positionIsOnScreen(x + width, y) //top-right
      || this.positionIsOnScreen(x, y + height) //bottom-left
      || this.positionIsOnScreen(x + width, y + height); //bottom-right
  },

  //takes position in blocks and returns screen render location relative to player
  getRenderCoords(x, y) {
    //temp
    let playerX = Player.positionX,
      playerY = Player.positionY;

    const xBlocks = canvas.width / blockSize,
      yBlocks = canvas.height / blockSize;

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

    return [
      (x - playerX) * blockSize,
      (y - playerY) * blockSize,
    ];
  },
};

export default Renderer;