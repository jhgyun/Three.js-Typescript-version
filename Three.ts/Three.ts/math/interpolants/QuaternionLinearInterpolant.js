/// <reference path="../interpolant.ts" />
/*
 * Spherical linear unit quaternion interpolant.
 *
 * @author tschw
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var QuaternionLinearInterpolant = (function (_super) {
        __extends(QuaternionLinearInterpolant, _super);
        function QuaternionLinearInterpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
            _super.call(this, parameterPositions, sampleValues, sampleSize, resultBuffer);
        }
        QuaternionLinearInterpolant.prototype.interpolate_ = function (i1, t0, t, t1) {
            var result = this.resultBuffer, values = this.sampleValues, stride = this.valueSize, offset = i1 * stride, alpha = (t - t0) / (t1 - t0);
            for (var end = offset + stride; offset !== end; offset += 4) {
                THREE.Quaternion.slerpFlat(result, 0, values, offset - stride, values, offset, alpha);
            }
            return result;
        };
        return QuaternionLinearInterpolant;
    }(THREE.Interpolant));
    THREE.QuaternionLinearInterpolant = QuaternionLinearInterpolant;
})(THREE || (THREE = {}));
