/* 
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    export class Face3
    {
        normal: Vector3;
        vertexNormals: Vector3[];
        color: Color;
        vertexColors: Color[];

        constructor(
            public a?: number, public b?: number, public c?: number,
            normal?: Vector3 | Vector3[],
            color?: Color | Color[],
            public materialIndex = 0)
        {

            this.a = a;
            this.b = b;
            this.c = c;

            this.normal = normal instanceof Vector3 ? normal : new Vector3();
            this.vertexNormals = Array.isArray(normal) ? normal : [];

            this.color = color instanceof Color ? color : new Color();
            this.vertexColors = Array.isArray(color) ? color : [];
        };
        clone()
        {
            return new Face3().copy(this);
        }
        copy(source: Face3)
        {
            this.a = source.a;
            this.b = source.b;
            this.c = source.c;
            this.normal.copy(source.normal);
            this.color.copy(source.color);

            this.materialIndex = source.materialIndex;

            for (var i = 0, il = source.vertexNormals.length; i < il; i++)
            {
                this.vertexNormals[i] = source.vertexNormals[i].clone();
            }

            for (var i = 0, il = source.vertexColors.length; i < il; i++)
            {
                this.vertexColors[i] = source.vertexColors[i].clone();
            }

            return this;
        }

        __originalFaceNormal: Vector3;
        __originalVertexNormals: Vector3[];
        _id: number;
    }
}