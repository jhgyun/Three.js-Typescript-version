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
var THREE;
(function (THREE) {
    THREE.UniformsUtils = {
        merge: function (uniforms) {
            var merged = {};
            for (var u = 0; u < uniforms.length; u++) {
                var tmp = this.clone(uniforms[u]);
                for (var p in tmp) {
                    merged[p] = tmp[p];
                }
            }
            return merged;
        },
        clone: function (uniforms_src) {
            var uniforms_dst = {};
            for (var u in uniforms_src) {
                uniforms_dst[u] = {};
                for (var p in uniforms_src[u]) {
                    var parameter_src = uniforms_src[u][p];
                    if (parameter_src instanceof THREE.Color ||
                        parameter_src instanceof THREE.Vector2 ||
                        parameter_src instanceof THREE.Vector3 ||
                        parameter_src instanceof THREE.Vector4 ||
                        parameter_src instanceof THREE.Matrix3 ||
                        parameter_src instanceof THREE.Matrix4 ||
                        parameter_src instanceof THREE.Texture) {
                        uniforms_dst[u][p] = parameter_src.clone();
                    }
                    else if (Array.isArray(parameter_src)) {
                        uniforms_dst[u][p] = parameter_src.slice();
                    }
                    else {
                        uniforms_dst[u][p] = parameter_src;
                    }
                }
            }
            return uniforms_dst;
        }
    };
})(THREE || (THREE = {}));
