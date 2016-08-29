var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var TubeGeometry = (function (_super) {
        __extends(TubeGeometry, _super);
        function TubeGeometry(path, segments, radius, radialSegments, closed, taper) {
            _super.call(this);
            this.type = 'TubeGeometry';
            this.parameters = {
                path: path,
                segments: segments,
                radius: radius,
                radialSegments: radialSegments,
                closed: closed,
                taper: taper
            };
            segments = segments || 64;
            radius = radius || 1;
            radialSegments = radialSegments || 8;
            closed = closed || false;
            taper = taper || TubeGeometry.NoTaper;
            var grid = [];
            var scope = this, tangent, normal, binormal, numpoints = segments + 1, u, v, r, cx, cy, pos, pos2 = new THREE.Vector3(), i, j, ip, jp, a, b, c, d, uva, uvb, uvc, uvd;
            var frames = new TubeGeometry.FrenetFrames(path, segments, closed), tangents = frames.tangents, normals = frames.normals, binormals = frames.binormals;
            this.tangents = tangents;
            this.normals = normals;
            this.binormals = binormals;
            function vert(x, y, z) {
                return scope.vertices.push(new THREE.Vector3(x, y, z)) - 1;
            }
            for (i = 0; i < numpoints; i++) {
                grid[i] = [];
                u = i / (numpoints - 1);
                pos = path.getPointAt(u);
                tangent = tangents[i];
                normal = normals[i];
                binormal = binormals[i];
                r = radius * taper(u);
                for (j = 0; j < radialSegments; j++) {
                    v = j / radialSegments * 2 * THREE.Math.PI;
                    cx = -r * THREE.Math.cos(v);
                    cy = r * THREE.Math.sin(v);
                    pos2.copy(pos);
                    pos2.x += cx * normal.x + cy * binormal.x;
                    pos2.y += cx * normal.y + cy * binormal.y;
                    pos2.z += cx * normal.z + cy * binormal.z;
                    grid[i][j] = vert(pos2.x, pos2.y, pos2.z);
                }
            }
            for (i = 0; i < segments; i++) {
                for (j = 0; j < radialSegments; j++) {
                    ip = (closed) ? (i + 1) % segments : i + 1;
                    jp = (j + 1) % radialSegments;
                    a = grid[i][j];
                    b = grid[ip][j];
                    c = grid[ip][jp];
                    d = grid[i][jp];
                    uva = new THREE.Vector2(i / segments, j / radialSegments);
                    uvb = new THREE.Vector2((i + 1) / segments, j / radialSegments);
                    uvc = new THREE.Vector2((i + 1) / segments, (j + 1) / radialSegments);
                    uvd = new THREE.Vector2(i / segments, (j + 1) / radialSegments);
                    this.faces.push(new THREE.Face3(a, b, d));
                    this.faceVertexUvs[0].push([uva, uvb, uvd]);
                    this.faces.push(new THREE.Face3(b, c, d));
                    this.faceVertexUvs[0].push([uvb.clone(), uvc, uvd.clone()]);
                }
            }
            this.computeFaceNormals();
            this.computeVertexNormals();
        }
        ;
        TubeGeometry.NoTaper = function (u) {
            return 1;
        };
        TubeGeometry.SinusoidalTaper = function (u) {
            return THREE.Math.sin(THREE.Math.PI * u);
        };
        TubeGeometry.FrenetFrames = function (path, segments, closed) {
            var normal = new THREE.Vector3(), tangents = [], normals = [], binormals = [], vec = new THREE.Vector3(), mat = new THREE.Matrix4(), numpoints = segments + 1, theta, smallest, tx, ty, tz, i, u;
            this.tangents = tangents;
            this.normals = normals;
            this.binormals = binormals;
            for (i = 0; i < numpoints; i++) {
                u = i / (numpoints - 1);
                tangents[i] = path.getTangentAt(u);
                tangents[i].normalize();
            }
            initialNormal3();
            function initialNormal3() {
                normals[0] = new THREE.Vector3();
                binormals[0] = new THREE.Vector3();
                smallest = Number.MAX_VALUE;
                tx = THREE.Math.abs(tangents[0].x);
                ty = THREE.Math.abs(tangents[0].y);
                tz = THREE.Math.abs(tangents[0].z);
                if (tx <= smallest) {
                    smallest = tx;
                    normal.set(1, 0, 0);
                }
                if (ty <= smallest) {
                    smallest = ty;
                    normal.set(0, 1, 0);
                }
                if (tz <= smallest) {
                    normal.set(0, 0, 1);
                }
                vec.crossVectors(tangents[0], normal).normalize();
                normals[0].crossVectors(tangents[0], vec);
                binormals[0].crossVectors(tangents[0], normals[0]);
            }
            for (i = 1; i < numpoints; i++) {
                normals[i] = normals[i - 1].clone();
                binormals[i] = binormals[i - 1].clone();
                vec.crossVectors(tangents[i - 1], tangents[i]);
                if (vec.length() > Number.EPSILON) {
                    vec.normalize();
                    theta = THREE.Math.acos(THREE.Math.clamp(tangents[i - 1].dot(tangents[i]), -1, 1));
                    normals[i].applyMatrix4(mat.makeRotationAxis(vec, theta));
                }
                binormals[i].crossVectors(tangents[i], normals[i]);
            }
            if (closed) {
                theta = THREE.Math.acos(THREE.Math.clamp(normals[0].dot(normals[numpoints - 1]), -1, 1));
                theta /= (numpoints - 1);
                if (tangents[0].dot(vec.crossVectors(normals[0], normals[numpoints - 1])) > 0) {
                    theta = -theta;
                }
                for (i = 1; i < numpoints; i++) {
                    normals[i].applyMatrix4(mat.makeRotationAxis(tangents[i], theta * i));
                    binormals[i].crossVectors(tangents[i], normals[i]);
                }
            }
        };
        return TubeGeometry;
    }(THREE.Geometry));
    THREE.TubeGeometry = TubeGeometry;
})(THREE || (THREE = {}));
