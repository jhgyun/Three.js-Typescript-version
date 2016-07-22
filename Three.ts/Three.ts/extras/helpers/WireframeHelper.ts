/// <reference path="../../objects/linesegments.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class WireframeHelper extends LineSegments
    {
        constructor(object: Object3D, hex?: number)
        {
            super();

            var color = (hex !== undefined) ? hex : 0xffffff;

            this.geometry = new WireframeGeometry(object.geometry as any);
            this.material = new LineBasicMaterial({ color: color })

            this.matrix = object.matrixWorld;
            this.matrixAutoUpdate = false;
        };
    }
}