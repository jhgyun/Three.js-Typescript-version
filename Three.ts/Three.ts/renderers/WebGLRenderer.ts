/* 
 * @author supereggbert / http://www.paulbrunt.co.uk/
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 * @author tschw
 */

namespace THREE
{
    export interface InfoRenderer
    {
        calls?: number;
        vertices?: number;
        faces?: number;
        points?: number;
    }
    export interface InfoMemory
    {
        geometries?: number;
        textures?: number;
    }
    export interface WebGLRendererInfo
    {
        render: InfoRenderer;
        memory: InfoMemory,
        programs: any
    }
    export interface LightArrayCache
    {
        hash: string;
        ambient: number[];
        directional: ILightUniforms[];
        directionalShadowMap: Texture[];
        directionalShadowMatrix: Matrix4[];
        spot: ILightUniforms[];
        spotShadowMap: Texture[];
        spotShadowMatrix: Matrix4[];
        point: ILightUniforms[];
        pointShadowMap: Texture[];
        pointShadowMatrix: Matrix4[];
        hemi: ILightUniforms[];
        shadows: Light[]
    }
    export interface IMaterialPropertyCache
    {
        program?: WebGLProgram;
        __webglShader?: {
            name: string
            uniforms: IUniforms,
            vertexShader: string,
            fragmentShader: string
        };

        numClippingPlanes?: number;
        lightsHash?: string;
        uniformsList?: UniformType[];
        dynamicUniforms?: UniformType[];
        clippingState?: Float32Array;
    }
    interface IRenderItem
    {
        id?: number;
        object?: Object3D;
        geometry?: BufferGeometry;
        material?: IMaterial;
        z?: number;
        group?: any;
    }
    export interface WebGLRendererParams
    {
        canvas?: HTMLCanvasElement,
        context?: any,
        alpha?: boolean,
        depth?: boolean,
        stencil?: boolean,
        antialias?: boolean,
        premultipliedAlpha?: boolean,
        preserveDrawingBuffer?: boolean
    }
    export class WebGLRenderer
    {
        domElement: HTMLElement;
        context: WebGLRenderingContext;
        autoClear: boolean;
        autoClearColor: boolean;
        autoClearDepth: boolean;
        autoClearStencil: boolean;
        sortObjects: boolean;
        clippingPlanes: Plane[];
        localClippingEnabled: boolean;
        gammaFactor: number;
        gammaInput: boolean;
        gammaOutput: boolean;
        physicallyCorrectLights: boolean;
        toneMapping: number;
        toneMappingExposure: number;
        toneMappingWhitePoint: number;
        maxMorphTargets: number;
        maxMorphNormals: number;
        info: WebGLRendererInfo;
        capabilities: WebGLCapabilities;
        extensions: WebGLExtensions;
        properties: WebGLProperties;
        state: WebGLState;
        shadowMap: WebGLShadowMap;

        parameters;
        _canvas: HTMLCanvasElement;
        _context;
        _alpha: boolean;
        _depth: boolean;
        _stencil: boolean;
        _antialias: boolean;
        _premultipliedAlpha: boolean;
        _preserveDrawingBuffer: boolean;
        lights: Light[];
        private opaqueObjects: IRenderItem[];
        private opaqueObjectsLastIndex: number;
        private transparentObjects: IRenderItem[];
        private transparentObjectsLastIndex: number;
        morphInfluences: Float32Array;
        sprites: Sprite[];
        lensFlares: LensFlare[]; 
        _currentRenderTarget: WebGLRenderTarget;
        _currentProgram: number;
        _currentFramebuffer;
        _currentMaterialId: number;
        _currentGeometryProgram;
        _currentCamera: Camera;

        private _currentScissor: Vector4;
        private _currentScissorTest: boolean;
        private _currentViewport: Vector4;
        private _usedTextureUnits: number;
        private _clearColor: Color;
        private _clearAlpha: number;
        private _width: number;
        private _height: number;
        private _pixelRatio: number;
        private _scissor: Vector4;
        private _scissorTest: boolean;
        private _viewport: Vector4;
        private _frustum: Frustum;
        private _clipping: WebGLClipping;
        private _clippingEnabled: boolean;
        private _localClippingEnabled: boolean;
        private _sphere: Sphere;
        private _projScreenMatrix: Matrix4;
        private _vector3: Vector3;
        private _lights: LightArrayCache;

        private _infoRender: InfoRenderer;
        private textures: WebGLTextures;
        private objects: WebGLObjects;
        private programCache: WebGLPrograms;
        private lightCache: WebGLLights;
        private bufferRenderer: WebGLBufferRenderer;
        private indexedBufferRenderer: WebGLIndexedBufferRenderer;
        private backgroundCamera: OrthographicCamera;
        private backgroundCamera2: PerspectiveCamera;
        private backgroundPlaneMesh: Mesh;
        private backgroundBoxShader: any;
        private backgroundBoxMesh: Mesh;
        private spritePlugin: SpritePlugin;
        private lensFlarePlugin: LensFlarePlugin;

        constructor(parameters?: WebGLRendererParams)
        {
            console.log('THREE.WebGLRenderer', REVISION);

            parameters = this.parameters = parameters || {};

            var _canvas: HTMLCanvasElement = this._canvas = parameters.canvas !== undefined ? parameters.canvas : document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas') as HTMLCanvasElement;
            var _context = this._context = parameters.context !== undefined ? parameters.context : null;

            this._alpha = parameters.alpha !== undefined ? parameters.alpha : false;
            this._depth = parameters.depth !== undefined ? parameters.depth : true;
            this._stencil = parameters.stencil !== undefined ? parameters.stencil : true;
            this._antialias = parameters.antialias !== undefined ? parameters.antialias : false;
            this._premultipliedAlpha = parameters.premultipliedAlpha !== undefined ? parameters.premultipliedAlpha : true;
            this._preserveDrawingBuffer = parameters.preserveDrawingBuffer !== undefined ? parameters.preserveDrawingBuffer : false;

            this.lights = [];

            this.opaqueObjects = [];
            this.opaqueObjectsLastIndex = - 1;
            this.transparentObjects = [];
            this.transparentObjectsLastIndex = - 1;

            this.morphInfluences = new Float32Array(8);

            this.sprites = [];
            this.lensFlares = [];

            // public properties

            this.domElement = _canvas;
            this.context = null;

            // clearing 
            this.autoClear = true;
            this.autoClearColor = true;
            this.autoClearDepth = true;
            this.autoClearStencil = true;

            // scene graph 
            this.sortObjects = true;

            // user-defined clipping

            this.clippingPlanes = [];
            this.localClippingEnabled = false;

            // physically based shading

            this.gammaFactor = 2.0;	// for backwards compatibility
            this.gammaInput = false;
            this.gammaOutput = false;

            // physical lights

            this.physicallyCorrectLights = false;

            // tone mapping

            this.toneMapping = LinearToneMapping;
            this.toneMappingExposure = 1.0;
            this.toneMappingWhitePoint = 1.0;

            // morphs

            this.maxMorphTargets = 8;
            this.maxMorphNormals = 4;

            // internal properties


            // internal state cache 
            this._currentProgram = null;
            this._currentRenderTarget = null;
            this._currentFramebuffer = null;
            this._currentMaterialId = - 1;
            this._currentGeometryProgram = '';
            this._currentCamera = null;

            this._currentScissor = new Vector4();
            this._currentScissorTest = null;

            this._currentViewport = new Vector4();

            // 
            this._usedTextureUnits = 0;

            //

            this._clearColor = new Color(0x000000);
            this._clearAlpha = 0;

            this._width = _canvas.width;
            this._height = _canvas.height;

            var _pixelRatio = this._pixelRatio = 1;

            var _scissor = this._scissor = new Vector4(0, 0, this._width, this._height);
            var _scissorTest = this._scissorTest = false;

            var _viewport = this._viewport = new Vector4(0, 0, this._width, this._height);

            // frustum 
            this._frustum = new Frustum();

            // clipping 
            this._clipping = new WebGLClipping();
            this._clippingEnabled = false;
            this._localClippingEnabled = false;

            this._sphere = new Sphere();

            // camera matrices cache 
            this._projScreenMatrix = new Matrix4();

            this._vector3 = new Vector3();

            // light arrays cache 
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

            // info 
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


            // initialize

            this.init_context();
            this.init_extensions();
              
            this.capabilities = new WebGLCapabilities(this.context, this.extensions, parameters);
            this.state = new WebGLState(this);
            this.properties = new WebGLProperties();
            this.textures = new WebGLTextures(this);
            this.objects = new WebGLObjects(this.context, this.properties, this.info);
            this.programCache = new WebGLPrograms(this, this.capabilities);
            this.lightCache = new WebGLLights();

            this.info.programs = this.programCache.programs;

            this.bufferRenderer = new WebGLBufferRenderer(this.context, this.extensions, this._infoRender);
            this.indexedBufferRenderer = new WebGLIndexedBufferRenderer(this.context, this.extensions, this._infoRender);

            // 
            this.backgroundCamera = new OrthographicCamera(- 1, 1, 1, - 1, 0, 1);
            this.backgroundCamera2 = new PerspectiveCamera();
            this.backgroundPlaneMesh = new Mesh(
                new PlaneBufferGeometry(2, 2),
                new MeshBasicMaterial({ depthTest: false, depthWrite: false, fog: false })
            );

            this.backgroundBoxShader = ShaderLib['cube'];
            this.backgroundBoxMesh = new Mesh(
                new BoxBufferGeometry(5, 5, 5),
                new ShaderMaterial({
                    uniforms: this.backgroundBoxShader.uniforms,
                    vertexShader: this.backgroundBoxShader.vertexShader,
                    fragmentShader: this.backgroundBoxShader.fragmentShader,
                    side: THREE.BackSide,
                    depthTest: false,
                    depthWrite: false  
                })
            );
            this.objects.update(this.backgroundPlaneMesh);
            this.objects.update(this.backgroundBoxMesh); 
            // 
            this.setDefaultGLState();
                 

            // shadow map 
            this.shadowMap = new WebGLShadowMap(this, this._lights, this.objects, this.capabilities);
             
            // Plugins 
            this.spritePlugin = new SpritePlugin(this);
            this.lensFlarePlugin = new LensFlarePlugin(this);

            //event handlers use lambda expression to cache 'this' scope 
            this.onContextLost_ = (event) =>
            {
                this.onContextLost(event);
            } 
            this.onMaterialDispose_ = (event) =>
            {
                this.onContextLost(event);
            }
        }

