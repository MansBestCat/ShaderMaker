import { Clock, ShaderMaterial, Vector3 } from "three";

export class AttackLineMaterial extends ShaderMaterial {
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

            if (vPosition.y > -halfLength + uDistance  || vPosition.y < -halfLength + uDistance - uBoltLength) {
                discard;

            } else if (vPosition.y < -halfLength + uDistance && vPosition.y > -halfLength + uDistance - uHeadLength) {
                // head
                gl_FragColor = vec4(uColor, 1.0) * uIntensityScalar;

            } else {
                // tail
                gl_FragColor = vec4(uColor, 1.0);
            }
            
        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}