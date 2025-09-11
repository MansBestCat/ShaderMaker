import { BoxGeometry, ClampToEdgeWrapping, Color, LinearFilter, LinearMipMapLinearFilter, Mesh, MeshPhongMaterial, PlaneGeometry, PointLight, Texture, TextureLoader } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { FlipbookMaterial } from "../Materials/FlipbookMaterial";
import { Utility } from "../Utilities/Utility";


export class Flipbook {

    shaderMat?: FlipbookMaterial;
    interval?: number;

    go(data: Data, cameraManMain: CameraManMain) {
        if (!data.camera) {
            throw new Error(`${Utility.timestamp()} Expected camera`);
        }

        data.scene.background = new Color(0xffffff);
        const pointLight = new PointLight(new Color(0xffffff), 2.0);
        pointLight.position.set(0, 5, -3);
        data.scene.add(pointLight);

        const ground = new Mesh(new BoxGeometry(10, 1, 10), new MeshPhongMaterial({ color: new Color(0xffffff) }));
        ground.position.y -= 0.5;
        data.scene.add(ground);

        const mesh = new Mesh(new PlaneGeometry(5, 5, 5), undefined);
        mesh.position.y = 3.5;
        mesh.rotateY(Math.PI);
        data.scene.add(mesh);

        data.camera.position.set(0, 3, -12);
        data.camera?.lookAt(0, 3, 0);


        this.shaderMat = new FlipbookMaterial().clone();

        const textureLoader = new TextureLoader();
        const url = `${location.protocol}//${window.location.host}/textures/output.webp`;
        textureLoader.loadAsync(url).then((texture: Texture) => {

            texture.wrapS = texture.wrapT = ClampToEdgeWrapping;
            texture.minFilter = LinearMipMapLinearFilter;
            texture.magFilter = LinearFilter;

            this.shaderMat!.uniforms = {
                flipbook: { value: texture },
                frame: { value: 0 },
                framesPerRow: { value: 8 },
                framesPerCol: { value: 8 }
            };

            mesh.material = this.shaderMat!;

            setInterval(() => {
                this.shaderMat!.uniforms.frame.value += 0.5; // adjust speed
            }, 16.6);

        }).catch(() => {
            console.error(`${Utility.timestamp()} Could not get resource ${url}`);

        });


        cameraManMain.makeCameraOrbital(mesh.position);

    }

}