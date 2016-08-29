var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var CubicBezierCurve = (function (_super) {
        __extends(CubicBezierCurve, _super);
        function CubicBezierCurve(v0, v1, v2, v3) {
            _super.call(this);
            this.v0 = v0;
            this.v1 = v1;
            this.v2 = v2;
            this.v3 = v3;
        }
        ;
        CubicBezierCurve.prototype.getPoint = function (t) {
            var b3 = THREE.ShapeUtils.b3;
            return new THREE.Vector2(b3(t, this.v0.x, this.v1.x, this.v2.x, this.v3.x), b3(t, this.v0.y, this.v1.y, this.v2.y, this.v3.y));
        };
        ;
        CubicBezierCurve.prototype.getTangent = function (t) {
            var tangentCubicBezier = THREE.CurveUtils.tangentCubicBezier;
            return new THREE.Vector2(tangentCubicBezier(t, this.v0.x, this.v1.x, this.v2.x, this.v3.x), tangentCubicBezier(t, this.v0.y, this.v1.y, this.v2.y, this.v3.y)).normalize();
        };
        ;
        return CubicBezierCurve;
    }(THREE.Curve));
    THREE.CubicBezierCurve = CubicBezierCurve;
})(THREE || (THREE = {}));
