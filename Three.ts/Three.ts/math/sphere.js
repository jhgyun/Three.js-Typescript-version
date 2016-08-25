/*
* @author bhouston / http://clara.io
* @author mrdoob / http://mrdoob.com/
*/
var THREE;
(function (THREE) {
    var Sphere = (function () {
        function Sphere(center, radius) {
            if (center === void 0) { center = new THREE.Vector3(); }
            if (radius === void 0) { radius = 0; }
            this.center = center;
            this.radius = radius;
        }
        Sphere.prototype.set = function (center, radius) {
            this.center.copy(center);
            this.radius = radius;
            return this;
        };
        Sphere.prototype.setFromPoints = function (points, optionalCenter) {
            var box = new THREE.Box3();
            var func = Sphere.prototype.setFromPoints = function (points, optionalCenter) {
                var center = this.center;
                if (optionalCenter !== undefined) {
                    center.copy(optionalCenter);
                }
                else {
                    box.setFromPoints(points).center(center);
                }
                var maxRadiusSq = 0;
                for (var i = 0, il = points.length; i < il; i++) {
                    maxRadiusSq = THREE.Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
                }
                this.radius = THREE.Math.sqrt(maxRadiusSq);
                return this;
            };
            return func.apply(this, arguments);
        };
        Sphere.prototype.clone = function () {
            return new Sphere().copy(this);
        };
        Sphere.prototype.copy = function (sphere) {
            this.center.copy(sphere.center);
            this.radius = sphere.radius;
            return this;
        };
        Sphere.prototype.empty = function () {
            return (this.radius <= 0);
        };
        Sphere.prototype.containsPoint = function (point) {
            return (point.distanceToSquared(this.center) <= (this.radius * this.radius));
        };
        Sphere.prototype.distanceToPoint = function (point) {
            return (point.distanceTo(this.center) - this.radius);
        };
        Sphere.prototype.intersectsSphere = function (sphere) {
            var radiusSum = this.radius + sphere.radius;
            return sphere.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);
        };
        Sphere.prototype.intersectsBox = function (box) {
            return box.intersectsSphere(this);
        };
        Sphere.prototype.intersectsPlane = function (plane) {
            // We use the following equation to compute the signed distance from
            // the center of the sphere to the plane.
            //
            // distance = q * n - d
            //
            // If this distance is greater than the radius of the sphere,
            // then there is no intersection. 
            return THREE.Math.abs(this.center.dot(plane.normal) - plane.constant) <= this.radius;
        };
        Sphere.prototype.clampPoint = function (point, optionalTarget) {
            var deltaLengthSq = this.center.distanceToSquared(point);
            var result = optionalTarget || new THREE.Vector3();
            result.copy(point);
            if (deltaLengthSq > (this.radius * this.radius)) {
                result.sub(this.center).normalize();
                result.multiplyScalar(this.radius).add(this.center);
            }
            return result;
        };
        Sphere.prototype.getBoundingBox = function (optionalTarget) {
            var box = optionalTarget || new THREE.Box3();
            box.set(this.center, this.center);
            box.expandByScalar(this.radius);
            return box;
        };
        Sphere.prototype.applyMatrix4 = function (matrix) {
            this.center.applyMatrix4(matrix);
            this.radius = this.radius * matrix.getMaxScaleOnAxis();
            return this;
        };
        Sphere.prototype.translate = function (offset) {
            this.center.add(offset);
            return this;
        };
        Sphere.prototype.equals = function (sphere) {
            return sphere.center.equals(this.center) && (sphere.radius === this.radius);
        };
        return Sphere;
    }());
    THREE.Sphere = Sphere;
    ;
})(THREE || (THREE = {}));
