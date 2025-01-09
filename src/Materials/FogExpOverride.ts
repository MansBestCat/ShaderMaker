import { ShaderChunk, Vector3 } from "three";
import { Noise } from "./Noise";

export class FogExpOverride {

    uniforms = {
        uStripeWidth: { value: 0.05 },
        uStripeSpacing: { value: 0.05 },
        uColor: { value: new Vector3 }
    };

    init() {
        // https://www.youtube.com/watch?v=k1zGz55EqfU&t=471s
        ShaderChunk.fog_fragment = `
                #ifdef USE_FOG
                  vec3 fogOrigin = cameraPosition;
                  vec3 fogDirection = normalize(vWorldPosition - fogOrigin);
                  float fogDepth = distance(vWorldPosition, fogOrigin);
                  //fogDepth *= fogDepth;
            
                  // f(p) = fbm( p + fbm( p ) )
                  vec3 noiseSampleCoord = vWorldPosition * 0.00025 + vec3(
                      0.0, 0.0, fogTime * 0.025);
                  float noiseSample = FBM(noiseSampleCoord + FBM(noiseSampleCoord)) * 0.5 + 0.5;
                  fogDepth *= mix(noiseSample, 1.0, saturate((fogDepth - 5000.0) / 5000.0));
                  fogDepth *= fogDepth;//noiseSample; //fogDepth;
            
                  float heightFactor = 0.05;
                  float fogFactor = heightFactor * exp(-fogOrigin.y * fogDensity) * (
                      1.0 - exp(-fogDepth * fogDirection.y * fogDensity)) / fogDirection.y;
                  fogFactor = saturate(fogFactor);
            
                  gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
                #endif
            `;

        ShaderChunk.fog_pars_fragment = Noise._NOISE_GLSL + `
                #ifdef USE_FOG
                  uniform float fogTime;
                  uniform vec3 fogColor;
                  varying vec3 vWorldPosition; // camera position
                  #ifdef FOG_EXP2
                    uniform float fogDensity;
                  #else
                    uniform float fogNear;
                    uniform float fogFar;
                  #endif
                #endif
            `;

        ShaderChunk.fog_vertex = `
                #ifdef USE_FOG
                  vWorldPosition = worldPosition.xyz; // camera position
                #endif
            `;

        ShaderChunk.fog_pars_vertex = `
                #ifdef USE_FOG
                  varying vec3 vWorldPosition; // camera position
                #endif
            `;
    }
}
