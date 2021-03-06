var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var CompressedTexture = (function (_super) {
        __extends(CompressedTexture, _super);
        function CompressedTexture(mipmaps, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding) {
            _super.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);
            this.image = { width: width, height: height };
            this.mipmaps = mipmaps;
            this.flipY = false;
            this.generateMipmaps = false;
        }
        ;
        return CompressedTexture;
    }(THREE.Texture));
    THREE.CompressedTexture = CompressedTexture;
})(THREE || (THREE = {}));
