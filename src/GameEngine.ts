import { BlendFunction, ClearPass, EffectComposer, EffectPass, OutlineEffect, RenderPass } from "postprocessing";
import { Clock, HalfFloatType, WebGLRenderer } from "three";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer";
import { CameraManMain } from "./Camera/CameraManMain";
import { Data } from "./Data";

export class GameEngine {
    static readonly DEFAULT_PIXEL_RATIO = 0.5;
    static readonly DEFAULT_ANTIALIAS = false;

    data: Data;
    canvas: HTMLCanvasElement;
    cameraManMain: CameraManMain;

    webGlRenderer?: WebGLRenderer;
    composer?: EffectComposer;

    constructor(p_data: Data, p_canvas: HTMLCanvasElement, cameraManMain: CameraManMain) {
        if (p_data === null || p_canvas === null || !cameraManMain) {
            throw new Error(`Null dependency injected to`);
        }
        this.data = p_data;
        this.canvas = p_canvas;
        this.cameraManMain = cameraManMain;
    }

    init() {
        this.makeCameras();
        this.createRenderers();
        this.setUpEffectComposer();

        // Set up and start threejs render loop
        this.data.clock = new Clock();
        this.animate();
    }


    setUpEffectComposer() {

        const camera = this.data.camera;

        // Create our render stack
        this.composer = new EffectComposer(this.webGlRenderer, {
            frameBufferType: HalfFloatType
        });

        // Start with the clear pass
        this.composer.addPass(new ClearPass());

        // Add the render pass        
        const renderPass = new RenderPass(this.data.scene, camera);
        renderPass.clear = false;
        this.composer.addPass(renderPass);

        // Add an outline effect
        const params = {
            blendFunction: BlendFunction.SCREEN,
            multisampling: Math.min(4, this.webGlRenderer!.capabilities.maxSamples),
            edgeStrength: 2.5,
            pulseSpeed: 0.0,
            visibleEdgeColor: 0x0000ff,
            hiddenEdgeColor: 0x22090a,
            height: 480,
            blur: false,
            xRay: true
        } as any;

        const outlineEffect = new OutlineEffect(this.data.scene, camera, params);
        const effectPass = new EffectPass(camera, outlineEffect);
        this.composer.addPass(effectPass);
        this.data.outlineEffect = outlineEffect;

    }

    makeCameras() {
        // Start with a zoomed-out camera, not on any entity
        this.cameraManMain.makeCameraMAIN()

        if (!this.data.camera) {
            throw new Error(`Camera setup failed?`);
        }

    }


    createRenderers() {
        const webGlRenderer = this.createWebGLRenderer();
        this.webGlRenderer = webGlRenderer;
    }

    createWebGLRenderer(): WebGLRenderer {
        const renderer = this.getNewWebGLRenderer(this.canvas);
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        const pixelRatio = 1.0;
        renderer.setPixelRatio(pixelRatio);
        renderer.shadowMap.enabled = false;
        renderer.sortObjects = false;
        renderer.info.autoReset = false;
        renderer.autoClear = false;
        return renderer;
    }

    getNewWebGLRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
        const webGlRenderer = new WebGLRenderer({ canvas, antialias: false, stencil: false, depth: true, powerPreference: "high-performance" });
        console.log(`Starting the webGl renderer with these capabilities:`);
        console.log(JSON.stringify(webGlRenderer.capabilities));
        return webGlRenderer;
    }

    getNewCss2DRenderer(element: HTMLDivElement): CSS2DRenderer {
        return new CSS2DRenderer({ element });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.mainCamera();
    }

    mainCamera() {
        if (!this.data.camera || !this.webGlRenderer) {
            throw new Error(`expected cam and renderer`);;
        }

        this.webGlRenderer.clear();

        this.webGlRenderer.setScissorTest(false);
        this.webGlRenderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

        this.composer?.render();

        this.webGlRenderer.clearDepth();

    }
}
