import { Clock, NormalBlending, ShaderMaterial, Vector3 } from "three";

export class DropZoneMaterial extends ShaderMaterial {

    uniforms = {
        uUvY: { value: 0.0 },
        uStripeWidth: { value: 0.05 },
        uStripeSpacing: { value: 0.05 },
        uColor: { value: new Vector3 }
    };

    clock!: Clock;

    fragmentShader = `
        // https://github.com/cacheflowe/haxademic/blob/master/data/haxademic/shaders/textures/basic-diagonal-stripes.glsl
        uniform float uUvY;
        uniform float uStripeWidth;
        uniform float uStripeSpacing;
        uniform vec3 uColor;
        varying vec2 vUv;     

        void main() {
            vec4 color;
            float time = 0.0;
            float size = 16.0;
            float factor = 2.8;

            float x = time + gl_FragCoord.x / size;
            float y = gl_FragCoord.y / size;

            float sum = x + y;

            if (int(mod(float(sum), float(factor))) == 0)
                color = vec4(uColor,1.0);
            else
                 discard; //color = vec4(0.0,0.0,0.0,0.0);

            gl_FragColor = color;
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