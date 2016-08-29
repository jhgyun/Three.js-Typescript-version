var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var RingBufferGeometry = (function (_super) {
        __extends(RingBufferGeometry, _super);
        function RingBufferGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength) {
            _super.call(this);
            this.type = 'RingBufferGeometry';
            this.parameters = {
                innerRadius: innerRadius,
                outerRadius: outerRadius,
                thetaSegments: thetaSegments,
                phiSegments: phiSegments,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
            innerRadius = innerRadius || 20;
            outerRadius = outerRadius || 50;
            thetaStart = thetaStart !== undefined ? thetaStart : 0;
            thetaLength = thetaLength !== undefined ? thetaLength : THREE.Math.PI * 2;
            thetaSegments = thetaSegments !== undefined ? THREE.Math.max(3, thetaSegments) : 8;
            phiSegments = phiSegments !== undefined ? THREE.Math.max(1, phiSegments) : 1;
            var vertexCount = (thetaSegments + 1) * (phiSegments + 1);
            var indexCount = thetaSegments * phiSegments * 2 * 3;
            var indices = new THREE.BufferAttribute(new (indexCount > 65535 ? Uint32Array : Uint16Array)(indexCount), 1);
            var vertices = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
            var normals = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
            var uvs = new THREE.BufferAttribute(new Float32Array(vertexCount * 2), 2);
            var index = 0, indexOffset = 0, segment;
            var radius = innerRadius;
            var radiusStep = ((outerRadius - innerRadius) / phiSegments);
            var vertex = new THREE.Vector3();
            var uv = new THREE.Vector2();
            var j, i;
            for (j = 0; j <= phiSegments; j++) {
                for (i = 0; i <= thetaSegments; i++) {
                    segment = thetaStart + i / thetaSegments * thetaLength;
                    vertex.x = radius * THREE.Math.cos(segment);
                    vertex.y = radius * THREE.Math.sin(segment);
                    vertices.setXYZ(index, vertex.x, vertex.y, vertex.z);
                    normals.setXYZ(index, 0, 0, 1);
                    uv.x = (vertex.x / outerRadius + 1) / 2;
                    uv.y = (vertex.y / outerRadius + 1) / 2;
                    uvs.setXY(index, uv.x, uv.y);
                    index++;
                }
                radius += radiusStep;
            }
            for (j = 0; j < phiSegments; j++) {
                var thetaSegmentLevel = j * (thetaSegments + 1);
                for (i = 0; i < thetaSegments; i++) {
                    segment = i + thetaSegmentLevel;
                    var a = segment;
                    var b = segment + thetaSegments + 1;
                    var c = segment + thetaSegments + 2;
                    var d = segment + 1;
                    indices.setX(indexOffset, a);
                    indexOffset++;
                    indices.setX(indexOffset, b);
                    indexOffset++;
                    indices.setX(indexOffset, c);
                    indexOffset++;
                    indices.setX(indexOffset, a);
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
        }
        ;
        return RingBufferGeometry;
    }(THREE.BufferGeometry));
    THREE.RingBufferGeometry = RingBufferGeometry;
})(THREE || (THREE = {}));
