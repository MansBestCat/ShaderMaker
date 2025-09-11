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
        uniform float frame;
        uniform float framesPerRow;
        uniform float framesPerCol;

        varying vec2 vUv;

        void main() {
            float totalFrames = framesPerRow * framesPerCol;
            float currentFrame = floor(mod(frame, totalFrames));

            float row = floor(currentFrame / framesPerRow);
            float col = mod(currentFrame, framesPerRow);

            vec2 uvOffset = vec2(col / framesPerRow, row / framesPerCol);
            vec2 uvScale = vec2(1.0 / framesPerRow, 1.0 / framesPerCol);

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