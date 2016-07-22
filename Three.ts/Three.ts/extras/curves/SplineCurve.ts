/// <reference path="../core/curve.ts" />
/* *************************************************************
 *	Spline curve
 **************************************************************/

namespace THREE
{
    export class SplineCurve extends Curve<Vector2>
    {
        points: Vector2[];
        constructor(points?: Vector2[] /* array of Vector2 */)
        {
            super();
            this.points = (points == undefined) ? [] : points; 
        };
          
        getPoint(t: number)
        {
            var points = this.points;
            var point = (points.length - 1) * t;

            var intPoint = Math.floor(point);
            var weight = point - intPoint;

            var point0 = points[intPoint === 0 ? intPoint : intPoint - 1];
            var point1 = points[intPoint];
            var point2 = points[intPoint > points.length - 2 ? points.length - 1 : intPoint + 1];
            var point3 = points[intPoint > points.length - 3 ? points.length - 1 : intPoint + 2];

            var interpolate = CurveUtils.interpolate;

            return new Vector2(
                interpolate(point0.x, point1.x, point2.x, point3.x, weight),
                interpolate(point0.y, point1.y, point2.y, point3.y, weight)
            ); 
        };
    }
}