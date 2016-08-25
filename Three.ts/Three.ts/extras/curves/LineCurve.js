/// <reference path="../core/curve.ts" />
/* *************************************************************
 *	Line
 **************************************************************/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var LineCurve = (function (_super) {
        __extends(LineCurve, _super);
        function LineCurve(v1, v2) {
            _super.call(this);
            this.v1 = v1;
            this.v2 = v2;
        }
        ;
        LineCurve.prototype.getPoint = function (t) {
            var point = this.v2.clone().sub(this.v1);
            point.multiplyScalar(t).add(this.v1);
            return point;
        };
        ;
        /** Line curve is linear, so we can overwrite default getPointAt */
        LineCurve.prototype.getPointAt = function (u) {
            return this.getPoint(u);
        };
        ;
        LineCurve.prototype.getTangent = function (t) {
            var tangent = this.v2.clone().sub(this.v1);
            return tangent.normalize();
        };
        ;
        return LineCurve;
    }(THREE.Curve));
    THREE.LineCurve = LineCurve;
})(THREE || (THREE = {}));
