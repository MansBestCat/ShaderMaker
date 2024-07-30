import { Clock, ShaderMaterial } from "three";

export class RedStaticMaterial extends ShaderMaterial {

    clock!: Clock;

    uniforms = {
        uTime: { value: 0.0 }
    };

    vertexShader = `
        varying vec2 vUv; 

        void main() {
            vUv = uv;         
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
        }
    `;

    fragmentShader = `   

        uniform float uTime;
        varying vec2 vUv;
        
        // Rand one-liner
        float rand(vec2 co) {
            return fract (sin (dot (co.xy, vec2 (12.9898, 78.233))) * 43758.5453);
        }

        void main(void) {

            // Time varying pixel color
            vec3 movement = 0.5 + 0.5 * cos (uTime + vUv.xyx + vec3 (0, 2, 4));
            
            // Noise value at given Y
            float noise = rand (vec2 (uTime, vUv.y));
            
            // Noise color
            vec3 col = vec3(noise * 1.0,0.0,0.0);
            
            // // Adds static
            col *= (rand (vUv * uTime) + 3.0) * 0.3;

            // Output to screen
            gl_FragColor = vec4(col * movement, 1.0);
        } 
    `;

    clone(): this {
        const mat = super.clone();
        mat.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        mat.clock = new Clock();
        mat.updateMaterialTime(mat.uniforms);
        return mat;
    }

    updateMaterialTime(uniforms: any) {
        requestAnimationFrame(() => this.updateMaterialTime(uniforms));
        uniforms.uTime.value = this.clock.getElapsedTime();
    }


}