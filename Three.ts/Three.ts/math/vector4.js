var THREE;
(function (THREE) {
    var Vector4 = (function () {
        function Vector4(x, y, z, w) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            if (w === void 0) { w = 1; }
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
        }
        ;
        Vector4.prototype.set = function (x, y, z, w) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            return this;
        };
        Vector4.prototype.setScalar = function (scalar) {
            this.x = scalar;
            this.y = scalar;
            this.z = scalar;
            this.w = scalar;
            return this;
        };
        Vector4.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Vector4.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        Vector4.prototype.setZ = function (z) {
            this.z = z;
            return this;
        };
        Vector4.prototype.setW = function (w) {
            this.w = w;
            return this;
        };
        Vector4.prototype.setComponent = function (index, value) {
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
                case 3:
                    this.w = value;
                    break;
                default: throw new Error('index is out of range: ' + index);
            }
        };
        Vector4.prototype.getComponent = function (index) {
            switch (index) {
                case 0: return this.x;
                case 1: return this.y;
                case 2: return this.z;
                case 3: return this.w;
                default: throw new Error('index is out of range: ' + index);
            }
        };
        Vector4.prototype.clone = function () {
            return new Vector4(this.x, this.y, this.z, this.w);
        };
        Vector4.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            this.w = (v.w !== undefined) ? v.w : 1;
            return this;
        };
        Vector4.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            this.w += v.w;
            return this;
        };
        Vector4.prototype.addScalar = function (s) {
            this.x += s;
            this.y += s;
            this.z += s;
            this.w += s;
            return this;
        };
        Vector4.prototype.addVectors = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.w = a.w + b.w;
            return this;
        };
        Vector4.prototype.addScaledVector = function (v, s) {
            this.x += v.x * s;
            this.y += v.y * s;
            this.z += v.z * s;
            this.w += v.w * s;
            return this;
        };
        Vector4.prototype.sub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            this.w -= v.w;
            return this;
        };
        Vector4.prototype.subScalar = function (s) {
            this.x -= s;
            this.y -= s;
            this.z -= s;
            this.w -= s;
            return this;
        };
        Vector4.prototype.subVectors = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.w = a.w - b.w;
            return this;
        };
        Vector4.prototype.multiplyScalar = function (scalar) {
            if (isFinite(scalar)) {
                this.x *= scalar;
                this.y *= scalar;
                this.z *= scalar;
                this.w *= scalar;
            }
            else {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 0;
            }
            return this;
        };
        Vector4.prototype.applyMatrix4 = function (m) {
            var x = this.x, y = this.y, z = this.z, w = this.w;
            var e = m.elements;
            this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
            this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
            this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
            this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
            return this;
        };
        Vector4.prototype.divideScalar = function (scalar) {
            return this.multiplyScalar(1 / scalar);
        };
        Vector4.prototype.setAxisAngleFromQuaternion = function (q) {
            this.w = 2 * THREE.Math.acos(q.w);
            var s = THREE.Math.sqrt(1 - q.w * q.w);
            if (s < 0.0001) {
                this.x = 1;
                this.y = 0;
                this.z = 0;
            }
            else {
                this.x = q.x / s;
                this.y = q.y / s;
                this.z = q.z / s;
            }
            return this;
        };
        Vector4.prototype.setAxisAngleFromRotationMatrix = function (m) {
            var angle, x, y, z, epsilon = 0.01, epsilon2 = 0.1, te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10];
            if ((THREE.Math.abs(m12 - m21) < epsilon) &&
                (THREE.Math.abs(m13 - m31) < epsilon) &&
                (THREE.Math.abs(m23 - m32) < epsilon)) {
                if ((THREE.Math.abs(m12 + m21) < epsilon2) &&
                    (THREE.Math.abs(m13 + m31) < epsilon2) &&
                    (THREE.Math.abs(m23 + m32) < epsilon2) &&
                    (THREE.Math.abs(m11 + m22 + m33 - 3) < epsilon2)) {
                    this.set(1, 0, 0, 0);
                    return this;
                }
                angle = THREE.Math.PI;
                var xx = (m11 + 1) / 2;
                var yy = (m22 + 1) / 2;
                var zz = (m33 + 1) / 2;
                var xy = (m12 + m21) / 4;
                var xz = (m13 + m31) / 4;
                var yz = (m23 + m32) / 4;
                if ((xx > yy) && (xx > zz)) {
                    if (xx < epsilon) {
                        x = 0;
                        y = 0.707106781;
                        z = 0.707106781;
                    }
                    else {
                        x = THREE.Math.sqrt(xx);
                        y = xy / x;
                        z = xz / x;
                    }
                }
                else if (yy > zz) {
                    if (yy < epsilon) {
                        x = 0.707106781;
                        y = 0;
                        z = 0.707106781;
                    }
                    else {
                        y = THREE.Math.sqrt(yy);
                        x = xy / y;
                        z = yz / y;
                    }
                }
                else {
                    if (zz < epsilon) {
                        x = 0.707106781;
                        y = 0.707106781;
                        z = 0;
                    }
                    else {
                        z = THREE.Math.sqrt(zz);
                        x = xz / z;
                        y = yz / z;
                    }
                }
                this.set(x, y, z, angle);
                return this;
            }
            var s = THREE.Math.sqrt((m32 - m23) * (m32 - m23) +
                (m13 - m31) * (m13 - m31) +
                (m21 - m12) * (m21 - m12));
            if (THREE.Math.abs(s) < 0.001)
                s = 1;
            this.x = (m32 - m23) / s;
            this.y = (m13 - m31) / s;
            this.z = (m21 - m12) / s;
            this.w = THREE.Math.acos((m11 + m22 + m33 - 1) / 2);
            return this;
        };
        Vector4.prototype.min = function (v) {
            this.x = THREE.Math.min(this.x, v.x);
            this.y = THREE.Math.min(this.y, v.y);
            this.z = THREE.Math.min(this.z, v.z);
            this.w = THREE.Math.min(this.w, v.w);
            return this;
        };
        Vector4.prototype.max = function (v) {
            this.x = THREE.Math.max(this.x, v.x);
            this.y = THREE.Math.max(this.y, v.y);
            this.z = THREE.Math.max(this.z, v.z);
            this.w = THREE.Math.max(this.w, v.w);
            return this;
        };
        Vector4.prototype.clamp = function (min, max) {
            this.x = THREE.Math.max(min.x, THREE.Math.min(max.x, this.x));
            this.y = THREE.Math.max(min.y, THREE.Math.min(max.y, this.y));
            this.z = THREE.Math.max(min.z, THREE.Math.min(max.z, this.z));
            this.w = THREE.Math.max(min.w, THREE.Math.min(max.w, this.w));
            return this;
        };
        Vector4.prototype.clampScalar = function (minVal, maxVal) {
            var min = new Vector4();
            var max = new Vector4();
            var func = Vector4.prototype.clampScalar = function (minVal, maxVal) {
                min.set(minVal, minVal, minVal, minVal);
                max.set(maxVal, maxVal, maxVal, maxVal);
                return this.clamp(min, max);
            };
            return func.apply(this, arguments);
        };
        Vector4.prototype.floor = function () {
            this.x = THREE.Math.floor(this.x);
            this.y = THREE.Math.floor(this.y);
            this.z = THREE.Math.floor(this.z);
            this.w = THREE.Math.floor(this.w);
            return this;
        };
        Vector4.prototype.ceil = function () {
            this.x = THREE.Math.ceil(this.x);
            this.y = THREE.Math.ceil(this.y);
            this.z = THREE.Math.ceil(this.z);
            this.w = THREE.Math.ceil(this.w);
            return this;
        };
        Vector4.prototype.round = function () {
            this.x = THREE.Math.round(this.x);
            this.y = THREE.Math.round(this.y);
            this.z = THREE.Math.round(this.z);
            this.w = THREE.Math.round(this.w);
            return this;
        };
        Vector4.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? THREE.Math.ceil(this.x) : THREE.Math.floor(this.x);
            this.y = (this.y < 0) ? THREE.Math.ceil(this.y) : THREE.Math.floor(this.y);
            this.z = (this.z < 0) ? THREE.Math.ceil(this.z) : THREE.Math.floor(this.z);
            this.w = (this.w < 0) ? THREE.Math.ceil(this.w) : THREE.Math.floor(this.w);
            return this;
        };
        Vector4.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.w = -this.w;
            return this;
        };
        Vector4.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
        };
        Vector4.prototype.lengthSq = function () {
            return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
        };
        Vector4.prototype.length = function () {
            return THREE.Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        };
        Vector4.prototype.lengthManhattan = function () {
            return THREE.Math.abs(this.x) + THREE.Math.abs(this.y) + THREE.Math.abs(this.z) + THREE.Math.abs(this.w);
        };
        Vector4.prototype.normalize = function () {
            return this.divideScalar(this.length());
        };
        Vector4.prototype.setLength = function (length) {
            return this.multiplyScalar(length / this.length());
        };
        Vector4.prototype.lerp = function (v, alpha) {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha;
            this.w += (v.w - this.w) * alpha;
            return this;
        };
        Vector4.prototype.lerpVectors = function (v1, v2, alpha) {
            return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
        };
        Vector4.prototype.equals = function (v) {
            return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z) && (v.w === this.w));
        };
        Vector4.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];
            this.w = array[offset + 3];
            return this;
        };
        Vector4.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            array[offset] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z;
            array[offset + 3] = this.w;
            return array;
        };
        Vector4.prototype.fromAttribute = function (attribute, index, offset) {
            if (offset === void 0) { offset = 0; }
            if (offset === undefined)
                offset = 0;
            index = index * attribute.itemSize + offset;
            this.x = attribute.array[index];
            this.y = attribute.array[index + 1];
            this.z = attribute.array[index + 2];
            this.w = attribute.array[index + 3];
            return this;
        };
        return Vector4;
    }());
    THREE.Vector4 = Vector4;
})(THREE || (THREE = {}));
