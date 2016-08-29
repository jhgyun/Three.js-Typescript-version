var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var TorusBufferGeometry = (function (_super) {
        __extends(TorusBufferGeometry, _super);
        function TorusBufferGeometry(radius, tube, radialSegments, tubularSegments, arc) {
            _super.call(this);
            this.type = 'TorusBufferGeometry';
            this.parameters = {
                radius: radius,
                tube: tube,
                radialSegments: radialSegments,
                tubularSegments: tubularSegments,
                arc: arc
            };
            radius = radius || 100;
            tube = tube || 40;
            radialSegments = THREE.Math.floor(radialSegments) || 8;
            tubularSegments = THREE.Math.floor(tubularSegments) || 6;
            arc = arc || THREE.Math.PI * 2;
            var vertexCount = ((radialSegments + 1) * (tubularSegments + 1));
            var indexCount = radialSegments * tubularSegments * 2 * 3;
            var indices = new (indexCount > 65535 ? Uint32Array : Uint16Array)(indexCount);
            var vertices = new Float32Array(vertexCount * 3);
            var normals = new Float32Array(vertexCount * 3);
            var uvs = new Float32Array(vertexCount * 2);
            var vertexBufferOffset = 0;
            var uvBufferOffset = 0;
            var indexBufferOffset = 0;
            var center = new THREE.Vector3();
            var vertex = new THREE.Vector3();
            var normal = new THREE.Vector3();
            var j, i;
            for (j = 0; j <= radialSegments; j++) {
                for (i = 0; i <= tubularSegments; i++) {
                    var u = i / tubularSegments * arc;
                    var v = j / radialSegments * THREE.Math.PI * 2;
                    vertex.x = (radius + tube * THREE.Math.cos(v)) * THREE.Math.cos(u);
                    vertex.y = (radius + tube * THREE.Math.cos(v)) * THREE.Math.sin(u);
                    vertex.z = tube * THREE.Math.sin(v);
                    vertices[vertexBufferOffset] = vertex.x;
                    vertices[vertexBufferOffset + 1] = vertex.y;
                    vertices[vertexBufferOffset + 2] = vertex.z;
                    center.x = radius * THREE.Math.cos(u);
                    center.y = radius * THREE.Math.sin(u);
                    normal.subVectors(vertex, center).normalize();
                    normals[vertexBufferOffset] = normal.x;
                    normals[vertexBufferOffset + 1] = normal.y;
                    normals[vertexBufferOffset + 2] = normal.z;
                    uvs[uvBufferOffset] = i / tubularSegments;
                    uvs[uvBufferOffset + 1] = j / radialSegments;
                    vertexBufferOffset += 3;
                    uvBufferOffset += 2;
                }
            }
            for (j = 1; j <= radialSegments; j++) {
                for (i = 1; i <= tubularSegments; i++) {
                    var a = (tubularSegments + 1) * j + i - 1;
                    var b = (tubularSegments + 1) * (j - 1) + i - 1;
                    var c = (tubularSegments + 1) * (j - 1) + i;
                    var d = (tubularSegments + 1) * j + i;
                    indices[indexBufferOffset] = a;
                    indices[indexBufferOffset + 1] = b;
                    indices[indexBufferOffset + 2] = d;
                    indices[indexBufferOffset + 3] = b;
                    indices[indexBufferOffset + 4] = c;
                    indices[indexBufferOffset + 5] = d;
                    indexBufferOffset += 6;
                }
            }
            this.setIndex(new THREE.BufferAttribute(indices, 1));
            this.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
            this.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
            this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        }
        ;
        return TorusBufferGeometry;
    }(THREE.BufferGeometry));
    THREE.TorusBufferGeometry = TorusBufferGeometry;
})(THREE || (THREE = {}));
