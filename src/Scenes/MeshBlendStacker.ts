import GUI from "lil-gui";
import { AmbientLight, BoxGeometry, Color, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { Utility } from "../Utilities/Utility";

export class MeshBlendStacker {

    interval?: number;

    materialBottom!: MeshBasicMaterial;
    materialTop!: MeshBasicMaterial;

    go(data: Data, cameraManMain: CameraManMain) {
        if (!data.camera) {
            throw new Error(`${Utility.timestamp()} Expected camera`);
        }

        const pointLight = new PointLight(new Color(0xffffff), 2.0);
        pointLight.position.set(0, 5, -3);
        data.scene.add(pointLight);

        const ambientLight = new AmbientLight("white", 0.1);
        data.scene.add(ambientLight);

        const gui = new GUI();
        gui.domElement.onpointermove = (event: PointerEvent) => {
            event.stopPropagation();
        };

        const ground = new Mesh(new BoxGeometry(10, 1, 10), new MeshPhongMaterial({ color: new Color(0xffffff) }));
        data.scene.add(ground);

        this.materialBottom = new MeshBasicMaterial({ color: "red" });
        const meshBottom = new Mesh(new PlaneGeometry(2.0, 2.0), this.materialBottom);
        meshBottom.position.set(0.0, 3.0, 0.0);
        meshBottom.rotateY(Math.PI);
        data.scene.add(meshBottom);

        this.materialTop = new MeshBasicMaterial({ color: "blue" });
        const meshTop = new Mesh(new PlaneGeometry(2.0, 2.0), this.materialTop);
        meshTop.position.set(-0.2, 2.8, -0.5);
        meshTop.rotateY(Math.PI);
        data.scene.add(meshTop);

        data.camera.position.set(0, 3, -12);
        data.camera?.lookAt(0, 3, 0);


        // // this.material.uniforms.uAttackLineLength.value = this.TUBE_LENGTH;     
        // // gui.add(this.material.uniforms.uPulseLength, "value", 0.0, 4.0, 0.1).name("pulse length");
        // // gui.add(this, "SPEED", 0.01, 0.07, 0.01).name("distance per tick");
        // const params = {
        //     color: '#c34dfe'
        // };
        // gui.addColor(params, 'color').onChange((_value: string) => {
        //     this.material!.uniforms.uColor.value = new Color(_value);
        // });
        // gui.add(this.material.uniforms.uIntensity, "value", 0.9, 8.0, 0.05).name("uIntensity");
        // gui.add(this.material.uniforms.uPower, "value", 1.0, 10.0, 0.1).name("uPower");
        // gui.add(this.material.uniforms.uThickness, "value", 0.01, 0.07, 0.01).name("uThickness");
        // gui.add(this.material.uniforms.uFresnelFalloff, "value", 0.001, 1.0, 0.001).name("uFresnelFalloff");

        meshTop.material = this.materialTop;

        cameraManMain.makeCameraOrbital(meshTop.position);
    }


}