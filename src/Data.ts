import { OutlineEffect } from "postprocessing";
import { Camera, Clock, Scene } from "three";

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
    }
}