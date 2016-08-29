var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var CircleBufferGeometry = (function (_super) {
        __extends(CircleBufferGeometry, _super);
        function CircleBufferGeometry(radius, segments, thetaStart, thetaLength) {
            _super.call(this);
            this.type = 'CircleBufferGeometry';
            this.parameters = {
                radius: radius,
                segments: segments,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };
            radius = radius || 50;
            segments = segments !== undefined ? THREE.Math.max(3, segments) : 8;
            thetaStart = thetaStart !== undefined ? thetaStart : 0;
            thetaLength = thetaLength !== undefined ? thetaLength : THREE.Math.PI * 2;
            var vertices = segments + 2;
            var positions = new Float32Array(vertices * 3);
            var normals = new Float32Array(vertices * 3);
            var uvs = new Float32Array(vertices * 2);
            normals[2] = 1.0;
            uvs[0] = 0.5;
            uvs[1] = 0.5;
            for (var s = 0, i = 3, ii = 2; s <= segments; s++, i += 3, ii += 2) {
                var segment = thetaStart + s / segments * thetaLength;
                positions[i] = radius * THREE.Math.cos(segment);
                positions[i + 1] = radius * THREE.Math.sin(segment);
                normals[i + 2] = 1;
                uvs[ii] = (positions[i] / radius + 1) / 2;
                uvs[ii + 1] = (positions[i + 1] / radius + 1) / 2;
            }
            var indices = [];
            for (var i = 1; i <= segments; i++) {
                indices.push(i, i + 1, 0);
            }
            this.setIndex(new THREE.BufferAttribute(new Uint16Array(indices), 1));
            this.addAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.addAttribute('normal', new THREE.BufferAttribute(normals, 3));
            this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2));
            this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
        }
        ;
        return CircleBufferGeometry;
    }(THREE.BufferGeometry));
    THREE.CircleBufferGeometry = CircleBufferGeometry;
})(THREE || (THREE = {}));
