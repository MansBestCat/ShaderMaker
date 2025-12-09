import GUI from "lil-gui";
import { BoxGeometry, Color, Mesh, MeshPhongMaterial, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { HaloMaterial } from "../Materials/HaloMaterial";
import { Utility } from "../Utilities/Utility";

export class Halo {

    shaderMat?: HaloMaterial;
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

        const mesh = new Mesh(new BoxGeometry(2.0, 2.0, 2.0), undefined);
        data.scene.add(mesh);

        data.camera.position.set(0, 3, -12);
        data.camera?.lookAt(0, 3, 0);

        this.shaderMat = new HaloMaterial().clone();

        // this.shaderMat.uniforms.uAttackLineLength.value = this.TUBE_LENGTH;     
        // gui.add(this.shaderMat.uniforms.uPulseLength, "value", 0.0, 4.0, 0.1).name("pulse length");
        // gui.add(this, "SPEED", 0.01, 0.07, 0.01).name("distance per tick");
        const params = {
            color: '#c34dfe'
        };
        gui.addColor(params, 'color').onChange((_value: string) => {
            this.shaderMat!.uniforms.uColor.value = new Color(_value);
        });
        gui.add(this.shaderMat.uniforms.uIntensity, "value", 0.9, 2.9, 0.05).name("uIntensity");
        gui.add(this.shaderMat.uniforms.uPower, "value", 1.0, 10.0, 0.1).name("uPower");
        gui.add(this.shaderMat.uniforms.uFresnelFalloff, "value", 0.001, 1.0, 0.001).name("uFresnelFalloff");


        mesh.material = this.shaderMat;

        cameraManMain.makeCameraOrbital(mesh.position);
    }


}