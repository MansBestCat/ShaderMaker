import { Clock, ShaderMaterial, Vector3 } from "three";

export class DashedLineMaterial extends ShaderMaterial {
    uniforms = {
        uDistance: { value: 0.0 },
        uAttackLineLength: { value: 0.0 },
        uPulseLength: { value: 3.0 },
        uColor: { value: new Vector3(0.8, 0.3, 1.0) },
        uIntensityScalar: { value: 0.9 },
        uSoftness: { value: 1.0 }
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

        uniform vec2 u_resolution; // The screen size (e.g., (800.0, 600.0))
        uniform float u_dash_size = 10.0; // The size of the dash/gap pattern in pixels
        uniform vec4 u_line_color = vec4(1.0, 0.0, 0.0, 1.0); // Red line color
        uniform vec4 u_gap_color = vec4(0.0, 0.0, 0.0, 0.0); // Transparent gap (or your background color)

        void main() {
            // 1. Get the vertical position on the screen
            float pos = gl_FragCoord.y;

            // 2. Repeat the pattern every 'u_dash_size * 2.0' pixels (dash + gap)
            float pattern = mod(pos, u_dash_size * 2.0);

            // 3. Use 'step' to create a sharp cut-off. 
            //    'step' returns 1.0 if the second argument is >= the first, 0.0 otherwise.
            //    This creates a solid dash for the first 'u_dash_size' pixels
            //    and a gap for the remaining 'u_dash_size' pixels.
            float dash_mask = step(pattern, u_dash_size);

            // 4. Mix the line color and the gap color based on the mask
            gl_FragColor = mix(u_gap_color, u_line_color, dash_mask);

        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}