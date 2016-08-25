/// <reference path="../../core/geometry.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var SphereGeometry = (function (_super) {
        __extends(SphereGeometry, _super);
        function SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
            _super.call(this);
            this.type = 'SphereGeometry';
            this.parameters = {
                radius: radius,
                widthSegments: widthSegments,
                heightSegments: heightSegments,
                phiStart: phiStart,
                phiLength: phiLength,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
            this.fromBufferGeometry(new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength));
        }
        ;
        return SphereGeometry;
    }(THREE.Geometry));
    THREE.SphereGeometry = SphereGeometry;
})(THREE || (THREE = {}));
