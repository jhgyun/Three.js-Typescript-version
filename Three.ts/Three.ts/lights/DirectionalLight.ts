/// <reference path="light.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    export class DirectionalLight extends Light
    {
        target: Object3D;
        shadow: DirectionalLightShadow;

        constructor(color?: Color | number | string, intensity?: number)
        {
            super(color, intensity);

            this.type = 'DirectionalLight';
            this.position.copy(THREE.Object3D.DefaultUp);
            this.updateMatrix();

            this.target = new Object3D(); 
            this.shadow = new DirectionalLightShadow(this); 
        };
         
        copy(source: DirectionalLight)
        { 
            super.copy(source); 
            this.target = source.target.clone(); 
            this.shadow = source.shadow.clone(); 
            return this; 
        } 
    }
}
