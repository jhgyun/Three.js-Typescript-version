/// <reference path="../core/object3d.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author jonobr1 / http://jonobr1.com/
 */

namespace THREE
{
    export interface IntersectResult
    {
        distance?: number;
        distanceToRay?: number;
        point?: Vector3;
        uv?: Vector2;
        object?: any;
        face?: Face3; 
        faceIndex?: number;
        index?: number
    }

    export class Mesh extends Object3D
    {
        drawMode: number;
        morphTargetBase: any;
        morphTargetInfluences: any;
        morphTargetDictionary: any;

        constructor(geometry?: GeometryType, material?: IMaterial)
        {
            super();
            Mesh.initStatic();
            this.type = 'Mesh';

            this.geometry = geometry !== undefined ? geometry : new BufferGeometry();
            this.material = material !== undefined ? material : new MeshBasicMaterial({ color: Math.random() * 0xffffff });

            this.drawMode = TrianglesDrawMode; 
            this.updateMorphTargets(); 
        };

        setDrawMode(value: number)
        {
            this.drawMode = value;
        }

        copy(source: Mesh)
        {
            super.copy(source);

            this.drawMode = source.drawMode;

            return this;

        }

        updateMorphTargets()
        {
            var geometry = this.geometry as any;

            if (geometry.morphTargets !== undefined && geometry.morphTargets.length > 0)
            {
                this.morphTargetBase = - 1;
                this.morphTargetInfluences = [];
                this.morphTargetDictionary = {};

                for (var m = 0, ml = geometry.morphTargets.length; m < ml; m++)
                {
                    this.morphTargetInfluences.push(0);
                    this.morphTargetDictionary[geometry.morphTargets[m].name] = m;
                }
            }
        }

        getMorphTargetIndexByName(name)
        {
            if (this.morphTargetDictionary[name] !== undefined)
            {
                return this.morphTargetDictionary[name];
            }

            console.warn('THREE.Mesh.getMorphTargetIndexByName: morph target ' + name + ' does not exist. Returning 0.');

            return 0;
        }

        private static raycast_inverseMatrix: Matrix4;
        private static raycast_ray: Ray;
        private static raycast_sphere: Sphere;

        private static raycast_vA: Vector3;
        private static raycast_vB: Vector3;
        private static raycast_vC: Vector3;

        private static raycast_tempA: Vector3;
        private static raycast_tempB: Vector3;
        private static raycast_tempC: Vector3;

        private static raycast_uvA: Vector2;
        private static raycast_uvB: Vector2;
        private static raycast_uvC: Vector2;

        private static raycast_barycoord: Vector3;

        private static raycast_intersectionPoint: Vector3;
        private static raycast_intersectionPointWorld: Vector3;

        private static initStatic()
        {
            if (Mesh.raycast_inverseMatrix !== undefined)
                return;

            Mesh.raycast_inverseMatrix = new Matrix4();
            Mesh.raycast_ray = new Ray();
            Mesh.raycast_sphere = new Sphere();

            Mesh.raycast_vA = new Vector3();
            Mesh.raycast_vB = new Vector3();
            Mesh.raycast_vC = new Vector3();

            Mesh.raycast_tempA = new Vector3();
            Mesh.raycast_tempB = new Vector3();
            Mesh.raycast_tempC = new Vector3();

            Mesh.raycast_uvA = new Vector2();
            Mesh.raycast_uvB = new Vector2();
            Mesh.raycast_uvC = new Vector2();

            Mesh.raycast_barycoord = new Vector3();

            Mesh.raycast_intersectionPoint = new Vector3();
            Mesh.raycast_intersectionPointWorld = new Vector3();
        }

