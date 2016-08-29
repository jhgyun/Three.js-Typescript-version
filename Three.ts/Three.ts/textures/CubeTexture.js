var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var CubeTexture = (function (_super) {
        __extends(CubeTexture, _super);
        function CubeTexture(images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) {
            images = images !== undefined ? images : [];
            mapping = mapping !== undefined ? mapping : THREE.CubeReflectionMapping;
            _super.call(this, images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);
            this.flipY = false;
        }
        Object.defineProperty(CubeTexture.prototype, "images", {
            get: function () {
                return this.image;
            },
            set: function (value) {
                this.image = value;
            },
            enumerable: true,
            configurable: true
        });
        return CubeTexture;
    }(THREE.Texture));
    THREE.CubeTexture = CubeTexture;
})(THREE || (THREE = {}));
