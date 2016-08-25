/// <reference path="../interpolant.ts" />
/*
 *
 * Interpolant that evaluates to the sample value at the position preceeding
 * the parameter.
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
    var DiscreteInterpolant = (function (_super) {
        __extends(DiscreteInterpolant, _super);
        function DiscreteInterpolant(parameterPositions, sampleValues, sampleSize, resultBuffer) {
            _super.call(this, parameterPositions, sampleValues, sampleSize, resultBuffer);
        }
        DiscreteInterpolant.prototype.interpolate_ = function (i1, t0, t, t1) {
            return this.copySampleValue_(i1 - 1);
        };
        return DiscreteInterpolant;
    }(THREE.Interpolant));
    THREE.DiscreteInterpolant = DiscreteInterpolant;
})(THREE || (THREE = {}));
