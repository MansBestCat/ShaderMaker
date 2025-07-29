import { Clock, ShaderMaterial, Vector3 } from "three";

//https://copilot.microsoft.com/pages/xXHLHwPCkNV6Lxoydptmj

export class TravelingPathSegmentsMaterial extends ShaderMaterial {
    uniforms = {
        uProgress: { value: 0 },
        uPulseSpeed: { value: 1.0 },        // controls how fast pulses travel
        uColor: { value: new Vector3(0.0, 1.0, 0.7) }, // trail tint
        uChevronCount: { value: 1.0 },
        uStripeSpacing: { value: 1.0 }
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
        uniform float uPulseSpeed;
        uniform vec3 uColor;
        uniform int uChevronCount;    // how many to render simultaneously
        uniform float uStripeSpacing; // vertical distance between chevrons

        varying vec3 vPosition;

        void main(void) {
            float y = vPosition.y;
            float x = abs(vPosition.x);

            float stripeWidth = 0.2;
            float chevronSlope = 1.5;
    float centerY = -1.0 + uProgress * 2.0;

    // Static spatial chevron shape
    float chevron = clamp(1.0 - abs((y - centerY) * chevronSlope - x / stripeWidth), 0.0, 1.0);
          
            // Time-based pulse: sine wave over progress
            float pulse = 0.5 + 0.5 * sin(uProgress * uPulseSpeed * 6.283); // 0 → 1

    float tapered = pow(chevron, 2.0) * pulse;

    gl_FragColor = vec4(uColor * tapered, 1.0);
         }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}