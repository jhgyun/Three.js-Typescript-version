/* 
 * Spline from Tween.js, slightly optimized (and trashed)
 * http://sole.github.com/tween.js/examples/05_spline.html
 *
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{ 
    export class Spline
    {
        points: Vector3[];
        private c = [0, 0, 0, 0];
        private v3 = new Vector3();

        constructor(points: Vector3[])
        {
            this.points = points;
        }

        initFromArray(a: number[][])
        {
            this.points = [];
            for (var i = 0; i < a.length; i++)
            {
                this.points[i] = new Vector3(a[i][0], a[i][1], a[i][2]);
            }
        };
        getPoint(k: number)
        {
            var point = (this.points.length - 1) * k;
            var intPoint = Math.floor(point);
            var weight = point - intPoint;

            var c = this.c;
            c[0] = intPoint === 0 ? intPoint : intPoint - 1;
            c[1] = intPoint;
            c[2] = intPoint > this.points.length - 2 ? this.points.length - 1 : intPoint + 1;
            c[3] = intPoint > this.points.length - 3 ? this.points.length - 1 : intPoint + 2;

            var pa = this.points[c[0]];
            var pb = this.points[c[1]];
            var pc = this.points[c[2]];
            var pd = this.points[c[3]];

            var w2 = weight * weight;
            var w3 = weight * w2;

            var v3 = this.v3;
            v3.x = Spline.interpolate(pa.x, pb.x, pc.x, pd.x, weight, w2, w3);
            v3.y = Spline.interpolate(pa.y, pb.y, pc.y, pd.y, weight, w2, w3);
            v3.z = Spline.interpolate(pa.z, pb.z, pc.z, pd.z, weight, w2, w3);

            return this.v3;
        };
        getControlPointsArray(): number[][]
        {
            var i: number;
            var p: Vector3;
            var l = this.points.length
            var coords: number[][] = [];

            for (i = 0; i < l; i++)
            {
                p = this.points[i];
                coords[i] = [p.x, p.y, p.z];
            }
            return coords;
        } 
        getLength(nSubDivisions?: number)
        {
            var i, index, nSamples, position,
                point = 0, intPoint = 0, oldIntPoint = 0,
                oldPosition = new Vector3(),
                tmpVec = new Vector3(),
                chunkLengths = [],
                totalLength = 0;

            // first point has 0 length

            chunkLengths[0] = 0;

            if (!nSubDivisions) nSubDivisions = 100;

            nSamples = this.points.length * nSubDivisions;

            oldPosition.copy(this.points[0]);

            for (i = 1; i < nSamples; i++)
            {
                index = i / nSamples;
                position = this.getPoint(index);
                tmpVec.copy(position);

                totalLength += tmpVec.distanceTo(oldPosition);

                oldPosition.copy(position);

                point = (this.points.length - 1) * index;
                intPoint = Math.floor(point);

                if (intPoint !== oldIntPoint)
                {

                    chunkLengths[intPoint] = totalLength;
                    oldIntPoint = intPoint;
                }
            }

            // last point ends with total length

            chunkLengths[chunkLengths.length] = totalLength;
            return { chunks: chunkLengths, total: totalLength };
        } 
        static interpolate(
            p0: number, p1: number, p2: number, p3: number,
            t: number, t2: number, t3: number)
        {
            var v0 = (p2 - p0) * 0.5,
                v1 = (p3 - p1) * 0.5;
            return (2 * (p1 - p2) + v0 + v1) * t3 + (- 3 * (p1 - p2) - 2 * v0 - v1) * t2 + v0 * t + p1;
        }
    }
}