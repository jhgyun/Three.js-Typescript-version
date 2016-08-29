var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var BoxGeometry = (function (_super) {
        __extends(BoxGeometry, _super);
        function BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments) {
            _super.call(this);
            this.type = 'BoxGeometry';
            this.parameters = {
                width: width,
                height: height,
                depth: depth,
                widthSegments: widthSegments,
                heightSegments: heightSegments,
                depthSegments: depthSegments
            };
            this.fromBufferGeometry(new THREE.BoxBufferGeometry(width, height, depth, widthSegments, heightSegments, depthSegments));
            this.mergeVertices();
        }
        ;
        return BoxGeometry;
    }(THREE.Geometry));
    THREE.BoxGeometry = BoxGeometry;
    THREE.CubeGeometry = BoxGeometry;
})(THREE || (THREE = {}));
