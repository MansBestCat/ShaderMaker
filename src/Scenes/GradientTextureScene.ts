import GUI from "lil-gui";
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { Utility } from "../Utilities/Utility";

/** Runs under manual control, has a color picker */
export class GradientTextureScene {
    SPEED = 0.1;  // per tick

    shaderMat?: MeshBasicMaterial;
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

        const mesh = new Mesh(new PlaneGeometry(4.0, 6.0, 1, 1), undefined);
        mesh.position.y = 4.0;
        mesh.rotateX(Math.PI);
        data.scene.add(mesh);

        data.camera.position.set(1, 5, -10);
        data.camera?.lookAt(0, 4, 0);

        this.shaderMat = new MeshBasicMaterial({ color: new Color(0xff0000) });

        gui.add(this, "SPEED", 0.01, 0.07, 0.01).name("distance per tick");
        const params = {
            color: '#c34dfe'
        };

        mesh.material = this.shaderMat;

        // gui.add(this, "pulse");

        cameraManMain.makeCameraOrbital(mesh.position);
    }

    // pulse() {
    //     clearInterval(this.interval);
    //     this.shaderMat!.uniforms.uDistance.value = 0.0;
    //     this.interval = setInterval(() => {
    //         this.shaderMat!.uniforms.uDistance.value += this.SPEED;
    //     }, 16.6);
    // }
}