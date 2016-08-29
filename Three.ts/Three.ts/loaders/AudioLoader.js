var THREE;
(function (THREE) {
    var AudioLoader = (function () {
        function AudioLoader(manager) {
            this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
        }
        ;
        AudioLoader.prototype.load = function (url, onLoad, onProgress, onError) {
            var loader = new THREE.XHRLoader(this.manager);
            loader.setResponseType('arraybuffer');
            loader.load(url, function (buffer) {
                var context = THREE.AudioContext;
                context.decodeAudioData(buffer, function (audioBuffer) {
                    onLoad(audioBuffer);
                });
            }, onProgress, onError);
        };
        return AudioLoader;
    }());
    THREE.AudioLoader = AudioLoader;
})(THREE || (THREE = {}));
