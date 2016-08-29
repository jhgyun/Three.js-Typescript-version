var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var ShaderMaterial = (function (_super) {
        __extends(ShaderMaterial, _super);
        function ShaderMaterial(parameters) {
            _super.call(this);
            this.defines = {};
            this.uniforms = {};
            this.vertexShader = 'void main() {\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}';
            this.fragmentShader = 'void main() {\n\tgl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}';
            this.linewidth = 1;
            this.wireframe = false;
            this.wireframeLinewidth = 1;
            this.fog = false;
            this.lights = false;
            this.clipping = false;
            this.skinning = false;
            this.morphTargets = false;
            this.morphNormals = false;
            this.extensions = {
                derivatives: false,
                fragDepth: false,
                drawBuffers: false,
                shaderTextureLOD: false
            };
            this.defaultAttributeValues = {
                'color': [1, 1, 1],
                'uv': [0, 0],
                'uv2': [0, 0]
            };
            this.index0AttributeName = undefined;
            if (parameters !== undefined) {
                if (parameters["attributes"] !== undefined) {
                    console.error('THREE.ShaderMaterial: attributes should now be defined in THREE.BufferGeometry instead.');
                }
                this.setValues(parameters);
            }
        }
        ;
        ShaderMaterial.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.fragmentShader = source.fragmentShader;
            this.vertexShader = source.vertexShader;
            this.uniforms = THREE.UniformsUtils.clone(source.uniforms);
            this.defines = source.defines;
            this.wireframe = source.wireframe;
            this.wireframeLinewidth = source.wireframeLinewidth;
            this.lights = source.lights;
            this.clipping = source.clipping;
            this.skinning = source.skinning;
            this.morphTargets = source.morphTargets;
            this.morphNormals = source.morphNormals;
            this.extensions = source.extensions;
            return this;
        };
        ;
        ShaderMaterial.prototype.toJSON = function (meta) {
            var data = _super.prototype.toJSON.call(this, meta);
            data.uniforms = this.uniforms;
            data.vertexShader = this.vertexShader;
            data.fragmentShader = this.fragmentShader;
            return data;
        };
        ;
        return ShaderMaterial;
    }(THREE.Material));
    THREE.ShaderMaterial = ShaderMaterial;
})(THREE || (THREE = {}));
