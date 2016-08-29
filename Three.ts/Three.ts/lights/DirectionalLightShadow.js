var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var DirectionalLightShadow = (function (_super) {
        __extends(DirectionalLightShadow, _super);
        function DirectionalLightShadow(light) {
            _super.call(this, new THREE.OrthographicCamera(-5, 5, 5, -5, 0.5, 500));
        }
        return DirectionalLightShadow;
    }(THREE.LightShadow));
    THREE.DirectionalLightShadow = DirectionalLightShadow;
})(THREE || (THREE = {}));
