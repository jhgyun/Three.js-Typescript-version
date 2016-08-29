var THREE;
(function (THREE) {
    var Box2 = (function () {
        function Box2(min, max) {
            if (min === void 0) { min = new THREE.Vector2(+Infinity, +Infinity); }
            if (max === void 0) { max = new THREE.Vector2(-Infinity, -Infinity); }
            this.min = min;
            this.max = max;
        }
        Box2.prototype.set = function (min, max) {
            this.min.copy(min);
            this.max.copy(max);
            return this;
        };
        Box2.prototype.setFromPoints = function (points) {
            this.makeEmpty();
            for (var i = 0, il = points.length; i < il; i++) {
                this.expandByPoint(points[i]);
            }
            return this;
        };
        Box2.prototype.setFromCenterAndSize = function (center, size) {
            var v1 = Box2.setFromCenterAndSize_v1;
            var halfSize = v1.copy(size).multiplyScalar(0.5);
            this.min.copy(center).sub(halfSize);
            this.max.copy(center).add(halfSize);
            return this;
        };
        Box2.prototype.clone = function () {
            return new Box2().copy(this);
        };
        Box2.prototype.copy = function (box) {
            this.min.copy(box.min);
            this.max.copy(box.max);
            return this;
        };
        Box2.prototype.makeEmpty = function () {
            this.min.x = this.min.y = +Infinity;
            this.max.x = this.max.y = -Infinity;
            return this;
        };
        Box2.prototype.isEmpty = function () {
            return (this.max.x < this.min.x) || (this.max.y < this.min.y);
        };
        Box2.prototype.center = function (optionalTarget) {
            if (optionalTarget === void 0) { optionalTarget = new THREE.Vector2(); }
            return optionalTarget.addVectors(this.min, this.max).multiplyScalar(0.5);
        };
        Box2.prototype.size = function (optionalTarget) {
            if (optionalTarget === void 0) { optionalTarget = new THREE.Vector2(); }
            var result = optionalTarget;
            return result.subVectors(this.max, this.min);
        };
        Box2.prototype.expandByPoint = function (point) {
            this.min.min(point);
            this.max.max(point);
            return this;
        };
        Box2.prototype.expandByVector = function (vector) {
            this.min.sub(vector);
            this.max.add(vector);
            return this;
        };
        Box2.prototype.expandByScalar = function (scalar) {
            this.min.addScalar(-scalar);
            this.max.addScalar(scalar);
            return this;
        };
        Box2.prototype.containsPoint = function (point) {
            if (point.x < this.min.x || point.x > this.max.x ||
                point.y < this.min.y || point.y > this.max.y) {
                return false;
            }
            return true;
        };
        Box2.prototype.containsBox = function (box) {
            if ((this.min.x <= box.min.x) && (box.max.x <= this.max.x) &&
                (this.min.y <= box.min.y) && (box.max.y <= this.max.y)) {
                return true;
            }
            return false;
        };
        Box2.prototype.getParameter = function (point, optionalTarget) {
            if (optionalTarget === void 0) { optionalTarget = new THREE.Vector2(); }
            var result = optionalTarget || new THREE.Vector2();
            return result.set((point.x - this.min.x) / (this.max.x - this.min.x), (point.y - this.min.y) / (this.max.y - this.min.y));
        };
        Box2.prototype.intersectsBox = function (box) {
            if (box.max.x < this.min.x || box.min.x > this.max.x ||
                box.max.y < this.min.y || box.min.y > this.max.y) {
                return false;
            }
            return true;
        };
        Box2.prototype.clampPoint = function (point, optionalTarget) {
            var result = optionalTarget || new THREE.Vector2();
            return result.copy(point).clamp(this.min, this.max);
        };
        Box2.prototype.distanceToPoint = function (point) {
            var v1 = Box2.distanceToPoint_v1;
            if (v1 === undefined)
                v1 = Box2.distanceToPoint_v1 = new THREE.Vector2();
            var func = Box2.prototype.distanceToPoint = function (point) {
                var clampedPoint = v1.copy(point).clamp(this.min, this.max);
                clampedPoint.sub(point).length();
                return this;
            };
            return func.apply(this, arguments);
        };
        Box2.prototype.intersect = function (box) {
            this.min.max(box.min);
            this.max.min(box.max);
            return this;
        };
        Box2.prototype.union = function (box) {
            this.min.min(box.min);
            this.max.max(box.max);
            return this;
        };
        Box2.prototype.translate = function (offset) {
            this.min.add(offset);
            this.max.add(offset);
            return this;
        };
        Box2.prototype.equals = function (box) {
            return box.min.equals(this.min) && box.max.equals(this.max);
        };
        Box2.setFromCenterAndSize_v1 = new THREE.Vector2();
        return Box2;
    }());
    THREE.Box2 = Box2;
    ;
})(THREE || (THREE = {}));
