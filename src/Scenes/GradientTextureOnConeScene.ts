import GUI from "lil-gui";
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, MeshPhongMaterial, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { GradientTextureMaterial } from "../Materials/GradientTextureMaterial";
import { Utility } from "../Utilities/Utility";

export class GradientTextureOnConeScene {

    shaderMat?: GradientTextureMaterial;

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

        const geometry = new BoxGeometry(5.0, 5.0, 5.0);
        const mesh = new Mesh(geometry, undefined);
        // const geometry = new ConeGeometry(
        //     Config.SKYBOX_WIDTH / 2 + 20 - 1, Config.SKYBOX_WIDTH, 4, 1, false, Math.PI / 4);
        // this.calculateUVs(this.uvFactory, this.geometry);

        mesh.position.y = 4.0;
        mesh.rotateX(Math.PI);
        mesh.rotateZ(Math.PI);
        data.scene.add(mesh);

        data.camera.position.set(1, 5, -7);
        data.camera?.lookAt(0, 4, 0);

        this.shaderMat = new GradientTextureMaterial();
        const matBlank = new MeshBasicMaterial();
        mesh.material = [this.shaderMat, this.shaderMat, matBlank, matBlank, this.shaderMat, this.shaderMat];

        cameraManMain.makeCameraOrbital(mesh.position);
    }
}