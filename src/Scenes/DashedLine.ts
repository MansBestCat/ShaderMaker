import GUI from "lil-gui";
import { BoxGeometry, Color, Mesh, MeshPhongMaterial, PlaneGeometry, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { DashedLineMaterial } from "../Materials/DashedLineMaterial";
import { Utility } from "../Utilities/Utility";

/** Runs under manual control, has a color picker */
export class DashedLine {
    GEOM_LENGTH = 8.0;
    GEOM_WIDTH = 0.3;

    shaderMat?: DashedLineMaterial;
    interval?: number;

    go(data: Data, cameraManMain: CameraManMain) {
        if (!data.camera) {
            throw new Error(`${Utility.timestamp()} Expected camera`);
        }

        const pointLight = new PointLight(new Color(0xffffff), 2.0);
        pointLight.position.set(0, 5, -3);
        data.scene.add(pointLight);

        const ground = new Mesh(new BoxGeometry(10, 1, 10), new MeshPhongMaterial({ color: new Color(0xffffff) }));
        data.scene.add(ground);

        // tube
        const mesh = new Mesh(new PlaneGeometry(this.GEOM_WIDTH, this.GEOM_LENGTH), undefined);
        mesh.position.y = this.GEOM_LENGTH * 0.5;
        mesh.rotateX(Math.PI / -2);
        mesh.rotateZ(Math.PI);
        data.scene.add(mesh);

        data.camera.position.set(0, 3, -12);
        data.camera?.lookAt(0, 3, 0);

        this.shaderMat = new DashedLineMaterial().clone();

        const gui = new GUI();
        gui.domElement.onpointermove = (event: PointerEvent) => {
            event.stopPropagation();
        };
        gui.add(this.shaderMat.uniforms.uDashSize, "value", 5.0, 20.0, 0.1).name("dash size");
        gui.add(this.shaderMat.uniforms.uLineSpacing, "value", 0.1, 0.3, 0.01).name("line spacing");
        gui.add(this.shaderMat.uniforms.uLineWidth, "value", 0.1, 0.3, 0.01).name("line thickness");
        const params = { color: '#c34dfe' };
        gui.addColor(params, 'color').onChange((_value: string) => {
            this.shaderMat!.uniforms.uLineColor.value = new Color(_value);
        });

        mesh.material = this.shaderMat;

        cameraManMain.makeCameraOrbital(mesh.position);
    }

}