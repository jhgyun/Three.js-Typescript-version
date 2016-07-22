/// <reference path="../three.ts" /> 
/// <reference path="vector2.ts" />
/* 
 * @author bhouston / http://clara.io
 */
namespace THREE
{ 
    export class Box2
    { 
        constructor(
            public min = new Vector2(+ Infinity, + Infinity),
            public max = new Vector2(- Infinity, - Infinity))
        {
        }

        set(min: Vector2, max: Vector2)
        {
            this.min.copy(min);
            this.max.copy(max);
            return this;
        }
        setFromPoints(points: ArrayLike<Vector2>)
        {
            this.makeEmpty();
            for (var i = 0, il = points.length; i < il; i++)
            {
                this.expandByPoint(points[i]);
            }
            return this;
        }

        static setFromCenterAndSize_v1 = new Vector2();

        setFromCenterAndSize(center: Vector2, size: Vector2): this
        {
            var v1 = Box2.setFromCenterAndSize_v1; 
            var halfSize = v1.copy(size).multiplyScalar(0.5);
            this.min.copy(center).sub(halfSize);
            this.max.copy(center).add(halfSize); 
            return this;
        }

        clone()
        {
            return new Box2().copy(this);
        }

        copy(box: Box2)
        {
            this.min.copy(box.min);
            this.max.copy(box.max);
            return this;
        }
        makeEmpty()
        {
            this.min.x = this.min.y = + Infinity;
            this.max.x = this.max.y = - Infinity;
            return this;
        }
        isEmpty()
        {
            // this is a more robust check for empty than ( volume <= 0 ) because volume can get positive with two negative axes
            return (this.max.x < this.min.x) || (this.max.y < this.min.y);
        }

        center(optionalTarget = new Vector2())
        {
            return optionalTarget.addVectors(this.min, this.max).multiplyScalar(0.5);
        }
        size(optionalTarget = new Vector2())
        {
            var result = optionalTarget;
            return result.subVectors(this.max, this.min);
        }
        expandByPoint(point: Vector2)
        {
            this.min.min(point);
            this.max.max(point);
            return this;
        }
        expandByVector(vector: Vector2)
        {
            this.min.sub(vector);
            this.max.add(vector);
            return this;
        }

        expandByScalar(scalar: number)
        {
            this.min.addScalar(- scalar);
            this.max.addScalar(scalar);
            return this;
        }
        containsPoint(point: Vector2)
        {
            if (point.x < this.min.x || point.x > this.max.x ||
                point.y < this.min.y || point.y > this.max.y)
            {
                return false;
            }

            return true;
        }
        containsBox(box: Box2)
        {
            if ((this.min.x <= box.min.x) && (box.max.x <= this.max.x) &&
                (this.min.y <= box.min.y) && (box.max.y <= this.max.y))
            {
                return true;
            }
            return false;
        }

        getParameter(point: Vector2, optionalTarget = new Vector2())
        {
            // This can potentially have a divide by zero if the box
            // has a size dimension of 0. 
            var result = optionalTarget || new Vector2();

            return result.set(
                (point.x - this.min.x) / (this.max.x - this.min.x),
                (point.y - this.min.y) / (this.max.y - this.min.y)
            );
        }

        intersectsBox(box: Box2)
        {
            // using 6 splitting planes to rule out intersections. 
            if (box.max.x < this.min.x || box.min.x > this.max.x ||
                box.max.y < this.min.y || box.min.y > this.max.y)
            {
                return false;
            }
            return true;
        }
        clampPoint(point: Vector2, optionalTarget?: Vector2)
        {
            var result = optionalTarget || new Vector2();
            return result.copy(point).clamp(this.min, this.max);
        }

        private static distanceToPoint_v1: Vector2;
        distanceToPoint(point: Vector2): this
        {
            var v1 = Box2.distanceToPoint_v1;
            if (v1 === undefined)
                v1 = Box2.distanceToPoint_v1 = new Vector2();

            var func = Box2.prototype.distanceToPoint = function (point: Vector2)
            {
                var clampedPoint = v1.copy(point).clamp(this.min, this.max);
                clampedPoint.sub(point).length();  
                return this;
            }
            return func.apply(this, arguments);
        }

        intersect(box: Box2)
        {
            this.min.max(box.min);
            this.max.min(box.max);
            return this;
        }
        union(box: Box2)
        {
            this.min.min(box.min);
            this.max.max(box.max);
            return this;
        }
        translate(offset: Vector2)
        {
            this.min.add(offset);
            this.max.add(offset);
            return this;
        }
        equals(box: Box2)
        {
            return box.min.equals(this.min) && box.max.equals(this.max);
        }
    };
}