var THREE;
(function (THREE) {
    var TextureLoader = (function () {
        function TextureLoader(manager) {
            this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
        }
        ;
        TextureLoader.prototype.load = function (url, onLoad, onProgress, onError) {
            var texture = new THREE.Texture();
            var loader = new THREE.ImageLoader(this.manager);
            loader.setCrossOrigin(this.crossOrigin);
            loader.setPath(this.path);
            loader.load(url, function (image) {
                var isJPEG = url.search(/\.(jpg|jpeg)$/) > 0 || url.search(/^data\:image\/jpeg/) === 0;
                texture.format = isJPEG ? THREE.RGBFormat : THREE.RGBAFormat;
                texture.image = image;
                texture.needsUpdate = true;
                if (onLoad !== undefined) {
                    onLoad(texture);
                }
            }, onProgress, onError);
            return texture;
        };
        TextureLoader.prototype.setCrossOrigin = function (value) {
            this.crossOrigin = value;
            return this;
        };
        TextureLoader.prototype.setPath = function (value) {
            this.path = value;
            return this;
        };
        return TextureLoader;
    }());
    THREE.TextureLoader = TextureLoader;
})(THREE || (THREE = {}));
