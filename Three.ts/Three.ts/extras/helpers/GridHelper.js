var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../../objects/linesegments.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 */
var THREE;
(function (THREE) {
    var GridHelper = (function (_super) {
        __extends(GridHelper, _super);
        function GridHelper(size, divisions, acolor1, acolor2) {
            _super.call(this);
            divisions = divisions || 1;
            var color1 = new THREE.Color(acolor1 !== undefined ? acolor1 : 0x444444);
            var color2 = new THREE.Color(acolor2 !== undefined ? acolor2 : 0x888888);
            var center = divisions / 2;
            var step = (size * 2) / divisions;
            var vertices = [], colors = [];
            for (var i = 0, j = 0, k = -size; i <= divisions; i++, k += step) {
                vertices.push(-size, 0, k, size, 0, k);
                vertices.push(k, 0, -size, k, 0, size);
                var color = i === center ? color1 : color2;
                color.toArray(colors, j);
                j += 3;
                color.toArray(colors, j);
                j += 3;
                color.toArray(colors, j);
                j += 3;
                color.toArray(colors, j);
                j += 3;
            }
            var geometry = new THREE.BufferGeometry();
            geometry.addAttribute('position', new THREE.Float32Attribute(vertices, 3));
            geometry.addAttribute('color', new THREE.Float32Attribute(colors, 3));
            var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors });
            this.geometry = geometry;
            this.material = material;
        }
        ;
        return GridHelper;
    }(THREE.LineSegments));
    THREE.GridHelper = GridHelper;
})(THREE || (THREE = {}));
