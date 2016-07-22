/// <reference path="interleavedbuffer.ts" />
/* 
 * @author benaadams / https://twitter.com/ben_a_adams
 */

namespace THREE
{
    export class InstancedInterleavedBuffer extends InterleavedBuffer
    {
        meshPerAttribute: number;

        constructor(array, stride, meshPerAttribute?: number)
        {
            super(array, stride);  
            this.meshPerAttribute = meshPerAttribute || 1; 
        };

      
        copy(source: InstancedInterleavedBuffer)
        { 
            super.copy(source);

            this.meshPerAttribute = source.meshPerAttribute;

            return this;

        };
    }
}
