var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var SplineCurve = (function (_super) {
        __extends(SplineCurve, _super);
        function SplineCurve(points) {
            _super.call(this);
            this.points = (points == undefined) ? [] : points;
        }
        ;
        SplineCurve.prototype.getPoint = function (t) {
            var points = this.points;
            var point = (points.length - 1) * t;
            var intPoint = THREE.Math.floor(point);
            var weight = point - intPoint;
            var point0 = points[intPoint === 0 ? intPoint : intPoint - 1];
            var point1 = points[intPoint];
            var point2 = points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1];
            var point3 = points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2];
            var interpolate = THREE.CurveUtils.interpolate;
            return new THREE.Vector2(interpolate(point0.x, point1.x, point2.x, point3.x, weight), interpolate(point0.y, point1.y, point2.y, point3.y, weight));
        };
        ;
        return SplineCurve;
    }(THREE.Curve));
    THREE.SplineCurve = SplineCurve;
})(THREE || (THREE = {}));
