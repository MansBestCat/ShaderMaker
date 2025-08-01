import GUI from "lil-gui";
import { BoxGeometry, Clock, Color, Mesh, MeshPhongMaterial, PlaneGeometry, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { TravelingPathSegmentsMaterial } from "../Materials/TravelingPathSegmentsMaterial";
import { Utility } from "../Utilities/Utility";

/** Runs under manual control, has a color picker */
export class TravelingPathSegments {
    SPEED = 0.007;  // per tick
    PATH_SEGMENT_LENGTH = 1.0; // MESH_LENGTH in the shader
    PATH_SEGMENT_WIDTH = 0.3;

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
        ground.position.y -= 0.5;
        data.scene.add(ground);

        const mesh = new Mesh(new PlaneGeometry(this.PATH_SEGMENT_WIDTH, this.PATH_SEGMENT_LENGTH), undefined);
        mesh.position.y = this.PATH_SEGMENT_LENGTH * 0.5;
        mesh.rotateY(Math.PI);
        data.scene.add(mesh);

        data.camera.position.set(0, 3, -12);
        data.camera?.lookAt(0, 3, 0);

        this.shaderMat = new TravelingPathSegmentsMaterial().clone();
        gui.add(this, "SPEED", 0.005, 0.02, 0.001).name("distance per tick");
        gui.add(this.shaderMat!.uniforms.uStripeWidth, "value", 0.2, 2.0, 0.01).name("stripe width");
        gui.add(this.shaderMat!.uniforms.uStripeAngle, "value", 0.5, 3.0, 0.1).name("stripe angle");
        const params = {
            color: '#c34dfe'
        };
        gui.addColor(params, 'color').name("stripe color").onChange((_value: string) => {
            this.shaderMat!.uniforms.uColor.value = new Color(_value);
        });

        mesh.material = this.shaderMat;

        cameraManMain.makeCameraOrbital(mesh.position);

        const loopDuration = 2.0; // seconds per loop
        const clock = new Clock();

        setInterval(() => {
            this.shaderMat!.uniforms.uProgress.value = (clock.getElapsedTime() % loopDuration)
        }, 16.6);
    }

}