﻿/* 
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    export class Fog
    {
        name = '';
        color: Color;
        near: number;
        far: number;
        constructor(color: number, near?: number, far?: number)
        {
            this.color = new Color(color);
            this.near = (near !== undefined) ? near : 1;
            this.far = (far !== undefined) ? far : 1000;
        };

        clone()
        {
            return new Fog(this.color.getHex(), this.near, this.far);
        };
    }
}
