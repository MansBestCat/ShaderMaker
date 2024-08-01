import GUI from "lil-gui";
import { BoxGeometry, Color, CylinderGeometry, Mesh, MeshBasicMaterial } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { CylinderRingsMaterialTimedPulses } from "../Materials/CylinderRingsMaterialTimedPulses";
import { Utility } from "../Utilities/Utility";

export class CylinderOnPlane2 {

    shaderMat?: CylinderRingsMaterialTimedPulses;
    interval?: number;
    go(data: Data, cameraManMain: CameraManMain) {
        if (!data.camera) {
            throw new Error(`${Utility.timestamp()} Expected camera`);
        }

        const gui = new GUI();

        const ground = new Mesh(new BoxGeometry(10, 1, 10), new MeshBasicMaterial({ color: new Color(0xffffff) }));
        data.scene.add(ground);

        // cylinder outer
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

        this.shaderMat = new CylinderRingsMaterialTimedPulses().clone();
        gui.add(this.shaderMat.uniforms.uHalfStripeWidth, "value", 0.0, 1.0, 0.01).name("uStripeWidthFactor");

        const plainMat = new MeshBasicMaterial({ color: new Color(0x0000ff) });
        const mats = [this.shaderMat, plainMat, plainMat];
        mesh.material = mats;

        gui.add(this, "pulse");

        cameraManMain.makeCameraOrbital(mesh.position);
    }

    pulse() {
        clearInterval(this.interval);
        this.shaderMat!.uniforms.uUvY.value = 1.0;
        this.interval = setInterval(() => {
            this.shaderMat!.uniforms.uUvY.value *= 0.7;
        }, 16.6);
    }
}