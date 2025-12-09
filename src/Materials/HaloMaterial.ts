import { AdditiveBlending, BackSide, ShaderMaterial, Vector3 } from "three";

export class HaloMaterial extends ShaderMaterial {
    transparent = true;
    blending = AdditiveBlending;
    side = BackSide;

    uniforms = {
        uColor: { value: new Vector3(0.8, 0.3, 1.0) },
        uIntensity: { value: 1.5 },
        uPower: { value: 6.0 },
        uThickness: { value: 0.1 },
        uFresnelFalloff: { value: 0.05 }
    };

    vertexShader = `
        uniform float uThickness;
        
        varying vec3 vNormal;
        varying vec3 vViewDirection;
        varying float vViewDepth; // Critical for consistent fade

        void main() {
            // Standard view matrix transformation
            vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
            
            vec3 normalView = normalize(normalMatrix * normal);
            vec4 displacedPosition = viewPosition + vec4(normalView, 0.0) * uThickness;

             vViewDepth = viewPosition.z - displacedPosition.z; 

            // Pass other varyings
            vNormal = normalView;
            vViewDirection = normalize(-viewPosition.xyz);

            gl_Position = projectionMatrix * displacedPosition;
        }
    `;

    fragmentShader = `
        uniform vec3 uColor;
        uniform float uIntensity;
        uniform float uPower;
        uniform float uFresnelFalloff;

        varying vec3 vNormal;
        varying vec3 vViewDirection;
        varying float vViewDepth;

        void main() {
            float rim = 1.0 - max(dot(vNormal, vViewDirection), 0.0);
            float glowIntensity = pow(rim, uPower);

            float viewFade = smoothstep(0.0, uFresnelFalloff, vViewDepth);
            
            float finalAlpha = glowIntensity * viewFade * uIntensity;

            vec3 finalColor = uColor * finalAlpha;
            gl_FragColor = vec4(finalColor, finalAlpha);
        }
    `;

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        return material;
    }

}