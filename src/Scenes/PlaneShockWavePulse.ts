import GUI from "lil-gui";
import { Color, Mesh, PlaneGeometry, PointLight, Raycaster, Vector2, Vector3 } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { ShockWaveMaterial } from "../Materials/ShockWaveMaterial";
import { Utility } from "../Utilities/Utility";

/** Triggering the shock wave shader */
export class PlaneShockWavePulse {

    data?: Data;
    raycaster?: Raycaster;
    shaderMat?: ShockWaveMaterial;

    go(data: Data, cameraManMain: CameraManMain) {
        if (!data.camera) {
            throw new Error(`${Utility.timestamp()} Expected camera`);
        }

        this.data = data;

        const pointLight = new PointLight(new Color(0xffffff), 4.0);
        pointLight.position.set(0, 5, -3);
        data.scene.add(pointLight);

        const mesh = new Mesh(new PlaneGeometry(20, 20, 20, 20), undefined);
        mesh.rotateX(Math.PI * 0.5);
        data.scene.add(mesh);

        data.camera.position.set(0, 10, -18);
        data.camera?.lookAt(0, 2, 0);


        this.shaderMat = new ShockWaveMaterial().clone();
        mesh.material = this.shaderMat;

        cameraManMain.makeCameraOrbital(mesh.position);

        const gui = new GUI();
        gui.add(this.shaderMat.uniforms.uMax, "value", 1.0, 10.0, 0.1);

        this.raycaster = new Raycaster(data.camera.position, undefined, 1.0, 40.0);
        document.addEventListener("pointerdown", (event) => this.raycastFromPointer(event));
    }

    raycastFromPointer(event: PointerEvent): void {
        if (!this.raycaster || !this.data?.camera) {
            throw new Error(`${Utility.timestamp()} expected dependency`);
        }
        const pointerPosition = new Vector2(event.clientX, event.clientY);
        const pointer = new Vector2();
        pointer.x = (pointerPosition.x / window.innerWidth) * 2 - 1;
        pointer.y = - (pointerPosition.y / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(pointer, this.data.camera);
        const intersection = this.raycaster.intersectObject(this.data.scene);
        if (intersection.length < 1) {
            return;
        }
        this.pulse(intersection[0].point);
    }

    pulse(position: Vector3) {
        this.shaderMat!.uniforms.uDistance.value = 0.0;
        this.shaderMat!.uniforms.uOrigin.value = new Vector3(position.x, position.z, 0.0);
    }
}