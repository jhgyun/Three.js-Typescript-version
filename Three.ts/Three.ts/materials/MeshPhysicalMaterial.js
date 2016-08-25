/// <reference path="meshstandardmaterial.ts" />
/*
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *  reflectivity: <float>
 * }
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var MeshPhysicalMaterial = (function (_super) {
        __extends(MeshPhysicalMaterial, _super);
        function MeshPhysicalMaterial(parameters) {
            _super.call(this);
            this.clearCoat = 0.0;
            this.clearCoatRoughness = 0.0;
            this.defines = { 'PHYSICAL': '' };
            this.type = 'MeshPhysicalMaterial';
            this.reflectivity = 0.5; // maps to F0 = 0.04
            this.clearCoat = 0.0;
            this.clearCoatRoughness = 0.0;
            this.setValues(parameters);
        }
        ;
        MeshPhysicalMaterial.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.defines = { 'PHYSICAL': '' };
            this.reflectivity = source.reflectivity;
            this.clearCoat = source.clearCoat;
            this.clearCoatRoughness = source.clearCoatRoughness;
            return this;
        };
        ;
        return MeshPhysicalMaterial;
    }(THREE.MeshStandardMaterial));
    THREE.MeshPhysicalMaterial = MeshPhysicalMaterial;
})(THREE || (THREE = {}));
