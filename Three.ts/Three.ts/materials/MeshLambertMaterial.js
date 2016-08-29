var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var MeshLambertMaterial = (function (_super) {
        __extends(MeshLambertMaterial, _super);
        function MeshLambertMaterial(parameters) {
            _super.call(this);
            this.lightMapIntensity = 1.0;
            this.aoMap = null;
            this.aoMapIntensity = 1.0;
            this.emissiveIntensity = 1.0;
            this.combine = THREE.MultiplyOperation;
            this.refractionRatio = 0.98;
            this.wireframeLinecap = 'round';
            this.wireframeLinejoin = 'round';
            this.skinning = false;
            this.morphTargets = false;
            this.morphNormals = false;
            this.type = 'MeshLambertMaterial';
            this.color = new THREE.Color(0xffffff);
            this.map = null;
            this.lightMap = null;
            this.aoMap = null;
            this.emissive = new THREE.Color(0x000000);
            this.emissiveMap = null;
            this.specularMap = null;
            this.alphaMap = null;
            this.envMap = null;
            this.reflectivity = 1;
            this.wireframe = false;
            this.wireframeLinewidth = 1;
            this.setValues(parameters);
        }
        ;
        MeshLambertMaterial.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.color.copy(source.color);
            this.map = source.map;
            this.lightMap = source.lightMap;
            this.lightMapIntensity = source.lightMapIntensity;
            this.aoMap = source.aoMap;
            this.aoMapIntensity = source.aoMapIntensity;
            this.emissive.copy(source.emissive);
            this.emissiveMap = source.emissiveMap;
            this.emissiveIntensity = source.emissiveIntensity;
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
            this.morphNormals = source.morphNormals;
            return this;
        };
        ;
        return MeshLambertMaterial;
    }(THREE.Material));
    THREE.MeshLambertMaterial = MeshLambertMaterial;
})(THREE || (THREE = {}));
