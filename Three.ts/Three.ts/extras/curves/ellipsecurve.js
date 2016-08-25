var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../core/curve.ts" />
/* *************************************************************
 *	Ellipse curve
 **************************************************************/
var THREE;
(function (THREE) {
    var EllipseCurve = (function (_super) {
        __extends(EllipseCurve, _super);
        function EllipseCurve(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
            _super.call(this);
            this.aX = aX;
            this.aY = aY;
            this.xRadius = xRadius;
            this.yRadius = yRadius;
            this.aStartAngle = aStartAngle;
            this.aEndAngle = aEndAngle;
            this.aClockwise = aClockwise;
            this.aRotation = aRotation || 0;
        }
        ;
        EllipseCurve.prototype.getPoint = function (t) {
            var deltaAngle = this.aEndAngle - this.aStartAngle;
            if (deltaAngle < 0)
                deltaAngle += THREE.Math.PI * 2;
            if (deltaAngle > THREE.Math.PI * 2)
                deltaAngle -= THREE.Math.PI * 2;
            var angle;
            if (this.aClockwise === true) {
                angle = this.aEndAngle + (1 - t) * (THREE.Math.PI * 2 - deltaAngle);
            }
            else {
                angle = this.aStartAngle + t * deltaAngle;
            }
            var x = this.aX + this.xRadius * THREE.Math.cos(angle);
            var y = this.aY + this.yRadius * THREE.Math.sin(angle);
            if (this.aRotation !== 0) {
                var cos = THREE.Math.cos(this.aRotation);
                var sin = THREE.Math.sin(this.aRotation);
                var tx = x, ty = y;
                // Rotate the point about the center of the ellipse.
                x = (tx - this.aX) * cos - (ty - this.aY) * sin + this.aX;
                y = (tx - this.aX) * sin + (ty - this.aY) * cos + this.aY;
            }
            return new THREE.Vector2(x, y);
        };
        ;
        return EllipseCurve;
    }(THREE.Curve));
    THREE.EllipseCurve = EllipseCurve;
})(THREE || (THREE = {}));
