var THREE;
(function (THREE) {
    var WebGLRenderer = (function () {
        function WebGLRenderer(parameters) {
            var _this = this;
            console.log('THREE.WebGLRenderer', THREE.REVISION);
            parameters = this.parameters = parameters || {};
            var _canvas = this._canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
            var _context = this._context = parameters.context !== undefined ? parameters.context : null;
            this._alpha = parameters.alpha !== undefined ? parameters.alpha : false;
            this._depth = parameters.depth !== undefined ? parameters.depth : true;
            this._stencil = parameters.stencil !== undefined ? parameters.stencil : true;
            this._antialias = parameters.antialias !== undefined ? parameters.antialias : false;
            this._premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true;
            this._preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;
            this.lights = [];
            this.opaqueObjects = [];
            this.opaqueObjectsLastIndex = -1;
            this.transparentObjects = [];
            this.transparentObjectsLastIndex = -1;
            this.morphInfluences = new Float32Array(8);
            this.sprites = [];
            this.lensFlares = [];
            this.domElement = _canvas;
            this.context = null;
            this.autoClear = true;
            this.autoClearColor = true;
            this.autoClearDepth = true;
            this.autoClearStencil = true;
            this.sortObjects = true;
            this.clippingPlanes = [];
            this.localClippingEnabled = false;
            this.gammaFactor = 2.0;
            this.gammaInput = false;
            this.gammaOutput = false;
            this.physicallyCorrectLights = false;
            this.toneMapping = THREE.LinearToneMapping;
            this.toneMappingExposure = 1.0;
            this.toneMappingWhitePoint = 1.0;
            this.maxMorphTargets = 8;
            this.maxMorphNormals = 4;
            this._currentProgram = null;
            this._currentRenderTarget = null;
            this._currentFramebuffer = null;
            this._currentMaterialId = -1;
            this._currentGeometryProgram = '';
            this._currentCamera = null;
            this._currentScissor = new THREE.Vector4();
            this._currentScissorTest = null;
            this._currentViewport = new THREE.Vector4();
            this._usedTextureUnits = 0;
            this._clearColor = new THREE.Color(0x000000);
            this._clearAlpha = 0;
            this._width = _canvas.width;
            this._height = _canvas.height;
            var _pixelRatio = this._pixelRatio = 1;
            var _scissor = this._scissor = new THREE.Vector4(0, 0, this._width, this._height);
            var _scissorTest = this._scissorTest = false;
            var _viewport = this._viewport = new THREE.Vector4(0, 0, this._width, this._height);
            this._frustum = new THREE.Frustum();
            this._clipping = new THREE.WebGLClipping();
            this._clippingEnabled = false;
            this._localClippingEnabled = false;
            this._sphere = new THREE.Sphere();
            this._projScreenMatrix = new THREE.Matrix4();
            this._vector3 = new THREE.Vector3();
            this._lights = {
                hash: '',
                ambient: [0, 0, 0],
                directional: [],
                directionalShadowMap: [],
                directionalShadowMatrix: [],
                spot: [],
                spotShadowMap: [],
                spotShadowMatrix: [],
                point: [],
                pointShadowMap: [],
                pointShadowMatrix: [],
                hemi: [],
                shadows: []
            };
            this._infoRender = {
                calls: 0,
                vertices: 0,
                faces: 0,
                points: 0
            };
            this.info = {
                render: this._infoRender,
                memory: {
                    geometries: 0,
                    textures: 0
                },
                programs: null
            };
            this.init_context();
            this.init_extensions();
            this.capabilities = new THREE.WebGLCapabilities(this.context, this.extensions, parameters);
            this.state = new THREE.WebGLState(this);
            this.properties = new THREE.WebGLProperties();
            this.textures = new THREE.WebGLTextures(this);
            this.objects = new THREE.WebGLObjects(this.context, this.properties, this.info);
            this.programCache = new THREE.WebGLPrograms(this, this.capabilities);
            this.lightCache = new THREE.WebGLLights();
            this.info.programs = this.programCache.programs;
            this.bufferRenderer = new THREE.WebGLBufferRenderer(this.context, this.extensions, this._infoRender);
            this.indexedBufferRenderer = new THREE.WebGLIndexedBufferRenderer(this.context, this.extensions, this._infoRender);
            this.backgroundCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
            this.backgroundCamera2 = new THREE.PerspectiveCamera();
            this.backgroundPlaneMesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), new THREE.MeshBasicMaterial({ depthTest: false, depthWrite: false, fog: false }));
            this.backgroundBoxShader = THREE.ShaderLib['cube'];
            this.backgroundBoxMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(5, 5, 5), new THREE.ShaderMaterial({
                uniforms: this.backgroundBoxShader.uniforms,
                vertexShader: this.backgroundBoxShader.vertexShader,
                fragmentShader: this.backgroundBoxShader.fragmentShader,
                side: THREE.BackSide,
                depthTest: false,
                depthWrite: false
            }));
            this.objects.update(this.backgroundPlaneMesh);
            this.objects.update(this.backgroundBoxMesh);
            this.setDefaultGLState();
            this.shadowMap = new THREE.WebGLShadowMap(this, this._lights, this.objects, this.capabilities);
            this.spritePlugin = new THREE.SpritePlugin(this);
            this.lensFlarePlugin = new THREE.LensFlarePlugin(this);
            this.onContextLost_ = function (event) {
                _this.onContextLost(event);
            };
            this.onMaterialDispose_ = function (event) {
                _this.onContextLost(event);
            };
        }
        WebGLRenderer.prototype.init_context = function () {
            var _gl;
            try {
                var attributes = {
                    alpha: this._alpha,
                    depth: this._depth,
                    stencil: this._stencil,
                    antialias: this._antialias,
                    premultipliedAlpha: this._premultipliedAlpha,
                    preserveDrawingBuffer: this._preserveDrawingBuffer
                };
                _gl = this._context
                    || this._canvas.getContext('webgl', attributes)
                    || this._canvas.getContext('experimental-webgl', attributes);
                if (_gl === null) {
                    if (this._canvas.getContext('webgl') !== null) {
                        throw 'Error creating WebGL context with your selected attributes.';
                    }
                    else {
                        throw 'Error creating WebGL context.';
                    }
                }
                if (_gl.getShaderPrecisionFormat === undefined) {
                    _gl.getShaderPrecisionFormat = function () {
                        return { 'rangeMin': 1, 'rangeMax': 1, 'precision': 1 };
                    };
                }
                this._canvas.addEventListener('webglcontextlost', this.onContextLost_, false);
                this.context = _gl;
            }
            catch (error) {
                console.error('THREE.WebGLRenderer: ' + error);
            }
        };
        WebGLRenderer.prototype.init_extensions = function () {
            var extensions = new THREE.WebGLExtensions(this.context);
            extensions.get('WEBGL_depth_texture');
            extensions.get('OES_texture_float');
            extensions.get('OES_texture_float_linear');
            extensions.get('OES_texture_half_float');
            extensions.get('OES_texture_half_float_linear');
            extensions.get('OES_standard_derivatives');
            extensions.get('ANGLE_instanced_arrays');
            if (extensions.get('OES_element_index_uint')) {
                THREE.BufferGeometry.MaxIndex = 4294967296;
            }
            this.extensions = extensions;
        };
        WebGLRenderer.prototype.getTargetPixelRatio = function () {
            return this._currentRenderTarget === null ? this._pixelRatio : 1;
        };
        WebGLRenderer.prototype.getContext = function () {
            return this.context;
        };
        ;
        WebGLRenderer.prototype.glClearColor = function (r, g, b, a) {
            if (this._premultipliedAlpha === true) {
                r *= a;
                g *= a;
                b *= a;
            }
            this.state.clearColor(r, g, b, a);
        };
        WebGLRenderer.prototype.setDefaultGLState = function () {
            var _clearColor = this._clearColor;
            this.state.init();
            this.state.scissor(this._currentScissor.copy(this._scissor).multiplyScalar(this._pixelRatio));
            this.state.viewport(this._currentViewport.copy(this._viewport).multiplyScalar(this._pixelRatio));
            this.glClearColor(_clearColor.r, _clearColor.g, _clearColor.b, this._clearAlpha);
        };
        WebGLRenderer.prototype.resetGLState = function () {
            this._currentProgram = null;
            this._currentCamera = null;
            this._currentGeometryProgram = '';
            this._currentMaterialId = -1;
            this.state.reset();
        };
        WebGLRenderer.prototype.getContextAttributes = function () {
            return this.context.getContextAttributes();
        };
        ;
        WebGLRenderer.prototype.forceContextLoss = function () {
            this.extensions.get('WEBGL_lose_context').loseContext();
        };
        ;
        WebGLRenderer.prototype.getMaxAnisotropy = function () {
            return this.capabilities.getMaxAnisotropy();
        };
        ;
        WebGLRenderer.prototype.getPrecision = function () {
            return this.capabilities.precision;
        };
        ;
        WebGLRenderer.prototype.getPixelRatio = function () {
            return this._pixelRatio;
        };
        WebGLRenderer.prototype.setPixelRatio = function (value) {
            if (value === undefined)
                return;
            this._pixelRatio = value;
            this.setSize(this._viewport.z, this._viewport.w, false);
        };
        WebGLRenderer.prototype.getSize = function () {
            return {
                width: this._width,
                height: this._height
            };
        };
        WebGLRenderer.prototype.setSize = function (width, height, updateStyle) {
            this._width = width;
            this._height = height;
            this._canvas.width = width * this._pixelRatio;
            this._canvas.height = height * this._pixelRatio;
            if (updateStyle !== false) {
                this._canvas.style.width = width + 'px';
                this._canvas.style.height = height + 'px';
            }
            this.setViewport(0, 0, width, height);
        };
        WebGLRenderer.prototype.setViewport = function (x, y, width, height) {
            this.state.viewport(this._viewport.set(x, y, width, height));
        };
        ;
        WebGLRenderer.prototype.setScissor = function (x, y, width, height) {
            this.state.scissor(this._scissor.set(x, y, width, height));
        };
        ;
        WebGLRenderer.prototype.setScissorTest = function (boolean) {
            this.state.setScissorTest(this._scissorTest = boolean);
        };
        WebGLRenderer.prototype.getClearColor = function () {
            return this._clearColor;
        };
        WebGLRenderer.prototype.setClearColor = function (color, alpha) {
            this._clearColor.set(color);
            this._clearAlpha = alpha !== undefined ? alpha : 1;
            this.glClearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearAlpha);
        };
        ;
        WebGLRenderer.prototype.getClearAlpha = function () {
            return this._clearAlpha;
        };
        ;
        WebGLRenderer.prototype.setClearAlpha = function (alpha) {
            var _clearColor = this._clearColor;
            this._clearAlpha = alpha;
            this.glClearColor(_clearColor.r, _clearColor.g, _clearColor.b, this._clearAlpha);
        };
        ;
        WebGLRenderer.prototype.clear = function (color, depth, stencil) {
            var bits = 0;
            var _gl = this.context;
            if (color === undefined || color)
                bits |= _gl.COLOR_BUFFER_BIT;
            if (depth === undefined || depth)
                bits |= _gl.DEPTH_BUFFER_BIT;
            if (stencil === undefined || stencil)
                bits |= _gl.STENCIL_BUFFER_BIT;
            _gl.clear(bits);
        };
        WebGLRenderer.prototype.clearColor = function () {
            this.clear(true, false, false);
        };
        WebGLRenderer.prototype.clearDepth = function () {
            this.clear(false, true, false);
        };
        WebGLRenderer.prototype.clearStencil = function () {
            this.clear(false, false, true);
        };
        WebGLRenderer.prototype.clearTarget = function (renderTarget, color, depth, stencil) {
            this.setRenderTarget(renderTarget);
            this.clear(color, depth, stencil);
        };
        WebGLRenderer.prototype.dispose = function () {
            this.transparentObjects = [];
            this.transparentObjectsLastIndex = -1;
            this.opaqueObjects = [];
            this.opaqueObjectsLastIndex = -1;
            this._canvas.removeEventListener('webglcontextlost', this.onContextLost_, false);
        };
        ;
        WebGLRenderer.prototype.onContextLost = function (event) {
            event.preventDefault();
            this.resetGLState();
            this.setDefaultGLState();
            this.properties.clear();
        };
        WebGLRenderer.prototype.onMaterialDispose = function (event) {
            var material = event.target;
            material.removeEventListener('dispose', this.onMaterialDispose_);
            this.deallocateMaterial(material);
        };
        WebGLRenderer.prototype.deallocateMaterial = function (material) {
            this.releaseMaterialProgramReference(material);
            this.properties.delete(material);
        };
        WebGLRenderer.prototype.releaseMaterialProgramReference = function (material) {
            var programInfo = this.properties.get(material).program;
            material.program = undefined;
            if (programInfo !== undefined) {
                this.programCache.releaseProgram(programInfo);
            }
        };
        WebGLRenderer.prototype.renderBufferImmediate = function (object, program, material) {
            var state = this.state;
            var properties = this.properties;
            var _gl = this.context;
            state.initAttributes();
            var buffers = properties.get(object);
            if (object.hasPositions && !buffers.position)
                buffers.position = _gl.createBuffer();
            if (object.hasNormals && !buffers.normal)
                buffers.normal = _gl.createBuffer();
            if (object.hasUvs && !buffers.uv)
                buffers.uv = _gl.createBuffer();
            if (object.hasColors && !buffers.color)
                buffers.color = _gl.createBuffer();
            var attributes;
            attributes = program.getAttributes();
            if (object.hasPositions) {
                _gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.position);
                _gl.bufferData(_gl.ARRAY_BUFFER, object.positionArray, _gl.DYNAMIC_DRAW);
                state.enableAttribute(attributes.position);
                _gl.vertexAttribPointer(attributes.position, 3, _gl.FLOAT, false, 0, 0);
            }
            if (object.hasNormals) {
                _gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.normal);
                if (material.type !== 'MeshPhongMaterial'
                    && material.type !== 'MeshStandardMaterial'
                    && material.type !== 'MeshPhysicalMaterial'
                    && material.shading === THREE.FlatShading) {
                    for (var i = 0, l = object.count * 3; i < l; i += 9) {
                        var array = object.normalArray;
                        var nx = (array[i + 0] + array[i + 3] + array[i + 6]) / 3;
                        var ny = (array[i + 1] + array[i + 4] + array[i + 7]) / 3;
                        var nz = (array[i + 2] + array[i + 5] + array[i + 8]) / 3;
                        array[i + 0] = nx;
                        array[i + 1] = ny;
                        array[i + 2] = nz;
                        array[i + 3] = nx;
                        array[i + 4] = ny;
                        array[i + 5] = nz;
                        array[i + 6] = nx;
                        array[i + 7] = ny;
                        array[i + 8] = nz;
                    }
                }
                _gl.bufferData(_gl.ARRAY_BUFFER, object.normalArray, _gl.DYNAMIC_DRAW);
                state.enableAttribute(attributes.normal);
                _gl.vertexAttribPointer(attributes.normal, 3, _gl.FLOAT, false, 0, 0);
            }
            if (object.hasUvs && material.map) {
                _gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.uv);
                _gl.bufferData(_gl.ARRAY_BUFFER, object.uvArray, _gl.DYNAMIC_DRAW);
                state.enableAttribute(attributes.uv);
                _gl.vertexAttribPointer(attributes.uv, 2, _gl.FLOAT, false, 0, 0);
            }
            if (object.hasColors && material.vertexColors !== THREE.NoColors) {
                _gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.color);
                _gl.bufferData(_gl.ARRAY_BUFFER, object.colorArray, _gl.DYNAMIC_DRAW);
                state.enableAttribute(attributes.color);
                _gl.vertexAttribPointer(attributes.color, 3, _gl.FLOAT, false, 0, 0);
            }
            state.disableUnusedAttributes();
            _gl.drawArrays(_gl.TRIANGLES, 0, object.count);
            object.count = 0;
        };
        WebGLRenderer.prototype.renderBufferDirect = function (camera, fog, geometry, material, object, group) {
            var _gl = this.context;
            this.setMaterial(material);
            var program = this.setProgram(camera, fog, material, object);
            var updateBuffers = false;
            var geometryProgram = geometry.id + '_' + program.id + '_' + material.wireframe;
            if (geometryProgram !== this._currentGeometryProgram) {
                this._currentGeometryProgram = geometryProgram;
                updateBuffers = true;
            }
            var morphTargetInfluences = object.morphTargetInfluences;
            if (morphTargetInfluences !== undefined) {
                var activeInfluences = [];
                for (var i_1 = 0, l_1 = morphTargetInfluences.length; i_1 < l_1; i_1++) {
                    var influence = morphTargetInfluences[i_1];
                    activeInfluences.push([influence, i_1]);
                }
                activeInfluences.sort(this.absNumericalSort);
                if (activeInfluences.length > 8) {
                    activeInfluences.length = 8;
                }
                var morphAttributes = geometry.morphAttributes;
                for (var i = 0, l = activeInfluences.length; i < l; i++) {
                    var influence_1 = activeInfluences[i];
                    this.morphInfluences[i] = influence_1[0];
                    if (influence_1[0] !== 0) {
                        var index_1 = influence_1[1];
                        if (material.morphTargets === true && morphAttributes.position)
                            geometry.addAttribute('morphTarget' + i, morphAttributes.position[index_1]);
                        if (material.morphNormals === true && morphAttributes.normal)
                            geometry.addAttribute('morphNormal' + i, morphAttributes.normal[index_1]);
                    }
                    else {
                        if (material.morphTargets === true)
                            geometry.removeAttribute('morphTarget' + i);
                        if (material.morphNormals === true)
                            geometry.removeAttribute('morphNormal' + i);
                    }
                }
                program.getUniforms().setValue(_gl, 'morphTargetInfluences', this.morphInfluences);
                updateBuffers = true;
            }
            var index = geometry.index;
            var position = geometry.attributes.position;
            if (material.wireframe === true) {
                index = this.objects.getWireframeAttribute(geometry);
            }
            var renderer;
            if (index !== null) {
                renderer = this.indexedBufferRenderer;
                renderer.setIndex(index);
            }
            else {
                renderer = this.bufferRenderer;
            }
            if (updateBuffers) {
                this.setupVertexAttributes(material, program, geometry);
                if (index !== null) {
                    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, this.objects.getAttributeBuffer(index));
                }
            }
            var dataStart = 0;
            var dataCount = Infinity;
            if (index !== null) {
                dataCount = index.count;
            }
            else if (position !== undefined) {
                dataCount = position.count;
            }
            var rangeStart = geometry.drawRange.start;
            var rangeCount = geometry.drawRange.count;
            var groupStart = group !== null ? group.start : 0;
            var groupCount = group !== null ? group.count : Infinity;
            var drawStart = THREE.Math.max(dataStart, rangeStart, groupStart);
            var drawEnd = THREE.Math.min(dataStart + dataCount, rangeStart + rangeCount, groupStart + groupCount) - 1;
            var drawCount = THREE.Math.max(0, drawEnd - drawStart + 1);
            if (object instanceof THREE.Mesh) {
                if (material.wireframe === true) {
                    this.state.setLineWidth(material.wireframeLinewidth * this.getTargetPixelRatio());
                    renderer.setMode(_gl.LINES);
                }
                else {
                    switch (object.drawMode) {
                        case THREE.TrianglesDrawMode:
                            renderer.setMode(_gl.TRIANGLES);
                            break;
                        case THREE.TriangleStripDrawMode:
                            renderer.setMode(_gl.TRIANGLE_STRIP);
                            break;
                        case THREE.TriangleFanDrawMode:
                            renderer.setMode(_gl.TRIANGLE_FAN);
                            break;
                    }
                }
            }
            else if (object instanceof THREE.Line) {
                var lineWidth = material.linewidth;
                if (lineWidth === undefined)
                    lineWidth = 1;
                this.state.setLineWidth(lineWidth * this.getTargetPixelRatio());
                if (object instanceof THREE.LineSegments) {
                    renderer.setMode(_gl.LINES);
                }
                else {
                    renderer.setMode(_gl.LINE_STRIP);
                }
            }
            else if (object instanceof THREE.Points) {
                renderer.setMode(_gl.POINTS);
            }
            if (geometry instanceof THREE.InstancedBufferGeometry) {
                if (geometry.maxInstancedCount > 0) {
                    renderer.renderInstances(geometry, drawStart, drawCount);
                }
            }
            else {
                renderer.render(drawStart, drawCount);
            }
        };
        ;
        WebGLRenderer.prototype.setupVertexAttributes = function (material, program, geometry, startIndex) {
            var state = this.state;
            var _gl = this.context;
            var objects = this.objects;
            var extension;
            if (geometry instanceof THREE.InstancedBufferGeometry) {
                extension = this.extensions.get('ANGLE_instanced_arrays');
                if (extension === null) {
                    console.error('THREE.WebGLRenderer.setupVertexAttributes: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
                    return;
                }
            }
            if (startIndex === undefined)
                startIndex = 0;
            state.initAttributes();
            var geometryAttributes = geometry.attributes;
            var programAttributes = program.getAttributes();
            var materialDefaultAttributeValues = material.defaultAttributeValues;
            for (var name in programAttributes) {
                var programAttribute = programAttributes[name];
                if (programAttribute >= 0) {
                    var geometryAttribute = geometryAttributes[name];
                    if (geometryAttribute !== undefined) {
                        var type = _gl.FLOAT;
                        var array = geometryAttribute.array;
                        var normalized = geometryAttribute.normalized;
                        if (array instanceof Float32Array) {
                            type = _gl.FLOAT;
                        }
                        else if (array instanceof Float64Array) {
                            console.warn("Unsupported data buffer format: Float64Array");
                        }
                        else if (array instanceof Uint16Array) {
                            type = _gl.UNSIGNED_SHORT;
                        }
                        else if (array instanceof Int16Array) {
                            type = _gl.SHORT;
                        }
                        else if (array instanceof Uint32Array) {
                            type = _gl.UNSIGNED_INT;
                        }
                        else if (array instanceof Int32Array) {
                            type = _gl.INT;
                        }
                        else if (array instanceof Int8Array) {
                            type = _gl.BYTE;
                        }
                        else if (array instanceof Uint8Array) {
                            type = _gl.UNSIGNED_BYTE;
                        }
                        var size = geometryAttribute.itemSize;
                        var buffer = objects.getAttributeBuffer(geometryAttribute);
                        if (geometryAttribute instanceof THREE.InterleavedBufferAttribute) {
                            var data = geometryAttribute.data;
                            var stride = data.stride;
                            var offset = geometryAttribute.offset;
                            if (data instanceof THREE.InstancedInterleavedBuffer) {
                                state.enableAttributeAndDivisor(programAttribute, data.meshPerAttribute, extension);
                                if (geometry.maxInstancedCount === undefined) {
                                    geometry.maxInstancedCount = data.meshPerAttribute * data.count;
                                }
                            }
                            else {
                                state.enableAttribute(programAttribute);
                            }
                            _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
                            _gl.vertexAttribPointer(programAttribute, size, type, normalized, stride * data.array.BYTES_PER_ELEMENT, (startIndex * stride + offset) * data.array.BYTES_PER_ELEMENT);
                        }
                        else {
                            if (geometryAttribute instanceof THREE.InstancedBufferAttribute) {
                                state.enableAttributeAndDivisor(programAttribute, geometryAttribute.meshPerAttribute, extension);
                                if (geometry.maxInstancedCount === undefined) {
                                    geometry.maxInstancedCount = geometryAttribute.meshPerAttribute * geometryAttribute.count;
                                }
                            }
                            else {
                                state.enableAttribute(programAttribute);
                            }
                            _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
                            _gl.vertexAttribPointer(programAttribute, size, type, normalized, 0, startIndex * size * geometryAttribute.array.BYTES_PER_ELEMENT);
                        }
                    }
                    else if (materialDefaultAttributeValues !== undefined) {
                        var value = materialDefaultAttributeValues[name];
                        if (value !== undefined) {
                            switch (value.length) {
                                case 2:
                                    _gl.vertexAttrib2fv(programAttribute, value);
                                    break;
                                case 3:
                                    _gl.vertexAttrib3fv(programAttribute, value);
                                    break;
                                case 4:
                                    _gl.vertexAttrib4fv(programAttribute, value);
                                    break;
                                default:
                                    _gl.vertexAttrib1fv(programAttribute, value);
                            }
                        }
                    }
                }
            }
            state.disableUnusedAttributes();
        };
        WebGLRenderer.prototype.absNumericalSort = function (a, b) {
            return THREE.Math.abs(b[0]) - THREE.Math.abs(a[0]);
        };
        WebGLRenderer.prototype.painterSortStable = function (a, b) {
            if (a.object.renderOrder !== b.object.renderOrder) {
                return a.object.renderOrder - b.object.renderOrder;
            }
            else if (a.material.program && b.material.program && a.material.program !== b.material.program) {
                return a.material.program.id - b.material.program.id;
            }
            else if (a.material.id !== b.material.id) {
                return a.material.id - b.material.id;
            }
            else if (a.z !== b.z) {
                return a.z - b.z;
            }
            else {
                return a.id - b.id;
            }
        };
        WebGLRenderer.prototype.reversePainterSortStable = function (a, b) {
            if (a.object.renderOrder !== b.object.renderOrder) {
                return a.object.renderOrder - b.object.renderOrder;
            }
            if (a.z !== b.z) {
                return b.z - a.z;
            }
            else {
                return a.id - b.id;
            }
        };
        WebGLRenderer.prototype.render = function (scene, camera, renderTarget, forceClear) {
            if (camera instanceof THREE.Camera === false) {
                console.error('THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.');
                return;
            }
            var fog = scene.fog;
            this._currentGeometryProgram = '';
            this._currentMaterialId = -1;
            this._currentCamera = null;
            if (scene.autoUpdate === true)
                scene.updateMatrixWorld();
            if (camera.parent === null)
                camera.updateMatrixWorld();
            camera.matrixWorldInverse.getInverse(camera.matrixWorld);
            this._projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
            this._frustum.setFromMatrix(this._projScreenMatrix);
            this.lights.length = 0;
            this.opaqueObjectsLastIndex = -1;
            this.transparentObjectsLastIndex = -1;
            this.sprites.length = 0;
            this.lensFlares.length = 0;
            this._localClippingEnabled = this.localClippingEnabled;
            this._clippingEnabled = this._clipping.init(this.clippingPlanes, this._localClippingEnabled, camera);
            this.projectObject(scene, camera);
            this.opaqueObjects.length = this.opaqueObjectsLastIndex + 1;
            this.transparentObjects.length = this.transparentObjectsLastIndex + 1;
            if (this.sortObjects === true) {
                this.opaqueObjects.sort(this.painterSortStable);
                this.transparentObjects.sort(this.reversePainterSortStable);
            }
            if (this._clippingEnabled)
                this._clipping.beginShadows();
            this.setupShadows(this.lights);
            this.shadowMap.render(scene, camera);
            this.setupLights(this.lights, camera);
            if (this._clippingEnabled)
                this._clipping.endShadows();
            this._infoRender.calls = 0;
            this._infoRender.vertices = 0;
            this._infoRender.faces = 0;
            this._infoRender.points = 0;
            if (renderTarget === undefined) {
                renderTarget = null;
            }
            this.setRenderTarget(renderTarget);
            var background = scene.background;
            if (background === null) {
                this.glClearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearAlpha);
            }
            else if (background instanceof THREE.Color) {
                this.glClearColor(background.r, background.g, background.b, 1);
            }
            if (this.autoClear || forceClear) {
                this.clear(this.autoClearColor, this.autoClearDepth, this.autoClearStencil);
            }
            if (background instanceof THREE.CubeTexture) {
                this.backgroundCamera2.projectionMatrix.copy(camera.projectionMatrix);
                this.backgroundCamera2.matrixWorld.extractRotation(camera.matrixWorld);
                this.backgroundCamera2.matrixWorldInverse.getInverse(this.backgroundCamera2.matrixWorld);
                this.backgroundBoxMesh.material.uniforms["tCube"].value = background;
                this.backgroundBoxMesh.modelViewMatrix.multiplyMatrices(this.backgroundCamera2.matrixWorldInverse, this.backgroundBoxMesh.matrixWorld);
                this.objects.update(this.backgroundBoxMesh);
                this.renderBufferDirect(this.backgroundCamera2, null, this.backgroundBoxMesh.geometry, this.backgroundBoxMesh.material, this.backgroundBoxMesh, null);
            }
            else if (background instanceof THREE.Texture) {
                this.backgroundPlaneMesh.material.map = background;
                this.objects.update(this.backgroundPlaneMesh);
                this.renderBufferDirect(this.backgroundCamera, null, this.backgroundPlaneMesh.geometry, this.backgroundPlaneMesh.material, this.backgroundPlaneMesh, null);
            }
            if (scene.overrideMaterial) {
                var overrideMaterial = scene.overrideMaterial;
                this.renderObjects(this.opaqueObjects, camera, fog, overrideMaterial);
                this.renderObjects(this.transparentObjects, camera, fog, overrideMaterial);
            }
            else {
                this.state.setBlending(THREE.NoBlending);
                this.renderObjects(this.opaqueObjects, camera, fog);
                this.renderObjects(this.transparentObjects, camera, fog);
            }
            this.spritePlugin.render(scene, camera);
            this.lensFlarePlugin.render(scene, camera, this._currentViewport);
            if (renderTarget) {
                this.textures.updateRenderTargetMipmap(renderTarget);
            }
            this.state.setDepthTest(true);
            this.state.setDepthWrite(true);
            this.state.setColorWrite(true);
        };
        WebGLRenderer.prototype.pushRenderItem = function (object, geometry, material, z, group) {
            var array;
            var index;
            if (material.transparent) {
                array = this.transparentObjects;
                index = ++this.transparentObjectsLastIndex;
            }
            else {
                array = this.opaqueObjects;
                index = ++this.opaqueObjectsLastIndex;
            }
            var renderItem = array[index];
            if (renderItem !== undefined) {
                renderItem.id = object.id;
                renderItem.object = object;
                renderItem.geometry = geometry;
                renderItem.material = material;
                renderItem.z = this._vector3.z;
                renderItem.group = group;
            }
            else {
                renderItem = {
                    id: object.id,
                    object: object,
                    geometry: geometry,
                    material: material,
                    z: this._vector3.z,
                    group: group
                };
                array.push(renderItem);
            }
        };
        WebGLRenderer.prototype.isObjectViewable = function (object) {
            var geometry = object.geometry;
            if (geometry.boundingSphere === null)
                geometry.computeBoundingSphere();
            this._sphere.copy(geometry.boundingSphere).
                applyMatrix4(object.matrixWorld);
            return this.isSphereViewable(this._sphere);
        };
        WebGLRenderer.prototype.isSpriteViewable = function (sprite) {
            this._sphere.center.set(0, 0, 0);
            this._sphere.radius = 0.7071067811865476;
            this._sphere.applyMatrix4(sprite.matrixWorld);
            return this.isSphereViewable(this._sphere);
        };
        WebGLRenderer.prototype.isSphereViewable = function (sphere) {
            if (!this._frustum.intersectsSphere(sphere))
                return false;
            var numPlanes = this._clipping.numPlanes;
            if (numPlanes === 0)
                return true;
            var planes = this.clippingPlanes, center = sphere.center, negRad = -sphere.radius, i = 0;
            do {
                if (planes[i].distanceToPoint(center) < negRad)
                    return false;
            } while (++i !== numPlanes);
            return true;
        };
        WebGLRenderer.prototype.projectObject = function (object, camera) {
            var _vector3 = this._vector3;
            if (object.visible === false)
                return;
            if (object.layers.test(camera.layers)) {
                if (object instanceof THREE.Light) {
                    this.lights.push(object);
                }
                else if (object instanceof THREE.Sprite) {
                    if (object.frustumCulled === false || this.isSpriteViewable(object) === true) {
                        this.sprites.push(object);
                    }
                }
                else if (object instanceof THREE.LensFlare) {
                    this.lensFlares.push(object);
                }
                else if (object instanceof THREE.ImmediateRenderObject) {
                    if (this.sortObjects === true) {
                        _vector3.setFromMatrixPosition(object.matrixWorld);
                        _vector3.applyProjection(this._projScreenMatrix);
                    }
                    this.pushRenderItem(object, null, object.material, this._vector3.z, null);
                }
                else if (object instanceof THREE.Mesh
                    || object instanceof THREE.Line
                    || object instanceof THREE.Points) {
                    if (object instanceof THREE.SkinnedMesh) {
                        object.skeleton.update();
                    }
                    if (object.frustumCulled === false
                        || this.isObjectViewable(object) === true) {
                        var material = object.material;
                        if (material.visible === true) {
                            if (this.sortObjects === true) {
                                _vector3.setFromMatrixPosition(object.matrixWorld);
                                _vector3.applyProjection(this._projScreenMatrix);
                            }
                            var geometry = this.objects.update(object);
                            if (material instanceof THREE.MultiMaterial) {
                                var groups = geometry.groups;
                                var materials = material.materials;
                                for (var i = 0, l = groups.length; i < l; i++) {
                                    var group = groups[i];
                                    var groupMaterial = materials[group.materialIndex];
                                    if (groupMaterial.visible === true) {
                                        this.pushRenderItem(object, geometry, groupMaterial, _vector3.z, group);
                                    }
                                }
                            }
                            else {
                                this.pushRenderItem(object, geometry, material, _vector3.z, null);
                            }
                        }
                    }
                }
            }
            var children = object.children;
            for (var i_2 = 0, l_2 = children.length; i_2 < l_2; i_2++) {
                this.projectObject(children[i_2], camera);
            }
        };
        WebGLRenderer.prototype.renderObjects = function (renderList, camera, fog, overrideMaterial) {
            var _this = this;
            for (var i = 0, l = renderList.length; i < l; i++) {
                var renderItem = renderList[i];
                var object = renderItem.object;
                var geometry = renderItem.geometry;
                var material = overrideMaterial === undefined ? renderItem.material : overrideMaterial;
                var group = renderItem.group;
                object.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld);
                object.normalMatrix.getNormalMatrix(object.modelViewMatrix);
                if (object instanceof THREE.ImmediateRenderObject) {
                    this.setMaterial(material);
                    var program = this.setProgram(camera, fog, material, object);
                    this._currentGeometryProgram = '';
                    object.render(function (object) {
                        _this.renderBufferImmediate(object, program, material);
                    });
                }
                else {
                    this.renderBufferDirect(camera, fog, geometry, material, object, group);
                }
            }
        };
        WebGLRenderer.prototype.initMaterial = function (material, fog, object) {
            var materialProperties = this.properties.get(material);
            var parameters = this.programCache.getParameters(material, this._lights, fog, this._clipping.numPlanes, object);
            var code = this.programCache.getProgramCode(material, parameters);
            var program = materialProperties.program;
            var programChange = true;
            if (program === undefined) {
                material.addEventListener('dispose', this.onMaterialDispose_);
            }
            else if (program.code !== code) {
                this.releaseMaterialProgramReference(material);
            }
            else if (parameters.shaderID !== undefined) {
                return;
            }
            else {
                programChange = false;
            }
            if (programChange) {
                if (parameters.shaderID) {
                    var shader = THREE.ShaderLib[parameters.shaderID];
                    materialProperties.__webglShader = {
                        name: material.type,
                        uniforms: THREE.UniformsUtils.clone(shader.uniforms),
                        vertexShader: shader.vertexShader,
                        fragmentShader: shader.fragmentShader
                    };
                }
                else {
                    materialProperties.__webglShader = {
                        name: material.type,
                        uniforms: material.uniforms,
                        vertexShader: material.vertexShader,
                        fragmentShader: material.fragmentShader
                    };
                }
                material.__webglShader = materialProperties.__webglShader;
                program = this.programCache.acquireProgram(material, parameters, code);
                materialProperties.program = program;
                material.program = program;
            }
            var attributes = program.getAttributes();
            if (material.morphTargets) {
                material.numSupportedMorphTargets = 0;
                for (var i = 0; i < this.maxMorphTargets; i++) {
                    if (attributes['morphTarget' + i] >= 0) {
                        material.numSupportedMorphTargets++;
                    }
                }
            }
            if (material.morphNormals) {
                material.numSupportedMorphNormals = 0;
                for (var i = 0; i < this.maxMorphNormals; i++) {
                    if (attributes['morphNormal' + i] >= 0) {
                        material.numSupportedMorphNormals++;
                    }
                }
            }
            var uniforms = materialProperties.__webglShader.uniforms;
            if (!(material instanceof THREE.ShaderMaterial) &&
                !(material instanceof THREE.RawShaderMaterial) ||
                material.clipping === true) {
                materialProperties.numClippingPlanes = this._clipping.numPlanes;
                uniforms.clippingPlanes = this._clipping.uniform;
            }
            var _lights = this._lights;
            if (material.lights) {
                materialProperties.lightsHash = _lights.hash;
                uniforms.ambientLightColor.value = _lights.ambient;
                uniforms.directionalLights.value = _lights.directional;
                uniforms.spotLights.value = _lights.spot;
                uniforms.pointLights.value = _lights.point;
                uniforms.hemisphereLights.value = _lights.hemi;
                uniforms.directionalShadowMap.value = _lights.directionalShadowMap;
                uniforms.directionalShadowMatrix.value = _lights.directionalShadowMatrix;
                uniforms.spotShadowMap.value = _lights.spotShadowMap;
                uniforms.spotShadowMatrix.value = _lights.spotShadowMatrix;
                uniforms.pointShadowMap.value = _lights.pointShadowMap;
                uniforms.pointShadowMatrix.value = _lights.pointShadowMatrix;
            }
            var progUniforms = materialProperties.program.getUniforms();
            var uniformsList = THREE.WebGLUniforms.seqWithValue(progUniforms.seq, uniforms);
            materialProperties.uniformsList = uniformsList;
            materialProperties.dynamicUniforms = THREE.WebGLUniforms.splitDynamic(uniformsList, uniforms);
        };
        WebGLRenderer.prototype.setMaterial = function (material) {
            var state = this.state;
            var _gl = this.context;
            if (material.side !== THREE.DoubleSide)
                state.enable(_gl.CULL_FACE);
            else
                state.disable(_gl.CULL_FACE);
            state.setFlipSided(material.side === THREE.BackSide);
            if (material.transparent === true) {
                state.setBlending(material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha, material.premultipliedAlpha);
            }
            else {
                state.setBlending(THREE.NoBlending);
            }
            state.setDepthFunc(material.depthFunc);
            state.setDepthTest(material.depthTest);
            state.setDepthWrite(material.depthWrite);
            state.setColorWrite(material.colorWrite);
            state.setPolygonOffset(material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits);
        };
        WebGLRenderer.prototype.setProgram = function (camera, fog, material, object) {
            this._usedTextureUnits = 0;
            var _gl = this.context;
            var materialProperties = this.properties.get(material);
            if (this._clippingEnabled) {
                if (this._localClippingEnabled || camera !== this._currentCamera) {
                    var useCache = camera === this._currentCamera &&
                        material.id === this._currentMaterialId;
                    this._clipping.setState(material.clippingPlanes, material.clipShadows, camera, materialProperties, useCache);
                }
                if (materialProperties.numClippingPlanes !== undefined &&
                    materialProperties.numClippingPlanes !== this._clipping.numPlanes) {
                    material.needsUpdate = true;
                }
            }
            if (materialProperties.program === undefined) {
                material.needsUpdate = true;
            }
            if (materialProperties.lightsHash !== undefined &&
                materialProperties.lightsHash !== this._lights.hash) {
                material.needsUpdate = true;
            }
            if (material.needsUpdate) {
                this.initMaterial(material, fog, object);
                material.needsUpdate = false;
            }
            var refreshProgram = false;
            var refreshMaterial = false;
            var refreshLights = false;
            var program = materialProperties.program;
            var p_uniforms = program.getUniforms();
            var m_uniforms = materialProperties.__webglShader.uniforms;
            if (program.id !== this._currentProgram) {
                _gl.useProgram(program.program);
                this._currentProgram = program.id;
                refreshProgram = true;
                refreshMaterial = true;
                refreshLights = true;
            }
            if (material.id !== this._currentMaterialId) {
                this._currentMaterialId = material.id;
                refreshMaterial = true;
            }
            if (refreshProgram || camera !== this._currentCamera) {
                p_uniforms.set(_gl, camera, 'projectionMatrix');
                if (this.capabilities.logarithmicDepthBuffer) {
                    p_uniforms.setValue(_gl, 'logDepthBufFC', 2.0 / (THREE.Math.log(camera.far + 1.0) / THREE.Math.LN2));
                }
                if (camera !== this._currentCamera) {
                    this._currentCamera = camera;
                    refreshMaterial = true;
                    refreshLights = true;
                }
                if (material instanceof THREE.ShaderMaterial ||
                    material instanceof THREE.MeshPhongMaterial ||
                    material instanceof THREE.MeshStandardMaterial ||
                    material.envMap) {
                    var uCamPos = p_uniforms.map.cameraPosition;
                    if (uCamPos !== undefined) {
                        uCamPos.setValue(_gl, this._vector3.setFromMatrixPosition(camera.matrixWorld));
                    }
                }
                if (material instanceof THREE.MeshPhongMaterial ||
                    material instanceof THREE.MeshLambertMaterial ||
                    material instanceof THREE.MeshBasicMaterial ||
                    material instanceof THREE.MeshStandardMaterial ||
                    material instanceof THREE.ShaderMaterial ||
                    material.skinning) {
                    p_uniforms.setValue(_gl, 'viewMatrix', camera.matrixWorldInverse);
                }
                p_uniforms.set(_gl, this, 'toneMappingExposure');
                p_uniforms.set(_gl, this, 'toneMappingWhitePoint');
            }
            if (material.skinning) {
                p_uniforms.setOptional(_gl, object, 'bindMatrix');
                p_uniforms.setOptional(_gl, object, 'bindMatrixInverse');
                var skeleton = object.skeleton;
                if (skeleton) {
                    if (this.capabilities.floatVertexTextures && skeleton.useVertexTexture) {
                        p_uniforms.set(_gl, skeleton, 'boneTexture');
                        p_uniforms.set(_gl, skeleton, 'boneTextureWidth');
                        p_uniforms.set(_gl, skeleton, 'boneTextureHeight');
                    }
                    else {
                        p_uniforms.setOptional(_gl, skeleton, 'boneMatrices');
                    }
                }
            }
            if (refreshMaterial) {
                if (material.lights) {
                    this.markUniformsLightsNeedsUpdate(m_uniforms, refreshLights);
                }
                if (fog && material.fog) {
                    this.refreshUniformsFog(m_uniforms, fog);
                }
                if (material instanceof THREE.MeshBasicMaterial ||
                    material instanceof THREE.MeshLambertMaterial ||
                    material instanceof THREE.MeshPhongMaterial ||
                    material instanceof THREE.MeshStandardMaterial ||
                    material instanceof THREE.MeshDepthMaterial) {
                    this.refreshUniformsCommon(m_uniforms, material);
                }
                if (material instanceof THREE.LineBasicMaterial) {
                    this.refreshUniformsLine(m_uniforms, material);
                }
                else if (material instanceof THREE.LineDashedMaterial) {
                    this.refreshUniformsLine(m_uniforms, material);
                    this.refreshUniformsDash(m_uniforms, material);
                }
                else if (material instanceof THREE.PointsMaterial) {
                    this.refreshUniformsPoints(m_uniforms, material);
                }
                else if (material instanceof THREE.MeshLambertMaterial) {
                    this.refreshUniformsLambert(m_uniforms, material);
                }
                else if (material instanceof THREE.MeshPhongMaterial) {
                    this.refreshUniformsPhong(m_uniforms, material);
                }
                else if (material instanceof THREE.MeshPhysicalMaterial) {
                    this.refreshUniformsPhysical(m_uniforms, material);
                }
                else if (material instanceof THREE.MeshStandardMaterial) {
                    this.refreshUniformsStandard(m_uniforms, material);
                }
                else if (material instanceof THREE.MeshDepthMaterial) {
                    if (material.displacementMap) {
                        m_uniforms.displacementMap.value = material.displacementMap;
                        m_uniforms.displacementScale.value = material.displacementScale;
                        m_uniforms.displacementBias.value = material.displacementBias;
                    }
                }
                else if (material instanceof THREE.MeshNormalMaterial) {
                    m_uniforms.opacity.value = material.opacity;
                }
                THREE.WebGLUniforms.upload(_gl, materialProperties.uniformsList, m_uniforms, this);
            }
            p_uniforms.set(_gl, object, 'modelViewMatrix');
            p_uniforms.set(_gl, object, 'normalMatrix');
            p_uniforms.setValue(_gl, 'modelMatrix', object.matrixWorld);
            var dynUniforms = materialProperties.dynamicUniforms;
            if (dynUniforms !== null) {
                THREE.WebGLUniforms.evalDynamic(dynUniforms, m_uniforms, object, camera);
                THREE.WebGLUniforms.upload(_gl, dynUniforms, m_uniforms, this);
            }
            return program;
        };
        WebGLRenderer.prototype.refreshUniformsCommon = function (uniforms, material) {
            uniforms.opacity.value = material.opacity;
            uniforms.diffuse.value = material.color;
            if (material.emissive) {
                uniforms.emissive.value.copy(material.emissive).multiplyScalar(material.emissiveIntensity);
            }
            uniforms.map.value = material.map;
            uniforms.specularMap.value = material.specularMap;
            uniforms.alphaMap.value = material.alphaMap;
            if (material.aoMap) {
                uniforms.aoMap.value = material.aoMap;
                uniforms.aoMapIntensity.value = material.aoMapIntensity;
            }
            var uvScaleMap;
            if (material.map) {
                uvScaleMap = material.map;
            }
            else if (material.specularMap) {
                uvScaleMap = material.specularMap;
            }
            else if (material.displacementMap) {
                uvScaleMap = material.displacementMap;
            }
            else if (material.normalMap) {
                uvScaleMap = material.normalMap;
            }
            else if (material.bumpMap) {
                uvScaleMap = material.bumpMap;
            }
            else if (material.roughnessMap) {
                uvScaleMap = material.roughnessMap;
            }
            else if (material.metalnessMap) {
                uvScaleMap = material.metalnessMap;
            }
            else if (material.alphaMap) {
                uvScaleMap = material.alphaMap;
            }
            else if (material.emissiveMap) {
                uvScaleMap = material.emissiveMap;
            }
            if (uvScaleMap !== undefined) {
                if (uvScaleMap instanceof THREE.WebGLRenderTarget) {
                    uvScaleMap = uvScaleMap.texture;
                }
                var offset = uvScaleMap.offset;
                var repeat = uvScaleMap.repeat;
                uniforms.offsetRepeat.value.set(offset.x, offset.y, repeat.x, repeat.y);
            }
            uniforms.envMap.value = material.envMap;
            uniforms.flipEnvMap.value = (!(material.envMap instanceof THREE.CubeTexture)) ? 1 : -1;
            uniforms.reflectivity.value = material.reflectivity;
            uniforms.refractionRatio.value = material.refractionRatio;
        };
        WebGLRenderer.prototype.refreshUniformsLine = function (uniforms, material) {
            uniforms.diffuse.value = material.color;
            uniforms.opacity.value = material.opacity;
        };
        WebGLRenderer.prototype.refreshUniformsDash = function (uniforms, material) {
            uniforms.dashSize.value = material.dashSize;
            uniforms.totalSize.value = material.dashSize + material.gapSize;
            uniforms.scale.value = material.scale;
        };
        WebGLRenderer.prototype.refreshUniformsPoints = function (uniforms, material) {
            uniforms.diffuse.value = material.color;
            uniforms.opacity.value = material.opacity;
            uniforms.size.value = material.size * this._pixelRatio;
            uniforms.scale.value = this._canvas.clientHeight * 0.5;
            uniforms.map.value = material.map;
            if (material.map !== null) {
                var offset = material.map.offset;
                var repeat = material.map.repeat;
                uniforms.offsetRepeat.value.set(offset.x, offset.y, repeat.x, repeat.y);
            }
        };
        WebGLRenderer.prototype.refreshUniformsFog = function (uniforms, fog) {
            uniforms.fogColor.value = fog.color;
            if (fog instanceof THREE.Fog) {
                uniforms.fogNear.value = fog.near;
                uniforms.fogFar.value = fog.far;
            }
            else if (fog instanceof THREE.FogExp2) {
                uniforms.fogDensity.value = fog.density;
            }
        };
        WebGLRenderer.prototype.refreshUniformsLambert = function (uniforms, material) {
            if (material.lightMap) {
                uniforms.lightMap.value = material.lightMap;
                uniforms.lightMapIntensity.value = material.lightMapIntensity;
            }
            if (material.emissiveMap) {
                uniforms.emissiveMap.value = material.emissiveMap;
            }
        };
        WebGLRenderer.prototype.refreshUniformsPhong = function (uniforms, material) {
            uniforms.specular.value = material.specular;
            uniforms.shininess.value = THREE.Math.max(material.shininess, 1e-4);
            if (material.lightMap) {
                uniforms.lightMap.value = material.lightMap;
                uniforms.lightMapIntensity.value = material.lightMapIntensity;
            }
            if (material.emissiveMap) {
                uniforms.emissiveMap.value = material.emissiveMap;
            }
            if (material.bumpMap) {
                uniforms.bumpMap.value = material.bumpMap;
                uniforms.bumpScale.value = material.bumpScale;
            }
            if (material.normalMap) {
                uniforms.normalMap.value = material.normalMap;
                uniforms.normalScale.value.copy(material.normalScale);
            }
            if (material.displacementMap) {
                uniforms.displacementMap.value = material.displacementMap;
                uniforms.displacementScale.value = material.displacementScale;
                uniforms.displacementBias.value = material.displacementBias;
            }
        };
        WebGLRenderer.prototype.refreshUniformsStandard = function (uniforms, material) {
            uniforms.roughness.value = material.roughness;
            uniforms.metalness.value = material.metalness;
            if (material.roughnessMap) {
                uniforms.roughnessMap.value = material.roughnessMap;
            }
            if (material.metalnessMap) {
                uniforms.metalnessMap.value = material.metalnessMap;
            }
            if (material.lightMap) {
                uniforms.lightMap.value = material.lightMap;
                uniforms.lightMapIntensity.value = material.lightMapIntensity;
            }
            if (material.emissiveMap) {
                uniforms.emissiveMap.value = material.emissiveMap;
            }
            if (material.bumpMap) {
                uniforms.bumpMap.value = material.bumpMap;
                uniforms.bumpScale.value = material.bumpScale;
            }
            if (material.normalMap) {
                uniforms.normalMap.value = material.normalMap;
                uniforms.normalScale.value.copy(material.normalScale);
            }
            if (material.displacementMap) {
                uniforms.displacementMap.value = material.displacementMap;
                uniforms.displacementScale.value = material.displacementScale;
                uniforms.displacementBias.value = material.displacementBias;
            }
            if (material.envMap) {
                uniforms.envMapIntensity.value = material.envMapIntensity;
            }
        };
        WebGLRenderer.prototype.refreshUniformsPhysical = function (uniforms, material) {
            uniforms.clearCoat.value = material.clearCoat;
            uniforms.clearCoatRoughness.value = material.clearCoatRoughness;
            this.refreshUniformsStandard(uniforms, material);
        };
        WebGLRenderer.prototype.markUniformsLightsNeedsUpdate = function (uniforms, value) {
            uniforms.ambientLightColor.needsUpdate = value;
            uniforms.directionalLights.needsUpdate = value;
            uniforms.pointLights.needsUpdate = value;
            uniforms.spotLights.needsUpdate = value;
            uniforms.hemisphereLights.needsUpdate = value;
        };
        WebGLRenderer.prototype.setupShadows = function (lights) {
            var lightShadowsLength = 0;
            for (var i = 0, l = lights.length; i < l; i++) {
                var light = lights[i];
                if (light.castShadow) {
                    this._lights.shadows[lightShadowsLength++] = light;
                }
            }
            this._lights.shadows.length = lightShadowsLength;
        };
        WebGLRenderer.prototype.setupLights = function (lights, camera) {
            var _lights = this._lights;
            var _vector3 = this._vector3;
            var lightCache = this.lightCache;
            var l, ll;
            var light;
            var r = 0, g = 0, b = 0, color, intensity, distance, shadowMap, viewMatrix = camera.matrixWorldInverse, directionalLength = 0, pointLength = 0, spotLength = 0, hemiLength = 0;
            for (l = 0, ll = lights.length; l < ll; l++) {
                light = lights[l];
                color = light.color;
                intensity = light.intensity;
                distance = light.distance;
                shadowMap = (light.shadow && light.shadow.map) ? light.shadow.map.texture : null;
                if (light instanceof THREE.AmbientLight) {
                    r += color.r * intensity;
                    g += color.g * intensity;
                    b += color.b * intensity;
                }
                else if (light instanceof THREE.DirectionalLight) {
                    var uniforms = lightCache.get(light);
                    uniforms.color.copy(light.color).multiplyScalar(light.intensity);
                    uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                    _vector3.setFromMatrixPosition(light.target.matrixWorld);
                    uniforms.direction.sub(_vector3);
                    uniforms.direction.transformDirection(viewMatrix);
                    uniforms.shadow = light.castShadow;
                    if (light.castShadow) {
                        uniforms.shadowBias = light.shadow.bias;
                        uniforms.shadowRadius = light.shadow.radius;
                        uniforms.shadowMapSize = light.shadow.mapSize;
                    }
                    _lights.directionalShadowMap[directionalLength] = shadowMap;
                    _lights.directionalShadowMatrix[directionalLength] = light.shadow.matrix;
                    _lights.directional[directionalLength++] = uniforms;
                }
                else if (light instanceof THREE.SpotLight) {
                    var uniforms = lightCache.get(light);
                    uniforms.position.setFromMatrixPosition(light.matrixWorld);
                    uniforms.position.applyMatrix4(viewMatrix);
                    uniforms.color.copy(color).multiplyScalar(intensity);
                    uniforms.distance = distance;
                    uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                    _vector3.setFromMatrixPosition(light.target.matrixWorld);
                    uniforms.direction.sub(_vector3);
                    uniforms.direction.transformDirection(viewMatrix);
                    uniforms.coneCos = THREE.Math.cos(light.angle);
                    uniforms.penumbraCos = THREE.Math.cos(light.angle * (1 - light.penumbra));
                    uniforms.decay = (light.distance === 0) ? 0.0 : light.decay;
                    uniforms.shadow = light.castShadow;
                    if (light.castShadow) {
                        uniforms.shadowBias = light.shadow.bias;
                        uniforms.shadowRadius = light.shadow.radius;
                        uniforms.shadowMapSize = light.shadow.mapSize;
                    }
                    _lights.spotShadowMap[spotLength] = shadowMap;
                    _lights.spotShadowMatrix[spotLength] = light.shadow.matrix;
                    _lights.spot[spotLength++] = uniforms;
                }
                else if (light instanceof THREE.PointLight) {
                    var uniforms = lightCache.get(light);
                    uniforms.position.setFromMatrixPosition(light.matrixWorld);
                    uniforms.position.applyMatrix4(viewMatrix);
                    uniforms.color.copy(light.color).multiplyScalar(light.intensity);
                    uniforms.distance = light.distance;
                    uniforms.decay = (light.distance === 0) ? 0.0 : light.decay;
                    uniforms.shadow = light.castShadow;
                    if (light.castShadow) {
                        uniforms.shadowBias = light.shadow.bias;
                        uniforms.shadowRadius = light.shadow.radius;
                        uniforms.shadowMapSize = light.shadow.mapSize;
                    }
                    _lights.pointShadowMap[pointLength] = shadowMap;
                    if (_lights.pointShadowMatrix[pointLength] === undefined) {
                        _lights.pointShadowMatrix[pointLength] = new THREE.Matrix4();
                    }
                    _vector3.setFromMatrixPosition(light.matrixWorld).negate();
                    _lights.pointShadowMatrix[pointLength].identity().setPosition(_vector3);
                    _lights.point[pointLength++] = uniforms;
                }
                else if (light instanceof THREE.HemisphereLight) {
                    var uniforms = lightCache.get(light);
                    uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                    uniforms.direction.transformDirection(viewMatrix);
                    uniforms.direction.normalize();
                    uniforms.skyColor.copy(light.color).multiplyScalar(intensity);
                    uniforms.groundColor.copy(light.groundColor).multiplyScalar(intensity);
                    _lights.hemi[hemiLength++] = uniforms;
                }
            }
            _lights.ambient[0] = r;
            _lights.ambient[1] = g;
            _lights.ambient[2] = b;
            _lights.directional.length = directionalLength;
            _lights.spot.length = spotLength;
            _lights.point.length = pointLength;
            _lights.hemi.length = hemiLength;
            _lights.hash = directionalLength + ',' + pointLength + ',' + spotLength + ',' + hemiLength + ',' + _lights.shadows.length;
        };
        WebGLRenderer.prototype.setFaceCulling = function (cullFace, frontFaceDirection) {
            var state = this.state;
            state.setCullFace(cullFace);
            state.setFlipSided(frontFaceDirection === THREE.FrontFaceDirectionCW);
        };
        ;
        WebGLRenderer.prototype.allocTextureUnit = function () {
            var textureUnit = this._usedTextureUnits;
            if (textureUnit >= this.capabilities.maxTextures) {
                console.warn('WebGLRenderer: trying to use ' + textureUnit + ' texture units while this GPU supports only ' + this.capabilities.maxTextures);
            }
            this._usedTextureUnits += 1;
            return textureUnit;
        };
        WebGLRenderer.prototype.setTexture2D = function (texture, slot) {
            if (texture instanceof THREE.WebGLRenderTarget) {
                if (!WebGLRenderer.warned) {
                    console.warn("WebGLRenderer.setTexture2D: don't use render targets as textures. Use their .texture property instead.");
                    WebGLRenderer.warned = true;
                }
                texture = texture.texture;
            }
            this.textures.setTexture2D(texture, slot);
        };
        WebGLRenderer.prototype.setTextureCube = function (texture, slot) {
            var textures = this.textures;
            if (texture instanceof THREE.WebGLRenderTargetCube) {
                if (!WebGLRenderer.warned_setTextureCube) {
                    console.warn("THREE.WebGLRenderer.setTextureCube: don't use cube render targets as textures. Use their .texture property instead.");
                    WebGLRenderer.warned_setTextureCube = true;
                }
                texture = texture.texture;
            }
            if (texture instanceof THREE.CubeTexture ||
                (Array.isArray(texture.image) && texture.image.length === 6)) {
                textures.setTextureCube(texture, slot);
            }
            else {
                textures.setTextureCubeDynamic(texture, slot);
            }
        };
        WebGLRenderer.prototype.getCurrentRenderTarget = function () {
            return this._currentRenderTarget;
        };
        ;
        WebGLRenderer.prototype.setRenderTarget = function (renderTarget) {
            var properties = this.properties;
            var textures = this.textures;
            var _gl = this.context;
            var state = this.state;
            this._currentRenderTarget = renderTarget;
            if (renderTarget && properties.get(renderTarget).__webglFramebuffer === undefined) {
                textures.setupRenderTarget(renderTarget);
            }
            var isCube = (renderTarget instanceof THREE.WebGLRenderTargetCube);
            var renderTargetCube = isCube
                ? renderTarget
                : null;
            var framebuffer;
            if (renderTarget) {
                var renderTargetProperties = properties.get(renderTarget);
                if (isCube) {
                    framebuffer = renderTargetProperties.__webglFramebuffer[renderTargetCube.activeCubeFace];
                }
                else {
                    framebuffer = renderTargetProperties.__webglFramebuffer;
                }
                this._currentScissor.copy(renderTarget.scissor);
                this._currentScissorTest = renderTarget.scissorTest;
                this._currentViewport.copy(renderTarget.viewport);
            }
            else {
                framebuffer = null;
                this._currentScissor.copy(this._scissor).multiplyScalar(this._pixelRatio);
                this._currentScissorTest = this._scissorTest;
                this._currentViewport.copy(this._viewport).multiplyScalar(this._pixelRatio);
            }
            if (this._currentFramebuffer !== framebuffer) {
                _gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer);
                this._currentFramebuffer = framebuffer;
            }
            state.scissor(this._currentScissor);
            state.setScissorTest(this._currentScissorTest);
            state.viewport(this._currentViewport);
            if (isCube) {
                var textureProperties = properties.get(renderTarget.texture);
                _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTargetCube.activeCubeFace, textureProperties.__webglTexture, renderTargetCube.activeMipMapLevel);
            }
        };
        ;
        WebGLRenderer.prototype.readRenderTargetPixels = function (renderTarget, x, y, width, height, buffer) {
            THREE.readRenderTargetPixels(this, renderTarget, x, y, width, height, buffer);
        };
        WebGLRenderer.warned = false;
        WebGLRenderer.warned_setTextureCube = false;
        return WebGLRenderer;
    }());
    THREE.WebGLRenderer = WebGLRenderer;
})(THREE || (THREE = {}));
