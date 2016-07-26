/* 
* @author mrdoob / http://mrdoob.com/
*/

namespace THREE
{
    export class WebGLState
    {
        private buffers: {
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

        public enableAttribute(attribute: number)
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
        public enableAttributeAndDivisor(attribute: number, meshPerAttribute: number, extension)
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
        public disableUnusedAttributes()
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
        public enable(id: number)
        {
            if (this.capabilities[id] !== true)
            {
                this.gl.enable(id);
                this.capabilities[id] = true;
            }
        }
        public disable(id: number)
        {
            if (this.capabilities[id] !== false)
            {
                this.gl.disable(id);
                this.capabilities[id] = false;
            }
        }
        public getCompressedTextureFormats()
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
        public setBlending(blending?: number,
            blendEquation?: number,
            blendSrc?: number,
            blendDst?: number,
            blendEquationAlpha?: number,
            blendSrcAlpha?: number,
            blendDstAlpha?: number,
            premultipliedAlpha?: boolean)
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
        public setColorWrite(colorWrite: boolean)
        {
            this.buffers.color.setMask(colorWrite);
        }
        public setDepthTest(depthTest: boolean)
        {
            this.buffers.depth.setTest(depthTest);
        }
        public setDepthWrite(depthWrite: boolean)
        {
            this.buffers.depth.setMask(depthWrite);
        }
        public setDepthFunc(depthFunc: number)
        {
            this.buffers.depth.setFunc(depthFunc);
        }
        public setStencilTest(stencilTest: boolean)
        {
            this.buffers.stencil.setTest(stencilTest);
        }
        public setStencilWrite(stencilWrite: number)
        {
            this.buffers.stencil.setMask(stencilWrite);
        }
        public setStencilFunc(stencilFunc: number, stencilRef: number, stencilMask: number)
        {
            this.buffers.stencil.setFunc(stencilFunc, stencilRef, stencilMask);
        }
        public setStencilOp(stencilFail: number, stencilZFail: number, stencilZPass: number)
        {
            this.buffers.stencil.setOp(stencilFail, stencilZFail, stencilZPass);
        }
        public setFlipSided(flipSided: boolean)
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
        public setCullFace(cullFace: number)
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
        public setLineWidth(width: number)
        {
            if (width !== this.currentLineWidth)
            {
                this.gl.lineWidth(width);
                this.currentLineWidth = width;
            }
        }
        public setPolygonOffset(polygonOffset: boolean, factor, units)
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
        public getScissorTest()
        {
            return this.currentScissorTest;
        }
        public setScissorTest(scissorTest: boolean)
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
        public activeTexture(webglSlot?: number)
        {
            var gl = this.gl;
            if (webglSlot === undefined) webglSlot = gl.TEXTURE0 + this.maxTextures - 1;

            if (this.currentTextureSlot !== webglSlot)
            {
                gl.activeTexture(webglSlot);
                this.currentTextureSlot = webglSlot;
            }
        }
        public bindTexture(webglType: number, webglTexture: WebGLTexture)
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
        }
        public compressedTexImage2D(...args)
        {
            try
            {
                this.gl.compressedTexImage2D.apply(this.gl, arguments);

            } catch (error)
            {
                console.error(error);
            }
        }
        public texImage2D(...args)
        {
            try
            {
                this.gl.texImage2D.apply(this.gl, arguments);
            }
            catch (error)
            {
                console.error(error);
            }
        }
        public clearColor(r: number, g: number, b: number, a: number)
        {
            this.buffers.color.setClear(r, g, b, a);
        }
        public clearDepth(depth: number)
        {
            this.buffers.depth.setClear(depth);
        }
        public clearStencil(stencil: number)
        {
            this.buffers.stencil.setClear(stencil);
        }
        public scissor(scissor: Vector4)
        {
            if (this.currentScissor.equals(scissor) === false)
            {
                this.gl.scissor(scissor.x, scissor.y, scissor.z, scissor.w);
                this.currentScissor.copy(scissor);
            }
        }

        public viewport(viewport: Vector4)
        {
            if (this.currentViewport.equals(viewport) === false)
            {
                this.gl.viewport(viewport.x, viewport.y, viewport.z, viewport.w);
                this.currentViewport.copy(viewport);
            }
        }

        public init()
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
        }
        public initAttributes()
        {
            for (var i = 0, l = this.newAttributes.length; i < l; i++)
            {
                this.newAttributes[i] = 0;
            }
        }
        public reset()
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
        private gl: WebGLRenderingContext;
        private state: WebGLState;
        private locked: boolean;
        private color: Vector4;
        private currentColorMask: boolean;
        private currentColorClear: Vector4;

