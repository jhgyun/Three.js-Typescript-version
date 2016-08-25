/// <reference path="../core/curve.ts" />
/* *************************************************************
 *	Quadratic Bezier curve
 **************************************************************/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var QuadraticBezierCurve = (function (_super) {
        __extends(QuadraticBezierCurve, _super);
        function QuadraticBezierCurve(v0, v1, v2) {
            _super.call(this);
            this.v0 = v0;
            this.v1 = v1;
            this.v2 = v2;
        }
        ;
        QuadraticBezierCurve.prototype.getPoint = function (t) {
            var b2 = THREE.ShapeUtils.b2;
            return new THREE.Vector2(b2(t, this.v0.x, this.v1.x, this.v2.x), b2(t, this.v0.y, this.v1.y, this.v2.y));
        };
        ;
        QuadraticBezierCurve.prototype.getTangent = function (t) {
            var tangentQuadraticBezier = THREE.CurveUtils.tangentQuadraticBezier;
            return new THREE.Vector2(tangentQuadraticBezier(t, this.v0.x, this.v1.x, this.v2.x), tangentQuadraticBezier(t, this.v0.y, this.v1.y, this.v2.y)).normalize();
        };
        ;
        return QuadraticBezierCurve;
    }(THREE.Curve));
    THREE.QuadraticBezierCurve = QuadraticBezierCurve;
})(THREE || (THREE = {}));
