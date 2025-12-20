import { Clock, ShaderMaterial, Vector4 } from "three";

export class DashedLineMaterial extends ShaderMaterial {
    uniforms = {
        uDashSize: { value: 10.0 },
        uLineSpacing: { value: 0.1 }, // Distance from center to inner edge
        uLineWidth: { value: 0.2 },   // Width of each individual line
        uLineColor: { value: new Vector4(1.0, 0.0, 0.0, 1.0) },
        uGapColor: { value: new Vector4(0.0, 0.0, 0.0, 0.0) }
    };

    transparent = true;
    clock!: Clock;
    vertexShader = `
        varying vec2 vUv;

        void main() {
            // Pass the uv attribute to the fragment shader
            vUv = uv;

            // Standard projection: position * modelViewMatrix * projectionMatrix
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    fragmentShader = `
     varying vec2 vUv;
        uniform float uDashSize;
        uniform float uLineSpacing;
        uniform float uLineWidth;
        uniform vec4 uLineColor; 
        uniform vec4 uGapColor; 

        void main() {
            float distX = abs(vUv.x - 0.5);
            
            // Start at spacing, end at spacing + width
            float horizontalMask = step(uLineSpacing, distX) * step(distX, uLineSpacing + uLineWidth);

            float verticalMask = step(0.5, fract(vUv.y * uDashSize));

            gl_FragColor = mix(uGapColor, uLineColor, horizontalMask * verticalMask);
        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}