var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var MeshPhongMaterial = (function (_super) {
        __extends(MeshPhongMaterial, _super);
        function MeshPhongMaterial(parameters) {
            _super.call(this);
            this.type = 'MeshPhongMaterial';
            this.color = new THREE.Color(0xffffff);
            this.specular = new THREE.Color(0x111111);
            this.shininess = 30;
            this.map = null;
            this.lightMap = null;
            this.lightMapIntensity = 1.0;
            this.aoMap = null;
            this.aoMapIntensity = 1.0;
            this.emissive = new THREE.Color(0x000000);
            this.emissiveIntensity = 1.0;
            this.emissiveMap = null;
            this.bumpMap = null;
            this.bumpScale = 1;
            this.normalMap = null;
            this.normalScale = new THREE.Vector2(1, 1);
            this.displacementMap = null;
            this.displacementScale = 1;
            this.displacementBias = 0;
            this.specularMap = null;
            this.alphaMap = null;
            this.envMap = null;
            this.combine = THREE.MultiplyOperation;
            this.reflectivity = 1;
            this.refractionRatio = 0.98;
            this.wireframe = false;
            this.wireframeLinewidth = 1;
            this.wireframeLinecap = 'round';
            this.wireframeLinejoin = 'round';
            this.skinning = false;
            this.morphTargets = false;
            this.morphNormals = false;
            this.setValues(parameters);
        }
        ;
        MeshPhongMaterial.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.color.copy(source.color);
            this.specular.copy(source.specular);
            this.shininess = source.shininess;
            this.map = source.map;
            this.lightMap = source.lightMap;
            this.lightMapIntensity = source.lightMapIntensity;
            this.aoMap = source.aoMap;
            this.aoMapIntensity = source.aoMapIntensity;
            this.emissive.copy(source.emissive);
            this.emissiveMap = source.emissiveMap;
            this.emissiveIntensity = source.emissiveIntensity;
            this.bumpMap = source.bumpMap;
            this.bumpScale = source.bumpScale;
            this.normalMap = source.normalMap;
            this.normalScale.copy(source.normalScale);
            this.displacementMap = source.displacementMap;
            this.displacementScale = source.displacementScale;
            this.displacementBias = source.displacementBias;
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
        return MeshPhongMaterial;
    }(THREE.Material));
    THREE.MeshPhongMaterial = MeshPhongMaterial;
})(THREE || (THREE = {}));
