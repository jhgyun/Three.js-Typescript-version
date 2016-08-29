var THREE;
(function (THREE) {
    var Interpolant = (function () {
        function Interpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
            this.settings = null;
            this.DefaultSettings_ = {};
            this.parameterPositions = parameterPositions;
            this._cachedIndex = 0;
            this.resultBuffer = resultBuffer !== undefined
                ? resultBuffer
                : new (sampleValues.constructor(sampleSize));
            this.sampleValues = sampleValues;
            this.valueSize = sampleSize;
        }
        Interpolant.prototype.evaluate = function (t) {
            var pp = this.parameterPositions, i1 = this._cachedIndex, t1 = pp[i1], t0 = pp[i1 - 1];
            validate_interval: {
                seek: {
                    var right;
                    linear_scan: {
                        forward_scan: if (!(t < t1)) {
                            for (var giveUpAt = i1 + 2;;) {
                                if (t1 === undefined) {
                                    if (t < t0)
                                        break forward_scan;
                                    i1 = pp.length;
                                    this._cachedIndex = i1;
                                    return this.afterEnd_(i1 - 1, t, t0);
                                }
                                if (i1 === giveUpAt)
                                    break;
                                t0 = t1;
                                t1 = pp[++i1];
                                if (t < t1) {
                                    break seek;
                                }
                            }
                            right = pp.length;
                            break linear_scan;
                        }
                        if (!(t >= t0)) {
                            var t1global = pp[1];
                            if (t < t1global) {
                                i1 = 2;
                                t0 = t1global;
                            }
                            for (var giveUpAt = i1 - 2;;) {
                                if (t0 === undefined) {
                                    this._cachedIndex = 0;
                                    return this.beforeStart_(0, t, t1);
                                }
                                if (i1 === giveUpAt)
                                    break;
                                t1 = t0;
                                t0 = pp[--i1 - 1];
                                if (t >= t0) {
                                    break seek;
                                }
                            }
                            right = i1;
                            i1 = 0;
                            break linear_scan;
                        }
                        break validate_interval;
                    }
                    while (i1 < right) {
                        var mid = (i1 + right) >>> 1;
                        if (t < pp[mid]) {
                            right = mid;
                        }
                        else {
                            i1 = mid + 1;
                        }
                    }
                    t1 = pp[i1];
                    t0 = pp[i1 - 1];
                    if (t0 === undefined) {
                        this._cachedIndex = 0;
                        return this.beforeStart_(0, t, t1);
                    }
                    if (t1 === undefined) {
                        i1 = pp.length;
                        this._cachedIndex = i1;
                        return this.afterEnd_(i1 - 1, t0, t);
                    }
                }
                this._cachedIndex = i1;
                this.intervalChanged_(i1, t0, t1);
            }
            return this.interpolate_(i1, t0, t, t1);
        };
        Interpolant.prototype.getSettings_ = function () {
            return this.settings || this.DefaultSettings_;
        };
        Interpolant.prototype.copySampleValue_ = function (index) {
            var result = this.resultBuffer;
            var values = this.sampleValues;
            var stride = this.valueSize;
            var offset = index * stride;
            for (var i = 0; i !== stride; ++i) {
                result[i] = values[offset + i];
            }
            return result;
        };
        Interpolant.prototype.interpolate_ = function (i1, t0, t, t1) {
            throw new Error("call to abstract method");
        };
        Interpolant.prototype.intervalChanged_ = function (i1, t0, t1) {
        };
        Interpolant.prototype.beforeStart_ = function (i1, t0, t1) {
            return null;
        };
        Interpolant.prototype.afterEnd_ = function (i1, t0, t1) {
            return null;
        };
        return Interpolant;
    }());
    THREE.Interpolant = Interpolant;
    Interpolant.prototype.beforeStart_ = Interpolant.prototype.copySampleValue_;
    Interpolant.prototype.afterEnd_ = Interpolant.prototype.copySampleValue_;
})(THREE || (THREE = {}));
