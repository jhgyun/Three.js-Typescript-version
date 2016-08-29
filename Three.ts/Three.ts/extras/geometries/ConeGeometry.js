var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var ConeGeometry = (function (_super) {
        __extends(ConeGeometry, _super);
        function ConeGeometry(radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
            _super.call(this, 0, radius, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength);
            this.type = 'ConeGeometry';
            this.parameters = {
                radius: radius,
                height: height,
                radialSegments: radialSegments,
                heightSegments: heightSegments,
                openEnded: openEnded,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
        }
        ;
        return ConeGeometry;
    }(THREE.CylinderGeometry));
    THREE.ConeGeometry = ConeGeometry;
})(THREE || (THREE = {}));
