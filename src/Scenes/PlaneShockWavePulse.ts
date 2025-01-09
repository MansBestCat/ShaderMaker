import GUI from "lil-gui";
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, PlaneGeometry, PointLight, Raycaster, Vector2, Vector3 } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { GroundWaveMaterial } from "../Materials/GroundWaveMaterial";
import { Utility } from "../Utilities/Utility";

/** Triggering the shock wave shader */
export class PlaneShockWavePulse {
    WAVE_SPEED = 10.0;

    data?: Data;
    raycaster?: Raycaster;
    shaderMat?: GroundWaveMaterial;

    go(data: Data, cameraManMain: CameraManMain) {
        if (!data.camera) {
            throw new Error(`${Utility.timestamp()} Expected camera`);
        }

        this.data = data;

        const pointLight = new PointLight(new Color(0xffffff), 4.0);
        pointLight.position.set(5, 5, 3);
        pointLight.intensity = 20;
        data.scene.add(pointLight);

        const ground = new Mesh(new BoxGeometry(30, 1, 30), new MeshBasicMaterial({ color: new Color(0x444444) }));
        ground.position.set(15, -0.6, 15);
        data.scene.add(ground);

        const mesh = new Mesh(new PlaneGeometry(20, 20, 20, 20), undefined);
        mesh.rotateX(-Math.PI * 0.5);
        mesh.position.set(15, 0, 15);
        data.scene.add(mesh);

        data.camera.position.set(0, 10, -18);
        data.camera?.lookAt(0, 2, 0);


        this.shaderMat = new GroundWaveMaterial({ color: new Color(0xff0000) }).clone();
        mesh.material = this.shaderMat;

        cameraManMain.makeCameraOrbital(mesh.position);

        const gui = new GUI();
        gui.domElement.onpointermove = (event: PointerEvent) => {
            event.stopPropagation();
        };
        gui.add(this.shaderMat.uniforms.uMax, "value", 1.0, 20.0, 0.1).name("max distance radius");
        gui.add(this, "WAVE_SPEED", 1.0, 20.0, 0.1).name("wave speed m/s");

        this.raycaster = new Raycaster(data.camera.position, undefined, 1.0, 60.0);
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

        // Translation necessary for plane. x is backwards ~1-x
        const roomPosition = new Vector3(5, 0, 5);
        const roomDimensions = new Vector3(10, 0, 10);
        const position = new Vector3;
        position.x = -(roomPosition.x + roomDimensions.x - intersection[0].point.x);
        position.z = roomPosition.z + roomDimensions.z - intersection[0].point.z;
        console.log(`${Utility.timestamp()} Wave origin is at local position ${position.x}, ${position.z}`);

        this.pulse(position);
    }

    pulse(position: Vector3) {
        this.shaderMat!.uniforms.uDistance.value = 0.0;
        this.shaderMat!.uniforms.uOrigin.value = new Vector3(position.x, position.z, 0.0);
        setInterval(() => {
            this.shaderMat!.uniforms.uDistance.value += this.WAVE_SPEED / 60;
        }, 16.666);
    }
}