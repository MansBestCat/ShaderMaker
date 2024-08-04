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
            vec4 inPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            
            // Calculate displacement from the origin
            vec4 _origin = vec4(origin,1.0);
            vec4 displacement = normalize(inPosition - _origin) * distanceFactor;

            // Apply the displacement to the vertex position
            vec4 displacedPos = inPosition + displacement;

            // Create a sine wave animation over time
            float waveAmplitude = 5.1; // Adjust as needed
            float waveFrequency = 2.0; // Adjust as needed
            float waveOffset = sin(time * waveFrequency) * waveAmplitude;
            displacedPos.y += waveOffset;

            // Set the final position
            gl_Position = displacedPos;

            // Optional: Color the vertices based on displacement
            //fragColor = vec4(displacement, 1.0);
        }
    `;

    fragmentShader = `
        void main() {
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
        uniforms.time.value = this.clock.getElapsedTime();
    }

}