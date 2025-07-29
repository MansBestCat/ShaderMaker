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
    float y = vPosition.y;
    float x = abs(vPosition.x);         // symmetry for one stripe
    float stripeWidth = 0.2;
    float chevronSlope = 1.5;

    float centerY = -1.0 + uProgress * 2.0; // slides from -1 to +1
    float chevron = clamp(1.0 - abs((y - centerY) * chevronSlope - x / stripeWidth), 0.0, 1.0);
    float tapered = pow(chevron, 2.0);

    gl_FragColor = vec4(uColor * tapered, 1.0);
}
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}