
import { CameraManMain } from "./Camera/CameraManMain";
import { Data } from "./Data";
import { GameEngine } from "./GameEngine";
import { TubePulseOnPlane } from "./Scenes/TubePulseOnPlane";

// MAIN 
console.clear();

window.addEventListener("DOMContentLoaded", async () => {

    const canvas = document.getElementById("elementDungeon") as HTMLCanvasElement;
    const data = new Data(canvas)
    const cameraManMain = new CameraManMain(data);

    const gameEngine = new GameEngine(data, canvas, cameraManMain);
    gameEngine.init();

    //new CylinderOnPlane().go(data, cameraManMain);
    //new CylinderOnPlane2().go(data, cameraManMain);
    //new PlaneShockWave().go(data, cameraManMain);
    //new PlaneShockWavePulse().go(data, cameraManMain);
    new TubePulseOnPlane().go(data, cameraManMain);

});

