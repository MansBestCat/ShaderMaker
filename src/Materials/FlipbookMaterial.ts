import { Clock, ShaderMaterial } from "three";

export class FlipbookMaterial extends ShaderMaterial {



    transparent = true;

    clock!: Clock;

    vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    fragmentShader = `
        uniform sampler2D flipbook;
        uniform float frameIndex;
        uniform float cols;
        uniform float rows;

        varying vec2 vUv;

        void main() {
            float totalFrames = cols * rows;
            float currentFrame = floor(mod(frameIndex, totalFrames)); // 0-63

            float row = rows - 1.0 -floor(currentFrame / cols);
            float col = mod(currentFrame, cols);

            vec2 uvOffset = vec2(col / cols, row / rows);
            vec2 uvScale = vec2(1.0 / cols, 1.0 / rows);

            vec2 uv = uvOffset + vUv * uvScale;
            vec4 tex = texture2D(flipbook, uv);

            gl_FragColor = tex;
        }

    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}