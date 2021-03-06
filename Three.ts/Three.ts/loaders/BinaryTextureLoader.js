var THREE;
(function (THREE) {
    var BinaryTextureLoader = (function () {
        function BinaryTextureLoader(manager) {
            this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
            this._parser = null;
        }
        ;
        BinaryTextureLoader.prototype.load = function (url, onLoad, onProgress, onError) {
            var scope = this;
            var texture = new THREE.DataTexture();
            var loader = new THREE.XHRLoader(this.manager);
            loader.setResponseType('arraybuffer');
            loader.load(url, function (buffer) {
                var texData = scope._parser(buffer);
                if (!texData)
                    return;
                if (undefined !== texData.image) {
                    texture.image = texData.image;
                }
                else if (undefined !== texData.data) {
                    texture.image.width = texData.width;
                    texture.image.height = texData.height;
                    texture.image.data = texData.data;
                }
                texture.wrapS = undefined !== texData.wrapS ? texData.wrapS : THREE.ClampToEdgeWrapping;
                texture.wrapT = undefined !== texData.wrapT ? texData.wrapT : THREE.ClampToEdgeWrapping;
                texture.magFilter = undefined !== texData.magFilter ? texData.magFilter : THREE.LinearFilter;
                texture.minFilter = undefined !== texData.minFilter ? texData.minFilter : THREE.LinearMipMapLinearFilter;
                texture.anisotropy = undefined !== texData.anisotropy ? texData.anisotropy : 1;
                if (undefined !== texData.format) {
                    texture.format = texData.format;
                }
                if (undefined !== texData.type) {
                    texture.type = texData.type;
                }
                if (undefined !== texData.mipmaps) {
                    texture.mipmaps = texData.mipmaps;
                }
                if (1 === texData.mipmapCount) {
                    texture.minFilter = THREE.LinearFilter;
                }
                texture.needsUpdate = true;
                if (onLoad)
                    onLoad(texture, texData);
            }, onProgress, onError);
            return texture;
        };
        return BinaryTextureLoader;
    }());
    THREE.BinaryTextureLoader = BinaryTextureLoader;
    THREE.DataTextureLoader = BinaryTextureLoader;
})(THREE || (THREE = {}));
