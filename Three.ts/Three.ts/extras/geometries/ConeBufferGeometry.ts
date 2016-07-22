/// <reference path="cylinderbuffergeometry.ts" />
/*
 * @author: abelnation / http://github.com/abelnation
 */

namespace THREE
{
    export class ConeBufferGeometry extends CylinderBufferGeometry
    {
        constructor(
            radius?: number, height?: number,
            radialSegments?: number, heightSegments?: number,
            openEnded?: boolean, thetaStart?: number, thetaLength?: number)
        { 
            super( 0, radius, height,
                radialSegments, heightSegments,
                openEnded, thetaStart, thetaLength);

            this.type = 'ConeBufferGeometry';

            this.parameters = {
                radius: radius,
                height: height,
                radialSegments: radialSegments,
                heightSegments: heightSegments,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            }; 
        }; 
    }
}
