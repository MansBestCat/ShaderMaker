import { Clock, ShaderMaterial } from "three";

export class ForgePrintMaterial extends ShaderMaterial {

    uniforms = {
    };

    clock!: Clock;

    fragmentShader = `
        void main(void) {
            gl_FragColor = vec4(1.0,1.0,1.0,1.0);
        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }
}

