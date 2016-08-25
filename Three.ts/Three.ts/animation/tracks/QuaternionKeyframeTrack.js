/// <reference path="../keyframetrack.ts" />
/*
 *
 * A Track of quaternion keyframe values.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var QuaternionKeyframeTrack = (function (_super) {
        __extends(QuaternionKeyframeTrack, _super);
        function QuaternionKeyframeTrack(name, times, values, interpolation) {
            _super.call(this, name, times, values, interpolation);
        }
        ;
        QuaternionKeyframeTrack.prototype.InterpolantFactoryMethodLinear = function (result) {
            return new THREE.QuaternionLinearInterpolant(this.times, this.values, this.getValueSize(), result);
        };
        return QuaternionKeyframeTrack;
    }(THREE.KeyframeTrack));
    THREE.QuaternionKeyframeTrack = QuaternionKeyframeTrack;
    QuaternionKeyframeTrack.prototype.ValueTypeName = 'quaternion';
    QuaternionKeyframeTrack.prototype.DefaultInterpolation = THREE.InterpolateLinear;
    QuaternionKeyframeTrack.prototype.InterpolantFactoryMethodSmooth = undefined;
})(THREE || (THREE = {}));
