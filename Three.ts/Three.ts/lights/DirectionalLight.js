var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var DirectionalLight = (function (_super) {
        __extends(DirectionalLight, _super);
        function DirectionalLight(color, intensity) {
            _super.call(this, color, intensity);
            this.type = 'DirectionalLight';
            this.position.copy(THREE.Object3D.DefaultUp);
            this.updateMatrix();
            this.target = new THREE.Object3D();
            this.shadow = new THREE.DirectionalLightShadow(this);
        }
        ;
        DirectionalLight.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.target = source.target.clone();
            this.shadow = source.shadow.clone();
            return this;
        };
        return DirectionalLight;
    }(THREE.Light));
    THREE.DirectionalLight = DirectionalLight;
})(THREE || (THREE = {}));
