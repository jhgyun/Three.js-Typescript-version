/* 
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *	uvOffset: new THREE.Vector2(),
 *	uvScale: new THREE.Vector2()
 * }
 */

namespace THREE
{
    export interface SpriteMaterialParams
    { 
        color?: number; // <hex>,
        opacity?: number; // <float>,
        map?: Texture; // new THREE.Texture(<Image> ),

        uvOffset?: Vector2; // new THREE.Vector2(),
        uvScale?: Vector2; // new THREE.Vector2()
    }

    export class SpriteMaterial extends Material
    {
        rotation = 0;
        constructor(parameters?: SpriteMaterialParams)
        {
            super();
            this.type = 'SpriteMaterial';

            this.color = new Color(0xffffff);
            this.map = null;
            this.fog = false;
            this.lights = false; 
            this.setValues(parameters); 
        };
         
        copy(source)
        { 
            super.copy(source);

            this.color.copy(source.color);
            this.map = source.map;

            this.rotation = source.rotation;

            return this; 
        };
    }
}