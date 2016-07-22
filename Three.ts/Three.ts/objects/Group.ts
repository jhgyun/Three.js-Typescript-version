/// <reference path="../core/object3d.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class Group extends Object3D
    {
        constructor()
        {
            super(); 
            this.type = 'Group'; 
        };
    }
}
