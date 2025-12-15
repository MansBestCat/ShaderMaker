import { Clock, ShaderMaterial, Vector4 } from "three";

export class DashedLineMaterial extends ShaderMaterial {
    uniforms = {
        uDashSize: { value: 10.0 },
        uLineColor: { value: new Vector4(1.0, 0.0, 0.0, 1.0) },
        uGapColor: { value: new Vector4(0.0, 0.0, 0.0, 0.0) }
    };
    transparent = true;
    clock!: Clock;
    vertexShader = `
        varying vec3 vPosition; 

        void main() {
            vPosition = position;         
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
        }
    `;

    fragmentShader = `

        uniform float uDashSize; // The size of the dash/gap pattern in pixels
        uniform vec4 uLineColor; // line color
        uniform vec4 uGapColor; // Transparent gap or background color

        void main() {
            // 1. Get the vertical position on the screen
            float pos = gl_FragCoord.y;

            // 2. Repeat the pattern every 'uDashSize * 2.0' pixels (dash + gap)
            float pattern = mod(pos, uDashSize * 2.0);

            // 3. Use 'step' to create a sharp cut-off. 
            //    'step' returns 1.0 if the second argument is >= the first, 0.0 otherwise.
            //    This creates a solid dash for the first 'uDashSize' pixels
            //    and a gap for the remaining 'uDashSize' pixels.
            float dash_mask = step(pattern, uDashSize);

            // 4. Mix the line color and the gap color based on the mask
            gl_FragColor = mix(uGapColor, uLineColor, dash_mask);

        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}