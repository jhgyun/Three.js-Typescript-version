/// <reference path="../../core/geometry.ts" />
/*
 * @author oosmoxiecode
 * @author mrdoob / http://mrdoob.com/
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3DLite/src/away3dlite/primitives/Torus.as?r=2888
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var TorusGeometry = (function (_super) {
        __extends(TorusGeometry, _super);
        function TorusGeometry(radius, tube, radialSegments, tubularSegments, arc) {
            _super.call(this);
            this.type = 'TorusGeometry';
            this.parameters = {
                radius: radius,
                tube: tube,
                radialSegments: radialSegments,
                tubularSegments: tubularSegments,
                arc: arc
            };
            this.fromBufferGeometry(new THREE.TorusBufferGeometry(radius, tube, radialSegments, tubularSegments, arc));
        }
        ;
        return TorusGeometry;
    }(THREE.Geometry));
    THREE.TorusGeometry = TorusGeometry;
})(THREE || (THREE = {}));
