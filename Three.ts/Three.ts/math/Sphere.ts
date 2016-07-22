/* 
 * @author bhouston / http://clara.io
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class Sphere
    { 
        constructor(public center = new Vector3(), public radius = 0)
        {
        }
        set(center: Vector3, radius: number)
        {
            this.center.copy(center);
            this.radius = radius;
            return this;
        }

        setFromPoints(points: ArrayLike<Vector3>, optionalCenter?: Vector3): this
        {
            var box = new Box3();
            var func = Sphere.prototype.setFromPoints = function (points: ArrayLike<Vector3>, optionalCenter?: Vector3)
            {
                var center = this.center;

                if (optionalCenter !== undefined)
                {
                    center.copy(optionalCenter);
                }
                else
                {
                    box.setFromPoints(points).center(center);
                }

                var maxRadiusSq = 0;
                for (var i = 0, il = points.length; i < il; i++)
                {
                    maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(points[i]));
                }

                this.radius = Math.sqrt(maxRadiusSq);
                return this;
            }
            return func.apply(this, arguments);
        }

        clone()
        {
            return new Sphere().copy(this);
        }
        copy(sphere: Sphere)
        {
            this.center.copy(sphere.center);
            this.radius = sphere.radius;
            return this;
        }
        empty()
        {
            return (this.radius <= 0);
        }
        containsPoint(point: Vector3)
        {
            return (point.distanceToSquared(this.center) <= (this.radius * this.radius));
        }
        distanceToPoint(point: Vector3)
        {
            return (point.distanceTo(this.center) - this.radius);
        }
        intersectsSphere(sphere: Sphere)
        {
            var radiusSum = this.radius + sphere.radius;
            return sphere.center.distanceToSquared(this.center) <= (radiusSum * radiusSum);
        }
        intersectsBox(box: Box3)
        {
            return box.intersectsSphere(this);
        }
        intersectsPlane(plane: Plane)
        {
            // We use the following equation to compute the signed distance from
            // the center of the sphere to the plane.
            //
            // distance = q * n - d
            //
            // If this distance is greater than the radius of the sphere,
            // then there is no intersection. 
            return Math.abs(this.center.dot(plane.normal) - plane.constant) <= this.radius;
        }
        clampPoint(point: Vector3, optionalTarget?: Vector3)
        {
            var deltaLengthSq = this.center.distanceToSquared(point);
            var result = optionalTarget || new Vector3();
            result.copy(point);
            if (deltaLengthSq > (this.radius * this.radius))
            {
                result.sub(this.center).normalize();
                result.multiplyScalar(this.radius).add(this.center);
            }
            return result;
        }

        getBoundingBox(optionalTarget?: Box3)
        {
            var box = optionalTarget || new Box3();
            box.set(this.center, this.center);
            box.expandByScalar(this.radius);
            return box;
        }
        applyMatrix4(matrix: Matrix4)
        {
            this.center.applyMatrix4(matrix);
            this.radius = this.radius * matrix.getMaxScaleOnAxis();
            return this;
        }
        translate(offset: Vector3)
        {
            this.center.add(offset);
            return this;
        }
        equals(sphere: Sphere)
        {
            return sphere.center.equals(this.center) && (sphere.radius === this.radius);
        }
    };
}