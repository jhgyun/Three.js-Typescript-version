/// <reference path="material.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 *
 * parameters = {
 *  opacity: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var MeshNormalMaterial = (function (_super) {
        __extends(MeshNormalMaterial, _super);
        function MeshNormalMaterial(parameters) {
            _super.call(this);
            this.morphTargets = false;
            this.type = 'MeshNormalMaterial';
            this.wireframe = false;
            this.wireframeLinewidth = 1;
            this.fog = false;
            this.lights = false;
            this.setValues(parameters);
        }
        MeshNormalMaterial.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.wireframe = source.wireframe;
            this.wireframeLinewidth = source.wireframeLinewidth;
            return this;
        };
        return MeshNormalMaterial;
    }(THREE.Material));
    THREE.MeshNormalMaterial = MeshNormalMaterial;
})(THREE || (THREE = {}));
