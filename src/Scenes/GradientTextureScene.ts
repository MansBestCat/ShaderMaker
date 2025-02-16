import GUI from "lil-gui";
import { BoxGeometry, Color, Mesh, MeshPhongMaterial, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { GradientTextureMaterial } from "../Materials/GradientTextureMaterial";
import { Utility } from "../Utilities/Utility";

/** Runs under manual control, has a color picker */
export class GradientTextureScene {
    SPEED = 0.1;  // per tick
    TUBE_LENGTH = 8.0;
    TUBE_WIDTH = 0.03;

    shaderMat?: GradientTextureMaterial;
    interval?: number;

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

        const ground = new Mesh(new BoxGeometry(10, 1, 10), new MeshPhongMaterial({ color: new Color(0xffffff) }));
        data.scene.add(ground);

        // tube
        const mesh = new Mesh(new BoxGeometry(this.TUBE_WIDTH, this.TUBE_LENGTH, this.TUBE_WIDTH), undefined);
        mesh.position.y = this.TUBE_LENGTH * 0.5;
        data.scene.add(mesh);

        data.camera.position.set(0, 3, -12);
        data.camera?.lookAt(0, 3, 0);

        this.shaderMat = new GradientTextureMaterial().clone();
        this.shaderMat.uniforms.uTubeLength.value = this.TUBE_LENGTH;

        gui.add(this.shaderMat.uniforms.uBoltLength, "value", 0.0, 4.0, 0.1).name("bolt length");
        gui.add(this.shaderMat.uniforms.uHeadLength, "value", 0.0, 4.0, 0.1).name("head length");
        gui.add(this, "SPEED", 0.01, 0.07, 0.01).name("distance per tick");
        const params = {
            color: '#c34dfe'
        };
        gui.addColor(params, 'color').onChange((_value: string) => {
            this.shaderMat!.uniforms.uColor.value = new Color(_value);
        });
        gui.add(this.shaderMat.uniforms.uIntensityScalar, "value", 0.5, 5.0, 0.01).name("intensity multiplier");


        mesh.material = this.shaderMat;

        gui.add(this, "pulse");

        cameraManMain.makeCameraOrbital(mesh.position);
    }

    pulse() {
        clearInterval(this.interval);
        this.shaderMat!.uniforms.uDistance.value = 0.0;
        this.interval = setInterval(() => {
            this.shaderMat!.uniforms.uDistance.value += this.SPEED;
        }, 16.6);
    }
}