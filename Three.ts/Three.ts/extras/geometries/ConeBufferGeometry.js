var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var ConeBufferGeometry = (function (_super) {
        __extends(ConeBufferGeometry, _super);
        function ConeBufferGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
            _super.call(this, 0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
            this.type = 'ConeBufferGeometry';
            this.parameters = {
                radius: radius,
                height: height,
                radialSegments: radialSegments,
                heightSegments: heightSegments,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
        }
        ;
        return ConeBufferGeometry;
    }(THREE.CylinderBufferGeometry));
    THREE.ConeBufferGeometry = ConeBufferGeometry;
})(THREE || (THREE = {}));
