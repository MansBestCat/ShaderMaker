import GUI from "lil-gui";
import { BoxGeometry, Color, Mesh, MeshPhongMaterial, PlaneGeometry, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { TravelingPathSegmentsMaterial } from "../Materials/TravelingPathSegmentsMaterial";
import { Utility } from "../Utilities/Utility";

/** Runs under manual control, has a color picker */
export class TravelingPathSegments {
    SPEED = 0.01;  // per tick
    TUBE_LENGTH = 8.0;
    TUBE_WIDTH = 1.0;

    shaderMat?: TravelingPathSegmentsMaterial;
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

        const mesh = new Mesh(new PlaneGeometry(this.TUBE_WIDTH, this.TUBE_LENGTH), undefined);
        mesh.position.y = this.TUBE_LENGTH * 0.5;
        mesh.rotateY(Math.PI);
        data.scene.add(mesh);

        data.camera.position.set(0, 3, -12);
        data.camera?.lookAt(0, 3, 0);

        this.shaderMat = new TravelingPathSegmentsMaterial().clone();
        gui.add(this, "SPEED", 0.01, 0.07, 0.01).name("distance per tick");
        gui.add(this.shaderMat!.uniforms.uPulseSpeed, "value", 0.01, 2.0, 0.01).name("pulse speed");
        gui.add(this.shaderMat!.uniforms.uStripeWidth, "value", 0.2, 1.0, 0.01).name("stripe width");
        gui.add(this.shaderMat!.uniforms.uStripeAngle, "value", 1.5, 3.0, 0.1).name("stripe angle");
        gui.add(this.shaderMat!.uniforms.uStripeSpacing, "value", 0.5, 2.0, 0.01).name("stripe spacing");
        gui.add(this.shaderMat!.uniforms.uStripeCount, "value", 1.0, 10.0, 1.0).name("stripe count");
        const params = {
            color: '#c34dfe'
        };
        gui.addColor(params, 'color').name("stripe color").onChange((_value: string) => {
            this.shaderMat!.uniforms.uColor.value = new Color(_value);
        });

        mesh.material = this.shaderMat;

        gui.add(this, "pulse");

        cameraManMain.makeCameraOrbital(mesh.position);
    }

    pulse() {
        clearInterval(this.interval);
        this.shaderMat!.uniforms.uProgress.value = 0.0;
        this.interval = setInterval(() => {
            this.shaderMat!.uniforms.uProgress.value += this.SPEED;
        }, 16.6);
    }
}