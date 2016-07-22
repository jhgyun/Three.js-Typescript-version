/// <reference path="../../core/geometry.ts" />
/* 
 * @author hughes
 */
namespace THREE
{
    export class CircleGeometry extends Geometry
    {
        constructor(radius?: number, segments?: number, thetaStart?: number, thetaLength?: number)
        { 
            super( ); 
            this.type = 'CircleGeometry';

            this.parameters = {
                radius: radius,
                segments: segments,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            }; 

            this.fromBufferGeometry(new CircleBufferGeometry(radius, segments, thetaStart, thetaLength)); 
        }; 
    }
}
