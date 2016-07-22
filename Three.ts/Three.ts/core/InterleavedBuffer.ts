/* 
 * @author benaadams / https://twitter.com/ben_a_adams
 */

namespace THREE
{
    export class InterleavedBuffer
    {
        uuid = Math.generateUUID();
        dynamic = false;
        updateRange = { offset: 0, count: - 1 };

        version = 0;
        constructor(public array?: any, public stride?: number)
        {
        }; 
        get length()
        { 
            return this.array.length; 
        }  
        get count()
        { 
            return this.array.length / this.stride; 
        }  
        set needsUpdate(value)
        { 
            if (value === true) this.version++; 
        }
        setDynamic(value: boolean)
        { 
            this.dynamic = value; 
            return this; 
        }
        copy(source: InterleavedBuffer)
        { 
            this.array = new (source.array.constructor as any)(source.array);
            this.stride = source.stride;
            this.dynamic = source.dynamic; 
            return this; 
        } 

        copyAt(index1: number, attribute: { stride: number, array: ArrayLike<number> }, index2: number)
        { 
            index1 *= this.stride;
            index2 *= attribute.stride;

            for (var i = 0, l = this.stride; i < l; i++)
            { 
                this.array[index1 + i] = attribute.array[index2 + i]; 
            } 
            return this; 
        }  
        set (value, offset)
        { 
            if (offset === undefined) offset = 0; 
            this.array.set(value, offset); 
            return this; 
        } 
        clone ()
        { 
            return new InterleavedBuffer().copy(this); 
        } 
    };
}