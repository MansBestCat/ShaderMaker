import { ShaderChunk, Vector3 } from "three";
import { Noise } from "./Noise";

/* 
  This modifies global Threejs fog shader chunks to introduce cameraPosition so the fog depth can be modulated
  This alone does not make fog. For a scene to participate in fog it needs:
  1. scene.fog = new FogExp2
  2. materials in the scene need to assign onBeforeCompile=modifyShader
*/
export class FogExpOverride {
  uniforms = {
    uFogTime: { value: 0.0 },
    uFogDensity: { value: 0.1 },
    uFogColor: { value: new Vector3(0.66, 0.66, 0.66) },
    uNoiseSampleCoordPositionFactor: { value: 0.01 },
    uFogTimeScalar: { value: 0.025 },
    uFogDepthSaturationFactor: { value: 5000.0 },
    uFogHeightFactor: { value: 0.007 }
  };

  shaders = new Array<any>();
  tPrev!: number;
  totalTime = 0;

  constructor() {
    Object.freeze(this.uniforms);
  }

  init() {
    // https://www.youtube.com/watch?v=k1zGz55EqfU&t=471s
    ShaderChunk.fog_fragment = `
      #ifdef USE_FOG
        vec3 fogOrigin = cameraPosition;
        vec3 fogDirection = normalize(vWorldPosition - fogOrigin);
        float fogDepth = distance(vWorldPosition, fogOrigin);
        //fogDepth *= fogDepth;
  
        // f(p) = fbm( p + fbm( p ) )
        vec3 noiseSampleCoord = vWorldPosition * uNoiseSampleCoordPositionFactor + vec3(
            0.0, 0.0, uFogTime * uFogTimeScalar);
        float noiseSample = FBM(noiseSampleCoord + FBM(noiseSampleCoord)) * 0.5 + 0.5;
        fogDepth *= mix(noiseSample, 1.0, saturate((fogDepth - uFogDepthSaturationFactor) / uFogDepthSaturationFactor));
        fogDepth *= fogDepth;//noiseSample; //fogDepth;
  
        float fogFactor = uFogHeightFactor * exp(-fogOrigin.y * uFogDensity) * (
            1.0 - exp(-fogDepth * fogDirection.y * uFogDensity)) / fogDirection.y;
        fogFactor = saturate(fogFactor);
  
        gl_FragColor.rgb = mix( gl_FragColor.rgb, uFogColor, fogFactor );
      #endif
    `;

    ShaderChunk.fog_pars_fragment = Noise._NOISE_GLSL + `
      #ifdef USE_FOG
        uniform float uFogTime;
        uniform vec3 uFogColor;
        uniform float uNoiseSampleCoordPositionFactor;
        uniform float uFogTimeScalar;
        uniform float uFogDepthSaturationFactor;
        uniform float uFogHeightFactor;

        varying vec3 vWorldPosition;
        #ifdef FOG_EXP2
          uniform float uFogDensity;
        #else
          uniform float fogNear;
          uniform float fogFar;
        #endif
      #endif
    `;

    ShaderChunk.fog_vertex = `
      #ifdef USE_FOG
        vWorldPosition = worldPosition.xyz;
      #endif
    `;

    ShaderChunk.fog_pars_vertex = `
      #ifdef USE_FOG
        varying vec3 vWorldPosition;
      #endif
    `;
  }

  modifyShader(shader: any) {

    // Decorate the uniforms of the shader being compiled
    // Add the uniforms necessary to drive the FogExpOverride chunks
    shader.uniforms = {
      ...shader.uniforms,
      ...JSON.parse(JSON.stringify(this.uniforms)) // deep copy of uniforms, not references
    };

    // Push the shader into a list to be ticked
    this.shaders.push(shader);
  }

  rAF() {
    requestAnimationFrame((t) => {
      this.rAF();

      if (this.tPrev === undefined) {
        this.tPrev = t;
      }

      this.step((t - this.tPrev) * 0.001);
      this.tPrev = t;

    });
  }

  step(timeElapsed: number) {
    this.totalTime += timeElapsed;
    for (let s of this.shaders) {
      s.uniforms.uFogTime.value = this.totalTime;
    }
  }
}
