var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
