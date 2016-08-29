var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var TorusKnotBufferGeometry = (function (_super) {
        __extends(TorusKnotBufferGeometry, _super);
        function TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q) {
            _super.call(this);
            this.type = 'TorusKnotBufferGeometry';
            this.parameters = {
                radius: radius,
                tube: tube,
                tubularSegments: tubularSegments,
                radialSegments: radialSegments,
                p: p,
                q: q
            };
            radius = radius || 100;
            tube = tube || 40;
            tubularSegments = THREE.Math.floor(tubularSegments) || 64;
            radialSegments = THREE.Math.floor(radialSegments) || 8;
            p = p || 2;
            q = q || 3;
            var vertexCount = ((radialSegments + 1) * (tubularSegments + 1));
            var indexCount = radialSegments * tubularSegments * 2 * 3;
            var indices = new THREE.BufferAttribute(new (indexCount > 65535 ? Uint32Array : Uint16Array)(indexCount), 1);
            var vertices = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
            var normals = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
            var uvs = new THREE.BufferAttribute(new Float32Array(vertexCount * 2), 2);
            var i, j, index = 0, indexOffset = 0;
            var vertex = new THREE.Vector3();
            var normal = new THREE.Vector3();
            var uv = new THREE.Vector2();
            var P1 = new THREE.Vector3();
            var P2 = new THREE.Vector3();
            var B = new THREE.Vector3();
            var T = new THREE.Vector3();
            var N = new THREE.Vector3();
            for (i = 0; i <= tubularSegments; ++i) {
                var u = i / tubularSegments * p * THREE.Math.PI * 2;
                calculatePositionOnCurve(u, p, q, radius, P1);
                calculatePositionOnCurve(u + 0.01, p, q, radius, P2);
                T.subVectors(P2, P1);
                N.addVectors(P2, P1);
                B.crossVectors(T, N);
                N.crossVectors(B, T);
                B.normalize();
                N.normalize();
                for (j = 0; j <= radialSegments; ++j) {
                    var v = j / radialSegments * THREE.Math.PI * 2;
                    var cx = -tube * THREE.Math.cos(v);
                    var cy = tube * THREE.Math.sin(v);
                    vertex.x = P1.x + (cx * N.x + cy * B.x);
                    vertex.y = P1.y + (cx * N.y + cy * B.y);
                    vertex.z = P1.z + (cx * N.z + cy * B.z);
                    vertices.setXYZ(index, vertex.x, vertex.y, vertex.z);
                    normal.subVectors(vertex, P1).normalize();
                    normals.setXYZ(index, normal.x, normal.y, normal.z);
                    uv.x = i / tubularSegments;
                    uv.y = j / radialSegments;
                    uvs.setXY(index, uv.x, uv.y);
                    index++;
                }
            }
            for (j = 1; j <= tubularSegments; j++) {
                for (i = 1; i <= radialSegments; i++) {
                    var a = (radialSegments + 1) * (j - 1) + (i - 1);
                    var b = (radialSegments + 1) * j + (i - 1);
                    var c = (radialSegments + 1) * j + i;
                    var d = (radialSegments + 1) * (j - 1) + i;
                    indices.setX(indexOffset, a);
                    indexOffset++;
                    indices.setX(indexOffset, b);
                    indexOffset++;
                    indices.setX(indexOffset, d);
                    indexOffset++;
                    indices.setX(indexOffset, b);
                    indexOffset++;
                    indices.setX(indexOffset, c);
                    indexOffset++;
                    indices.setX(indexOffset, d);
                    indexOffset++;
                }
            }
            this.setIndex(indices);
            this.addAttribute('position', vertices);
            this.addAttribute('normal', normals);
            this.addAttribute('uv', uvs);
            function calculatePositionOnCurve(u, p, q, radius, position) {
                var cu = THREE.Math.cos(u);
                var su = THREE.Math.sin(u);
                var quOverP = q / p * u;
                var cs = THREE.Math.cos(quOverP);
                position.x = radius * (2 + cs) * 0.5 * cu;
                position.y = radius * (2 + cs) * su * 0.5;
                position.z = radius * THREE.Math.sin(quOverP) * 0.5;
            }
        }
        ;
        return TorusKnotBufferGeometry;
    }(THREE.BufferGeometry));
    THREE.TorusKnotBufferGeometry = TorusKnotBufferGeometry;
})(THREE || (THREE = {}));
