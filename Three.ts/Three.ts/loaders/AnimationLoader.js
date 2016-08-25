/*
 * @author bhouston / http://clara.io/
 */
var THREE;
(function (THREE) {
    var AnimationLoader = (function () {
        function AnimationLoader(manager) {
            this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
        }
        ;
        AnimationLoader.prototype.load = function (url, onLoad, onProgress, onError) {
            var scope = this;
            var loader = new THREE.XHRLoader(scope.manager);
            loader.load(url, function (text) {
                onLoad(scope.parse(JSON.parse(text)));
            }, onProgress, onError);
        };
        AnimationLoader.prototype.parse = function (json, onLoad) {
            var animations = [];
            for (var i = 0; i < json.length; i++) {
                var clip = THREE.AnimationClip.parse(json[i]);
                animations.push(clip);
            }
            if (onload !== undefined)
                onLoad(animations);
        };
        return AnimationLoader;
    }());
    THREE.AnimationLoader = AnimationLoader;
})(THREE || (THREE = {}));
