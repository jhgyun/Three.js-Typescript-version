/// <reference path="light.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var PointLight = (function (_super) {
        __extends(PointLight, _super);
        function PointLight(color, intensity, distance, decay) {
            _super.call(this, color, intensity);
            this.type = 'PointLight';
            this.distance = (distance !== undefined) ? distance : 0;
            this.decay = (decay !== undefined) ? decay : 1; // for physically correct lights, should be 2.
            this.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(90, 1, 0.5, 500));
        }
        ;
        Object.defineProperty(PointLight.prototype, "power", {
            get: function () {
                // intensity = power per solid angle.
                // ref: equation (15) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
                return this.intensity * 4 * THREE.Math.PI;
            },
            enumerable: true,
            configurable: true
        });
        PointLight.prototype.set = function (power) {
            // intensity = power per solid angle.
            // ref: equation (15) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
            this.intensity = power / (4 * THREE.Math.PI);
        };
        PointLight.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.distance = source.distance;
            this.decay = source.decay;
            this.shadow = source.shadow.clone();
            return this;
        };
        return PointLight;
    }(THREE.Light));
    THREE.PointLight = PointLight;
})(THREE || (THREE = {}));
