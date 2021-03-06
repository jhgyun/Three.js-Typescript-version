﻿/// <reference path="../three.ts" />
    /* 
     * @author mrdoob / http://mrdoob.com/
     * @author WestLangley / http://github.com/WestLangley
     * @author bhouston / http://clara.io
     */
namespace THREE
{ 
    export class Euler
    {
        static RotationOrders = ['XYZ', 'YZX', 'ZXY', 'XZY', 'YXZ', 'ZYX'];
        static DefaultOrder = 'XYZ';

        constructor(public _x = 0, public _y = 0, public _z = 0, public _order = Euler.DefaultOrder)
        {
        }

        get x()
        {
            return this._x;
        }
        set x(value)
        {
            this._x = value;
            this.onChangeCallback();
        }

        get y()
        {
            return this._y;
        }
        set y(value)
        {
            this._y = value;
            this.onChangeCallback();
        }

        get z()
        {
            return this._z;
        }
        set z(value)
        {
            this._z = value;
            this.onChangeCallback();
        }

        get order()
        {
            return this._order;
        }
        set order(value)
        {
            this._order = value;
            this.onChangeCallback();
        }

        set(x: number, y: number, z: number, order: string = this._order)
        {
            this._x = x;
            this._y = y;
            this._z = z;
            this._order = order;

            this.onChangeCallback();
            return this;
        }

        clone()
        {
            return new Euler(this._x, this._y, this._z, this._order);
        }
        copy(euler: Euler)
        {
            this._x = euler._x;
            this._y = euler._y;
            this._z = euler._z;
            this._order = euler._order;
            this.onChangeCallback();
            return this;
        }

        setFromRotationMatrix(m: Matrix4, order: string, update?: boolean)
        {
            var clamp = Math.clamp;

            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

            var te = m.elements;
            var m11 = te[0], m12 = te[4], m13 = te[8];
            var m21 = te[1], m22 = te[5], m23 = te[9];
            var m31 = te[2], m32 = te[6], m33 = te[10];

            order = order || this._order;

            if (order === 'XYZ')
            {
                this._y = Math.asin(clamp(m13, - 1, 1));
                if (Math.abs(m13) < 0.99999)
                {
                    this._x = Math.atan2(- m23, m33);
                    this._z = Math.atan2(- m12, m11);

                }
                else
                {
                    this._x = Math.atan2(m32, m22);
                    this._z = 0;
                }

            }
            else if (order === 'YXZ')
            {
                this._x = Math.asin(- clamp(m23, - 1, 1));

                if (Math.abs(m23) < 0.99999)
                {
                    this._y = Math.atan2(m13, m33);
                    this._z = Math.atan2(m21, m22);
                }
                else
                {
                    this._y = Math.atan2(- m31, m11);
                    this._z = 0;
                }

            }
            else if (order === 'ZXY')
            {
                this._x = Math.asin(clamp(m32, - 1, 1));
                if (Math.abs(m32) < 0.99999)
                {
                    this._y = Math.atan2(- m31, m33);
                    this._z = Math.atan2(- m12, m22);

                }
                else
                {
                    this._y = 0;
                    this._z = Math.atan2(m21, m11);
                }

            }
            else if (order === 'ZYX')
            {
                this._y = Math.asin(- clamp(m31, - 1, 1));

                if (Math.abs(m31) < 0.99999)
                {
                    this._x = Math.atan2(m32, m33);
                    this._z = Math.atan2(m21, m11);

                }
                else
                {
                    this._x = 0;
                    this._z = Math.atan2(- m12, m22);
                }

            }
            else if (order === 'YZX')
            {
                this._z = Math.asin(clamp(m21, - 1, 1));
                if (Math.abs(m21) < 0.99999)
                {
                    this._x = Math.atan2(- m23, m22);
                    this._y = Math.atan2(- m31, m11);

                }
                else
                {
                    this._x = 0;
                    this._y = Math.atan2(m13, m33);
                }

            }
            else if (order === 'XZY')
            {
                this._z = Math.asin(- clamp(m12, - 1, 1));

                if (Math.abs(m12) < 0.99999)
                {
                    this._x = Math.atan2(m32, m22);
                    this._y = Math.atan2(m13, m11);

                }
                else
                {
                    this._x = Math.atan2(- m23, m33);
                    this._y = 0;
                }

            }
            else
            {
                console.warn('THREE.Euler: .setFromRotationMatrix() given unsupported order: ' + order);

            }

            this._order = order;

            if (update !== false) this.onChangeCallback();
            return this;
        }

        setFromQuaternion(q: Quaternion, order: string, update?: boolean): this
        {
            var matrix = new Matrix4();  

            var func = Euler.prototype.setFromQuaternion
                = function (q: Quaternion, order: string, update?: boolean)
                {
                    matrix.makeRotationFromQuaternion(q);
                    this.setFromRotationMatrix(matrix, order, update); 
                    return this;
                }
            return func.apply(this, arguments);
        }
        setFromVector3(v: Vector3, order = this._order)
        { 
            return this.set(v.x, v.y, v.z, order); 
        }
        reorder(newOrder: string): this
        {
            var q = new Quaternion();
            var func = Euler.prototype.reorder
                = function (newOrder: string)
                {
                    q.setFromEuler(this);
                    this.setFromQuaternion(q, newOrder);
                    return this;
                }
            return func.apply(this, arguments);
        } 
        equals(euler: Euler)
        { 
            return (euler._x === this._x) && (euler._y === this._y) && (euler._z === this._z) && (euler._order === this._order);
        }
        fromArray(array: any[])
        { 
            this._x = array[0];
            this._y = array[1];
            this._z = array[2];
            if (array[3] !== undefined) this._order = array[3]; 
            this.onChangeCallback(); 
            return this; 
        }
        toArray (array:any[] =[], offset=0)
        { 
            array[offset] = this._x;
            array[offset + 1] = this._y;
            array[offset + 2] = this._z;
            array[offset + 3] = this._order; 
            return array; 
        }
        toVector3(optionalResult?: Vector3)
        { 
            if (optionalResult)
            { 
                return optionalResult.set(this._x, this._y, this._z); 
            }
            else
            { 
                return new Vector3(this._x, this._y, this._z); 
            } 
        }
        onChange(callback, _this: any)
        {
            this.onChangeCallback_this = _this;
            this.onChangeCallback_func = callback; 
            return this; 
        }

        private onChangeCallback_this: any;
        private onChangeCallback_func: () => any;
        onChangeCallback()
        {
            if (this.onChangeCallback_func != null)
                this.onChangeCallback_func.apply(this.onChangeCallback_this, arguments);
        } 
    }  
} 