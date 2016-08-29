var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var LatheBufferGeometry = (function (_super) {
        __extends(LatheBufferGeometry, _super);
        function LatheBufferGeometry(points, segments, phiStart, phiLength) {
            _super.call(this);
            this.type = 'LatheBufferGeometry';
            this.parameters = {
                points: points,
                segments: segments,
                phiStart: phiStart,
                phiLength: phiLength
            };
            segments = THREE.Math.floor(segments) || 12;
            phiStart = phiStart || 0;
            phiLength = phiLength || THREE.Math.PI * 2;
            phiLength = THREE.Math.clamp(phiLength, 0, THREE.Math.PI * 2);
            var vertexCount = (segments + 1) * points.length;
            var indexCount = segments * points.length * 2 * 3;
            var indices = new THREE.BufferAttribute(new (indexCount > 65535 ? Uint32Array : Uint16Array)(indexCount), 1);
            var vertices = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
            var uvs = new THREE.BufferAttribute(new Float32Array(vertexCount * 2), 2);
            var index = 0, indexOffset = 0, base;
            var inversePointLength = 1.0 / (points.length - 1);
            var inverseSegments = 1.0 / segments;
            var vertex = new THREE.Vector3();
            var uv = new THREE.Vector2();
            var i, j;
            for (i = 0; i <= segments; i++) {
                var phi = phiStart + i * inverseSegments * phiLength;
                var sin = THREE.Math.sin(phi);
                var cos = THREE.Math.cos(phi);
                for (j = 0; j <= (points.length - 1); j++) {
                    vertex.x = points[j].x * sin;
                    vertex.y = points[j].y;
                    vertex.z = points[j].x * cos;
                    vertices.setXYZ(index, vertex.x, vertex.y, vertex.z);
                    uv.x = i / segments;
                    uv.y = j / (points.length - 1);
                    uvs.setXY(index, uv.x, uv.y);
                    index++;
                }
            }
            for (i = 0; i < segments; i++) {
                for (j = 0; j < (points.length - 1); j++) {
                    base = j + i * points.length;
                    var a = base;
                    var b = base + points.length;
                    var c = base + points.length + 1;
                    var d = base + 1;
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
            this.addAttribute('uv', uvs);
            this.computeVertexNormals();
            if (phiLength === THREE.Math.PI * 2) {
                var normals = this.attributes.normal.array;
                var n1 = new THREE.Vector3();
                var n2 = new THREE.Vector3();
                var n = new THREE.Vector3();
                base = segments * points.length * 3;
                for (i = 0, j = 0; i < points.length; i++, j += 3) {
                    n1.x = normals[j + 0];
                    n1.y = normals[j + 1];
                    n1.z = normals[j + 2];
                    n2.x = normals[base + j + 0];
                    n2.y = normals[base + j + 1];
                    n2.z = normals[base + j + 2];
                    n.addVectors(n1, n2).normalize();
                    normals[j + 0] = normals[base + j + 0] = n.x;
                    normals[j + 1] = normals[base + j + 1] = n.y;
                    normals[j + 2] = normals[base + j + 2] = n.z;
                }
            }
        }
        ;
        return LatheBufferGeometry;
    }(THREE.BufferGeometry));
    THREE.LatheBufferGeometry = LatheBufferGeometry;
})(THREE || (THREE = {}));
