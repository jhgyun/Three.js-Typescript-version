var THREE;
(function (THREE) {
    var WebGLState = (function () {
        function WebGLState(renderer) {
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
            this.currentScissor = new THREE.Vector4();
            this.currentViewport = new THREE.Vector4();
            this.emptyTextures = {};
            this.emptyTextures[gl.TEXTURE_2D] = this.createTexture(gl.TEXTURE_2D, gl.TEXTURE_2D, 1);
            this.emptyTextures[gl.TEXTURE_CUBE_MAP] = this.createTexture(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_CUBE_MAP_POSITIVE_X, 6);
        }
        ;
        WebGLState.prototype.createTexture = function (type, target, count) {
            var gl = this.gl;
            var data = new Uint8Array(4);
            var texture = gl.createTexture();
            gl.bindTexture(type, texture);
            gl.texParameteri(type, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(type, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            for (var i = 0; i < count; i++) {
                gl.texImage2D(target + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
            }
            return texture;
        };
        WebGLState.prototype.enableAttribute = function (attribute) {
            this.newAttributes[attribute] = 1;
            if (this.enabledAttributes[attribute] === 0) {
                this.gl.enableVertexAttribArray(attribute);
                this.enabledAttributes[attribute] = 1;
            }
            if (this.attributeDivisors[attribute] !== 0) {
                var extension = this.extensions.get('ANGLE_instanced_arrays');
                extension.vertexAttribDivisorANGLE(attribute, 0);
                this.attributeDivisors[attribute] = 0;
            }
        };
        WebGLState.prototype.enableAttributeAndDivisor = function (attribute, meshPerAttribute, extension) {
            this.newAttributes[attribute] = 1;
            if (this.enabledAttributes[attribute] === 0) {
                this.gl.enableVertexAttribArray(attribute);
                this.enabledAttributes[attribute] = 1;
            }
            if (this.attributeDivisors[attribute] !== meshPerAttribute) {
                extension.vertexAttribDivisorANGLE(attribute, meshPerAttribute);
                this.attributeDivisors[attribute] = meshPerAttribute;
            }
        };
        WebGLState.prototype.disableUnusedAttributes = function () {
            for (var i = 0, l = this.enabledAttributes.length; i !== l; ++i) {
                if (this.enabledAttributes[i] !== this.newAttributes[i]) {
                    this.gl.disableVertexAttribArray(i);
                    this.enabledAttributes[i] = 0;
                }
            }
        };
        WebGLState.prototype.enable = function (id) {
            if (this.capabilities[id] !== true) {
                this.gl.enable(id);
                this.capabilities[id] = true;
            }
        };
        WebGLState.prototype.disable = function (id) {
            if (this.capabilities[id] !== false) {
                this.gl.disable(id);
                this.capabilities[id] = false;
            }
        };
        WebGLState.prototype.getCompressedTextureFormats = function () {
            if (this.compressedTextureFormats === null) {
                this.compressedTextureFormats = [];
                if (this.extensions.get('WEBGL_compressed_texture_pvrtc') ||
                    this.extensions.get('WEBGL_compressed_texture_s3tc') ||
                    this.extensions.get('WEBGL_compressed_texture_etc1')) {
                    var formats = this.gl.getParameter(this.gl.COMPRESSED_TEXTURE_FORMATS);
                    for (var i = 0; i < formats.length; i++) {
                        this.compressedTextureFormats.push(formats[i]);
                    }
                }
            }
            return this.compressedTextureFormats;
        };
        WebGLState.prototype.setBlending = function (blending, blendEquation, blendSrc, blendDst, blendEquationAlpha, blendSrcAlpha, blendDstAlpha, premultipliedAlpha) {
            var gl = this.gl;
            if (blending !== THREE.NoBlending) {
                this.enable(gl.BLEND);
            }
            else {
                this.disable(gl.BLEND);
                this.currentBlending = blending;
                return;
            }
            if (blending !== this.currentBlending || premultipliedAlpha !== this.currentPremultipledAlpha) {
                if (blending === THREE.AdditiveBlending) {
                    if (premultipliedAlpha) {
                        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFuncSeparate(gl.ONE, gl.ONE, gl.ONE, gl.ONE);
                    }
                    else {
                        gl.blendEquation(gl.FUNC_ADD);
                        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
                    }
                }
                else if (blending === THREE.SubtractiveBlending) {
                    if (premultipliedAlpha) {
                        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFuncSeparate(gl.ZERO, gl.ZERO, gl.ONE_MINUS_SRC_COLOR, gl.ONE_MINUS_SRC_ALPHA);
                    }
                    else {
                        gl.blendEquation(gl.FUNC_ADD);
                        gl.blendFunc(gl.ZERO, gl.ONE_MINUS_SRC_COLOR);
                    }
                }
                else if (blending === THREE.MultiplyBlending) {
                    if (premultipliedAlpha) {
                        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFuncSeparate(gl.ZERO, gl.SRC_COLOR, gl.ZERO, gl.SRC_ALPHA);
                    }
                    else {
                        gl.blendEquation(gl.FUNC_ADD);
                        gl.blendFunc(gl.ZERO, gl.SRC_COLOR);
                    }
                }
                else {
                    if (premultipliedAlpha) {
                        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    }
                    else {
                        gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
                        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
                    }
                }
                this.currentBlending = blending;
                this.currentPremultipledAlpha = premultipliedAlpha;
            }
            if (blending === THREE.CustomBlending) {
                blendEquationAlpha = blendEquationAlpha || blendEquation;
                blendSrcAlpha = blendSrcAlpha || blendSrc;
                blendDstAlpha = blendDstAlpha || blendDst;
                if (blendEquation !== this.currentBlendEquation || blendEquationAlpha !== this.currentBlendEquationAlpha) {
                    gl.blendEquationSeparate(THREE.paramThreeToGL(this.renderer, blendEquation), THREE.paramThreeToGL(this.renderer, blendEquationAlpha));
                    this.currentBlendEquation = blendEquation;
                    this.currentBlendEquationAlpha = blendEquationAlpha;
                }
                if (blendSrc !== this.currentBlendSrc
                    || blendDst !== this.currentBlendDst
                    || blendSrcAlpha !== this.currentBlendSrcAlpha
                    || blendDstAlpha !== this.currentBlendDstAlpha) {
                    gl.blendFuncSeparate(THREE.paramThreeToGL(this.renderer, blendSrc), THREE.paramThreeToGL(this.renderer, blendDst), THREE.paramThreeToGL(this.renderer, blendSrcAlpha), THREE.paramThreeToGL(this.renderer, blendDstAlpha));
                    this.currentBlendSrc = blendSrc;
                    this.currentBlendDst = blendDst;
                    this.currentBlendSrcAlpha = blendSrcAlpha;
                    this.currentBlendDstAlpha = blendDstAlpha;
                }
            }
            else {
                this.currentBlendEquation = null;
                this.currentBlendSrc = null;
                this.currentBlendDst = null;
                this.currentBlendEquationAlpha = null;
                this.currentBlendSrcAlpha = null;
                this.currentBlendDstAlpha = null;
            }
        };
        WebGLState.prototype.setColorWrite = function (colorWrite) {
            this.buffers.color.setMask(colorWrite);
        };
        WebGLState.prototype.setDepthTest = function (depthTest) {
            this.buffers.depth.setTest(depthTest);
        };
        WebGLState.prototype.setDepthWrite = function (depthWrite) {
            this.buffers.depth.setMask(depthWrite);
        };
        WebGLState.prototype.setDepthFunc = function (depthFunc) {
            this.buffers.depth.setFunc(depthFunc);
        };
        WebGLState.prototype.setStencilTest = function (stencilTest) {
            this.buffers.stencil.setTest(stencilTest);
        };
        WebGLState.prototype.setStencilWrite = function (stencilWrite) {
            this.buffers.stencil.setMask(stencilWrite);
        };
        WebGLState.prototype.setStencilFunc = function (stencilFunc, stencilRef, stencilMask) {
            this.buffers.stencil.setFunc(stencilFunc, stencilRef, stencilMask);
        };
        WebGLState.prototype.setStencilOp = function (stencilFail, stencilZFail, stencilZPass) {
            this.buffers.stencil.setOp(stencilFail, stencilZFail, stencilZPass);
        };
        WebGLState.prototype.setFlipSided = function (flipSided) {
            if (this.currentFlipSided !== flipSided) {
                if (flipSided) {
                    this.gl.frontFace(this.gl.CW);
                }
                else {
                    this.gl.frontFace(this.gl.CCW);
                }
                this.currentFlipSided = flipSided;
            }
        };
        WebGLState.prototype.setCullFace = function (cullFace) {
            var gl = this.gl;
            if (cullFace !== THREE.CullFaceNone) {
                this.enable(gl.CULL_FACE);
                if (cullFace !== this.currentCullFace) {
                    if (cullFace === THREE.CullFaceBack) {
                        gl.cullFace(gl.BACK);
                    }
                    else if (cullFace === THREE.CullFaceFront) {
                        gl.cullFace(gl.FRONT);
                    }
                    else {
                        gl.cullFace(gl.FRONT_AND_BACK);
                    }
                }
            }
            else {
                this.disable(gl.CULL_FACE);
            }
            this.currentCullFace = cullFace;
        };
        WebGLState.prototype.setLineWidth = function (width) {
            if (width !== this.currentLineWidth) {
                this.gl.lineWidth(width);
                this.currentLineWidth = width;
            }
        };
        WebGLState.prototype.setPolygonOffset = function (polygonOffset, factor, units) {
            var gl = this.gl;
            if (polygonOffset) {
                this.enable(gl.POLYGON_OFFSET_FILL);
                if (this.currentPolygonOffsetFactor !== factor || this.currentPolygonOffsetUnits !== units) {
                    gl.polygonOffset(factor, units);
                    this.currentPolygonOffsetFactor = factor;
                    this.currentPolygonOffsetUnits = units;
                }
            }
            else {
                this.disable(gl.POLYGON_OFFSET_FILL);
            }
        };
        WebGLState.prototype.getScissorTest = function () {
            return this.currentScissorTest;
        };
        WebGLState.prototype.setScissorTest = function (scissorTest) {
            var gl = this.gl;
            this.currentScissorTest = scissorTest;
            if (scissorTest) {
                this.enable(gl.SCISSOR_TEST);
            }
            else {
                this.disable(gl.SCISSOR_TEST);
            }
        };
        WebGLState.prototype.activeTexture = function (webglSlot) {
            var gl = this.gl;
            if (webglSlot === undefined)
                webglSlot = gl.TEXTURE0 + this.maxTextures - 1;
            if (this.currentTextureSlot !== webglSlot) {
                gl.activeTexture(webglSlot);
                this.currentTextureSlot = webglSlot;
            }
        };
        WebGLState.prototype.bindTexture = function (webglType, webglTexture) {
            if (this.currentTextureSlot === null) {
                this.activeTexture();
            }
            var boundTexture = this.currentBoundTextures[this.currentTextureSlot];
            if (boundTexture === undefined) {
                boundTexture = { type: undefined, texture: undefined };
                this.currentBoundTextures[this.currentTextureSlot] = boundTexture;
            }
            if (boundTexture.type !== webglType || boundTexture.texture !== webglTexture) {
                this.gl.bindTexture(webglType, webglTexture || this.emptyTextures[webglType]);
                boundTexture.type = webglType;
                boundTexture.texture = webglTexture;
            }
        };
        WebGLState.prototype.compressedTexImage2D = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            try {
                this.gl.compressedTexImage2D.apply(this.gl, arguments);
            }
            catch (error) {
                console.error(error);
            }
        };
        WebGLState.prototype.texImage2D = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            try {
                this.gl.texImage2D.apply(this.gl, arguments);
            }
            catch (error) {
                console.error(error);
            }
        };
        WebGLState.prototype.clearColor = function (r, g, b, a) {
            this.buffers.color.setClear(r, g, b, a);
        };
        WebGLState.prototype.clearDepth = function (depth) {
            this.buffers.depth.setClear(depth);
        };
        WebGLState.prototype.clearStencil = function (stencil) {
            this.buffers.stencil.setClear(stencil);
        };
        WebGLState.prototype.scissor = function (scissor) {
            if (this.currentScissor.equals(scissor) === false) {
                this.gl.scissor(scissor.x, scissor.y, scissor.z, scissor.w);
                this.currentScissor.copy(scissor);
            }
        };
        WebGLState.prototype.viewport = function (viewport) {
            if (this.currentViewport.equals(viewport) === false) {
                this.gl.viewport(viewport.x, viewport.y, viewport.z, viewport.w);
                this.currentViewport.copy(viewport);
            }
        };
        WebGLState.prototype.init = function () {
            this.clearColor(0, 0, 0, 1);
            this.clearDepth(1);
            this.clearStencil(0);
            this.enable(this.gl.DEPTH_TEST);
            this.setDepthFunc(THREE.LessEqualDepth);
            this.setFlipSided(false);
            this.setCullFace(THREE.CullFaceBack);
            this.enable(this.gl.CULL_FACE);
            this.enable(this.gl.BLEND);
            this.setBlending(THREE.NormalBlending);
        };
        WebGLState.prototype.initAttributes = function () {
            for (var i = 0, l = this.newAttributes.length; i < l; i++) {
                this.newAttributes[i] = 0;
            }
        };
        WebGLState.prototype.reset = function () {
            var gl = this.gl;
            for (var i = 0; i < this.enabledAttributes.length; i++) {
                if (this.enabledAttributes[i] === 1) {
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
        };
        return WebGLState;
    }());
    THREE.WebGLState = WebGLState;
    var WebGLColorBuffer = (function () {
        function WebGLColorBuffer(gl, state) {
            this.gl = gl;
            this.state = state;
            this.locked = false;
            this.color = new THREE.Vector4();
            this.currentColorMask = null;
            this.currentColorClear = new THREE.Vector4();
        }
        WebGLColorBuffer.prototype.setMask = function (colorMask) {
            if (this.currentColorMask !== colorMask && !this.locked) {
                this.gl.colorMask(colorMask, colorMask, colorMask, colorMask);
                this.currentColorMask = colorMask;
            }
        };
        WebGLColorBuffer.prototype.setLocked = function (lock) {
            this.locked = lock;
        };
        WebGLColorBuffer.prototype.setClear = function (r, g, b, a) {
            this.color.set(r, g, b, a);
            if (this.currentColorClear.equals(this.color) === false) {
                this.gl.clearColor(r, g, b, a);
                this.currentColorClear.copy(this.color);
            }
        };
        WebGLColorBuffer.prototype.reset = function () {
            this.locked = false;
            this.currentColorMask = null;
            this.currentColorClear = new THREE.Vector4();
        };
        return WebGLColorBuffer;
    }());
    THREE.WebGLColorBuffer = WebGLColorBuffer;
    var WebGLDepthBuffer = (function () {
        function WebGLDepthBuffer(gl, state) {
            this.locked = false;
            this.currentDepthMask = null;
            this.currentDepthFunc = null;
            this.currentDepthClear = null;
            this.gl = gl;
            this.state = state;
        }
        WebGLDepthBuffer.prototype.setTest = function (depthTest) {
            if (depthTest) {
                this.state.enable(this.gl.DEPTH_TEST);
            }
            else {
                this.state.disable(this.gl.DEPTH_TEST);
            }
        };
        WebGLDepthBuffer.prototype.setMask = function (depthMask) {
            if (this.currentDepthMask !== depthMask && !this.locked) {
                this.gl.depthMask(depthMask);
                this.currentDepthMask = depthMask;
            }
        };
        WebGLDepthBuffer.prototype.setFunc = function (depthFunc) {
            var gl = this.gl;
            if (this.currentDepthFunc !== depthFunc) {
                if (depthFunc) {
                    switch (depthFunc) {
                        case THREE.NeverDepth:
                            gl.depthFunc(gl.NEVER);
                            break;
                        case THREE.AlwaysDepth:
                            gl.depthFunc(gl.ALWAYS);
                            break;
                        case THREE.LessDepth:
                            gl.depthFunc(gl.LESS);
                            break;
                        case THREE.LessEqualDepth:
                            gl.depthFunc(gl.LEQUAL);
                            break;
                        case THREE.EqualDepth:
                            gl.depthFunc(gl.EQUAL);
                            break;
                        case THREE.GreaterEqualDepth:
                            gl.depthFunc(gl.GEQUAL);
                            break;
                        case THREE.GreaterDepth:
                            gl.depthFunc(gl.GREATER);
                            break;
                        case THREE.NotEqualDepth:
                            gl.depthFunc(gl.NOTEQUAL);
                            break;
                        default:
                            gl.depthFunc(gl.LEQUAL);
                    }
                }
                else {
                    gl.depthFunc(gl.LEQUAL);
                }
                this.currentDepthFunc = depthFunc;
            }
        };
        WebGLDepthBuffer.prototype.setLocked = function (lock) {
            this.locked = lock;
        };
        ;
        WebGLDepthBuffer.prototype.setClear = function (depth) {
            if (this.currentDepthClear !== depth) {
                this.gl.clearDepth(depth);
                this.currentDepthClear = depth;
            }
        };
        ;
        WebGLDepthBuffer.prototype.reset = function () {
            this.locked = false;
            this.currentDepthMask = null;
            this.currentDepthFunc = null;
            this.currentDepthClear = null;
        };
        ;
        return WebGLDepthBuffer;
    }());
    THREE.WebGLDepthBuffer = WebGLDepthBuffer;
    var WebGLStencilBuffer = (function () {
        function WebGLStencilBuffer(gl, state) {
            this.locked = false;
            this.currentStencilMask = null;
            this.currentStencilFunc = null;
            this.currentStencilRef = null;
            this.currentStencilFuncMask = null;
            this.currentStencilFail = null;
            this.currentStencilZFail = null;
            this.currentStencilZPass = null;
            this.currentStencilClear = null;
            this.gl = gl;
            this.state = state;
        }
        WebGLStencilBuffer.prototype.setTest = function (stencilTest) {
            if (stencilTest) {
                this.state.enable(this.gl.STENCIL_TEST);
            }
            else {
                this.state.disable(this.gl.STENCIL_TEST);
            }
        };
        WebGLStencilBuffer.prototype.setMask = function (stencilMask) {
            if (this.currentStencilMask !== stencilMask && !this.locked) {
                this.gl.stencilMask(stencilMask);
                this.currentStencilMask = stencilMask;
            }
        };
        WebGLStencilBuffer.prototype.setFunc = function (stencilFunc, stencilRef, stencilMask) {
            if (this.currentStencilFunc !== stencilFunc ||
                this.currentStencilRef !== stencilRef ||
                this.currentStencilFuncMask !== stencilMask) {
                this.gl.stencilFunc(stencilFunc, stencilRef, stencilMask);
                this.currentStencilFunc = stencilFunc;
                this.currentStencilRef = stencilRef;
                this.currentStencilFuncMask = stencilMask;
            }
        };
        WebGLStencilBuffer.prototype.setOp = function (stencilFail, stencilZFail, stencilZPass) {
            if (this.currentStencilFail !== stencilFail ||
                this.currentStencilZFail !== stencilZFail ||
                this.currentStencilZPass !== stencilZPass) {
                this.gl.stencilOp(stencilFail, stencilZFail, stencilZPass);
                this.currentStencilFail = stencilFail;
                this.currentStencilZFail = stencilZFail;
                this.currentStencilZPass = stencilZPass;
            }
        };
        WebGLStencilBuffer.prototype.setLocked = function (lock) {
            this.locked = lock;
        };
        WebGLStencilBuffer.prototype.setClear = function (stencil) {
            if (this.currentStencilClear !== stencil) {
                this.gl.clearStencil(stencil);
                this.currentStencilClear = stencil;
            }
        };
        WebGLStencilBuffer.prototype.reset = function () {
            this.locked = false;
            this.currentStencilMask = null;
            this.currentStencilFunc = null;
            this.currentStencilRef = null;
            this.currentStencilFuncMask = null;
            this.currentStencilFail = null;
            this.currentStencilZFail = null;
            this.currentStencilZPass = null;
            this.currentStencilClear = null;
        };
        return WebGLStencilBuffer;
    }());
    THREE.WebGLStencilBuffer = WebGLStencilBuffer;
})(THREE || (THREE = {}));
