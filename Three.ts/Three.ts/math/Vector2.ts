/// <reference path="../three.ts" /> 
/*
 * @author mrdoob / http://mrdoob.com/
 * @author philogb / http://blog.thejit.org/
 * @author egraether / http://egraether.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 */
namespace THREE
{
    export class Vector2
    {
        constructor(public x = 0, public y=0)
        {  
        }; 

        get width()
        { 
            return this.x; 
        }
        set width(value: number)
        { 
            this.x = value; 
        } 

        get height()
        { 
            return this.y; 
        } 
        set height(value)
        { 
            this.y = value; 
        } 

        set(x: number, y: number)
        { 
            this.x = x;
            this.y = y; 
            return this; 
        }
        setScalar(scalar: number)
        { 
            this.x = scalar;
            this.y = scalar; 
            return this; 
        }
        setX(x: number)
        { 
            this.x = x; 
            return this; 
        } 
        setY(y)
        { 
            this.y = y; 
            return this; 
        } 

        setComponent(index: number, value: number)
        { 
            switch (index)
            { 
                case 0: this.x = value; break;
                case 1: this.y = value; break;
                default: throw new Error('index is out of range: ' + index); 
            } 
        }
        getComponent(index: number)
        { 
            switch (index)
            { 
                case 0: return this.x;
                case 1: return this.y;
                default: throw new Error('index is out of range: ' + index); 
            } 
        } 
        clone ()
        {
            return new Vector2(this.x, this.y); 
        }
        copy(v: Vector2)
        { 
            this.x = v.x;
            this.y = v.y; 
            return this; 
        }
        add(v: Vector2)
        {  
            this.x += v.x;
            this.y += v.y; 
            return this; 
        }
        addScalar(s: number)
        { 
            this.x += s;
            this.y += s; 
            return this; 
        }
        addVectors (a: Vector2, b: Vector2)
        { 
            this.x = a.x + b.x;
            this.y = a.y + b.y; 
            return this; 
        }
        addScaledVector(v: Vector2, s: number)
        { 
            this.x += v.x * s;
            this.y += v.y * s; 
            return this; 
        }
        sub(v: Vector2)
        {  
            this.x -= v.x;
            this.y -= v.y; 
            return this; 
        }
        subScalar(s: number)
        { 
            this.x -= s;
            this.y -= s; 
            return this; 
        }
        subVectors(a: Vector2, b: Vector2)
        { 
            this.x = a.x - b.x;
            this.y = a.y - b.y; 
            return this; 
        }
        multiply(v: Vector2)
        { 
            this.x *= v.x;
            this.y *= v.y; 
            return this; 
        }
        multiplyScalar(scalar: number)
        { 
            if (isFinite(scalar))
            { 
                this.x *= scalar;
                this.y *= scalar; 
            }
            else
            { 
                this.x = 0;
                this.y = 0; 
            } 
            return this; 
        }
        divide(v: Vector2)
        { 
            this.x /= v.x;
            this.y /= v.y; 
            return this; 
        }
        divideScalar(scalar: number)
        { 
            return this.multiplyScalar(1 / scalar); 
        }
        min(v: Vector2)
        { 
            this.x = Math.min(this.x, v.x);
            this.y = Math.min(this.y, v.y); 
            return this; 
        }
        max(v: Vector2)
        { 
            this.x = Math.max(this.x, v.x);
            this.y = Math.max(this.y, v.y); 
            return this; 
        }
        clamp(min: Vector2, max: Vector2)
        { 
            // This function assumes min < max, if this assumption isn't true it will not operate correctly

            this.x = Math.max(min.x, Math.min(max.x, this.x));
            this.y = Math.max(min.y, Math.min(max.y, this.y)); 
            return this; 
        } 
        clampLength(min: number, max: number)
        { 
            var length = this.length(); 
            return this.multiplyScalar(Math.max(min, Math.min(max, length)) / length); 
        }
        floor ()
        { 
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y); 
            return this; 
        }
        ceil()
        { 
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y); 
            return this; 
        }
        round ()
        { 
            this.x = Math.round(this.x);
            this.y = Math.round(this.y); 
            return this; 
        }
        roundToZero ()
        { 
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y); 
            return this; 
        }
        negate()
        { 
            this.x = - this.x;
            this.y = - this.y; 
            return this; 
        }
        dot (v)
        { 
            return this.x * v.x + this.y * v.y; 
        }
        lengthSq()
        { 
            return this.x * this.x + this.y * this.y; 
        }
        length ()
        { 
            return Math.sqrt(this.x * this.x + this.y * this.y); 
        }
        lengthManhattan ()
        { 
            return Math.abs(this.x) + Math.abs(this.y); 
        }
        normalize ()
        { 
            return this.divideScalar(this.length()); 
        }
        /**
         * computes the angle in radians with respect to the positive x-axis
         */
        angle()
        {  
            var angle = Math.atan2(this.y, this.x); 
            if (angle < 0) angle += 2 * Math.PI; 
            return angle; 
        }
        distanceTo(v: Vector2)
        { 
            return Math.sqrt(this.distanceToSquared(v)); 
        }
        distanceToSquared(v: Vector2)
        { 
            var dx = this.x - v.x, dy = this.y - v.y;
            return dx * dx + dy * dy; 
        }
        distanceToManhattan(v: Vector2)
        { 
            return Math.abs(this.x - v.x) + Math.abs(this.y - v.y); 
        } 
        setLength(length: number)
        { 
            return this.multiplyScalar(length / this.length()); 
        }
        lerp(v: Vector2, alpha: number)
        { 
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha; 
            return this; 
        }
        lerpVectors(v1: Vector2, v2: Vector2, alpha)
        { 
            return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1); 
        }
        equals(v: Vector2)
        { 
            return ((v.x === this.x) && (v.y === this.y)); 
        }
        fromArray(array: ArrayLike<number>, offset = 0)
        {  
            this.x = array[offset];
            this.y = array[offset + 1]; 
            return this; 
        }
        toArray(array: number[] = [], offset = 0)
        {   
            array[offset] = this.x;
            array[offset + 1] = this.y; 
            return array; 
        }
        fromAttribute(attribute: { array: number[], itemSize:number }, index: number, offset = 0)
        {  
            index = index * attribute.itemSize + offset; 
            this.x = attribute.array[index];
            this.y = attribute.array[index + 1]; 
            return this; 
        }
        rotateAround(center: Vector2, angle: number)
        { 
            var c = Math.cos(angle), s = Math.sin(angle);

            var x = this.x - center.x;
            var y = this.y - center.y;

            this.x = x * c - y * s + center.x;
            this.y = x * s + y * c + center.y;

            return this; 
        }
        clampScalar(minVal: number, maxVal: number)
        { 
            this.x = Math.max(minVal, Math.min(maxVal, this.x));
            this.y = Math.max(minVal, Math.min(maxVal, this.y)); 

            return this; 
        } 
    } 
}
 