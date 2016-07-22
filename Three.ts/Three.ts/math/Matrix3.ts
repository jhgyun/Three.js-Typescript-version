﻿/// <reference path="../three.ts" />
/*
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author bhouston / http://clara.io
 * @author tschw
 */
namespace THREE
{
    export interface Buffer
    {
        getX(idx: number): number;
        getY(idx: number): number;
        getZ(idx: number): number;
        setXYZ(x: number, y: number, z: number);
        length: number;
        itemSize: number;
    }
    export class Matrix3
    {
        elements = new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1

        ]);

        set(n11: number, n12: number, n13: number,
            n21: number, n22: number, n23: number,
            n31: number, n32: number, n33: number)
        {
            var te = this.elements;
            te[0] = n11; te[1] = n21; te[2] = n31;
            te[3] = n12; te[4] = n22; te[5] = n32;
            te[6] = n13; te[7] = n23; te[8] = n33;
            return this;
        }

        identity()
        {
            this.set(
                1, 0, 0,
                0, 1, 0,
                0, 0, 1
            );
            return this;
        }
        clone()
        {
            return new Matrix3().fromArray(this.elements);
        }
        copy(m: Matrix3)
        {
            var me = m.elements;
            this.set(
                me[0], me[3], me[6],
                me[1], me[4], me[7],
                me[2], me[5], me[8]
            );
            return this;
        }
        setFromMatrix4(m: Matrix4)
        {
            var me = m.elements;
            this.set(
                me[0], me[4], me[8],
                me[1], me[5], me[9],
                me[2], me[6], me[10]
            );
            return this;
        }
        applyToVector3Array(array: ArrayLike<number>, offset = 0, length = array.length): ArrayLike<number>
        {
            var v1 =  new Vector3() ;

            var func = Matrix3.prototype.applyToVector3Array = function (array: ArrayLike<number>, offset = 0, length = array.length)
            {
                for (var i = 0, j = offset; i < length; i += 3, j += 3)
                {
                    v1.fromArray(array, j);
                    v1.applyMatrix3(this);
                    v1.toArray(array, j);
                }
                return array;
            }

            return func.apply(this, arguments);
        }
        applyToBuffer(buffer: Buffer, offset?: number, length?: number): Buffer
        {
            var v1 =   new Vector3() ;

            var func = Matrix3.prototype.applyToBuffer = function (buffer: Buffer, offset?: number, length?: number)
            {
                if (offset === undefined) offset = 0;
                if (length === undefined) length = buffer.length / buffer.itemSize;

                for (var i = 0, j = offset; i < length; i++ , j++)
                {
                    v1.x = buffer.getX(j);
                    v1.y = buffer.getY(j);
                    v1.z = buffer.getZ(j);

                    v1.applyMatrix3(this);

                    buffer.setXYZ(v1.x, v1.y, v1.z);
                }
                return buffer;
            }

            return func.apply(this, arguments);
        }
        multiplyScalar(s: number)
        {
            var te = this.elements;
            te[0] *= s; te[3] *= s; te[6] *= s;
            te[1] *= s; te[4] *= s; te[7] *= s;
            te[2] *= s; te[5] *= s; te[8] *= s;
            return this;
        }
        determinant()
        {
            var te = this.elements;
            var a = te[0], b = te[1], c = te[2],
                d = te[3], e = te[4], f = te[5],
                g = te[6], h = te[7], i = te[8];
            return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
        }
        getInverse(matrix: Matrix3, throwOnDegenerate = false)
        {
            var me = matrix.elements,
                te = this.elements,

                n11 = me[0], n21 = me[1], n31 = me[2],
                n12 = me[3], n22 = me[4], n32 = me[5],
                n13 = me[6], n23 = me[7], n33 = me[8],

                t11 = n33 * n22 - n32 * n23,
                t12 = n32 * n13 - n33 * n12,
                t13 = n23 * n12 - n22 * n13,

                det = n11 * t11 + n21 * t12 + n31 * t13;

            if (det === 0)
            {
                var msg = "THREE.Matrix3.getInverse(): can't invert matrix, determinant is 0";
                if (throwOnDegenerate || false)
                {
                    throw new Error(msg);
                }
                else
                {
                    console.warn(msg);
                }

                return this.identity();
            }

            var detInv = 1 / det;

            te[0] = t11 * detInv;
            te[1] = (n31 * n23 - n33 * n21) * detInv;
            te[2] = (n32 * n21 - n31 * n22) * detInv;

            te[3] = t12 * detInv;
            te[4] = (n33 * n11 - n31 * n13) * detInv;
            te[5] = (n31 * n12 - n32 * n11) * detInv;

            te[6] = t13 * detInv;
            te[7] = (n21 * n13 - n23 * n11) * detInv;
            te[8] = (n22 * n11 - n21 * n12) * detInv;
            return this;
        }
        transpose()
        {
            var tmp, m = this.elements;
            tmp = m[1]; m[1] = m[3]; m[3] = tmp;
            tmp = m[2]; m[2] = m[6]; m[6] = tmp;
            tmp = m[5]; m[5] = m[7]; m[7] = tmp;
            return this;
        }
        getNormalMatrix(matrix4: Matrix4)
        {
            return this.setFromMatrix4(matrix4).getInverse(this).transpose();
        }
        transposeIntoArray(r: number[] | ArrayBuffer)
        {
            var m = this.elements;
            r[0] = m[0];
            r[1] = m[3];
            r[2] = m[6];
            r[3] = m[1];
            r[4] = m[4];
            r[5] = m[7];
            r[6] = m[2];
            r[7] = m[5];
            r[8] = m[8];
            return this;
        }
        fromArray(array: ArrayLike<number>)
        {
            this.elements.set(array);
            return this;
        }
        toArray(array: ArrayLike<number> = [], offset = 0)
        {
            if (array === undefined) array = [];
            if (offset === undefined) offset = 0;

            var te = this.elements;

            array[offset] = te[0];
            array[offset + 1] = te[1];
            array[offset + 2] = te[2];

            array[offset + 3] = te[3];
            array[offset + 4] = te[4];
            array[offset + 5] = te[5];

            array[offset + 6] = te[6];
            array[offset + 7] = te[7];
            array[offset + 8] = te[8];

            return array;

        }
         
    } 
}