        private init_context()
        {
            var _gl: WebGLRenderingContext;
            try
            {
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

                if (_gl === null)
                {
                    if (this._canvas.getContext('webgl') !== null)
                    {
                        throw 'Error creating WebGL context with your selected attributes.';
                    }
                    else
                    {
                        throw 'Error creating WebGL context.';
                    }
                }

                // Some experimental-webgl implementations do not have getShaderPrecisionFormat 
                if (_gl.getShaderPrecisionFormat === undefined)
                {
                    _gl.getShaderPrecisionFormat = function ()
                    {
                        return { 'rangeMin': 1, 'rangeMax': 1, 'precision': 1 };
                    };
                }
                  
                this._canvas.addEventListener('webglcontextlost', this.onContextLost_, false);

                this.context = _gl;
            }
            catch (error)
            {
                console.error('THREE.WebGLRenderer: ' + error);
            }
             
        }
        private init_extensions()
        {
            var extensions = new WebGLExtensions(this.context);

            extensions.get('WEBGL_depth_texture');
            extensions.get('OES_texture_float');
            extensions.get('OES_texture_float_linear');
            extensions.get('OES_texture_half_float');
            extensions.get('OES_texture_half_float_linear');
            extensions.get('OES_standard_derivatives');
            extensions.get('ANGLE_instanced_arrays');

            if (extensions.get('OES_element_index_uint'))
            {
                BufferGeometry.MaxIndex = 4294967296;
            }

            this.extensions = extensions;
        }
        private getTargetPixelRatio()
        {
            return this._currentRenderTarget === null ? this._pixelRatio : 1;
        }
        private getContext(): WebGLRenderingContext
        {
            return this.context;
        };
        private glClearColor(r: number, g: number, b: number, a: number)
        {
            if (this._premultipliedAlpha === true)
            {
                r *= a; g *= a; b *= a;
            }
            this.state.clearColor(r, g, b, a);
        }
        private setDefaultGLState()
        {
            var _clearColor = this._clearColor;

            this.state.init();
            this.state.scissor(this._currentScissor.copy(this._scissor).multiplyScalar(this._pixelRatio));
            this.state.viewport(this._currentViewport.copy(this._viewport).multiplyScalar(this._pixelRatio));
            this.glClearColor(_clearColor.r, _clearColor.g, _clearColor.b, this._clearAlpha);
        }
        public resetGLState()
        {
            this._currentProgram = null;
            this._currentCamera = null;

            this._currentGeometryProgram = '';
            this._currentMaterialId = - 1;

            this.state.reset();
        }

        // API 
        public getContextAttributes(): WebGLContextAttributes
        {
            return this.context.getContextAttributes();
        };
        public forceContextLoss()
        {
            this.extensions.get('WEBGL_lose_context').loseContext();
        };
        public getMaxAnisotropy()
        {
            return this.capabilities.getMaxAnisotropy();
        };
        public getPrecision()
        {
            return this.capabilities.precision;
        };
        public getPixelRatio()
        {
            return this._pixelRatio;
        }
        public setPixelRatio(value: number)
        {
            if (value === undefined) return;
            this._pixelRatio = value;
            this.setSize(this._viewport.z, this._viewport.w, false);
        }
        public getSize()
        {
            return {
                width: this._width,
                height: this._height
            };
        }
        public setSize(width: number, height: number, updateStyle?: boolean)
        {
            this._width = width;
            this._height = height;

            this._canvas.width = width * this._pixelRatio;
            this._canvas.height = height * this._pixelRatio;

            if (updateStyle !== false)
            {
                this._canvas.style.width = width + 'px';
                this._canvas.style.height = height + 'px';
            }
            this.setViewport(0, 0, width, height);
        }
        public setViewport(x: number, y: number, width: number, height: number)
        {
            this.state.viewport(this._viewport.set(x, y, width, height));
        };
        public setScissor(x: number, y: number, width: number, height: number)
        {
            this.state.scissor(this._scissor.set(x, y, width, height));
        };
        public setScissorTest(boolean: boolean)
        {
            this.state.setScissorTest(this._scissorTest = boolean);
        }

        // Clearing

        public getClearColor()
        {
            return this._clearColor;
        }

        public setClearColor(color: number | Color, alpha?: number)
        {
            this._clearColor.set(color);
            this._clearAlpha = alpha !== undefined ? alpha : 1;
            this.glClearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearAlpha);
        };
        public getClearAlpha()
        {
            return this._clearAlpha;
        };
        public setClearAlpha(alpha)
        {
            var _clearColor = this._clearColor;
            this._clearAlpha = alpha;
            this.glClearColor(_clearColor.r, _clearColor.g, _clearColor.b, this._clearAlpha);
        };
        public clear(color?: boolean, depth?: boolean, stencil?: boolean)
        {
            var bits = 0;
            var _gl = this.context;

            if (color === undefined || color) bits |= _gl.COLOR_BUFFER_BIT;
            if (depth === undefined || depth) bits |= _gl.DEPTH_BUFFER_BIT;
            if (stencil === undefined || stencil) bits |= _gl.STENCIL_BUFFER_BIT;

            _gl.clear(bits);
        }
        public clearColor()
        {
            this.clear(true, false, false);
        }
        public clearDepth()
        {
            this.clear(false, true, false);
        }
        public clearStencil()
        {
            this.clear(false, false, true);
        }
        public clearTarget(renderTarget: WebGLRenderTarget, color?: boolean, depth?: boolean, stencil?: boolean)
        {
            this.setRenderTarget(renderTarget);
            this.clear(color, depth, stencil);
        }
        // Reset
        public dispose()
        {
            this.transparentObjects = [];
            this.transparentObjectsLastIndex = -1;
            this.opaqueObjects = [];
            this.opaqueObjectsLastIndex = -1;
            this._canvas.removeEventListener('webglcontextlost', this.onContextLost_, false);
        };
         
        // Events
        private onContextLost_: (event) => void;
        private onMaterialDispose_: (event) => void;

        private onContextLost(event)
        {
            event.preventDefault();

            this.resetGLState();
            this.setDefaultGLState();
            this.properties.clear();
        }
        private onMaterialDispose(event)
        {
            var material = event.target;
            material.removeEventListener('dispose', this.onMaterialDispose_);
            this.deallocateMaterial(material);
        }

