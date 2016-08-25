/// <reference path="../../core/geometry.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var PlaneGeometry = (function (_super) {
        __extends(PlaneGeometry, _super);
        function PlaneGeometry(width, height, widthSegments, heightSegments) {
            _super.call(this);
            this.type = 'PlaneGeometry';
            this.parameters = {
                width: width,
                height: height,
                widthSegments: widthSegments,
                heightSegments: heightSegments
            };
            this.fromBufferGeometry(new THREE.PlaneBufferGeometry(width, height, widthSegments, heightSegments));
        }
        ;
        return PlaneGeometry;
    }(THREE.Geometry));
    THREE.PlaneGeometry = PlaneGeometry;
})(THREE || (THREE = {}));
