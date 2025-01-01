import { Clock, MeshLambertMaterial, MeshLambertMaterialParameters, Vector3 } from "three";

export class DropZoneMaterial extends MeshLambertMaterial {

    uniforms = {
        uStripeWidth: { value: 0.05 },
        uStripeSpacing: { value: 0.05 },
        uColor: { value: new Vector3 }
    };

    clock!: Clock;

    constructor(parameters?: MeshLambertMaterialParameters) {
        super(parameters);

        this.onBeforeCompile = (info) => {

            info.vertexShader = info.vertexShader
                .replace('#include <common>', `
                #include <common>
                varying vec3 vPosition;
            `)
                .replace('#include <begin_vertex>', `
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                vPosition = position * 100.0;
                vec3 transformed = position;
            `);

            info.fragmentShader = info.fragmentShader
                .replace('#include <common>', `
                #include <common>
                // https://github.com/cacheflowe/haxademic/blob/master/data/haxademic/shaders/textures/basic-diagonal-stripes.glsl
                uniform float uUvY;
                uniform float uStripeWidth;
                uniform float uStripeSpacing;
                uniform vec3 uColor;
                varying vec2 vUv;     
                varying vec3 vPosition; 
            `)
                .replace('#include <color_fragment>', `
                vec4 color;
                float time = 0.0;
                float size = 16.0;
                float factor = 2.8;

                float x = time + vPosition.x / size;
                float y = vPosition.y / size;

                float sum = x + y;

                if (int(mod(float(sum), float(factor))) == 0)
                    color = vec4(uColor,1.0);
                else
                    discard;
                diffuseColor = color;
            `);
            info.uniforms.uStripeWidth = this.uniforms.uStripeWidth;
            info.uniforms.uStripeSpacing = this.uniforms.uStripeSpacing;
            info.uniforms.uColor = this.uniforms.uColor;
        };
    }



}