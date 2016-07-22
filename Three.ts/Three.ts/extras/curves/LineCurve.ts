/// <reference path="../core/curve.ts" />
/* *************************************************************
 *	Line
 **************************************************************/

namespace THREE
{
    export class LineCurve extends Curve<Vector2>
    {
        v1: Vector2;
        v2: Vector2;
        constructor(v1: Vector2, v2: Vector2)
        {
            super();
            this.v1 = v1;
            this.v2 = v2; 
        };

        getPoint(t: number)
        { 
            var point = this.v2.clone().sub(this.v1);
            point.multiplyScalar(t).add(this.v1); 
            return point; 
        };

        /** Line curve is linear, so we can overwrite default getPointAt */
        getPointAt(u: number)
        { 
            return this.getPoint(u); 
        };

        getTangent(t: number)
        { 
            var tangent = this.v2.clone().sub(this.v1); 
            return tangent.normalize(); 
        };
    }
}