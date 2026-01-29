import { AdditiveBlending, Color, ShaderMaterial } from "three";

export class DashedLineMaterial extends ShaderMaterial {
    transparent = true;
    depthWrite = false;
    blending = AdditiveBlending;

    uniforms = {
        uTime: { value: 0 },
        uColor: { value: new Color(0xff3333) },
        uNoiseScale: { value: 4.0 },
        uIntensity: { value: 1.0 },
    };

    vertexShader = `
        varying vec3 vWorldPos;

        void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
    `;

    fragmentShader = `
        uniform float uTime;
        uniform vec3 uColor;
        uniform float uNoiseScale;
        uniform float uIntensity;

        varying vec3 vWorldPos;

        // Simple hash-based noise (cheap, stable)
        float hash(vec3 p) {
            p = fract(p * 0.3183099 + vec3(0.1));
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);

            return mix(
                mix(
                    mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                    mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x),
                    f.y
                ),
                mix(
                    mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                    mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x),
                    f.y
                ),
                f.z
            );
        }

        void main() {
            // World-space drifting smoke
            vec3 p = vWorldPos * uNoiseScale + vec3(0.0, uTime * 0.6, 0.0);
            float n = noise(p);

            // Soft beam core
            float alpha = smoothstep(0.3, 1.0, n) * uIntensity;

            gl_FragColor = vec4(uColor, alpha);
        }
    `;
}
