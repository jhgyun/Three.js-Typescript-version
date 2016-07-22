/// <reference path="light.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class AmbientLight extends Light
    {
        constructor(color: number, intensity?: number)
        {
            super(color, intensity);

            this.type = 'AmbientLight'; 
            this.castShadow = undefined; 
        }; 
    }
}
