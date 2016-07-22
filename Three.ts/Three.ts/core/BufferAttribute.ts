/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export type BufferAttributeArray = Float64Array
        | Float32Array
        | Uint16Array
        | Uint32Array
        | Uint8Array
        | Int8Array
        | Int16Array
        | Int32Array
        | Uint8ClampedArray
        ;
     
    export class BufferAttribute  
    {
        uuid: string;
        array: BufferAttributeArray;
        itemSize: number;
        dynamic = false;
        updateRange = { offset: 0, count: - 1 };
        version = 0;
        normalized: boolean;

        constructor(array: BufferAttributeArray, itemSize: number, normalized?: boolean)
        {
            this.uuid = Math.generateUUID();
            this.array = array;
            this.itemSize = itemSize;

            this.dynamic = false;
            this.updateRange = { offset: 0, count: - 1 };

            this.version = 0;
            this.normalized = normalized === true;
        }  
        get count()
        {
            return this.array.length / this.itemSize;
        }
        set needsUpdate(value: boolean)
        { 
            if (value === true) this.version++; 
        }
        setDynamic(value: boolean)
        { 
            this.dynamic = value; 
            return this; 
        } 
        copy(source: BufferAttribute )
        {
            this.array = new (source.array.constructor as any)(source.array);
            this.itemSize = source.itemSize; 
            this.dynamic = source.dynamic; 
            return this; 
        }
        copyAt(index1: number, attribute: BufferAttribute, index2: number)
        { 
            index1 *= this.itemSize;
            index2 *= attribute.itemSize; 
            for (var i = 0, l = this.itemSize; i < l; i++)
            { 
                this.array[index1 + i] = attribute.array[index2 + i]; 
            } 
            return this; 
        }
        copyArray(array: ArrayLike<number>)
        { 
            this.array.set(array); 
            return this; 
        }
        copyColorsArray(colors: ArrayLike<Color>)
        { 
            var array = this.array, offset = 0;

            for (var i = 0, l = colors.length; i < l; i++)
            { 
                var color = colors[i];  
                array[offset++] = color.r;
                array[offset++] = color.g;
                array[offset++] = color.b; 
            } 
            return this; 
        }
        copyIndicesArray(indices: ArrayLike<{ a: number, b: number, c: number }>)
        {
            var array = this.array, offset = 0;
            for (var i = 0, l = indices.length; i < l; i++)
            {
                var index = indices[i];
                array[offset++] = index.a;
                array[offset++] = index.b;
                array[offset++] = index.c;
            }
            return this;
        }
        copyVector2sArray(vectors: ArrayLike<Vector2>)
        { 
            var array = this.array, offset = 0; 
            for (var i = 0, l = vectors.length; i < l; i++)
            { 
                var vector = vectors[i];  
                array[offset++] = vector.x;
                array[offset++] = vector.y; 
            } 
            return this; 
        }
        copyVector3sArray(vectors: ArrayLike<Vector3>)
        { 
            var array = this.array, offset = 0; 
            for (var i = 0, l = vectors.length; i < l; i++)
            { 
                var vector = vectors[i];  

                array[offset++] = vector.x;
                array[offset++] = vector.y;
                array[offset++] = vector.z; 
            } 
            return this; 
        }
        copyVector4sArray(vectors: ArrayLike<Vector4>)
        { 
            var array = this.array, offset = 0; 
            for (var i = 0, l = vectors.length; i < l; i++)
            { 
                var vector = vectors[i];   
                array[offset++] = vector.x;
                array[offset++] = vector.y;
                array[offset++] = vector.z;
                array[offset++] = vector.w; 
            } 
            return this; 
        }
        set(value: number, offset: number)
        { 
            if (offset === undefined) offset = 0; 
            this.array.set(value, offset); 
            return this; 
        }
        getX(index: number)
        { 
            return this.array[index * this.itemSize]; 
        }
        setX(index: number, x: number)
        { 
            this.array[index * this.itemSize] = x; 
            return this; 
        }
        getY(index: number)
        { 
            return this.array[index * this.itemSize + 1]; 
        }
        setY(index: number, y: number)
        { 
            this.array[index * this.itemSize + 1] = y; 
            return this; 
        }
        getZ(index: number)
        { 
            return this.array[index * this.itemSize + 2]; 
        }
        setZ(index: number, z: number)
        { 
            this.array[index * this.itemSize + 2] = z; 
            return this; 
        }
        getW(index: number)
        { 
            return this.array[index * this.itemSize + 3]; 
        }
        setW(index: number, w: number)
        { 
            this.array[index * this.itemSize + 3] = w; 
            return this; 
        }
        setXY(index: number, x: number, y: number)
        { 
            index *= this.itemSize; 
            this.array[index + 0] = x;
            this.array[index + 1] = y; 
            return this; 
        }
        setXYZ(index: number, x: number, y: number, z: number)
        { 
            index *= this.itemSize; 
            this.array[index + 0] = x;
            this.array[index + 1] = y;
            this.array[index + 2] = z; 
            return this; 
        }
        setXYZW(index: number, x: number, y: number, z: number, w: number)
        { 
            index *= this.itemSize; 
            this.array[index + 0] = x;
            this.array[index + 1] = y;
            this.array[index + 2] = z;
            this.array[index + 3] = w; 
            return this; 
        }
        clone(): this
        {
            return new (this.constructor as any)().copy(this);
        } 
    }; 
    export class Int8Attribute extends BufferAttribute
    {
        constructor(array: ArrayLike<number>, itemSize: number)
        {
            super(new Int8Array(array), itemSize); 
        };
    } 
    export class Uint8Attribut extends BufferAttribute
    {
        constructor(array: ArrayLike<number>, itemSize: number)
        {
            super(new Uint8Array(array), itemSize); 
        };
    }  
    export class Uint8ClampedAttribute extends BufferAttribute
    {
        constructor(array: ArrayLike<number>, itemSize: number)
        {
            super(new Uint8ClampedArray(array), itemSize);
        };
    } 
    export class Int16Attribute extends BufferAttribute
    {
        constructor(array: ArrayLike<number>, itemSize: number)
        {
            super(new Int16Array(array), itemSize);
        };
    }
    export class Uint16Attribute extends BufferAttribute
    {
        constructor(array: ArrayLike<number>, itemSize: number)
        {
            super(new Uint16Array(array), itemSize);
        };
    }
    export class Int32Attribute extends BufferAttribute
    {
        constructor(array: ArrayLike<number>, itemSize: number)
        {
            super(new Int32Array(array), itemSize);
        };
    } 
    export class Uint32Attribute extends BufferAttribute
    {
        constructor(array: ArrayLike<number>, itemSize: number)
        {
            super(new Uint32Array(array), itemSize);
        };
    } 
    export class Float32Attribute extends BufferAttribute
    {
        constructor(array: ArrayLike<number>| number, itemSize: number)
        { 
            if (typeof array === "number")
                super(new Float32Array(array), itemSize);
            else
                super(new Float32Array(array), itemSize);
        };
    }  
    export class Float64Attribute extends BufferAttribute
    {
        constructor(array: ArrayLike<number>, itemSize: number)
        {
            super(new Float64Array(array), itemSize);
        };
    }  
}