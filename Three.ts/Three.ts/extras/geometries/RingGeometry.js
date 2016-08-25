/// <reference path="../../core/geometry.ts" />
/*
 * @author Kaleb Murphy
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var RingGeometry = (function (_super) {
        __extends(RingGeometry, _super);
        function RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {
            _super.call(this);
            this.type = 'RingGeometry';
            this.parameters = {
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                thetaSegments: thetaSegments,
                phiSegments: phiSegments,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
            this.fromBufferGeometry(new THREE.RingBufferGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength));
        }
        ;
        return RingGeometry;
    }(THREE.Geometry));
    THREE.RingGeometry = RingGeometry;
})(THREE || (THREE = {}));
