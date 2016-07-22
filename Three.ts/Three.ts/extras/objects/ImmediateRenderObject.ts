/// <reference path="../../core/object3d.ts" />
/* 
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    export class ImmediateRenderObject extends Object3D
    {
        render: (renderCallback) => any; 
        constructor(material)
        {
            super(); 
            this.material = material;
            this.render = function (renderCallback) { }; 
        };
         
    }
}
