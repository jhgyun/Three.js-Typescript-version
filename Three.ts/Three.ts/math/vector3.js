var THREE;
(function (THREE) {
    var Vector3 = (function () {
        function Vector3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Vector3.prototype.set = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        Vector3.prototype.setScalar = function (scalar) {
            this.x = scalar;
            this.y = scalar;
            this.z = scalar;
            return this;
        };
        Vector3.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Vector3.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        Vector3.prototype.setZ = function (z) {
            this.z = z;
            return this;
        };
        Vector3.prototype.setComponent = function (index, value) {
            switch (index) {
                case 0:
                    this.x = value;
                    break;
                case 1:
                    this.y = value;
                    break;
                case 2:
                    this.z = value;
                    break;
                default: throw new Error('index is out of range: ' + index);
            }
        };
        Vector3.prototype.getComponent = function (index) {
            switch (index) {
                case 0: return this.x;
                case 1: return this.y;
                case 2: return this.z;
                default: throw new Error('index is out of range: ' + index);
            }
        };
        Vector3.prototype.clone = function () {
            return new Vector3(this.x, this.y, this.z);
        };
        Vector3.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        };
        Vector3.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        };
        Vector3.prototype.addScalar = function (s) {
            this.x += s;
            this.y += s;
            this.z += s;
            return this;
        };
        Vector3.prototype.addVectors = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            return this;
        };
        Vector3.prototype.addScaledVector = function (v, s) {
            this.x += v.x * s;
            this.y += v.y * s;
            this.z += v.z * s;
            return this;
        };
        Vector3.prototype.sub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            return this;
        };
        Vector3.prototype.subScalar = function (s) {
            this.x -= s;
            this.y -= s;
            this.z -= s;
            return this;
        };
        Vector3.prototype.subVectors = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            return this;
        };
        Vector3.prototype.multiply = function (v) {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
            return this;
        };
        Vector3.prototype.multiplyScalar = function (scalar) {
            if (isFinite(scalar)) {
                this.x *= scalar;
                this.y *= scalar;
                this.z *= scalar;
            }
            else {
                this.x = 0;
                this.y = 0;
                this.z = 0;
            }
            return this;
        };
        Vector3.prototype.multiplyVectors = function (a, b) {
            this.x = a.x * b.x;
            this.y = a.y * b.y;
            this.z = a.z * b.z;
            return this;
        };
        Vector3.prototype.applyEuler = function (euler) {
            var quaternion = new THREE.Quaternion();
            var func = Vector3.prototype.applyEuler = function (euler) {
                this.applyQuaternion(quaternion.setFromEuler(euler));
                return this;
            };
            return func.apply(this, arguments);
        };
        Vector3.prototype.applyAxisAngle = function (axis, angle) {
            var quaternion = new THREE.Quaternion();
            var func = Vector3.prototype.applyAxisAngle = function (axis, angle) {
                this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle));
                return this;
            };
            return func.apply(this, arguments);
        };
        Vector3.prototype.applyMatrix3 = function (m) {
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;
            this.x = e[0] * x + e[3] * y + e[6] * z;
            this.y = e[1] * x + e[4] * y + e[7] * z;
            this.z = e[2] * x + e[5] * y + e[8] * z;
            return this;
        };
        Vector3.prototype.applyMatrix4 = function (m) {
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;
            this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
            this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
            this.z = e[2] * x + e[6] * y + e[10] * z + e[14];
            return this;
        };
        Vector3.prototype.applyProjection = function (m) {
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;
            var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
            this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
            this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
            this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;
            return this;
        };
        Vector3.prototype.applyQuaternion = function (q) {
            var x = this.x, y = this.y, z = this.z;
            var qx = q.x, qy = q.y, qz = q.z, qw = q.w;
            var ix = qw * x + qy * z - qz * y;
            var iy = qw * y + qz * x - qx * z;
            var iz = qw * z + qx * y - qy * x;
            var iw = -qx * x - qy * y - qz * z;
            this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
            this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
            this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
            return this;
        };
        Vector3.prototype.project = function (camera) {
            var matrix = new THREE.Matrix4();
            var func = Vector3.prototype.project
                = function (camera) {
                    matrix.multiplyMatrices(camera.projectionMatrix, matrix.getInverse(camera.matrixWorld));
                    this.applyProjection(matrix);
                    return this;
                };
            return func.apply(this, arguments);
        };
        Vector3.prototype.unproject = function (camera) {
            var matrix = new THREE.Matrix4();
            var func = Vector3.prototype.unproject
                = function (camera) {
                    matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(camera.projectionMatrix));
                    this.applyProjection(matrix);
                    return this;
                };
            return func.apply(this, arguments);
        };
        Vector3.prototype.transformDirection = function (m) {
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;
            this.x = e[0] * x + e[4] * y + e[8] * z;
            this.y = e[1] * x + e[5] * y + e[9] * z;
            this.z = e[2] * x + e[6] * y + e[10] * z;
            return this.normalize();
        };
        Vector3.prototype.divide = function (v) {
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;
            return this;
        };
        Vector3.prototype.divideScalar = function (scalar) {
            return this.multiplyScalar(1 / scalar);
        };
        Vector3.prototype.min = function (v) {
            this.x = THREE.Math.min(this.x, v.x);
            this.y = THREE.Math.min(this.y, v.y);
            this.z = THREE.Math.min(this.z, v.z);
            return this;
        };
        Vector3.prototype.max = function (v) {
            this.x = THREE.Math.max(this.x, v.x);
            this.y = THREE.Math.max(this.y, v.y);
            this.z = THREE.Math.max(this.z, v.z);
            return this;
        };
        Vector3.prototype.clamp = function (min, max) {
            this.x = THREE.Math.max(min.x, THREE.Math.min(max.x, this.x));
            this.y = THREE.Math.max(min.y, THREE.Math.min(max.y, this.y));
            this.z = THREE.Math.max(min.z, THREE.Math.min(max.z, this.z));
            return this;
        };
        Vector3.prototype.clampScalar = function (minVal, maxVal) {
            var min = new Vector3();
            var max = new Vector3();
            var func = Vector3.prototype.clampScalar
                = function (minVal, maxVal) {
                    min.set(minVal, minVal, minVal);
                    max.set(maxVal, maxVal, maxVal);
                    this.clamp(min, max);
                    return this;
                };
            return func.apply(this, arguments);
        };
        Vector3.prototype.clampLength = function (min, max) {
            var length = this.length();
            return this.multiplyScalar(THREE.Math.max(min, THREE.Math.min(max, length)) / length);
        };
        Vector3.prototype.floor = function () {
            this.x = THREE.Math.floor(this.x);
            this.y = THREE.Math.floor(this.y);
            this.z = THREE.Math.floor(this.z);
            return this;
        };
        Vector3.prototype.ceil = function () {
            this.x = THREE.Math.ceil(this.x);
            this.y = THREE.Math.ceil(this.y);
            this.z = THREE.Math.ceil(this.z);
            return this;
        };
        Vector3.prototype.round = function () {
            this.x = THREE.Math.round(this.x);
            this.y = THREE.Math.round(this.y);
            this.z = THREE.Math.round(this.z);
            return this;
        };
        Vector3.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? THREE.Math.ceil(this.x) : THREE.Math.floor(this.x);
            this.y = (this.y < 0) ? THREE.Math.ceil(this.y) : THREE.Math.floor(this.y);
            this.z = (this.z < 0) ? THREE.Math.ceil(this.z) : THREE.Math.floor(this.z);
            return this;
        };
        Vector3.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            return this;
        };
        Vector3.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y + this.z * v.z;
        };
        Vector3.prototype.lengthSq = function () {
            return this.x * this.x + this.y * this.y + this.z * this.z;
        };
        Vector3.prototype.length = function () {
            return THREE.Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };
        Vector3.prototype.lengthManhattan = function () {
            return THREE.Math.abs(this.x) + THREE.Math.abs(this.y) + THREE.Math.abs(this.z);
        };
        Vector3.prototype.normalize = function () {
            return this.divideScalar(this.length());
        };
        Vector3.prototype.setLength = function (length) {
            return this.multiplyScalar(length / this.length());
        };
        Vector3.prototype.lerp = function (v, alpha) {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha;
            return this;
        };
        Vector3.prototype.lerpVectors = function (v1, v2, alpha) {
            return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
        };
        Vector3.prototype.cross = function (v) {
            var x = this.x, y = this.y, z = this.z;
            this.x = y * v.z - z * v.y;
            this.y = z * v.x - x * v.z;
            this.z = x * v.y - y * v.x;
            return this;
        };
        Vector3.prototype.crossVectors = function (a, b) {
            var ax = a.x, ay = a.y, az = a.z;
            var bx = b.x, by = b.y, bz = b.z;
            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx;
            return this;
        };
        Vector3.prototype.projectOnVector = function (vector) {
            var scalar = vector.dot(this) / vector.lengthSq();
            return this.copy(vector).multiplyScalar(scalar);
        };
        Vector3.prototype.projectOnPlane = function (planeNormal) {
            var v1 = new Vector3();
            var func = Vector3.prototype.projectOnPlane
                = function (planeNormal) {
                    v1.copy(this).projectOnVector(planeNormal);
                    this.sub(v1);
                    return this;
                };
            return func.apply(this, arguments);
        };
        Vector3.prototype.reflect = function (normal) {
            var v1 = new Vector3();
            var func = Vector3.prototype.reflect = function (normal) {
                this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal)));
                return this;
            };
            return func.apply(this, arguments);
        };
        Vector3.prototype.angleTo = function (v) {
            var theta = this.dot(v) / (THREE.Math.sqrt(this.lengthSq() * v.lengthSq()));
            return THREE.Math.acos(THREE.Math.clamp(theta, -1, 1));
        };
        Vector3.prototype.distanceTo = function (v) {
            return THREE.Math.sqrt(this.distanceToSquared(v));
        };
        Vector3.prototype.distanceToSquared = function (v) {
            var dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
            return dx * dx + dy * dy + dz * dz;
        };
        Vector3.prototype.distanceToManhattan = function (v) {
            return THREE.Math.abs(this.x - v.x) + THREE.Math.abs(this.y - v.y) + THREE.Math.abs(this.z - v.z);
        };
        Vector3.prototype.setFromSpherical = function (s) {
            var sinPhiRadius = THREE.Math.sin(s.phi) * s.radius;
            this.x = sinPhiRadius * THREE.Math.sin(s.theta);
            this.y = THREE.Math.cos(s.phi) * s.radius;
            this.z = sinPhiRadius * THREE.Math.cos(s.theta);
            return this;
        };
        Vector3.prototype.setFromMatrixPosition = function (m) {
            return this.setFromMatrixColumn(m, 3);
        };
        Vector3.prototype.setFromMatrixScale = function (m) {
            var sx = this.setFromMatrixColumn(m, 0).length();
            var sy = this.setFromMatrixColumn(m, 1).length();
            var sz = this.setFromMatrixColumn(m, 2).length();
            this.x = sx;
            this.y = sy;
            this.z = sz;
            return this;
        };
        Vector3.prototype.setFromMatrixColumn = function (m, index) {
            return this.fromArray(m.elements, index * 4);
        };
        Vector3.prototype.equals = function (v) {
            return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
        };
        Vector3.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];
            return this;
        };
        Vector3.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            array[offset] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z;
            return array;
        };
        Vector3.prototype.fromAttribute = function (attribute, index, offset) {
            if (offset === void 0) { offset = 0; }
            index = index * attribute.itemSize + offset;
            this.x = attribute.array[index];
            this.y = attribute.array[index + 1];
            this.z = attribute.array[index + 2];
            return this;
        };
        return Vector3;
    }());
    THREE.Vector3 = Vector3;
})(THREE || (THREE = {}));
