/// <reference path="../../objects/linesegments.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
*/

namespace THREE
{
    export class VertexNormalsHelper extends LineSegments
    {
        object: Object3D;
        size: number;

        constructor(object: Object3D, size?: number, hex?: number, linewidth?: number)
        {
            super();
            this.object = object;

            this.size = (size !== undefined) ? size : 1;
            var color = (hex !== undefined) ? hex : 0xff0000;
            var width = (linewidth !== undefined) ? linewidth : 1;
            //

            var nNormals = 0;
            var objGeometry = this.object.geometry;

            if (objGeometry instanceof Geometry)
            {
                nNormals = objGeometry.faces.length * 3;
            }
            else if (objGeometry instanceof BufferGeometry)
            {
                nNormals = objGeometry.attributes.normal.count;
            }

            //

            var geometry = new BufferGeometry();
            var positions = new Float32Attribute(nNormals * 2 * 3, 3);

            geometry.addAttribute('position', positions);

            this.geometry = geometry;
            this.material = new LineBasicMaterial({ color: color, linewidth: width });

            // 
            this.matrixAutoUpdate = false;
            this.update();
        }       
        update()
        {
            var v1: Vector3 = VertexNormalsHelper["__update_v1"] || (VertexNormalsHelper["__update_v1"] = new Vector3());
            var v2: Vector3 = VertexNormalsHelper["__update_v2"] || (VertexNormalsHelper["__update_v2"] = new Vector3());
            var normalMatrix: Matrix3 = VertexNormalsHelper["__update_normalMatrix"] || (VertexNormalsHelper["__update_normalMatrix"] = new Matrix3());


            var keys = ['a', 'b', 'c'];

            this.object.updateMatrixWorld(true);

            normalMatrix.getNormalMatrix(this.object.matrixWorld);

            var matrixWorld = this.object.matrixWorld;

            var position = (this.geometry as BufferGeometry).attributes.position;
            //

            var objGeometry = this.object.geometry;

            if (objGeometry instanceof Geometry)
            {
                var vertices = objGeometry.vertices;
                var faces = objGeometry.faces;
                var idx = 0;

                for (var i = 0, l = faces.length; i < l; i++)
                {
                    var face = faces[i];

                    for (var j = 0, jl = face.vertexNormals.length; j < jl; j++)
                    {
                        var vertex = vertices[face[keys[j]]];
                        var normal = face.vertexNormals[j];
                        v1.copy(vertex).applyMatrix4(matrixWorld);
                        v2.copy(normal).applyMatrix3(normalMatrix).normalize().multiplyScalar(this.size).add(v1);

                        position.setXYZ(idx, v1.x, v1.y, v1.z);

                        idx = idx + 1;

                        position.setXYZ(idx, v2.x, v2.y, v2.z);

                        idx = idx + 1;
                    }
                }
            }
            else if (objGeometry instanceof BufferGeometry)
            {
                var objPos = objGeometry.attributes.position;

                var objNorm = objGeometry.attributes.normal;

                var idx = 0;

                // for simplicity, ignore index and drawcalls, and render every normal

                for (var j = 0, jl = objPos.count; j < jl; j++)
                {
                    v1.set(objPos.getX(j), objPos.getY(j), objPos.getZ(j)).applyMatrix4(matrixWorld);

                    v2.set(objNorm.getX(j), objNorm.getY(j), objNorm.getZ(j));

                    v2.applyMatrix3(normalMatrix).normalize().multiplyScalar(this.size).add(v1);

                    position.setXYZ(idx, v1.x, v1.y, v1.z);

                    idx = idx + 1;
                    position.setXYZ(idx, v2.x, v2.y, v2.z);
                    idx = idx + 1;
                }
            }

            (position as BufferAttribute).needsUpdate = true;
            return this;
        }
    }
}
