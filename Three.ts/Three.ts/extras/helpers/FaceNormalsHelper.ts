/// <reference path="../../objects/linesegments.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
*/

namespace THREE
{
    /**
     *  FaceNormalsHelper only supports THREE.Geometry
     */
    export class FaceNormalsHelper extends LineSegments
    {
        object: Object3D;
        size: number;

        constructor(object: Object3D, size?: number, hex?: number, linewidth?: number)
        { 
            super(); 
            this.object = object;

            this.size = (size !== undefined) ? size : 1; 
            var color = (hex !== undefined) ? hex : 0xffff00; 
            var width = (linewidth !== undefined) ? linewidth : 1;
             
            var nNormals = 0;

            var objGeometry = this.object.geometry;

            if (objGeometry instanceof Geometry)
            { 
                nNormals = objGeometry.faces.length; 
            }
            else
            { 
                console.warn('THREE.FaceNormalsHelper: only THREE.Geometry is supported. Use THREE.VertexNormalsHelper, instead.');
                throw new Error('THREE.FaceNormalsHelper: only THREE.Geometry is supported. Use THREE.VertexNormalsHelper, instead.');
            } 
            // 
            var geometry = new BufferGeometry(); 
            var positions = new Float32Attribute(nNormals * 2 * 3, 3);

            geometry.addAttribute('position', positions);

            this.geometry = geometry;
            this.material = new LineBasicMaterial({ color: color, linewidth: width }); 

            this.matrixAutoUpdate = false;
            this.update(); 
        } 
        update()
        {

            var v1: Vector3 = FaceNormalsHelper["update_v1"];
            var v2: Vector3 = FaceNormalsHelper["update_v2"];
            var normalMatrix: Matrix3 = FaceNormalsHelper["update_normalMatrix"];
            if (v1 === undefined)
            {
                v1 = FaceNormalsHelper["update_v1"] = new Vector3();
                v2 = FaceNormalsHelper["update_v2"] = new Vector3();
                normalMatrix = FaceNormalsHelper["update_normalMatrix"] = new Matrix3();
            }
             

            this.object.updateMatrixWorld(true);

            normalMatrix.getNormalMatrix(this.object.matrixWorld);

            var matrixWorld = this.object.matrixWorld;

            var position = (this.geometry as BufferGeometry).attributes.position;

            // 
            var objGeometry = this.object.geometry as Geometry;

            var vertices = objGeometry.vertices;

            var faces = objGeometry.faces;

            var idx = 0;

            for (var i = 0, l = faces.length; i < l; i++)
            {

                var face = faces[i];

                var normal = face.normal;

                v1.copy(vertices[face.a])
                    .add(vertices[face.b])
                    .add(vertices[face.c])
                    .divideScalar(3)
                    .applyMatrix4(matrixWorld);

                v2.copy(normal).applyMatrix3(normalMatrix).normalize().multiplyScalar(this.size).add(v1);

                position.setXYZ(idx, v1.x, v1.y, v1.z);

                idx = idx + 1;

                position.setXYZ(idx, v2.x, v2.y, v2.z); 
                idx = idx + 1; 
            }

            (position as BufferAttribute).needsUpdate = true; 
            return this; 
        }  
    }
}