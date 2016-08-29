var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var TetrahedronGeometry = (function (_super) {
        __extends(TetrahedronGeometry, _super);
        function TetrahedronGeometry(radius, detail) {
            var vertices = [
                1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1
            ];
            var indices = [
                2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
            ];
            _super.call(this, vertices, indices, radius, detail);
            this.type = 'TetrahedronGeometry';
            this.parameters = {
                radius: radius,
                detail: detail
            };
        }
        ;
        return TetrahedronGeometry;
    }(THREE.PolyhedronGeometry));
    THREE.TetrahedronGeometry = TetrahedronGeometry;
})(THREE || (THREE = {}));
