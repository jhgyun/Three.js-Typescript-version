/// <reference path="polyhedrongeometry.ts" />
/* 
 * @author timothypratley / https://github.com/timothypratley
 */

namespace THREE
{
    export class OctahedronGeometry extends PolyhedronGeometry
    {
        constructor(radius?: number, detail?: number)
        { 
            var vertices = [
                1, 0, 0, - 1, 0, 0, 0, 1, 0, 0, - 1, 0, 0, 0, 1, 0, 0, - 1
            ];

            var indices = [
                0, 2, 4, 0, 4, 3, 0, 3, 5, 0, 5, 2, 1, 2, 5, 1, 5, 3, 1, 3, 4, 1, 4, 2
            ];

            super(vertices, indices, radius, detail);

            this.type = 'OctahedronGeometry';

            this.parameters = {
                radius: radius,
                detail: detail
            }; 
        }; 
    }
}