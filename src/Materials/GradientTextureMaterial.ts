import { Clock, ShaderMaterial, TextureLoader } from "three";

export class GradientTextureMaterial extends ShaderMaterial {
    uniforms = {
        uDistance: { value: 0.0 },
        uTexture: { value: new TextureLoader().load(`http://localhost/textures/crystal.jpg`) }

    };
    clock!: Clock;
    vertexShader = `
        varying vec3 vPosition;
        varying vec2 vUv;

        void main() {
            vPosition = position;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

    fragmentShader = `   
        uniform float uDistance;
        uniform sampler2D uTexture;
        varying vec3 vPosition;
        varying vec2 vUv;

        void main(void) {
            vec3 gradColor = mix(vec3(1.0,1.0,1.0), vec3(0.0,0.0,1.0), vUv.y);
            vec3 texColor = texture2D(uTexture, vUv).rgb;
            gl_FragColor = vec4(gradColor * texColor , 1.0);
        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}