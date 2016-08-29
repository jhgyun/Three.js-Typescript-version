var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Light = (function (_super) {
        __extends(Light, _super);
        function Light(color, intensity) {
            _super.call(this);
            this.type = 'Light';
            this.color = new THREE.Color(color);
            this.intensity = intensity !== undefined ? intensity : 1;
            this.receiveShadow = undefined;
        }
        ;
        Light.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.color.copy(source.color);
            this.intensity = source.intensity;
            return this;
        };
        Light.prototype.toJSON = function (meta) {
            var data = _super.prototype.toJSON.call(this, meta);
            data.object.color = this.color.getHex();
            data.object.intensity = this.intensity;
            if (this.groundColor !== undefined)
                data.object.groundColor = this.groundColor.getHex();
            if (this.distance !== undefined)
                data.object.distance = this.distance;
            if (this.angle !== undefined)
                data.object.angle = this.angle;
            if (this.decay !== undefined)
                data.object.decay = this.decay;
            if (this.penumbra !== undefined)
                data.object.penumbra = this.penumbra;
            return data;
        };
        return Light;
    }(THREE.Object3D));
    THREE.Light = Light;
})(THREE || (THREE = {}));
