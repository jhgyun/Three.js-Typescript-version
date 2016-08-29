var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var MeshBasicMaterial = (function (_super) {
        __extends(MeshBasicMaterial, _super);
        function MeshBasicMaterial(parameters) {
            _super.call(this);
            this.aoMap = null;
            this.aoMapIntensity = 1.0;
            this.combine = THREE.MultiplyOperation;
            this.refractionRatio = 0.98;
            this.wireframeLinecap = 'round';
            this.wireframeLinejoin = 'round';
            this.skinning = false;
            this.morphTargets = false;
            this.type = 'MeshBasicMaterial';
            this.color = new THREE.Color(0xffffff);
            this.map = null;
            this.specularMap = null;
            this.alphaMap = null;
            this.envMap = null;
            this.reflectivity = 1;
            this.wireframe = false;
            this.wireframeLinewidth = 1;
            this.lights = false;
            this.setValues(parameters);
        }
        ;
        MeshBasicMaterial.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.color.copy(source.color);
            this.map = source.map;
            this.aoMap = source.aoMap;
            this.aoMapIntensity = source.aoMapIntensity;
            this.specularMap = source.specularMap;
            this.alphaMap = source.alphaMap;
            this.envMap = source.envMap;
            this.combine = source.combine;
            this.reflectivity = source.reflectivity;
            this.refractionRatio = source.refractionRatio;
            this.wireframe = source.wireframe;
            this.wireframeLinewidth = source.wireframeLinewidth;
            this.wireframeLinecap = source.wireframeLinecap;
            this.wireframeLinejoin = source.wireframeLinejoin;
            this.skinning = source.skinning;
            this.morphTargets = source.morphTargets;
            return this;
        };
        ;
        return MeshBasicMaterial;
    }(THREE.Material));
    THREE.MeshBasicMaterial = MeshBasicMaterial;
})(THREE || (THREE = {}));
