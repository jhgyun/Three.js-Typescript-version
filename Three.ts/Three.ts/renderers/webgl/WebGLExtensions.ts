﻿/* 
* @author mrdoob / http://mrdoob.com/
*/

namespace THREE
{
    export class WebGLExtensions
    {
        private extensions: { [index: string]: any } = {};
        private gl: WebGLRenderingContext;

        constructor(gl: WebGLRenderingContext)
        {
            this.gl = gl;
        };
        get(name: string)
        {
            var extensions = this.extensions;
            var gl = this.gl;

            if (extensions[name] !== undefined)
            { 
                return extensions[name]; 
            }

            var extension;

            switch (name)
            { 
                case 'WEBGL_depth_texture':
                    extension = gl.getExtension('WEBGL_depth_texture') || gl.getExtension('MOZ_WEBGL_depth_texture') || gl.getExtension('WEBKIT_WEBGL_depth_texture');
                    break;

                case 'EXT_texture_filter_anisotropic':
                    extension = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('MOZ_EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
                    break;

                case 'WEBGL_compressed_texture_s3tc':
                    extension = gl.getExtension('WEBGL_compressed_texture_s3tc') || gl.getExtension('MOZ_WEBGL_compressed_texture_s3tc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
                    break;

                case 'WEBGL_compressed_texture_pvrtc':
                    extension = gl.getExtension('WEBGL_compressed_texture_pvrtc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
                    break;

                case 'WEBGL_compressed_texture_etc1':
                    extension = gl.getExtension('WEBGL_compressed_texture_etc1');
                    break;

                default:
                    extension = gl.getExtension(name); 
            }

            if (extension === null)
            { 
                console.warn('THREE.WebGLRenderer: ' + name + ' extension not supported.'); 
            }

            extensions[name] = extension; 
            return extension; 
        };
    }
}