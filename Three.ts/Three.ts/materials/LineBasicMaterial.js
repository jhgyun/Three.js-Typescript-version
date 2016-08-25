/// <reference path="material.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  linewidth: <float>,
 *  linecap: "round",
 *  linejoin: "round"
 * }
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var LineBasicMaterial = (function (_super) {
        __extends(LineBasicMaterial, _super);
        function LineBasicMaterial(parameters) {
            _super.call(this);
            this.linewidth = 1;
            this.linecap = 'round';
            this.linejoin = 'round';
            this.type = 'LineBasicMaterial';
            this.color = new THREE.Color(0xffffff);
            this.lights = false;
            this.setValues(parameters);
        }
        ;
        LineBasicMaterial.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.color.copy(source.color);
            this.linewidth = source.linewidth;
            this.linecap = source.linecap;
            this.linejoin = source.linejoin;
            return this;
        };
        ;
        return LineBasicMaterial;
    }(THREE.Material));
    THREE.LineBasicMaterial = LineBasicMaterial;
})(THREE || (THREE = {}));
