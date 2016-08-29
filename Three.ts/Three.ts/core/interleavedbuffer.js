var THREE;
(function (THREE) {
    var InterleavedBuffer = (function () {
        function InterleavedBuffer(array, stride) {
            this.uuid = THREE.Math.generateUUID();
            this.dynamic = false;
            this.updateRange = { offset: 0, count: -1 };
            this.version = 0;
            this.array = array;
            this.stride = stride;
        }
        ;
        Object.defineProperty(InterleavedBuffer.prototype, "length", {
            get: function () {
                return this.array.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterleavedBuffer.prototype, "count", {
            get: function () {
                return this.array.length / this.stride;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InterleavedBuffer.prototype, "needsUpdate", {
            set: function (value) {
                if (value === true)
                    this.version++;
            },
            enumerable: true,
            configurable: true
        });
        InterleavedBuffer.prototype.setDynamic = function (value) {
            this.dynamic = value;
            return this;
        };
        InterleavedBuffer.prototype.copy = function (source) {
            this.array = new source.array.constructor(source.array);
            this.stride = source.stride;
            this.dynamic = source.dynamic;
            return this;
        };
        InterleavedBuffer.prototype.copyAt = function (index1, attribute, index2) {
            index1 *= this.stride;
            index2 *= attribute.stride;
            for (var i = 0, l = this.stride; i < l; i++) {
                this.array[index1 + i] = attribute.array[index2 + i];
            }
            return this;
        };
        InterleavedBuffer.prototype.set = function (value, offset) {
            if (offset === undefined)
                offset = 0;
            this.array.set(value, offset);
            return this;
        };
        InterleavedBuffer.prototype.clone = function () {
            return new InterleavedBuffer().copy(this);
        };
        return InterleavedBuffer;
    }());
    THREE.InterleavedBuffer = InterleavedBuffer;
    ;
})(THREE || (THREE = {}));
