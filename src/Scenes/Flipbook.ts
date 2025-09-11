import { BoxGeometry, ClampToEdgeWrapping, Clock, Color, LinearFilter, LinearMipMapLinearFilter, Mesh, MeshPhongMaterial, PlaneGeometry, PointLight, Texture, TextureLoader } from "three";
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

        const mesh = new Mesh(new PlaneGeometry(5, 5), undefined);
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

            const spriteInfo = {
                rows: 8, cols: 8
            }
            this.shaderMat!.uniforms = {
                flipbook: { value: texture },
                frame: { value: 0 },
                framesPerRow: { value: spriteInfo.cols },
                framesPerCol: { value: spriteInfo.rows }
            };

            mesh.material = this.shaderMat!;
            const clock = new Clock();
            const fps = 2;
            const totalFrames = spriteInfo.cols * spriteInfo.rows;
            setInterval(() => {
                const elapsed = clock.getElapsedTime();
                const frameIndex = Math.floor(elapsed * fps) % totalFrames;
                this.shaderMat!.uniforms.frame.value = frameIndex;
            }, 16.6666);

        }).catch(() => {
            console.error(`${Utility.timestamp()} Could not get resource ${url}`);

        });


        cameraManMain.makeCameraOrbital(mesh.position);

    }

}