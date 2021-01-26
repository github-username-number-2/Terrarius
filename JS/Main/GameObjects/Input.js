canvas.addEventListener("mouseleave", event =>
  Input.mousePositionX = Input.mousePositionY = null
);

canvas.addEventListener("mousemove", event => {
  Input.mousePositionX = event.offsetX;
  Input.mousePositionY = event.offsetY;
});

canvas.addEventListener("keydown", event => {
  event.preventDefault();
  Input.activeInputs[event.code] = true;
});
canvas.addEventListener("keyup", event =>
  Input.activeInputs[event.code] = false
);

canvas.addEventListener("mousedown", event =>
  //event.button returns 0 on left click, 1 on middle click, and 2 on right click    
  Input.activeInputs[["LeftMouse", "MiddleMouse", "RightMouse"][event.button]] = true
);

canvas.addEventListener("mouseup", event =>
  Input.activeInputs["LeftMouse"] = Input.activeInputs["MiddleMouse"] = Input.activeInputs["RightMouse"] = false
);

const Input = {
  mousePositionX: null,
  mousePositionY: null,

  controlsLocked: true,

  activeInputs: {},

  //checks if input type is currently active
  active(inputName) {
    return this.controlsLocked
      ? false
      : Boolean(this.activeInputs[inputName]);
  },

  addClickBox(x, y, width, height, func, name) {
    //
  },
};

export default Input;