/// <reference path="material.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  size: <float>,
 *  sizeAttenuation: <bool>
 * }
 */

namespace THREE
{
    export interface PointsMaterialParams
    {
        color?: number; // <hex>,
        opacity?: number; // <float>,
        map?: Texture; // new THREE.Texture(<Image> ),

        size?: number; // <float>,
        sizeAttenuation?: boolean; // <bool>
    }
    export class PointsMaterial extends Material
    { 
        constructor(parameters?: PointsMaterialParams)
        {
            super();
            this.type = 'PointsMaterial';
            this.color = new Color(0xffffff);

            this.map = null;
            this.size = 1;
            this.lights = false;
            this.sizeAttenuation = true;
            this.setValues(parameters);
        };
         
        copy(source: PointsMaterial)
        {
            super.copy(source);
            this.color.copy(source.color);
            this.map = source.map;

            this.size = source.size;
            this.sizeAttenuation = source.sizeAttenuation;

            return this;
        };
    }
}