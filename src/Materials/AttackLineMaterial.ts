import { Clock, ShaderMaterial, Vector3 } from "three";

export class AttackLineMaterial extends ShaderMaterial {
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
        uniform float uDistance;
        uniform float uAttackLineLength;
        uniform float uPulseLength;
        uniform vec3 uColor;
        uniform float uIntensityScalar;
        uniform float uSoftness;

        varying vec3 vPosition;

        void main(void) {
            
            float lineY = vPosition.y + (uAttackLineLength * 0.5); 
            float pulseHead = uDistance * uAttackLineLength;
            float pulseTail = pulseHead - uPulseLength;
            
            float dHead = smoothstep(pulseHead, pulseHead - uSoftness, lineY);
            float dTail = smoothstep(pulseTail, pulseTail + uSoftness, lineY);
            float mask = dHead * dTail;

            vec3 pulseColor = uColor * uIntensityScalar;
            vec3 fallbackColor = vec3(0.1, 0.1, 0.2); 
            vec3 finalColor = mix(fallbackColor, pulseColor, mask);

            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}