        private static uvIntersection(point: Vector3, p1: Vector3, p2: Vector3, p3: Vector3, uv1: Vector2, uv2: Vector2, uv3: Vector2)
        {
            var barycoord = Mesh["raycast_barycoord"] ||( Mesh["raycast_barycoord"] = new Vector3()); 
            Triangle.barycoordFromPoint(point, p1, p2, p3, barycoord); 

            uv1.multiplyScalar(barycoord.x);
            uv2.multiplyScalar(barycoord.y);
            uv3.multiplyScalar(barycoord.z);

            uv1.add(uv2).add(uv3);
            return uv1.clone();
        }
        private static checkIntersection(object, raycaster: Raycaster, ray: Ray, pA: Vector3, pB: Vector3, pC: Vector3, point: Vector3)
        {
            var intersectionPointWorld = Mesh["raycast_intersectionPointWorld"] || (Mesh["raycast_intersectionPointWorld"] = new Vector3());
             
            var intersect;
            var material = object.material;

            if (material.side === BackSide)
            { 
                intersect = ray.intersectTriangle(pC, pB, pA, true, point); 
            }
            else
            {
                intersect = ray.intersectTriangle(pA, pB, pC, material.side !== DoubleSide, point);
            }

            if (intersect === null) return null;

            intersectionPointWorld.copy(point);
            intersectionPointWorld.applyMatrix4(object.matrixWorld);

            var distance = raycaster.ray.origin.distanceTo(intersectionPointWorld);

            if (distance < raycaster.near || distance > raycaster.far) return null;

            return {
                distance: distance,
                point: intersectionPointWorld.clone(),
                object: object
            };
        }
        private static checkBufferGeometryIntersection(object, raycaster: Raycaster, ray: Ray,
            positions: ArrayLike<number>,
            uvs: ArrayLike<number>, a: number, b: number, c: number)
        {
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

            var intersection: any = Mesh.checkIntersection(object, raycaster, ray, vA, vB, vC, intersectionPoint);

            if (intersection)
            {
                if (uvs)
                {
                    uvA.fromArray(uvs, a * 2);
                    uvB.fromArray(uvs, b * 2);
                    uvC.fromArray(uvs, c * 2);
                    intersection.uv = Mesh.uvIntersection(intersectionPoint, vA, vB, vC, uvA, uvB, uvC);
                }

                intersection.face = new Face3(a, b, c, Triangle.normal(vA, vB, vC));
                intersection.faceIndex = a;
            }

            return intersection;

        }

        raycast(raycaster: Raycaster, intersects: IntersectResult[])
        {
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

            if (material === undefined) return;

            // Checking boundingSphere distance to ray 
            if (geometry.boundingSphere === null) geometry.computeBoundingSphere();

            sphere.copy(geometry.boundingSphere);
            sphere.applyMatrix4(matrixWorld);

            if (raycaster.ray.intersectsSphere(sphere) === false) return;

            // 
            inverseMatrix.getInverse(matrixWorld);
            ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);

            // Check boundingBox before continuing 
            if (geometry.boundingBox !== null)
            {
                if (ray.intersectsBox(geometry.boundingBox) === false) return;
            }

            var uvs;

            var intersection: IntersectResult;
             
            if (geometry instanceof BufferGeometry)
            { 
                var a, b, c;
                var index = geometry.index;
                var attributes = geometry.attributes;
                var positions = attributes.position.array;

                if (attributes.uv !== undefined)
                { 
                    uvs = attributes.uv.array; 
                }

                if (index !== null)
                { 
                    var indices = index.array;

                    for (var i = 0, l = indices.length; i < l; i += 3)
                    { 
                        a = indices[i];
                        b = indices[i + 1];
                        c = indices[i + 2];

                        intersection = Mesh.checkBufferGeometryIntersection(this, raycaster, ray, positions, uvs, a, b, c);

                        if (intersection)
                        { 
                            intersection.faceIndex = Math.floor(i / 3); // triangle number in indices buffer semantics
                            intersects.push(intersection);
                        }
                    } 
                }
                else
                {
                    for (var i = 0, l = positions.length; i < l; i += 9)
                    {
                        a = i / 3;
                        b = a + 1;
                        c = a + 2;

                        intersection = Mesh.checkBufferGeometryIntersection(this, raycaster, ray, positions, uvs, a, b, c);

                        if (intersection)
                        { 
                            intersection.index = a; // triangle number in positions buffer semantics
                            intersects.push(intersection); 
                        } 
                    } 
                }

            }
            else if (geometry instanceof Geometry)
            { 
                var fvA, fvB, fvC;
                var isFaceMaterial = material instanceof MultiMaterial;
                var materials = isFaceMaterial === true ? (material as MultiMaterial).materials : null;

                var vertices = geometry.vertices;
                var faces = geometry.faces;
                var faceVertexUvs = geometry.faceVertexUvs[0];
                if (faceVertexUvs.length > 0) uvs = faceVertexUvs;

                for (var f = 0, fl = faces.length; f < fl; f++)
                {
                    var face = faces[f];
                    var faceMaterial: IMaterial = isFaceMaterial === true ? materials[face.materialIndex] : material;

                    if (faceMaterial === undefined) continue;

                    fvA = vertices[face.a];
                    fvB = vertices[face.b];
                    fvC = vertices[face.c];

                    if (faceMaterial.morphTargets === true)
                    {
                        var morphTargets = geometry.morphTargets;
                        var morphInfluences = this.morphTargetInfluences;

                        vA.set(0, 0, 0);
                        vB.set(0, 0, 0);
                        vC.set(0, 0, 0);

                        for (var t = 0, tl = morphTargets.length; t < tl; t++)
                        { 
                            var influence = morphInfluences[t];

                            if (influence === 0) continue;

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

                    if (intersection)
                    { 
                        if (uvs)
                        { 
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
        }

        clone(): this
        {
            return new (this.constructor as any)(this.geometry, this.material).copy(this);
        }
    }
}