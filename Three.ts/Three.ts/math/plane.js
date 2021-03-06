var THREE;
(function (THREE) {
    var Plane = (function () {
        function Plane(normal, constant) {
            if (normal === void 0) { normal = new THREE.Vector3(1, 0, 0); }
            if (constant === void 0) { constant = 0; }
            this.normal = normal;
            this.constant = constant;
        }
        Plane.prototype.set = function (normal, constant) {
            this.normal.copy(normal);
            this.constant = constant;
            return this;
        };
        Plane.prototype.setComponents = function (x, y, z, w) {
            this.normal.set(x, y, z);
            this.constant = w;
            return this;
        };
        Plane.prototype.setFromNormalAndCoplanarPoint = function (normal, point) {
            this.normal.copy(normal);
            this.constant = -point.dot(this.normal);
            return this;
        };
        Plane.prototype.setFromCoplanarPoints = function (a, b, c) {
            var v1 = new THREE.Vector3();
            var v2 = new THREE.Vector3();
            var func = Plane.prototype.setFromCoplanarPoints = function (a, b, c) {
                var normal = v1.subVectors(c, b).cross(v2.subVectors(a, b)).normalize();
                this.setFromNormalAndCoplanarPoint(normal, a);
                return this;
            };
            return func.apply(this, arguments);
        };
        Plane.prototype.clone = function () {
            return new Plane().copy(this);
        };
        Plane.prototype.copy = function (plane) {
            this.normal.copy(plane.normal);
            this.constant = plane.constant;
            return this;
        };
        Plane.prototype.normalize = function () {
            var inverseNormalLength = 1.0 / this.normal.length();
            this.normal.multiplyScalar(inverseNormalLength);
            this.constant *= inverseNormalLength;
            return this;
        };
        Plane.prototype.negate = function () {
            this.constant *= -1;
            this.normal.negate();
            return this;
        };
        Plane.prototype.distanceToPoint = function (point) {
            return this.normal.dot(point) + this.constant;
        };
        Plane.prototype.distanceToSphere = function (sphere) {
            return this.distanceToPoint(sphere.center) - sphere.radius;
        };
        Plane.prototype.projectPoint = function (point, optionalTarget) {
            return this.orthoPoint(point, optionalTarget).sub(point).negate();
        };
        Plane.prototype.orthoPoint = function (point, optionalTarget) {
            var perpendicularMagnitude = this.distanceToPoint(point);
            var result = optionalTarget || new THREE.Vector3();
            return result.copy(this.normal).multiplyScalar(perpendicularMagnitude);
        };
        Plane.prototype.intersectLine = function (line, optionalTarget) {
            var v1 = new THREE.Vector3();
            var func = Plane.prototype.intersectLine = function (line, optionalTarget) {
                var result = optionalTarget || new THREE.Vector3();
                var direction = line.delta(v1);
                var denominator = this.normal.dot(direction);
                if (denominator === 0) {
                    if (this.distanceToPoint(line.start) === 0) {
                        return result.copy(line.start);
                    }
                    return undefined;
                }
                var t = -(line.start.dot(this.normal) + this.constant) / denominator;
                if (t < 0 || t > 1) {
                    return undefined;
                }
                result.copy(direction).multiplyScalar(t).add(line.start);
                return result;
            };
            return func.apply(this, arguments);
        };
        Plane.prototype.intersectsLine = function (line) {
            var startSign = this.distanceToPoint(line.start);
            var endSign = this.distanceToPoint(line.end);
            return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);
        };
        Plane.prototype.intersectsBox = function (box) {
            return box.intersectsPlane(this);
        };
        Plane.prototype.intersectsSphere = function (sphere) {
            return sphere.intersectsPlane(this);
        };
        Plane.prototype.coplanarPoint = function (optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            return result.copy(this.normal).multiplyScalar(-this.constant);
        };
        Plane.prototype.applyMatrix4 = function (matrix, optionalNormalMatrix) {
            var v1 = new THREE.Vector3;
            var m1 = new THREE.Matrix3;
            var func = Plane.prototype.applyMatrix4 = function (matrix, optionalNormalMatrix) {
                var referencePoint = this.coplanarPoint(v1).applyMatrix4(matrix);
                var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix(matrix);
                var normal = this.normal.applyMatrix3(normalMatrix).normalize();
                this.constant = -referencePoint.dot(normal);
                return this;
            };
            return func.apply(this, arguments);
        };
        Plane.prototype.translate = function (offset) {
            this.constant = this.constant - offset.dot(this.normal);
            return this;
        };
        Plane.prototype.equals = function (plane) {
            return plane.normal.equals(this.normal) && (plane.constant === this.constant);
        };
        return Plane;
    }());
    THREE.Plane = Plane;
    ;
})(THREE || (THREE = {}));
