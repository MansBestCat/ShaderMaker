import { Clock, DoubleSide, MeshPhongMaterial, NormalBlending, Vector3 } from "three";

export class ShockWaveMaterial extends MeshPhongMaterial {

    uniforms = {
        uDistance: { value: 0.0 },
        uMax: { value: 5.0 },
        uOrigin: { value: new Vector3 },
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
                    uniform float uDistance;
                    uniform float uMax;
                    uniform vec3 uOrigin;
                `)
                .replace('#include <beginnormal_vertex>', `
                    // // https://www.khanacademy.org/math/multivariable-calculus/integrating-multivariable-functions/line-integrals-in-vector-fields-articles/a/constructing-a-unit-normal-vector-to-curve
                    // float _dist = max - distance; // -time + distance(origin,position);
                    // float mag = sqrt(pow(cos(_dist),2.0) + 1.0 );
                    // float _x = -cos(_dist) / mag;
                    // float _z = 1.0 / mag;
                    vec3 objectNormal = vec3( normal); // (_x,0.0,_z );
                    #ifdef USE_TANGENT
                        vec3 objectTangent = vec3( tangent.xyz );
                    #endif
                `)
                .replace('#include <begin_vertex>', `
                    vec3 _position = vec3(position.x, position.y, step(uDistance, distance(uOrigin,position)));
                    vec3 transformed = _position;
                    #ifdef USE_ALPHAHASH
                        vPosition = _position;
                    #endif
                `);
            info.uniforms.uDistance = this.uniforms.uDistance;
            info.uniforms.uMax = this.uniforms.uMax;
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
        uniforms.uDistance.value += 0.05;

    }

}