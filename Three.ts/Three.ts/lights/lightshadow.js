var THREE;
(function (THREE) {
    var LightShadow = (function () {
        function LightShadow(camera) {
            this.camera = camera;
            this.bias = 0;
            this.radius = 1;
            this.mapSize = new THREE.Vector2(512, 512);
            this.map = null;
            this.matrix = new THREE.Matrix4();
        }
        LightShadow.prototype.copy = function (source) {
            this.camera = source.camera.clone();
            this.bias = source.bias;
            this.radius = source.radius;
            this.mapSize.copy(source.mapSize);
            return this;
        };
        LightShadow.prototype.clone = function () {
            return new this.constructor().copy(this);
        };
        return LightShadow;
    }());
    THREE.LightShadow = LightShadow;
})(THREE || (THREE = {}));
