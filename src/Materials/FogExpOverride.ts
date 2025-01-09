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
    fogTime: { value: 0.0 },
    fogDensity: { value: 1.0 },
    fogColor: { value: new Vector3(0.7, 0.7, 0.7) }
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
      s.uniforms.fogTime.value = this.totalTime;
    }
  }
}
