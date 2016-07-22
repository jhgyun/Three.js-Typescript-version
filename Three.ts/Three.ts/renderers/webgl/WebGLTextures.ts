/* 
* @author mrdoob / http://mrdoob.com/
*/

declare var WebGL2RenderingContext; 
namespace THREE
{
    interface ITextureProperties
    {
        __webglInit?: boolean;
        __webglTexture?: WebGLTexture;
        __image__webglTextureCube?: WebGLTexture;
        __version?: number;
    }
    interface IRenderTargetProperties
    {
        __webglDepthbuffer?: WebGLRenderbuffer | WebGLRenderbuffer[];
        __webglFramebuffer?: WebGLFramebuffer | WebGLFramebuffer[];
    }
    export class WebGLTextures
    {
        private _gl: WebGLRenderingContext;
        private extensions: WebGLExtensions;
        private state: WebGLState;
        private properties: WebGLProperties;
        private capabilities: WebGLCapabilities;
        private info: WebGLRendererInfo;
        private _infoMemory;
        private _isWebGL2: boolean;
        private _renderer: WebGLRenderer;

        constructor( renderer: WebGLRenderer)
        {  
            this._renderer = renderer;
            this._gl = renderer.context;
            this.extensions = renderer.extensions;
            this.state = renderer.state;
            this.properties = renderer.properties;
            this.capabilities = renderer.capabilities; 
            this.info = renderer.info;

            this._infoMemory = this.info.memory;
            this._isWebGL2 = (typeof WebGL2RenderingContext !== 'undefined' && this._gl instanceof WebGL2RenderingContext);
        };

        private clampToMaxSize(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, maxSize: number)
        { 
            if (image.width > maxSize || image.height > maxSize)
            { 
                // Warning: Scaling through the canvas will only work with images that use
                // premultiplied alpha.

                var scale = maxSize / Math.max(image.width, image.height); 
                var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas') as HTMLCanvasElement;
                canvas.width = Math.floor(image.width * scale);
                canvas.height = Math.floor(image.height * scale);

                var context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height);

                console.warn('THREE.WebGLRenderer: image is too big (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);

                return canvas; 
            }

            return image; 
        }
        private isPowerOfTwo(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | WebGLRenderTarget)
        { 
            return Math.isPowerOfTwo(image.width) && Math.isPowerOfTwo(image.height); 
        }
        private makePowerOfTwo(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement)
        {
            if (image instanceof HTMLImageElement || image instanceof HTMLCanvasElement)
            {
                var canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas') as HTMLCanvasElement;
                canvas.width = Math.nearestPowerOfTwo(image.width);
                canvas.height = Math.nearestPowerOfTwo(image.height);

                var context = canvas.getContext('2d');
                context.drawImage(image, 0, 0, canvas.width, canvas.height);

                console.warn('THREE.WebGLRenderer: image is not power of two (' + image.width + 'x' + image.height + '). Resized to ' + canvas.width + 'x' + canvas.height, image);

                return canvas;
            }

            return image;

        }
        private textureNeedsPowerOfTwo(texture: Texture)
        { 
            if (texture.wrapS !== ClampToEdgeWrapping || texture.wrapT !== ClampToEdgeWrapping) return true;
            if (texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter) return true;

            return false; 
        }
        private filterFallback(f: number)
        { 
            if (f === NearestFilter || f === NearestMipMapNearestFilter || f === NearestMipMapLinearFilter)
            { 
                return this._gl.NEAREST; 
            } 
            return this._gl.LINEAR; 
        }

        private onTextureDispose(event)
        {
            var texture = event.target;
            texture.removeEventListener('dispose', this.onTextureDispose, this);
            this.deallocateTexture(texture);
            this._infoMemory.textures--;
        } 
        private onRenderTargetDispose(event)
        {
            var renderTarget = event.target;
            renderTarget.removeEventListener('dispose', this.onRenderTargetDispose,this);
            this.deallocateRenderTarget(renderTarget);
            this._infoMemory.textures--;
        }

