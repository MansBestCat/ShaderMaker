import { Clock, DoubleSide, NormalBlending, ShaderMaterial } from "three";

export class CylinderRingsMaterialTimedPulses extends ShaderMaterial {

    uniforms = {
        uTime: { value: 0.0 },
        uUvY: { value: 0.0 },
        uHalfStripeWidth: { value: 0.05 }
    };

    clock!: Clock;

    vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    fragmentShader = `
        uniform float uUvY;
        uniform float uHalfStripeWidth;
        varying vec2 vUv;
        const float PI=3.1415926535897932384626433832795;
        void main() {
            if ((vUv.y  < (uUvY -uHalfStripeWidth)) || (vUv.y > (uUvY + uHalfStripeWidth)) ) {
                discard;
            }
            float r;
            if (vUv.y < uUvY) {
                // mid stripe and below
                 r = 1.0 - sin(uUvY-vUv.y)*0.5+0.5;
            } else if  (vUv.y > uUvY) {
                // mid stripe and above
                 r = 1.0 - sin(vUv.y-uUvY)*0.5+0.5;
            }
            
            gl_FragColor = vec4(r,0.0,0.0,r);
        }
    `;

    constructor() {
        super();
        this.setValues({
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            transparent: true,
            blending: NormalBlending,
            side: DoubleSide,
            depthWrite: false
        });
    }

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        material.clock = new Clock();
        material.updateMaterialTime(material.uniforms);
        return material;
    }

    updateMaterialTime(uniforms: any) {
        requestAnimationFrame(() => this.updateMaterialTime(uniforms));
        uniforms.uTime.value = this.clock.getElapsedTime();
    }

}