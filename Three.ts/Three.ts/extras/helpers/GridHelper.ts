/// <reference path="../../objects/linesegments.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */
namespace THREE
{
    export class GridHelper extends LineSegments
    {
        constructor(size: number, divisions: number, acolor1?: number, acolor2?: number)
        {
            super();

            divisions = divisions || 1;
            var color1 = new THREE.Color(acolor1 !== undefined ? acolor1 : 0x444444);
            var color2 = new THREE.Color(acolor2 !== undefined ? acolor2 : 0x888888);

            var center = divisions / 2;
            var step = (size * 2) / divisions;
            var vertices = [], colors = [];

            for (var i = 0, j = 0, k = - size; i <= divisions; i++ , k += step)
            {
                vertices.push(- size, 0, k, size, 0, k);
                vertices.push(k, 0, - size, k, 0, size);

                var color = i === center ? color1 : color2;

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
