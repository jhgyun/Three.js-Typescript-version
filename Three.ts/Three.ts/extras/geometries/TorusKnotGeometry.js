var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var TorusKnotGeometry = (function (_super) {
        __extends(TorusKnotGeometry, _super);
        function TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q, heightScale) {
            _super.call(this);
            this.type = 'TorusKnotGeometry';
            this.parameters = {
                radius: radius,
                tube: tube,
                tubularSegments: tubularSegments,
                radialSegments: radialSegments,
                p: p,
                q: q
            };
            if (heightScale !== undefined)
                console.warn('THREE.TorusKnotGeometry: heightScale has been deprecated. Use .scale( x, y, z ) instead.');
            this.fromBufferGeometry(new THREE.TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q));
            this.mergeVertices();
        }
        ;
        return TorusKnotGeometry;
    }(THREE.Geometry));
    THREE.TorusKnotGeometry = TorusKnotGeometry;
})(THREE || (THREE = {}));
