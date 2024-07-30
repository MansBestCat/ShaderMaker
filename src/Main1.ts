
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
    data.scene.add(ground);

    const mesh = new Mesh(new BoxGeometry(2, 2, 2), new MeshBasicMaterial({ color: new Color(0x0000ff) }));
    mesh.position.y = 2;
    data.scene.add(mesh);

    data.camera.position.set(0, 7, -12);
    data.camera?.lookAt(0, 2, 0);
});

