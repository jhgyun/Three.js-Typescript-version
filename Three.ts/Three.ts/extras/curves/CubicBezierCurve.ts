/// <reference path="../core/curve.ts" />
/* *************************************************************
 *	Cubic Bezier curve
 **************************************************************/

namespace THREE
{
    export class CubicBezierCurve extends Curve<Vector2>
    {
        constructor(
            public v0: Vector2,
            public v1: Vector2,
            public v2: Vector2,
            public v3: Vector2)
        {
            super();
        };

        getPoint(t: number)
        {
            var b3 = ShapeUtils.b3;
            return new Vector2(
                b3(t, this.v0.x, this.v1.x, this.v2.x, this.v3.x),
                b3(t, this.v0.y, this.v1.y, this.v2.y, this.v3.y)
            );

        };

        getTangent(t: number)
        {
            var tangentCubicBezier = CurveUtils.tangentCubicBezier;
            return new Vector2(
                tangentCubicBezier(t, this.v0.x, this.v1.x, this.v2.x, this.v3.x),
                tangentCubicBezier(t, this.v0.y, this.v1.y, this.v2.y, this.v3.y)
            ).normalize();

        };
    }
}