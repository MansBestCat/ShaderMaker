import GUI from "lil-gui";
import { AmbientLight, BoxGeometry, Color, DirectionalLight, FogExp2, Mesh, MeshPhongMaterial } from "three";
import { CameraManMain } from "../Camera/CameraManMain";
import { Data } from "../Data";
import { FogExpOverride } from "../Materials/FogExpOverride";
import { Utility } from "../Utilities/Utility";

export class FogScene {

  go(data: Data, cameraManMain: CameraManMain, fogExpOverride: FogExpOverride) {
    if (!data.camera) {
      throw new Error(`${Utility.timestamp()} Expected camera`);
    }

    fogExpOverride.init();

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
    gui.domElement.onpointermove = (event: PointerEvent) => {
      event.stopPropagation();
    };

    const groundMat = new MeshPhongMaterial({ color: new Color(0xffaa00) });
    groundMat.onBeforeCompile = fogExpOverride.modifyShader.bind(fogExpOverride);
    const ground = new Mesh(new BoxGeometry(20, 1, 20), groundMat);
    data.scene.add(ground);

    // Two columns share a material
    const boxFogShader = new Mesh(new BoxGeometry(1, 10, 1), undefined);
    const boxMaterial = new MeshPhongMaterial({ color: new Color(0xff0000) });
    boxMaterial.onBeforeCompile = fogExpOverride.modifyShader.bind(fogExpOverride);
    boxFogShader.material = boxMaterial;
    boxFogShader.position.set(1, 0, 1);
    data.scene.add(boxFogShader);

    const boxNoFogShader = new Mesh(new BoxGeometry(1, 10, 1), undefined);
    boxNoFogShader.material = boxMaterial;
    boxNoFogShader.position.set(5, 0, 5);
    data.scene.add(boxNoFogShader);

    // Two walls share a material
    const wallMaterial = new MeshPhongMaterial({ color: new Color(0x777777) });
    wallMaterial.onBeforeCompile = fogExpOverride.modifyShader.bind(fogExpOverride);
    const wallFar = new Mesh(new BoxGeometry(20, 5, 1), wallMaterial);
    wallFar.position.set(0, 2, 10);
    data.scene.add(wallFar);

    const wallLeft = wallFar.clone();
    wallLeft.position.set(10, 2, 0);
    wallLeft.rotateY(Math.PI / 2);
    data.scene.add(wallLeft);

    data.camera.position.set(-10, 7, -13);
    data.camera?.lookAt(3, 2, 3);

    this.guiBindings(fogExpOverride, gui);

    cameraManMain.makeCameraOrbital(boxFogShader.position);

    data.scene.fog = new FogExp2(0xDFE9F3, 0.05);
    fogExpOverride.rAF();
  }

  guiBindings(fogExpOverride: FogExpOverride, gui: GUI) {

    gui.add({ value: 0.1 }, "value", 0.0, 0.25, 0.001)
      .name("fogDensity")
      .onChange((_value: string) => {
        fogExpOverride.shaders.forEach(shader => {
          shader.uniforms.uFogDensity.value = _value;
        });
      });

    gui.addColor({ color: '#ababab' }, 'color')
      .name("fogColor")
      .onChange((_value: string) => {
        const color = new Color(_value);
        fogExpOverride.shaders.forEach(shader => {
          shader.uniforms.uFogColor.value.x = color.r;
          shader.uniforms.uFogColor.value.y = color.g;
          shader.uniforms.uFogColor.value.z = color.b;
        });
      });

    gui.add({ value: 0.01 }, "value", 0.0, 0.02, 0.0001)
      .name("noisePosFactor")
      .onChange((_value: string) => {
        fogExpOverride.shaders.forEach(shader => {
          shader.uniforms.uNoiseSampleCoordPositionFactor.value = _value;
        });
      });

    gui.add({ value: 0.025 }, "value", 0.0, 0.05, 0.0001)
      .name("fogTimeScalar")
      .onChange((_value: string) => {
        fogExpOverride.shaders.forEach(shader => {
          shader.uniforms.uFogTimeScalar.value = _value;
        });
      });

    gui.add({ value: 5000.0 }, "value", 0.0, 10000.0, 100.0)
      .name("fogSatFactor")
      .onChange((_value: string) => {
        fogExpOverride.shaders.forEach(shader => {
          shader.uniforms.uFogDepthSaturationFactor.value = _value;
        });
      });

    gui.add({ value: 0.007 }, "value", 0.00, 0.025, 0.0001)
      .name("fogHeightFactor")
      .onChange((_value: string) => {
        fogExpOverride.shaders.forEach(shader => {
          shader.uniforms.uFogHeightFactor.value = _value;
        });
      });
  }
}