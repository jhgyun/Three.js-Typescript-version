/// <reference path="../core/object3d.ts" />
/* 
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */

namespace THREE
{
    export class Bone extends Object3D
    {
        skin: SkinnedMesh;
        constructor(skin?: SkinnedMesh)
        {
            super();
            this.type = 'Bone';
            this.skin = skin;
        }; 

        copy(source: Bone)
        { 
            super.copy(source); 
            this.skin = source.skin; 
            return this; 
        }
    }
}