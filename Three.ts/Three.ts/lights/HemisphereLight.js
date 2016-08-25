/// <reference path="light.ts" />
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
    var HemisphereLight = (function (_super) {
        __extends(HemisphereLight, _super);
        function HemisphereLight(skyColor, groundColor, intensity) {
            _super.call(this, skyColor, intensity);
            this.type = 'HemisphereLight';
            this.castShadow = undefined;
            this.position.copy(THREE.Object3D.DefaultUp);
            this.updateMatrix();
            this.groundColor = new THREE.Color(groundColor);
        }
        ;
        HemisphereLight.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.groundColor.copy(source.groundColor);
            return this;
        };
        return HemisphereLight;
    }(THREE.Light));
    THREE.HemisphereLight = HemisphereLight;
})(THREE || (THREE = {}));
