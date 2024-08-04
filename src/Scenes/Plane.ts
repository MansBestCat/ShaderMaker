import GUI from "lil-gui";
import { Mesh, PlaneGeometry } from "three";
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

        const mesh = new Mesh(new PlaneGeometry(20, 20, 20, 20), undefined);
        mesh.rotateX(Math.PI * 0.5);
        data.scene.add(mesh);

        data.camera.position.set(0, 10, -18);
        data.camera?.lookAt(0, 2, 0);


        this.shaderMat = new ShockWaveMaterial().clone();
        mesh.material = this.shaderMat;

        gui.add(this, "pulse");

        cameraManMain.makeCameraOrbital(mesh.position);
    }

    pulse() {
        this.shaderMat!.uniforms.time.value = 0.0; // only need to reset the time to 0, the material itself has a clock that it reads for et.
    }
}