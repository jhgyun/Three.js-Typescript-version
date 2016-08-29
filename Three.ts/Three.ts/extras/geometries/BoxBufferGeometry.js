var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var BoxBufferGeometry = (function (_super) {
        __extends(BoxBufferGeometry, _super);
        function BoxBufferGeometry(width, height, depth, widthSegments, heightSegments, depthSegments) {
            _super.call(this);
            this.type = 'BoxBufferGeometry';
            this.parameters = {
                width: width,
                height: height,
                depth: depth,
                widthSegments: widthSegments,
                heightSegments: heightSegments,
                depthSegments: depthSegments
            };
            var scope = this;
            widthSegments = THREE.Math.floor(widthSegments) || 1;
            heightSegments = THREE.Math.floor(heightSegments) || 1;
            depthSegments = THREE.Math.floor(depthSegments) || 1;
            var vertexCount = BoxBufferGeometry.calculateVertexCount(widthSegments, heightSegments, depthSegments);
            var indexCount = BoxBufferGeometry.calculateIndexCount(widthSegments, heightSegments, depthSegments);
            var indices = new (indexCount > 65535 ? Uint32Array : Uint16Array)(indexCount);
            var vertices = new Float32Array(vertexCount * 3);
            var normals = new Float32Array(vertexCount * 3);
            var uvs = new Float32Array(vertexCount * 2);
            var vertexBufferOffset = 0;
            var uvBufferOffset = 0;
            var indexBufferOffset = 0;
            var numberOfVertices = 0;
            var groupStart = 0;
            buildPlane('z', 'y', 'x', -1, -1, depth, height, width, depthSegments, heightSegments, 0);
            buildPlane('z', 'y', 'x', 1, -1, depth, height, -width, depthSegments, heightSegments, 1);
            buildPlane('x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2);
            buildPlane('x', 'z', 'y', 1, -1, width, depth, -height, widthSegments, depthSegments, 3);
            buildPlane('x', 'y', 'z', 1, -1, width, height, depth, widthSegments, heightSegments, 4);
            buildPlane('x', 'y', 'z', -1, -1, width, height, -depth, widthSegments, heightSegments, 5);
            this.setIndex(new THREE.BufferAttribute(indices, 1));
            this.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
            this.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
            this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
            function buildPlane(u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex) {
                var segmentWidth = width / gridX;
                var segmentHeight = height / gridY;
                var widthHalf = width / 2;
                var heightHalf = height / 2;
                var depthHalf = depth / 2;
                var gridX1 = gridX + 1;
                var gridY1 = gridY + 1;
                var vertexCounter = 0;
                var groupCount = 0;
                var vector = new THREE.Vector3();
                for (var iy = 0; iy < gridY1; iy++) {
                    var y = iy * segmentHeight - heightHalf;
                    for (var ix = 0; ix < gridX1; ix++) {
                        var x = ix * segmentWidth - widthHalf;
                        vector[u] = x * udir;
                        vector[v] = y * vdir;
                        vector[w] = depthHalf;
                        vertices[vertexBufferOffset] = vector.x;
                        vertices[vertexBufferOffset + 1] = vector.y;
                        vertices[vertexBufferOffset + 2] = vector.z;
                        vector[u] = 0;
                        vector[v] = 0;
                        vector[w] = depth > 0 ? 1 : -1;
                        normals[vertexBufferOffset] = vector.x;
                        normals[vertexBufferOffset + 1] = vector.y;
                        normals[vertexBufferOffset + 2] = vector.z;
                        uvs[uvBufferOffset] = ix / gridX;
                        uvs[uvBufferOffset + 1] = 1 - (iy / gridY);
                        vertexBufferOffset += 3;
                        uvBufferOffset += 2;
                        vertexCounter += 1;
                    }
                }
                for (iy = 0; iy < gridY; iy++) {
                    for (ix = 0; ix < gridX; ix++) {
                        var a = numberOfVertices + ix + gridX1 * iy;
                        var b = numberOfVertices + ix + gridX1 * (iy + 1);
                        var c = numberOfVertices + (ix + 1) + gridX1 * (iy + 1);
                        var d = numberOfVertices + (ix + 1) + gridX1 * iy;
                        indices[indexBufferOffset] = a;
                        indices[indexBufferOffset + 1] = b;
                        indices[indexBufferOffset + 2] = d;
                        indices[indexBufferOffset + 3] = b;
                        indices[indexBufferOffset + 4] = c;
                        indices[indexBufferOffset + 5] = d;
                        indexBufferOffset += 6;
                        groupCount += 6;
                    }
                }
                scope.addGroup(groupStart, groupCount, materialIndex);
                groupStart += groupCount;
                numberOfVertices += vertexCounter;
            }
        }
        ;
        BoxBufferGeometry.calculateVertexCount = function (w, h, d) {
            var vertices = 0;
            vertices += (w + 1) * (h + 1) * 2;
            vertices += (w + 1) * (d + 1) * 2;
            vertices += (d + 1) * (h + 1) * 2;
            return vertices;
        };
        BoxBufferGeometry.calculateIndexCount = function (w, h, d) {
            var index = 0;
            index += w * h * 2;
            index += w * d * 2;
            index += d * h * 2;
            return index * 6;
        };
        return BoxBufferGeometry;
    }(THREE.BufferGeometry));
    THREE.BoxBufferGeometry = BoxBufferGeometry;
})(THREE || (THREE = {}));
