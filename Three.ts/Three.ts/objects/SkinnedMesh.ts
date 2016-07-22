/// <reference path="mesh.ts" />
/* 
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */

namespace THREE
{
    export class SkinnedMesh extends Mesh
    {
        bindMode: string;
        bindMatrix: Matrix4;
        bindMatrixInverse: Matrix4;
        skeleton: Skeleton;

        constructor(geometry?: GeometryType, material?, useVertexTexture?: boolean)
        {
            super(geometry, material);

            this.type = 'SkinnedMesh';

            this.bindMode = "attached";
            this.bindMatrix = new Matrix4();
            this.bindMatrixInverse = new Matrix4();

            // init bones

            // TODO: remove bone creation as there is no reason (other than
            // convenience) for THREE.SkinnedMesh to do this.

            var bones = [];

            if (this.geometry && this.geometry["bones"] !== undefined)
            {
                var gbones: any[] = this.geometry["bones"];

                var bone: Bone, gbone;

                for (var b = 0, bl = gbones.length; b < bl; ++b)
                {
                    gbone = gbones[b];

                    bone = new Bone(this);
                    bones.push(bone);

                    bone.name = gbone.name;
                    bone.position.fromArray(gbone.pos);
                    bone.quaternion.fromArray(gbone.rotq);
                    if (gbone.scl !== undefined) bone.scale.fromArray(gbone.scl);

                }

                for (var b = 0, bl = gbones.length; b < bl; ++b)
                {
                    gbone = gbones[b];

                    if (gbone.parent !== - 1 && gbone.parent !== null &&
                        bones[gbone.parent] !== undefined)
                    {
                        bones[gbone.parent].add(bones[b]);
                    }
                    else
                    {
                        this.add(bones[b]);
                    }
                }
            }

            this.normalizeSkinWeights();

            this.updateMatrixWorld(true);
            this.bind(new Skeleton(bones, undefined, useVertexTexture), this.matrixWorld);
        };
        
        bind(skeleton: Skeleton, bindMatrix: Matrix4)
        {
            this.skeleton = skeleton;

            if (bindMatrix === undefined)
            {
                this.updateMatrixWorld(true);

                this.skeleton.calculateInverses();
                bindMatrix = this.matrixWorld;
            }

            this.bindMatrix.copy(bindMatrix);
            this.bindMatrixInverse.getInverse(bindMatrix);

        }
        pose()
        {
            this.skeleton.pose();
        }
        normalizeSkinWeights()
        {
            var geometry = this.geometry;
            if (geometry instanceof Geometry)
            {

                for (var i = 0; i < geometry.skinWeights.length; i++)
                {
                    var sw = geometry.skinWeights[i];

                    var scale = 1.0 / sw.lengthManhattan();

                    if (scale !== Infinity)
                    {
                        sw.multiplyScalar(scale);
                    }
                    else
                    {
                        sw.set(1, 0, 0, 0); // do something reasonable 
                    }

                }

            }
            else if (geometry instanceof BufferGeometry)
            {
                var vec = new Vector4();
                var skinWeight = geometry.attributes.skinWeight;

                for (var i = 0; i < skinWeight.count; i++)
                {
                    vec.x = skinWeight.getX(i);
                    vec.y = skinWeight.getY(i);
                    vec.z = skinWeight.getZ(i);
                    vec.w = skinWeight.getW(i);

                    var scale = 1.0 / vec.lengthManhattan();

                    if (scale !== Infinity)
                    {
                        vec.multiplyScalar(scale);
                    }
                    else
                    {
                        vec.set(1, 0, 0, 0); // do something reasonable 
                    }
                    skinWeight.setXYZW(i, vec.x, vec.y, vec.z, vec.w);
                }
            }
        }
        updateMatrixWorld(force?: boolean)
        {
            super.updateMatrixWorld(true);

            if (this.bindMode === "attached")
            {
                this.bindMatrixInverse.getInverse(this.matrixWorld);

            }
            else if (this.bindMode === "detached")
            {
                this.bindMatrixInverse.getInverse(this.bindMatrix);
            }
            else
            {
                console.warn('THREE.SkinnedMesh unrecognized bindMode: ' + this.bindMode);
            }
        }
        clone()
        {
            return new (this.constructor as any)(this.geometry, this.material, this.skeleton.useVertexTexture).copy(this);
        }
    }
}
