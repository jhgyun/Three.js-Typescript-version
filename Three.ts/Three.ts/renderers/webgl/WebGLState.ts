/* 
* @author mrdoob / http://mrdoob.com/
*/

namespace THREE
{
    export class WebGLState
    {
        buffers: {
            color: WebGLColorBuffer,
            depth: WebGLDepthBuffer,
            stencil: WebGLStencilBuffer
        }; 
         
        private gl: WebGLRenderingContext;
        private newAttributes: Uint8Array;
        private maxVertexAttributes: number;
        private enabledAttributes: Uint8Array;
        private attributeDivisors: Uint8Array;
        private capabilities: { [index: number]: boolean };
        private compressedTextureFormats: any;
        private currentBlending: any;
        private currentBlendEquation: any;
        private currentBlendSrc: any;
        private currentBlendDst: any;
        private currentBlendEquationAlpha: any;
        private currentBlendSrcAlpha: any;
        private currentBlendDstAlpha: any;
        private currentPremultipledAlpha: any;
        private currentFlipSided: boolean;
        private currentCullFace: number;
        private currentLineWidth: number;
        private currentPolygonOffsetFactor: any;
        private currentPolygonOffsetUnits: any;
        private currentScissorTest: any;
        private maxTextures: number;
        private currentTextureSlot: number;
        private currentBoundTextures: { [index: number]: { type: number, texture: WebGLTexture } };
        private currentScissor: Vector4;
        private currentViewport: Vector4;
        private emptyTextures: any;
        private extensions: any; 
        private renderer: WebGLRenderer;

        constructor(renderer: WebGLRenderer)
        { 
            var _this = this;
            var gl = this.gl = renderer.context;
            var extensions = this.extensions = renderer.extensions;
            this.renderer = renderer;  

            this.buffers = {
                color: new WebGLColorBuffer(gl, this),
                depth: new WebGLDepthBuffer(gl, this),
                stencil: new WebGLStencilBuffer(gl, this)
            };

            this.maxVertexAttributes = gl.getParameter(gl.MAX_VERTEX_ATTRIBS);
            this.newAttributes = new Uint8Array(this.maxVertexAttributes);
            this.enabledAttributes = new Uint8Array(this.maxVertexAttributes);
            this.attributeDivisors = new Uint8Array(this.maxVertexAttributes);

            this.capabilities = {};

            this.compressedTextureFormats = null;

            this.currentBlending = null;
            this.currentBlendEquation = null;
            this.currentBlendSrc = null;
            this.currentBlendDst = null;
            this.currentBlendEquationAlpha = null;
            this.currentBlendSrcAlpha = null;
            this.currentBlendDstAlpha = null;
            this.currentPremultipledAlpha = false;

            this.currentFlipSided = null;
            this.currentCullFace = null;

            this.currentLineWidth = null;

            this.currentPolygonOffsetFactor = null;
            this.currentPolygonOffsetUnits = null;

            this.currentScissorTest = null;

            this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

            this.currentTextureSlot = null;
            this.currentBoundTextures = {};

            this.currentScissor = new Vector4();
            this.currentViewport = new Vector4();

            this.emptyTextures = {};
            this.emptyTextures[gl.TEXTURE_2D] = this.createTexture(gl.TEXTURE_2D, gl.TEXTURE_2D, 1);
            this.emptyTextures[gl.TEXTURE_CUBE_MAP] = this.createTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6);
        };

