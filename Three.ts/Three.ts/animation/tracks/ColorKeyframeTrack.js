var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var ColorKeyframeTrack = (function (_super) {
        __extends(ColorKeyframeTrack, _super);
        function ColorKeyframeTrack(name, times, values, interpolation) {
            _super.call(this, name, times, values, interpolation);
        }
        ;
        return ColorKeyframeTrack;
    }(THREE.KeyframeTrack));
    THREE.ColorKeyframeTrack = ColorKeyframeTrack;
    ColorKeyframeTrack.prototype.ValueTypeName = 'color';
})(THREE || (THREE = {}));