        // Buffer deallocation 
        private deallocateMaterial(material: IMaterial)
        {
            this.releaseMaterialProgramReference(material);
            this.properties.delete(material);
        }
        private releaseMaterialProgramReference(material: IMaterial)
        {
            var programInfo = (this.properties.get(material) as IMaterialPropertyCache).program;

            material.program = undefined;

            if (programInfo !== undefined)
            {
                this.programCache.releaseProgram(programInfo);
            }
        }

        // Buffer rendering
        public renderBufferImmediate(object: ImmediateRenderObject, program: WebGLProgram, material: IMaterial)
        {
            var state = this.state;
            var properties = this.properties;
            var _gl = this.context;
            state.initAttributes();

            var buffers: 
            {
                position: WebGLBuffer,
                normal: WebGLBuffer,
                uv: WebGLBuffer,
                color: WebGLBuffer
            } = properties.get(object);

            if (object.hasPositions && !buffers.position) buffers.position = _gl.createBuffer();
            if (object.hasNormals && !buffers.normal) buffers.normal = _gl.createBuffer();
            if (object.hasUvs && !buffers.uv) buffers.uv = _gl.createBuffer();
            if (object.hasColors && !buffers.color) buffers.color = _gl.createBuffer();

            var attributes: {
                position: number,
                normal: number,
                color: number,
                uv: number
            };

            attributes = program.getAttributes() as any; 
            if (object.hasPositions)
            {
                _gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.position);
                _gl.bufferData(_gl.ARRAY_BUFFER, object.positionArray, _gl.DYNAMIC_DRAW);

                state.enableAttribute(attributes.position);
                _gl.vertexAttribPointer(attributes.position, 3, _gl.FLOAT, false, 0, 0);
            }

            if (object.hasNormals)
            {
                _gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.normal);

                if (material.type !== 'MeshPhongMaterial'
                    && material.type !== 'MeshStandardMaterial'
                    && material.type !== 'MeshPhysicalMaterial'
                    && material.shading === FlatShading)
                {

                    for (var i = 0, l = object.count * 3; i < l; i += 9)
                    {

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

            if (object.hasUvs && material.map)
            {
                _gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.uv);
                _gl.bufferData(_gl.ARRAY_BUFFER, object.uvArray, _gl.DYNAMIC_DRAW);

                state.enableAttribute(attributes.uv);
                _gl.vertexAttribPointer(attributes.uv, 2, _gl.FLOAT, false, 0, 0);
            }

            if (object.hasColors && material.vertexColors !== NoColors)
            {
                _gl.bindBuffer(_gl.ARRAY_BUFFER, buffers.color);
                _gl.bufferData(_gl.ARRAY_BUFFER, object.colorArray, _gl.DYNAMIC_DRAW);
                state.enableAttribute(attributes.color);
                _gl.vertexAttribPointer(attributes.color, 3, _gl.FLOAT, false, 0, 0);
            }

            state.disableUnusedAttributes();
            _gl.drawArrays(_gl.TRIANGLES, 0, object.count);
            object.count = 0;

        }
        public renderBufferDirect(camera: Camera, fog: IFog, geometry: BufferGeometry, material: IMaterial, object: IObject3D, group: IGeometryGroup)
        {
            var _gl = this.context;

            this.setMaterial(material);

            var program = this.setProgram(camera, fog, material, object);

            var updateBuffers = false;
            var geometryProgram = geometry.id + '_' + program.id + '_' + material.wireframe;

            if (geometryProgram !== this._currentGeometryProgram)
            {
                this._currentGeometryProgram = geometryProgram;
                updateBuffers = true;
            }

            // morph targets

            var morphTargetInfluences = object.morphTargetInfluences;

            if (morphTargetInfluences !== undefined)
            {
                var activeInfluences: number[][] = [];

                for (let i = 0, l = morphTargetInfluences.length; i < l; i++)
                {
                    var influence = morphTargetInfluences[i];
                    activeInfluences.push([influence, i]);
                }

                activeInfluences.sort(this.absNumericalSort);

                if (activeInfluences.length > 8)
                {
                    activeInfluences.length = 8;
                }

                var morphAttributes = geometry.morphAttributes;

                for (var i = 0, l = activeInfluences.length; i < l; i++)
                {
                    let influence = activeInfluences[i];
                    this.morphInfluences[i] = influence[0];

                    if (influence[0] !== 0)
                    {
                        let index = influence[1];

                        if (material.morphTargets === true && morphAttributes.position) geometry.addAttribute('morphTarget' + i, morphAttributes.position[index]);
                        if (material.morphNormals === true && morphAttributes.normal) geometry.addAttribute('morphNormal' + i, morphAttributes.normal[index]);

                    }
                    else
                    {
                        if (material.morphTargets === true) geometry.removeAttribute('morphTarget' + i);
                        if (material.morphNormals === true) geometry.removeAttribute('morphNormal' + i);
                    }
                }

                program.getUniforms().setValue(_gl, 'morphTargetInfluences', this.morphInfluences); 
                updateBuffers = true; 
            }

            //

            var index = geometry.index;
            var position = geometry.attributes.position;

            if (material.wireframe === true)
            { 
                index = this.objects.getWireframeAttribute(geometry); 
            }

            var renderer: IWebGLBufferRenderer;

            if (index !== null)
            {
                renderer = this.indexedBufferRenderer;
                renderer.setIndex(index);
            }
            else
            {
                renderer = this.bufferRenderer;
            }

            if (updateBuffers)
            {
                this.setupVertexAttributes(material, program, geometry);
                if (index !== null)
                {
                    _gl.bindBuffer(_gl.ELEMENT_ARRAY_BUFFER, this.objects.getAttributeBuffer(index));
                }
            }

            //

            var dataStart = 0;
            var dataCount = Infinity;

            if (index !== null)
            {
                dataCount = index.count;
            }
            else if (position !== undefined)
            {
                dataCount = position.count;
            }

            var rangeStart = geometry.drawRange.start;
            var rangeCount = geometry.drawRange.count;

            var groupStart = group !== null ? group.start : 0;
            var groupCount = group !== null ? group.count : Infinity;

            var drawStart = Math.max(dataStart, rangeStart, groupStart);
            var drawEnd = Math.min(dataStart + dataCount, rangeStart + rangeCount, groupStart + groupCount) - 1;

            var drawCount = Math.max(0, drawEnd - drawStart + 1);

            //

            if (object instanceof Mesh)
            {
                if (material.wireframe === true)
                {
                    this.state.setLineWidth(material.wireframeLinewidth * this.getTargetPixelRatio());
                    renderer.setMode(_gl.LINES);
                }
                else
                {
                    switch (object.drawMode)
                    {
                        case TrianglesDrawMode:
                            renderer.setMode(_gl.TRIANGLES);
                            break;

                        case TriangleStripDrawMode:
                            renderer.setMode(_gl.TRIANGLE_STRIP);
                            break;

                        case TriangleFanDrawMode:
                            renderer.setMode(_gl.TRIANGLE_FAN);
                            break;
                    }
                }
            }
            else if (object instanceof Line)
            {
                var lineWidth = material.linewidth;

                if (lineWidth === undefined) lineWidth = 1; // Not using Line*Material

                this.state.setLineWidth(lineWidth * this.getTargetPixelRatio());

                if (object instanceof LineSegments)
                {
                    renderer.setMode(_gl.LINES);
                }
                else
                {
                    renderer.setMode(_gl.LINE_STRIP);
                }

            }
            else if (object instanceof Points)
            {
                renderer.setMode(_gl.POINTS);
            }

            if (geometry instanceof InstancedBufferGeometry)
            {
                if (geometry.maxInstancedCount > 0)
                {
                    renderer.renderInstances(geometry, drawStart, drawCount);
                }
            }
            else
            {
                renderer.render(drawStart, drawCount);
            }
        };

