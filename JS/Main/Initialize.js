import CanvasData from "./Data/CanvasData.js";
import ProgramData from "./Data/ProgramData.js";
import StartUpData from "./Data/StartUpData.js";
import CursorData from "./Data/CursorData.js";

import loadImage from "./Functions/LoadImage.js";

/*
//registers service workers
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    console.log('Service worker registration succeeded:', registration);
  }, function(error) {
    console.log('Service worker registration failed:', error);
  });
} else {
  console.log('Service workers are not supported.');
}
*/

window.canvas = document.getElementById("canvas");
window.ctx = canvas.getContext("2d", { alpha: false });

//doesn't seem to speed up performance too much
//ctx.imageSmoothingEnabled = false;

canvas.width = CanvasData.width * CanvasData.scale;
canvas.height = CanvasData.height * CanvasData.scale;

window.defaultRandom = Math.random;
import("/JS/Libraries/SeedRandom.js");

window.getRandomInt = function (min, max) {
  return Math.floor(defaultRandom() * (max - min + 1)) + min;
};
window.getSeededInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function resizeCanvas() {
  switch (CanvasData.fit) {
    case "horizontal":
      canvas.style.width = "100vw";
      canvas.style.height = 100 / CanvasData.width * CanvasData.height + "vw";
      if (CanvasData.align === "center") {
        //px is supposed to be there
        canvas.style.top = (innerHeight - canvas.offsetHeight) / 2 + "px";
      }
      break;
    case "vertical":
      canvas.style.width = 100 / CanvasData.height * CanvasData.width + "vh";
      canvas.style.height = "100vh";
      if (CanvasData.align === "center") {
        //px is supposed to be there
        canvas.style.left = (innerWidth - canvas.offsetWidth) / 2 + "px";
      }
      break;
    case "stretch":
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      canvas.style.left = "0px";
      canvas.style.top = "0px";
      break;
    case "autoFill":
      break;
    case "autoFit":
      break;
  }
}
resizeCanvas();

addEventListener("resize", resizeCanvas);

document.title = ProgramData.DOCUMENT_TITLE;

//disables right click
canvas.addEventListener("contextmenu", event => event.preventDefault());

//allows canvas to gain focus
canvas.tabIndex = 0;

window.Timer = function (time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};

const loggedMessages = [];
window.logOnce = function (message) {
  !loggedMessages.includes(message) && loggedMessages.push(message) && console.log(message);
};

const performanceLogs = {},
  runLogs = {},
  performanceLogsL50 = {};

window.perf = () => performance.now();
window.logPerformance = (name, speed) => {
  speed = perf() - speed;

  performanceLogs[name] = speed;

  performanceLogsL50[name] = performanceLogsL50[name] || [];

  if (performanceLogsL50[name].length >= 50) {
    performanceLogsL50[name].shift();
  }

  performanceLogsL50[name].push(speed);
};
window.getPerformanceLogs = () => {
  let logs = "Performance Last Run:\n";
  for (const log in performanceLogs) {
    logs += `  ${log}: ${_.round(performanceLogs[log], 4)}\n`;
  }
  logs += "Average Performance Last 50 Runs:\n";
  for (const log in performanceLogsL50) {
    const perfLog = performanceLogsL50[log];
    logs += `  ${log}: ${_.round(perfLog.reduce((a, b) => a + b) / perfLog.length, 4)}\n`;
  }
  return logs;
};

ctx.fillRect(0, 0, canvas.width, canvas.height);


addEventListener("load", async () => {
  const module = await import("./GameObjects/GameObjects.js").catch(error => {
    console.log(`start-up syntax error: ${error} on line ${error.lineNumber} in file ${error.fileName}`);
    console.log("Error object accessible through global variable with name 'error'");
    window.error = error;
  });

  await module.Game.initialize();


  /*const gameObjects = [
    "Player",
    "World",
    "Environment",
    "WorldEffects",
    "UI",
    "Input",
    "Game",
    "Renderer",
  ];

  gameObjects.forEach(objectName => {
    import("./GameObjects/" + objectName + ".js").catch(error => {
      console.log(`File GameObjects/${objectName}.js is malfunctioning with error: ${error}`);console.log(error)
    });
  });*/

  /*canvas.style.cursor = "none";

  for (const icon of StartUpData.icons) {
    icon.imageSrc = await loadImage(icon.imageSrc);
  }

  await(Timer(1000));

  for (const icon of StartUpData.icons) {
    let storedAlpha = 0;
    let fadeInterval = setInterval(() => {
      ctx.globalAlpha = 1;

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      storedAlpha = _.round(storedAlpha + 0.02, 4);
      ctx.globalAlpha = storedAlpha <= 1 ? storedAlpha : 1;

      ctx.drawImage(
        icon.imageSrc,
        (canvas.width - icon.width) / 2,
        (canvas.height - icon.height) / 2,
        icon.width,
        icon.height,
      );
    }, 20);

    await Timer(StartUpData.iconChangeInterval);

    clearInterval(fadeInterval);

    fadeInterval = setInterval(() => {
      ctx.globalAlpha = 1;

      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      storedAlpha = _.round(storedAlpha - 0.02, 4);
      ctx.globalAlpha = storedAlpha >= 0 ? storedAlpha : 0;

      ctx.drawImage(
        icon.imageSrc,
        (canvas.width - icon.width) / 2,
        (canvas.height - icon.height) / 2,
        icon.width,
        icon.height,
      );
    }, 20);

    await Timer(3000);

    clearInterval(fadeInterval);
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 1;*/

  canvas.style.cursor = `url(${CursorData.normal}), auto`
  canvas.addEventListener("mouseup", () =>
    canvas.style.cursor = `url(${CursorData.normal}), auto`
  );
  canvas.addEventListener("mousedown", () =>
    canvas.style.cursor = `url(${CursorData.click}), auto`
  );

  import("./Main.js");
});