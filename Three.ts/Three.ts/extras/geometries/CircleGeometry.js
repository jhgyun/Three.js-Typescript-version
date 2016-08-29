var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var CircleGeometry = (function (_super) {
        __extends(CircleGeometry, _super);
        function CircleGeometry(radius, segments, thetaStart, thetaLength) {
            _super.call(this);
            this.type = 'CircleGeometry';
            this.parameters = {
                radius: radius,
                segments: segments,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
            this.fromBufferGeometry(new THREE.CircleBufferGeometry(radius, segments, thetaStart, thetaLength));
        }
        ;
        return CircleGeometry;
    }(THREE.Geometry));
    THREE.CircleGeometry = CircleGeometry;
})(THREE || (THREE = {}));
