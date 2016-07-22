/// <reference path="../core/curve.ts" />
/* *************************************************************
 *	Line3D
 **************************************************************/

namespace THREE
{
    export class LineCurve3 extends Curve<Vector3>
    {
        v1: Vector3;
        v2: Vector3;
        constructor(v1, v2)
        {
            super();
            this.v1 = v1;
            this.v2 = v2;
        } 

        getPoint(t?: number)
        {
            var vector = new Vector3(); 
            vector.subVectors(this.v2, this.v1); // diff
            vector.multiplyScalar(t);
            vector.add(this.v1);

            return vector;
        }  
    }
}