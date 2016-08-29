var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var RawShaderMaterial = (function (_super) {
        __extends(RawShaderMaterial, _super);
        function RawShaderMaterial(parameters) {
            _super.call(this, parameters);
            this.type = 'RawShaderMaterial';
        }
        ;
        return RawShaderMaterial;
    }(THREE.ShaderMaterial));
    THREE.RawShaderMaterial = RawShaderMaterial;
})(THREE || (THREE = {}));
