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
            this.decay = (decay !== undefined) ? decay : 1;
            this.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(90, 1, 0.5, 500));
        }
        ;
        Object.defineProperty(PointLight.prototype, "power", {
            get: function () {
                return this.intensity * 4 * THREE.Math.PI;
            },
            enumerable: true,
            configurable: true
        });
        PointLight.prototype.set = function (power) {
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
