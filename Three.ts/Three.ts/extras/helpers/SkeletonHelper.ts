/// <reference path="../../objects/linesegments.ts" />
/* 
 * @author Sean Griffin / http://twitter.com/sgrif
 * @author Michael Guerrero / http://realitymeltdown.com
 * @author mrdoob / http://mrdoob.com/
 * @author ikerr / http://verold.com
 */

namespace THREE
{
    export class SkeletonHelper extends LineSegments
    {
        bones: Bone[];
        root: Object3D;

        constructor(object)
        {
            super();
            this.bones = this.getBoneList(object);

            var geometry = new Geometry();

            for (var i = 0; i < this.bones.length; i++)
            {
                var bone = this.bones[i];

                if (bone.parent instanceof Bone)
                {
                    geometry.vertices.push(new Vector3());
                    geometry.vertices.push(new Vector3());
                    geometry.colors.push(new Color(0, 0, 1));
                    geometry.colors.push(new Color(0, 1, 0));
                }
            }

            geometry.dynamic = true;

            var material = new LineBasicMaterial({ vertexColors: VertexColors, depthTest: false, depthWrite: false, transparent: true });

            this.geometry = geometry;
            this.material = material;

            this.root = object;
            this.matrix = object.matrixWorld;
            this.matrixAutoUpdate = false;
            this.update();
        }  
        private getBoneList(object: Object3D)
        {
            var boneList = [];
            if (object instanceof Bone)
            {
                boneList.push(object);
            }

            for (var i = 0; i < object.children.length; i++)
            {
                boneList.push.apply(boneList, this.getBoneList(object.children[i]));
            }
            return boneList;
        }  
        update()
        {
            var geometry = this.geometry as Geometry;

            var matrixWorldInv = new Matrix4().getInverse(this.root.matrixWorld);
            var boneMatrix = new Matrix4();

            var j = 0;

            for (var i = 0; i < this.bones.length; i++)
            {
                var bone = this.bones[i];

                if (bone.parent instanceof Bone)
                {
                    boneMatrix.multiplyMatrices(matrixWorldInv, bone.matrixWorld);
                    geometry.vertices[j].setFromMatrixPosition(boneMatrix);

                    boneMatrix.multiplyMatrices(matrixWorldInv, bone.parent.matrixWorld);
                    geometry.vertices[j + 1].setFromMatrixPosition(boneMatrix);

                    j += 2;
                }
            }

            geometry.verticesNeedUpdate = true;
            geometry.computeBoundingSphere();
        } 
    }
}
