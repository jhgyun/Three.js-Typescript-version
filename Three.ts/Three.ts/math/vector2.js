/// <reference path="../three.ts" /> 
/*
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */
var THREE;
(function (THREE) {
    var Vector2 = (function () {
        function Vector2(x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            this.x = x;
            this.y = y;
        }
        ;
        Object.defineProperty(Vector2.prototype, "width", {
            get: function () {
                return this.x;
            },
            set: function (value) {
                this.x = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "height", {
            get: function () {
                return this.y;
            },
            set: function (value) {
                this.y = value;
            },
            enumerable: true,
            configurable: true
        });
        Vector2.prototype.set = function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        };
        Vector2.prototype.setScalar = function (scalar) {
            this.x = scalar;
            this.y = scalar;
            return this;
        };
        Vector2.prototype.setX = function (x) {
            this.x = x;
            return this;
        };
        Vector2.prototype.setY = function (y) {
            this.y = y;
            return this;
        };
        Vector2.prototype.setComponent = function (index, value) {
            switch (index) {
                case 0:
                    this.x = value;
                    break;
                case 1:
                    this.y = value;
                    break;
                default: throw new Error('index is out of range: ' + index);
            }
        };
        Vector2.prototype.getComponent = function (index) {
            switch (index) {
                case 0: return this.x;
                case 1: return this.y;
                default: throw new Error('index is out of range: ' + index);
            }
        };
        Vector2.prototype.clone = function () {
            return new Vector2(this.x, this.y);
        };
        Vector2.prototype.copy = function (v) {
            this.x = v.x;
            this.y = v.y;
            return this;
        };
        Vector2.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
            return this;
        };
        Vector2.prototype.addScalar = function (s) {
            this.x += s;
            this.y += s;
            return this;
        };
        Vector2.prototype.addVectors = function (a, b) {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            return this;
        };
        Vector2.prototype.addScaledVector = function (v, s) {
            this.x += v.x * s;
            this.y += v.y * s;
            return this;
        };
        Vector2.prototype.sub = function (v) {
            this.x -= v.x;
            this.y -= v.y;
            return this;
        };
        Vector2.prototype.subScalar = function (s) {
            this.x -= s;
            this.y -= s;
            return this;
        };
        Vector2.prototype.subVectors = function (a, b) {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            return this;
        };
        Vector2.prototype.multiply = function (v) {
            this.x *= v.x;
            this.y *= v.y;
            return this;
        };
        Vector2.prototype.multiplyScalar = function (scalar) {
            if (isFinite(scalar)) {
                this.x *= scalar;
                this.y *= scalar;
            }
            else {
                this.x = 0;
                this.y = 0;
            }
            return this;
        };
        Vector2.prototype.divide = function (v) {
            this.x /= v.x;
            this.y /= v.y;
            return this;
        };
        Vector2.prototype.divideScalar = function (scalar) {
            return this.multiplyScalar(1 / scalar);
        };
        Vector2.prototype.min = function (v) {
            this.x = THREE.Math.min(this.x, v.x);
            this.y = THREE.Math.min(this.y, v.y);
            return this;
        };
        Vector2.prototype.max = function (v) {
            this.x = THREE.Math.max(this.x, v.x);
            this.y = THREE.Math.max(this.y, v.y);
            return this;
        };
        Vector2.prototype.clamp = function (min, max) {
            // This function assumes min < max, if this assumption isn't true it will not operate correctly
            this.x = THREE.Math.max(min.x, THREE.Math.min(max.x, this.x));
            this.y = THREE.Math.max(min.y, THREE.Math.min(max.y, this.y));
            return this;
        };
        Vector2.prototype.clampLength = function (min, max) {
            var length = this.length();
            return this.multiplyScalar(THREE.Math.max(min, THREE.Math.min(max, length)) / length);
        };
        Vector2.prototype.floor = function () {
            this.x = THREE.Math.floor(this.x);
            this.y = THREE.Math.floor(this.y);
            return this;
        };
        Vector2.prototype.ceil = function () {
            this.x = THREE.Math.ceil(this.x);
            this.y = THREE.Math.ceil(this.y);
            return this;
        };
        Vector2.prototype.round = function () {
            this.x = THREE.Math.round(this.x);
            this.y = THREE.Math.round(this.y);
            return this;
        };
        Vector2.prototype.roundToZero = function () {
            this.x = (this.x < 0) ? THREE.Math.ceil(this.x) : THREE.Math.floor(this.x);
            this.y = (this.y < 0) ? THREE.Math.ceil(this.y) : THREE.Math.floor(this.y);
            return this;
        };
        Vector2.prototype.negate = function () {
            this.x = -this.x;
            this.y = -this.y;
            return this;
        };
        Vector2.prototype.dot = function (v) {
            return this.x * v.x + this.y * v.y;
        };
        Vector2.prototype.lengthSq = function () {
            return this.x * this.x + this.y * this.y;
        };
        Vector2.prototype.length = function () {
            return THREE.Math.sqrt(this.x * this.x + this.y * this.y);
        };
        Vector2.prototype.lengthManhattan = function () {
            return THREE.Math.abs(this.x) + THREE.Math.abs(this.y);
        };
        Vector2.prototype.normalize = function () {
            return this.divideScalar(this.length());
        };
        /**
         * computes the angle in radians with respect to the positive x-axis
         */
        Vector2.prototype.angle = function () {
            var angle = THREE.Math.atan2(this.y, this.x);
            if (angle < 0)
                angle += 2 * THREE.Math.PI;
            return angle;
        };
        Vector2.prototype.distanceTo = function (v) {
            return THREE.Math.sqrt(this.distanceToSquared(v));
        };
        Vector2.prototype.distanceToSquared = function (v) {
            var dx = this.x - v.x, dy = this.y - v.y;
            return dx * dx + dy * dy;
        };
        Vector2.prototype.distanceToManhattan = function (v) {
            return THREE.Math.abs(this.x - v.x) + THREE.Math.abs(this.y - v.y);
        };
        Vector2.prototype.setLength = function (length) {
            return this.multiplyScalar(length / this.length());
        };
        Vector2.prototype.lerp = function (v, alpha) {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            return this;
        };
        Vector2.prototype.lerpVectors = function (v1, v2, alpha) {
            return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
        };
        Vector2.prototype.equals = function (v) {
            return ((v.x === this.x) && (v.y === this.y));
        };
        Vector2.prototype.fromArray = function (array, offset) {
            if (offset === void 0) { offset = 0; }
            this.x = array[offset];
            this.y = array[offset + 1];
            return this;
        };
        Vector2.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            array[offset] = this.x;
            array[offset + 1] = this.y;
            return array;
        };
        Vector2.prototype.fromAttribute = function (attribute, index, offset) {
            if (offset === void 0) { offset = 0; }
            index = index * attribute.itemSize + offset;
            this.x = attribute.array[index];
            this.y = attribute.array[index + 1];
            return this;
        };
        Vector2.prototype.rotateAround = function (center, angle) {
            var c = THREE.Math.cos(angle), s = THREE.Math.sin(angle);
            var x = this.x - center.x;
            var y = this.y - center.y;
            this.x = x * c - y * s + center.x;
            this.y = x * s + y * c + center.y;
            return this;
        };
        Vector2.prototype.clampScalar = function (minVal, maxVal) {
            this.x = THREE.Math.max(minVal, THREE.Math.min(maxVal, this.x));
            this.y = THREE.Math.max(minVal, THREE.Math.min(maxVal, this.y));
            return this;
        };
        return Vector2;
    }());
    THREE.Vector2 = Vector2;
})(THREE || (THREE = {}));
