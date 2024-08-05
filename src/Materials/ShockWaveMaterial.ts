import { Clock, DoubleSide, MeshPhongMaterial, NormalBlending, Vector3 } from "three";

export class ShockWaveMaterial extends MeshPhongMaterial {

    uniforms = {
        time: { value: 0.0 },
        origin: { value: new Vector3 },
        distanceFactor: { value: 2.0 }
    };

    clock!: Clock;

    constructor() {
        super();
        this.setValues({
            blending: NormalBlending,
            side: DoubleSide,
            depthWrite: false
        });
        this.onBeforeCompile = (info) => {
            info.vertexShader = info.vertexShader
                .replace('#include <common>', `
                    #include <common>
                    uniform float time;
                    uniform vec3 origin;
                `)
                .replace('#include <beginnormal_vertex>', `
                    vec3 objectNormal = vec3( 1.0,0.0,1.0 );
                `)
                .replace('#include <begin_vertex>', `
                    float z = sin( time + distance(origin, position));
                    vec3 transformed = vec3(position.x, position.y, z);
                `);
        };
    }

    clone(): this {
        const material = super.clone();
        material.uniforms = JSON.parse(JSON.stringify(this.uniforms));
        material.clock = new Clock();
        material.updateMaterialTime(material.uniforms);
        return material;
    }

    updateMaterialTime(uniforms: any) {
        requestAnimationFrame(() => this.updateMaterialTime(uniforms));
        uniforms.time.value = this.clock.getElapsedTime();

    }

}