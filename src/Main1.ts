
import { CameraManMain } from "./Camera/CameraManMain";
import { Data } from "./Data";
import { GameEngine } from "./GameEngine";
import { FogExpOverride } from "./Materials/FogExpOverride";
import { AttackLine } from "./Scenes/AttackLine";
import { CylinderOnPlane } from "./Scenes/CylinderOnPlane";
import { CylinderOnPlane2 } from "./Scenes/CylinderOnPlane2";
import { DropZone } from "./Scenes/DropZone";
import { Flipbook } from "./Scenes/Flipbook";
import { Fog } from "./Scenes/Fog";
import { Forge } from "./Scenes/Forge";
import { GradientTexture } from "./Scenes/GradientTexture";
import { MeshBlendStacker } from "./Scenes/MeshBlendStacker";
import { PlaneShockWave } from "./Scenes/PlaneShockWave";
import { PlaneShockWavePulse } from "./Scenes/PlaneShockWavePulse";
import { PressureWave } from "./Scenes/PressureWave";
import { Screenshot } from "./Scenes/Screenshot";
import { SmokePlume } from "./Scenes/SmokePlume";
import { TravelingPathSegments } from "./Scenes/TravelingPathSegments";
import { TubePulseOnPlane } from "./Scenes/TubePulseOnPlane";

// MAIN 
console.clear();

window.addEventListener("DOMContentLoaded", async () => {

    const canvas = document.getElementById("elementDungeon") as HTMLCanvasElement;
    const data = new Data(canvas)
    const cameraManMain = new CameraManMain(data);

    const gameEngine = new GameEngine(data, canvas, cameraManMain);
    gameEngine.init();

    switch (window.location.hash.substring(1)) {
        case "CylinderOnPlane":
            new CylinderOnPlane().go(data, cameraManMain);
            break;
        case "CylinderOnPlane2":
            new CylinderOnPlane2().go(data, cameraManMain);
            break;
        case "DropZone":
            new DropZone().go(data, cameraManMain);
            break;
        case "Forge":
            new Forge().go(data, cameraManMain);
            break;
        case "PlaneShockWave":
            new PlaneShockWave().go(data, cameraManMain);
            break;
        case "PlaneShockWavePulse":
            new PlaneShockWavePulse().go(data, cameraManMain);
            break;
        case "TubePulseOnPlane":
            new TubePulseOnPlane().go(data, cameraManMain);
            break;
        case "Fog":
            const fog = new Fog();
            const fogExpOverride = new FogExpOverride();
            fog.go(data, cameraManMain, fogExpOverride);
            break;
        case "GradientTexture":
            new GradientTexture().go(data, cameraManMain);
            break;
        case "TravelingPathSegments":
            new TravelingPathSegments().go(data, cameraManMain);
            break;
        case "SmokePlume":
            new SmokePlume().go(data, cameraManMain);
            break;
        case "Flipbook":
            new Flipbook().go(data, cameraManMain);
            break;
        case "AttackLine":
            new AttackLine().go(data, cameraManMain);
            break;
        case "MeshBlendStacker":
            new MeshBlendStacker().go(data, cameraManMain);
            break;
        case "PressureWave":
            new PressureWave().go(data, cameraManMain);
            break;

        case "Screenshot":
            new Screenshot(data).go(cameraManMain);
            break;
    }

});

