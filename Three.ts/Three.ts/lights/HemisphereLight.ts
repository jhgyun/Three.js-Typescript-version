/// <reference path="light.ts" />
/* 
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    export class HemisphereLight extends Light
    {
        constructor(skyColor: number, groundColor: number, intensity?: number)
        {
            super(skyColor, intensity);

            this.type = 'HemisphereLight';

            this.castShadow = undefined;

            this.position.set(0, 1, 0);
            this.updateMatrix();

            this.groundColor = new Color(groundColor);

        };
         
        copy(source: HemisphereLight)
        { 
            super.copy(source); 
            this.groundColor.copy(source.groundColor); 
            return this; 
        }
    }
}