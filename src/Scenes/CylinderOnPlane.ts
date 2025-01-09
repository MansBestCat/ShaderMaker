import GUI from "lil-gui";
import { BoxGeometry, Color, CylinderGeometry, Mesh, MeshBasicMaterial, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { CylinderRingsMaterial } from "../Materials/CylinderRingsMaterial";
import { Utility } from "../Utilities/Utility";

/** Runs on a timer */
export class CylinderOnPlane {

    go(data: Data, cameraManMain: CameraManMain) {
        if (!data.camera) {
            throw new Error(`${Utility.timestamp()} Expected camera`);
        }

        const pointLight = new PointLight(new Color(0xffffff), 2.0);
        pointLight.position.set(0, 5, -3);
        data.scene.add(pointLight);

        const gui = new GUI();
        gui.domElement.onpointermove = (event: PointerEvent) => {
            event.stopPropagation();
        };

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

        const shaderMat = new CylinderRingsMaterial().clone();
        gui.add(shaderMat.uniforms.uUvYOffset, "value", 0, 3, 0.1).name("uUvYOffset");
        gui.add(shaderMat.uniforms.uXTFactor, "value", 0, 10, 0.1).name("uXTFactor");
        gui.add(shaderMat.uniforms.uXTOffset, "value", 0, 10, 0.1).name("uXTOffset");

        const plainMat = new MeshBasicMaterial({ color: new Color(0x0000ff) });
        const mats = [shaderMat, plainMat, plainMat];
        mesh.material = mats;

        gui.add(shaderMat.clock, "start").name("reset clock");

        cameraManMain.makeCameraOrbital(mesh.position);
    }
}