/// <reference path="mesh.ts" />
/*
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var SkinnedMesh = (function (_super) {
        __extends(SkinnedMesh, _super);
        function SkinnedMesh(geometry, material, useVertexTexture) {
            _super.call(this, geometry, material);
            this.type = 'SkinnedMesh';
            this.bindMode = "attached";
            this.bindMatrix = new THREE.Matrix4();
            this.bindMatrixInverse = new THREE.Matrix4();
            // init bones
            // TODO: remove bone creation as there is no reason (other than
            // convenience) for THREE.SkinnedMesh to do this.
            var bones = [];
            if (this.geometry && this.geometry["bones"] !== undefined) {
                var gbones = this.geometry["bones"];
                var bone, gbone;
                for (var b = 0, bl = gbones.length; b < bl; ++b) {
                    gbone = gbones[b];
                    bone = new THREE.Bone(this);
                    bones.push(bone);
                    bone.name = gbone.name;
                    bone.position.fromArray(gbone.pos);
                    bone.quaternion.fromArray(gbone.rotq);
                    if (gbone.scl !== undefined)
                        bone.scale.fromArray(gbone.scl);
                }
                for (var b = 0, bl = gbones.length; b < bl; ++b) {
                    gbone = gbones[b];
                    if (gbone.parent !== -1 && gbone.parent !== null &&
                        bones[gbone.parent] !== undefined) {
                        bones[gbone.parent].add(bones[b]);
                    }
                    else {
                        this.add(bones[b]);
                    }
                }
            }
            this.normalizeSkinWeights();
            this.updateMatrixWorld(true);
            this.bind(new THREE.Skeleton(bones, undefined, useVertexTexture), this.matrixWorld);
        }
        ;
        SkinnedMesh.prototype.bind = function (skeleton, bindMatrix) {
            this.skeleton = skeleton;
            if (bindMatrix === undefined) {
                this.updateMatrixWorld(true);
                this.skeleton.calculateInverses();
                bindMatrix = this.matrixWorld;
            }
            this.bindMatrix.copy(bindMatrix);
            this.bindMatrixInverse.getInverse(bindMatrix);
        };
        SkinnedMesh.prototype.pose = function () {
            this.skeleton.pose();
        };
        SkinnedMesh.prototype.normalizeSkinWeights = function () {
            var geometry = this.geometry;
            if (geometry instanceof THREE.Geometry) {
                for (var i = 0; i < geometry.skinWeights.length; i++) {
                    var sw = geometry.skinWeights[i];
                    var scale = 1.0 / sw.lengthManhattan();
                    if (scale !== Infinity) {
                        sw.multiplyScalar(scale);
                    }
                    else {
                        sw.set(1, 0, 0, 0); // do something reasonable 
                    }
                }
            }
            else if (geometry instanceof THREE.BufferGeometry) {
                var vec = new THREE.Vector4();
                var skinWeight = geometry.attributes.skinWeight;
                for (var i = 0; i < skinWeight.count; i++) {
                    vec.x = skinWeight.getX(i);
                    vec.y = skinWeight.getY(i);
                    vec.z = skinWeight.getZ(i);
                    vec.w = skinWeight.getW(i);
                    var scale = 1.0 / vec.lengthManhattan();
                    if (scale !== Infinity) {
                        vec.multiplyScalar(scale);
                    }
                    else {
                        vec.set(1, 0, 0, 0); // do something reasonable 
                    }
                    skinWeight.setXYZW(i, vec.x, vec.y, vec.z, vec.w);
                }
            }
        };
        SkinnedMesh.prototype.updateMatrixWorld = function (force) {
            _super.prototype.updateMatrixWorld.call(this, true);
            if (this.bindMode === "attached") {
                this.bindMatrixInverse.getInverse(this.matrixWorld);
            }
            else if (this.bindMode === "detached") {
                this.bindMatrixInverse.getInverse(this.bindMatrix);
            }
            else {
                console.warn('THREE.SkinnedMesh unrecognized bindMode: ' + this.bindMode);
            }
        };
        SkinnedMesh.prototype.clone = function () {
            return new this.constructor(this.geometry, this.material, this.skeleton.useVertexTexture).copy(this);
        };
        return SkinnedMesh;
    }(THREE.Mesh));
    THREE.SkinnedMesh = SkinnedMesh;
})(THREE || (THREE = {}));
