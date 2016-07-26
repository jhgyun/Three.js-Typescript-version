/// <reference path="../../textures/texture.ts" />
/// <reference path="../../math/matrix4.ts" />
/// <reference path="../../math/matrix3.ts" />
/// <reference path="../../math/vector4.ts" />
/// <reference path="../../math/vector3.ts" />
/// <reference path="../../math/vector2.ts" />
/// <reference path="../../math/color.ts" />
/* 
 * Uniform Utilities
 */

namespace THREE
{
    export var UniformsUtils = {
        merge: function (uniforms)
        {
            var merged = {};
            for (var u = 0; u < uniforms.length; u++)
            {
                var tmp = this.clone(uniforms[u]);
                for (var p in tmp)
                {
                    merged[p] = tmp[p];
                }
            }
            return merged;
        },

        clone: function (uniforms_src: IUniforms)
        {
            var uniforms_dst: IUniforms = {};
            for (var u in uniforms_src)
            {
                uniforms_dst[u] = {};
                for (var p in uniforms_src[u])
                { 
                    var parameter_src = uniforms_src[u][p];

                    if (parameter_src instanceof Color ||
                        parameter_src instanceof Vector2 ||
                        parameter_src instanceof Vector3 ||
                        parameter_src instanceof Vector4 ||
                        parameter_src instanceof Matrix3 ||
                        parameter_src instanceof Matrix4 ||
                        parameter_src instanceof Texture)
                    {
                        uniforms_dst[u][p] = parameter_src.clone();
                    }
                    else if (Array.isArray(parameter_src))
                    {
                        uniforms_dst[u][p] = parameter_src.slice();
                    }
                    else
                    {
                        uniforms_dst[u][p] = parameter_src;
                    }
                }
            }
            return uniforms_dst;
        }
    }; 
}
