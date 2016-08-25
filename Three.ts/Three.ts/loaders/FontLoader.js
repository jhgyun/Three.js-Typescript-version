/*
 * @author mrdoob / http://mrdoob.com/
 */
var THREE;
(function (THREE) {
    var FontLoader = (function () {
        function FontLoader(manager) {
            this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
        }
        ;
        FontLoader.prototype.load = function (url, onLoad, onProgress, onError) {
            var scope = this;
            var loader = new THREE.XHRLoader(this.manager);
            loader.load(url, function (text) {
                var json;
                try {
                    json = JSON.parse(text);
                }
                catch (e) {
                    console.warn('THREE.FontLoader: typeface.js support is being deprecated. Use typeface.json instead.');
                    json = JSON.parse(text.substring(65, text.length - 2));
                }
                var font = scope.parse(json);
                if (onLoad)
                    onLoad(font);
            }, onProgress, onError);
        };
        FontLoader.prototype.parse = function (json) {
            return new THREE.Font(json);
        };
        return FontLoader;
    }());
    THREE.FontLoader = FontLoader;
})(THREE || (THREE = {}));
