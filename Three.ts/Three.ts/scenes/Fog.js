var THREE;
(function (THREE) {
    var Fog = (function () {
        function Fog(color, near, far) {
            this.name = '';
            this.color = new THREE.Color(color);
            this.near = (near !== undefined) ? near : 1;
            this.far = (far !== undefined) ? far : 1000;
        }
        ;
        Fog.prototype.clone = function () {
            return new Fog(this.color.getHex(), this.near, this.far);
        };
        ;
        return Fog;
    }());
    THREE.Fog = Fog;
})(THREE || (THREE = {}));
