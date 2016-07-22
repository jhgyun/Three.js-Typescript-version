/* 
 * @author bhouston / http://clara.io
 */

namespace THREE
{
    export class Line3
    { 
        constructor(public start = new Vector3(), public end = new Vector3())
        {
        }
        set(start: Vector3, end: Vector3)
        {
            this.start.copy(start);
            this.end.copy(end);
            return this;
        }
        clone()
        {
            return new Line3().copy(this);
        }
        copy(line: Line3)
        {
            this.start.copy(line.start);
            this.end.copy(line.end);
            return this;
        }
        center(optionalTarget?: Vector3)
        {
            var result = optionalTarget || new Vector3();
            return result.addVectors(this.start, this.end).multiplyScalar(0.5);
        }
        delta(optionalTarget?: Vector3)
        {
            var result = optionalTarget || new Vector3();
            return result.subVectors(this.end, this.start);
        }
        distanceSq()
        {
            return this.start.distanceToSquared(this.end);
        }
        distance()
        {
            return this.start.distanceTo(this.end);
        }
        at(t: number, optionalTarget?: Vector3)
        {
            var result = optionalTarget || new Vector3();
            return this.delta(result).multiplyScalar(t).add(this.start);
        }
        closestPointToPointParameter(point: Vector3, clampToLine: boolean): number
        {
            var startP =  new Vector3();
            var startEnd = new Vector3();

            var func = Line3.prototype.closestPointToPointParameter = function (point: Vector3, clampToLine: boolean)
            {
                startP.subVectors(point, this.start);
                startEnd.subVectors(this.end, this.start);

                var startEnd2 = startEnd.dot(startEnd);
                var startEnd_startP = startEnd.dot(startP);

                var t = startEnd_startP / startEnd2;

                if (clampToLine)
                {
                    t = Math.clamp(t, 0, 1);
                } 

                return t;
            }
            return func.apply(this, arguments);
        }
        closestPointToPoint(point: Vector3, clampToLine: boolean, optionalTarget?: Vector3)
        {
            var t = this.closestPointToPointParameter(point, clampToLine);
            var result = optionalTarget || new Vector3();
            return this.delta(result).multiplyScalar(t).add(this.start);
        }

        applyMatrix4(matrix: Matrix4)
        {
            this.start.applyMatrix4(matrix);
            this.end.applyMatrix4(matrix);
            return this;
        }

        equals(line)
        {
            return line.start.equals(this.start) && line.end.equals(this.end);
        }
    };
}