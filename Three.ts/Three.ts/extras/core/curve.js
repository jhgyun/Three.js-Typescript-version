var THREE;
(function (THREE) {
    var Curve = (function () {
        function Curve() {
        }
        ;
        Curve.prototype.getPoint = function (t) {
            console.warn("THREE.Curve: Warning, getPoint() not implemented!");
            return null;
        };
        Curve.prototype.getPointAt = function (u) {
            var t = this.getUtoTmapping(u);
            return this.getPoint(t);
        };
        Curve.prototype.getPoints = function (divisions) {
            if (!divisions)
                divisions = 5;
            var points = [];
            for (var d = 0; d <= divisions; d++) {
                points.push(this.getPoint(d / divisions));
            }
            return points;
        };
        Curve.prototype.getSpacedPoints = function (divisions) {
            if (!divisions)
                divisions = 5;
            var points = [];
            for (var d = 0; d <= divisions; d++) {
                points.push(this.getPointAt(d / divisions));
            }
            return points;
        };
        Curve.prototype.getLength = function () {
            var lengths = this.getLengths();
            return lengths[lengths.length - 1];
        };
        Curve.prototype.getLengths = function (divisions) {
            if (!divisions)
                divisions = (this.__arcLengthDivisions) ? (this.__arcLengthDivisions) : 200;
            if (this.cacheArcLengths
                && (this.cacheArcLengths.length === divisions + 1)
                && !this.needsUpdate) {
                return this.cacheArcLengths;
            }
            this.needsUpdate = false;
            var cache = [];
            var current, last = this.getPoint(0);
            var p, sum = 0;
            cache.push(0);
            for (p = 1; p <= divisions; p++) {
                current = this.getPoint(p / divisions);
                sum += current.distanceTo(last);
                cache.push(sum);
                last = current;
            }
            this.cacheArcLengths = cache;
            return cache;
        };
        Curve.prototype.updateArcLengths = function () {
            this.needsUpdate = true;
            this.getLengths();
        };
        Curve.prototype.getUtoTmapping = function (u, distance) {
            var arcLengths = this.getLengths();
            var i = 0, il = arcLengths.length;
            var targetArcLength;
            if (distance) {
                targetArcLength = distance;
            }
            else {
                targetArcLength = u * arcLengths[il - 1];
            }
            var low = 0, high = il - 1, comparison;
            while (low <= high) {
                i = THREE.Math.floor(low + (high - low) / 2);
                comparison = arcLengths[i] - targetArcLength;
                if (comparison < 0) {
                    low = i + 1;
                }
                else if (comparison > 0) {
                    high = i - 1;
                }
                else {
                    high = i;
                    break;
                }
            }
            i = high;
            if (arcLengths[i] === targetArcLength) {
                var t = i / (il - 1);
                return t;
            }
            var lengthBefore = arcLengths[i];
            var lengthAfter = arcLengths[i + 1];
            var segmentLength = lengthAfter - lengthBefore;
            var segmentFraction = (targetArcLength - lengthBefore) / segmentLength;
            var t = (i + segmentFraction) / (il - 1);
            return t;
        };
        Curve.prototype.getTangent = function (t) {
            var delta = 0.0001;
            var t1 = t - delta;
            var t2 = t + delta;
            if (t1 < 0)
                t1 = 0;
            if (t2 > 1)
                t2 = 1;
            var pt1 = this.getPoint(t1);
            var pt2 = this.getPoint(t2);
            var vec = pt2.clone().sub(pt1);
            return vec.normalize();
        };
        Curve.prototype.getTangentAt = function (u) {
            var t = this.getUtoTmapping(u);
            return this.getTangent(t);
        };
        Curve.create = function (constructor, getPointFunc) {
            constructor.prototype = Object.create(Curve.prototype);
            constructor.prototype.constructor = constructor;
            constructor.prototype.getPoint = getPointFunc;
            return constructor;
        };
        return Curve;
    }());
    THREE.Curve = Curve;
})(THREE || (THREE = {}));
