import { OutlineEffect } from "postprocessing";
import { Camera, Clock, Color, PointLight, Scene } from "three";

export class Data {

    tickSize = 16.666; // ms  Starting value. Can be modified by bullet time or by dev's slider.
    scene: Scene;
    canvas: HTMLCanvasElement;
    clock?: Clock;
    camera?: Camera;
    outlineEffect?: OutlineEffect;

    constructor(p_canvas: HTMLCanvasElement) {
        if (p_canvas === null) {
            throw new Error(`Null dependency injected to Data`);
        }
        this.canvas = p_canvas;
        this.scene = new Scene();

        const pointLight = new PointLight(new Color(0xffffff), 2.0);
        pointLight.position.set(0, 5, -3);
        this.scene.add(pointLight);

    }
}