var THREE;
(function (THREE) {
    var KeyframeTrack = (function () {
        function KeyframeTrack(name, times, values, interpolation) {
            this.DefaultInterpolation = THREE.InterpolateLinear;
            if (name === undefined)
                throw new Error("track name is undefined");
            if (times === undefined || times.length === 0) {
                throw new Error("no keyframes in track named " + name);
            }
            this.name = name;
            this.times = THREE.AnimationUtils.convertArray(times, this.TimeBufferType);
            this.values = THREE.AnimationUtils.convertArray(values, this.ValueBufferType);
            this.setInterpolation(interpolation || this.DefaultInterpolation);
            this.validate();
            this.optimize();
        }
        ;
        KeyframeTrack.prototype.InterpolantFactoryMethodDiscrete = function (result) {
            return new THREE.DiscreteInterpolant(this.times, this.values, this.getValueSize(), result);
        };
        KeyframeTrack.prototype.InterpolantFactoryMethodLinear = function (result) {
            return new THREE.LinearInterpolant(this.times, this.values, this.getValueSize(), result);
        };
        KeyframeTrack.prototype.InterpolantFactoryMethodSmooth = function (result) {
            return new THREE.CubicInterpolant(this.times, this.values, this.getValueSize(), result);
        };
        KeyframeTrack.prototype.setInterpolation = function (interpolation) {
            var factoryMethod;
            switch (interpolation) {
                case THREE.InterpolateDiscrete:
                    factoryMethod = this.InterpolantFactoryMethodDiscrete;
                    break;
                case THREE.InterpolateLinear:
                    factoryMethod = this.InterpolantFactoryMethodLinear;
                    break;
                case THREE.InterpolateSmooth:
                    factoryMethod = this.InterpolantFactoryMethodSmooth;
                    break;
            }
            if (factoryMethod === undefined) {
                var message = "unsupported interpolation for " +
                    this.ValueTypeName + " keyframe track named " + this.name;
                if (this.createInterpolant === undefined) {
                    if (interpolation !== this.DefaultInterpolation) {
                        this.setInterpolation(this.DefaultInterpolation);
                    }
                    else {
                        throw new Error(message);
                    }
                }
                console.warn(message);
                return;
            }
            this.createInterpolant = factoryMethod;
        };
        KeyframeTrack.prototype.getInterpolation = function () {
            switch (this.createInterpolant) {
                case this.InterpolantFactoryMethodDiscrete:
                    return THREE.InterpolateDiscrete;
                case this.InterpolantFactoryMethodLinear:
                    return THREE.InterpolateLinear;
                case this.InterpolantFactoryMethodSmooth:
                    return THREE.InterpolateSmooth;
            }
        };
        KeyframeTrack.prototype.getValueSize = function () {
            return this.values.length / this.times.length;
        };
        KeyframeTrack.prototype.shift = function (timeOffset) {
            if (timeOffset !== 0.0) {
                var times = this.times;
                for (var i = 0, n = times.length; i !== n; ++i) {
                    times[i] += timeOffset;
                }
            }
            return this;
        };
        KeyframeTrack.prototype.scale = function (timeScale) {
            if (timeScale !== 1.0) {
                var times = this.times;
                for (var i = 0, n = times.length; i !== n; ++i) {
                    times[i] *= timeScale;
                }
            }
            return this;
        };
        KeyframeTrack.prototype.trim = function (startTime, endTime) {
            var times = this.times, nKeys = times.length, from = 0, to = nKeys - 1;
            while (from !== nKeys && times[from] < startTime)
                ++from;
            while (to !== -1 && times[to] > endTime)
                --to;
            ++to;
            if (from !== 0 || to !== nKeys) {
                if (from >= to)
                    to = THREE.Math.max(to, 1), from = to - 1;
                var stride = this.getValueSize();
                this.times = THREE.AnimationUtils.arraySlice(times, from, to);
                this.values = THREE.AnimationUtils.
                    arraySlice(this.values, from * stride, to * stride);
            }
            return this;
        };
        KeyframeTrack.prototype.validate = function () {
            var valid = true;
            var valueSize = this.getValueSize();
            if (valueSize - THREE.Math.floor(valueSize) !== 0) {
                console.error("invalid value size in track", this);
                valid = false;
            }
            var times = this.times, values = this.values, nKeys = times.length;
            if (nKeys === 0) {
                console.error("track is empty", this);
                valid = false;
            }
            var prevTime = null;
            for (var i = 0; i !== nKeys; i++) {
                var currTime = times[i];
                if (typeof currTime === 'number' && isNaN(currTime)) {
                    console.error("time is not a valid number", this, i, currTime);
                    valid = false;
                    break;
                }
                if (prevTime !== null && prevTime > currTime) {
                    console.error("out of order keys", this, i, currTime, prevTime);
                    valid = false;
                    break;
                }
                prevTime = currTime;
            }
            if (values !== undefined) {
                if (THREE.AnimationUtils.isTypedArray(values)) {
                    for (var i = 0, n = values.length; i !== n; ++i) {
                        var value = values[i];
                        if (isNaN(value)) {
                            console.error("value is not a valid number", this, i, value);
                            valid = false;
                            break;
                        }
                    }
                }
            }
            return valid;
        };
        KeyframeTrack.prototype.optimize = function () {
            var times = this.times, values = this.values, stride = this.getValueSize(), writeIndex = 1;
            for (var i = 1, n = times.length - 1; i <= n; ++i) {
                var keep = false;
                var time = times[i];
                var timeNext = times[i + 1];
                if (time !== timeNext && (i !== 1 || time !== time[0])) {
                    var offset = i * stride, offsetP = offset - stride, offsetN = offset + stride;
                    for (var j = 0; j !== stride; ++j) {
                        var value = values[offset + j];
                        if (value !== values[offsetP + j] ||
                            value !== values[offsetN + j]) {
                            keep = true;
                            break;
                        }
                    }
                }
                if (keep) {
                    if (i !== writeIndex) {
                        times[writeIndex] = times[i];
                        var readOffset = i * stride, writeOffset = writeIndex * stride;
                        for (var j = 0; j !== stride; ++j) {
                            values[writeOffset + j] = values[readOffset + j];
                        }
                    }
                    ++writeIndex;
                }
            }
            if (writeIndex !== times.length) {
                this.times = THREE.AnimationUtils.arraySlice(times, 0, writeIndex);
                this.values = THREE.AnimationUtils.arraySlice(values, 0, writeIndex * stride);
            }
            return this;
        };
        KeyframeTrack.parse = function (json) {
            if (json.type === undefined) {
                throw new Error("track type undefined, can not parse");
            }
            var trackType = THREE.KeyframeTrack._getTrackTypeForValueTypeName(json.type);
            if (json.times === undefined) {
                var times = [], values = [];
                THREE.AnimationUtils.flattenJSON(json.keys, times, values, 'value');
                json.times = times;
                json.values = values;
            }
            if (trackType.parse !== undefined && trackType.parse !== KeyframeTrack.parse) {
                return trackType.parse(json);
            }
            else {
                return new trackType(json.name, json.times, json.values, json.interpolation);
            }
        };
        KeyframeTrack.toJSON = function (track) {
            var trackType = track.constructor;
            var json;
            if (trackType.toJSON !== undefined) {
                json = trackType.toJSON(track);
            }
            else {
                json = {
                    'name': track.name,
                    'times': THREE.AnimationUtils.convertArray(track.times, Array),
                    'values': THREE.AnimationUtils.convertArray(track.values, Array)
                };
                var interpolation = track.getInterpolation();
                if (interpolation !== track.DefaultInterpolation) {
                    json.interpolation = interpolation;
                }
            }
            json.type = track.ValueTypeName;
            return json;
        };
        KeyframeTrack._getTrackTypeForValueTypeName = function (typeName) {
            switch (typeName.toLowerCase()) {
                case "scalar":
                case "double":
                case "float":
                case "number":
                case "integer":
                    return THREE.NumberKeyframeTrack;
                case "vector":
                case "vector2":
                case "vector3":
                case "vector4":
                    return THREE.VectorKeyframeTrack;
                case "color":
                    return THREE.ColorKeyframeTrack;
                case "quaternion":
                    return THREE.QuaternionKeyframeTrack;
                case "bool":
                case "boolean":
                    return THREE.BooleanKeyframeTrack;
                case "string":
                    return THREE.StringKeyframeTrack;
            }
            throw new Error("Unsupported typeName: " + typeName);
        };
        return KeyframeTrack;
    }());
    THREE.KeyframeTrack = KeyframeTrack;
    KeyframeTrack.prototype.TimeBufferType = Float32Array;
    KeyframeTrack.prototype.ValueBufferType = Float32Array;
    KeyframeTrack.prototype.DefaultInterpolation = THREE.InterpolateLinear;
})(THREE || (THREE = {}));
