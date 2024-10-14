import GUI from "lil-gui";
import { BoxGeometry, Color, Mesh, MeshPhongMaterial, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { DropZoneMaterial } from "../Materials/DropZoneMaterial";
import { Utility } from "../Utilities/Utility";


export class DropZone {

    shaderMat?: DropZoneMaterial;
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

        const mesh = new Mesh(new BoxGeometry(3, 3, 1), undefined);
        mesh.position.y = 3;
        data.scene.add(mesh);

        data.camera.position.set(0, 7, -12);
        data.camera?.lookAt(0, 2, 0);

        const params = {
            color: '#aa00ff'
        };

        this.shaderMat = new DropZoneMaterial().clone();
        gui.add(this.shaderMat.uniforms.uStripeWidth, "value", 0.0, 1.0, 0.01).name("stripe width");
        gui.add(this.shaderMat.uniforms.uStripeSpacing, "value", 0.5, 5.0, 0.01).name("space between stripes");
        gui.addColor(params, 'color').onChange((_value: string) => {
            this.shaderMat!.uniforms.uColor.value = new Color(_value);
        });
        mesh.material = this.shaderMat;

        cameraManMain.makeCameraOrbital(mesh.position);
    }

}