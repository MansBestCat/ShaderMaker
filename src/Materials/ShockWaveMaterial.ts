import { Clock, DoubleSide, NormalBlending, ShaderMaterial, Vector3 } from "three";

export class ShockWaveMaterial extends ShaderMaterial {

    uniforms = {
        time: { value: 0.0 },
        origin: { value: new Vector3 },
        distanceFactor: { value: 2.0 }
    };

    clock!: Clock;

    vertexShader = `
        uniform float time; // Time for animation
        uniform vec3 origin; // Center of the wave
        uniform float distanceFactor; // Controls wave strength

        void main() {
            float z = sin( time + distance(origin, position));
            vec3 _position = vec3(position.x, position.y, z);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(_position, 1.0);

        }
    `;

    fragmentShader = `
        void main() {
            gl_FragColor = vec4(0.1,0.2,0.3,1.0);
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
        uniforms.time.value = this.clock.getElapsedTime();
    }

}