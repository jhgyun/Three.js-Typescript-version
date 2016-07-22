namespace THREE
{
    /** Map three.js constants to WebGL constants */
    export function paramThreeToGL(renderer: WebGLRenderer, p: number)
    {
        var _gl = renderer.context;
        var extensions = renderer.extensions;

        var extension;

        if (p === RepeatWrapping) return _gl.REPEAT;
        if (p === ClampToEdgeWrapping) return _gl.CLAMP_TO_EDGE;
        if (p === MirroredRepeatWrapping) return _gl.MIRRORED_REPEAT;

        if (p === NearestFilter) return _gl.NEAREST;
        if (p === NearestMipMapNearestFilter) return _gl.NEAREST_MIPMAP_NEAREST;
        if (p === NearestMipMapLinearFilter) return _gl.NEAREST_MIPMAP_LINEAR;

        if (p === LinearFilter) return _gl.LINEAR;
        if (p === LinearMipMapNearestFilter) return _gl.LINEAR_MIPMAP_NEAREST;
        if (p === LinearMipMapLinearFilter) return _gl.LINEAR_MIPMAP_LINEAR;

        if (p === UnsignedByteType) return _gl.UNSIGNED_BYTE;
        if (p === UnsignedShort4444Type) return _gl.UNSIGNED_SHORT_4_4_4_4;
        if (p === UnsignedShort5551Type) return _gl.UNSIGNED_SHORT_5_5_5_1;
        if (p === UnsignedShort565Type) return _gl.UNSIGNED_SHORT_5_6_5;

        if (p === ByteType) return _gl.BYTE;
        if (p === ShortType) return _gl.SHORT;
        if (p === UnsignedShortType) return _gl.UNSIGNED_SHORT;
        if (p === IntType) return _gl.INT;
        if (p === UnsignedIntType) return _gl.UNSIGNED_INT;
        if (p === FloatType) return _gl.FLOAT;

        extension = extensions.get('OES_texture_half_float');

        if (extension !== null)
        {
            if (p === HalfFloatType) return extension.HALF_FLOAT_OES;
        }

        if (p === AlphaFormat) return _gl.ALPHA;
        if (p === RGBFormat) return _gl.RGB;
        if (p === RGBAFormat) return _gl.RGBA;
        if (p === LuminanceFormat) return _gl.LUMINANCE;
        if (p === LuminanceAlphaFormat) return _gl.LUMINANCE_ALPHA;
        if (p === DepthFormat) return _gl.DEPTH_COMPONENT;

        if (p === AddEquation) return _gl.FUNC_ADD;
        if (p === SubtractEquation) return _gl.FUNC_SUBTRACT;
        if (p === ReverseSubtractEquation) return _gl.FUNC_REVERSE_SUBTRACT;

        if (p === ZeroFactor) return _gl.ZERO;
        if (p === OneFactor) return _gl.ONE;
        if (p === SrcColorFactor) return _gl.SRC_COLOR;
        if (p === OneMinusSrcColorFactor) return _gl.ONE_MINUS_SRC_COLOR;
        if (p === SrcAlphaFactor) return _gl.SRC_ALPHA;
        if (p === OneMinusSrcAlphaFactor) return _gl.ONE_MINUS_SRC_ALPHA;
        if (p === DstAlphaFactor) return _gl.DST_ALPHA;
        if (p === OneMinusDstAlphaFactor) return _gl.ONE_MINUS_DST_ALPHA;

        if (p === DstColorFactor) return _gl.DST_COLOR;
        if (p === OneMinusDstColorFactor) return _gl.ONE_MINUS_DST_COLOR;
        if (p === SrcAlphaSaturateFactor) return _gl.SRC_ALPHA_SATURATE;

        extension = extensions.get('WEBGL_compressed_texture_s3tc');

        if (extension !== null)
        {
            if (p === RGB_S3TC_DXT1_Format) return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
            if (p === RGBA_S3TC_DXT1_Format) return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
            if (p === RGBA_S3TC_DXT3_Format) return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
            if (p === RGBA_S3TC_DXT5_Format) return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        }

        extension = extensions.get('WEBGL_compressed_texture_pvrtc');

        if (extension !== null)
        {
            if (p === RGB_PVRTC_4BPPV1_Format) return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
            if (p === RGB_PVRTC_2BPPV1_Format) return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
            if (p === RGBA_PVRTC_4BPPV1_Format) return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
            if (p === RGBA_PVRTC_2BPPV1_Format) return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        }

        extension = extensions.get('WEBGL_compressed_texture_etc1');

        if (extension !== null)
        {
            if (p === RGB_ETC1_Format) return extension.COMPRESSED_RGB_ETC1_WEBGL;

        }

        extension = extensions.get('EXT_blend_minmax');

        if (extension !== null)
        {
            if (p === MinEquation) return extension.MIN_EXT;
            if (p === MaxEquation) return extension.MAX_EXT;
        }
        return 0;
    }
}

namespace THREE
{
    export function readRenderTargetPixels(
        renderer: WebGLRenderer,
        renderTarget: WebGLRenderTarget,
        x: number, y: number, width: number, height: number,
        buffer: ArrayBufferView)
    {
        var _gl = renderer.context;
        var properties = renderer.properties;
        var extensions = renderer.extensions;

        if (renderTarget instanceof WebGLRenderTarget === false)
        {
            console.error('THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.');
            return;
        }

        var framebuffer = properties.get(renderTarget).__webglFramebuffer;

        if (framebuffer)
        {
            var restore = false;
            if (framebuffer !== renderer._currentFramebuffer)
            {
                _gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer);
                restore = true;
            }

            try
            {
                var texture = renderTarget.texture;

                if (texture.format !== RGBAFormat
                    && paramThreeToGL(renderer, texture.format) !== _gl.getParameter(_gl.IMPLEMENTATION_COLOR_READ_FORMAT))
                {
                    console.error('THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.');
                    return;
                }

                if (texture.type !== UnsignedByteType &&
                    paramThreeToGL(this, texture.type) !== _gl.getParameter(_gl.IMPLEMENTATION_COLOR_READ_TYPE) &&
                    !(texture.type === FloatType && extensions.get('WEBGL_color_buffer_float')) &&
                    !(texture.type === HalfFloatType && extensions.get('EXT_color_buffer_half_float')))
                {
                    console.error('THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.');
                    return;
                }

                if (_gl.checkFramebufferStatus(_gl.FRAMEBUFFER) === _gl.FRAMEBUFFER_COMPLETE)
                {
                    // the following if statement ensures valid read requests (no out-of-bounds pixels, see #8604)

                    if ((x >= 0 && x <= (renderTarget.width - width)) && (y >= 0 && y <= (renderTarget.height - height)))
                    {

                        _gl.readPixels(x, y, width, height,
                            paramThreeToGL(renderer, texture.format),
                            paramThreeToGL(renderer, texture.type), buffer);
                    }
                }
                else
                {
                    console.error('THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.');
                }

            }
            finally
            {
                if (restore)
                {
                    _gl.bindFramebuffer(_gl.FRAMEBUFFER, renderer._currentFramebuffer);
                }
            }
        }
    }
}