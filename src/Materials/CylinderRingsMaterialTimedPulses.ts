import { Clock, DoubleSide, NormalBlending, ShaderMaterial } from "three";

export class CylinderRingsMaterialTimedPulses extends ShaderMaterial {

    uniforms = {
        uTime: { value: 0.0 },
        uPositionY: { value: 0.0 },
        uHalfStripeWidth: { value: 0.05 }
    };

    clock!: Clock;

    vertexShader = `
        varying vec2 vPosition;
        void main() {
            vPosition = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    fragmentShader = `
        uniform float uPositionY;
        uniform float uHalfStripeWidth;
        varying vec2 vPosition;
        const float PI=3.1415926535897932384626433832795;
        void main() {
            if ((vPosition.y  < (uPositionY -uHalfStripeWidth)) || (vPosition.y > (uPositionY + uHalfStripeWidth)) ) {
                discard;
            }
            float r;
            if (vPosition.y < uPositionY) {
                // mid stripe and below
                 r = 1.0 - sin(uPositionY-vPosition.y)*0.5+0.5;
            } else if  (vPosition.y > uPositionY) {
                // mid stripe and above
                 r = 1.0 - sin(vPosition.y-uPositionY)*0.5+0.5;
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