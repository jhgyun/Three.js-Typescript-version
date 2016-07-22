/// <reference path="../core/object3d.ts" />
/// <reference path="line.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class LineSegments extends Line
    {
        constructor(geometry?: IGeometry, material?: Material)
        {
            super(geometry, material);
            this.type = 'LineSegments'; 
        };
    }
}