var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var LineSegments = (function (_super) {
        __extends(LineSegments, _super);
        function LineSegments(geometry, material) {
            _super.call(this, geometry, material);
            this.type = 'LineSegments';
        }
        ;
        return LineSegments;
    }(THREE.Line));
    THREE.LineSegments = LineSegments;
})(THREE || (THREE = {}));
