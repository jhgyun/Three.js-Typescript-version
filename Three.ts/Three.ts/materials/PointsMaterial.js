var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var PointsMaterial = (function (_super) {
        __extends(PointsMaterial, _super);
        function PointsMaterial(parameters) {
            _super.call(this);
            this.type = 'PointsMaterial';
            this.color = new THREE.Color(0xffffff);
            this.map = null;
            this.size = 1;
            this.lights = false;
            this.sizeAttenuation = true;
            this.setValues(parameters);
        }
        ;
        PointsMaterial.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.color.copy(source.color);
            this.map = source.map;
            this.size = source.size;
            this.sizeAttenuation = source.sizeAttenuation;
            return this;
        };
        ;
        return PointsMaterial;
    }(THREE.Material));
    THREE.PointsMaterial = PointsMaterial;
})(THREE || (THREE = {}));
