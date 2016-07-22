/// <reference path="bufferattribute.ts" />
/* 
 * @author benaadams / https://twitter.com/ben_a_adams
 */
namespace THREE
{
    export class InstancedBufferAttribute extends BufferAttribute
    {
        constructor(array, itemSize, public meshPerAttribute = 1)
        {
            super(array, itemSize);
        }
        copy(source: InstancedBufferAttribute)
        {
            super.copy(source);
            this.meshPerAttribute = source.meshPerAttribute;
            return this;
        };
    }
}