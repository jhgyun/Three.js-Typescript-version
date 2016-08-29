var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var PolyhedronGeometry = (function (_super) {
        __extends(PolyhedronGeometry, _super);
        function PolyhedronGeometry(vertices, indices, radius, detail) {
            _super.call(this);
            this.type = 'PolyhedronGeometry';
            this.parameters = {
                vertices: vertices,
                indices: indices,
                radius: radius,
                detail: detail
            };
            radius = radius || 1;
            detail = detail || 0;
            var that = this;
            for (var i = 0, l = vertices.length; i < l; i += 3) {
                prepare(new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2]));
            }
            var p = this.vertices;
            var faces = [];
            for (var i = 0, j = 0, l = indices.length; i < l; i += 3, j++) {
                var v1 = p[indices[i]];
                var v2 = p[indices[i + 1]];
                var v3 = p[indices[i + 2]];
                faces[j] = new THREE.Face3(v1.index, v2.index, v3.index, [v1.clone(), v2.clone(), v3.clone()]);
            }
            var centroid = new THREE.Vector3();
            for (var i = 0, l = faces.length; i < l; i++) {
                subdivide(faces[i], detail);
            }
            for (var i = 0, l = this.faceVertexUvs[0].length; i < l; i++) {
                var uvs = this.faceVertexUvs[0][i];
                var x0 = uvs[0].x;
                var x1 = uvs[1].x;
                var x2 = uvs[2].x;
                var max = THREE.Math.max(x0, x1, x2);
                var min = THREE.Math.min(x0, x1, x2);
                if (max > 0.9 && min < 0.1) {
                    if (x0 < 0.2)
                        uvs[0].x += 1;
                    if (x1 < 0.2)
                        uvs[1].x += 1;
                    if (x2 < 0.2)
                        uvs[2].x += 1;
                }
            }
            for (var i = 0, l = this.vertices.length; i < l; i++) {
                this.vertices[i].multiplyScalar(radius);
            }
            this.mergeVertices();
            this.computeFaceNormals();
            this.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius);
            function prepare(vector) {
                var vertex = vector.normalize().clone();
                vertex.index = that.vertices.push(vertex) - 1;
                var u = azimuth(vector) / 2 / THREE.Math.PI + 0.5;
                var v = inclination(vector) / THREE.Math.PI + 0.5;
                vertex.uv = new THREE.Vector2(u, 1 - v);
                return vertex;
            }
            function make(v1, v2, v3) {
                var face = new THREE.Face3(v1.index, v2.index, v3.index, [v1.clone(), v2.clone(), v3.clone()]);
                that.faces.push(face);
                centroid.copy(v1).add(v2).add(v3).divideScalar(3);
                var azi = azimuth(centroid);
                that.faceVertexUvs[0].push([
                    correctUV(v1.uv, v1, azi),
                    correctUV(v2.uv, v2, azi),
                    correctUV(v3.uv, v3, azi)
                ]);
            }
            function subdivide(face, detail) {
                var cols = THREE.Math.pow(2, detail);
                var a = prepare(that.vertices[face.a]);
                var b = prepare(that.vertices[face.b]);
                var c = prepare(that.vertices[face.c]);
                var v = [];
                for (var i = 0; i <= cols; i++) {
                    v[i] = [];
                    var aj = prepare(a.clone().lerp(c, i / cols));
                    var bj = prepare(b.clone().lerp(c, i / cols));
                    var rows = cols - i;
                    for (var j = 0; j <= rows; j++) {
                        if (j === 0 && i === cols) {
                            v[i][j] = aj;
                        }
                        else {
                            v[i][j] = prepare(aj.clone().lerp(bj, j / rows));
                        }
                    }
                }
                for (var i = 0; i < cols; i++) {
                    for (var j = 0; j < 2 * (cols - i) - 1; j++) {
                        var k = THREE.Math.floor(j / 2);
                        if (j % 2 === 0) {
                            make(v[i][k + 1], v[i + 1][k], v[i][k]);
                        }
                        else {
                            make(v[i][k + 1], v[i + 1][k + 1], v[i + 1][k]);
                        }
                    }
                }
            }
            function azimuth(vector) {
                return THREE.Math.atan2(vector.z, -vector.x);
            }
            function inclination(vector) {
                return THREE.Math.atan2(-vector.y, THREE.Math.sqrt((vector.x * vector.x) + (vector.z * vector.z)));
            }
            function correctUV(uv, vector, azimuth) {
                if ((azimuth < 0) && (uv.x === 1))
                    uv = new THREE.Vector2(uv.x - 1, uv.y);
                if ((vector.x === 0) && (vector.z === 0))
                    uv = new THREE.Vector2(azimuth / 2 / THREE.Math.PI + 0.5, uv.y);
                return uv.clone();
            }
        }
        ;
        return PolyhedronGeometry;
    }(THREE.Geometry));
    THREE.PolyhedronGeometry = PolyhedronGeometry;
})(THREE || (THREE = {}));
