/// <reference path="material.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author bhouston / https://clara.io
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  displacementMap: new THREE.Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>,
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
    var MeshDepthMaterial = (function (_super) {
        __extends(MeshDepthMaterial, _super);
        function MeshDepthMaterial(parameters) {
            _super.call(this);
            this.depthPacking = THREE.BasicDepthPacking;
            this.skinning = false;
            this.morphTargets = false;
            this.type = 'MeshDepthMaterial';
            this.map = null;
            this.alphaMap = null;
            this.displacementMap = null;
            this.displacementScale = 1;
            this.displacementBias = 0;
            this.wireframe = false;
            this.wireframeLinewidth = 1;
            this.fog = false;
            this.lights = false;
            this.setValues(parameters);
        }
        ;
        MeshDepthMaterial.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.depthPacking = source.depthPacking;
            this.skinning = source.skinning;
            this.morphTargets = source.morphTargets;
            this.map = source.map;
            this.alphaMap = source.alphaMap;
            this.displacementMap = source.displacementMap;
            this.displacementScale = source.displacementScale;
            this.displacementBias = source.displacementBias;
            this.wireframe = source.wireframe;
            this.wireframeLinewidth = source.wireframeLinewidth;
            return this;
        };
        ;
        return MeshDepthMaterial;
    }(THREE.Material));
    THREE.MeshDepthMaterial = MeshDepthMaterial;
})(THREE || (THREE = {}));
