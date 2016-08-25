/// <reference path="texture.ts" />
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
    var DataTexture = (function (_super) {
        __extends(DataTexture, _super);
        function DataTexture(data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding) {
            _super.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);
            this.image = { data: data, width: width, height: height };
            this.magFilter = magFilter !== undefined ? magFilter : THREE.NearestFilter;
            this.minFilter = minFilter !== undefined ? minFilter : THREE.NearestFilter;
            this.flipY = false;
            this.generateMipmaps = false;
        }
        ;
        return DataTexture;
    }(THREE.Texture));
    THREE.DataTexture = DataTexture;
})(THREE || (THREE = {}));
