
import { BoxGeometry, Color, CylinderGeometry, Mesh, MeshBasicMaterial } from "three";
import { CameraManMain } from "./Camera/CameraManMain";
import { Data } from "./Data";
import { GameEngine } from "./GameEngine";
import { CylinderRingsMaterial } from "./Materials/CylinderRingsMaterial";
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

    // cyliner outer
    const height = 3.0;
    const mesh = new Mesh(new CylinderGeometry(1, 1, height), undefined);
    mesh.position.y = 3;
    data.scene.add(mesh);

    // small box inner
    const mesh2 = new Mesh(new BoxGeometry(3, 1, 1), new MeshBasicMaterial({ color: new Color(0x00ff00) }));
    mesh2.position.y = 3;
    data.scene.add(mesh2);

    data.camera.position.set(0, 7, -12);
    data.camera?.lookAt(0, 2, 0);

    const shaderMat = new CylinderRingsMaterial().clone();
    const plainMat = new MeshBasicMaterial({ color: new Color(0x0000ff) });
    const mats = [shaderMat, plainMat, plainMat];
    mesh.material = mats;

    cameraManMain.makeCameraOrbital(mesh.position);
});

