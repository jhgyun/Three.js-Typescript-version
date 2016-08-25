/// <reference path="light.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class AmbientLight extends Light
    {
        constructor(color?: Color | number | string, intensity?: number)
        {
            super(color, intensity);

            this.type = 'AmbientLight'; 
            this.castShadow = undefined; 
        }; 
    }
}
