
import { BoxGeometry, Color, Mesh, MeshBasicMaterial } from "three";
import { CameraManMain } from "./Camera/CameraManMain";
import { Data } from "./Data";
import { GameEngine } from "./GameEngine";
import { Utility } from "./Utilities/Utility";

// MAIN 
console.clear();

window.addEventListener("DOMContentLoaded", async () => {

    const canvas = document.getElementById("elementDungeon") as HTMLCanvasElement;
    const data = new Data(canvas)
    const cameraManMain = new CameraManMain(data);
    const gameEngine = new GameEngine(data, canvas, cameraManMain);

    gameEngine.init();

    if (!data.camera) {
        throw new Error(`${Utility.timestamp()} Expected camera`);
    }
    const ground = new Mesh(new BoxGeometry(10, 1, 10), new MeshBasicMaterial({ color: new Color(0xffffff) }));
    ground.position.z = 10;
    data.scene.add(ground);

    data.camera.position.set(0, 5, 0);
    data.camera?.lookAt(0, 0, 10);
});

