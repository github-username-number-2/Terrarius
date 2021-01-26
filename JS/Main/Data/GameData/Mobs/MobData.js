import MobTextures from "./MobTextures.js";
import AIData from "./AIData.js";

import Mob from "/JS/Main/Classes/Mob.js";

export default {
  //canvas width/height per pixel
  mobQuality: 16,

  mobs: {
    test: class extends Mob {
      image = MobTextures.test.image;

      //width to draw mob to screen
      //in blocks
      width = 3;
      height = 3;

      //in blocks
      hitbox = [0, 0, 3, 3];

      collisions = defCollisionMechanics;

      AI = AIData.follow;
    },
    abramsTank: class extends Mob {
      image = MobTextures.abramsTank.image;

      width = 36;
      height = 14;

      hitbox = [0, 0, 36, 14];

      collisions = defCollisionMechanics;

      AI = AIData.follow;
    },
  },
};

const defCollisionMechanics = {
  blocks: true,
  mapEdge: false,
};