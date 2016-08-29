var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var LineDashedMaterial = (function (_super) {
        __extends(LineDashedMaterial, _super);
        function LineDashedMaterial(parameters) {
            _super.call(this);
            this.linewidth = 1;
            this.scale = 1;
            this.dashSize = 3;
            this.gapSize = 1;
            this.type = 'LineDashedMaterial';
            this.color = new THREE.Color(0xffffff);
            this.lights = false;
            this.setValues(parameters);
        }
        ;
        LineDashedMaterial.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.color.copy(source.color);
            this.linewidth = source.linewidth;
            this.scale = source.scale;
            this.dashSize = source.dashSize;
            this.gapSize = source.gapSize;
            return this;
        };
        ;
        return LineDashedMaterial;
    }(THREE.Material));
    THREE.LineDashedMaterial = LineDashedMaterial;
})(THREE || (THREE = {}));
