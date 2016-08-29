var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var CubicBezierCurve3 = (function (_super) {
        __extends(CubicBezierCurve3, _super);
        function CubicBezierCurve3(v0, v1, v2, v3) {
            _super.call(this);
            this.v0 = v0;
            this.v1 = v1;
            this.v2 = v2;
            this.v3 = v3;
        }
        CubicBezierCurve3.prototype.getPoint = function (t) {
            var b3 = THREE.ShapeUtils.b3;
            return new THREE.Vector3(b3(t, this.v0.x, this.v1.x, this.v2.x, this.v3.x), b3(t, this.v0.y, this.v1.y, this.v2.y, this.v3.y), b3(t, this.v0.z, this.v1.z, this.v2.z, this.v3.z));
        };
        return CubicBezierCurve3;
    }(THREE.Curve));
    THREE.CubicBezierCurve3 = CubicBezierCurve3;
})(THREE || (THREE = {}));
