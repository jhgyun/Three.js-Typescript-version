/* 
* @author mrdoob / http://mrdoob.com/
*/

namespace THREE
{
    export interface IWebGLBufferRenderer
    {
        setMode?(value?: number);
        render?(start: number, count: number);
        renderInstances?(geometry: BufferGeometry, start?, count?);
        setIndex?(index: BufferAttribute);
    }

    export class WebGLBufferRenderer implements IWebGLBufferRenderer
    {
        _gl: WebGLRenderingContext;
        extensions: WebGLExtensions;
        _infoRender: InfoRenderer;
        mode: number;

        constructor(_gl, extensions, _infoRender)
        {
            this._gl = _gl;
            this.extensions = extensions;
            this._infoRender = _infoRender; 
        };
        setMode(value)
        { 
            this.mode = value; 
        }
        render(start: number, count: number)
        {
            var _gl = this._gl;
            var _infoRender = this._infoRender;

            _gl.drawArrays(this.mode, start, count);

            _infoRender.calls++;
            _infoRender.vertices += count;
            if (this.mode === _gl.TRIANGLES) _infoRender.faces += count / 3; 
        }
        renderInstances(geometry: BufferGeometry)
        {
            var extensions = this.extensions;
            var mode = this.mode;
            var _infoRender = this._infoRender;
            var _gl = this._gl;

            var extension = extensions.get('ANGLE_instanced_arrays');

            if (extension === null)
            { 
                console.error('THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
                return; 
            }

            var position = geometry.attributes.position;

            var count = 0;

            if (position instanceof InterleavedBufferAttribute)
            { 
                count =(position as InterleavedBufferAttribute).data.count; 
                extension.drawArraysInstancedANGLE(mode, 0, count, geometry.maxInstancedCount); 
            }
            else
            { 
                count = position.count; 
                extension.drawArraysInstancedANGLE(mode, 0, count, geometry.maxInstancedCount); 
            }

            _infoRender.calls++;
            _infoRender.vertices += count * geometry.maxInstancedCount;
            if (mode === _gl.TRIANGLES) _infoRender.faces += geometry.maxInstancedCount * count / 3; 
        }
    }
}