        constructor(gl: WebGLRenderingContext, state)
        {
            this.gl = gl;
            this.state = state;
            this.locked = false;

            this.color = new Vector4();
            this.currentColorMask = null;
            this.currentColorClear = new Vector4();
        }
        public setMask(colorMask: boolean)
        {
            if (this.currentColorMask !== colorMask && !this.locked)
            {
                this.gl.colorMask(colorMask, colorMask, colorMask, colorMask);
                this.currentColorMask = colorMask;
            }
        }
        public setLocked(lock: boolean)
        {
            this.locked = lock;
        }
        public setClear(r: number, g: number, b: number, a: number)
        {
            this.color.set(r, g, b, a);
            if (this.currentColorClear.equals(this.color) === false)
            {
                this.gl.clearColor(r, g, b, a);
                this.currentColorClear.copy(this.color);
            }
        }
        public reset()
        {
            this.locked = false;
            this.currentColorMask = null;
            this.currentColorClear = new Vector4();
        }
    } 
    export class WebGLDepthBuffer
    {
        private gl: WebGLRenderingContext;
        private state: WebGLState;
        private locked = false;
        private currentDepthMask: boolean = null;
        private currentDepthFunc: number = null;
        private currentDepthClear: number = null;

        constructor(gl: WebGLRenderingContext, state: WebGLState)
        {
            this.gl = gl;
            this.state = state;
        }
        public setTest(depthTest: boolean)
        {
            if (depthTest)
            {
                this.state.enable(this.gl.DEPTH_TEST);
            }
            else
            {
                this.state.disable(this.gl.DEPTH_TEST);
            }
        }
        public setMask(depthMask: boolean)
        {
            if (this.currentDepthMask !== depthMask && !this.locked)
            {
                this.gl.depthMask(depthMask);
                this.currentDepthMask = depthMask;
            }
        }
        public setFunc(depthFunc: number)
        {
            var gl = this.gl;
            if (this.currentDepthFunc !== depthFunc)
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

                this.currentDepthFunc = depthFunc;
            }
        }
        public setLocked(lock: boolean)
        {
            this.locked = lock;
        };
        public setClear(depth: number)
        {
            if (this.currentDepthClear !== depth)
            {
                this.gl.clearDepth(depth);
                this.currentDepthClear = depth;
            }
        };
        public reset()
        {
            this.locked = false;
            this.currentDepthMask = null;
            this.currentDepthFunc = null;
            this.currentDepthClear = null;
        };
    } 
    export class WebGLStencilBuffer
    { 
        private gl: WebGLRenderingContext;
        private state: WebGLState;
        private locked = false;
        private currentStencilMask: number = null;
        private currentStencilFunc: number = null;
        private currentStencilRef: number = null;
        private currentStencilFuncMask: number = null;
        private currentStencilFail: number = null;
        private currentStencilZFail: number = null;
        private currentStencilZPass: number = null;
        private currentStencilClear: number = null;

        constructor(gl: WebGLRenderingContext, state: WebGLState)
        {
            this.gl = gl;
            this.state = state;
        }

        public setTest(stencilTest: boolean)
        {
            if (stencilTest)
            {
                this.state.enable(this.gl.STENCIL_TEST);
            }
            else
            {
                this.state.disable(this.gl.STENCIL_TEST);
            }
        }
        public setMask(stencilMask: number)
        {
            if (this.currentStencilMask !== stencilMask && !this.locked)
            {
                this.gl.stencilMask(stencilMask);
                this.currentStencilMask = stencilMask;
            }

        }
        public setFunc(stencilFunc: number, stencilRef: number, stencilMask: number)
        {
            if (this.currentStencilFunc !== stencilFunc ||
                this.currentStencilRef !== stencilRef ||
                this.currentStencilFuncMask !== stencilMask)
            {
                this.gl.stencilFunc(stencilFunc, stencilRef, stencilMask);

                this.currentStencilFunc = stencilFunc;
                this.currentStencilRef = stencilRef;
                this.currentStencilFuncMask = stencilMask;
            }
        }
        public setOp(stencilFail: number, stencilZFail: number, stencilZPass: number)
        {
            if (this.currentStencilFail !== stencilFail ||
                this.currentStencilZFail !== stencilZFail ||
                this.currentStencilZPass !== stencilZPass)
            {
                this.gl.stencilOp(stencilFail, stencilZFail, stencilZPass);

                this.currentStencilFail = stencilFail;
                this.currentStencilZFail = stencilZFail;
                this.currentStencilZPass = stencilZPass;
            }

        }
        public setLocked(lock: boolean)
        {
            this.locked = lock;
        }
        public setClear(stencil: number)
        {
            if (this.currentStencilClear !== stencil)
            {
                this.gl.clearStencil(stencil);
                this.currentStencilClear = stencil;
            }
        }
        public reset()
        {
            this.locked = false;

            this.currentStencilMask = null;
            this.currentStencilFunc = null;
            this.currentStencilRef = null;
            this.currentStencilFuncMask = null;
            this.currentStencilFail = null;
            this.currentStencilZFail = null;
            this.currentStencilZPass = null;
            this.currentStencilClear = null;

        }
    }
}