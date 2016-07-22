/// <reference path="../core/curve.ts" />
/* *************************************************************
 *	Quadratic Bezier curve
 **************************************************************/

namespace THREE
{
    export class QuadraticBezierCurve extends Curve<Vector2>
    {
        v0: Vector2;
        v1: Vector2;
        v2: Vector2;
        constructor(v0: Vector2, v1: Vector2, v2: Vector2)
        {
            super();
            this.v0 = v0;
            this.v1 = v1;
            this.v2 = v2;
        };


        getPoint(t)
        {
            var b2 = ShapeUtils.b2;

            return new Vector2(
                b2(t, this.v0.x, this.v1.x, this.v2.x),
                b2(t, this.v0.y, this.v1.y, this.v2.y)
            ); 
        };


        getTangent(t)
        {
            var tangentQuadraticBezier = CurveUtils.tangentQuadraticBezier;

            return new Vector2(
                tangentQuadraticBezier(t, this.v0.x, this.v1.x, this.v2.x),
                tangentQuadraticBezier(t, this.v0.y, this.v1.y, this.v2.y)
            ).normalize();

        };
    }
}