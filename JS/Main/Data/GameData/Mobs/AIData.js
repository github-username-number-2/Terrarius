/*
this keyword is the mob object

if velocities are greater than 1 or less than -1, mobs will pass through blocks
*/

export default {
  follow: function (playerX, playerY) {
    let velX = playerX - this.offsetX;

    velX = velX > 0.5 ? 0.5 : velX;
    velX = velX < -0.5 ? -0.5 : velX;
    
    return [velX, 0];
  },
};