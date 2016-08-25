/*
 * @author mrdoob / http://mrdoob.com/
 */
var THREE;
(function (THREE) {
    var ImageLoader = (function () {
        function ImageLoader(manager) {
            this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
        }
        ;
        ImageLoader.prototype.load = function (url, onLoad, onProgress, onError) {
            var scope = this;
            var image = document.createElementNS('http://www.w3.org/1999/xhtml', 'img');
            image.onload = function () {
                URL.revokeObjectURL(image.src);
                if (onLoad)
                    onLoad(image);
                scope.manager.itemEnd(url);
            };
            if (url.indexOf('data:') === 0) {
                image.src = url;
            }
            else {
                var loader = new THREE.XHRLoader();
                loader.setPath(this.path);
                loader.setResponseType('blob');
                loader.load(url, function (blob) {
                    image.src = URL.createObjectURL(blob);
                }, onProgress, onError);
            }
            scope.manager.itemStart(url);
            return image;
        };
        ImageLoader.prototype.setCrossOrigin = function (value) {
            this.crossOrigin = value;
            return this;
        };
        ImageLoader.prototype.setPath = function (value) {
            this.path = value;
            return this;
        };
        return ImageLoader;
    }());
    THREE.ImageLoader = ImageLoader;
})(THREE || (THREE = {}));
