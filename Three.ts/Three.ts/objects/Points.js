var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../core/object3d.ts" />
/*
 * @author alteredq / http://alteredqualia.com/
 */
var THREE;
(function (THREE) {
    var Points = (function (_super) {
        __extends(Points, _super);
        function Points(geometry, material) {
            _super.call(this);
            this.type = 'Points';
            this.geometry = geometry !== undefined ? geometry : new THREE.BufferGeometry();
            this.material = material !== undefined ? material : new THREE.PointsMaterial({ color: THREE.Math.random() * 0xffffff });
        }
        ;
        Points.prototype.raycast = function (raycaster, intersects) {
            var inverseMatrix = Points.raycast_inverseMatrix;
            var ray = Points.raycast_ray;
            var sphere = Points.raycast_sphere;
            var object = this;
            var geometry = this.geometry;
            var matrixWorld = this.matrixWorld;
            var threshold = raycaster.params.Points.threshold;
            // Checking boundingSphere distance to ray
            if (geometry.boundingSphere === null)
                geometry.computeBoundingSphere();
            sphere.copy(geometry.boundingSphere);
            sphere.applyMatrix4(matrixWorld);
            if (raycaster.ray.intersectsSphere(sphere) === false)
                return;
            //
            inverseMatrix.getInverse(matrixWorld);
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
            var localThreshold = threshold / ((this.scale.x + this.scale.y + this.scale.z) / 3);
            var localThresholdSq = localThreshold * localThreshold;
            var position = new THREE.Vector3();
            function testPoint(point, index) {
                var rayPointDistanceSq = ray.distanceSqToPoint(point);
                if (rayPointDistanceSq < localThresholdSq) {
                    var intersectPoint = ray.closestPointToPoint(point);
                    intersectPoint.applyMatrix4(matrixWorld);
                    var distance = raycaster.ray.origin.distanceTo(intersectPoint);
                    if (distance < raycaster.near || distance > raycaster.far)
                        return;
                    intersects.push({
                        distance: distance,
                        distanceToRay: THREE.Math.sqrt(rayPointDistanceSq),
                        point: intersectPoint.clone(),
                        index: index,
                        face: null,
                        object: object
                    });
                }
            }
            if (geometry instanceof THREE.BufferGeometry) {
                var index = geometry.index;
                var attributes = geometry.attributes;
                var positions = attributes.position.array;
                if (index !== null) {
                    var indices = index.array;
                    for (var i = 0, il = indices.length; i < il; i++) {
                        var a = indices[i];
                        position.fromArray(positions, a * 3);
                        testPoint(position, a);
                    }
                }
                else {
                    for (var i = 0, l = positions.length / 3; i < l; i++) {
                        position.fromArray(positions, i * 3);
                        testPoint(position, i);
                    }
                }
            }
            else {
                var vertices = geometry.vertices;
                for (var i = 0, l = vertices.length; i < l; i++) {
                    testPoint(vertices[i], i);
                }
            }
        };
        Points.prototype.clone = function () {
            return new this.constructor(this.geometry, this.material).copy(this);
        };
        Points.raycast_inverseMatrix = new THREE.Matrix4();
        Points.raycast_ray = new THREE.Ray();
        Points.raycast_sphere = new THREE.Sphere();
        return Points;
    }(THREE.Object3D));
    THREE.Points = Points;
})(THREE || (THREE = {}));
