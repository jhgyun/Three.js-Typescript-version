/// <reference path="polyhedrongeometry.ts" />
/* 
 * @author timothypratley / https://github.com/timothypratley
 */

namespace THREE
{
    export class TetrahedronGeometry extends PolyhedronGeometry
    {
        constructor(radius?: number, detail?: number)
        { 
            var vertices = [
                1, 1, 1, - 1, - 1, 1, - 1, 1, - 1, 1, - 1, - 1
            ];

            var indices = [
                2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1
            ];

            super(vertices, indices, radius, detail);

            this.type = 'TetrahedronGeometry';

            this.parameters = {
                radius: radius,
                detail: detail
            };

        };
         
    }
}
