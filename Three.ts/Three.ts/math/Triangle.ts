/* 
 * @author bhouston / http://clara.io
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class Triangle
    {
        constructor(
            public a = new Vector3(),
            public b = new Vector3(),
            public c = new Vector3())
        {
        }

        static normal(a: Vector3, b: Vector3, c: Vector3, optionalTarget?: Vector3): Vector3
        {
            var v0 = new Vector3();

            var func = Triangle.normal = function (a: Vector3, b: Vector3, c: Vector3, optionalTarget?: Vector3)
            {
                var result = optionalTarget || new Vector3();

                result.subVectors(c, b);
                v0.subVectors(a, b);
                result.cross(v0);
                  
                var resultLengthSq = result.lengthSq();
                if (resultLengthSq > 0)
                {
                    return result.multiplyScalar(1 / Math.sqrt(resultLengthSq));
                }
                return result.set(0, 0, 0);
            }
            return func.apply(this, arguments);
        }
        static barycoordFromPoint(point: Vector3, a: Vector3, b: Vector3, c: Vector3, optionalTarget?: Vector3): Vector3
        {
            // static/instance method to calculate barycentric coordinates
            // based on: http://www.blackpawn.com/texts/pointinpoly/default.html
            var v0 = new Vector3();
            var v1 = new Vector3();
            var v2 = new Vector3();

            var func = Triangle.barycoordFromPoint = function (point: Vector3, a: Vector3, b: Vector3, c: Vector3, optionalTarget?: Vector3)
            {
                v0.subVectors(c, a);
                v1.subVectors(b, a);
                v2.subVectors(point, a);

                var dot00 = v0.dot(v0);
                var dot01 = v0.dot(v1);
                var dot02 = v0.dot(v2);
                var dot11 = v1.dot(v1);
                var dot12 = v1.dot(v2);

                var denom = (dot00 * dot11 - dot01 * dot01);

                var result = optionalTarget || new Vector3();
                  
                // collinear or singular triangle
                if (denom === 0)
                {
                    // arbitrary location outside of triangle?
                    // not sure if this is the best idea, maybe should be returning undefined
                    return result.set(- 2, - 1, - 1);
                }

                var invDenom = 1 / denom;
                var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
                var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

                // barycentric coordinates must always sum to 1
                return result.set(1 - u - v, v, u);
            }

            return func.apply(this, arguments);
        }
        static containsPoint(point: Vector3, a: Vector3, b: Vector3, c: Vector3): boolean
        {
            var v1 = new Vector3();

            var func = Triangle.containsPoint = function (point: Vector3, a: Vector3, b: Vector3, c: Vector3)
            {
                var result = Triangle.barycoordFromPoint(point, a, b, c, v1);

                var r = (result.x >= 0) && (result.y >= 0) && ((result.x + result.y) <= 1); 
                return r;
            }
            return func.apply(this, arguments);
        }


        set(a: Vector3, b: Vector3, c: Vector3)
        {
            this.a.copy(a);
            this.b.copy(b);
            this.c.copy(c);
            return this;
        }
        setFromPointsAndIndices(points: Vector3[], i0: number, i1: number, i2: number)
        {
            this.a.copy(points[i0]);
            this.b.copy(points[i1]);
            this.c.copy(points[i2]);
            return this;
        }
        clone()
        {
            return new Triangle().copy(this);
        }

        copy(triangle: Triangle)
        {
            this.a.copy(triangle.a);
            this.b.copy(triangle.b);
            this.c.copy(triangle.c);
            return this;
        }
        area():number
        {
            var v0 = new Vector3();
            var v1 = new Vector3();

            var func = Triangle.prototype.area = function ()
            {

                v0.subVectors(this.c, this.b);
                v1.subVectors(this.a, this.b);

                var area = v0.cross(v1).length() * 0.5; 
                return area;
            }
            return func.apply(this, arguments);
        }

        midpoint(optionalTarget?: Vector3)
        {
            var result = optionalTarget || new Vector3();
            return result.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
        }
        normal(optionalTarget?: Vector3)
        {
            return Triangle.normal(this.a, this.b, this.c, optionalTarget);
        }

        plane(optionalTarget?: Plane)
        {
            var result = optionalTarget || new Plane();
            return result.setFromCoplanarPoints(this.a, this.b, this.c);
        }
        barycoordFromPoint(point: Vector3, optionalTarget?: Vector3)
        {
            return Triangle.barycoordFromPoint(point, this.a, this.b, this.c, optionalTarget);
        }
        containsPoint(point: Vector3)
        {
            return Triangle.containsPoint(point, this.a, this.b, this.c);
        }
        closestPointToPoint(point: Vector3, optionalTarget?: Vector3): Vector3
        { 
            var plane    =   new Plane() ;
            var edgeList = [new Line3(), new Line3(), new Line3()]; 
            var projectedPoint =   new Vector3();
            var closestPoint =   new Vector3();

            var func = Triangle.prototype.closestPointToPoint = function (point: Vector3, optionalTarget?: Vector3)
            {
                var result = optionalTarget || new Vector3();
                var minDistance = Infinity;

                // project the point onto the plane of the triangle

                plane.setFromCoplanarPoints(this.a, this.b, this.c);
                plane.projectPoint(point, projectedPoint);

                // check if the projection lies within the triangle

                if (this.containsPoint(projectedPoint) === true)
                {
                    // if so, this is the closest point 
                    result.copy(projectedPoint);
                }
                else
                {
                    // if not, the point falls outside the triangle. the result is the closest point to the triangle's edges or vertices

                    edgeList[0].set(this.a, this.b);
                    edgeList[1].set(this.b, this.c);
                    edgeList[2].set(this.c, this.a);

                    for (var i = 0; i < edgeList.length; i++)
                    {
                        edgeList[i].closestPointToPoint(projectedPoint, true, closestPoint);

                        var distance = projectedPoint.distanceToSquared(closestPoint);

                        if (distance < minDistance)
                        {
                            minDistance = distance;
                            result.copy(closestPoint);
                        }
                    }
                }
                return result;
            }

            return func.apply(this, arguments);
        }

        equals(triangle: Triangle)
        {
            return triangle.a.equals(this.a) && triangle.b.equals(this.b) && triangle.c.equals(this.c);
        }
    };
}