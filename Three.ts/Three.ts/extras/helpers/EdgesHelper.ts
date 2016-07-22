/// <reference path="../../objects/linesegments.ts" />
/* 
 * @author WestLangley / http://github.com/WestLangley
 * @param object THREE.Mesh whose geometry will be used
 * @param hex line color
 * @param thresholdAngle the minimum angle (in degrees),
 * between the face normals of adjacent faces,
 * that is required to render an edge. A value of 10 means
 * an edge is only rendered if the angle is at least 10 degrees.
 */

namespace THREE
{
    export class EdgesHelper extends LineSegments
    {
        constructor(object: Object3D, hex, thresholdAngle)
        {
            super();
            var color = (hex !== undefined) ? hex : 0xffffff;

            this.geometry = new EdgesGeometry(object.geometry as any, thresholdAngle);
            this.material = new LineBasicMaterial({ color: color });
             
            this.matrix = object.matrixWorld;
            this.matrixAutoUpdate = false; 
        };
         
    }
}
