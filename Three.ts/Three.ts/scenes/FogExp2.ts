/* 
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    export class FogExp2
    {
        name = '';
        color: Color;
        density: number;
        constructor(color: number, density?: number)
        {
            this.name = '';

            this.color = new Color(color);
            this.density = (density !== undefined) ? density : 0.00025; 
        };

        clone()
        {
            return new FogExp2(this.color.getHex(), this.density);
        };
    }
}