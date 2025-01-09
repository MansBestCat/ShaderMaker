import GUI from "lil-gui";
import { AmbientLight, BoxGeometry, Color, DirectionalLight, FogExp2, Mesh, MeshPhongMaterial, ShaderChunk, Vector3 } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { Noise } from "../Materials/Noise";
import { Utility } from "../Utilities/Utility";


export class FogScene {


  interval?: number;
  shaders = new Array<any>();
  tPrev!: number;
  totalTime = 0;

  init() {
    // https://www.youtube.com/watch?v=k1zGz55EqfU&t=471s
    ShaderChunk.fog_fragment = `
        #ifdef USE_FOG
          vec3 fogOrigin = cameraPosition;
          vec3 fogDirection = normalize(vWorldPosition - fogOrigin);
          float fogDepth = distance(vWorldPosition, fogOrigin);
    
          // f(p) = fbm( p + fbm( p ) )
          vec3 noiseSampleCoord = vWorldPosition * 0.00025 + vec3(
              0.0, 0.0, fogTime * 0.025);
          float noiseSample = FBM(noiseSampleCoord + FBM(noiseSampleCoord)) * 0.5 + 0.5;
          fogDepth *= mix(noiseSample, 1.0, saturate((fogDepth - 5000.0) / 5000.0));
          fogDepth *= fogDepth;
    
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

  go(data: Data, cameraManMain: CameraManMain) {
    if (!data.camera) {
      throw new Error(`${Utility.timestamp()} Expected camera`);
    }

    const light = new DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(-20, 100, -20);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.near = 0.5;
    light.shadow.camera.far = 500.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    data.scene.add(light);

    const ambient = new AmbientLight(0x101010);
    data.scene.add(ambient);

    const gui = new GUI();

    const groundMat = new MeshPhongMaterial({ color: new Color(0xffaa00) });
    groundMat.onBeforeCompile = this.modifyShader.bind(this);
    const ground = new Mesh(new BoxGeometry(20, 1, 20), groundMat);
    data.scene.add(ground);

    // Two columns share a material
    const boxFogShader = new Mesh(new BoxGeometry(1, 10, 1), undefined);
    const boxMaterial = new MeshPhongMaterial({ color: new Color(0xff0000) });
    boxMaterial.onBeforeCompile = this.modifyShader.bind(this);
    boxFogShader.material = boxMaterial;
    boxFogShader.position.set(1, 0, 1);
    data.scene.add(boxFogShader);

    const boxNoFogShader = new Mesh(new BoxGeometry(1, 10, 1), undefined);
    boxNoFogShader.material = boxMaterial;
    boxNoFogShader.position.set(5, 0, 5);
    data.scene.add(boxNoFogShader);

    // Two walls share a material
    const wallMaterial = new MeshPhongMaterial({ color: new Color(0x777777) });
    wallMaterial.onBeforeCompile = this.modifyShader.bind(this);
    const wallFar = new Mesh(new BoxGeometry(20, 5, 1), wallMaterial);
    wallFar.position.set(0, 2, 10);
    data.scene.add(wallFar);

    const wallLeft = wallFar.clone();
    wallLeft.position.set(10, 2, 0);
    wallLeft.rotateY(Math.PI / 2);
    data.scene.add(wallLeft);

    data.camera.position.set(-10, 7, -13);
    data.camera?.lookAt(3, 2, 3);

    gui.addColor({ color: '#ffffff' }, 'color').onChange((_value: string) => {
      const color = new Color(_value);
      this.shaders.forEach(shader => {
        shader.uniforms.fogColor.value.x = color.r;
        shader.uniforms.fogColor.value.y = color.g;
        shader.uniforms.fogColor.value.z = color.b;
      });
    });

    cameraManMain.makeCameraOrbital(boxFogShader.position);

    data.scene.fog = new FogExp2(0xDFE9F3, 0.05);
    this.rAF();
  }

  modifyShader(s: any) {
    this.shaders.push(s);
    s.uniforms.fogTime = { value: 0.0 };
    s.uniforms.fogDensity = { value: 1.0 };
    s.uniforms.fogColor = { value: new Vector3(0.7, 0.7, 0.7) };
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