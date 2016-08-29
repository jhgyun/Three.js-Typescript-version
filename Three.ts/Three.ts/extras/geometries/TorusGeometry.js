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
