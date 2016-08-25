/// <reference path="../keyframetrack.ts" />
/*
 *
 * A Track that interpolates Strings
 *
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
    var StringKeyframeTrack = (function (_super) {
        __extends(StringKeyframeTrack, _super);
        function StringKeyframeTrack(name, times, values, interpolation) {
            _super.call(this, name, times, values, interpolation);
        }
        ;
        return StringKeyframeTrack;
    }(THREE.KeyframeTrack));
    THREE.StringKeyframeTrack = StringKeyframeTrack;
    StringKeyframeTrack.prototype.ValueTypeName = 'string';
    StringKeyframeTrack.prototype.ValueBufferType = Array;
    StringKeyframeTrack.prototype.DefaultInterpolation = THREE.InterpolateDiscrete;
    StringKeyframeTrack.prototype.InterpolantFactoryMethodLinear = undefined;
    StringKeyframeTrack.prototype.InterpolantFactoryMethodSmooth = undefined;
})(THREE || (THREE = {}));
