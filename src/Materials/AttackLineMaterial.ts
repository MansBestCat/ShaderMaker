import { Clock, ShaderMaterial, Vector3 } from "three";

export class AttackLineMaterial extends ShaderMaterial {
    uniforms = {
        uDistance: { value: 0.0 },
        uAttackLineLength: { value: 0.0 },
        uPulseLength: { value: 3.0 },
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
        uniform float uAttackLineLength;
        uniform float uPulseLength;
        uniform vec3 uColor;
        uniform float uIntensityScalar; // Intensity multiplier for the glow

        varying vec3 vPosition;

        void main(void) {
            
            float lineY = vPosition.y + (uAttackLineLength * 0.5); 
             float pulseHead = uDistance * uAttackLineLength;
            float pulseTail = pulseHead - uPulseLength;

            // Check if the fragment is within the pulse's moving window
            if (lineY > pulseTail && lineY < pulseHead) {
                // within the window
                
                // Optional: Fade the pulse's tail for a smoother look (replaces your head/tail logic)
                float fadeAlpha = (lineY - pulseTail) / uPulseLength; // 0 at tail, 1 at head

                gl_FragColor = vec4(uColor * uIntensityScalar, fadeAlpha); 

            } else {
                discard;
            }
            
        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}