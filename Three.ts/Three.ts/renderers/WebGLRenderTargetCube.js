var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var WebGLRenderTargetCube = (function (_super) {
        __extends(WebGLRenderTargetCube, _super);
        function WebGLRenderTargetCube(width, height, options) {
            _super.call(this, width, height, options);
            this.activeCubeFace = 0;
            this.activeMipMapLevel = 0;
        }
        ;
        return WebGLRenderTargetCube;
    }(THREE.WebGLRenderTarget));
    THREE.WebGLRenderTargetCube = WebGLRenderTargetCube;
})(THREE || (THREE = {}));
