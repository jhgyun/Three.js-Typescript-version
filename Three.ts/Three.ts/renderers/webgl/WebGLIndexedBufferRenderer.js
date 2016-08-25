/*
* @author mrdoob / http://mrdoob.com/
*/
var THREE;
(function (THREE) {
    var WebGLIndexedBufferRenderer = (function () {
        function WebGLIndexedBufferRenderer(_gl, extensions, _infoRender) {
            this._gl = _gl;
            this.extensions = extensions;
            this._infoRender = _infoRender;
        }
        ;
        WebGLIndexedBufferRenderer.prototype.setMode = function (value) {
            this.mode = value;
        };
        WebGLIndexedBufferRenderer.prototype.setIndex = function (index) {
            var extensions = this.extensions;
            var _gl = this._gl;
            if (index.array instanceof Uint32Array && extensions.get('OES_element_index_uint')) {
                this.type = _gl.UNSIGNED_INT;
                this.size = 4;
            }
            else {
                this.type = _gl.UNSIGNED_SHORT;
                this.size = 2;
            }
        };
        WebGLIndexedBufferRenderer.prototype.render = function (start, count) {
            var mode = this.mode;
            var type = this.type;
            var size = this.size;
            var _gl = this._gl;
            var _infoRender = this._infoRender;
            _gl.drawElements(mode, count, type, start * size);
            _infoRender.calls++;
            _infoRender.vertices += count;
            if (mode === _gl.TRIANGLES)
                _infoRender.faces += count / 3;
        };
        WebGLIndexedBufferRenderer.prototype.renderInstances = function (geometry, start, count) {
            var extensions = this.extensions;
            var _infoRender = this._infoRender;
            var mode = this.mode;
            var type = this.type;
            var size = this.size;
            var _gl = this._gl;
            var extension = extensions.get('ANGLE_instanced_arrays');
            if (extension === null) {
                console.error('THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
                return;
            }
            extension.drawElementsInstancedANGLE(mode, count, type, start * size, geometry.maxInstancedCount);
            _infoRender.calls++;
            _infoRender.vertices += count * geometry.maxInstancedCount;
            if (mode === _gl.TRIANGLES)
                _infoRender.faces += geometry.maxInstancedCount * count / 3;
        };
        return WebGLIndexedBufferRenderer;
    }());
    THREE.WebGLIndexedBufferRenderer = WebGLIndexedBufferRenderer;
})(THREE || (THREE = {}));
