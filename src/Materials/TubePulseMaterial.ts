import { Clock, ShaderMaterial, Vector3 } from "three";

export class TubePulseMaterial extends ShaderMaterial {
    public static BOLT_LENGTH = 3.0;
    uniforms = {
        uDistance: { value: 0.0 },
        uBoltLength: { value: TubePulseMaterial.BOLT_LENGTH },
        uColor: { value: new Vector3(1.0, 1.0, 1.0) }
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
        uniform float uBoltLength;
        uniform vec3 uColor;

        varying vec3 vPosition;

        float rect(vec2 pt, vec2 size, vec2 center) {
            vec2 p = pt - center;
            vec2 halfsize = size * 0.5;
            float horz = step(-halfsize.x, p.x) - step(halfsize.x, p.x);
            float vert = step(-halfsize.y, p.y) - step(halfsize.y, p.y);
            return horz * vert;
        }
        void main(void) {
            vec2 size = vec2(5.0);
            vec2 center = vec2(0.0, (uBoltLength * -2.0 + uDistance));
            float inRect = rect(vPosition.xy, size, center);
            if (inRect == 0.0) {
                discard;
            }
            gl_FragColor = vec4(uColor, 1.0);
        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}