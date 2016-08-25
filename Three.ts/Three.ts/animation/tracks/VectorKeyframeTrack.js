/// <reference path="../keyframetrack.ts" />
/*
 *
 * A Track of vectored keyframe values.
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
    var VectorKeyframeTrack = (function (_super) {
        __extends(VectorKeyframeTrack, _super);
        function VectorKeyframeTrack(name, times, values, interpolation) {
            _super.call(this, name, times, values, interpolation);
        }
        return VectorKeyframeTrack;
    }(THREE.KeyframeTrack));
    THREE.VectorKeyframeTrack = VectorKeyframeTrack;
    VectorKeyframeTrack.prototype.ValueTypeName = 'vector';
})(THREE || (THREE = {}));