        private createTexture(type: number, target: number, count: number)
        {
            var gl = this.gl;
            var data = new Uint8Array(4); // 4 is required to match default unpack alignment of 4.
            var texture = gl.createTexture();

            gl.bindTexture(type, texture);
            gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

            for (var i = 0; i < count; i++)
            {
                gl.texImage2D(target + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
            }
            return texture;
        }
        enableAttribute(attribute)
        {
            this.newAttributes[attribute] = 1;

            if (this.enabledAttributes[attribute] === 0)
            {
                this.gl.enableVertexAttribArray(attribute);
                this.enabledAttributes[attribute] = 1;
            }
            if (this.attributeDivisors[attribute] !== 0)
            {
                var extension = this.extensions.get('ANGLE_instanced_arrays');
                extension.vertexAttribDivisorANGLE(attribute, 0);
                this.attributeDivisors[attribute] = 0;
            }

        }
        enableAttributeAndDivisor(attribute, meshPerAttribute, extension)
        {
            this.newAttributes[attribute] = 1;
            if (this.enabledAttributes[attribute] === 0)
            {
                this.gl.enableVertexAttribArray(attribute);
                this.enabledAttributes[attribute] = 1;
            }

            if (this.attributeDivisors[attribute] !== meshPerAttribute)
            {
                extension.vertexAttribDivisorANGLE(attribute, meshPerAttribute);
                this.attributeDivisors[attribute] = meshPerAttribute;
            }
        }
        disableUnusedAttributes()
        {
            for (var i = 0, l = this.enabledAttributes.length; i !== l; ++i)
            {
                if (this.enabledAttributes[i] !== this.newAttributes[i])
                {
                    this.gl.disableVertexAttribArray(i);
                    this.enabledAttributes[i] = 0;
                }
            }
        }
        enable(id: number)
        {
            if (this.capabilities[id] !== true)
            {
                this.gl.enable(id);
                this.capabilities[id] = true;
            }
        }
        disable(id: number)
        {
            if (this.capabilities[id] !== false)
            {
                this.gl.disable(id);
                this.capabilities[id] = false;
            }
        }
        getCompressedTextureFormats()
        {
            if (this.compressedTextureFormats === null)
            {
                this.compressedTextureFormats = []; 
                if (this.extensions.get('WEBGL_compressed_texture_pvrtc') ||
                    this.extensions.get('WEBGL_compressed_texture_s3tc') ||
                    this.extensions.get('WEBGL_compressed_texture_etc1'))
                {
                    var formats = this.gl.getParameter(this.gl.COMPRESSED_TEXTURE_FORMATS);
                    for (var i = 0; i < formats.length; i++)
                    {
                        this.compressedTextureFormats.push(formats[i]);
                    }
                }
            }

            return this.compressedTextureFormats; 
        }
        setBlending(blending?: number,
            blendEquation?: number,
            blendSrc?: number,
            blendDst?: number,
            blendEquationAlpha?: number,
            blendSrcAlpha?: number,
            blendDstAlpha?: number,
            premultipliedAlpha?: number)
        {
            var gl = this.gl;

            if (blending !== NoBlending)
            {
                this.enable(gl.BLEND);
            }
            else
            {
                this.disable(gl.BLEND);
                this.currentBlending = blending; // no blending, that is
                return;
            }

            if (blending !== this.currentBlending || premultipliedAlpha !== this.currentPremultipledAlpha)
            {
                if (blending === AdditiveBlending)
                {
                    if (premultipliedAlpha)
                    {
                        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);

                    }
                    else
                    {
                        gl.blendEquation(gl.FUNC_ADD);
                        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                    }

                }
                else if (blending === SubtractiveBlending)
                {
                    if (premultipliedAlpha)
                    {
                        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFuncSeparate(gl.ZERO, gl.ZERO, gl.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_SRC_ALPHA);

                    }
                    else
                    {
                        gl.blendEquation(gl.FUNC_ADD);
                        gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR);
                    }

                }
                else if (blending === MultiplyBlending)
                {
                    if (premultipliedAlpha)
                    {
                        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFuncSeparate(gl.ZERO, gl.SRC_COLOR, gl.ZERO, gl.SRC_ALPHA);
                    }
                    else
                    {
                        gl.blendEquation(gl.FUNC_ADD);
                        gl.blendFunc(gl.ZERO, gl.SRC_COLOR);
                    }

                }
                else
                {
                    if (premultipliedAlpha)
                    {
                        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

                    }
                    else
                    {
                        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    }
                }

                this.currentBlending = blending;
                this.currentPremultipledAlpha = premultipliedAlpha; 
            }

