var THREE;
(function (THREE) {
    var Box3 = (function () {
        function Box3(min, max) {
            if (min === void 0) { min = new THREE.Vector3(+Infinity, +Infinity, +Infinity); }
            if (max === void 0) { max = new THREE.Vector3(-Infinity, -Infinity, -Infinity); }
            this.min = min;
            this.max = max;
        }
        Box3.prototype.set = function (min, max) {
            this.min.copy(min);
            this.max.copy(max);
            return this;
        };
        Box3.prototype.setFromArray = function (array) {
            var minX = +Infinity;
            var minY = +Infinity;
            var minZ = +Infinity;
            var maxX = -Infinity;
            var maxY = -Infinity;
            var maxZ = -Infinity;
            for (var i = 0, l = array.length; i < l; i += 3) {
                var x = array[i];
                var y = array[i + 1];
                var z = array[i + 2];
                if (x < minX)
                    minX = x;
                if (y < minY)
                    minY = y;
                if (z < minZ)
                    minZ = z;
                if (x > maxX)
                    maxX = x;
                if (y > maxY)
                    maxY = y;
                if (z > maxZ)
                    maxZ = z;
            }
            this.min.set(minX, minY, minZ);
            this.max.set(maxX, maxY, maxZ);
        };
        Box3.prototype.setFromPoints = function (points) {
            this.makeEmpty();
            for (var i = 0, il = points.length; i < il; i++) {
                this.expandByPoint(points[i]);
            }
            return this;
        };
        Box3.prototype.setFromCenterAndSize = function (center, size) {
            var v1 = new THREE.Vector3();
            var func = Box3.prototype.setFromCenterAndSize = function (center, size) {
                var halfSize = v1.copy(size).multiplyScalar(0.5);
                this.min.copy(center).sub(halfSize);
                this.max.copy(center).add(halfSize);
                return this;
            };
            return func.apply(this, arguments);
        };
        Box3.prototype.setFromObject = function (object) {
            var v1 = new THREE.Vector3();
            var func = Box3.prototype.setFromObject = function (object) {
                var scope = this;
                object.updateMatrixWorld(true);
                this.makeEmpty();
                object.traverse(function (node) {
                    var geometry = node.geometry;
                    if (geometry !== undefined) {
                        if (geometry instanceof THREE.Geometry) {
                            var vertices = geometry.vertices;
                            for (var i = 0, il = vertices.length; i < il; i++) {
                                v1.copy(vertices[i]);
                                v1.applyMatrix4(node.matrixWorld);
                                scope.expandByPoint(v1);
                            }
                        }
                        else if (geometry instanceof THREE.BufferGeometry) {
                            var attribute = geometry.attributes.position;
                            if (attribute !== undefined) {
                                var array, offset, stride;
                                if (attribute instanceof THREE.InterleavedBufferAttribute) {
                                    array = attribute.data.array;
                                    offset = attribute.offset;
                                    stride = attribute.data.stride;
                                }
                                else {
                                    array = attribute.array;
                                    offset = 0;
                                    stride = 3;
                                }
                                for (var i_1 = offset, il_1 = array.length; i_1 < il_1; i_1 += stride) {
                                    v1.fromArray(array, i_1);
                                    v1.applyMatrix4(node.matrixWorld);
                                    scope.expandByPoint(v1);
                                }
                            }
                        }
                    }
                });
                return this;
            };
            return func.apply(this, arguments);
        };
        Box3.prototype.clone = function () {
            return new Box3().copy(this);
        };
        Box3.prototype.copy = function (box) {
            this.min.copy(box.min);
            this.max.copy(box.max);
            return this;
        };
        Box3.prototype.makeEmpty = function () {
            this.min.x = this.min.y = this.min.z = +Infinity;
            this.max.x = this.max.y = this.max.z = -Infinity;
            return this;
        };
        Box3.prototype.isEmpty = function () {
            return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
        };
        Box3.prototype.center = function (optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            return result.addVectors(this.min, this.max).multiplyScalar(0.5);
        };
        Box3.prototype.size = function (optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            return result.subVectors(this.max, this.min);
        };
        Box3.prototype.expandByPoint = function (point) {
            this.min.min(point);
            this.max.max(point);
            return this;
        };
        Box3.prototype.expandByVector = function (vector) {
            this.min.sub(vector);
            this.max.add(vector);
            return this;
        };
        Box3.prototype.expandByScalar = function (scalar) {
            this.min.addScalar(-scalar);
            this.max.addScalar(scalar);
            return this;
        };
        Box3.prototype.containsPoint = function (point) {
            if (point.x < this.min.x || point.x > this.max.x ||
                point.y < this.min.y || point.y > this.max.y ||
                point.z < this.min.z || point.z > this.max.z) {
                return false;
            }
            return true;
        };
        Box3.prototype.containsBox = function (box) {
            if ((this.min.x <= box.min.x) && (box.max.x <= this.max.x) &&
                (this.min.y <= box.min.y) && (box.max.y <= this.max.y) &&
                (this.min.z <= box.min.z) && (box.max.z <= this.max.z)) {
                return true;
            }
            return false;
        };
        Box3.prototype.getParameter = function (point, optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            return result.set((point.x - this.min.x) / (this.max.x - this.min.x), (point.y - this.min.y) / (this.max.y - this.min.y), (point.z - this.min.z) / (this.max.z - this.min.z));
        };
        Box3.prototype.intersectsBox = function (box) {
            if (box.max.x < this.min.x || box.min.x > this.max.x ||
                box.max.y < this.min.y || box.min.y > this.max.y ||
                box.max.z < this.min.z || box.min.z > this.max.z) {
                return false;
            }
            return true;
        };
        Box3.prototype.intersectsSphere = function (sphere) {
            var closestPoint = new THREE.Vector3();
            var func = Box3.prototype.intersectsSphere = function (sphere) {
                this.clampPoint(sphere.center, closestPoint);
                var result = closestPoint.distanceToSquared(sphere.center) <= (sphere.radius * sphere.radius);
                return result;
            };
            return func.apply(this, arguments);
        };
        Box3.prototype.intersectsPlane = function (plane) {
            var min, max;
            if (plane.normal.x > 0) {
                min = plane.normal.x * this.min.x;
                max = plane.normal.x * this.max.x;
            }
            else {
                min = plane.normal.x * this.max.x;
                max = plane.normal.x * this.min.x;
            }
            if (plane.normal.y > 0) {
                min += plane.normal.y * this.min.y;
                max += plane.normal.y * this.max.y;
            }
            else {
                min += plane.normal.y * this.max.y;
                max += plane.normal.y * this.min.y;
            }
            if (plane.normal.z > 0) {
                min += plane.normal.z * this.min.z;
                max += plane.normal.z * this.max.z;
            }
            else {
                min += plane.normal.z * this.max.z;
                max += plane.normal.z * this.min.z;
            }
            return (min <= plane.constant && max >= plane.constant);
        };
        Box3.prototype.clampPoint = function (point, optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            return result.copy(point).clamp(this.min, this.max);
        };
        Box3.prototype.distanceToPoint = function (point) {
            var v1 = Box3.distanceToPoint_v1;
            var clampedPoint = v1.copy(point).clamp(this.min, this.max);
            var result = clampedPoint.sub(point).length();
            return result;
        };
        Box3.prototype.getBoundingSphere = function (optionalTarget) {
            var v1 = Box3.getBoundingSphere_v1;
            var result = optionalTarget || new THREE.Sphere();
            result.center = this.center();
            result.radius = this.size(v1).length() * 0.5;
            return result;
        };
        Box3.prototype.intersect = function (box) {
            this.min.max(box.min);
            this.max.min(box.max);
            if (this.isEmpty())
                this.makeEmpty();
            return this;
        };
        Box3.prototype.union = function (box) {
            this.min.min(box.min);
            this.max.max(box.max);
            return this;
        };
        Box3.prototype.applyMatrix4 = function (matrix) {
            if (Box3.applyMatrix4_points === undefined) {
                Box3.applyMatrix4_points = [
                    new THREE.Vector3(),
                    new THREE.Vector3(),
                    new THREE.Vector3(),
                    new THREE.Vector3(),
                    new THREE.Vector3(),
                    new THREE.Vector3(),
                    new THREE.Vector3(),
                    new THREE.Vector3()];
            }
            var points = Box3.applyMatrix4_points;
            if (this.isEmpty())
                return this;
            points[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(matrix);
            points[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(matrix);
            points[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(matrix);
            points[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(matrix);
            points[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(matrix);
            points[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(matrix);
            points[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(matrix);
            points[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(matrix);
            this.setFromPoints(points);
            return this;
        };
        Box3.prototype.translate = function (offset) {
            this.min.add(offset);
            this.max.add(offset);
            return this;
        };
        Box3.prototype.equals = function (box) {
            return box.min.equals(this.min) && box.max.equals(this.max);
        };
        Box3.distanceToPoint_v1 = new THREE.Vector3();
        Box3.getBoundingSphere_v1 = new THREE.Vector3();
        return Box3;
    }());
    THREE.Box3 = Box3;
    ;
})(THREE || (THREE = {}));
