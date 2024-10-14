import GUI from "lil-gui";
import { BoxGeometry, Color, DoubleSide, Mesh, MeshPhongMaterial, Object3D, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { ForgePrintMaterial } from "../Materials/ForgePrintMaterial";
import { Utility } from "../Utilities/Utility";


export class Forge {

    SPEED = 0.02;  // per tick

    shaderMat?: ForgePrintMaterial;
    interval?: number;

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
        meshLeftLeg.position.set(0.4, 1.5, 0.0);
        meshLeftLeg.rotateZ(Math.PI / 16);
        const meshRightLeg = meshLeg.clone();
        meshRightLeg.position.set(-0.4, 1.5, 0.0);
        meshRightLeg.rotateZ(Math.PI / -16);
        const object = new Object3D();
        object.add(meshLeftLeg, meshRightLeg);
        data.scene.add(object);

        data.camera.position.set(0, 5, -5);
        data.camera?.lookAt(0.0, 1.0, 0.0);

        this.shaderMat = new ForgePrintMaterial().clone();
        this.shaderMat.side = DoubleSide;
        meshLeftLeg.material = this.shaderMat;
        meshRightLeg.material = this.shaderMat;

        gui.add(this, "SPEED", 0.005, 0.03, 0.001).name("distance per tick");
        gui.add(this, "print");

        cameraManMain.makeCameraOrbital(object.position);
    }

    print() {
        clearInterval(this.interval);
        this.shaderMat!.uniforms.uY.value = 0.0;
        this.interval = setInterval(() => {
            this.shaderMat!.uniforms.uY.value += this.SPEED;
        }, 16.6);
    }
}