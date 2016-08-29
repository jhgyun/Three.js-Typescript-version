var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var CylinderBufferGeometry = (function (_super) {
        __extends(CylinderBufferGeometry, _super);
        function CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength) {
            _super.call(this);
            this.type = 'CylinderBufferGeometry';
            this.parameters = {
                radiusTop: radiusTop,
                radiusBottom: radiusBottom,
                height: height,
                radialSegments: radialSegments,
                heightSegments: heightSegments,
                openEnded: openEnded,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
            var scope = this;
            radiusTop = radiusTop !== undefined ? radiusTop : 20;
            radiusBottom = radiusBottom !== undefined ? radiusBottom : 20;
            height = height !== undefined ? height : 100;
            radialSegments = THREE.Math.floor(radialSegments) || 8;
            heightSegments = THREE.Math.floor(heightSegments) || 1;
            openEnded = openEnded !== undefined ? openEnded : false;
            thetaStart = thetaStart !== undefined ? thetaStart : 0.0;
            thetaLength = thetaLength !== undefined ? thetaLength : 2.0 * THREE.Math.PI;
            var nbCap = 0;
            if (openEnded === false) {
                if (radiusTop > 0)
                    nbCap++;
                if (radiusBottom > 0)
                    nbCap++;
            }
            var vertexCount = calculateVertexCount();
            var indexCount = calculateIndexCount();
            var indices = new THREE.BufferAttribute(new (indexCount > 65535 ? Uint32Array : Uint16Array)(indexCount), 1);
            var vertices = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
            var normals = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
            var uvs = new THREE.BufferAttribute(new Float32Array(vertexCount * 2), 2);
            var index = 0, indexOffset = 0, indexArray = [], halfHeight = height / 2;
            var groupStart = 0;
            generateTorso();
            if (openEnded === false) {
                if (radiusTop > 0)
                    generateCap(true);
                if (radiusBottom > 0)
                    generateCap(false);
            }
            this.setIndex(indices);
            this.addAttribute('position', vertices);
            this.addAttribute('normal', normals);
            this.addAttribute('uv', uvs);
            function calculateVertexCount() {
                var count = (radialSegments + 1) * (heightSegments + 1);
                if (openEnded === false) {
                    count += ((radialSegments + 1) * nbCap) + (radialSegments * nbCap);
                }
                return count;
            }
            function calculateIndexCount() {
                var count = radialSegments * heightSegments * 2 * 3;
                if (openEnded === false) {
                    count += radialSegments * nbCap * 3;
                }
                return count;
            }
            function generateTorso() {
                var x, y;
                var normal = new THREE.Vector3();
                var vertex = new THREE.Vector3();
                var groupCount = 0;
                var tanTheta = (radiusBottom - radiusTop) / height;
                for (y = 0; y <= heightSegments; y++) {
                    var indexRow = [];
                    var v = y / heightSegments;
                    var radius = v * (radiusBottom - radiusTop) + radiusTop;
                    for (x = 0; x <= radialSegments; x++) {
                        var u = x / radialSegments;
                        vertex.x = radius * THREE.Math.sin(u * thetaLength + thetaStart);
                        vertex.y = -v * height + halfHeight;
                        vertex.z = radius * THREE.Math.cos(u * thetaLength + thetaStart);
                        vertices.setXYZ(index, vertex.x, vertex.y, vertex.z);
                        normal.copy(vertex);
                        if ((radiusTop === 0 && y === 0) || (radiusBottom === 0 && y === heightSegments)) {
                            normal.x = THREE.Math.sin(u * thetaLength + thetaStart);
                            normal.z = THREE.Math.cos(u * thetaLength + thetaStart);
                        }
                        normal.setY(THREE.Math.sqrt(normal.x * normal.x + normal.z * normal.z) * tanTheta).normalize();
                        normals.setXYZ(index, normal.x, normal.y, normal.z);
                        uvs.setXY(index, u, 1 - v);
                        indexRow.push(index);
                        index++;
                    }
                    indexArray.push(indexRow);
                }
                for (x = 0; x < radialSegments; x++) {
                    for (y = 0; y < heightSegments; y++) {
                        var i1 = indexArray[y][x];
                        var i2 = indexArray[y + 1][x];
                        var i3 = indexArray[y + 1][x + 1];
                        var i4 = indexArray[y][x + 1];
                        indices.setX(indexOffset, i1);
                        indexOffset++;
                        indices.setX(indexOffset, i2);
                        indexOffset++;
                        indices.setX(indexOffset, i4);
                        indexOffset++;
                        indices.setX(indexOffset, i2);
                        indexOffset++;
                        indices.setX(indexOffset, i3);
                        indexOffset++;
                        indices.setX(indexOffset, i4);
                        indexOffset++;
                        groupCount += 6;
                    }
                }
                scope.addGroup(groupStart, groupCount, 0);
                groupStart += groupCount;
            }
            function generateCap(top) {
                var x, centerIndexStart, centerIndexEnd;
                var uv = new THREE.Vector2();
                var vertex = new THREE.Vector3();
                var groupCount = 0;
                var radius = (top === true) ? radiusTop : radiusBottom;
                var sign = (top === true) ? 1 : -1;
                centerIndexStart = index;
                for (x = 1; x <= radialSegments; x++) {
                    vertices.setXYZ(index, 0, halfHeight * sign, 0);
                    normals.setXYZ(index, 0, sign, 0);
                    uv.x = 0.5;
                    uv.y = 0.5;
                    uvs.setXY(index, uv.x, uv.y);
                    index++;
                }
                centerIndexEnd = index;
                for (x = 0; x <= radialSegments; x++) {
                    var u = x / radialSegments;
                    var theta = u * thetaLength + thetaStart;
                    var cosTheta = THREE.Math.cos(theta);
                    var sinTheta = THREE.Math.sin(theta);
                    vertex.x = radius * sinTheta;
                    vertex.y = halfHeight * sign;
                    vertex.z = radius * cosTheta;
                    vertices.setXYZ(index, vertex.x, vertex.y, vertex.z);
                    normals.setXYZ(index, 0, sign, 0);
                    uv.x = (cosTheta * 0.5) + 0.5;
                    uv.y = (sinTheta * 0.5 * sign) + 0.5;
                    uvs.setXY(index, uv.x, uv.y);
                    index++;
                }
                for (x = 0; x < radialSegments; x++) {
                    var c = centerIndexStart + x;
                    var i = centerIndexEnd + x;
                    if (top === true) {
                        indices.setX(indexOffset, i);
                        indexOffset++;
                        indices.setX(indexOffset, i + 1);
                        indexOffset++;
                        indices.setX(indexOffset, c);
                        indexOffset++;
                    }
                    else {
                        indices.setX(indexOffset, i + 1);
                        indexOffset++;
                        indices.setX(indexOffset, i);
                        indexOffset++;
                        indices.setX(indexOffset, c);
                        indexOffset++;
                    }
                    groupCount += 3;
                }
                scope.addGroup(groupStart, groupCount, top === true ? 1 : 2);
                groupStart += groupCount;
            }
        }
        ;
        return CylinderBufferGeometry;
    }(THREE.BufferGeometry));
    THREE.CylinderBufferGeometry = CylinderBufferGeometry;
})(THREE || (THREE = {}));
