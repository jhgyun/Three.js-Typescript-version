/// <reference path="shadermaterial.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class ShadowMaterial extends ShaderMaterial
    {
        constructor()
        {
            super({
                uniforms: UniformsUtils.merge([
                    UniformsLib["lights"],
                    {
                        opacity: { value: 1.0 }
                    }
                ]),
                vertexShader: ShaderChunk['shadow_vert'],
                fragmentShader: ShaderChunk['shadow_frag']
            });

            this.lights = true;
            this.transparent = true;
        }
        get opacity()
        {
            if (this.uniforms == null || this.uniforms.opacity == null)
                return 0;
            return this.uniforms.opacity.value
        }
        set opacity(value)
        {
            if (this.uniforms == null || this.uniforms.opacity == null)
                return;
                             
            this.uniforms.opacity.value = value;
        }
    }
}