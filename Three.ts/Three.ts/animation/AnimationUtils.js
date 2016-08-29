var THREE;
(function (THREE) {
    var AnimationUtils = (function () {
        function AnimationUtils() {
        }
        AnimationUtils.arraySlice = function (array, from, to) {
            if (AnimationUtils.isTypedArray(array)) {
                return new array.constructor(array.subarray(from, to));
            }
            return array.slice(from, to);
        };
        AnimationUtils.convertArray = function (array, type, forceClone) {
            if (!array ||
                !forceClone && array.constructor === type)
                return array;
            if (typeof type.BYTES_PER_ELEMENT === 'number') {
                return new type(array);
            }
            return Array.prototype.slice.call(array);
        };
        AnimationUtils.isTypedArray = function (object) {
            return ArrayBuffer.isView(object) &&
                !(object instanceof DataView);
        };
        AnimationUtils.getKeyframeOrder = function (times) {
            function compareTime(i, j) {
                return times[i] - times[j];
            }
            var n = times.length;
            var result = new Array(n);
            for (var i = 0; i !== n; ++i)
                result[i] = i;
            result.sort(compareTime);
            return result;
        };
        AnimationUtils.sortedArray = function (values, stride, order) {
            var nValues = values.length;
            var result = new values.constructor(nValues);
            for (var i = 0, dstOffset = 0; dstOffset !== nValues; ++i) {
                var srcOffset = order[i] * stride;
                for (var j = 0; j !== stride; ++j) {
                    result[dstOffset++] = values[srcOffset + j];
                }
            }
            return result;
        };
        AnimationUtils.flattenJSON = function (jsonKeys, times, values, valuePropertyName) {
            var i = 1, key = jsonKeys[0];
            while (key !== undefined && key[valuePropertyName] === undefined) {
                key = jsonKeys[i++];
            }
            if (key === undefined)
                return;
            var value = key[valuePropertyName];
            if (value === undefined)
                return;
            if (Array.isArray(value)) {
                do {
                    value = key[valuePropertyName];
                    if (value !== undefined) {
                        times.push(key.time);
                        values.push.apply(values, value);
                    }
                    key = jsonKeys[i++];
                } while (key !== undefined);
            }
            else if (value.toArray !== undefined) {
                do {
                    value = key[valuePropertyName];
                    if (value !== undefined) {
                        times.push(key.time);
                        value.toArray(values, values.length);
                    }
                    key = jsonKeys[i++];
                } while (key !== undefined);
            }
            else {
                do {
                    value = key[valuePropertyName];
                    if (value !== undefined) {
                        times.push(key.time);
                        values.push(value);
                    }
                    key = jsonKeys[i++];
                } while (key !== undefined);
            }
        };
        return AnimationUtils;
    }());
    THREE.AnimationUtils = AnimationUtils;
})(THREE || (THREE = {}));
