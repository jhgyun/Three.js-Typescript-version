var THREE;
(function (THREE) {
    var WebGLBufferRenderer = (function () {
        function WebGLBufferRenderer(_gl, extensions, _infoRender) {
            this._gl = _gl;
            this.extensions = extensions;
            this._infoRender = _infoRender;
        }
        ;
        WebGLBufferRenderer.prototype.setMode = function (value) {
            this.mode = value;
        };
        WebGLBufferRenderer.prototype.render = function (start, count) {
            var _gl = this._gl;
            var _infoRender = this._infoRender;
            _gl.drawArrays(this.mode, start, count);
            _infoRender.calls++;
            _infoRender.vertices += count;
            if (this.mode === _gl.TRIANGLES)
                _infoRender.faces += count / 3;
        };
        WebGLBufferRenderer.prototype.renderInstances = function (geometry) {
            var extensions = this.extensions;
            var mode = this.mode;
            var _infoRender = this._infoRender;
            var _gl = this._gl;
            var extension = extensions.get('ANGLE_instanced_arrays');
            if (extension === null) {
                console.error('THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
                return;
            }
            var position = geometry.attributes.position;
            var count = 0;
            if (position instanceof THREE.InterleavedBufferAttribute) {
                count = position.data.count;
                extension.drawArraysInstancedANGLE(mode, 0, count, geometry.maxInstancedCount);
            }
            else {
                count = position.count;
                extension.drawArraysInstancedANGLE(mode, 0, count, geometry.maxInstancedCount);
            }
            _infoRender.calls++;
            _infoRender.vertices += count * geometry.maxInstancedCount;
            if (mode === _gl.TRIANGLES)
                _infoRender.faces += geometry.maxInstancedCount * count / 3;
        };
        return WebGLBufferRenderer;
    }());
    THREE.WebGLBufferRenderer = WebGLBufferRenderer;
})(THREE || (THREE = {}));
