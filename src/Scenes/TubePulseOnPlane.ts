import GUI from "lil-gui";
import { BoxGeometry, Color, Mesh, MeshPhongMaterial, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { TubePulseMaterial } from "../Materials/TubePulseMaterial";
import { Utility } from "../Utilities/Utility";

/** Runs under manual control, has a color picker */
export class TubePulseOnPlane {
    SPEED = 0.1;  // per tick

    shaderMat?: TubePulseMaterial;
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

        // tube
        const mesh = new Mesh(new BoxGeometry(0.1, 10.0, 0.1), undefined);
        mesh.position.y = 3;
        data.scene.add(mesh);

        data.camera.position.set(0, 3, -12);
        data.camera?.lookAt(0, 3, 0);

        this.shaderMat = new TubePulseMaterial().clone();
        //mesh.scale.setY(intersection[idxStop].distance / 10.0);

        // gui.add(this.shaderMat.uniforms.uHalfStripeWidth, "value", 0.0, 1.0, 0.01).name("half stripe width");
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
        // TODO: Define shaderMat.uDistance and increment that from the caller        
        clearInterval(this.interval);
        this.shaderMat!.uniforms.uDistance.value = 0.0;
        this.interval = setInterval(() => {
            this.shaderMat!.uniforms.uDistance.value += this.SPEED;
        }, 16.6);
    }
}