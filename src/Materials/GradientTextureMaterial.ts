import { Clock, ShaderMaterial, TextureLoader, Vector3 } from "three";

export class GradientTextureMaterial extends ShaderMaterial {
    uniforms = {
        uStartY: { value: 0.4 },  /*  TODO: Validate. uv.y value, range from 0 to 1 */
        uEndY: { value: 0.6 },   /* uv.y value, range from 0 to 1 */
        uStartColor: { value: new Vector3(1.0, 0.0, 0.0) },
        uEndColor: { value: new Vector3(1.0, 1.0, 0.0) },
        uTexture: { value: new TextureLoader().load(`http://localhost/textures/crystal.jpg`) }
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
        uniform float uStartY;
        uniform float uEndY;
        uniform vec3 uStartColor;
        uniform vec3 uEndColor;
        uniform sampler2D uTexture;
        
        varying vec2 vUv;

        void main(void) {
            float value = smoothstep(uStartY, uEndY, vUv.y);
            vec3 gradColor = mix(uStartColor, uEndColor, value);
            vec3 texColor = texture2D(uTexture, vUv).rgb;
            gl_FragColor = vec4(gradColor * texColor, 1.0);
        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}