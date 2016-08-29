var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var VideoTexture = (function (_super) {
        __extends(VideoTexture, _super);
        function VideoTexture(video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
            _super.call(this, video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);
            this.generateMipmaps = false;
            var scope = this;
            function update() {
                requestAnimationFrame(update);
                if (video.readyState >= video.HAVE_CURRENT_DATA) {
                    scope.needsUpdate = true;
                }
            }
            update();
        }
        ;
        return VideoTexture;
    }(THREE.Texture));
    THREE.VideoTexture = VideoTexture;
})(THREE || (THREE = {}));
