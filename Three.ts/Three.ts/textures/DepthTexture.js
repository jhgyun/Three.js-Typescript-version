/// <reference path="texture.ts" />
/*
 * @author Matt DesLauriers / @mattdesl
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var DepthTexture = (function (_super) {
        __extends(DepthTexture, _super);
        function DepthTexture(width, height, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy) {
            _super.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, THREE.DepthFormat, type, anisotropy);
            this.image = { width: width, height: height };
            this.type = type !== undefined ? type : THREE.UnsignedShortType;
            this.magFilter = magFilter !== undefined ? magFilter : THREE.NearestFilter;
            this.minFilter = minFilter !== undefined ? minFilter : THREE.NearestFilter;
            this.flipY = false;
            this.generateMipmaps = false;
        }
        ;
        return DepthTexture;
    }(THREE.Texture));
    THREE.DepthTexture = DepthTexture;
})(THREE || (THREE = {}));
