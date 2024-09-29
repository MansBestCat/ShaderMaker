import { Clock, NormalBlending, ShaderMaterial, Vector3 } from "three";

export class DropZoneMaterial extends ShaderMaterial {

    uniforms = {
        uUvY: { value: 0.0 },
        uStripeWidth: { value: 0.05 },
        uStripeSpacing: { value: 0.05 },
        uColor: { value: new Vector3 }
    };

    clock!: Clock;

    vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    fragmentShader = `
        uniform float uUvY;
        uniform float uStripeWidth;
        uniform float uStripeSpacing;
        uniform vec3 uColor;
        varying vec2 vUv;     
        void main() {
            gl_FragColor = vec4(uColor,1.0);
        }
    `;

    constructor() {
        super();
        this.setValues({
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            transparent: true,
            blending: NormalBlending,
            depthWrite: false
        });
    }

}