var THREE;
(function (THREE) {
    var Euler = (function () {
        function Euler(_x, _y, _z, _order) {
            if (_x === void 0) { _x = 0; }
            if (_y === void 0) { _y = 0; }
            if (_z === void 0) { _z = 0; }
            if (_order === void 0) { _order = Euler.DefaultOrder; }
            this._x = _x;
            this._y = _y;
            this._z = _z;
            this._order = _order;
        }
        Object.defineProperty(Euler.prototype, "x", {
            get: function () {
                return this._x;
            },
            set: function (value) {
                this._x = value;
                this.onChangeCallback();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euler.prototype, "y", {
            get: function () {
                return this._y;
            },
            set: function (value) {
                this._y = value;
                this.onChangeCallback();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euler.prototype, "z", {
            get: function () {
                return this._z;
            },
            set: function (value) {
                this._z = value;
                this.onChangeCallback();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euler.prototype, "order", {
            get: function () {
                return this._order;
            },
            set: function (value) {
                this._order = value;
                this.onChangeCallback();
            },
            enumerable: true,
            configurable: true
        });
        Euler.prototype.set = function (x, y, z, order) {
            if (order === void 0) { order = this._order; }
            this._x = x;
            this._y = y;
            this._z = z;
            this._order = order;
            this.onChangeCallback();
            return this;
        };
        Euler.prototype.clone = function () {
            return new Euler(this._x, this._y, this._z, this._order);
        };
        Euler.prototype.copy = function (euler) {
            this._x = euler._x;
            this._y = euler._y;
            this._z = euler._z;
            this._order = euler._order;
            this.onChangeCallback();
            return this;
        };
        Euler.prototype.setFromRotationMatrix = function (m, order, update) {
            var clamp = THREE.Math.clamp;
            var te = m.elements;
            var m11 = te[0], m12 = te[4], m13 = te[8];
            var m21 = te[1], m22 = te[5], m23 = te[9];
            var m31 = te[2], m32 = te[6], m33 = te[10];
            order = order || this._order;
            if (order === 'XYZ') {
                this._y = THREE.Math.asin(clamp(m13, -1, 1));
                if (THREE.Math.abs(m13) < 0.99999) {
                    this._x = THREE.Math.atan2(-m23, m33);
                    this._z = THREE.Math.atan2(-m12, m11);
                }
                else {
                    this._x = THREE.Math.atan2(m32, m22);
                    this._z = 0;
                }
            }
            else if (order === 'YXZ') {
                this._x = THREE.Math.asin(-clamp(m23, -1, 1));
                if (THREE.Math.abs(m23) < 0.99999) {
                    this._y = THREE.Math.atan2(m13, m33);
                    this._z = THREE.Math.atan2(m21, m22);
                }
                else {
                    this._y = THREE.Math.atan2(-m31, m11);
                    this._z = 0;
                }
            }
            else if (order === 'ZXY') {
                this._x = THREE.Math.asin(clamp(m32, -1, 1));
                if (THREE.Math.abs(m32) < 0.99999) {
                    this._y = THREE.Math.atan2(-m31, m33);
                    this._z = THREE.Math.atan2(-m12, m22);
                }
                else {
                    this._y = 0;
                    this._z = THREE.Math.atan2(m21, m11);
                }
            }
            else if (order === 'ZYX') {
                this._y = THREE.Math.asin(-clamp(m31, -1, 1));
                if (THREE.Math.abs(m31) < 0.99999) {
                    this._x = THREE.Math.atan2(m32, m33);
                    this._z = THREE.Math.atan2(m21, m11);
                }
                else {
                    this._x = 0;
                    this._z = THREE.Math.atan2(-m12, m22);
                }
            }
            else if (order === 'YZX') {
                this._z = THREE.Math.asin(clamp(m21, -1, 1));
                if (THREE.Math.abs(m21) < 0.99999) {
                    this._x = THREE.Math.atan2(-m23, m22);
                    this._y = THREE.Math.atan2(-m31, m11);
                }
                else {
                    this._x = 0;
                    this._y = THREE.Math.atan2(m13, m33);
                }
            }
            else if (order === 'XZY') {
                this._z = THREE.Math.asin(-clamp(m12, -1, 1));
                if (THREE.Math.abs(m12) < 0.99999) {
                    this._x = THREE.Math.atan2(m32, m22);
                    this._y = THREE.Math.atan2(m13, m11);
                }
                else {
                    this._x = THREE.Math.atan2(-m23, m33);
                    this._y = 0;
                }
            }
            else {
                console.warn('THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order);
            }
            this._order = order;
            if (update !== false)
                this.onChangeCallback();
            return this;
        };
        Euler.prototype.setFromQuaternion = function (q, order, update) {
            var matrix = new THREE.Matrix4();
            var func = Euler.prototype.setFromQuaternion
                = function (q, order, update) {
                    matrix.makeRotationFromQuaternion(q);
                    this.setFromRotationMatrix(matrix, order, update);
                    return this;
                };
            return func.apply(this, arguments);
        };
        Euler.prototype.setFromVector3 = function (v, order) {
            if (order === void 0) { order = this._order; }
            return this.set(v.x, v.y, v.z, order);
        };
        Euler.prototype.reorder = function (newOrder) {
            var q = new THREE.Quaternion();
            var func = Euler.prototype.reorder
                = function (newOrder) {
                    q.setFromEuler(this);
                    this.setFromQuaternion(q, newOrder);
                    return this;
                };
            return func.apply(this, arguments);
        };
        Euler.prototype.equals = function (euler) {
            return (euler._x === this._x) && (euler._y === this._y) && (euler._z === this._z) && (euler._order === this._order);
        };
        Euler.prototype.fromArray = function (array) {
            this._x = array[0];
            this._y = array[1];
            this._z = array[2];
            if (array[3] !== undefined)
                this._order = array[3];
            this.onChangeCallback();
            return this;
        };
        Euler.prototype.toArray = function (array, offset) {
            if (array === void 0) { array = []; }
            if (offset === void 0) { offset = 0; }
            array[offset] = this._x;
            array[offset + 1] = this._y;
            array[offset + 2] = this._z;
            array[offset + 3] = this._order;
            return array;
        };
        Euler.prototype.toVector3 = function (optionalResult) {
            if (optionalResult) {
                return optionalResult.set(this._x, this._y, this._z);
            }
            else {
                return new THREE.Vector3(this._x, this._y, this._z);
            }
        };
        Euler.prototype.onChange = function (callback, _this) {
            this.onChangeCallback_this = _this;
            this.onChangeCallback_func = callback;
            return this;
        };
        Euler.prototype.onChangeCallback = function () {
            if (this.onChangeCallback_func != null)
                this.onChangeCallback_func.apply(this.onChangeCallback_this, arguments);
        };
        Euler.RotationOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];
        Euler.DefaultOrder = 'XYZ';
        return Euler;
    }());
    THREE.Euler = Euler;
})(THREE || (THREE = {}));
