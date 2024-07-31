
import { BoxGeometry, Color, CylinderGeometry, Mesh, MeshBasicMaterial, NormalBlending, ShaderMaterial } from "three";
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

    // cyliner outer
    const mesh = new Mesh(new CylinderGeometry(1, 1, 3), undefined);
    mesh.position.y = 3;
    data.scene.add(mesh);

    // small box inner
    const mesh2 = new Mesh(new BoxGeometry(3, 1, 1), new MeshBasicMaterial({ color: new Color(0x00ff00) }));
    mesh2.position.y = 3;
    data.scene.add(mesh2);

    data.camera.position.set(0, 7, -12);
    data.camera?.lookAt(0, 2, 0);

    const vshader = `
        varying vec3 vUv; 

        void main() {
            vUv = position;      
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `

    const fshader = `
        varying vec3 vUv; 
        void main() {
            float r = sin(vUv.y*15.0)*0.5+0.5;
            gl_FragColor = vec4(r,0.0,0.0,r);
        }
    `
    const shaderMat = new ShaderMaterial({
        vertexShader: vshader,
        fragmentShader: fshader,
        transparent: true,
        blending: NormalBlending
    });
    const plainMat = new MeshBasicMaterial({ color: new Color(0x0000ff) });
    const mats = [shaderMat, plainMat, plainMat];
    mesh.material = mats;

    cameraManMain.makeCameraOrbital(mesh.position);
});

