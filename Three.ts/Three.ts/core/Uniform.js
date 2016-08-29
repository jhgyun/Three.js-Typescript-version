var THREE;
(function (THREE) {
    var Uniform = (function () {
        function Uniform(value) {
            this.value = value;
        }
        Uniform.prototype.onUpdate = function (callback) {
            this.dynamic = true;
            this.onUpdateCallback = callback;
            return this;
        };
        return Uniform;
    }());
    THREE.Uniform = Uniform;
    ;
})(THREE || (THREE = {}));
