/// <reference path="../../objects/linesegments.ts" />
/*
 * @author WestLangley / http://github.com/WestLangley
 * @param object THREE.Mesh whose geometry will be used
 * @param hex line color
 * @param thresholdAngle the minimum angle (in degrees),
 * between the face normals of adjacent faces,
 * that is required to render an edge. A value of 10 means
 * an edge is only rendered if the angle is at least 10 degrees.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var EdgesHelper = (function (_super) {
        __extends(EdgesHelper, _super);
        function EdgesHelper(object, hex, thresholdAngle) {
            _super.call(this);
            var color = (hex !== undefined) ? hex : 0xffffff;
            this.geometry = new THREE.EdgesGeometry(object.geometry, thresholdAngle);
            this.material = new THREE.LineBasicMaterial({ color: color });
            this.matrix = object.matrixWorld;
            this.matrixAutoUpdate = false;
        }
        ;
        return EdgesHelper;
    }(THREE.LineSegments));
    THREE.EdgesHelper = EdgesHelper;
})(THREE || (THREE = {}));
