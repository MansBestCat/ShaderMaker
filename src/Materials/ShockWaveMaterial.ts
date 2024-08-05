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
            depthWrite: true
        });
        this.onBeforeCompile = (info) => {
            info.vertexShader = info.vertexShader
                .replace('#include <common>', `
                    #include <common>
                    uniform float time;
                    uniform vec3 origin;
                `)
                .replace('#include <beginnormal_vertex>', `
                    // https://www.khanacademy.org/math/multivariable-calculus/integrating-multivariable-functions/line-integrals-in-vector-fields-articles/a/constructing-a-unit-normal-vector-to-curve
                    float _dist = time + distance(origin,position);
                    float mag = sqrt(pow(cos(_dist),2.0) + 1.0 );
                    float _x = -cos(_dist) / mag;
                    float _z = 1.0 / mag;
                    vec3 objectNormal = vec3( _x,0.0,_z );
                    #ifdef USE_TANGENT
                        vec3 objectTangent = vec3( tangent.xyz );
                    #endif
                `)
                .replace('#include <begin_vertex>', `
                    float z = sin(_dist);
                    vec3 transformed = vec3(position.x, position.y, z);
                    #ifdef USE_ALPHAHASH
                        vPosition = vec3( position );
                    #endif
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