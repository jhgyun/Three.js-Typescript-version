var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var CurvePath = (function (_super) {
        __extends(CurvePath, _super);
        function CurvePath() {
            _super.call(this);
            this.curves = [];
            this.autoClose = false;
        }
        ;
        CurvePath.prototype.add = function (curve) {
            this.curves.push(curve);
        };
        CurvePath.prototype.closePath = function () {
            var startPoint = this.curves[0].getPoint(0);
            var endPoint = this.curves[this.curves.length - 1].getPoint(1);
            if (!startPoint.equals(endPoint)) {
                this.curves.push(new THREE.LineCurve(endPoint, startPoint));
            }
        };
        CurvePath.prototype.getPoint = function (t) {
            var d = t * this.getLength();
            var curveLengths = this.getCurveLengths();
            var i = 0;
            while (i < curveLengths.length) {
                if (curveLengths[i] >= d) {
                    var diff = curveLengths[i] - d;
                    var curve = this.curves[i];
                    var segmentLength = curve.getLength();
                    var u = segmentLength === 0 ? 0 : 1 - diff / segmentLength;
                    return curve.getPointAt(u);
                }
                i++;
            }
            return null;
        };
        CurvePath.prototype.getLength = function () {
            var lens = this.getCurveLengths();
            return lens[lens.length - 1];
        };
        CurvePath.prototype.updateArcLengths = function () {
            this.needsUpdate = true;
            this.cacheLengths = null;
            this.getLengths();
        };
        CurvePath.prototype.getCurveLengths = function () {
            if (this.cacheLengths && this.cacheLengths.length === this.curves.length) {
                return this.cacheLengths;
            }
            var lengths = [], sums = 0;
            for (var i = 0, l = this.curves.length; i < l; i++) {
                sums += this.curves[i].getLength();
                lengths.push(sums);
            }
            this.cacheLengths = lengths;
            return lengths;
        };
        CurvePath.prototype.getSpacedPoints = function (divisions) {
            if (!divisions)
                divisions = 40;
            var points = [];
            for (var i = 0; i <= divisions; i++) {
                points.push(this.getPoint(i / divisions));
            }
            if (this.autoClose) {
                points.push(points[0]);
            }
            return points;
        };
        CurvePath.prototype.getPoints = function (divisions) {
            divisions = divisions || 12;
            var points = [], last;
            for (var i = 0, curves = this.curves; i < curves.length; i++) {
                var curve = curves[i];
                var resolution = curve instanceof THREE.EllipseCurve ? divisions * 2
                    : curve instanceof THREE.LineCurve ? 1
                        : curve instanceof THREE.SplineCurve ? divisions * curve.points.length
                            : divisions;
                var pts = curve.getPoints(resolution);
                for (var j = 0; j < pts.length; j++) {
                    var point = pts[j];
                    if (last && last.equals(point))
                        continue;
                    points.push(point);
                    last = point;
                }
            }
            if (this.autoClose && points.length > 1 && !points[points.length - 1].equals(points[0])) {
                points.push(points[0]);
            }
            return points;
        };
        CurvePath.prototype.createPointsGeometry = function (divisions) {
            var pts = this.getPoints(divisions);
            return this.createGeometry(pts);
        };
        CurvePath.prototype.createSpacedPointsGeometry = function (divisions) {
            var pts = this.getSpacedPoints(divisions);
            return this.createGeometry(pts);
        };
        CurvePath.prototype.createGeometry = function (points) {
            var geometry = new THREE.Geometry();
            for (var i = 0, l = points.length; i < l; i++) {
                var point = points[i];
                geometry.vertices.push(new THREE.Vector3(point.x, point.y, point.z || 0));
            }
            return geometry;
        };
        return CurvePath;
    }(THREE.Curve));
    THREE.CurvePath = CurvePath;
})(THREE || (THREE = {}));
