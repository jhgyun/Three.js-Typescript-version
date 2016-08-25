/*
* @author bhouston / http://clara.io
*/
var THREE;
(function (THREE) {
    var Line3 = (function () {
        function Line3(start, end) {
            if (start === void 0) { start = new THREE.Vector3(); }
            if (end === void 0) { end = new THREE.Vector3(); }
            this.start = start;
            this.end = end;
        }
        Line3.prototype.set = function (start, end) {
            this.start.copy(start);
            this.end.copy(end);
            return this;
        };
        Line3.prototype.clone = function () {
            return new Line3().copy(this);
        };
        Line3.prototype.copy = function (line) {
            this.start.copy(line.start);
            this.end.copy(line.end);
            return this;
        };
        Line3.prototype.center = function (optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            return result.addVectors(this.start, this.end).multiplyScalar(0.5);
        };
        Line3.prototype.delta = function (optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            return result.subVectors(this.end, this.start);
        };
        Line3.prototype.distanceSq = function () {
            return this.start.distanceToSquared(this.end);
        };
        Line3.prototype.distance = function () {
            return this.start.distanceTo(this.end);
        };
        Line3.prototype.at = function (t, optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            return this.delta(result).multiplyScalar(t).add(this.start);
        };
        Line3.prototype.closestPointToPointParameter = function (point, clampToLine) {
            var startP = new THREE.Vector3();
            var startEnd = new THREE.Vector3();
            var func = Line3.prototype.closestPointToPointParameter = function (point, clampToLine) {
                startP.subVectors(point, this.start);
                startEnd.subVectors(this.end, this.start);
                var startEnd2 = startEnd.dot(startEnd);
                var startEnd_startP = startEnd.dot(startP);
                var t = startEnd_startP / startEnd2;
                if (clampToLine) {
                    t = THREE.Math.clamp(t, 0, 1);
                }
                return t;
            };
            return func.apply(this, arguments);
        };
        Line3.prototype.closestPointToPoint = function (point, clampToLine, optionalTarget) {
            var t = this.closestPointToPointParameter(point, clampToLine);
            var result = optionalTarget || new THREE.Vector3();
            return this.delta(result).multiplyScalar(t).add(this.start);
        };
        Line3.prototype.applyMatrix4 = function (matrix) {
            this.start.applyMatrix4(matrix);
            this.end.applyMatrix4(matrix);
            return this;
        };
        Line3.prototype.equals = function (line) {
            return line.start.equals(this.start) && line.end.equals(this.end);
        };
        return Line3;
    }());
    THREE.Line3 = Line3;
    ;
})(THREE || (THREE = {}));
