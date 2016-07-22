/* 
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class WebGLShadowMap
    {
        private _renderer: WebGLRenderer;
        private _lights: any;
        private _objects: any;
        private _gl: WebGLRenderingContext;
        private _state;
        private _frustum: Frustum;
        private _projScreenMatrix: Matrix4;
        private _lightShadows
        private _shadowMapSize: Vector2;
        private _lookTarget: Vector3;
        private _lightPositionWorld: Vector3;
        private _renderList: any[];
        private _MorphingFlag: number;
        private _SkinningFlag: number;
        private _NumberOfMaterialVariants: number;
        private _depthMaterials: any[];
        private _distanceMaterials: any[];
        private _materialCache: any;
        private cubeDirections: Vector3[];
        private cubeUps: Vector3[];
        private cube2DViewPorts: Vector4[];
        private depthMaterialTemplate: MeshDepthMaterial;
        private distanceShader;
        private distanceUniforms;

        public enabled: boolean;
        public autoUpdate: boolean;
        public needsUpdate: boolean;
        public type: number;
        public renderReverseSided: boolean;
        public renderSingleSided: boolean;

        constructor(_renderer: WebGLRenderer, _lights: LightArrayCache, _objects: WebGLObjects)
        {
            this._renderer = _renderer;
            this._objects = _objects;
            this._lights = _lights;
            this._gl = _renderer.context;
            this._state = _renderer.state;
            this._frustum = new Frustum();
            this._projScreenMatrix = new Matrix4();

            this._lightShadows = _lights.shadows;

            this._shadowMapSize = new Vector2();

            this._lookTarget = new Vector3();
            this._lightPositionWorld = new Vector3();

            this._renderList = [];

            this._MorphingFlag = 1;
            this._SkinningFlag = 2;

            this._NumberOfMaterialVariants = (this._MorphingFlag | this._SkinningFlag) + 1;

            this._depthMaterials = new Array(this._NumberOfMaterialVariants);
            this._distanceMaterials = new Array(this._NumberOfMaterialVariants);

            this._materialCache = {};

            this.cubeDirections = [
                new Vector3(1, 0, 0), new Vector3(- 1, 0, 0), new Vector3(0, 0, 1),
                new Vector3(0, 0, - 1), new Vector3(0, 1, 0), new Vector3(0, - 1, 0)
            ];

            this.cubeUps = [
                new Vector3(0, 1, 0), new Vector3(0, 1, 0), new Vector3(0, 1, 0),
                new Vector3(0, 1, 0), new Vector3(0, 0, 1), new Vector3(0, 0, - 1)
            ];

            var cube2DViewPorts = [
                new Vector4(), new Vector4(), new Vector4(),
                new Vector4(), new Vector4(), new Vector4()
            ];

            // init

            var depthMaterialTemplate = this.depthMaterialTemplate = new MeshDepthMaterial();
            depthMaterialTemplate.depthPacking = RGBADepthPacking;
            depthMaterialTemplate.clipping = true;

            var distanceShader = this.distanceShader = ShaderLib["distanceRGBA"];
            var distanceUniforms = this.distanceUniforms = UniformsUtils.clone(this.distanceShader.uniforms);

            for (var i = 0; i !== this._NumberOfMaterialVariants; ++i)
            {
                var useMorphing = (i & this._MorphingFlag) !== 0;
                var useSkinning = (i & this._SkinningFlag) !== 0;

                var depthMaterial = depthMaterialTemplate.clone();
                depthMaterial.morphTargets = useMorphing;
                depthMaterial.skinning = useSkinning;

                this._depthMaterials[i] = depthMaterial;

                var distanceMaterial = new ShaderMaterial({
                    defines: {
                        'USE_SHADOWMAP': ''
                    },
                    uniforms: distanceUniforms,
                    vertexShader: distanceShader.vertexShader,
                    fragmentShader: distanceShader.fragmentShader,
                    morphTargets: useMorphing,
                    skinning: useSkinning,
                    clipping: true
                });

                this._distanceMaterials[i] = distanceMaterial;

            }

            //

            var scope = this;

            this.enabled = false;

            this.autoUpdate = true;
            this.needsUpdate = false;

            this.type = PCFShadowMap;

            this.renderReverseSided = true;
            this.renderSingleSided = true; 
        };

        private getDepthMaterial(object, material, isPointLight, lightPositionWorld)
        {
            var _depthMaterials = this._depthMaterials;
            var _MorphingFlag = this._MorphingFlag;
            var _distanceMaterials = this._distanceMaterials;
            var _SkinningFlag = this._SkinningFlag;
            var _renderer = this._renderer;
            var _materialCache = this._materialCache;
            var scope = this;

            var geometry = object.geometry;

            var result = null;

            var materialVariants = _depthMaterials;
            var customMaterial = object.customDepthMaterial;

            if (isPointLight)
            {
                materialVariants = _distanceMaterials;
                customMaterial = object.customDistanceMaterial;
            }

            if (!customMaterial)
            {

                var useMorphing = geometry.morphTargets !== undefined &&
                    geometry.morphTargets.length > 0 && material.morphTargets;

                var useSkinning = object instanceof SkinnedMesh && material.skinning;

                var variantIndex = 0;

                if (useMorphing) variantIndex |= _MorphingFlag;
                if (useSkinning) variantIndex |= _SkinningFlag;

                result = materialVariants[variantIndex];
            }
            else
            {
                result = customMaterial;
            }

            if (_renderer.localClippingEnabled &&
                material.clipShadows === true &&
                material.clippingPlanes.length !== 0)
            {

                // in this case we need a unique material instance reflecting the
                // appropriate state

                var keyA = result.uuid, keyB = material.uuid;

                var materialsForVariant = _materialCache[keyA];

                if (materialsForVariant === undefined)
                {
                    materialsForVariant = {};
                    _materialCache[keyA] = materialsForVariant;
                }

                var cachedMaterial = materialsForVariant[keyB];

                if (cachedMaterial === undefined)
                {
                    cachedMaterial = result.clone();
                    materialsForVariant[keyB] = cachedMaterial;
                }
                result = cachedMaterial;
            }

            result.visible = material.visible;
            result.wireframe = material.wireframe;

            var side = material.side;

            if (scope.renderSingleSided && side == DoubleSide)
            {
                side = FrontSide;
            }

            if (scope.renderReverseSided)
            {
                if (side === FrontSide) side = BackSide;
                else if (side === BackSide) side = FrontSide;
            }

            result.side = side;

            result.clipShadows = material.clipShadows;
            result.clippingPlanes = material.clippingPlanes;

            result.wireframeLinewidth = material.wireframeLinewidth;
            result.linewidth = material.linewidth;

            if (isPointLight && result.uniforms.lightPos !== undefined)
            {
                result.uniforms.lightPos.value.copy(lightPositionWorld);
            }
            return result;
        }
        private projectObject(object, camera, shadowCamera)
        {
            var _frustum = this._frustum;
            var _renderList = this._renderList;

            if (object.visible === false) return;

            if (object.layers.test(camera.layers) && (object instanceof Mesh || object instanceof Line || object instanceof Points))
            {
                if (object.castShadow && (object.frustumCulled === false || _frustum.intersectsObject(object) === true))
                {
                    var material = object.material;
                    if (material.visible === true)
                    {
                        object.modelViewMatrix.multiplyMatrices(shadowCamera.matrixWorldInverse, object.matrixWorld);
                        _renderList.push(object);
                    }
                }
            }

            var children = object.children;

            for (var i = 0, l = children.length; i < l; i++)
            {
                this.projectObject(children[i], camera, shadowCamera);
            }
        }
        public render(scene, camera)
        {
            var scope = this;
            var _lightShadows = this._lightShadows;
            var _state = this._state;
            var _gl = this._gl;
            var _shadowMapSize = this._shadowMapSize;
            var cube2DViewPorts = this.cube2DViewPorts;
            var _lightPositionWorld = this._lightPositionWorld;
            var _renderer = this._renderer;
            var _lookTarget = this._lookTarget;
            var cubeDirections = this.cubeDirections;
            var cubeUps = this.cubeUps;
            var _projScreenMatrix = this._projScreenMatrix;
            var _frustum = this._frustum;
            var _renderList = this._renderList;
            var _objects = this._objects;

            if (scope.enabled === false) return;
            if (scope.autoUpdate === false && scope.needsUpdate === false) return;

            if (_lightShadows.length === 0) return;

            // Set GL state for depth map.
            _state.clearColor(1, 1, 1, 1);
            _state.disable(_gl.BLEND);
            _state.setDepthTest(true);
            _state.setScissorTest(false);

            // render depth map

            var faceCount, isPointLight;

            for (var i = 0, il = _lightShadows.length; i < il; i++)
            {
                var light = _lightShadows[i];
                var shadow = light.shadow;
                if (shadow === undefined)
                {
                    console.warn('THREE.WebGLShadowMap:', light, 'has no shadow.');
                    continue;
                }

                var shadowCamera = shadow.camera;
                _shadowMapSize.copy(shadow.mapSize);

                if (light instanceof PointLight)
                {
                    faceCount = 6;
                    isPointLight = true;

                    var vpWidth = _shadowMapSize.x;
                    var vpHeight = _shadowMapSize.y;

                    // These viewports map a cube-map onto a 2D texture with the
                    // following orientation:
                    //
                    //  xzXZ
                    //   y Y
                    //
                    // X - Positive x direction
                    // x - Negative x direction
                    // Y - Positive y direction
                    // y - Negative y direction
                    // Z - Positive z direction
                    // z - Negative z direction

                    // positive X
                    cube2DViewPorts[0].set(vpWidth * 2, vpHeight, vpWidth, vpHeight);
                    // negative X
                    cube2DViewPorts[1].set(0, vpHeight, vpWidth, vpHeight);
                    // positive Z
                    cube2DViewPorts[2].set(vpWidth * 3, vpHeight, vpWidth, vpHeight);
                    // negative Z
                    cube2DViewPorts[3].set(vpWidth, vpHeight, vpWidth, vpHeight);
                    // positive Y
                    cube2DViewPorts[4].set(vpWidth * 3, 0, vpWidth, vpHeight);
                    // negative Y
                    cube2DViewPorts[5].set(vpWidth, 0, vpWidth, vpHeight);

                    _shadowMapSize.x *= 4.0;
                    _shadowMapSize.y *= 2.0;

                } else
                {

                    faceCount = 1;
                    isPointLight = false;

                }

                if (shadow.map === null)
                {
                    var pars = { minFilter: NearestFilter, magFilter: NearestFilter, format: RGBAFormat };

                    shadow.map = new WebGLRenderTarget(_shadowMapSize.x, _shadowMapSize.y, pars);
                    shadowCamera.updateProjectionMatrix();
                }

                if (shadow instanceof SpotLightShadow)
                {
                    shadow.update(light);
                }

                var shadowMap = shadow.map;
                var shadowMatrix = shadow.matrix;

                _lightPositionWorld.setFromMatrixPosition(light.matrixWorld);
                shadowCamera.position.copy(_lightPositionWorld);

                _renderer.setRenderTarget(shadowMap);
                _renderer.clear();

                // render shadow map for each cube face (if omni-directional) or
                // run a single pass if not

                for (var face = 0; face < faceCount; face++)
                {

                    if (isPointLight)
                    {

                        _lookTarget.copy(shadowCamera.position);
                        _lookTarget.add(cubeDirections[face]);
                        shadowCamera.up.copy(cubeUps[face]);
                        shadowCamera.lookAt(_lookTarget);

                        var vpDimensions = cube2DViewPorts[face];
                        _state.viewport(vpDimensions);

                    } else
                    {

                        _lookTarget.setFromMatrixPosition(light.target.matrixWorld);
                        shadowCamera.lookAt(_lookTarget);

                    }

                    shadowCamera.updateMatrixWorld();
                    shadowCamera.matrixWorldInverse.getInverse(shadowCamera.matrixWorld);

                    // compute shadow matrix

                    shadowMatrix.set(
                        0.5, 0.0, 0.0, 0.5,
                        0.0, 0.5, 0.0, 0.5,
                        0.0, 0.0, 0.5, 0.5,
                        0.0, 0.0, 0.0, 1.0
                    );

                    shadowMatrix.multiply(shadowCamera.projectionMatrix);
                    shadowMatrix.multiply(shadowCamera.matrixWorldInverse);

                    // update camera matrices and frustum

                    _projScreenMatrix.multiplyMatrices(shadowCamera.projectionMatrix, shadowCamera.matrixWorldInverse);
                    _frustum.setFromMatrix(_projScreenMatrix);

                    // set object matrices & frustum culling

                    _renderList.length = 0;

                    this.projectObject(scene, camera, shadowCamera);

                    // render shadow map
                    // render regular objects

                    for (var j = 0, jl = _renderList.length; j < jl; j++)
                    {

                        var object = _renderList[j];
                        var geometry = _objects.update(object);
                        var material = object.material;

                        if (material instanceof MultiMaterial)
                        {
                            var groups = geometry.groups;
                            var materials = material.materials;

                            for (var k = 0, kl = groups.length; k < kl; k++)
                            {
                                var group = groups[k];
                                var groupMaterial = materials[group.materialIndex];

                                if (groupMaterial.visible === true)
                                {

                                    var depthMaterial = this.getDepthMaterial(object, groupMaterial, isPointLight, _lightPositionWorld);
                                    _renderer.renderBufferDirect(shadowCamera, null, geometry, depthMaterial, object, group);

                                }

                            }

                        } else
                        {

                            var depthMaterial = this.getDepthMaterial(object, material, isPointLight, _lightPositionWorld);
                            _renderer.renderBufferDirect(shadowCamera, null, geometry, depthMaterial, object, null);

                        }

                    }

                }

            }

            // Restore GL state.
            var clearColor = _renderer.getClearColor(),
                clearAlpha = _renderer.getClearAlpha();
            _renderer.setClearColor(clearColor, clearAlpha);

            scope.needsUpdate = false;

        };
    }
}
