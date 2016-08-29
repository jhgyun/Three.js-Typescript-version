var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var NumberKeyframeTrack = (function (_super) {
        __extends(NumberKeyframeTrack, _super);
        function NumberKeyframeTrack(name, times, values, interpolation) {
            _super.call(this, name, times, values, interpolation);
        }
        ;
        return NumberKeyframeTrack;
    }(THREE.KeyframeTrack));
    THREE.NumberKeyframeTrack = NumberKeyframeTrack;
    NumberKeyframeTrack.prototype.ValueTypeName = 'number';
})(THREE || (THREE = {}));
