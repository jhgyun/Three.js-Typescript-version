/// <reference path="../core/curve.ts" />
/* *************************************************************
 *	Cubic Bezier 3D curve
 **************************************************************/
namespace THREE
{
    export class CubicBezierCurve3 extends Curve<Vector3>
    { 
        constructor(
            public v0: Vector3,
            public v1: Vector3,
            public v2: Vector3,
            public v3: Vector3)
        {
            super(); 
        } 
        getPoint(t: number)   
        { 
            var b3 = ShapeUtils.b3; 
            return new Vector3(
                b3(t, this.v0.x, this.v1.x, this.v2.x, this.v3.x),
                b3(t, this.v0.y, this.v1.y, this.v2.y, this.v3.y),
                b3(t, this.v0.z, this.v1.z, this.v2.z, this.v3.z)
            ); 
        } 
    }
}