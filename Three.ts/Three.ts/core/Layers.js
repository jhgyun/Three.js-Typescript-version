/*
* @author mrdoob / http://mrdoob.com/
*/
var THREE;
(function (THREE) {
    var Layers = (function () {
        function Layers() {
            this.mask = 1;
        }
        Layers.prototype.set = function (channel) {
            this.mask = 1 << channel;
        };
        Layers.prototype.enable = function (channel) {
            this.mask |= 1 << channel;
        };
        Layers.prototype.toggle = function (channel) {
            this.mask ^= 1 << channel;
        };
        Layers.prototype.disable = function (channel) {
            this.mask &= ~(1 << channel);
        };
        Layers.prototype.test = function (layers) {
            return (this.mask & layers.mask) !== 0;
        };
        return Layers;
    }());
    THREE.Layers = Layers;
})(THREE || (THREE = {}));
