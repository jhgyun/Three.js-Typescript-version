/* 
 * @author bhouston / http://clara.io
 * @author WestLangley / http://github.com/WestLangley
 *
 * Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
 *
 * The poles (phi) are at the positive and negative y axis.
 * The equator starts at positive z.
 */

namespace THREE
{
    export class Spherical
    { 
        constructor(public radius = 1, public phi = 0, public theta = 0)
        {
        }
        set(radius: number, phi: number, theta: number)
        {
            this.radius = radius;
            this.phi = phi;
            this.theta = theta;
            return this;
        }

        clone()
        {
            return new Spherical().copy(this);
        }
        copy(other: Spherical)
        {
            this.radius = (other.radius);
            this.phi = (other.phi);
            this.theta = (other.theta);
            return this;
        }

        // restrict phi to be betwee EPS and PI-EPS
        makeSafe()
        {
            var EPS = 0.000001;
            this.phi = Math.max(EPS, Math.min(Math.PI - EPS, this.phi));
            return this;
        }
        setFromVector3(vec3: Vector3)
        {
            this.radius = vec3.length();
            if (this.radius === 0)
            {
                this.theta = 0;
                this.phi = 0; 
            }
            else
            {
                this.theta = Math.atan2(vec3.x, vec3.z); // equator angle around y-up axis
                this.phi = Math.acos(Math.clamp(vec3.y / this.radius, - 1, 1)); // polar angle
            }
            return this;
        }
    };
}