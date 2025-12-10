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

        // const paramsBottom = { color: 'red' };
        // gui.addColor(paramsBottom, 'color').onChange((_value: string) => {
        //     this.materialBottom.color = new Color(_value);
        // });

        const dummyBottom = { color: "red", intensity: 1.5 };
        gui.addColor(dummyBottom, "color").setValue("0xff0000").onChange((_value: string) => {
            this.materialBottom.color = new Color(dummyBottom.color).multiplyScalar(dummyBottom.intensity);
        });
        gui.add(dummyBottom, "intensity", 0.05, 10.0, 0.07)
            .name("intensity")
            .onChange((_value: string) => {
                this.materialBottom.color = new Color(dummyBottom.color).multiplyScalar(dummyBottom.intensity);
            });

        const dummyTop = { color: "blue", intensity: 1.5 };
        gui.addColor(dummyTop, "color").setValue("0x0000ff").onChange((_value: string) => {
            this.materialTop.color = new Color(dummyTop.color).multiplyScalar(dummyTop.intensity);
        });
        gui.add(dummyTop, "intensity", 0.05, 10.0, 0.07)
            .name("intensity")
            .onChange((_value: string) => {
                this.materialTop.color = new Color(dummyTop.color).multiplyScalar(dummyTop.intensity);
            });

        cameraManMain.makeCameraOrbital(meshTop.position);
    }


}