            if (blending === CustomBlending)
            {
                blendEquationAlpha = blendEquationAlpha || blendEquation;
                blendSrcAlpha = blendSrcAlpha || blendSrc;
                blendDstAlpha = blendDstAlpha || blendDst;

                if (blendEquation !== this.currentBlendEquation || blendEquationAlpha !== this.currentBlendEquationAlpha)
                {
                    gl.blendEquationSeparate(paramThreeToGL(this.renderer, blendEquation), paramThreeToGL(this.renderer, blendEquationAlpha));

                    this.currentBlendEquation = blendEquation;
                    this.currentBlendEquationAlpha = blendEquationAlpha;
                }

                if (blendSrc !== this.currentBlendSrc
                    || blendDst !== this.currentBlendDst
                    || blendSrcAlpha !== this.currentBlendSrcAlpha
                    || blendDstAlpha !== this.currentBlendDstAlpha)
                {
                    gl.blendFuncSeparate(
                        paramThreeToGL(this.renderer, blendSrc),
                        paramThreeToGL(this.renderer, blendDst),
                        paramThreeToGL(this.renderer, blendSrcAlpha),
                        paramThreeToGL(this.renderer, blendDstAlpha));

                    this.currentBlendSrc = blendSrc;
                    this.currentBlendDst = blendDst;
                    this.currentBlendSrcAlpha = blendSrcAlpha;
                    this.currentBlendDstAlpha = blendDstAlpha;
                } 
            }
            else
            {
                this.currentBlendEquation = null;
                this.currentBlendSrc = null;
                this.currentBlendDst = null;
                this.currentBlendEquationAlpha = null;
                this.currentBlendSrcAlpha = null;
                this.currentBlendDstAlpha = null;
            } 
        }
        setColorWrite(colorWrite: boolean)
        {
            this.buffers.color.setMask(colorWrite);
        }
        setDepthTest(depthTest: boolean)
        {
            this.buffers.depth.setTest(depthTest);
        }
        setDepthWrite(depthWrite: boolean)
        {
            this.buffers.depth.setMask(depthWrite);
        }
        setDepthFunc(depthFunc: number)
        { 
            this.buffers.depth.setFunc(depthFunc); 
        }
        setStencilTest(stencilTest: boolean)
        {
            this.buffers.stencil.setTest(stencilTest);
        }
        setStencilWrite(stencilWrite: number)
        {
            this.buffers.stencil.setMask(stencilWrite);
        }
        setStencilFunc(stencilFunc: number, stencilRef: number, stencilMask: number)
        { 
            this.buffers.stencil.setFunc(stencilFunc, stencilRef, stencilMask); 
        }
        setStencilOp(stencilFail: number, stencilZFail: number, stencilZPass: number)
        {
            this.buffers.stencil.setOp(stencilFail, stencilZFail, stencilZPass);
        }
        setFlipSided(flipSided: boolean)
        { 
            if (this.currentFlipSided !== flipSided)
            { 
                if (flipSided)
                { 
                    this.gl.frontFace(this.gl.CW); 
                }
                else
                { 
                    this.gl.frontFace(this.gl.CCW); 
                }

                this.currentFlipSided = flipSided; 
            } 
        }
        setCullFace(cullFace: number)
        {
            var gl = this.gl;
            if (cullFace !== CullFaceNone)
            { 
                this.enable(gl.CULL_FACE); 
                if (cullFace !== this.currentCullFace)
                { 
                    if (cullFace === CullFaceBack)
                    { 
                        gl.cullFace(gl.BACK); 
                    }
                    else if (cullFace === CullFaceFront)
                    { 
                        gl.cullFace(gl.FRONT); 
                    }
                    else
                    { 
                        gl.cullFace(gl.FRONT_AND_BACK); 
                    } 
                } 
            }
            else
            { 
                this.disable(gl.CULL_FACE); 
            } 
            this.currentCullFace = cullFace; 
        } 
        setLineWidth(width: number)
        { 
            if (width !== this.currentLineWidth)
            { 
                this.gl.lineWidth(width); 
                this.currentLineWidth = width; 
            } 
        }
        setPolygonOffset(polygonOffset: boolean, factor, units)
        {
            var gl = this.gl;
            if (polygonOffset)
            {
                this.enable(gl.POLYGON_OFFSET_FILL); 
                if (this.currentPolygonOffsetFactor !== factor || this.currentPolygonOffsetUnits !== units)
                { 
                    gl.polygonOffset(factor, units); 
                    this.currentPolygonOffsetFactor = factor;
                    this.currentPolygonOffsetUnits = units; 
                } 
            }
            else
            { 
                this.disable(gl.POLYGON_OFFSET_FILL); 
            } 
        }
        getScissorTest()
        { 
            return this.currentScissorTest; 
        }
        setScissorTest(scissorTest: boolean)
        {
            var gl = this.gl;
            this.currentScissorTest = scissorTest;

            if (scissorTest)
            { 
                this.enable(gl.SCISSOR_TEST); 
            }
            else
            { 
                this.disable(gl.SCISSOR_TEST); 
            } 
        }
        activeTexture(webglSlot?: number)
        {
            var gl = this.gl;
            if (webglSlot === undefined) webglSlot = gl.TEXTURE0 + this.maxTextures - 1;

            if (this.currentTextureSlot !== webglSlot)
            { 
                gl.activeTexture(webglSlot);
                this.currentTextureSlot = webglSlot; 
            } 
        };
        bindTexture(webglType: number, webglTexture: WebGLTexture)
        {
            if (this.currentTextureSlot === null)
            {
                this.activeTexture();
            }

            var boundTexture = this.currentBoundTextures[this.currentTextureSlot];

            if (boundTexture === undefined)
            {
                boundTexture = { type: undefined, texture: undefined };
                this.currentBoundTextures[this.currentTextureSlot] = boundTexture;
            }

            if (boundTexture.type !== webglType || boundTexture.texture !== webglTexture)
            {
                this.gl.bindTexture(webglType, webglTexture || this.emptyTextures[webglType]);

                boundTexture.type = webglType;
                boundTexture.texture = webglTexture;
            }
        };
        compressedTexImage2D(...args)
        { 
            try
            { 
                this.gl.compressedTexImage2D.apply(this.gl, arguments);

            } catch (error)
            { 
                console.error(error); 
            } 
        };
        texImage2D(...args)
        { 
            try
            { 
                this.gl.texImage2D.apply(this.gl, arguments); 
            }
            catch (error)
            { 
                console.error(error); 
            } 
        };
        clearColor(r: number, g: number, b: number, a: number)
        { 
            this.buffers.color.setClear(r, g, b, a); 
        };
        clearDepth(depth: number)
        {
            this.buffers.depth.setClear(depth); 
        };
        clearStencil(stencil: number)
        { 
            this.buffers.stencil.setClear(stencil); 
        };
        scissor(scissor: Vector4)
        { 
            if (this.currentScissor.equals(scissor) === false)
            { 
                this.gl.scissor(scissor.x, scissor.y, scissor.z, scissor.w);
                this.currentScissor.copy(scissor); 
            } 
        };

        viewport(viewport: Vector4)
        { 
            if (this.currentViewport.equals(viewport) === false)
            { 
                this.gl.viewport(viewport.x, viewport.y, viewport.z, viewport.w);
                this.currentViewport.copy(viewport); 
            } 
        };

        init()
        {
            this.clearColor(0, 0, 0, 1);
            this.clearDepth(1);
            this.clearStencil(0);

            this.enable(this.gl.DEPTH_TEST);
            this.setDepthFunc(LessEqualDepth);

            this.setFlipSided(false);
            this.setCullFace(CullFaceBack);
            this.enable(this.gl.CULL_FACE);

            this.enable(this.gl.BLEND);
            this.setBlending(NormalBlending);
        };
        initAttributes()
        {
            for (var i = 0, l = this.newAttributes.length; i < l; i++)
            {
                this.newAttributes[i] = 0;
            }
        };
        reset()
        {
            var gl = this.gl;
            for (var i = 0; i < this.enabledAttributes.length; i++)
            {
                if (this.enabledAttributes[i] === 1)
                {
                    gl.disableVertexAttribArray(i);
                    this.enabledAttributes[i] = 0;
                }
            }

            this.capabilities = {};
            this.compressedTextureFormats = null;

            this.currentTextureSlot = null;
            this.currentBoundTextures = {};

            this.currentBlending = null;

            this.currentFlipSided = null;
            this.currentCullFace = null;

            this.buffers.color.reset();
            this.buffers.depth.reset();
            this.buffers.stencil.reset();

        } 
    }

    export class WebGLColorBuffer
    {
        setMask: (colorMask: boolean) => void;
        setLocked: (lock: boolean) => void;
        setClear: (r: number, g: number, b: number, a: number) => void;
        reset: () => void;

        constructor(gl: WebGLRenderingContext, state)
        { 
            var locked = false;

            var color = new Vector4();
            var currentColorMask: boolean = null;
            var currentColorClear = new Vector4();

            this.setMask = function (colorMask)
            { 
                if (currentColorMask !== colorMask && !locked)
                { 
                    gl.colorMask(colorMask, colorMask, colorMask, colorMask);
                    currentColorMask = colorMask; 
                } 
            }; 
            this.setLocked = function (lock)
            { 
                locked = lock; 
            };
            this.setClear = function (r: number, g: number, b: number, a: number)
            { 
                color.set(r, g, b, a); 
                if (currentColorClear.equals(color) === false)
                { 
                    gl.clearColor(r, g, b, a);
                    currentColorClear.copy(color); 
                } 
            }; 
            this.reset = function ()
            { 
                locked = false; 
                currentColorMask = null;
                currentColorClear = new Vector4(); 
            }; 
        } 
    }

    export class WebGLDepthBuffer
    {
        setTest: (depthTest: boolean) => void;
        setMask: (depthMask: boolean) => void;
        setFunc: (depthFunc: number) => void;
        setLocked: (lock: boolean) => void;
        setClear: (depth: number) => void;
        reset: () => void;

        constructor(gl: WebGLRenderingContext, state)
        { 
            var locked = false;

            var currentDepthMask: boolean = null;
            var currentDepthFunc: number = null;
            var currentDepthClear: number = null;

            this.setTest = function (depthTest)
            { 
                if (depthTest)
                { 
                    state.enable(gl.DEPTH_TEST); 
                }
                else
                { 
                    state.disable(gl.DEPTH_TEST); 
                } 
            }; 
            this.setMask = function (depthMask)
            { 
                if (currentDepthMask !== depthMask && !locked)
                { 
                    gl.depthMask(depthMask);
                    currentDepthMask = depthMask; 
                } 
            }; 
            this.setFunc = function (depthFunc)
            { 
                if (currentDepthFunc !== depthFunc)
                { 
                    if (depthFunc)
                    { 
                        switch (depthFunc)
                        { 
                            case NeverDepth: 
                                gl.depthFunc(gl.NEVER);
                                break; 
                            case AlwaysDepth: 
                                gl.depthFunc(gl.ALWAYS);
                                break; 
                            case LessDepth: 
                                gl.depthFunc(gl.LESS);
                                break;  
                            case LessEqualDepth: 
                                gl.depthFunc(gl.LEQUAL);
                                break; 
                            case EqualDepth: 
                                gl.depthFunc(gl.EQUAL);
                                break; 
                            case GreaterEqualDepth: 
                                gl.depthFunc(gl.GEQUAL);
                                break; 
                            case GreaterDepth: 
                                gl.depthFunc(gl.GREATER);
                                break; 
                            case NotEqualDepth: 
                                gl.depthFunc(gl.NOTEQUAL);
                                break; 
                            default: 
                                gl.depthFunc(gl.LEQUAL); 
                        }

                    }
                    else
                    { 
                        gl.depthFunc(gl.LEQUAL); 
                    }

                    currentDepthFunc = depthFunc; 
                }

            }; 
            this.setLocked = function (lock)
            { 
                locked = lock; 
            }; 
            this.setClear = function (depth)
            { 
                if (currentDepthClear !== depth)
                { 
                    gl.clearDepth(depth);
                    currentDepthClear = depth; 
                } 
            }; 
            this.reset = function ()
            { 
                locked = false; 
                currentDepthMask = null;
                currentDepthFunc = null;
                currentDepthClear = null; 
            }; 
        };
    }

    export class WebGLStencilBuffer
    {
        setTest: (stencilTest: boolean) => void;
        setMask: (stencilMask: number) => void;
        setFunc: (stencilFunc: number, stencilRef: number, stencilMask: number) => void;
        setOp: (stencilFail: number, stencilZFail: number, stencilZPass: number) => void;
        setLocked: (lock: boolean) => void;
        setClear: (stencil: number) => void;
        reset: () => void;

        constructor(gl: WebGLRenderingContext, state)
        { 
            var locked = false;
            var currentStencilMask: number = null;
            var currentStencilFunc: number = null;
            var currentStencilRef: number = null;
            var currentStencilFuncMask: number = null;
            var currentStencilFail: number= null;
            var currentStencilZFail: number = null;
            var currentStencilZPass: number= null;
            var currentStencilClear: number = null;

            this.setTest = function (stencilTest)
            { 
                if (stencilTest)
                { 
                    state.enable(gl.STENCIL_TEST); 
                }
                else
                { 
                    state.disable(gl.STENCIL_TEST); 
                } 
            }; 
            this.setMask = function (stencilMask)
            { 
                if (currentStencilMask !== stencilMask && !locked)
                { 
                    gl.stencilMask(stencilMask);
                    currentStencilMask = stencilMask;

                }

            };

            this.setFunc = function (stencilFunc, stencilRef, stencilMask)
            { 
                if (currentStencilFunc !== stencilFunc ||
                    currentStencilRef !== stencilRef ||
                    currentStencilFuncMask !== stencilMask)
                { 
                    gl.stencilFunc(stencilFunc, stencilRef, stencilMask);

                    currentStencilFunc = stencilFunc;
                    currentStencilRef = stencilRef;
                    currentStencilFuncMask = stencilMask; 
                } 
            }; 
            this.setOp = function (stencilFail, stencilZFail, stencilZPass)
            { 
                if (currentStencilFail !== stencilFail ||
                    currentStencilZFail !== stencilZFail ||
                    currentStencilZPass !== stencilZPass)
                { 
                    gl.stencilOp(stencilFail, stencilZFail, stencilZPass);

                    currentStencilFail = stencilFail;
                    currentStencilZFail = stencilZFail;
                    currentStencilZPass = stencilZPass; 
                }

            };

            this.setLocked = function (lock)
            { 
                locked = lock; 
            };

            this.setClear = function (stencil)
            { 
                if (currentStencilClear !== stencil)
                { 
                    gl.clearStencil(stencil);
                    currentStencilClear = stencil; 
                } 
            };

            this.reset = function ()
            { 
                locked = false; 

                currentStencilMask = null;
                currentStencilFunc = null;
                currentStencilRef       = null;
                currentStencilFuncMask  = null;
                currentStencilFail      = null;
                currentStencilZFail     = null;
                currentStencilZPass = null;
                currentStencilClear = null;

            };

        };
    }
}