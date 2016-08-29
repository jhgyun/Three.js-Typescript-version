var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(geometry, material, mode) {
            _super.call(this);
            if (mode === 1) {
                console.warn('THREE.Line: parameter THREE.LinePieces no longer supported. Created THREE.LineSegments instead.');
                return new THREE.LineSegments(geometry, material);
            }
            this.type = 'Line';
            this.geometry = geometry !== undefined ? geometry : new THREE.BufferGeometry();
            this.material = material !== undefined ? material : new THREE.LineBasicMaterial({ color: THREE.Math.random() * 0xffffff });
        }
        ;
        Line.prototype.raycast = function (raycaster, intersects) {
            var inverseMatrix = Line.raycast_inverseMatrix;
            var ray = Line.raycast_ray;
            var sphere = Line.raycast_sphere;
            if (inverseMatrix === undefined) {
                inverseMatrix = Line.raycast_inverseMatrix = new THREE.Matrix4();
                ray = Line.raycast_ray = new THREE.Ray();
                ;
                sphere = Line.raycast_sphere = new THREE.Sphere();
            }
            var precision = raycaster.linePrecision;
            var precisionSq = precision * precision;
            var geometry = this.geometry;
            var matrixWorld = this.matrixWorld;
            if (geometry.boundingSphere === null)
                geometry.computeBoundingSphere();
            sphere.copy(geometry.boundingSphere);
            sphere.applyMatrix4(matrixWorld);
            if (raycaster.ray.intersectsSphere(sphere) === false)
                return;
            inverseMatrix.getInverse(matrixWorld);
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
            var vStart = new THREE.Vector3();
            var vEnd = new THREE.Vector3();
            var interSegment = new THREE.Vector3();
            var interRay = new THREE.Vector3();
            var step = this instanceof THREE.LineSegments ? 2 : 1;
            if (geometry instanceof THREE.BufferGeometry) {
                var index = geometry.index;
                var attributes = geometry.attributes;
                var positions = attributes.position.array;
                if (index !== null) {
                    var indices = index.array;
                    for (var i = 0, l = indices.length - 1; i < l; i += step) {
                        var a = indices[i];
                        var b = indices[i + 1];
                        vStart.fromArray(positions, a * 3);
                        vEnd.fromArray(positions, b * 3);
                        var distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);
                        if (distSq > precisionSq)
                            continue;
                        interRay.applyMatrix4(this.matrixWorld);
                        var distance = raycaster.ray.origin.distanceTo(interRay);
                        if (distance < raycaster.near || distance > raycaster.far)
                            continue;
                        intersects.push({
                            distance: distance,
                            point: interSegment.clone().applyMatrix4(this.matrixWorld),
                            index: i,
                            face: null,
                            faceIndex: null,
                            object: this
                        });
                    }
                }
                else {
                    for (var i = 0, l = positions.length / 3 - 1; i < l; i += step) {
                        vStart.fromArray(positions, 3 * i);
                        vEnd.fromArray(positions, 3 * i + 3);
                        var distSq = ray.distanceSqToSegment(vStart, vEnd, interRay, interSegment);
                        if (distSq > precisionSq)
                            continue;
                        interRay.applyMatrix4(this.matrixWorld);
                        var distance = raycaster.ray.origin.distanceTo(interRay);
                        if (distance < raycaster.near || distance > raycaster.far)
                            continue;
                        intersects.push({
                            distance: distance,
                            point: interSegment.clone().applyMatrix4(this.matrixWorld),
                            index: i,
                            face: null,
                            faceIndex: null,
                            object: this
                        });
                    }
                }
            }
            else if (geometry instanceof THREE.Geometry) {
                var vertices = geometry.vertices;
                var nbVertices = vertices.length;
                for (var i = 0; i < nbVertices - 1; i += step) {
                    var distSq = ray.distanceSqToSegment(vertices[i], vertices[i + 1], interRay, interSegment);
                    if (distSq > precisionSq)
                        continue;
                    interRay.applyMatrix4(this.matrixWorld);
                    var distance = raycaster.ray.origin.distanceTo(interRay);
                    if (distance < raycaster.near || distance > raycaster.far)
                        continue;
                    intersects.push({
                        distance: distance,
                        point: interSegment.clone().applyMatrix4(this.matrixWorld),
                        index: i,
                        face: null,
                        faceIndex: null,
                        object: this
                    });
                }
            }
        };
        Line.prototype.clone = function () {
            return new this.constructor(this.geometry, this.material).copy(this);
        };
        return Line;
    }(THREE.Object3D));
    THREE.Line = Line;
})(THREE || (THREE = {}));
