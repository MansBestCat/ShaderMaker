
import { CameraManMain } from "./Camera/CameraManMain";
import { Data } from "./Data";
import { GameEngine } from "./GameEngine";

// MAIN 
console.clear();

window.addEventListener("DOMContentLoaded", async () => {


    const canvas = document.getElementById("elementDungeon") as HTMLCanvasElement;
    const data = new Data(canvas)
    const cameraManMain = new CameraManMain(data);
    const gameEngine = new GameEngine(data, canvas, cameraManMain);

    gameEngine.init();

});

