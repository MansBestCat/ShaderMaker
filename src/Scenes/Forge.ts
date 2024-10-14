import GUI from "lil-gui";
import { BoxGeometry, Color, Mesh, MeshPhongMaterial, Object3D, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { ForgePrintMaterial } from "../Materials/ForgePrintMaterial";
import { Utility } from "../Utilities/Utility";


export class Forge {

    shaderMat?: ForgePrintMaterial;

    go(data: Data, cameraManMain: CameraManMain) {
        if (!data.camera) {
            throw new Error(`${Utility.timestamp()} Expected camera`);
        }

        const pointLight = new PointLight(new Color(0xffffff), 2.0);
        pointLight.position.set(0, 5, -3);
        data.scene.add(pointLight);

        const gui = new GUI();

        const ground = new Mesh(new BoxGeometry(10, 1, 10), new MeshPhongMaterial({ color: new Color(0xffffff) }));
        data.scene.add(ground);

        const geometryLeg = new BoxGeometry(0.5, 2.0, 0.5);
        const meshLeg = new Mesh(geometryLeg, undefined);
        const meshLeftLeg = meshLeg.clone();
        meshLeftLeg.position.x += 0.4;
        meshLeftLeg.rotateZ(Math.PI / 16);
        const meshRightLeg = meshLeg.clone();
        meshRightLeg.position.x -= 0.4;
        meshRightLeg.rotateZ(Math.PI / -16);
        const object = new Object3D();
        object.add(meshLeftLeg, meshRightLeg);
        object.position.y = 3;
        data.scene.add(object);

        data.camera.position.set(0, 7, -12);
        data.camera?.lookAt(0, 2, 0);

        this.shaderMat = new ForgePrintMaterial().clone();
        meshLeftLeg.material = this.shaderMat;
        meshRightLeg.material = this.shaderMat;

        cameraManMain.makeCameraOrbital(object.position);
    }

}