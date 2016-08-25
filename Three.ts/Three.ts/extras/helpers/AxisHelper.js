/// <reference path="../../objects/linesegments.ts" />
/*
 * @author sroucheray / http://sroucheray.org/
 * @author mrdoob / http://mrdoob.com/
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var AxisHelper = (function (_super) {
        __extends(AxisHelper, _super);
        function AxisHelper(size) {
            size = size || 1;
            var vertices = new Float32Array([
                0, 0, 0, size, 0, 0,
                0, 0, 0, 0, size, 0,
                0, 0, 0, 0, 0, size
            ]);
            var colors = new Float32Array([
                1, 0, 0, 1, 0.6, 0,
                0, 1, 0, 0.6, 1, 0,
                0, 0, 1, 0, 0.6, 1
            ]);
            var geometry = new THREE.BufferGeometry();
            geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geometry.addAttribute('color', new THREE.BufferAttribute(colors, 3));
            var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
            _super.call(this, geometry, material);
        }
        return AxisHelper;
    }(THREE.LineSegments));
    THREE.AxisHelper = AxisHelper;
})(THREE || (THREE = {}));
