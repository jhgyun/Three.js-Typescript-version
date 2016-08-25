/// <reference path="texture.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var CanvasTexture = (function (_super) {
        __extends(CanvasTexture, _super);
        function CanvasTexture(canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
            _super.call(this, canvas, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);
            this.needsUpdate = true;
        }
        ;
        return CanvasTexture;
    }(THREE.Texture));
    THREE.CanvasTexture = CanvasTexture;
})(THREE || (THREE = {}));
