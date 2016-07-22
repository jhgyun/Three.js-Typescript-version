/// <reference path="../../objects/linesegments.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */
namespace THREE
{
    export class GridHelper extends LineSegments
    {
        constructor(size: number, step: number, acolor1?: number, acolor2?: number)
        {
            super();
            var color1 = new Color(acolor1 !== undefined ? acolor1 : 0x444444);
            var color2 = new Color(acolor2 !== undefined ? acolor2 : 0x888888);

            var vertices = [];
            var colors = [];

            for (var i = - size, j = 0; i <= size; i += step)
            { 
                vertices.push(- size, 0, i, size, 0, i);
                vertices.push(i, 0, - size, i, 0, size);

                var color = i === 0 ? color1 : color2;

                color.toArray(colors, j); j += 3;
                color.toArray(colors, j); j += 3;
                color.toArray(colors, j); j += 3;
                color.toArray(colors, j); j += 3; 
            }

            var geometry = new BufferGeometry();
            geometry.addAttribute('position', new Float32Attribute(vertices, 3));
            geometry.addAttribute('color', new Float32Attribute(colors, 3));

            var material = new LineBasicMaterial({ vertexColors: VertexColors });

            this.geometry = geometry;
            this.material = material; 
        }; 
    }
}
