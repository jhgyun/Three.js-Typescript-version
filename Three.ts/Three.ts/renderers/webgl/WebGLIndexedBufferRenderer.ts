/* 
* @author mrdoob / http://mrdoob.com/
*/

namespace THREE
{
    export class WebGLIndexedBufferRenderer implements IWebGLBufferRenderer
    {
        mode: number;
        _gl: WebGLRenderingContext;
        extensions: WebGLExtensions;
        _infoRender: InfoRenderer;
        type: number;
        size: number;

        constructor(_gl: WebGLRenderingContext, extensions: WebGLExtensions, _infoRender: InfoRenderer)
        { 
            this._gl = _gl;
            this.extensions = extensions;
            this._infoRender = _infoRender;

        };
        setMode(value: number)
        {
            this.mode = value;
        }
        setIndex(index: BufferAttribute)
        {
            var extensions = this.extensions;
            var _gl = this._gl;
            if (index.array instanceof Uint32Array && extensions.get('OES_element_index_uint'))
            {
                this.type = _gl.UNSIGNED_INT;
                this.size = 4;
            }
            else
            {
                this.type = _gl.UNSIGNED_SHORT;
                this.size = 2;
            }

        }
        render(start: number, count: number)
        {
            var mode = this.mode;
            var type = this.type;
            var size = this.size;
            var _gl = this._gl;
            var _infoRender = this._infoRender;
            _gl.drawElements(mode, count, type, start * size);

            _infoRender.calls++;
            _infoRender.vertices += count;
            if (mode === _gl.TRIANGLES) _infoRender.faces += count / 3;

        }
        renderInstances(geometry: BufferGeometry, start, count)
        {
            var extensions = this.extensions;
            var _infoRender = this._infoRender;
            var mode = this.mode;
            var type = this.type;
            var size = this.size;
            var _gl = this._gl;
            var extension = extensions.get('ANGLE_instanced_arrays');

            if (extension === null)
            {
                console.error('THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
                return;
            }

            extension.drawElementsInstancedANGLE(mode, count, type, start * size, geometry.maxInstancedCount);

            _infoRender.calls++;
            _infoRender.vertices += count * geometry.maxInstancedCount;
            if (mode === _gl.TRIANGLES) _infoRender.faces += geometry.maxInstancedCount * count / 3;
        }
    }
}
