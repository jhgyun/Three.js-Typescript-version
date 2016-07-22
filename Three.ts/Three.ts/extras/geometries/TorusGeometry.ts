/// <reference path="../../core/geometry.ts" />
/* 
 * @author oosmoxiecode
 * @author mrdoob / http://mrdoob.com/
 * based on http://code.google.com/p/away3d/source/browse/trunk/fp10/Away3DLite/src/away3dlite/primitives/Torus.as?r=2888
 */

namespace THREE
{
    export class TorusGeometry extends Geometry
    {
        constructor(radius?: number, tube?: number, radialSegments?: number, tubularSegments?: number, arc?: number)
        {
            super();

            this.type = 'TorusGeometry';

            this.parameters = {
                radius: radius,
                tube: tube,
                radialSegments: radialSegments,
                tubularSegments: tubularSegments,
                arc: arc
            };

            this.fromBufferGeometry(new TorusBufferGeometry(radius, tube, radialSegments, tubularSegments, arc));

        };
         
    }
}
