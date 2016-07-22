/// <reference path="../../core/geometry.ts" />

/* 
 * @author astrodud / http://astrodud.isgreat.org/
 * @author zz85 / https://github.com/zz85
 * @author bhouston / http://clara.io
 */

// points - to create a closed torus, one must use a set of points
//    like so: [ a, b, c, d, a ], see first is the same as last.
// segments - the number of circumference segments to create
// phiStart - the starting radian
// phiLength - the radian (0 to 2PI) range of the lathed section
//    2PI is a closed lathe, less than 2PI is a portion.

namespace THREE
{
    export class LatheGeometry extends Geometry
    {
        constructor(points: Vector2[], segments?: number, phiStart?: number, phiLength?: number)
        { 
            super();

            this.type = 'LatheGeometry';

            this.parameters = {
                points: points,
                segments: segments,
                phiStart: phiStart,
                phiLength: phiLength
            };

            this.fromBufferGeometry(new LatheBufferGeometry(points, segments, phiStart, phiLength));
            this.mergeVertices();

        } 
    }
}