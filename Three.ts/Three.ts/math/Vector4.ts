﻿/* 
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

namespace THREE
{
    export class Vector4
    { 
        constructor(public x = 0, public y = 0, public z = 0, public w = 1)
        {
        };
        set(x: number, y: number, z: number, w: number)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            this.w = w;
            return this;
        }
        setScalar(scalar: number)
        {
            this.x = scalar;
            this.y = scalar;
            this.z = scalar;
            this.w = scalar;
            return this;
        }
        setX(x: number)
        {
            this.x = x;
            return this;
        }
        setY(y: number)
        {
            this.y = y;
            return this;
        }
        setZ(z: number)
        {
            this.z = z;
            return this;
        }
        setW(w: number)
        {
            this.w = w;
            return this;
        }
        setComponent(index: number, value: number)
        {
            switch (index)
            {
                case 0: this.x = value; break;
                case 1: this.y = value; break;
                case 2: this.z = value; break;
                case 3: this.w = value; break;
                default: throw new Error('index is out of range: ' + index);
            }
        }
        getComponent(index: number)
        {
            switch (index)
            {
                case 0: return this.x;
                case 1: return this.y;
                case 2: return this.z;
                case 3: return this.w;
                default: throw new Error('index is out of range: ' + index);
            }
        }
        clone()
        {
            return new Vector4(this.x, this.y, this.z, this.w);
        }
        copy(v: Vector4)
        {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            this.w = (v.w !== undefined) ? v.w : 1;
            return this;
        }
        add(v: Vector4)
        {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            this.w += v.w;
            return this;
        }
        addScalar(s: number)
        {
            this.x += s;
            this.y += s;
            this.z += s;
            this.w += s;
            return this;
        }
        addVectors(a: Vector4, b: Vector4)
        {
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z;
            this.w = a.w + b.w;
            return this;
        }
        addScaledVector(v: Vector4, s: number)
        {
            this.x += v.x * s;
            this.y += v.y * s;
            this.z += v.z * s;
            this.w += v.w * s;
            return this;
        }
        sub(v: Vector4)
        {
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z;
            this.w -= v.w;
            return this;
        }
        subScalar(s: number)
        {
            this.x -= s;
            this.y -= s;
            this.z -= s;
            this.w -= s;
            return this;
        }
        subVectors(a: Vector4, b: Vector4)
        {
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z;
            this.w = a.w - b.w;
            return this;
        }
        multiplyScalar(scalar: number)
        {
            if (isFinite(scalar))
            {
                this.x *= scalar;
                this.y *= scalar;
                this.z *= scalar;
                this.w *= scalar;

            }
            else
            {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.w = 0;
            }
            return this;
        } 
        applyMatrix4(m: Matrix4)
        {
            var x = this.x, y = this.y, z = this.z, w = this.w;
            var e = m.elements;
            this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
            this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
            this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
            this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
            return this;
        } 
        divideScalar(scalar: number)
        {
            return this.multiplyScalar(1 / scalar);
        }
        setAxisAngleFromQuaternion(q: Quaternion)
        {
            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm

            // q is assumed to be normalized

            this.w = 2 * Math.acos(q.w);

            var s = Math.sqrt(1 - q.w * q.w);

            if (s < 0.0001)
            {
                this.x = 1;
                this.y = 0;
                this.z = 0;
            }
            else
            {
                this.x = q.x / s;
                this.y = q.y / s;
                this.z = q.z / s;
            }
            return this;
        } 
        setAxisAngleFromRotationMatrix(m: Matrix4)
        {

            // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

            var angle, x, y, z,		// variables for result
                epsilon = 0.01,		// margin to allow for rounding errors
                epsilon2 = 0.1,		// margin to distinguish between 0 and 180 degrees

                te = m.elements,

                m11 = te[0], m12 = te[4], m13 = te[8],
                m21 = te[1], m22 = te[5], m23 = te[9],
                m31 = te[2], m32 = te[6], m33 = te[10];

            if ((Math.abs(m12 - m21) < epsilon) &&
                (Math.abs(m13 - m31) < epsilon) &&
                (Math.abs(m23 - m32) < epsilon))
            {

                // singularity found
                // first check for identity matrix which must have +1 for all terms
                // in leading diagonal and zero in other terms

                if ((Math.abs(m12 + m21) < epsilon2) &&
                    (Math.abs(m13 + m31) < epsilon2) &&
                    (Math.abs(m23 + m32) < epsilon2) &&
                    (Math.abs(m11 + m22 + m33 - 3) < epsilon2))
                {

                    // this singularity is identity matrix so angle = 0

                    this.set(1, 0, 0, 0);

                    return this; // zero angle, arbitrary axis

                }

                // otherwise this singularity is angle = 180

                angle = Math.PI;

                var xx = (m11 + 1) / 2;
                var yy = (m22 + 1) / 2;
                var zz = (m33 + 1) / 2;
                var xy = (m12 + m21) / 4;
                var xz = (m13 + m31) / 4;
                var yz = (m23 + m32) / 4;

                if ((xx > yy) && (xx > zz))
                {
                    // m11 is the largest diagonal term 
                    if (xx < epsilon)
                    {
                        x = 0;
                        y = 0.707106781;
                        z = 0.707106781;

                    }
                    else
                    {
                        x = Math.sqrt(xx);
                        y = xy / x;
                        z = xz / x;
                    }

                }
                else if (yy > zz)
                {
                    // m22 is the largest diagonal term

                    if (yy < epsilon)
                    {
                        x = 0.707106781;
                        y = 0;
                        z = 0.707106781;
                    }
                    else
                    {
                        y = Math.sqrt(yy);
                        x = xy / y;
                        z = yz / y;
                    }

                }
                else
                {
                    // m33 is the largest diagonal term so base result on this 
                    if (zz < epsilon)
                    {
                        x = 0.707106781;
                        y = 0.707106781;
                        z = 0;

                    }
                    else
                    {
                        z = Math.sqrt(zz);
                        x = xz / z;
                        y = yz / z;
                    }
                }

                this.set(x, y, z, angle);
                return this; // return 180 deg rotation 
            }

            // as we have reached here there are no singularities so we can handle normally

            var s = Math.sqrt((m32 - m23) * (m32 - m23) +
                (m13 - m31) * (m13 - m31) +
                (m21 - m12) * (m21 - m12)); // used to normalize

            if (Math.abs(s) < 0.001) s = 1;

            // prevent divide by zero, should not happen if matrix is orthogonal and should be
            // caught by singularity test above, but I've left it in just in case

            this.x = (m32 - m23) / s;
            this.y = (m13 - m31) / s;
            this.z = (m21 - m12) / s;
            this.w = Math.acos((m11 + m22 + m33 - 1) / 2);

            return this;
        } 
        min(v: Vector4)
        {
            this.x = Math.min(this.x, v.x);
            this.y = Math.min(this.y, v.y);
            this.z = Math.min(this.z, v.z);
            this.w = Math.min(this.w, v.w);
            return this;
        } 
        max(v: Vector4)
        {
            this.x = Math.max(this.x, v.x);
            this.y = Math.max(this.y, v.y);
            this.z = Math.max(this.z, v.z);
            this.w = Math.max(this.w, v.w);
            return this;
        }
        clamp(min: Vector4, max: Vector4): this
        {
            // This function assumes min < max, if this assumption isn't true it will not operate correctly

            this.x = Math.max(min.x, Math.min(max.x, this.x));
            this.y = Math.max(min.y, Math.min(max.y, this.y));
            this.z = Math.max(min.z, Math.min(max.z, this.z));
            this.w = Math.max(min.w, Math.min(max.w, this.w));
            return this;
        }
        clampScalar(minVal: number, maxVal: number): this
        {
            var min =   new Vector4() ;
            var max =   new Vector4() ;

            var func = Vector4.prototype.clampScalar = function (minVal: number, maxVal: number)
            {
                min.set(minVal, minVal, minVal, minVal);
                max.set(maxVal, maxVal, maxVal, maxVal);
                return this.clamp(min, max);
            }

            return func.apply(this, arguments);
        }

        floor()
        {
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            this.z = Math.floor(this.z);
            this.w = Math.floor(this.w);
            return this;
        }
        ceil()
        {
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            this.z = Math.ceil(this.z);
            this.w = Math.ceil(this.w);
            return this;
        }
        round()
        {
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            this.z = Math.round(this.z);
            this.w = Math.round(this.w);
            return this;
        }
        roundToZero()
        {
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
            this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
            this.w = (this.w < 0) ? Math.ceil(this.w) : Math.floor(this.w);
            return this;
        }
        negate()
        {
            this.x = - this.x;
            this.y = - this.y;
            this.z = - this.z;
            this.w = - this.w;
            return this;
        }
        dot(v)
        {
            return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
        }
        lengthSq()
        {
            return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
        }
        length()
        {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        }
        lengthManhattan()
        {
            return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
        }
        normalize()
        {
            return this.divideScalar(this.length());
        }
        setLength(length: number)
        {
            return this.multiplyScalar(length / this.length());
        }
        lerp(v: Vector4, alpha: number)
        {
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha;
            this.w += (v.w - this.w) * alpha;
            return this;
        }
        lerpVectors(v1: Vector4, v2: Vector4, alpha: number)
        {
            return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
        }
        equals(v: Vector4)
        {
            return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z) && (v.w === this.w));
        }
        fromArray(array: ArrayLike<number>, offset = 0)
        {
            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2];
            this.w = array[offset + 3];
            return this;
        }

        toArray(array: ArrayLike<number> = [], offset = 0)
        {
            array[offset] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z;
            array[offset + 3] = this.w;
            return array;
        }
        fromAttribute(attribute: { itemSize: number, array: ArrayLike<number> }, index: number, offset = 0)
        {
            if (offset === undefined) offset = 0;
            index = index * attribute.itemSize + offset;

            this.x = attribute.array[index];
            this.y = attribute.array[index + 1];
            this.z = attribute.array[index + 2];
            this.w = attribute.array[index + 3];
            return this;
        }
    }
}