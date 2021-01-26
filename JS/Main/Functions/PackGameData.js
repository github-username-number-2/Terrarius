import {
  Player,
  World,
  Environment,
  WorldEffects,
  UI,
  Game,
  Input,
} from "/JS/Main/GameObjects/GameObjects.js";

import CryptoJS from "/JS/Libraries/Crypto.js";
import FileData from "/JS/Main/Data/FileData.js";

function packGameData() {
  return new Promise(resolve => {
    let gameData = {
      Game: {},
      Player: {},
      World: {},
      Environment: {},
    };

    //

    gameData.Game.saveNumber = Game.saveNumber + 1;

    gameData.Player.skin = Player.skin;
    gameData.Player.inventory = Player.inventory;

    gameData.World.map = World.map;
    gameData.World.chunkDataMap = World.chunkDataMap;

    gameData.Environment.spawnedMobs = Environment.spawnedMobs;

    //

    //const Worker = new Worker("/JS/Main/WebWorkers/PackGameData.js");

    let startTime = perf();
    gameData = JSON.stringify(gameData);
    logPerformance("Stringify Game Data", startTime);

    startTime = perf();
    gameData = CryptoJS.AES.encrypt(gameData, FileData.Ȩ̵̧̨̡̨̨̡̨̨̛̥͇͈̜̞̣̥̘͖̗̹̰̜̱̖̪͖̟͖̬̤͙̝̼̠͔̼̖̻̹̘̭̮̤͔͙͍̟̟͍̼͙͙̖͍̳̪͇̦͈͈̙͚̳̹͙̻̟͍̖̹̼̻̱̙̱͔͙͉̤̤̳͉̺͖̻͙͔̹̭̠̥͓̜̣̱̭̫̜̮̻̙͉̻̬͇̫̦͎̖̙̼̫̣̳͍̘̀͛͛́̅́͂̔̀̽̿͊̈́̓͛̎̎̄̏͌͆̏̅̀͗̀͂̚͜͜͝ͅͅͅͅE̸̢̛͚̞͙̙̱̙͓̲̺͎̻̲͎̟͔͇̦̮͉̣̻͇͂͗̔͐̈́̅̍̀͒̀͋̄̉͌̌̅̓̔̉̋̋̏̾̒́̉̎̄̄̕͘͝͠͝ͅẸ̶̢̡̢̧̨̱̙̟̳̝̣̹̣̪̮̣̱̯͙͕̭̼̦̟̝͇̞̮̦͙̻̤̣̻͕̞͉̣̪̪̬͓̠̰̪̪̦̲̲̟̱͉͉̩͓͍͕̲͔̭͚̟̼̙̬̬̳͚̮̭̤͓̟͖̮̗͈͍̜̝̗͎̤͓̱̟̭͖͉͔̩̹͇̪͇̎͆̐̄̄͜ͅͅḜ̵̛̼̤͓͔̙̰̫̩̖̫̗̳̱̩̈́̌̎̓͐̂͐̾̀̔̈͛́̈́̓̃̈́̾̀͑̇̓͌̌̈́̃̈́͊̈́̎͒͂͊̀̿̒̆̉̐̈́̔̕͘̕̚͝͠͝͝Ě̸̡̢̨̛̛̛̜̲̤̟̠̜̻̞̘̲̥̠̞̭̖̬͉͉̻̪̬̞͖͎͈̯̪̝̻̖̙̹̭̰̪̥̣̰̞̪̙̝̦̟̭̲̥͙̤̘̼̺͍͈̲͕͇̗̻͈͖͇͚̀̔̌̔̈́̋̿̃̀̐̆̍͊͐͋̂̓́̃̇͒̿̽̏̾̀͂͛͌̃̀̋͋͗̀̉̊̒͆̀̔̈́̓̊͒̀̄͌̑́͆̓̃̇́̀͊̓͌̂̑̃̏̊̓͛̄̓̓̒̂̄̾̿̀̑͑͛̉͆͛̋̉̍̌̌͗́̀̔͗̓̃̋̏̈́̈̈́͊̈́̿͗̇́͊̂̏̍͋̊̆̈́̀̀̀̈́͆̇͂͐̐̒̒͘̕͘̚͘͘̕̕̕̚͜͝͝͠͠͝͠͝ͅȨ̵̢̢̢̨̛̭̤̟̗̠̣̲̗͎̱̳̯̺̪͈̙͙̝̱̹͈̩̫̲͔̳͎͍̺̭͉̞̫̼͉̙̬̝͉͓̲̲̫͉͈͈͉̠̳̠̩̏̀̃̾̅̀͋̅͆̑̈́̈́̔͗͑̎̈͒̽̆͂̏̅͛̄͐́̈́̅͘͝͠͝͝ͅĘ̶̧̡͕͎̘̪͍̟̯͖̣̘̞̘̪̜̰̬̤̤͎͎͖̫̟̤̪͍̠̖̪̼̲͓͙͇̲̞͇̰̤͙͉͍̱̘̝͍̥̬̹͊̃͜͜͜E̸̡̧̡̨̧̧̧̧̢̧̛̛̛̛̲͍̝̼͔̝͇͕̳̳͉̯͕̙̻̹͓̬͔̫͇̻͈̗̳͔̻͍̩̮̼̯͎̙̯̙͙̝͙̰͇̯̗̺̝̥͈͉̖̖͉͔̞̘̤̱̪̪̝̰̣̯̟̟̝͎͓̝̞̳̱̤̮̲͕̜̰͌͑̏̐̉̑̈́̓̋͑͑̓̇͑̈̋̆͌͌̎̄̈́͗́̋̎̀̋̀͌͂̓͋̀̒̋̑̈́̇̂͗̍̈́̿̾̌̈̓̃̌̊͑͋̊̂̽̃̍̄̌͗̆̓̅́͐͂̃͂͗̐̎̿̄̿̍̽̐̌̅̈́̌̓̒͛̍̆̓̈́̂̓͛̏͗̏́̇̈́͊̊̾̅̓̃̓̒̂͌͆͐͐̌̈̿̅͐̎̏͘̚̕̚͘̕͘̕͘̕͜͝͝͝͠͠͠͠͝͠͠͝͝͠͝͠͝͝ͅͅͅͅĘ̸̡̢̡̨̢̡̡̡̨̢̧̨̺͈̞͈̺͇̹̙̙̗̹̞̺̼̼͕̱̺̹̩͉̩̩̗̞̭̜͔͇̠̫̤̭̻̝͕̳̭̠̹̬̱̝̭̝̭̹̝̗̦̟̭̳͕̤͚̻̮͔̗̜͚̯̼͚̯̪̣̠͓̺͖̻̤͖̣̫̥̗͉͚͍͈̳̯͎̦͚̹͖̰͉̺͕͚͈̬̟͎̪͚͖͍̜͇͖͖͕̼͕̯͙͎̹̈́̈̽̊̏̾̉́́̂̒͒̏̅̽͑̓̔̈̔̉̈͑̂̒̅̕̚̕͘͜͜͜͜ͅͅͅͅͅͅ);
    gameData = gameData.toString();
    logPerformance("Encrypt Game Data", startTime);

    console.log("File Save Length: " + gameData.length);

    resolve(gameData);
  });
}

export default packGameData;