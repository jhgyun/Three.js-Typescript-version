var THREE;
(function (THREE) {
    /** Map three.js constants to WebGL constants */
    function paramThreeToGL(renderer, p) {
        var _gl = renderer.context;
        var extensions = renderer.extensions;
        var extension;
        if (p === THREE.RepeatWrapping)
            return _gl.REPEAT;
        if (p === THREE.ClampToEdgeWrapping)
            return _gl.CLAMP_TO_EDGE;
        if (p === THREE.MirroredRepeatWrapping)
            return _gl.MIRRORED_REPEAT;
        if (p === THREE.NearestFilter)
            return _gl.NEAREST;
        if (p === THREE.NearestMipMapNearestFilter)
            return _gl.NEAREST_MIPMAP_NEAREST;
        if (p === THREE.NearestMipMapLinearFilter)
            return _gl.NEAREST_MIPMAP_LINEAR;
        if (p === THREE.LinearFilter)
            return _gl.LINEAR;
        if (p === THREE.LinearMipMapNearestFilter)
            return _gl.LINEAR_MIPMAP_NEAREST;
        if (p === THREE.LinearMipMapLinearFilter)
            return _gl.LINEAR_MIPMAP_LINEAR;
        if (p === THREE.UnsignedByteType)
            return _gl.UNSIGNED_BYTE;
        if (p === THREE.UnsignedShort4444Type)
            return _gl.UNSIGNED_SHORT_4_4_4_4;
        if (p === THREE.UnsignedShort5551Type)
            return _gl.UNSIGNED_SHORT_5_5_5_1;
        if (p === THREE.UnsignedShort565Type)
            return _gl.UNSIGNED_SHORT_5_6_5;
        if (p === THREE.ByteType)
            return _gl.BYTE;
        if (p === THREE.ShortType)
            return _gl.SHORT;
        if (p === THREE.UnsignedShortType)
            return _gl.UNSIGNED_SHORT;
        if (p === THREE.IntType)
            return _gl.INT;
        if (p === THREE.UnsignedIntType)
            return _gl.UNSIGNED_INT;
        if (p === THREE.FloatType)
            return _gl.FLOAT;
        extension = extensions.get('OES_texture_half_float');
        if (extension !== null) {
            if (p === THREE.HalfFloatType)
                return extension.HALF_FLOAT_OES;
        }
        if (p === THREE.AlphaFormat)
            return _gl.ALPHA;
        if (p === THREE.RGBFormat)
            return _gl.RGB;
        if (p === THREE.RGBAFormat)
            return _gl.RGBA;
        if (p === THREE.LuminanceFormat)
            return _gl.LUMINANCE;
        if (p === THREE.LuminanceAlphaFormat)
            return _gl.LUMINANCE_ALPHA;
        if (p === THREE.DepthFormat)
            return _gl.DEPTH_COMPONENT;
        if (p === THREE.AddEquation)
            return _gl.FUNC_ADD;
        if (p === THREE.SubtractEquation)
            return _gl.FUNC_SUBTRACT;
        if (p === THREE.ReverseSubtractEquation)
            return _gl.FUNC_REVERSE_SUBTRACT;
        if (p === THREE.ZeroFactor)
            return _gl.ZERO;
        if (p === THREE.OneFactor)
            return _gl.ONE;
        if (p === THREE.SrcColorFactor)
            return _gl.SRC_COLOR;
        if (p === THREE.OneMinusSrcColorFactor)
            return _gl.ONE_MINUS_SRC_COLOR;
        if (p === THREE.SrcAlphaFactor)
            return _gl.SRC_ALPHA;
        if (p === THREE.OneMinusSrcAlphaFactor)
            return _gl.ONE_MINUS_SRC_ALPHA;
        if (p === THREE.DstAlphaFactor)
            return _gl.DST_ALPHA;
        if (p === THREE.OneMinusDstAlphaFactor)
            return _gl.ONE_MINUS_DST_ALPHA;
        if (p === THREE.DstColorFactor)
            return _gl.DST_COLOR;
        if (p === THREE.OneMinusDstColorFactor)
            return _gl.ONE_MINUS_DST_COLOR;
        if (p === THREE.SrcAlphaSaturateFactor)
            return _gl.SRC_ALPHA_SATURATE;
        extension = extensions.get('WEBGL_compressed_texture_s3tc');
        if (extension !== null) {
            if (p === THREE.RGB_S3TC_DXT1_Format)
                return extension.COMPRESSED_RGB_S3TC_DXT1_EXT;
            if (p === THREE.RGBA_S3TC_DXT1_Format)
                return extension.COMPRESSED_RGBA_S3TC_DXT1_EXT;
            if (p === THREE.RGBA_S3TC_DXT3_Format)
                return extension.COMPRESSED_RGBA_S3TC_DXT3_EXT;
            if (p === THREE.RGBA_S3TC_DXT5_Format)
                return extension.COMPRESSED_RGBA_S3TC_DXT5_EXT;
        }
        extension = extensions.get('WEBGL_compressed_texture_pvrtc');
        if (extension !== null) {
            if (p === THREE.RGB_PVRTC_4BPPV1_Format)
                return extension.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
            if (p === THREE.RGB_PVRTC_2BPPV1_Format)
                return extension.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
            if (p === THREE.RGBA_PVRTC_4BPPV1_Format)
                return extension.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
            if (p === THREE.RGBA_PVRTC_2BPPV1_Format)
                return extension.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
        }
        extension = extensions.get('WEBGL_compressed_texture_etc1');
        if (extension !== null) {
            if (p === THREE.RGB_ETC1_Format)
                return extension.COMPRESSED_RGB_ETC1_WEBGL;
        }
        extension = extensions.get('EXT_blend_minmax');
        if (extension !== null) {
            if (p === THREE.MinEquation)
                return extension.MIN_EXT;
            if (p === THREE.MaxEquation)
                return extension.MAX_EXT;
        }
        return 0;
    }
    THREE.paramThreeToGL = paramThreeToGL;
})(THREE || (THREE = {}));
var THREE;
(function (THREE) {
    function readRenderTargetPixels(renderer, renderTarget, x, y, width, height, buffer) {
        var _gl = renderer.context;
        var properties = renderer.properties;
        var extensions = renderer.extensions;
        if (renderTarget instanceof THREE.WebGLRenderTarget === false) {
            console.error('THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.');
            return;
        }
        var framebuffer = properties.get(renderTarget).__webglFramebuffer;
        if (framebuffer) {
            var restore = false;
            if (framebuffer !== renderer._currentFramebuffer) {
                _gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer);
                restore = true;
            }
            try {
                var texture = renderTarget.texture;
                if (texture.format !== THREE.RGBAFormat
                    && THREE.paramThreeToGL(renderer, texture.format) !== _gl.getParameter(_gl.IMPLEMENTATION_COLOR_READ_FORMAT)) {
                    console.error('THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.');
                    return;
                }
                if (texture.type !== THREE.UnsignedByteType &&
                    THREE.paramThreeToGL(this, texture.type) !== _gl.getParameter(_gl.IMPLEMENTATION_COLOR_READ_TYPE) &&
                    !(texture.type === THREE.FloatType && extensions.get('WEBGL_color_buffer_float')) &&
                    !(texture.type === THREE.HalfFloatType && extensions.get('EXT_color_buffer_half_float'))) {
                    console.error('THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.');
                    return;
                }
                if (_gl.checkFramebufferStatus(_gl.FRAMEBUFFER) === _gl.FRAMEBUFFER_COMPLETE) {
                    // the following if statement ensures valid read requests (no out-of-bounds pixels, see #8604)
                    if ((x >= 0 && x <= (renderTarget.width - width)) && (y >= 0 && y <= (renderTarget.height - height))) {
                        _gl.readPixels(x, y, width, height, THREE.paramThreeToGL(renderer, texture.format), THREE.paramThreeToGL(renderer, texture.type), buffer);
                    }
                }
                else {
                    console.error('THREE.WebGLRenderer.readRenderTargetPixels: readPixels from renderTarget failed. Framebuffer not complete.');
                }
            }
            finally {
                if (restore) {
                    _gl.bindFramebuffer(_gl.FRAMEBUFFER, renderer._currentFramebuffer);
                }
            }
        }
    }
    THREE.readRenderTargetPixels = readRenderTargetPixels;
})(THREE || (THREE = {}));
