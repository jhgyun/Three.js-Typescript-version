/* 
 * @author bhouston / http://clara.io
 */

namespace THREE
{
    export class Plane
    { 
        constructor(public normal = new Vector3(1, 0, 0), public constant = 0)
        {
        }
        set(normal: Vector3, constant: number)
        {
            this.normal.copy(normal);
            this.constant = constant;
            return this;
        }
        setComponents(x: number, y: number, z: number, w: number)
        {
            this.normal.set(x, y, z);
            this.constant = w;
            return this;
        }

        setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3)
        {
            this.normal.copy(normal);
            this.constant = - point.dot(this.normal);	// must be this.normal, not normal, as this.normal is normalized

            return this;
        }

        setFromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): this
        {
            var v1 = new Vector3();
            var v2 = new Vector3();

            var func = Plane.prototype.setFromCoplanarPoints = function (a: Vector3, b: Vector3, c: Vector3)
            {
                var normal = v1.subVectors(c, b).cross(v2.subVectors(a, b)).normalize();
                // Q: should an error be thrown if normal is zero (e.g. degenerate plane)? 
                this.setFromNormalAndCoplanarPoint(normal, a); 

                return this;
            }
            return func.apply(this, arguments);
        }
        clone()
        {
            return new Plane().copy(this);
        }
        copy(plane: Plane)
        {
            this.normal.copy(plane.normal);
            this.constant = plane.constant;
            return this;
        }
        normalize()
        {
            // Note: will lead to a divide by zero if the plane is invalid. 
            var inverseNormalLength = 1.0 / this.normal.length();
            this.normal.multiplyScalar(inverseNormalLength);
            this.constant *= inverseNormalLength;
            return this;
        }

        negate()
        {
            this.constant *= - 1;
            this.normal.negate();
            return this;
        }

        distanceToPoint(point: Vector3)
        {
            return this.normal.dot(point) + this.constant;
        }

        distanceToSphere(sphere: Sphere)
        {
            return this.distanceToPoint(sphere.center) - sphere.radius;
        }

        projectPoint(point: Vector3, optionalTarget?: Vector3)
        {
            return this.orthoPoint(point, optionalTarget).sub(point).negate();
        }

        orthoPoint(point: Vector3, optionalTarget?: Vector3)
        {
            var perpendicularMagnitude = this.distanceToPoint(point);
            var result = optionalTarget || new Vector3();
            return result.copy(this.normal).multiplyScalar(perpendicularMagnitude);
        }

        intersectLine(line: Line3, optionalTarget?: Vector3): Vector3
        {
            var v1 = new Vector3(); 

            var func = Plane.prototype.intersectLine = function (line: Line3, optionalTarget?: Vector3)
            {
                var result = optionalTarget || new Vector3();
                var direction = line.delta(v1);
                var denominator = this.normal.dot(direction);

                if (denominator === 0)
                {
                    // line is coplanar, return origin
                    if (this.distanceToPoint(line.start) === 0)
                    {
                        return result.copy(line.start);
                    }
                    // Unsure if this is the correct method to handle this case.
                    return undefined;
                }

                var t = - (line.start.dot(this.normal) + this.constant) / denominator;

                if (t < 0 || t > 1)
                {
                    return undefined;
                }

                result.copy(direction).multiplyScalar(t).add(line.start);  

                return result;
            }
            return func.apply(this, arguments);
        }

        intersectsLine(line: Line3)
        {
            // Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.

            var startSign = this.distanceToPoint(line.start);
            var endSign = this.distanceToPoint(line.end);
            return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);
        }

        intersectsBox(box: Box3)
        {
            return box.intersectsPlane(this);
        }
        intersectsSphere(sphere: Sphere)
        {
            return sphere.intersectsPlane(this);
        }
        coplanarPoint(optionalTarget?: Vector3)
        {
            var result = optionalTarget || new Vector3();
            return result.copy(this.normal).multiplyScalar(- this.constant);
        }
        applyMatrix4(matrix: Matrix4, optionalNormalMatrix?: Matrix3): this
        {
            var v1 = new Vector3;
            var m1 = new Matrix3;

            var func = Plane.prototype.applyMatrix4 = function (matrix: Matrix4, optionalNormalMatrix?: Matrix3)
            {
                var referencePoint = this.coplanarPoint(v1).applyMatrix4(matrix);

                // transform normal based on theory here:
                // http://www.songho.ca/opengl/gl_normaltransform.html
                var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix(matrix);
                var normal = this.normal.applyMatrix3(normalMatrix).normalize();

                // recalculate constant (like in setFromNormalAndCoplanarPoint)
                this.constant = - referencePoint.dot(normal); 
                return this;
            }
            return func.apply(this, arguments);
        }

        translate(offset: Vector3)
        {
            this.constant = this.constant - offset.dot(this.normal);
            return this;
        }

        equals(plane: Plane)
        {
            return plane.normal.equals(this.normal) && (plane.constant === this.constant);
        }
    };
}