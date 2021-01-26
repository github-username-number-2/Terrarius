export default {
  controls: {
    up: ["KeyW", "ArrowUp"],
    down: ["KeyS", "ArrowDown"],
    left: ["KeyA", "ArrowLeft"],
    right: ["KeyD", "ArrowRight"],

    //hotbar 1-9
    hotbar: [
      ["Digit1"],
      ["Digit2"],
      ["Digit3"],
      ["Digit4"],
      ["Digit5"],
      ["Digit6"],
      ["Digit7"],
      ["Digit8"],
      ["Digit9"],
    ],

    displayStats: ["Tab"],
  },

  movementSpeed: 1,
  //movementSpeed will be divided by this
  movementLimiter: 200,

  spectatorSpeed: 1,

  jumpHeight: 1,
  jumpLimiter: 1.5,

  width: 2,
  height: 3,

  //x, y, width, height
  hitbox: [0, 0, 2, 3],
};