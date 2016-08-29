var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var BooleanKeyframeTrack = (function (_super) {
        __extends(BooleanKeyframeTrack, _super);
        function BooleanKeyframeTrack(name, times, values) {
            _super.call(this, name, times, values);
        }
        ;
        return BooleanKeyframeTrack;
    }(THREE.KeyframeTrack));
    THREE.BooleanKeyframeTrack = BooleanKeyframeTrack;
    BooleanKeyframeTrack.prototype.ValueTypeName = 'bool';
    BooleanKeyframeTrack.prototype.ValueBufferType = Array;
    BooleanKeyframeTrack.prototype.DefaultInterpolation = THREE.InterpolateDiscrete;
    BooleanKeyframeTrack.prototype.InterpolantFactoryMethodLinear = undefined;
    BooleanKeyframeTrack.prototype.InterpolantFactoryMethodSmooth = undefined;
})(THREE || (THREE = {}));
