/// <reference path="shadermaterial.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var ShadowMaterial = (function (_super) {
        __extends(ShadowMaterial, _super);
        function ShadowMaterial() {
            _super.call(this, {
                uniforms: THREE.UniformsUtils.merge([
                    THREE.UniformsLib["lights"],
                    {
                        opacity: { value: 1.0 }
                    }
                ]),
                vertexShader: THREE.ShaderChunk['shadow_vert'],
                fragmentShader: THREE.ShaderChunk['shadow_frag']
            });
            this.lights = true;
            this.transparent = true;
        }
        Object.defineProperty(ShadowMaterial.prototype, "opacity", {
            get: function () {
                if (this.uniforms == null || this.uniforms.opacity == null)
                    return 0;
                return this.uniforms.opacity.value;
            },
            set: function (value) {
                if (this.uniforms == null || this.uniforms.opacity == null)
                    return;
                this.uniforms.opacity.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return ShadowMaterial;
    }(THREE.ShaderMaterial));
    THREE.ShadowMaterial = ShadowMaterial;
})(THREE || (THREE = {}));
