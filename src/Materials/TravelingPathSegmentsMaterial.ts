import { Clock, ShaderMaterial, Vector3 } from "three";
/*
uniforms: {
  uProgress: { value: 0 },
  uOffset:   { value: 0 },           // per segment
  pulseSpeed: { value: 1.0 },        // controls how fast pulses travel
  nPulses:    { value: 3.0 },        // total number of visible pulses
  uColor:     { value: new THREE.Color(0x00ffcc) }, // trail tint
  trailTex:   { value: your1DTexture } // stylized 1D gradient texture
}
https://copilot.microsoft.com/pages/xXHLHwPCkNV6Lxoydptmj
*/
export class TravelingPathSegmentsMaterial extends ShaderMaterial {
    uniforms = {
        uDistance: { value: 0.0 },
        uTubeLength: { value: 0.0 },
        uBoltLength: { value: 3.0 },
        uHeadLength: { value: 0.3 },
        uColor: { value: new Vector3(0.8, 0.3, 1.0) },
        uIntensityScalar: { value: 4.35 }
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
        uniform float uDistance;
        uniform float uTubeLength;
        uniform float uBoltLength;
        uniform float uHeadLength;
        uniform vec3 uColor;
        uniform float uIntensityScalar;

        varying vec3 vPosition;

        void main(void) {
            float halfLength = uTubeLength * 0.5;

            // Bounds check: only render within bolt range
            if (vPosition.y > -halfLength + uDistance || 
                vPosition.y < -halfLength + uDistance - uBoltLength) {
                discard;
            }

            // Chevron phase (0–1 ramp through bolt region)
            float pulseY = (-halfLength + uDistance - vPosition.y) / uBoltLength;
            float center = fract(pulseY);

            // Method #4: chevron tapering
            float chevron = 1.0 - abs(center * 2.0 - 1.0);
            float tapered = pow(chevron, 3.0); // adjust exponent to taste

            // Boost head zone if desired
            if (vPosition.y < -halfLength + uDistance && 
                vPosition.y > -halfLength + uDistance - uHeadLength) {
                tapered *= uIntensityScalar;
            }

            gl_FragColor = vec4(uColor * tapered, 1.0);
        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}