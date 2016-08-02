/// <reference path="../../core/object3d.ts" />
/* 
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    export class ImmediateRenderObject extends Object3D
    {
        hasPositions: boolean;
        hasNormals: boolean;
        hasUvs: boolean;
        hasColors: boolean;
        positionArray: ArrayBufferView;
        normalArray: ArrayBufferView;
        uvArray: ArrayBufferView;
        colorArray: ArrayBufferView;
        count: number;

        render: (renderCallback) => any; 
        constructor(material)
        {
            super(); 
            this.material = material;
            this.render = function (renderCallback) { }; 
        }; 
    }
}
