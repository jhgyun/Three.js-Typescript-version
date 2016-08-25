/// <reference path="light.ts" />
/* 
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    export class SpotLight extends Light
    {
        target: Object3D;
        shadow: SpotLightShadow;

        constructor(color?: Color | number | string, intensity?: number, distance?: number, angle?: number, penumbra?: number, decay?: number)
        { 
            super(color, intensity);

            this.type = 'SpotLight';

            this.position.copy(THREE.Object3D.DefaultUp);
            this.updateMatrix();

            this.target = new Object3D();
            this.distance = (distance !== undefined) ? distance : 0;
            this.angle = (angle !== undefined) ? angle : Math.PI / 3;
            this.penumbra = (penumbra !== undefined) ? penumbra : 0;
            this.decay = (decay !== undefined) ? decay : 1;	// for physically correct lights, should be 2.

            this.shadow = new SpotLightShadow();

        };
        get power()
        {
            // intensity = power per solid angle.
            // ref: equation (17) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
            return this.intensity * Math.PI;
        }
        set power(power)
        {
            // intensity = power per solid angle.
            // ref: equation (17) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
            this.intensity = power / Math.PI;
        }
        copy(source: SpotLight)
        { 
            super.copy(source); 
            this.distance = source.distance;
            this.angle = source.angle;
            this.penumbra = source.penumbra;
            this.decay = source.decay; 
            this.target = source.target.clone(); 
            this.shadow = source.shadow.clone(); 
            return this; 
        } 
    }
}
