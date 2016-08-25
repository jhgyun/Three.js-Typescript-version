/// <reference path="light.ts" />
/*
 * @author alteredq / http://alteredqualia.com/
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var SpotLight = (function (_super) {
        __extends(SpotLight, _super);
        function SpotLight(color, intensity, distance, angle, penumbra, decay) {
            _super.call(this, color, intensity);
            this.type = 'SpotLight';
            this.position.copy(THREE.Object3D.DefaultUp);
            this.updateMatrix();
            this.target = new THREE.Object3D();
            this.distance = (distance !== undefined) ? distance : 0;
            this.angle = (angle !== undefined) ? angle : THREE.Math.PI / 3;
            this.penumbra = (penumbra !== undefined) ? penumbra : 0;
            this.decay = (decay !== undefined) ? decay : 1; // for physically correct lights, should be 2.
            this.shadow = new THREE.SpotLightShadow();
        }
        ;
        Object.defineProperty(SpotLight.prototype, "power", {
            get: function () {
                // intensity = power per solid angle.
                // ref: equation (17) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
                return this.intensity * THREE.Math.PI;
            },
            set: function (power) {
                // intensity = power per solid angle.
                // ref: equation (17) from http://www.frostbite.com/wp-content/uploads/2014/11/course_notes_moving_frostbite_to_pbr.pdf
                this.intensity = power / THREE.Math.PI;
            },
            enumerable: true,
            configurable: true
        });
        SpotLight.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.distance = source.distance;
            this.angle = source.angle;
            this.penumbra = source.penumbra;
            this.decay = source.decay;
            this.target = source.target.clone();
            this.shadow = source.shadow.clone();
            return this;
        };
        return SpotLight;
    }(THREE.Light));
    THREE.SpotLight = SpotLight;
})(THREE || (THREE = {}));
