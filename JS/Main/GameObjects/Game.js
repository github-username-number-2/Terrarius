import {
  Player,
  World,
  Environment,
  WorldEffects,
  UI,
  Renderer,
} from "./GameObjects.js";

import FileData from "/JS/Main/Data/FileData.js";

import packGameData from "/JS/Main/Functions/PackGameData.js";
import unpackFile from "/JS/Main/Functions/UnpackFile.js";

import initialize from "/JS/Main/Functions/Initialize.js";


const Game = {
  saveNumber: 0,

  //values: menu or inGame
  currentState: "menu",

  async initialize() {
    await initialize();
  },

  start() {
    //
  },

  async startNew() {
    let startTime = perf();
    await World.generateMap("tiny", null, "seed", (a, b) => console.log(a, b));
    logPerformance("Generate World", startTime);

    startTime = perf();
    //await
    World.loadInitialChunkImageMap(
      (a, b) => console.log(a + ":" + b)
    )
      //temp
      .then(() => {
        logPerformance("Load Chunk Image Map", startTime);
        console.log("Chunk Image Map Loaded");
      });
    //temp
    //logPerformance("Load Chunk Image Map", startTime);
    //console.log("Chunk Image Map Loaded");

    startTime = perf();
    await Environment.loadMinimap();
    logPerformance("Load Minimap", startTime);

    this.currentState = "inGame";
    Renderer.start();
    Input.controlsLocked = false;
  },

  async saveGame() {
    const saveContents = await packGameData();

    const file = new Blob([saveContents], { type: FileData.mimeType });
    const anchor = document.createElement("a");

    anchor.href = URL.createObjectURL(file);
    anchor.download = FileData.defaultFileName;

    document.head.appendChild(anchor);
    anchor.click();
    setTimeout(() => {
      document.head.removeChild(anchor);
      URL.revokeObjectURL(file);
    }, 0);
  },

  loadSave() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = FileData.mimeType;

    input.onchange = event => {
      const file = event.target.files[0];
      const reader = new FileReader();

      reader.onload = readerEvent => {
        unpackFile(readerEvent.target.result);
      };
      reader.readAsText(file, FileData.encoding);
    };

    input.click();
  },
};

export default Game;