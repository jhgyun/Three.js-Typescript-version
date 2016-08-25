/*
* @author fordacious / fordacious.github.io
*/
var THREE;
(function (THREE) {
    var WebGLProperties = (function () {
        function WebGLProperties() {
            this.properties = {};
        }
        ;
        WebGLProperties.prototype.get = function (object) {
            var uuid = object.uuid;
            var map = this.properties[uuid];
            if (map === undefined) {
                map = {};
                this.properties[uuid] = map;
            }
            return map;
        };
        ;
        WebGLProperties.prototype.delete = function (object) {
            delete this.properties[object.uuid];
        };
        ;
        WebGLProperties.prototype.clear = function () {
            this.properties = {};
        };
        ;
        return WebGLProperties;
    }());
    THREE.WebGLProperties = WebGLProperties;
})(THREE || (THREE = {}));
