/// <reference path="light.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class PointLight extends Light
    {
        shadow: LightShadow;

        constructor(color: number, intensity?: number, distance?: number, decay?: number)
        {
            super(color, intensity);

            this.type = 'PointLight';

            this.distance = (distance !== undefined) ? distance : 0;
            this.decay = (decay !== undefined) ? decay : 1;	// for physically correct lights, should be 2.
            this.shadow = new LightShadow(new PerspectiveCamera(90, 1, 0.5, 500));
        };

        get power()
        {
            // intensity = power per solid angle.
            // ref: equation (15) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
            return this.intensity * 4 * Math.PI;
        }
        set(power)
        {
            // intensity = power per solid angle.
            // ref: equation (15) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
            this.intensity = power / (4 * Math.PI);
        }

        copy(source: PointLight)
        {
            super.copy(source);

            this.distance = source.distance;
            this.decay = source.decay;

            this.shadow = source.shadow.clone();

            return this;
        }
    }
}