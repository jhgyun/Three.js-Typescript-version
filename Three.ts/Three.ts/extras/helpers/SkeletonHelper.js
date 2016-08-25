/// <reference path="../../objects/linesegments.ts" />
/*
 * @author Sean Griffin / http://twitter.com/sgrif
 * @author Michael Guerrero / http://realitymeltdown.com
 * @author mrdoob / http://mrdoob.com/
 * @author ikerr / http://verold.com
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var SkeletonHelper = (function (_super) {
        __extends(SkeletonHelper, _super);
        function SkeletonHelper(object) {
            _super.call(this);
            this.bones = this.getBoneList(object);
            var geometry = new THREE.Geometry();
            for (var i = 0; i < this.bones.length; i++) {
                var bone = this.bones[i];
                if (bone.parent instanceof THREE.Bone) {
                    geometry.vertices.push(new THREE.Vector3());
                    geometry.vertices.push(new THREE.Vector3());
                    geometry.colors.push(new THREE.Color(0, 0, 1));
                    geometry.colors.push(new THREE.Color(0, 1, 0));
                }
            }
            geometry.dynamic = true;
            var material = new THREE.LineBasicMaterial({ vertexColors: THREE.VertexColors, depthTest: false, depthWrite: false, transparent: true });
            this.geometry = geometry;
            this.material = material;
            this.root = object;
            this.matrix = object.matrixWorld;
            this.matrixAutoUpdate = false;
            this.update();
        }
        SkeletonHelper.prototype.getBoneList = function (object) {
            var boneList = [];
            if (object instanceof THREE.Bone) {
                boneList.push(object);
            }
            for (var i = 0; i < object.children.length; i++) {
                boneList.push.apply(boneList, this.getBoneList(object.children[i]));
            }
            return boneList;
        };
        SkeletonHelper.prototype.update = function () {
            var geometry = this.geometry;
            var matrixWorldInv = new THREE.Matrix4().getInverse(this.root.matrixWorld);
            var boneMatrix = new THREE.Matrix4();
            var j = 0;
            for (var i = 0; i < this.bones.length; i++) {
                var bone = this.bones[i];
                if (bone.parent instanceof THREE.Bone) {
                    boneMatrix.multiplyMatrices(matrixWorldInv, bone.matrixWorld);
                    geometry.vertices[j].setFromMatrixPosition(boneMatrix);
                    boneMatrix.multiplyMatrices(matrixWorldInv, bone.parent.matrixWorld);
                    geometry.vertices[j + 1].setFromMatrixPosition(boneMatrix);
                    j += 2;
                }
            }
            geometry.verticesNeedUpdate = true;
            geometry.computeBoundingSphere();
        };
        return SkeletonHelper;
    }(THREE.LineSegments));
    THREE.SkeletonHelper = SkeletonHelper;
})(THREE || (THREE = {}));
