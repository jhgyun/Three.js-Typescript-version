/*
* Spline from Tween.js, slightly optimized (and trashed)
* http://sole.github.com/tween.js/examples/05_spline.html
*
* @author mrdoob / http://mrdoob.com/
* @author alteredq / http://alteredqualia.com/
*/
var THREE;
(function (THREE) {
    var Spline = (function () {
        function Spline(points) {
            this.c = [0, 0, 0, 0];
            this.v3 = new THREE.Vector3();
            this.points = points;
        }
        Spline.prototype.initFromArray = function (a) {
            this.points = [];
            for (var i = 0; i < a.length; i++) {
                this.points[i] = new THREE.Vector3(a[i][0], a[i][1], a[i][2]);
            }
        };
        ;
        Spline.prototype.getPoint = function (k) {
            var point = (this.points.length - 1) * k;
            var intPoint = THREE.Math.floor(point);
            var weight = point - intPoint;
            var c = this.c;
            c[0] = intPoint === 0 ? intPoint : intPoint - 1;
            c[1] = intPoint;
            c[2] = intPoint > this.points.length - 2 ? this.points.length - 1 : intPoint + 1;
            c[3] = intPoint > this.points.length - 3 ? this.points.length - 1 : intPoint + 2;
            var pa = this.points[c[0]];
            var pb = this.points[c[1]];
            var pc = this.points[c[2]];
            var pd = this.points[c[3]];
            var w2 = weight * weight;
            var w3 = weight * w2;
            var v3 = this.v3;
            v3.x = Spline.interpolate(pa.x, pb.x, pc.x, pd.x, weight, w2, w3);
            v3.y = Spline.interpolate(pa.y, pb.y, pc.y, pd.y, weight, w2, w3);
            v3.z = Spline.interpolate(pa.z, pb.z, pc.z, pd.z, weight, w2, w3);
            return this.v3;
        };
        ;
        Spline.prototype.getControlPointsArray = function () {
            var i;
            var p;
            var l = this.points.length;
            var coords = [];
            for (i = 0; i < l; i++) {
                p = this.points[i];
                coords[i] = [p.x, p.y, p.z];
            }
            return coords;
        };
        Spline.prototype.getLength = function (nSubDivisions) {
            var i, index, nSamples, position, point = 0, intPoint = 0, oldIntPoint = 0, oldPosition = new THREE.Vector3(), tmpVec = new THREE.Vector3(), chunkLengths = [], totalLength = 0;
            // first point has 0 length
            chunkLengths[0] = 0;
            if (!nSubDivisions)
                nSubDivisions = 100;
            nSamples = this.points.length * nSubDivisions;
            oldPosition.copy(this.points[0]);
            for (i = 1; i < nSamples; i++) {
                index = i / nSamples;
                position = this.getPoint(index);
                tmpVec.copy(position);
                totalLength += tmpVec.distanceTo(oldPosition);
                oldPosition.copy(position);
                point = (this.points.length - 1) * index;
                intPoint = THREE.Math.floor(point);
                if (intPoint !== oldIntPoint) {
                    chunkLengths[intPoint] = totalLength;
                    oldIntPoint = intPoint;
                }
            }
            // last point ends with total length
            chunkLengths[chunkLengths.length] = totalLength;
            return { chunks: chunkLengths, total: totalLength };
        };
        Spline.interpolate = function (p0, p1, p2, p3, t, t2, t3) {
            var v0 = (p2 - p0) * 0.5, v1 = (p3 - p1) * 0.5;
            return (2 * (p1 - p2) + v0 + v1) * t3 + (-3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
        };
        return Spline;
    }());
    THREE.Spline = Spline;
})(THREE || (THREE = {}));
