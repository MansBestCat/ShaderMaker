import GUI from "lil-gui";
import { Color, Mesh, PlaneGeometry } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { ShockWaveMaterial } from "../Materials/ShockWaveMaterial";
import { Utility } from "../Utilities/Utility";

/** For developing a shock wave shader */
export class Plane {

    shaderMat?: ShockWaveMaterial;
    interval?: number;
    reductionFactor = 0.7;

    go(data: Data, cameraManMain: CameraManMain) {
        if (!data.camera) {
            throw new Error(`${Utility.timestamp()} Expected camera`);
        }

        const gui = new GUI();

        const mesh = new Mesh(new PlaneGeometry(10, 10), undefined);
        mesh.rotateX(Math.PI * 0.5);
        data.scene.add(mesh);

        data.camera.position.set(0, 7, -12);
        data.camera?.lookAt(0, 2, 0);

        const params = {
            color: '#aa00ff'
        };

        this.shaderMat = new ShockWaveMaterial().clone();
        gui.add(this.shaderMat.uniforms.uHalfStripeWidth, "value", 0.0, 1.0, 0.01).name("half stripe width");
        gui.add(this.shaderMat.uniforms.uIntensityScalar, "value", 0.5, 5.0, 0.01).name("intensity multiplier");
        gui.add(this, "reductionFactor", 0.0, 1.0, 0.01).name("reduction factor");
        gui.addColor(params, 'color').onChange((_value: string) => {
            this.shaderMat!.uniforms.uColor.value = new Color(_value);
        });
        mesh.material = this.shaderMat;

        gui.add(this, "pulse");

        cameraManMain.makeCameraOrbital(mesh.position);
    }

    pulse() {
        clearInterval(this.interval);
        this.shaderMat!.uniforms.uUvY.value = 1.0;
        this.interval = setInterval(() => {
            this.shaderMat!.uniforms.uUvY.value *= this.reductionFactor;
        }, 16.6);
    }
}