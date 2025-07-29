import { Clock, ShaderMaterial, Vector3 } from "three";

//https://copilot.microsoft.com/pages/xXHLHwPCkNV6Lxoydptmj

export class TravelingPathSegmentsMaterial extends ShaderMaterial {
    uniforms = {
        uProgress: { value: 0 },
        uOffset: { value: 0 },           // per segment
        pulseSpeed: { value: 1.0 },        // controls how fast pulses travel
        nPulses: { value: 3.0 },        // total number of visible pulses
        uColor: { value: new Vector3(0.0, 1.0, 0.7) } // trail tint
        //trailTex:   { value: your1DTexture } // stylized 1D gradient texture
    };
    clock!: Clock;
    vertexShader = `
        varying vec3 vPosition; 

        void main() {
            vPosition = position;         
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
        }
    `;

    fragmentShader = `
        uniform float uProgress;
        uniform float uOffset;
        uniform float pulseSpeed;
        uniform float nPulses;
        uniform vec3 uColor;
        uniform float uIntensityScalar;

        varying vec3 vPosition;

        void main(void) {

            // Local wave progress within segment
            float wave = (uProgress - uOffset) * pulseSpeed;

            // Normalize into repeating 0–1 cycle for chevron shaping
            float phase = fract(wave);

            // Chevron shape: peak at center = 0.5
            float chevron = 1.0 - abs(phase * 2.0 - 1.0);

            // Tapered intensity for sharp center and trailing edges
            float tapered = pow(chevron, 3.0);  // Adjust exponent for sharpness

            // Final output with color tint and taper
            gl_FragColor = vec4(uColor * tapered, 1.0);
       }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}