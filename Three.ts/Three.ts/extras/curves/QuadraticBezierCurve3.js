var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var QuadraticBezierCurve3 = (function (_super) {
        __extends(QuadraticBezierCurve3, _super);
        function QuadraticBezierCurve3(v0, v1, v2) {
            _super.call(this);
            this.v0 = v0;
            this.v1 = v1;
            this.v2 = v2;
        }
        QuadraticBezierCurve3.prototype.getPoint = function (t) {
            var b2 = THREE.ShapeUtils.b2;
            return new THREE.Vector3(b2(t, this.v0.x, this.v1.x, this.v2.x), b2(t, this.v0.y, this.v1.y, this.v2.y), b2(t, this.v0.z, this.v1.z, this.v2.z));
        };
        return QuadraticBezierCurve3;
    }(THREE.Curve));
    THREE.QuadraticBezierCurve3 = QuadraticBezierCurve3;
})(THREE || (THREE = {}));
