import Player from "./Player.js";
import World from "./World.js";
import Environment from "./Environment.js";
import WorldEffects from "./WorldEffects.js";
import UI from "./UI.js";
import Input from "./Input.js";
import Game from "./Game.js";
import Renderer from "./Renderer.js";
//t

const exports = { Player, World, Environment, WorldEffects, UI, Input, Game, Renderer };

for (const object in exports) {
  window[object] = exports[object];
}
//t

export { Player, World, Environment, WorldEffects, UI, Input, Game, Renderer };