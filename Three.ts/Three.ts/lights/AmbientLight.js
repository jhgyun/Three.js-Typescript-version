/// <reference path="light.ts" />
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
    var AmbientLight = (function (_super) {
        __extends(AmbientLight, _super);
        function AmbientLight(color, intensity) {
            _super.call(this, color, intensity);
            this.type = 'AmbientLight';
            this.castShadow = undefined;
        }
        ;
        return AmbientLight;
    }(THREE.Light));
    THREE.AmbientLight = AmbientLight;
})(THREE || (THREE = {}));
