var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var BufferAttribute = (function () {
        function BufferAttribute(array, itemSize, normalized) {
            this.dynamic = false;
            this.updateRange = { offset: 0, count: -1 };
            this.version = 0;
            this.uuid = THREE.Math.generateUUID();
            this.array = array;
            this.itemSize = itemSize;
            this.dynamic = false;
            this.updateRange = { offset: 0, count: -1 };
            this.version = 0;
            this.normalized = normalized === true;
        }
        Object.defineProperty(BufferAttribute.prototype, "count", {
            get: function () {
                return this.array.length / this.itemSize;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BufferAttribute.prototype, "needsUpdate", {
            set: function (value) {
                if (value === true)
                    this.version++;
            },
            enumerable: true,
            configurable: true
        });
        BufferAttribute.prototype.setDynamic = function (value) {
            this.dynamic = value;
            return this;
        };
        BufferAttribute.prototype.copy = function (source) {
            this.array = new source.array.constructor(source.array);
            this.itemSize = source.itemSize;
            this.dynamic = source.dynamic;
            return this;
        };
        BufferAttribute.prototype.copyAt = function (index1, attribute, index2) {
            index1 *= this.itemSize;
            index2 *= attribute.itemSize;
            for (var i = 0, l = this.itemSize; i < l; i++) {
                this.array[index1 + i] = attribute.array[index2 + i];
            }
            return this;
        };
        BufferAttribute.prototype.copyArray = function (array) {
            this.array.set(array);
            return this;
        };
        BufferAttribute.prototype.copyColorsArray = function (colors) {
            var array = this.array, offset = 0;
            for (var i = 0, l = colors.length; i < l; i++) {
                var color = colors[i];
                array[offset++] = color.r;
                array[offset++] = color.g;
                array[offset++] = color.b;
            }
            return this;
        };
        BufferAttribute.prototype.copyIndicesArray = function (indices) {
            var array = this.array, offset = 0;
            for (var i = 0, l = indices.length; i < l; i++) {
                var index = indices[i];
                array[offset++] = index.a;
                array[offset++] = index.b;
                array[offset++] = index.c;
            }
            return this;
        };
        BufferAttribute.prototype.copyVector2sArray = function (vectors) {
            var array = this.array, offset = 0;
            for (var i = 0, l = vectors.length; i < l; i++) {
                var vector = vectors[i];
                array[offset++] = vector.x;
                array[offset++] = vector.y;
            }
            return this;
        };
        BufferAttribute.prototype.copyVector3sArray = function (vectors) {
            var array = this.array, offset = 0;
            for (var i = 0, l = vectors.length; i < l; i++) {
                var vector = vectors[i];
                array[offset++] = vector.x;
                array[offset++] = vector.y;
                array[offset++] = vector.z;
            }
            return this;
        };
        BufferAttribute.prototype.copyVector4sArray = function (vectors) {
            var array = this.array, offset = 0;
            for (var i = 0, l = vectors.length; i < l; i++) {
                var vector = vectors[i];
                array[offset++] = vector.x;
                array[offset++] = vector.y;
                array[offset++] = vector.z;
                array[offset++] = vector.w;
            }
            return this;
        };
        BufferAttribute.prototype.set = function (value, offset) {
            if (offset === undefined)
                offset = 0;
            this.array.set(value, offset);
            return this;
        };
        BufferAttribute.prototype.getX = function (index) {
            return this.array[index * this.itemSize];
        };
        BufferAttribute.prototype.setX = function (index, x) {
            this.array[index * this.itemSize] = x;
            return this;
        };
        BufferAttribute.prototype.getY = function (index) {
            return this.array[index * this.itemSize + 1];
        };
        BufferAttribute.prototype.setY = function (index, y) {
            this.array[index * this.itemSize + 1] = y;
            return this;
        };
        BufferAttribute.prototype.getZ = function (index) {
            return this.array[index * this.itemSize + 2];
        };
        BufferAttribute.prototype.setZ = function (index, z) {
            this.array[index * this.itemSize + 2] = z;
            return this;
        };
        BufferAttribute.prototype.getW = function (index) {
            return this.array[index * this.itemSize + 3];
        };
        BufferAttribute.prototype.setW = function (index, w) {
            this.array[index * this.itemSize + 3] = w;
            return this;
        };
        BufferAttribute.prototype.setXY = function (index, x, y) {
            index *= this.itemSize;
            this.array[index + 0] = x;
            this.array[index + 1] = y;
            return this;
        };
        BufferAttribute.prototype.setXYZ = function (index, x, y, z) {
            index *= this.itemSize;
            this.array[index + 0] = x;
            this.array[index + 1] = y;
            this.array[index + 2] = z;
            return this;
        };
        BufferAttribute.prototype.setXYZW = function (index, x, y, z, w) {
            index *= this.itemSize;
            this.array[index + 0] = x;
            this.array[index + 1] = y;
            this.array[index + 2] = z;
            this.array[index + 3] = w;
            return this;
        };
        BufferAttribute.prototype.clone = function () {
            return new this.constructor().copy(this);
        };
        return BufferAttribute;
    }());
    THREE.BufferAttribute = BufferAttribute;
    ;
    var Int8Attribute = (function (_super) {
        __extends(Int8Attribute, _super);
        function Int8Attribute(array, itemSize) {
            _super.call(this, new Int8Array(array), itemSize);
        }
        ;
        return Int8Attribute;
    }(BufferAttribute));
    THREE.Int8Attribute = Int8Attribute;
    var Uint8Attribut = (function (_super) {
        __extends(Uint8Attribut, _super);
        function Uint8Attribut(array, itemSize) {
            _super.call(this, new Uint8Array(array), itemSize);
        }
        ;
        return Uint8Attribut;
    }(BufferAttribute));
    THREE.Uint8Attribut = Uint8Attribut;
    var Uint8ClampedAttribute = (function (_super) {
        __extends(Uint8ClampedAttribute, _super);
        function Uint8ClampedAttribute(array, itemSize) {
            _super.call(this, new Uint8ClampedArray(array), itemSize);
        }
        ;
        return Uint8ClampedAttribute;
    }(BufferAttribute));
    THREE.Uint8ClampedAttribute = Uint8ClampedAttribute;
    var Int16Attribute = (function (_super) {
        __extends(Int16Attribute, _super);
        function Int16Attribute(array, itemSize) {
            _super.call(this, new Int16Array(array), itemSize);
        }
        ;
        return Int16Attribute;
    }(BufferAttribute));
    THREE.Int16Attribute = Int16Attribute;
    var Uint16Attribute = (function (_super) {
        __extends(Uint16Attribute, _super);
        function Uint16Attribute(array, itemSize) {
            _super.call(this, new Uint16Array(array), itemSize);
        }
        ;
        return Uint16Attribute;
    }(BufferAttribute));
    THREE.Uint16Attribute = Uint16Attribute;
    var Int32Attribute = (function (_super) {
        __extends(Int32Attribute, _super);
        function Int32Attribute(array, itemSize) {
            _super.call(this, new Int32Array(array), itemSize);
        }
        ;
        return Int32Attribute;
    }(BufferAttribute));
    THREE.Int32Attribute = Int32Attribute;
    var Uint32Attribute = (function (_super) {
        __extends(Uint32Attribute, _super);
        function Uint32Attribute(array, itemSize) {
            _super.call(this, new Uint32Array(array), itemSize);
        }
        ;
        return Uint32Attribute;
    }(BufferAttribute));
    THREE.Uint32Attribute = Uint32Attribute;
    var Float32Attribute = (function (_super) {
        __extends(Float32Attribute, _super);
        function Float32Attribute(array, itemSize) {
            if (typeof array === "number")
                _super.call(this, new Float32Array(array), itemSize);
            else
                _super.call(this, new Float32Array(array), itemSize);
        }
        ;
        return Float32Attribute;
    }(BufferAttribute));
    THREE.Float32Attribute = Float32Attribute;
    var Float64Attribute = (function (_super) {
        __extends(Float64Attribute, _super);
        function Float64Attribute(array, itemSize) {
            _super.call(this, new Float64Array(array), itemSize);
        }
        ;
        return Float64Attribute;
    }(BufferAttribute));
    THREE.Float64Attribute = Float64Attribute;
})(THREE || (THREE = {}));
