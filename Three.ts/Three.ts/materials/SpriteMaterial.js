/*
* @author alteredq / http://alteredqualia.com/
*
* parameters = {
*  color: <hex>,
*  opacity: <float>,
*  map: new THREE.Texture( <Image> ),
*
*	uvOffset: new THREE.Vector2(),
*	uvScale: new THREE.Vector2()
* }
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var SpriteMaterial = (function (_super) {
        __extends(SpriteMaterial, _super);
        function SpriteMaterial(parameters) {
            _super.call(this);
            this.rotation = 0;
            this.type = 'SpriteMaterial';
            this.color = new THREE.Color(0xffffff);
            this.map = null;
            this.fog = false;
            this.lights = false;
            this.setValues(parameters);
        }
        ;
        SpriteMaterial.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.color.copy(source.color);
            this.map = source.map;
            this.rotation = source.rotation;
            return this;
        };
        ;
        return SpriteMaterial;
    }(THREE.Material));
    THREE.SpriteMaterial = SpriteMaterial;
})(THREE || (THREE = {}));
