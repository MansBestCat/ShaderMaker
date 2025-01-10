import GUI from "lil-gui";
import { BoxGeometry, Color, Mesh, MeshPhongMaterial, PointLight } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { Utility } from "../Utilities/Utility";

/** A bare scene, shows how screenshot capability might be built into future scenes */
export class Screenshot {
    constructor(public data: Data) { }

    go(cameraManMain: CameraManMain) {
        if (!this.data.camera) {
            throw new Error(`${Utility.timestamp()} Expected camera`);
        }

        const pointLight = new PointLight(new Color(0xffffff), 10.0);
        pointLight.position.set(-17, 7, -17);
        this.data.scene.add(pointLight);

        const mesh = new Mesh(new BoxGeometry(20, 1, 20), new MeshPhongMaterial({ color: new Color(0xffffff) }));
        this.data.scene.add(mesh);

        this.data.camera.position.set(-13, 3, -13);
        this.data.camera?.lookAt(0, 2, 0);

        const gui = new GUI();
        gui.add(this, "screenshot");

        cameraManMain.makeCameraOrbital(mesh.position);
    }

    screenshot() {
        // Take a screenshot of the canvas
        const dataURL = this.data.renderer!.domElement.toDataURL();
        var img = new Image();
        img.src = dataURL;
        document.body.appendChild(img);

        // Create a link to download the image
        const aDownload = document.createElement('a');
        aDownload.href = dataURL;
        aDownload.download = 'scene.png'; // TODO: encode current shader uniforms to the image name for easier identification
        aDownload.click();

    }

}