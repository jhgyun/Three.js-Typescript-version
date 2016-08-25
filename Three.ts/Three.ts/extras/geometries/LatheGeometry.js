/// <reference path="../../core/geometry.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
 * @author astrodud / http://astrodud.isgreat.org/
 * @author zz85 / https://github.com/zz85
 * @author bhouston / http://clara.io
 */
// points - to create a closed torus, one must use a set of points
//    like so: [ a, b, c, d, a ], see first is the same as last.
// segments - the number of circumference segments to create
// phiStart - the starting radian
// phiLength - the radian (0 to 2PI) range of the lathed section
//    2PI is a closed lathe, less than 2PI is a portion.
var THREE;
(function (THREE) {
    var LatheGeometry = (function (_super) {
        __extends(LatheGeometry, _super);
        function LatheGeometry(points, segments, phiStart, phiLength) {
            _super.call(this);
            this.type = 'LatheGeometry';
            this.parameters = {
                points: points,
                segments: segments,
                phiStart: phiStart,
                phiLength: phiLength
            };
            this.fromBufferGeometry(new THREE.LatheBufferGeometry(points, segments, phiStart, phiLength));
            this.mergeVertices();
        }
        return LatheGeometry;
    }(THREE.Geometry));
    THREE.LatheGeometry = LatheGeometry;
})(THREE || (THREE = {}));