        public setupVertexAttributes(material: IMaterial, program: WebGLProgram, geometry: BufferGeometry, startIndex?: number)
        {
            var state = this.state;
            var _gl = this.context;
            var objects = this.objects;

            var extension: ANGLE_instanced_arrays;

            if (geometry instanceof InstancedBufferGeometry)
            {
                extension = this.extensions.get('ANGLE_instanced_arrays')  ;

                if (extension === null)
                {
                    console.error('THREE.WebGLRenderer.setupVertexAttributes: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.');
                    return;
                }
            }

            if (startIndex === undefined) startIndex = 0;

            state.initAttributes();

            var geometryAttributes = geometry.attributes;

            var programAttributes = program.getAttributes();

            var materialDefaultAttributeValues = material.defaultAttributeValues;
            for (var name in programAttributes)
            {
                var programAttribute: number = programAttributes[name];
                if (programAttribute >= 0)
                {
                    var geometryAttribute = geometryAttributes[name];

                    if (geometryAttribute !== undefined)
                    {
                        var type = _gl.FLOAT;
                        var array = geometryAttribute.array;
                        var normalized = geometryAttribute.normalized;

                        if (array instanceof Float32Array)
                        {
                            type = _gl.FLOAT;
                        }
                        else if (array instanceof Float64Array)
                        {
                            console.warn("Unsupported data buffer format: Float64Array");
                        }
                        else if (array instanceof Uint16Array)
                        {
                            type = _gl.UNSIGNED_SHORT;
                        }
                        else if (array instanceof Int16Array)
                        {
                            type = _gl.SHORT;
                        }
                        else if (array instanceof Uint32Array)
                        {
                            type = _gl.UNSIGNED_INT;
                        }
                        else if (array instanceof Int32Array)
                        {
                            type = _gl.INT;
                        }
                        else if (array instanceof Int8Array)
                        {
                            type = _gl.BYTE;
                        }
                        else if (array instanceof Uint8Array)
                        {
                            type = _gl.UNSIGNED_BYTE;
                        }

                        var size = geometryAttribute.itemSize;
                        var buffer = objects.getAttributeBuffer(geometryAttribute);

                        if (geometryAttribute instanceof InterleavedBufferAttribute)
                        {
                            var data = geometryAttribute.data;
                            var stride = data.stride;
                            var offset = geometryAttribute.offset;

                            if (data instanceof InstancedInterleavedBuffer)
                            {
                                state.enableAttributeAndDivisor(programAttribute, data.meshPerAttribute, extension);

                                if (geometry.maxInstancedCount === undefined)
                                {
                                    geometry.maxInstancedCount = data.meshPerAttribute * data.count;
                                }
                            }
                            else
                            {
                                state.enableAttribute(programAttribute); 
                            }
                            _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
                            _gl.vertexAttribPointer(programAttribute, size, type, normalized, stride * data.array.BYTES_PER_ELEMENT, (startIndex * stride + offset) * data.array.BYTES_PER_ELEMENT);
                        }
                        else
                        {
                            if (geometryAttribute instanceof InstancedBufferAttribute)
                            {
                                state.enableAttributeAndDivisor(programAttribute, geometryAttribute.meshPerAttribute, extension);

                                if (geometry.maxInstancedCount === undefined)
                                {
                                    geometry.maxInstancedCount = geometryAttribute.meshPerAttribute * geometryAttribute.count;
                                }
                            }
                            else
                            {
                                state.enableAttribute(programAttribute);
                            }
                            _gl.bindBuffer(_gl.ARRAY_BUFFER, buffer);
                            _gl.vertexAttribPointer(programAttribute, size, type, normalized, 0, startIndex * size * geometryAttribute.array.BYTES_PER_ELEMENT);
                        }
                    }
                    else if (materialDefaultAttributeValues !== undefined)
                    {
                        var value: any = materialDefaultAttributeValues[name];
                        if (value !== undefined)
                        {
                            switch (value.length)
                            {
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
        }

        // Sorting
        private absNumericalSort(a, b)
        {
            return Math.abs(b[0]) - Math.abs(a[0]);
        }
        private painterSortStable(a: IRenderItem, b: IRenderItem)
        {
            if (a.object.renderOrder !== b.object.renderOrder)
            {
                return a.object.renderOrder - b.object.renderOrder;
            }
            else if (a.material.program && b.material.program && a.material.program !== b.material.program)
            { 
                return a.material.program.id - b.material.program.id; 
            }
            else if (a.material.id !== b.material.id)
            {
                return a.material.id - b.material.id;
            }
            else if (a.z !== b.z)
            {
                return a.z - b.z;
            }
            else
            {
                return a.id - b.id;
            }
        }
        private reversePainterSortStable(a, b)
        {
            if (a.object.renderOrder !== b.object.renderOrder)
            {
                return a.object.renderOrder - b.object.renderOrder;
            }
            if (a.z !== b.z)
            {
                return b.z - a.z;
            }
            else
            {
                return a.id - b.id;
            }

        }

        // Rendering
        public render(scene: Scene, camera: Camera, renderTarget?: WebGLRenderTarget, forceClear?: boolean)
        {
            if (camera instanceof Camera === false)
            {
                console.error('THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.');
                return;
            }

            var fog = scene.fog;

            // reset caching for this frame

            this._currentGeometryProgram = '';
            this._currentMaterialId = - 1;
            this._currentCamera = null;

            // update scene graph

            if (scene.autoUpdate === true) scene.updateMatrixWorld();

            // update camera matrices and frustum

            if (camera.parent === null) camera.updateMatrixWorld();

            camera.matrixWorldInverse.getInverse(camera.matrixWorld);

            this._projScreenMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
            this._frustum.setFromMatrix(this._projScreenMatrix);

            this.lights.length = 0;

            this.opaqueObjectsLastIndex = - 1;
            this.transparentObjectsLastIndex = - 1;

            this.sprites.length = 0;
            this.lensFlares.length = 0;

            this._localClippingEnabled = this.localClippingEnabled;
            this._clippingEnabled = this._clipping.init(this.clippingPlanes, this._localClippingEnabled, camera);

            this.projectObject(scene, camera);

            this.opaqueObjects.length = this.opaqueObjectsLastIndex + 1;
            this.transparentObjects.length = this.transparentObjectsLastIndex + 1;

            if (this.sortObjects === true)
            {
                this.opaqueObjects.sort(this.painterSortStable);
                this.transparentObjects.sort(this.reversePainterSortStable);
            }

            //

            if (this._clippingEnabled)
                this._clipping.beginShadows();

            this.setupShadows(this.lights);

            this.shadowMap.render(scene, camera);

            this.setupLights(this.lights, camera);

            if (this._clippingEnabled) this._clipping.endShadows();

            // 
            this._infoRender.calls = 0;
            this._infoRender.vertices = 0;
            this._infoRender.faces = 0;
            this._infoRender.points = 0;

            if (renderTarget === undefined)
            {
                renderTarget = null;
            }

            this.setRenderTarget(renderTarget);

            //

            var background = scene.background;

            if (background === null)
            {
                this.glClearColor(this._clearColor.r, this._clearColor.g, this._clearColor.b, this._clearAlpha);

            }
            else if (background instanceof Color)
            {
                this.glClearColor(background.r, background.g, background.b, 1);
            }

            if (this.autoClear || forceClear)
            {
                this.clear(this.autoClearColor, this.autoClearDepth, this.autoClearStencil);
            }

            if (background instanceof CubeTexture)
            {

                this.backgroundCamera2.projectionMatrix.copy(camera.projectionMatrix);

                this.backgroundCamera2.matrixWorld.extractRotation(camera.matrixWorld);
                this.backgroundCamera2.matrixWorldInverse.getInverse(this.backgroundCamera2.matrixWorld);

                this.backgroundBoxMesh.material.uniforms["tCube"].value = background;
                this.backgroundBoxMesh.modelViewMatrix.multiplyMatrices(this.backgroundCamera2.matrixWorldInverse, this.backgroundBoxMesh.matrixWorld);
                this.objects.update(this.backgroundBoxMesh);
                this.renderBufferDirect(this.backgroundCamera2, null, this.backgroundBoxMesh.geometry as BufferGeometry, this.backgroundBoxMesh.material, this.backgroundBoxMesh, null);

            }
            else if (background instanceof Texture)
            {
                this.backgroundPlaneMesh.material.map = background;
                this.objects.update(this.backgroundPlaneMesh);
                this.renderBufferDirect(this.backgroundCamera, null, this.backgroundPlaneMesh.geometry as BufferGeometry, this.backgroundPlaneMesh.material, this.backgroundPlaneMesh, null);
            }

            // 
            if (scene.overrideMaterial)
            {
                var overrideMaterial = scene.overrideMaterial;
                this.renderObjects(this.opaqueObjects, camera, fog, overrideMaterial);
                this.renderObjects(this.transparentObjects, camera, fog, overrideMaterial);

            }
            else
            {
                // opaque pass (front-to-back order) 
                this.state.setBlending(NoBlending);
                this.renderObjects(this.opaqueObjects, camera, fog);

                // transparent pass (back-to-front order) 
                this.renderObjects(this.transparentObjects, camera, fog);
            }

            // custom render plugins (post pass) 
            this.spritePlugin.render(scene, camera);
            this.lensFlarePlugin.render(scene, camera, this._currentViewport);

            // Generate mipmap if we're using any kind of mipmap filtering 
            if (renderTarget)
            {
                this.textures.updateRenderTargetMipmap(renderTarget);
            }

            // Ensure depth buffer writing is enabled so it can be cleared on next render

            this.state.setDepthTest(true);
            this.state.setDepthWrite(true);
            this.state.setColorWrite(true);

            // _gl.finish();

        }
        private pushRenderItem(object: Object3D, geometry: BufferGeometry, material: IMaterial, z: number, group: IGeometryGroup)
        {
            var array: IRenderItem[];
            var index: number;

            // allocate the next position in the appropriate array 
            if (material.transparent)
            {
                array = this.transparentObjects;
                index = ++this.transparentObjectsLastIndex;
            }
            else
            {
                array = this.opaqueObjects;
                index = ++this.opaqueObjectsLastIndex;
            }

            // recycle existing render item or grow the array 
            var renderItem = array[index]; 
            if (renderItem !== undefined)
            {
                renderItem.id = object.id;
                renderItem.object = object;
                renderItem.geometry = geometry;
                renderItem.material = material;
                renderItem.z = this._vector3.z;
                renderItem.group = group;
            }
            else
            {
                renderItem = {
                    id: object.id,
                    object: object,
                    geometry: geometry,
                    material: material,
                    z: this._vector3.z,
                    group: group
                };

                // assert( index === array.length );
                array.push(renderItem);
            }
        }

        // TODO Duplicated code (Frustum)
        private isObjectViewable(object: Object3D)
        {
            var geometry = object.geometry;

            if (geometry.boundingSphere === null)
                geometry.computeBoundingSphere();

            this._sphere.copy(geometry.boundingSphere).
                applyMatrix4(object.matrixWorld);

            return this.isSphereViewable(this._sphere);
        }
        private isSpriteViewable(sprite: Sprite)
        {
            this._sphere.center.set(0, 0, 0);
            this._sphere.radius = 0.7071067811865476;
            this._sphere.applyMatrix4(sprite.matrixWorld);

            return this.isSphereViewable(this._sphere);

        }
        private isSphereViewable(sphere: Sphere)
        {
            if (!this._frustum.intersectsSphere(sphere)) return false;

            var numPlanes = this._clipping.numPlanes;

            if (numPlanes === 0) return true;

            var planes = this.clippingPlanes,

                center = sphere.center,
                negRad = - sphere.radius,
                i = 0;
            do
            {
                // out when deeper than radius in the negative halfspace
                if (planes[i].distanceToPoint(center) < negRad) return false;

            } while (++i !== numPlanes);

            return true;

        }
        private projectObject(object: Object3D, camera: Camera)
        {
            var _vector3 = this._vector3;
            if (object.visible === false) return;

            if (object.layers.test(camera.layers))
            {
                if (object instanceof Light)
                {
                    this.lights.push(object);
                }
                else if (object instanceof Sprite)
                {
                    if (object.frustumCulled === false || this.isSpriteViewable(object) === true)
                    {
                        this.sprites.push(object);
                    } 
                }
                else if (object instanceof LensFlare)
                {
                    this.lensFlares.push(object);
                }
                else if (object instanceof ImmediateRenderObject)
                {
                    if (this.sortObjects === true)
                    {
                        _vector3.setFromMatrixPosition(object.matrixWorld);
                        _vector3.applyProjection(this._projScreenMatrix);
                    }

                    this.pushRenderItem(object, null, object.material, this._vector3.z, null);

                }
                else if (object instanceof Mesh
                    || object instanceof Line
                    || object instanceof Points
                )
                {
                    if (object instanceof SkinnedMesh)
                    {
                        object.skeleton.update();
                    }

                    if (object.frustumCulled === false
                        || this.isObjectViewable(object) === true)
                    {

                        var material = object.material;
                        if (material.visible === true)
                        {
                            if (this.sortObjects === true)
                            {
                                _vector3.setFromMatrixPosition(object.matrixWorld);
                                _vector3.applyProjection(this._projScreenMatrix);
                            }

                            var geometry = this.objects.update(object);

                            if (material instanceof MultiMaterial)
                            {
                                var groups = geometry.groups;
                                var materials = material.materials;

                                for (var i = 0, l = groups.length; i < l; i++)
                                {
                                    var group = groups[i];
                                    var groupMaterial = materials[group.materialIndex];

                                    if (groupMaterial.visible === true)
                                    {
                                        this.pushRenderItem(object, geometry, groupMaterial, _vector3.z, group);
                                    }
                                }
                            }
                            else
                            {
                                this.pushRenderItem(object, geometry, material, _vector3.z, null);
                            }
                        }
                    }
                }
            }

            var children = object.children;

            for (let i = 0, l = children.length; i < l; i++)
            {
                this.projectObject(children[i], camera);
            }
        }
        private renderObjects(renderList: IRenderItem[], camera: Camera, fog: IFog, overrideMaterial?)
        {
            for (var i = 0, l = renderList.length; i < l; i++)
            {
                var renderItem = renderList[i];

                var object = renderItem.object as Object3D;
                var geometry = renderItem.geometry;
                var material = overrideMaterial === undefined ? renderItem.material : overrideMaterial;
                var group = renderItem.group;

                object.modelViewMatrix.multiplyMatrices(camera.matrixWorldInverse, object.matrixWorld);
                object.normalMatrix.getNormalMatrix(object.modelViewMatrix);

                if (object instanceof ImmediateRenderObject)
                {
                    this.setMaterial(material);
                    var program = this.setProgram(camera, fog, material, object);
                    this._currentGeometryProgram = '';
                    object.render((object) =>
                    {
                        this.renderBufferImmediate(object, program, material);
                    });

                }
                else
                {
                    this.renderBufferDirect(camera, fog, geometry, material, object, group);
                }
            }
        }
        private initMaterial(material: IMaterial, fog: IFog, object: IObject3D)
        {
            var materialProperties = this.properties.get(material) as IMaterialPropertyCache;

            var parameters = this.programCache.getParameters(
                material, this._lights, fog, this._clipping.numPlanes, object);

            var code = this.programCache.getProgramCode(material, parameters);

            var program = materialProperties.program;
            var programChange = true;

            if (program === undefined)
            {
                // new material
                material.addEventListener('dispose', this.onMaterialDispose_); 
            }
            else if (program.code !== code)
            {
                // changed glsl or parameters
                this.releaseMaterialProgramReference(material);
            }
            else if (parameters.shaderID !== undefined)
            {
                // same glsl and uniform list
                return;
            }
            else
            {
                // only rebuild uniform list
                programChange = false;
            }

            if (programChange)
            {
                if (parameters.shaderID)
                {
                    var shader: IShader = ShaderLib[parameters.shaderID];
                    materialProperties.__webglShader = {
                        name: material.type,
                        uniforms: UniformsUtils.clone(shader.uniforms),
                        vertexShader: shader.vertexShader,
                        fragmentShader: shader.fragmentShader
                    };
                }
                else
                {
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

            if (material.morphTargets)
            {
                material.numSupportedMorphTargets = 0;

                for (var i = 0; i < this.maxMorphTargets; i++)
                {
                    if (attributes['morphTarget' + i] >= 0)
                    {
                        material.numSupportedMorphTargets++;
                    }
                }
            }

            if (material.morphNormals)
            {
                material.numSupportedMorphNormals = 0;
                for (var i = 0; i < this.maxMorphNormals; i++)
                {
                    if (attributes['morphNormal' + i] >= 0)
                    {
                        material.numSupportedMorphNormals++;
                    }
                }
            }

            var uniforms = materialProperties.__webglShader.uniforms;

            if (!(material instanceof ShaderMaterial) &&
                !(material instanceof RawShaderMaterial) ||
                material.clipping === true)
            { 
                materialProperties.numClippingPlanes = this._clipping.numPlanes;
                uniforms.clippingPlanes = this._clipping.uniform;
            }

            var _lights = this._lights;

            if (material.lights)
            {
                // store the light setup it was created for

                materialProperties.lightsHash = _lights.hash;

                // wire up the material to this renderer's lighting state

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
            var uniformsList = WebGLUniforms.seqWithValue(progUniforms.seq, uniforms);

            materialProperties.uniformsList = uniformsList;
            materialProperties.dynamicUniforms =  WebGLUniforms.splitDynamic(uniformsList, uniforms);

        }
        private setMaterial(material: IMaterial)
        {
            var state = this.state;
            var _gl = this.context;

            if (material.side !== DoubleSide)
                state.enable(_gl.CULL_FACE);
            else
                state.disable(_gl.CULL_FACE);

            state.setFlipSided(material.side === BackSide);

            if (material.transparent === true)
            {
                state.setBlending(material.blending, material.blendEquation, material.blendSrc, material.blendDst, material.blendEquationAlpha, material.blendSrcAlpha, material.blendDstAlpha, material.premultipliedAlpha);
            }
            else
            {
                state.setBlending(NoBlending);
            }

            state.setDepthFunc(material.depthFunc);
            state.setDepthTest(material.depthTest);
            state.setDepthWrite(material.depthWrite);
            state.setColorWrite(material.colorWrite);
            state.setPolygonOffset(material.polygonOffset, material.polygonOffsetFactor, material.polygonOffsetUnits);
        }
        private setProgram(camera: Camera, fog: IFog, material: IMaterial, object: IObject3D)
        {
            this._usedTextureUnits = 0;
            var _gl = this.context;

            var materialProperties: IMaterialPropertyCache = this.properties.get(material);

            if (this._clippingEnabled)
            {
                if (this._localClippingEnabled || camera !== this._currentCamera)
                {
                    var useCache =
                        camera === this._currentCamera &&
                        material.id === this._currentMaterialId;

                    // we might want to call this function with some ClippingGroup
                    // object instead of the material, once it becomes feasible
                    // (#8465, #8379)
                    this._clipping.setState(
                        material.clippingPlanes, material.clipShadows,
                        camera, materialProperties, useCache);
                }

                if (materialProperties.numClippingPlanes !== undefined &&
                    materialProperties.numClippingPlanes !== this._clipping.numPlanes)
                {
                    material.needsUpdate = true;
                }
            }

            if (materialProperties.program === undefined)
            {
                material.needsUpdate = true;
            }

            if (materialProperties.lightsHash !== undefined &&
                materialProperties.lightsHash !== this._lights.hash)
            {
                material.needsUpdate = true;
            }

            if (material.needsUpdate)
            {
                this.initMaterial(material, fog, object);
                material.needsUpdate = false;
            }

            var refreshProgram = false;
            var refreshMaterial = false;
            var refreshLights = false;

            var program = materialProperties.program;
            var p_uniforms = program.getUniforms();
            var m_uniforms = materialProperties.__webglShader.uniforms;

            if (program.id !== this._currentProgram)
            { 
                _gl.useProgram(program.program);
                this._currentProgram = program.id;

                refreshProgram = true;
                refreshMaterial = true;
                refreshLights = true; 
            }

            if (material.id !== this._currentMaterialId)
            {
                this._currentMaterialId = material.id;
                refreshMaterial = true; 
            }

            if (refreshProgram || camera !== this._currentCamera)
            {
                p_uniforms.set(_gl, camera, 'projectionMatrix');

                if (this.capabilities.logarithmicDepthBuffer)
                { 
                    p_uniforms.setValue(_gl, 'logDepthBufFC',
                        2.0 / (Math.log(camera.far + 1.0) / Math.LN2));
                }
                 
                if (camera !== this._currentCamera)
                {
                    this._currentCamera = camera;

                    // lighting uniforms depend on the camera so enforce an update
                    // now, in case this material supports lights - or later, when
                    // the next material that does gets activated:

                    refreshMaterial = true;		// set to true on material change
                    refreshLights = true;		// remains set until update done 
                }

                // load material specific uniforms
                // (shader material also gets them for the sake of genericity)

                if (material instanceof ShaderMaterial ||
                    material instanceof MeshPhongMaterial ||
                    material instanceof MeshStandardMaterial ||
                    material.envMap)
                {
                    var uCamPos = p_uniforms.map.cameraPosition;

                    if (uCamPos !== undefined)
                    { 
                        uCamPos.setValue(_gl, this._vector3.setFromMatrixPosition(camera.matrixWorld));
                    }
                }

                if (material instanceof MeshPhongMaterial ||
                    material instanceof MeshLambertMaterial ||
                    material instanceof MeshBasicMaterial ||
                    material instanceof MeshStandardMaterial ||
                    material instanceof ShaderMaterial ||
                    material.skinning)
                { 
                    p_uniforms.setValue(_gl, 'viewMatrix', camera.matrixWorldInverse); 
                }

                p_uniforms.set(_gl, this, 'toneMappingExposure');
                p_uniforms.set(_gl, this, 'toneMappingWhitePoint');

            }

            // skinning uniforms must be set even if material didn't change
            // auto-setting of texture unit for bone texture must go before other textures
            // not sure why, but otherwise weird things happen

            if (material.skinning)
            {
                p_uniforms.setOptional(_gl, object, 'bindMatrix');
                p_uniforms.setOptional(_gl, object, 'bindMatrixInverse');

                var skeleton = object.skeleton;

                if (skeleton)
                {
                    if (this.capabilities.floatVertexTextures && skeleton.useVertexTexture)
                    {
                        p_uniforms.set(_gl, skeleton, 'boneTexture');
                        p_uniforms.set(_gl, skeleton, 'boneTextureWidth');
                        p_uniforms.set(_gl, skeleton, 'boneTextureHeight');
                    }
                    else
                    {
                        p_uniforms.setOptional(_gl, skeleton, 'boneMatrices');
                    }
                }
            }

            if (refreshMaterial)
            {
                if (material.lights)
                {
                    // the current material requires lighting info

                    // note: all lighting uniforms are always set correctly
                    // they simply reference the renderer's state for their
                    // values
                    //
                    // use the current material's .needsUpdate flags to set
                    // the GL state when required

                    this.markUniformsLightsNeedsUpdate(m_uniforms, refreshLights);
                }

                // refresh uniforms common to several materials

                if (fog && material.fog)
                {
                    this.refreshUniformsFog(m_uniforms, fog);
                }

                if (material instanceof MeshBasicMaterial ||
                    material instanceof MeshLambertMaterial ||
                    material instanceof MeshPhongMaterial ||
                    material instanceof MeshStandardMaterial ||
                    material instanceof MeshDepthMaterial)
                {
                    this.refreshUniformsCommon(m_uniforms, material);
                }

                // refresh single material specific uniforms
                if (material instanceof LineBasicMaterial)
                {
                    this.refreshUniformsLine(m_uniforms, material);
                }
                else if (material instanceof LineDashedMaterial)
                {
                    this.refreshUniformsLine(m_uniforms, material);
                    this.refreshUniformsDash(m_uniforms, material);
                }
                else if (material instanceof PointsMaterial)
                {
                    this.refreshUniformsPoints(m_uniforms, material);
                }
                else if (material instanceof MeshLambertMaterial)
                {
                    this.refreshUniformsLambert(m_uniforms, material);
                }
                else if (material instanceof MeshPhongMaterial)
                {
                    this.refreshUniformsPhong(m_uniforms, material);
                }
                else if (material instanceof MeshPhysicalMaterial)
                {
                    this.refreshUniformsPhysical(m_uniforms, material);
                }
                else if (material instanceof MeshStandardMaterial)
                {
                    this.refreshUniformsStandard(m_uniforms, material);
                }
                else if (material instanceof MeshDepthMaterial)
                {
                    if (material.displacementMap)
                    {
                        m_uniforms.displacementMap.value = material.displacementMap;
                        m_uniforms.displacementScale.value = material.displacementScale;
                        m_uniforms.displacementBias.value = material.displacementBias;
                    }
                }
                else if (material instanceof MeshNormalMaterial)
                {
                    m_uniforms.opacity.value = material.opacity;
                }

                WebGLUniforms.upload(
                    _gl, materialProperties.uniformsList, m_uniforms, this);
            }

            // common matrices 
            p_uniforms.set(_gl, object, 'modelViewMatrix');
            p_uniforms.set(_gl, object, 'normalMatrix');
            p_uniforms.setValue(_gl, 'modelMatrix', object.matrixWorld);


            // dynamic uniforms 
            var dynUniforms = materialProperties.dynamicUniforms;

            if (dynUniforms !== null)
            {
                WebGLUniforms.evalDynamic( dynUniforms, m_uniforms, object, camera); 
                WebGLUniforms.upload(_gl, dynUniforms, m_uniforms, this);
            }

            return program; 
        }

        // Uniforms (refresh uniforms objects)
        private refreshUniformsCommon(uniforms: IUniforms, material: IMaterial)
        {
            uniforms.opacity.value = material.opacity; 
            uniforms.diffuse.value = material.color;

            if (material.emissive)
            {
                uniforms.emissive.value.copy(material.emissive).multiplyScalar(material.emissiveIntensity);
            }

            uniforms.map.value = material.map;
            uniforms.specularMap.value = material.specularMap;
            uniforms.alphaMap.value = material.alphaMap;

            if (material.aoMap)
            {
                uniforms.aoMap.value = material.aoMap;
                uniforms.aoMapIntensity.value = material.aoMapIntensity;
            }

            // uv repeat and offset setting priorities
            // 1. color map
            // 2. specular map
            // 3. normal map
            // 4. bump map
            // 5. alpha map
            // 6. emissive map

            var uvScaleMap;

            if (material.map)
            {
                uvScaleMap = material.map;
            }
            else if (material.specularMap)
            {
                uvScaleMap = material.specularMap;
            }
            else if (material.displacementMap)
            {
                uvScaleMap = material.displacementMap;
            }
            else if (material.normalMap)
            {
                uvScaleMap = material.normalMap;
            }
            else if (material.bumpMap)
            {
                uvScaleMap = material.bumpMap;
            }
            else if (material.roughnessMap)
            {
                uvScaleMap = material.roughnessMap;
            }
            else if (material.metalnessMap)
            {
                uvScaleMap = material.metalnessMap;
            }
            else if (material.alphaMap)
            {
                uvScaleMap = material.alphaMap;
            }
            else if (material.emissiveMap)
            {
                uvScaleMap = material.emissiveMap;
            }

            if (uvScaleMap !== undefined)
            {
                // backwards compatibility
                if (uvScaleMap instanceof WebGLRenderTarget)
                {
                    uvScaleMap = uvScaleMap.texture;
                }

                var offset = uvScaleMap.offset;
                var repeat = uvScaleMap.repeat;

                uniforms.offsetRepeat.value.set(offset.x, offset.y, repeat.x, repeat.y);
            }

            uniforms.envMap.value = material.envMap;

            // don't flip CubeTexture envMaps, flip everything else:
            //  WebGLRenderTargetCube will be flipped for backwards compatibility
            //  WebGLRenderTargetCube.texture will be flipped because it's a Texture and NOT a CubeTexture
            // this check must be handled differently, or removed entirely, if WebGLRenderTargetCube uses a CubeTexture in the future
            uniforms.flipEnvMap.value = (!(material.envMap instanceof CubeTexture)) ? 1 : - 1;

            uniforms.reflectivity.value = material.reflectivity;
            uniforms.refractionRatio.value = material.refractionRatio;

        }
        private refreshUniformsLine(uniforms: IUniforms, material: LineBasicMaterial | LineDashedMaterial)
        {
            uniforms.diffuse.value = material.color;
            uniforms.opacity.value = material.opacity;
        }
        private refreshUniformsDash(uniforms: IUniforms, material: LineDashedMaterial)
        {
            uniforms.dashSize.value = material.dashSize;
            uniforms.totalSize.value = material.dashSize + material.gapSize;
            uniforms.scale.value = material.scale;
        }
        private refreshUniformsPoints(uniforms: IUniforms, material: PointsMaterial)
        {
            uniforms.diffuse.value = material.color;
            uniforms.opacity.value = material.opacity;
            uniforms.size.value = material.size * this._pixelRatio;
            uniforms.scale.value = this._canvas.clientHeight * 0.5;

            uniforms.map.value = material.map;

            if (material.map !== null)
            {
                var offset = material.map.offset;
                var repeat = material.map.repeat;

                uniforms.offsetRepeat.value.set(offset.x, offset.y, repeat.x, repeat.y);
            }

        }
        private refreshUniformsFog(uniforms: IUniforms, fog: IFog)
        {
            uniforms.fogColor.value = fog.color;

            if (fog instanceof Fog)
            {
                uniforms.fogNear.value = fog.near;
                uniforms.fogFar.value = fog.far; 
            }
            else if (fog instanceof FogExp2)
            {
                uniforms.fogDensity.value = fog.density;
            }

        }
        private refreshUniformsLambert(uniforms: IUniforms, material: MeshLambertMaterial)
        {
            if (material.lightMap)
            {
                uniforms.lightMap.value = material.lightMap;
                uniforms.lightMapIntensity.value = material.lightMapIntensity;
            }

            if (material.emissiveMap)
            {
                uniforms.emissiveMap.value = material.emissiveMap;
            }
        }
        private refreshUniformsPhong(uniforms: IUniforms, material: MeshPhongMaterial)
        {
            uniforms.specular.value = material.specular;
            uniforms.shininess.value = Math.max(material.shininess, 1e-4); // to prevent pow( 0.0, 0.0 )

            if (material.lightMap)
            {
                uniforms.lightMap.value = material.lightMap;
                uniforms.lightMapIntensity.value = material.lightMapIntensity;
            }

            if (material.emissiveMap)
            {
                uniforms.emissiveMap.value = material.emissiveMap;
            }

            if (material.bumpMap)
            {
                uniforms.bumpMap.value = material.bumpMap;
                uniforms.bumpScale.value = material.bumpScale;
            }

            if (material.normalMap)
            {
                uniforms.normalMap.value = material.normalMap;
                uniforms.normalScale.value.copy(material.normalScale);
            }

            if (material.displacementMap)
            {
                uniforms.displacementMap.value = material.displacementMap;
                uniforms.displacementScale.value = material.displacementScale;
                uniforms.displacementBias.value = material.displacementBias;
            }
        }
        private refreshUniformsStandard(uniforms: IUniforms, material: MeshStandardMaterial)
        {
            uniforms.roughness.value = material.roughness;
            uniforms.metalness.value = material.metalness;

            if (material.roughnessMap)
            {
                uniforms.roughnessMap.value = material.roughnessMap;
            }

            if (material.metalnessMap)
            {
                uniforms.metalnessMap.value = material.metalnessMap;
            }

            if (material.lightMap)
            {
                uniforms.lightMap.value = material.lightMap;
                uniforms.lightMapIntensity.value = material.lightMapIntensity;
            }

            if (material.emissiveMap)
            {
                uniforms.emissiveMap.value = material.emissiveMap;
            }

            if (material.bumpMap)
            {
                uniforms.bumpMap.value = material.bumpMap;
                uniforms.bumpScale.value = material.bumpScale;
            }

            if (material.normalMap)
            {
                uniforms.normalMap.value = material.normalMap;
                uniforms.normalScale.value.copy(material.normalScale);
            }

            if (material.displacementMap)
            {
                uniforms.displacementMap.value = material.displacementMap;
                uniforms.displacementScale.value = material.displacementScale;
                uniforms.displacementBias.value = material.displacementBias;
            }

            if (material.envMap)
            {
                //uniforms.envMap.value = material.envMap; // part of uniforms common
                uniforms.envMapIntensity.value = material.envMapIntensity;
            }
        }
        private refreshUniformsPhysical(uniforms: IUniforms, material: MeshPhysicalMaterial)
        {
            uniforms.clearCoat.value = material.clearCoat;
            uniforms.clearCoatRoughness.value = material.clearCoatRoughness;

            this.refreshUniformsStandard(uniforms, material); 
        }

        // If uniforms are marked as clean, they don't need to be loaded to the GPU.
        private markUniformsLightsNeedsUpdate(uniforms: IUniforms, value: boolean)
        {
            uniforms.ambientLightColor.needsUpdate = value; 
            uniforms.directionalLights.needsUpdate = value;
            uniforms.pointLights.needsUpdate = value;
            uniforms.spotLights.needsUpdate = value;
            uniforms.hemisphereLights.needsUpdate = value;
        }

        // Lighting
        private setupShadows(lights: Light[])
        {
            var lightShadowsLength = 0;

            for (var i = 0, l = lights.length; i < l; i++)
            {
                var light = lights[i];

                if (light.castShadow)
                {
                    this._lights.shadows[lightShadowsLength++] = light;
                }
            }

            this._lights.shadows.length = lightShadowsLength;
        }
        private setupLights(lights: Light[], camera: Camera)
        {
            var _lights = this._lights;
            var _vector3 = this._vector3;
            var lightCache = this.lightCache;

            var l, ll;
            var light: Light;
            var
                r: number = 0, g: number = 0, b: number = 0,
                color: Color,
                intensity: number,
                distance: number,
                shadowMap: Texture, 
                viewMatrix = camera.matrixWorldInverse, 
                directionalLength = 0,
                pointLength = 0,
                spotLength = 0,
                hemiLength = 0;

            for (l = 0, ll = lights.length; l < ll; l++)
            {
                light = lights[l]  ;

                color = light.color;
                intensity = light.intensity;
                distance = light.distance;

                shadowMap = (light.shadow && light.shadow.map) ? light.shadow.map.texture : null;

                if (light instanceof AmbientLight)
                { 
                    r += color.r * intensity;
                    g += color.g * intensity;
                    b += color.b * intensity; 
                }
                else if (light instanceof DirectionalLight)
                { 
                    var uniforms = lightCache.get(light);

                    uniforms.color.copy(light.color).multiplyScalar(light.intensity);
                    uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                    _vector3.setFromMatrixPosition(light.target.matrixWorld);
                    uniforms.direction.sub(_vector3);
                    uniforms.direction.transformDirection(viewMatrix);

                    uniforms.shadow = light.castShadow;

                    if (light.castShadow)
                    { 
                        uniforms.shadowBias = light.shadow.bias;
                        uniforms.shadowRadius = light.shadow.radius;
                        uniforms.shadowMapSize = light.shadow.mapSize; 
                    }

                    _lights.directionalShadowMap[directionalLength] = shadowMap;
                    _lights.directionalShadowMatrix[directionalLength] = light.shadow.matrix;
                    _lights.directional[directionalLength++] = uniforms;

                }
                else if (light instanceof SpotLight)
                {
                    var uniforms = lightCache.get(light);

                    uniforms.position.setFromMatrixPosition(light.matrixWorld);
                    uniforms.position.applyMatrix4(viewMatrix);

                    uniforms.color.copy(color).multiplyScalar(intensity);
                    uniforms.distance = distance;

                    uniforms.direction.setFromMatrixPosition(light.matrixWorld);
                    _vector3.setFromMatrixPosition(light.target.matrixWorld);
                    uniforms.direction.sub(_vector3);
                    uniforms.direction.transformDirection(viewMatrix);

                    uniforms.coneCos = Math.cos(light.angle);
                    uniforms.penumbraCos = Math.cos(light.angle * (1 - light.penumbra));
                    uniforms.decay = (light.distance === 0) ? 0.0 : light.decay;

                    uniforms.shadow = light.castShadow;

                    if (light.castShadow)
                    {
                        uniforms.shadowBias = light.shadow.bias;
                        uniforms.shadowRadius = light.shadow.radius;
                        uniforms.shadowMapSize = light.shadow.mapSize; 
                    }

                    _lights.spotShadowMap[spotLength] = shadowMap;
                    _lights.spotShadowMatrix[spotLength] = light.shadow.matrix;
                    _lights.spot[spotLength++] = uniforms;

                }
                else if (light instanceof PointLight)
                {
                    var uniforms = lightCache.get(light);

                    uniforms.position.setFromMatrixPosition(light.matrixWorld);
                    uniforms.position.applyMatrix4(viewMatrix);

                    uniforms.color.copy(light.color).multiplyScalar(light.intensity);
                    uniforms.distance = light.distance;
                    uniforms.decay = (light.distance === 0) ? 0.0 : light.decay;

                    uniforms.shadow = light.castShadow;

                    if (light.castShadow)
                    {
                        uniforms.shadowBias = light.shadow.bias;
                        uniforms.shadowRadius = light.shadow.radius;
                        uniforms.shadowMapSize = light.shadow.mapSize;
                    }

                    _lights.pointShadowMap[pointLength] = shadowMap;

                    if (_lights.pointShadowMatrix[pointLength] === undefined)
                    {
                        _lights.pointShadowMatrix[pointLength] = new Matrix4();
                    }

                    // for point lights we set the shadow matrix to be a translation-only matrix
                    // equal to inverse of the light's position
                    _vector3.setFromMatrixPosition(light.matrixWorld).negate();
                    _lights.pointShadowMatrix[pointLength].identity().setPosition(_vector3);

                    _lights.point[pointLength++] = uniforms;

                }
                else if (light instanceof HemisphereLight)
                {
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

        }

        // GL state setting 
        public setFaceCulling(cullFace: number, frontFaceDirection?: number)
        {
            var state = this.state;
            state.setCullFace(cullFace);
            state.setFlipSided(frontFaceDirection === FrontFaceDirectionCW);
        };

        // Textures 
        public allocTextureUnit()
        { 
            var textureUnit = this._usedTextureUnits;

            if (textureUnit >= this.capabilities.maxTextures)
            { 
                console.warn('WebGLRenderer: trying to use ' + textureUnit + ' texture units while this GPU supports only ' + this.capabilities.maxTextures);
            }

            this._usedTextureUnits += 1; 
            return textureUnit; 
        }

        // this.setTexture2D = setTexture2D;
        private static warned = false;
        public setTexture2D(texture: Texture, slot: number)
        {
            if (texture instanceof WebGLRenderTarget)
            {
                if (!WebGLRenderer.warned)
                {
                    console.warn("WebGLRenderer.setTexture2D: don't use render targets as textures. Use their .texture property instead.");
                    WebGLRenderer.warned = true;
                }
                texture = (texture as any).texture;
            }
            this.textures.setTexture2D(texture, slot); 
        } 
         
        private static warned_setTextureCube = false;
        public setTextureCube(texture: CubeTexture, slot)
        { 
            var textures = this.textures;
            // backwards compatibility: peel texture.texture
            if (texture instanceof WebGLRenderTargetCube)
            { 
                if (!WebGLRenderer.warned_setTextureCube)
                {
                    console.warn("THREE.WebGLRenderer.setTextureCube: don't use cube render targets as textures. Use their .texture property instead.");
                    WebGLRenderer.warned_setTextureCube = true;
                }
                texture = (texture as any).texture; 
            }

            // currently relying on the fact that WebGLRenderTargetCube.texture is a Texture and NOT a CubeTexture
            // TODO: unify these code paths
            if (texture instanceof CubeTexture ||
                (Array.isArray(texture.image) && texture.image.length === 6))
            { 
                // CompressedTexture can have Array in image :/

                // this function alone should take care of cube textures
                textures.setTextureCube(texture, slot); 
            }
            else
            {
                // assumed: texture property of THREE.WebGLRenderTargetCube 
                textures.setTextureCubeDynamic(texture, slot); 
            }
        }  

        public getCurrentRenderTarget()
        {
            return this._currentRenderTarget;
        };
        public setRenderTarget(renderTarget: WebGLRenderTarget)
        {
            var properties = this.properties;
            var textures = this.textures;
            var _gl = this.context;
            var state = this.state;

            this._currentRenderTarget = renderTarget;

            if (renderTarget && properties.get(renderTarget).__webglFramebuffer === undefined)
            { 
                textures.setupRenderTarget(renderTarget); 
            }


            var isCube = (renderTarget instanceof WebGLRenderTargetCube);
            var renderTargetCube = isCube
                ? renderTarget as WebGLRenderTargetCube
                : null;

            
            var framebuffer;

            if (renderTarget)
            { 
                var renderTargetProperties = properties.get(renderTarget); 
                if (isCube)
                { 
                    framebuffer = renderTargetProperties.__webglFramebuffer[renderTargetCube.activeCubeFace]; 
                }
                else
                { 
                    framebuffer = renderTargetProperties.__webglFramebuffer; 
                }

                this._currentScissor.copy(renderTarget.scissor);
                this._currentScissorTest = renderTarget.scissorTest; 
                this._currentViewport.copy(renderTarget.viewport);

            }
            else
            { 
                framebuffer = null;

                this._currentScissor.copy(this._scissor).multiplyScalar(this._pixelRatio);
                this._currentScissorTest = this._scissorTest;

                this._currentViewport.copy(this._viewport).multiplyScalar(this._pixelRatio); 
            }

            if (this._currentFramebuffer !== framebuffer)
            {

                _gl.bindFramebuffer(_gl.FRAMEBUFFER, framebuffer);
                this._currentFramebuffer = framebuffer;

            }

            state.scissor(this._currentScissor);
            state.setScissorTest(this._currentScissorTest);

            state.viewport(this._currentViewport);

            if (isCube)
            { 
                var textureProperties = properties.get(renderTarget.texture);
                _gl.framebufferTexture2D(_gl.FRAMEBUFFER, _gl.COLOR_ATTACHMENT0, _gl.TEXTURE_CUBE_MAP_POSITIVE_X + renderTargetCube.activeCubeFace, textureProperties.__webglTexture, renderTargetCube.activeMipMapLevel);
            }

        };
        public readRenderTargetPixels(
            renderTarget: WebGLRenderTarget,
            x: number, y: number, width: number, height: number,
            buffer: ArrayBufferView)
        {
            readRenderTargetPixels(this, renderTarget, x, y, width, height, buffer);
        } 
    }    
}
