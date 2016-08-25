/*
* @author bhouston / http://clara.io
* @author WestLangley / http://github.com/WestLangley
*
* Ref: https://en.wikipedia.org/wiki/Spherical_coordinate_system
*
* The poles (phi) are at the positive and negative y axis.
* The equator starts at positive z.
*/
var THREE;
(function (THREE) {
    var Spherical = (function () {
        function Spherical(radius, phi, theta) {
            if (radius === void 0) { radius = 1; }
            if (phi === void 0) { phi = 0; }
            if (theta === void 0) { theta = 0; }
            this.radius = radius;
            this.phi = phi;
            this.theta = theta;
        }
        Spherical.prototype.set = function (radius, phi, theta) {
            this.radius = radius;
            this.phi = phi;
            this.theta = theta;
            return this;
        };
        Spherical.prototype.clone = function () {
            return new Spherical().copy(this);
        };
        Spherical.prototype.copy = function (other) {
            this.radius = (other.radius);
            this.phi = (other.phi);
            this.theta = (other.theta);
            return this;
        };
        // restrict phi to be betwee EPS and PI-EPS
        Spherical.prototype.makeSafe = function () {
            var EPS = 0.000001;
            this.phi = THREE.Math.max(EPS, THREE.Math.min(THREE.Math.PI - EPS, this.phi));
            return this;
        };
        Spherical.prototype.setFromVector3 = function (vec3) {
            this.radius = vec3.length();
            if (this.radius === 0) {
                this.theta = 0;
                this.phi = 0;
            }
            else {
                this.theta = THREE.Math.atan2(vec3.x, vec3.z); // equator angle around y-up axis
                this.phi = THREE.Math.acos(THREE.Math.clamp(vec3.y / this.radius, -1, 1)); // polar angle
            }
            return this;
        };
        return Spherical;
    }());
    THREE.Spherical = Spherical;
    ;
})(THREE || (THREE = {}));
