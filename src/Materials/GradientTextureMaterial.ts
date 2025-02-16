import { Clock, ShaderMaterial } from "three";

export class GradientTextureMaterial extends ShaderMaterial {
    uniforms = {
        uDistance: { value: 0.0 },
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

        varying vec3 vPosition;

        void main(void) {
                gl_FragColor = vec4(1.0,0.0,0.0, 1.0);
            
        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}