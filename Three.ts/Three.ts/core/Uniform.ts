/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class Uniform
    {
        dynamic: boolean;
        onUpdateCallback: any;

        constructor(public value: any)
        {
        }
        onUpdate(callback)
        { 
            this.dynamic = true;
            this.onUpdateCallback = callback;
            return this;
        }
    };
}