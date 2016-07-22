/// <reference path="../core/object3d.ts" />
/* 
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    export class Sprite extends Object3D
    {
        constructor(material)
        {
            super();
            this.type = 'Sprite';

            this.material = (material !== undefined) ? material : new SpriteMaterial();
        };
         
        private static raycast_matrixPosition = new Vector3();
        raycast(raycaster: Raycaster, intersects: IntersectResult[])
        { 
            var matrixPosition = Sprite.raycast_matrixPosition;
            matrixPosition.setFromMatrixPosition(this.matrixWorld);

            var distanceSq = raycaster.ray.distanceSqToPoint(matrixPosition);
            var guessSizeSq = this.scale.x * this.scale.y / 4;

            if (distanceSq > guessSizeSq)
            { 
                return; 
            }

            intersects.push({

                distance: Math.sqrt(distanceSq),
                point: this.position,
                face: null,
                object: this

            });

        }
        clone(): this
        { 
            return new (this.constructor as any)(this.material).copy(this); 
        } 
    }
}
