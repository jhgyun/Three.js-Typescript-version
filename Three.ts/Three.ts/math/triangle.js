/*
* @author bhouston / http://clara.io
* @author mrdoob / http://mrdoob.com/
*/
var THREE;
(function (THREE) {
    var Triangle = (function () {
        function Triangle(a, b, c) {
            if (a === void 0) { a = new THREE.Vector3(); }
            if (b === void 0) { b = new THREE.Vector3(); }
            if (c === void 0) { c = new THREE.Vector3(); }
            this.a = a;
            this.b = b;
            this.c = c;
        }
        Triangle.normal = function (a, b, c, optionalTarget) {
            var v0 = new THREE.Vector3();
            var func = Triangle.normal = function (a, b, c, optionalTarget) {
                var result = optionalTarget || new THREE.Vector3();
                result.subVectors(c, b);
                v0.subVectors(a, b);
                result.cross(v0);
                var resultLengthSq = result.lengthSq();
                if (resultLengthSq > 0) {
                    return result.multiplyScalar(1 / THREE.Math.sqrt(resultLengthSq));
                }
                return result.set(0, 0, 0);
            };
            return func.apply(this, arguments);
        };
        Triangle.barycoordFromPoint = function (point, a, b, c, optionalTarget) {
            // static/instance method to calculate barycentric coordinates
            // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
            var v0 = new THREE.Vector3();
            var v1 = new THREE.Vector3();
            var v2 = new THREE.Vector3();
            var func = Triangle.barycoordFromPoint = function (point, a, b, c, optionalTarget) {
                v0.subVectors(c, a);
                v1.subVectors(b, a);
                v2.subVectors(point, a);
                var dot00 = v0.dot(v0);
                var dot01 = v0.dot(v1);
                var dot02 = v0.dot(v2);
                var dot11 = v1.dot(v1);
                var dot12 = v1.dot(v2);
                var denom = (dot00 * dot11 - dot01 * dot01);
                var result = optionalTarget || new THREE.Vector3();
                // collinear or singular triangle
                if (denom === 0) {
                    // arbitrary location outside of triangle?
                    // not sure if this is the best idea, maybe should be returning undefined
                    return result.set(-2, -1, -1);
                }
                var invDenom = 1 / denom;
                var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
                var v = (dot00 * dot12 - dot01 * dot02) * invDenom;
                // barycentric coordinates must always sum to 1
                return result.set(1 - u - v, v, u);
            };
            return func.apply(this, arguments);
        };
        Triangle.containsPoint = function (point, a, b, c) {
            var v1 = new THREE.Vector3();
            var func = Triangle.containsPoint = function (point, a, b, c) {
                var result = Triangle.barycoordFromPoint(point, a, b, c, v1);
                var r = (result.x >= 0) && (result.y >= 0) && ((result.x + result.y) <= 1);
                return r;
            };
            return func.apply(this, arguments);
        };
        Triangle.prototype.set = function (a, b, c) {
            this.a.copy(a);
            this.b.copy(b);
            this.c.copy(c);
            return this;
        };
        Triangle.prototype.setFromPointsAndIndices = function (points, i0, i1, i2) {
            this.a.copy(points[i0]);
            this.b.copy(points[i1]);
            this.c.copy(points[i2]);
            return this;
        };
        Triangle.prototype.clone = function () {
            return new Triangle().copy(this);
        };
        Triangle.prototype.copy = function (triangle) {
            this.a.copy(triangle.a);
            this.b.copy(triangle.b);
            this.c.copy(triangle.c);
            return this;
        };
        Triangle.prototype.area = function () {
            var v0 = new THREE.Vector3();
            var v1 = new THREE.Vector3();
            var func = Triangle.prototype.area = function () {
                v0.subVectors(this.c, this.b);
                v1.subVectors(this.a, this.b);
                var area = v0.cross(v1).length() * 0.5;
                return area;
            };
            return func.apply(this, arguments);
        };
        Triangle.prototype.midpoint = function (optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            return result.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
        };
        Triangle.prototype.normal = function (optionalTarget) {
            return Triangle.normal(this.a, this.b, this.c, optionalTarget);
        };
        Triangle.prototype.plane = function (optionalTarget) {
            var result = optionalTarget || new THREE.Plane();
            return result.setFromCoplanarPoints(this.a, this.b, this.c);
        };
        Triangle.prototype.barycoordFromPoint = function (point, optionalTarget) {
            return Triangle.barycoordFromPoint(point, this.a, this.b, this.c, optionalTarget);
        };
        Triangle.prototype.containsPoint = function (point) {
            return Triangle.containsPoint(point, this.a, this.b, this.c);
        };
        Triangle.prototype.closestPointToPoint = function (point, optionalTarget) {
            var plane = new THREE.Plane();
            var edgeList = [new THREE.Line3(), new THREE.Line3(), new THREE.Line3()];
            var projectedPoint = new THREE.Vector3();
            var closestPoint = new THREE.Vector3();
            var func = Triangle.prototype.closestPointToPoint = function (point, optionalTarget) {
                var result = optionalTarget || new THREE.Vector3();
                var minDistance = Infinity;
                // project the point onto the plane of the triangle
                plane.setFromCoplanarPoints(this.a, this.b, this.c);
                plane.projectPoint(point, projectedPoint);
                // check if the projection lies within the triangle
                if (this.containsPoint(projectedPoint) === true) {
                    // if so, this is the closest point 
                    result.copy(projectedPoint);
                }
                else {
                    // if not, the point falls outside the triangle. the result is the closest point to the triangle's edges or vertices
                    edgeList[0].set(this.a, this.b);
                    edgeList[1].set(this.b, this.c);
                    edgeList[2].set(this.c, this.a);
                    for (var i = 0; i < edgeList.length; i++) {
                        edgeList[i].closestPointToPoint(projectedPoint, true, closestPoint);
                        var distance = projectedPoint.distanceToSquared(closestPoint);
                        if (distance < minDistance) {
                            minDistance = distance;
                            result.copy(closestPoint);
                        }
                    }
                }
                return result;
            };
            return func.apply(this, arguments);
        };
        Triangle.prototype.equals = function (triangle) {
            return triangle.a.equals(this.a) && triangle.b.equals(this.b) && triangle.c.equals(this.c);
        };
        return Triangle;
    }());
    THREE.Triangle = Triangle;
    ;
})(THREE || (THREE = {}));
