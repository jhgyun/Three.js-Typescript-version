var THREE;
(function (THREE) {
    THREE.CurveUtils = {
        tangentQuadraticBezier: function (t, p0, p1, p2) {
            return 2 * (1 - t) * (p1 - p0) + 2 * t * (p2 - p1);
        },
        tangentCubicBezier: function (t, p0, p1, p2, p3) {
            return -3 * p0 * (1 - t) * (1 - t) +
                3 * p1 * (1 - t) * (1 - t) - 6 * t * p1 * (1 - t) +
                6 * t * p2 * (1 - t) - 3 * t * t * p2 +
                3 * t * t * p3;
        },
        tangentSpline: function (t, p0, p1, p2, p3) {
            var h00 = 6 * t * t - 6 * t;
            var h10 = 3 * t * t - 4 * t + 1;
            var h01 = -6 * t * t + 6 * t;
            var h11 = 3 * t * t - 2 * t;
            return h00 + h10 + h01 + h11;
        },
        interpolate: function (p0, p1, p2, p3, t) {
            var v0 = (p2 - p0) * 0.5;
            var v1 = (p3 - p1) * 0.5;
            var t2 = t * t;
            var t3 = t * t2;
            return (2 * p1 - 2 * p2 + v0 + v1) * t3 + (-3 * p1 + 3 * p2 - 2 * v0 - v1) * t2 + v0 * t + p1;
        }
    };
})(THREE || (THREE = {}));