        private deallocateTexture(texture: Texture)
        {
            var _gl = this._gl;
            var properties = this.properties;

            var textureProperties = properties.get(texture) as ITextureProperties;
            if (texture.image && textureProperties.__image__webglTextureCube)
            {
                // cube texture 
                _gl.deleteTexture(textureProperties.__image__webglTextureCube); 
            }
            else
            {
                // 2D texture 
                if (textureProperties.__webglInit === undefined) return;
                _gl.deleteTexture(textureProperties.__webglTexture);
            }

            // remove all webgl properties
            properties.delete(texture); 
        }
        private deallocateRenderTarget(renderTarget: WebGLRenderTarget)
        {
            var properties = this.properties;
            var _gl = this._gl;
            var renderTargetProperties = properties.get(renderTarget) as IRenderTargetProperties;
            var textureProperties = properties.get(renderTarget.texture) as ITextureProperties;

            if (!renderTarget) return;

            if (textureProperties.__webglTexture !== undefined)
            { 
                _gl.deleteTexture(textureProperties.__webglTexture); 
            }

            if (renderTarget.depthTexture)
            { 
                renderTarget.depthTexture.dispose(); 
            }

            if (renderTarget instanceof WebGLRenderTargetCube)
            {
                for (var i = 0; i < 6; i++)
                {
                    _gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer[i]);
                    if (renderTargetProperties.__webglDepthbuffer) _gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer[i]);
                } 
            }
            else
            {
                _gl.deleteFramebuffer(renderTargetProperties.__webglFramebuffer);
                if (renderTargetProperties.__webglDepthbuffer) _gl.deleteRenderbuffer(renderTargetProperties.__webglDepthbuffer);
            }

