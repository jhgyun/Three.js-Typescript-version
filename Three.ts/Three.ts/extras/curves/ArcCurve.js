var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="ellipsecurve.ts" />
/* *************************************************************
 *	Arc curve
 **************************************************************/
var THREE;
(function (THREE) {
    var ArcCurve = (function (_super) {
        __extends(ArcCurve, _super);
        function ArcCurve(aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
            _super.call(this, aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);
        }
        ;
        return ArcCurve;
    }(THREE.EllipseCurve));
    THREE.ArcCurve = ArcCurve;
})(THREE || (THREE = {}));
