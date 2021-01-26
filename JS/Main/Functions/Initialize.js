import MobData from "/JS/Main/Data/GameData/Mobs/MobData.js";
import MobTextures from "/JS/Main/Data/GameData/Mobs/MobTextures.js";

import WebWorkers from "/JS/Main/WebWorkers/WebWorkers.js";

const { mobQuality } = MobData;

const secondaryCanvas = document.createElement("canvas"),
  sctx = secondaryCanvas.getContext("2d");

export default async function initialize() {
  try {
    //initializes web worker manager
    WebWorkers.initialize();
    
    //loads mobs
    for (let mob in MobTextures) {
      mob = MobTextures[mob];

      const { map } = mob;

      const xLength = map[0].length,
        yLength = map.length;

      secondaryCanvas.width = xLength * mobQuality;
      secondaryCanvas.height = yLength * mobQuality;

      for (let y = 0; y < yLength; y++) {
        const yMap = map[y];
        for (let x = 0; x < xLength; x++) {
          if (yMap[x] === null) {
            //null is transparent
            continue;
          }

          sctx.fillStyle = yMap[x];

          sctx.fillRect(
            mobQuality * x,
            mobQuality * y,
            mobQuality,
            mobQuality,
          );
        }
      }

      const dataURI = secondaryCanvas.toDataURL();

      await new Promise(resolve => {
        mob.image = new Image();
        mob.image.src = dataURI;
        mob.image.onload = resolve;
      });
    }
  } catch (error) {
    console.log("Initialization error: " + error);
  }
}