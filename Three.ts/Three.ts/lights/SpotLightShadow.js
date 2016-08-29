var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var SpotLightShadow = (function (_super) {
        __extends(SpotLightShadow, _super);
        function SpotLightShadow() {
            _super.call(this, new THREE.PerspectiveCamera(50, 1, 0.5, 500));
        }
        SpotLightShadow.prototype.update = function (light) {
            var fov = THREE.Math.RAD2DEG * 2 * light.angle;
            var aspect = this.mapSize.width / this.mapSize.height;
            var far = light.distance || 500;
            var camera = this.camera;
            if (fov !== camera.fov || aspect !== camera.aspect || far !== camera.far) {
                camera.fov = fov;
                camera.aspect = aspect;
                camera.far = far;
                camera.updateProjectionMatrix();
            }
        };
        return SpotLightShadow;
    }(THREE.LightShadow));
    THREE.SpotLightShadow = SpotLightShadow;
})(THREE || (THREE = {}));
