/*
* @author mrdoob / http://mrdoob.com/
* @author alteredq / http://alteredqualia.com/
*/
var THREE;
(function (THREE) {
    var FogExp2 = (function () {
        function FogExp2(color, density) {
            this.name = '';
            this.name = '';
            this.color = new THREE.Color(color);
            this.density = (density !== undefined) ? density : 0.00025;
        }
        ;
        FogExp2.prototype.clone = function () {
            return new FogExp2(this.color.getHex(), this.density);
        };
        ;
        return FogExp2;
    }());
    THREE.FogExp2 = FogExp2;
})(THREE || (THREE = {}));
