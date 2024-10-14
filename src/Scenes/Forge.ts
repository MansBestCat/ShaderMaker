import GUI from "lil-gui";
import { BoxGeometry, Color, DoubleSide, Mesh, MeshPhongMaterial, Object3D, PointLight, Vector3 } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { ForgePrintMaterial } from "../Materials/ForgePrintMaterial";
import { Utility } from "../Utilities/Utility";


export class Forge {

    SPEED = 0.02;  // per tick

    shaderMat?: ForgePrintMaterial;
    interval?: number;  // y
    interval2?: number; // cooling

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
        gui.addColor({ color: '#ffffff' }, 'color').onChange((_value: string) => {
            clearInterval(this.interval2);
            const color = new Color(_value);
            this.shaderMat!.uniforms.uColor.value.x = color.r;
            this.shaderMat!.uniforms.uColor.value.y = color.g;
            this.shaderMat!.uniforms.uColor.value.z = color.b;
        });
        gui.add(this, "print");
        gui.add(this, "cool");

        cameraManMain.makeCameraOrbital(object.position);
    }

    print() {
        clearInterval(this.interval);
        clearInterval(this.interval2);
        this.shaderMat!.uniforms.uY.value = 0.0;
        this.interval = setInterval(() => {
            this.shaderMat!.uniforms.uY.value += this.SPEED;
        }, 16.6);
    }

    cool() {
        clearInterval(this.interval2);
        let color = new Vector3();
        this.interval2 = setInterval(() => {
            color.copy(this.shaderMat!.uniforms.uColor.value);
            color.multiplyScalar(0.5);
            this.shaderMat!.uniforms.uColor.value.x = color.x;
            this.shaderMat!.uniforms.uColor.value.y = color.y;
            this.shaderMat!.uniforms.uColor.value.z = color.z;
        }, 16.6);
    }
}