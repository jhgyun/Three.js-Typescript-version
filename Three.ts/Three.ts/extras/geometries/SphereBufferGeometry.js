/// <reference path="../../core/buffergeometry.ts" />
/*
 * @author benaadams / https://twitter.com/ben_a_adams
 * based on THREE.SphereGeometry
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var SphereBufferGeometry = (function (_super) {
        __extends(SphereBufferGeometry, _super);
        function SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength) {
            _super.call(this);
            this.type = 'SphereBufferGeometry';
            this.parameters = {
                radius: radius,
                widthSegments: widthSegments,
                heightSegments: heightSegments,
                phiStart: phiStart,
                phiLength: phiLength,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
            radius = radius || 50;
            widthSegments = THREE.Math.max(3, THREE.Math.floor(widthSegments) || 8);
            heightSegments = THREE.Math.max(2, THREE.Math.floor(heightSegments) || 6);
            phiStart = phiStart !== undefined ? phiStart : 0;
            phiLength = phiLength !== undefined ? phiLength : THREE.Math.PI * 2;
            thetaStart = thetaStart !== undefined ? thetaStart : 0;
            thetaLength = thetaLength !== undefined ? thetaLength : THREE.Math.PI;
            var thetaEnd = thetaStart + thetaLength;
            var vertexCount = ((widthSegments + 1) * (heightSegments + 1));
            var positions = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
            var normals = new THREE.BufferAttribute(new Float32Array(vertexCount * 3), 3);
            var uvs = new THREE.BufferAttribute(new Float32Array(vertexCount * 2), 2);
            var index = 0, vertices = [], normal = new THREE.Vector3();
            for (var y = 0; y <= heightSegments; y++) {
                var verticesRow = [];
                var v = y / heightSegments;
                for (var x = 0; x <= widthSegments; x++) {
                    var u = x / widthSegments;
                    var px = -radius * THREE.Math.cos(phiStart + u * phiLength) * THREE.Math.sin(thetaStart + v * thetaLength);
                    var py = radius * THREE.Math.cos(thetaStart + v * thetaLength);
                    var pz = radius * THREE.Math.sin(phiStart + u * phiLength) * THREE.Math.sin(thetaStart + v * thetaLength);
                    normal.set(px, py, pz).normalize();
                    positions.setXYZ(index, px, py, pz);
                    normals.setXYZ(index, normal.x, normal.y, normal.z);
                    uvs.setXY(index, u, 1 - v);
                    verticesRow.push(index);
                    index++;
                }
                vertices.push(verticesRow);
            }
            var indices = [];
            for (var y = 0; y < heightSegments; y++) {
                for (var x = 0; x < widthSegments; x++) {
                    var v1 = vertices[y][x + 1];
                    var v2 = vertices[y][x];
                    var v3 = vertices[y + 1][x];
                    var v4 = vertices[y + 1][x + 1];
                    if (y !== 0 || thetaStart > 0)
                        indices.push(v1, v2, v4);
                    if (y !== heightSegments - 1 || thetaEnd < THREE.Math.PI)
                        indices.push(v2, v3, v4);
                }
            }
            this.setIndex(new (positions.count > 65535 ? THREE.Uint32Attribute : THREE.Uint16Attribute)(indices, 1));
            this.addAttribute('position', positions);
            this.addAttribute('normal', normals);
            this.addAttribute('uv', uvs);
            this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
        }
        ;
        return SphereBufferGeometry;
    }(THREE.BufferGeometry));
    THREE.SphereBufferGeometry = SphereBufferGeometry;
})(THREE || (THREE = {}));
