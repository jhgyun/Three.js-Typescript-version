var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var WebGLRenderTarget = (function (_super) {
        __extends(WebGLRenderTarget, _super);
        function WebGLRenderTarget(width, height, options) {
            _super.call(this);
            this.uuid = THREE.Math.generateUUID();
            this.width = width;
            this.height = height;
            this.scissor = new THREE.Vector4(0, 0, width, height);
            this.scissorTest = false;
            this.viewport = new THREE.Vector4(0, 0, width, height);
            options = options || {};
            if (options.minFilter === undefined)
                options.minFilter = THREE.LinearFilter;
            this.texture = new THREE.Texture(undefined, undefined, options.wrapS, options.wrapT, options.magFilter, options.minFilter, options.format, options.type, options.anisotropy, options.encoding);
            this.depthBuffer = options.depthBuffer !== undefined ? options.depthBuffer : true;
            this.stencilBuffer = options.stencilBuffer !== undefined ? options.stencilBuffer : true;
            this.depthTexture = null;
        }
        ;
        WebGLRenderTarget.prototype.setSize = function (width, height) {
            if (this.width !== width || this.height !== height) {
                this.width = width;
                this.height = height;
                this.dispose();
            }
            this.viewport.set(0, 0, width, height);
            this.scissor.set(0, 0, width, height);
        };
        WebGLRenderTarget.prototype.clone = function () {
            return new this.constructor().copy(this);
        };
        WebGLRenderTarget.prototype.copy = function (source) {
            this.width = source.width;
            this.height = source.height;
            this.viewport.copy(source.viewport);
            this.texture = source.texture.clone();
            this.depthBuffer = source.depthBuffer;
            this.stencilBuffer = source.stencilBuffer;
            this.depthTexture = source.depthTexture;
            return this;
        };
        WebGLRenderTarget.prototype.dispose = function () {
            this.dispatchEvent({ type: 'dispose' });
        };
        return WebGLRenderTarget;
    }(THREE.EventDispatcher));
    THREE.WebGLRenderTarget = WebGLRenderTarget;
})(THREE || (THREE = {}));
