const Mob = class {
  constructor(x, y) {
    this.offsetX = x;
    this.offsetY = y;
    this.xVelocity = 0;
    this.yVelocity = 0;
  }

  //used for AI functions
  AIData = {};
};

export default Mob;