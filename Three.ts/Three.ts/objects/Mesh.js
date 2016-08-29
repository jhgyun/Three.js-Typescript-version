var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Mesh = (function (_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, material) {
            _super.call(this);
            Mesh.initStatic();
            this.type = 'Mesh';
            this.geometry = geometry !== undefined ? geometry : new THREE.BufferGeometry();
            this.material = material !== undefined ? material : new THREE.MeshBasicMaterial({ color: THREE.Math.random() * 0xffffff });
            this.drawMode = THREE.TrianglesDrawMode;
            this.updateMorphTargets();
        }
        ;
        Mesh.prototype.setDrawMode = function (value) {
            this.drawMode = value;
        };
        Mesh.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.drawMode = source.drawMode;
            return this;
        };
        Mesh.prototype.updateMorphTargets = function () {
            var geometry = this.geometry;
            if (geometry.morphTargets !== undefined && geometry.morphTargets.length > 0) {
                this.morphTargetBase = -1;
                this.morphTargetInfluences = [];
                this.morphTargetDictionary = {};
                for (var m = 0, ml = geometry.morphTargets.length; m < ml; m++) {
                    this.morphTargetInfluences.push(0);
                    this.morphTargetDictionary[geometry.morphTargets[m].name] = m;
                }
            }
        };
        Mesh.prototype.getMorphTargetIndexByName = function (name) {
            if (this.morphTargetDictionary[name] !== undefined) {
                return this.morphTargetDictionary[name];
            }
            console.warn('THREE.Mesh.getMorphTargetIndexByName: morph target ' + name + ' does not exist. Returning 0.');
            return 0;
        };
        Mesh.initStatic = function () {
            if (Mesh.raycast_inverseMatrix !== undefined)
                return;
            Mesh.raycast_inverseMatrix = new THREE.Matrix4();
            Mesh.raycast_ray = new THREE.Ray();
            Mesh.raycast_sphere = new THREE.Sphere();
            Mesh.raycast_vA = new THREE.Vector3();
            Mesh.raycast_vB = new THREE.Vector3();
            Mesh.raycast_vC = new THREE.Vector3();
            Mesh.raycast_tempA = new THREE.Vector3();
            Mesh.raycast_tempB = new THREE.Vector3();
            Mesh.raycast_tempC = new THREE.Vector3();
            Mesh.raycast_uvA = new THREE.Vector2();
            Mesh.raycast_uvB = new THREE.Vector2();
            Mesh.raycast_uvC = new THREE.Vector2();
            Mesh.raycast_barycoord = new THREE.Vector3();
            Mesh.raycast_intersectionPoint = new THREE.Vector3();
            Mesh.raycast_intersectionPointWorld = new THREE.Vector3();
        };
        Mesh.uvIntersection = function (point, p1, p2, p3, uv1, uv2, uv3) {
            var barycoord = Mesh["raycast_barycoord"] || (Mesh["raycast_barycoord"] = new THREE.Vector3());
            THREE.Triangle.barycoordFromPoint(point, p1, p2, p3, barycoord);
            uv1.multiplyScalar(barycoord.x);
            uv2.multiplyScalar(barycoord.y);
            uv3.multiplyScalar(barycoord.z);
            uv1.add(uv2).add(uv3);
            return uv1.clone();
        };
        Mesh.checkIntersection = function (object, raycaster, ray, pA, pB, pC, point) {
            var intersectionPointWorld = Mesh["raycast_intersectionPointWorld"] || (Mesh["raycast_intersectionPointWorld"] = new THREE.Vector3());
            var intersect;
            var material = object.material;
            if (material.side === THREE.BackSide) {
                intersect = ray.intersectTriangle(pC, pB, pA, true, point);
            }
            else {
                intersect = ray.intersectTriangle(pA, pB, pC, material.side !== THREE.DoubleSide, point);
            }
            if (intersect === null)
                return null;
            intersectionPointWorld.copy(point);
            intersectionPointWorld.applyMatrix4(object.matrixWorld);
            var distance = raycaster.ray.origin.distanceTo(intersectionPointWorld);
            if (distance < raycaster.near || distance > raycaster.far)
                return null;
            return {
                distance: distance,
                point: intersectionPointWorld.clone(),
                object: object
            };
        };
        Mesh.checkBufferGeometryIntersection = function (object, raycaster, ray, positions, uvs, a, b, c) {
            var vA = Mesh.raycast_vA;
            var vB = Mesh.raycast_vB;
            var vC = Mesh.raycast_vC;
            var uvA = Mesh.raycast_uvA;
            var uvB = Mesh.raycast_uvB;
            var uvC = Mesh.raycast_uvC;
            vA.fromArray(positions, a * 3);
            vB.fromArray(positions, b * 3);
            vC.fromArray(positions, c * 3);
            var intersectionPoint = Mesh.raycast_intersectionPoint;
            var intersection = Mesh.checkIntersection(object, raycaster, ray, vA, vB, vC, intersectionPoint);
            if (intersection) {
                if (uvs) {
                    uvA.fromArray(uvs, a * 2);
                    uvB.fromArray(uvs, b * 2);
                    uvC.fromArray(uvs, c * 2);
                    intersection.uv = Mesh.uvIntersection(intersectionPoint, vA, vB, vC, uvA, uvB, uvC);
                }
                intersection.face = new THREE.Face3(a, b, c, THREE.Triangle.normal(vA, vB, vC));
                intersection.faceIndex = a;
            }
            return intersection;
        };
        Mesh.prototype.raycast = function (raycaster, intersects) {
            var sphere = Mesh.raycast_sphere;
            var inverseMatrix = Mesh.raycast_inverseMatrix;
            var ray = Mesh.raycast_ray;
            var vA = Mesh.raycast_vA;
            var vB = Mesh.raycast_vB;
            var vC = Mesh.raycast_vC;
            var uvA = Mesh.raycast_uvA;
            var uvB = Mesh.raycast_uvB;
            var uvC = Mesh.raycast_uvC;
            var tempA = Mesh.raycast_tempA;
            var tempB = Mesh.raycast_tempB;
            var tempC = Mesh.raycast_tempC;
            var intersectionPoint = Mesh.raycast_intersectionPoint;
            var geometry = this.geometry;
            var material = this.material;
            var matrixWorld = this.matrixWorld;
            if (material === undefined)
                return;
            if (geometry.boundingSphere === null)
                geometry.computeBoundingSphere();
            sphere.copy(geometry.boundingSphere);
            sphere.applyMatrix4(matrixWorld);
            if (raycaster.ray.intersectsSphere(sphere) === false)
                return;
            inverseMatrix.getInverse(matrixWorld);
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
            if (geometry.boundingBox !== null) {
                if (ray.intersectsBox(geometry.boundingBox) === false)
                    return;
            }
            var uvs;
            var intersection;
            if (geometry instanceof THREE.BufferGeometry) {
                var a, b, c;
                var index = geometry.index;
                var attributes = geometry.attributes;
                var positions = attributes.position.array;
                if (attributes.uv !== undefined) {
                    uvs = attributes.uv.array;
                }
                if (index !== null) {
                    var indices = index.array;
                    for (var i = 0, l = indices.length; i < l; i += 3) {
                        a = indices[i];
                        b = indices[i + 1];
                        c = indices[i + 2];
                        intersection = Mesh.checkBufferGeometryIntersection(this, raycaster, ray, positions, uvs, a, b, c);
                        if (intersection) {
                            intersection.faceIndex = THREE.Math.floor(i / 3);
                            intersects.push(intersection);
                        }
                    }
                }
                else {
                    for (var i_1 = 0, l_1 = positions.length; i_1 < l_1; i_1 += 9) {
                        a = i_1 / 3;
                        b = a + 1;
                        c = a + 2;
                        intersection = Mesh.checkBufferGeometryIntersection(this, raycaster, ray, positions, uvs, a, b, c);
                        if (intersection) {
                            intersection.index = a;
                            intersects.push(intersection);
                        }
                    }
                }
            }
            else if (geometry instanceof THREE.Geometry) {
                var fvA, fvB, fvC;
                var isFaceMaterial = material instanceof THREE.MultiMaterial;
                var materials = isFaceMaterial === true ? material.materials : null;
                var vertices = geometry.vertices;
                var faces = geometry.faces;
                var faceVertexUvs = geometry.faceVertexUvs[0];
                if (faceVertexUvs.length > 0)
                    uvs = faceVertexUvs;
                for (var f = 0, fl = faces.length; f < fl; f++) {
                    var face = faces[f];
                    var faceMaterial = isFaceMaterial === true ? materials[face.materialIndex] : material;
                    if (faceMaterial === undefined)
                        continue;
                    fvA = vertices[face.a];
                    fvB = vertices[face.b];
                    fvC = vertices[face.c];
                    if (faceMaterial.morphTargets === true) {
                        var morphTargets = geometry.morphTargets;
                        var morphInfluences = this.morphTargetInfluences;
                        vA.set(0, 0, 0);
                        vB.set(0, 0, 0);
                        vC.set(0, 0, 0);
                        for (var t = 0, tl = morphTargets.length; t < tl; t++) {
                            var influence = morphInfluences[t];
                            if (influence === 0)
                                continue;
                            var targets = morphTargets[t].vertices;
                            vA.addScaledVector(tempA.subVectors(targets[face.a], fvA), influence);
                            vB.addScaledVector(tempB.subVectors(targets[face.b], fvB), influence);
                            vC.addScaledVector(tempC.subVectors(targets[face.c], fvC), influence);
                        }
                        vA.add(fvA);
                        vB.add(fvB);
                        vC.add(fvC);
                        fvA = vA;
                        fvB = vB;
                        fvC = vC;
                    }
                    intersection = Mesh.checkIntersection(this, raycaster, ray, fvA, fvB, fvC, intersectionPoint);
                    if (intersection) {
                        if (uvs) {
                            var uvs_f = uvs[f];
                            uvA.copy(uvs_f[0]);
                            uvB.copy(uvs_f[1]);
                            uvC.copy(uvs_f[2]);
                            intersection.uv = Mesh.uvIntersection(intersectionPoint, fvA, fvB, fvC, uvA, uvB, uvC);
                        }
                        intersection.face = face;
                        intersection.faceIndex = f;
                        intersects.push(intersection);
                    }
                }
            }
        };
        Mesh.prototype.clone = function () {
            return new this.constructor(this.geometry, this.material).copy(this);
        };
        return Mesh;
    }(THREE.Object3D));
    THREE.Mesh = Mesh;
})(THREE || (THREE = {}));
