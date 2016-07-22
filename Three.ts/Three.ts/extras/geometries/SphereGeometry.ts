/// <reference path="../../core/geometry.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class SphereGeometry extends Geometry
    {
        constructor(radius?: number, widthSegments?: number, heightSegments?: number, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number)
        { 
            super();

            this.type = 'SphereGeometry';

            this.parameters = {
                radius: radius,
                widthSegments: widthSegments,
                heightSegments: heightSegments,
                phiStart: phiStart,
                phiLength: phiLength,
                thetaStart: thetaStart,
                thetaLength: thetaLength
            };

            this.fromBufferGeometry(new SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength));

        };
         
    }
}
