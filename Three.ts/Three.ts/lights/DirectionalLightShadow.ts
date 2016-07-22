/// <reference path="lightshadow.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class DirectionalLightShadow extends LightShadow
    {
        constructor(light: DirectionalLight)
        {
            super(new OrthographicCamera(- 5, 5, 5, - 5, 0.5, 500));
        }
    }
}