            properties.delete(renderTarget.texture);
            properties.delete(renderTarget); 
        }
       
        private setTextureParameters(textureType: number, texture: Texture, isPowerOfTwoImage?: boolean)
        {

            var _gl = this._gl;  
            var extensions = this.extensions;
            var properties = this.properties;

            var extension;

            if (isPowerOfTwoImage)
            { 
                _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_S, paramThreeToGL(this._renderer,texture.wrapS));
                _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_T, paramThreeToGL(this._renderer,texture.wrapT));

                _gl.texParameteri(textureType, _gl.TEXTURE_MAG_FILTER, paramThreeToGL(this._renderer,texture.magFilter));
                _gl.texParameteri(textureType, _gl.TEXTURE_MIN_FILTER, paramThreeToGL(this._renderer,texture.minFilter));

            }
            else
            {
                _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_S, _gl.CLAMP_TO_EDGE);
                _gl.texParameteri(textureType, _gl.TEXTURE_WRAP_T, _gl.CLAMP_TO_EDGE);

                if (texture.wrapS !== ClampToEdgeWrapping || texture.wrapT !== ClampToEdgeWrapping)
                {
                    console.warn('THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping.', texture);
                }

                _gl.texParameteri(textureType, _gl.TEXTURE_MAG_FILTER, this.filterFallback(texture.magFilter));
                _gl.texParameteri(textureType, _gl.TEXTURE_MIN_FILTER, this.filterFallback(texture.minFilter));

                if (texture.minFilter !== NearestFilter && texture.minFilter !== LinearFilter)
                {
                    console.warn('THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.', texture);
                } 
            }

            extension = extensions.get('EXT_texture_filter_anisotropic'); 
            if (extension)
            { 
                if (texture.type === FloatType && extensions.get('OES_texture_float_linear') === null) return;
                if (texture.type === HalfFloatType && extensions.get('OES_texture_half_float_linear') === null) return;

                if (texture.anisotropy > 1 || properties.get(texture).__currentAnisotropy)
                { 
                    _gl.texParameterf(textureType, extension.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(texture.anisotropy, this.capabilities.getMaxAnisotropy()));
                    properties.get(texture).__currentAnisotropy = texture.anisotropy; 
                }

            }

        }
        private uploadTexture(textureProperties: ITextureProperties, texture: Texture, slot: number)
        {
            var _gl = this._gl;
            var _infoMemory = this._infoMemory;
            var state = this.state; 
            var capabilities = this.capabilities; 
            var _isWebGL2 = this._isWebGL2;

            if (textureProperties.__webglInit === undefined)
            { 
                textureProperties.__webglInit = true; 
                texture.addEventListener('dispose', this.onTextureDispose, this); 
                textureProperties.__webglTexture = _gl.createTexture(); 
                _infoMemory.textures++; 
            }

            state.activeTexture(_gl.TEXTURE0 + slot);
            state.bindTexture(_gl.TEXTURE_2D, textureProperties.__webglTexture);

            _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, texture.flipY?1:0);
            _gl.pixelStorei(_gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, texture.premultiplyAlpha?1:0);
            _gl.pixelStorei(_gl.UNPACK_ALIGNMENT, texture.unpackAlignment);

            var image = this.clampToMaxSize(texture.image, capabilities.maxTextureSize);

            if (this.textureNeedsPowerOfTwo(texture) && this.isPowerOfTwo(image) === false)
            {
                image = this.makePowerOfTwo(image);
            }

            var isPowerOfTwoImage = this.isPowerOfTwo(image),
                glFormat = paramThreeToGL(this._renderer,texture.format),
                glType = paramThreeToGL(this._renderer,texture.type);

            this.setTextureParameters(_gl.TEXTURE_2D, texture, isPowerOfTwoImage);

            var mipmap, mipmaps = texture.mipmaps;

            if (texture instanceof DepthTexture)
            { 
                // populate depth texture with dummy data 
                var internalFormat = _gl.DEPTH_COMPONENT;

                if (texture.type === FloatType)
                { 
                    if (!_isWebGL2) throw new Error('Float Depth Texture only supported in WebGL2.0');
                    internalFormat = _gl["DEPTH_COMPONENT32F"]; 
                }
                else if (_isWebGL2)
                { 
                    // WebGL 2.0 requires signed internalformat for glTexImage2D
                    internalFormat = _gl.DEPTH_COMPONENT16; 
                }

                state.texImage2D(_gl.TEXTURE_2D, 0, internalFormat, image.width, image.height, 0, glFormat, glType, null);

            }
            else if (texture instanceof DataTexture)
            { 
                // use manually created mipmaps if available
                // if there are no manual mipmaps
                // set 0 level mipmap and then use GL to generate other mipmap levels

                if (mipmaps.length > 0 && isPowerOfTwoImage)
                {
                    for (var i = 0, il = mipmaps.length; i < il; i++)
                    {
                        mipmap = mipmaps[i];
                        state.texImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);
                    } 
                    texture.generateMipmaps = false; 
                }
                else
                { 
                    state.texImage2D(_gl.TEXTURE_2D, 0, glFormat, image.width, image.height, 0, glFormat, glType, (image as any).data);
                } 
            }
            else if (texture instanceof CompressedTexture)
            { 
                for (var i = 0, il = mipmaps.length; i < il; i++)
                {

                    mipmap = mipmaps[i];

                    if (texture.format !== RGBAFormat && texture.format !== RGBFormat)
                    { 
                        if (state.getCompressedTextureFormats().indexOf(glFormat) > - 1)
                        {
                            state.compressedTexImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, mipmap.data);
                        }
                        else
                        { 
                            console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
                        } 
                    }
                    else
                    { 
                        state.texImage2D(_gl.TEXTURE_2D, i, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);
                    } 
                }

            }
            else
            { 
                // regular Texture (image, video, canvas)

                // use manually created mipmaps if available
                // if there are no manual mipmaps
                // set 0 level mipmap and then use GL to generate other mipmap levels

                if (mipmaps.length > 0 && isPowerOfTwoImage)
                { 
                    for (var i = 0, il = mipmaps.length; i < il; i++)
                    { 
                        mipmap = mipmaps[i];
                        state.texImage2D(_gl.TEXTURE_2D, i, glFormat, glFormat, glType, mipmap); 
                    }

                    texture.generateMipmaps = false; 
                }
                else
                { 
                    state.texImage2D(_gl.TEXTURE_2D, 0, glFormat, glFormat, glType, image); 
                } 
            }

            if (texture.generateMipmaps && isPowerOfTwoImage) _gl.generateMipmap(_gl.TEXTURE_2D);

            textureProperties.__version = texture.version;

            if (texture.onUpdate) texture.onUpdate(texture);

        }
        // Setup storage for target texture and bind it to correct framebuffer
        private setupFrameBufferTexture(
            framebuffer: WebGLFramebuffer,
            renderTarget: WebGLRenderTarget,
            attachment: number,
            textureTarget: number)
        { 
            var glFormat = paramThreeToGL(this._renderer,renderTarget.texture.format);
            var glType = paramThreeToGL(this._renderer, renderTarget.texture.type);
            this.state.texImage2D(textureTarget, 0, glFormat, renderTarget.width, renderTarget.height, 0, glFormat, glType, null);
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, framebuffer);
            this._gl.framebufferTexture2D(this._gl.FRAMEBUFFER, attachment, textureTarget, this.properties.get(renderTarget.texture).__webglTexture, 0);
            this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);

        }

        // Setup storage for internal depth/stencil buffers and bind to correct framebuffer
        private setupRenderBufferStorage(renderbuffer: WebGLRenderbuffer, renderTarget: WebGLRenderTarget)
        {
            var _gl = this._gl;

            _gl.bindRenderbuffer(_gl.RENDERBUFFER, renderbuffer);

            if (renderTarget.depthBuffer && !renderTarget.stencilBuffer)
            { 
                _gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.DEPTH_COMPONENT16, renderTarget.width, renderTarget.height);
                _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer);
            }
            else if (renderTarget.depthBuffer && renderTarget.stencilBuffer)
            { 
                _gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.DEPTH_STENCIL, renderTarget.width, renderTarget.height);
                _gl.framebufferRenderbuffer(_gl.FRAMEBUFFER, _gl.DEPTH_STENCIL_ATTACHMENT, _gl.RENDERBUFFER, renderbuffer);
            }
            else
            { 
                // FIXME: We don't support !depth !stencil
                _gl.renderbufferStorage(_gl.RENDERBUFFER, _gl.RGBA4, renderTarget.width, renderTarget.height);
            }

            _gl.bindRenderbuffer(_gl.RENDERBUFFER, null); 
        }
        // Setup resources for a Depth Texture for a FBO (needs an extension)
        private setupDepthTexture(framebuffer: WebGLFramebuffer, renderTarget: WebGLRenderTarget)
        {
            var _gl = this._gl;
            var properties = this.properties;

            var isCube = (renderTarget instanceof WebGLRenderTargetCube);
            if (isCube) throw new Error('Depth Texture with cube render targets is not supported!');

            _gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer);

            if (!(renderTarget.depthTexture instanceof DepthTexture))
            {
                throw new Error('renderTarget.depthTexture must be an instance of THREE.DepthTexture');
            }

            // upload an empty depth texture with framebuffer size
            if (!properties.get(renderTarget.depthTexture).__webglTexture ||
                renderTarget.depthTexture.image.width !== renderTarget.width ||
                renderTarget.depthTexture.image.height !== renderTarget.height)
            {
                renderTarget.depthTexture.image.width = renderTarget.width;
                renderTarget.depthTexture.image.height = renderTarget.height;
                renderTarget.depthTexture.needsUpdate = true;
            }

            this.setTexture2D(renderTarget.depthTexture, 0);

            var webglDepthTexture = properties.get(renderTarget.depthTexture).__webglTexture;
            _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.DEPTH_ATTACHMENT, _gl.TEXTURE_2D, webglDepthTexture, 0);

        }
        // Setup GL resources for a non-texture depth buffer
        private setupDepthRenderbuffer(renderTarget: WebGLRenderTarget)
        {
            var properties = this.properties; 
            var _gl = this._gl;
            var renderTargetProperties = properties.get(renderTarget) as IRenderTargetProperties;

            var isCube = (renderTarget instanceof WebGLRenderTargetCube);

            if (renderTarget.depthTexture)
            { 
                if (isCube) throw new Error('target.depthTexture not supported in Cube render targets');

                this.setupDepthTexture(renderTargetProperties.__webglFramebuffer, renderTarget);
            }
            else
            { 
                if (isCube)
                { 
                    renderTargetProperties.__webglDepthbuffer = []; 
                    for (var i = 0; i < 6; i++)
                    { 
                        _gl.bindFramebuffer(_gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer[i]);
                        renderTargetProperties.__webglDepthbuffer[i] = _gl.createRenderbuffer();
                        this.setupRenderBufferStorage(renderTargetProperties.__webglDepthbuffer[i], renderTarget);
                    } 
                }
                else
                { 
                    _gl.bindFramebuffer(_gl.FRAMEBUFFER, renderTargetProperties.__webglFramebuffer);
                    renderTargetProperties.__webglDepthbuffer = _gl.createRenderbuffer();
                    this.setupRenderBufferStorage(renderTargetProperties.__webglDepthbuffer, renderTarget); 
                }

            }

            _gl.bindFramebuffer(_gl.FRAMEBUFFER, null); 
        }

        public setTexture2D(texture: Texture, slot: number)
        {
            var textureProperties = this.properties.get(texture);
            var _gl = this._gl;
            if (texture.version > 0 && textureProperties.__version !== texture.version)
            {
                var image = texture.image;
                if (image === undefined)
                {
                    console.warn('THREE.WebGLRenderer: Texture marked for update but image is undefined', texture);
                }
                else if (image.complete === false)
                {
                    console.warn('THREE.WebGLRenderer: Texture marked for update but image is incomplete', texture);
                }
                else
                {
                    this.uploadTexture(textureProperties, texture, slot);
                    return;
                }
            }

            this.state.activeTexture(_gl.TEXTURE0 + slot);
            this.state.bindTexture(_gl.TEXTURE_2D, textureProperties.__webglTexture);

        }
        public setTextureCube(texture: CubeTexture, slot: number)
        {
            var properties = this.properties;
            var _gl = this._gl;
            var state = this.state;

            var textureProperties = properties.get(texture);
            var capabilities = this.capabilities;

            if (texture.image.length === 6)
            {
                if (texture.version > 0 && textureProperties.__version !== texture.version)
                {
                    if (!textureProperties.__image__webglTextureCube)
                    {
                        texture.addEventListener('dispose', this.onTextureDispose, this);
                        textureProperties.__image__webglTextureCube = _gl.createTexture();
                        this._infoMemory.textures++;
                    }

                    state.activeTexture(_gl.TEXTURE0 + slot);
                    state.bindTexture(_gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube);

                    _gl.pixelStorei(_gl.UNPACK_FLIP_Y_WEBGL, texture.flipY ? 1 : 0);

                    var isCompressed = texture instanceof CompressedTexture;
                    var isDataTexture = texture.image[0] instanceof DataTexture;

                    var cubeImage = [];

                    for (var i = 0; i < 6; i++)
                    {
                        if (!isCompressed && !isDataTexture)
                        {
                            cubeImage[i] = this.clampToMaxSize(texture.image[i], capabilities.maxCubemapSize);
                        }
                        else
                        {
                            cubeImage[i] = isDataTexture ? texture.image[i].image : texture.image[i];
                        }

                    }

                    var image = cubeImage[0],
                        isPowerOfTwoImage = this.isPowerOfTwo(image),
                        glFormat = paramThreeToGL(this._renderer, texture.format),
                        glType = paramThreeToGL(this._renderer, texture.type);

                    this.setTextureParameters(_gl.TEXTURE_CUBE_MAP, texture, isPowerOfTwoImage);

                    for (var i = 0; i < 6; i++)
                    {
                        if (!isCompressed)
                        {
                            if (isDataTexture)
                            {
                                state.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, cubeImage[i].width, cubeImage[i].height, 0, glFormat, glType, cubeImage[i].data);
                            }
                            else
                            {
                                state.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, glFormat, glFormat, glType, cubeImage[i]);

                            }
                        }
                        else
                        {
                            var mipmap, mipmaps = cubeImage[i].mipmaps;

                            for (var j = 0, jl = mipmaps.length; j < jl; j++)
                            {
                                mipmap = mipmaps[j];

                                if (texture.format !== RGBAFormat && texture.format !== RGBFormat)
                                {

                                    if (state.getCompressedTextureFormats().indexOf(glFormat) > - 1)
                                    {
                                        state.compressedTexImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, mipmap.data);
                                    }
                                    else
                                    {
                                        console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()");
                                    }
                                }
                                else
                                {
                                    state.texImage2D(_gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, j, glFormat, mipmap.width, mipmap.height, 0, glFormat, glType, mipmap.data);

                                }
                            }
                        }
                    }

                    if (texture.generateMipmaps && isPowerOfTwoImage)
                    {
                        _gl.generateMipmap(_gl.TEXTURE_CUBE_MAP);
                    }

                    textureProperties.__version = texture.version;
                    if (texture.onUpdate) texture.onUpdate(texture);
                }
                else
                {
                    state.activeTexture(_gl.TEXTURE0 + slot);
                    state.bindTexture(_gl.TEXTURE_CUBE_MAP, textureProperties.__image__webglTextureCube);
                }

            }

        }
        public setTextureCubeDynamic(texture: CubeTexture, slot: number)
        {
            var state = this.state;
            var _gl = this._gl;
            var properties = this.properties;

            state.activeTexture(_gl.TEXTURE0 + slot);
            state.bindTexture(_gl.TEXTURE_CUBE_MAP, properties.get(texture).__webglTexture);
        }

        public setupRenderTarget(renderTarget: WebGLRenderTarget)
        {
            var properties = this.properties;
            var renderTargetProperties = properties.get(renderTarget) as IRenderTargetProperties;
            var textureProperties = properties.get(renderTarget.texture) as ITextureProperties;
            var _gl = this._gl;
            var _infoMemory = this._infoMemory; 
            var state = this.state; 
            renderTarget.addEventListener('dispose', this.onRenderTargetDispose, this);

            textureProperties.__webglTexture = _gl.createTexture();

            _infoMemory.textures++;

            var isCube = (renderTarget instanceof WebGLRenderTargetCube);
            var isTargetPowerOfTwo = this.isPowerOfTwo(renderTarget);

            // Setup framebuffer

            if (isCube)
            {
                renderTargetProperties.__webglFramebuffer = [];

                for (var i = 0; i < 6; i++)
                {
                    renderTargetProperties.__webglFramebuffer[i] = _gl.createFramebuffer(); 
                } 
            }
            else
            { 
                renderTargetProperties.__webglFramebuffer = _gl.createFramebuffer(); 
            }

            // Setup color buffer 
            if (isCube)
            { 
                state.bindTexture(_gl.TEXTURE_CUBE_MAP, textureProperties.__webglTexture);
                this.setTextureParameters(_gl.TEXTURE_CUBE_MAP, renderTarget.texture, isTargetPowerOfTwo);

                for (var i = 0; i < 6; i++)
                {
                    this.setupFrameBufferTexture(renderTargetProperties.__webglFramebuffer[i], renderTarget, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + i);
                }

                if (renderTarget.texture.generateMipmaps && isTargetPowerOfTwo) _gl.generateMipmap(_gl.TEXTURE_CUBE_MAP);
                state.bindTexture(_gl.TEXTURE_CUBE_MAP, null);

            }
            else
            { 
                state.bindTexture(_gl.TEXTURE_2D, textureProperties.__webglTexture);
                this.setTextureParameters(_gl.TEXTURE_2D, renderTarget.texture, isTargetPowerOfTwo);
                this.setupFrameBufferTexture(renderTargetProperties.__webglFramebuffer, renderTarget, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_2D);

                if (renderTarget.texture.generateMipmaps && isTargetPowerOfTwo) _gl.generateMipmap(_gl.TEXTURE_2D);
                state.bindTexture(_gl.TEXTURE_2D, null);

            }

            // Setup depth and stencil buffers 
            if (renderTarget.depthBuffer)
            { 
                this.setupDepthRenderbuffer(renderTarget); 
            }

        }
        public updateRenderTargetMipmap(renderTarget: WebGLRenderTarget)
        {
            var _gl = this._gl; 
            var properties = this.properties;
            var state = this.state;
            var texture = renderTarget.texture;

            if (texture.generateMipmaps && this.isPowerOfTwo(renderTarget) &&
                texture.minFilter !== NearestFilter &&
                texture.minFilter !== LinearFilter)
            { 
                var target = renderTarget instanceof WebGLRenderTargetCube ? _gl.TEXTURE_CUBE_MAP : _gl.TEXTURE_2D;
                var webglTexture = (properties.get(texture) as ITextureProperties).__webglTexture;

                state.bindTexture(target, webglTexture);
                _gl.generateMipmap(target);
                state.bindTexture(target, null); 
            } 
        }
    }
}