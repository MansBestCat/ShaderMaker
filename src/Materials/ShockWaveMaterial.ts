import { Clock, DoubleSide, NormalBlending, ShaderMaterial, Vector3 } from "three";

export class ShockWaveMaterial extends ShaderMaterial {

    uniforms = {
        uTime: { value: 0.0 },
        uUvY: { value: 0.0 },
        uHalfStripeWidth: { value: 0.05 },
        uIntensityScalar: { value: 1.0 },
        uColor: { value: new Vector3 }
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
        uniform float uIntensityScalar;
        uniform vec3 uColor;
        varying vec2 vUv;
        const float half_pi=1.57;        
        void main() {
            float r;
            if (vUv.y < uUvY) {
                // mid stripe and below
                 float rads = half_pi * (uUvY-vUv.y) / uHalfStripeWidth;
                 r = 1.0 - sin(rads);
            } else if  (vUv.y > uUvY) {
                // mid stripe and above
                float rads = half_pi * (vUv.y-uUvY) / uHalfStripeWidth;
                 r = 1.0 - sin(rads);
            }
            gl_FragColor = vec4(0.1,0.2,0.3,1.0); // vec4(uColor,r) * uIntensityScalar;
        }
    `;

    constructor() {
        super();
        this.setValues({
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
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