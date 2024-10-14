import { Clock, ShaderMaterial } from "three";

export class ForgePrintMaterial extends ShaderMaterial {

    uniforms = {
        uY: { value: 3.0 },
    };

    clock!: Clock;

    vertexShader = `
        varying vec4 vPosition;
        void main(void) {
            vPosition =  modelViewMatrix * vec4(position,1.0);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;
    fragmentShader = `
        varying vec4 vPosition;
        uniform float uY;

        void main(void) {
            vec3 color = vec3(0.0);
            color.r =step(0.0,vPosition.x);
            color.g =step(0.0,vPosition.y);
            color.b =step(0.0,vPosition.z);
            
            if (vPosition.y > uY) {
                discard;
            }
            gl_FragColor = vec4(color,1.0);
        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }
}

