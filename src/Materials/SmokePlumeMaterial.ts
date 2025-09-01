import { Clock, ShaderMaterial, Vector3 } from "three";


export class SmokePlumeMaterial extends ShaderMaterial {
    uniforms = {
        uProgress: { value: 0 },            // goes up. controls stripe position
        uColor: { value: new Vector3(0.0, 1.0, 0.7) },
        uStripeWidth: { value: 0.5 },
        uStripeAngle: { value: 3.0 }
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
        const float MESH_LENGTH = 1.0;
        
        uniform float uProgress;
        uniform vec3 uColor;
        uniform float uStripeWidth;
        uniform float uStripeAngle;
            
        varying vec3 vPosition;

        void main(void) {
            float y = vPosition.y;
            float x = abs(vPosition.x);
            float tapered = 0.0;
            float pulse = 0.5 + 0.5 * cos(uProgress *  3.14 + 3.14);
            
            float centerY = uProgress / 2.0 - 0.5;
            float chevron = clamp(1.0 - abs((y - centerY) * -uStripeAngle - x / uStripeWidth), 0.0, 1.0);
            tapered += pow(chevron, 2.0) * pulse;

            tapered = clamp(tapered, 0.0, 1.0);    
            gl_FragColor = vec4(uColor * (0.35 + 0.75 * tapered), 1.0);
         }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}