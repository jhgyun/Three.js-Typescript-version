var THREE;
(function (THREE) {
    var WebGLShadowMap = (function () {
        function WebGLShadowMap(_renderer, _lights, _objects, capabilities) {
            this._renderer = _renderer;
            this._objects = _objects;
            this._lights = _lights;
            this._gl = _renderer.context;
            this._state = _renderer.state;
            this._frustum = new THREE.Frustum();
            this._projScreenMatrix = new THREE.Matrix4();
            this._lightShadows = _lights.shadows;
            this._shadowMapSize = new THREE.Vector2();
            this._maxShadowMapSize = new THREE.Vector2(capabilities.maxTextureSize, capabilities.maxTextureSize),
                this._lookTarget = new THREE.Vector3();
            this._lightPositionWorld = new THREE.Vector3();
            this._renderList = [];
            this._MorphingFlag = 1;
            this._SkinningFlag = 2;
            this._NumberOfMaterialVariants = (this._MorphingFlag | this._SkinningFlag) + 1;
            this._depthMaterials = new Array(this._NumberOfMaterialVariants);
            this._distanceMaterials = new Array(this._NumberOfMaterialVariants);
            this._materialCache = {};
            this.cubeDirections = [
                new THREE.Vector3(1, 0, 0), new THREE.Vector3(-1, 0, 0), new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, -1, 0)
            ];
            this.cubeUps = [
                new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 1, 0),
                new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, -1)
            ];
            this.cube2DViewPorts = [
                new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4(),
                new THREE.Vector4(), new THREE.Vector4(), new THREE.Vector4()
            ];
            var depthMaterialTemplate = this.depthMaterialTemplate = new THREE.MeshDepthMaterial();
            depthMaterialTemplate.depthPacking = THREE.RGBADepthPacking;
            depthMaterialTemplate.clipping = true;
            var distanceShader = this.distanceShader = THREE.ShaderLib["distanceRGBA"];
            var distanceUniforms = this.distanceUniforms = THREE.UniformsUtils.clone(this.distanceShader.uniforms);
            for (var i = 0; i !== this._NumberOfMaterialVariants; ++i) {
                var useMorphing = (i & this._MorphingFlag) !== 0;
                var useSkinning = (i & this._SkinningFlag) !== 0;
                var depthMaterial = depthMaterialTemplate.clone();
                depthMaterial.morphTargets = useMorphing;
                depthMaterial.skinning = useSkinning;
                this._depthMaterials[i] = depthMaterial;
                var distanceMaterial = new THREE.ShaderMaterial({
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
            this.enabled = false;
            this.autoUpdate = true;
            this.needsUpdate = false;
            this.type = THREE.PCFShadowMap;
            this.renderReverseSided = true;
            this.renderSingleSided = true;
        }
        ;
        WebGLShadowMap.prototype.getDepthMaterial = function (object, material, isPointLight, lightPositionWorld) {
            var _depthMaterials = this._depthMaterials;
            var _MorphingFlag = this._MorphingFlag;
            var _distanceMaterials = this._distanceMaterials;
            var _SkinningFlag = this._SkinningFlag;
            var _renderer = this._renderer;
            var _materialCache = this._materialCache;
            var scope = this;
            var geometry = object.geometry;
            var result;
            var materialVariants = _depthMaterials;
            var customMaterial = object.customDepthMaterial;
            if (isPointLight) {
                materialVariants = _distanceMaterials;
                customMaterial = object.customDistanceMaterial;
            }
            if (!customMaterial) {
                var useMorphing = false;
                if (material.morphTargets) {
                    if (geometry instanceof THREE.BufferGeometry) {
                        useMorphing = geometry.morphAttributes && geometry.morphAttributes.position && geometry.morphAttributes.position.length > 0;
                    }
                    else if (geometry instanceof THREE.Geometry) {
                        useMorphing = geometry.morphTargets && geometry.morphTargets.length > 0;
                    }
                }
                var useSkinning = object instanceof THREE.SkinnedMesh && material.skinning;
                var variantIndex = 0;
                if (useMorphing)
                    variantIndex |= _MorphingFlag;
                if (useSkinning)
                    variantIndex |= _SkinningFlag;
                result = materialVariants[variantIndex];
            }
            else {
                result = customMaterial;
            }
            if (_renderer.localClippingEnabled &&
                material.clipShadows === true &&
                material.clippingPlanes.length !== 0) {
                var keyA = result.uuid, keyB = material.uuid;
                var materialsForVariant = _materialCache[keyA];
                if (materialsForVariant === undefined) {
                    materialsForVariant = {};
                    _materialCache[keyA] = materialsForVariant;
                }
                var cachedMaterial = materialsForVariant[keyB];
                if (cachedMaterial === undefined) {
                    cachedMaterial = result.clone();
                    materialsForVariant[keyB] = cachedMaterial;
                }
                result = cachedMaterial;
            }
            result.visible = material.visible;
            result.wireframe = material.wireframe;
            var side = material.side;
            if (scope.renderSingleSided && side == THREE.DoubleSide) {
                side = THREE.FrontSide;
            }
            if (scope.renderReverseSided) {
                if (side === THREE.FrontSide)
                    side = THREE.BackSide;
                else if (side === THREE.BackSide)
                    side = THREE.FrontSide;
            }
            result.side = side;
            result.clipShadows = material.clipShadows;
            result.clippingPlanes = material.clippingPlanes;
            result.wireframeLinewidth = material.wireframeLinewidth;
            result.linewidth = material.linewidth;
            if (isPointLight && result.uniforms.lightPos !== undefined) {
                result.uniforms.lightPos.value.copy(lightPositionWorld);
            }
            return result;
        };
        WebGLShadowMap.prototype.projectObject = function (object, camera, shadowCamera) {
            var _frustum = this._frustum;
            var _renderList = this._renderList;
            if (object.visible === false)
                return;
            if (object.layers.test(camera.layers) && (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points)) {
                if (object.castShadow && (object.frustumCulled === false || _frustum.intersectsObject(object) === true)) {
                    var material = object.material;
                    if (material.visible === true) {
                        object.modelViewMatrix.multiplyMatrices(shadowCamera.matrixWorldInverse, object.matrixWorld);
                        _renderList.push(object);
                    }
                }
            }
            var children = object.children;
            for (var i = 0, l = children.length; i < l; i++) {
                this.projectObject(children[i], camera, shadowCamera);
            }
        };
        WebGLShadowMap.prototype.render = function (scene, camera) {
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
            if (this.enabled === false)
                return;
            if (this.autoUpdate === false && this.needsUpdate === false)
                return;
            if (_lightShadows.length === 0)
                return;
            _state.clearColor(1, 1, 1, 1);
            _state.disable(_gl.BLEND);
            _state.setDepthTest(true);
            _state.setScissorTest(false);
            var faceCount;
            var isPointLight;
            for (var i = 0, il = _lightShadows.length; i < il; i++) {
                var light = _lightShadows[i];
                var shadow = light.shadow;
                if (shadow === undefined) {
                    console.warn('THREE.WebGLShadowMap:', light, 'has no shadow.');
                    continue;
                }
                var shadowCamera = shadow.camera;
                _shadowMapSize.copy(shadow.mapSize);
                _shadowMapSize.min(this._maxShadowMapSize);
                if (light instanceof THREE.PointLight) {
                    faceCount = 6;
                    isPointLight = true;
                    var vpWidth = _shadowMapSize.x;
                    var vpHeight = _shadowMapSize.y;
                    cube2DViewPorts[0].set(vpWidth * 2, vpHeight, vpWidth, vpHeight);
                    cube2DViewPorts[1].set(0, vpHeight, vpWidth, vpHeight);
                    cube2DViewPorts[2].set(vpWidth * 3, vpHeight, vpWidth, vpHeight);
                    cube2DViewPorts[3].set(vpWidth, vpHeight, vpWidth, vpHeight);
                    cube2DViewPorts[4].set(vpWidth * 3, 0, vpWidth, vpHeight);
                    cube2DViewPorts[5].set(vpWidth, 0, vpWidth, vpHeight);
                    _shadowMapSize.x *= 4.0;
                    _shadowMapSize.y *= 2.0;
                }
                else {
                    faceCount = 1;
                    isPointLight = false;
                }
                if (shadow.map === null) {
                    var pars = {
                        minFilter: THREE.NearestFilter,
                        magFilter: THREE.NearestFilter,
                        format: THREE.RGBAFormat
                    };
                    shadow.map = new THREE.WebGLRenderTarget(_shadowMapSize.x, _shadowMapSize.y, pars);
                    shadowCamera.updateProjectionMatrix();
                }
                if (shadow instanceof THREE.SpotLightShadow) {
                    shadow.update(light);
                }
                var shadowMap = shadow.map;
                var shadowMatrix = shadow.matrix;
                _lightPositionWorld.setFromMatrixPosition(light.matrixWorld);
                shadowCamera.position.copy(_lightPositionWorld);
                _renderer.setRenderTarget(shadowMap);
                _renderer.clear();
                for (var face = 0; face < faceCount; face++) {
                    if (isPointLight) {
                        _lookTarget.copy(shadowCamera.position);
                        _lookTarget.add(cubeDirections[face]);
                        shadowCamera.up.copy(cubeUps[face]);
                        shadowCamera.lookAt(_lookTarget);
                        var vpDimensions = cube2DViewPorts[face];
                        _state.viewport(vpDimensions);
                    }
                    else {
                        _lookTarget.setFromMatrixPosition(light.target.matrixWorld);
                        shadowCamera.lookAt(_lookTarget);
                    }
                    shadowCamera.updateMatrixWorld();
                    shadowCamera.matrixWorldInverse.getInverse(shadowCamera.matrixWorld);
                    shadowMatrix.set(0.5, 0.0, 0.0, 0.5, 0.0, 0.5, 0.0, 0.5, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0, 1.0);
                    shadowMatrix.multiply(shadowCamera.projectionMatrix);
                    shadowMatrix.multiply(shadowCamera.matrixWorldInverse);
                    _projScreenMatrix.multiplyMatrices(shadowCamera.projectionMatrix, shadowCamera.matrixWorldInverse);
                    _frustum.setFromMatrix(_projScreenMatrix);
                    _renderList.length = 0;
                    this.projectObject(scene, camera, shadowCamera);
                    for (var j = 0, jl = _renderList.length; j < jl; j++) {
                        var object = _renderList[j];
                        var geometry = _objects.update(object);
                        var material = object.material;
                        if (material instanceof THREE.MultiMaterial) {
                            var groups = geometry.groups;
                            var materials = material.materials;
                            for (var k = 0, kl = groups.length; k < kl; k++) {
                                var group = groups[k];
                                var groupMaterial = materials[group.materialIndex];
                                if (groupMaterial.visible === true) {
                                    var depthMaterial = this.getDepthMaterial(object, groupMaterial, isPointLight, _lightPositionWorld);
                                    _renderer.renderBufferDirect(shadowCamera, null, geometry, depthMaterial, object, group);
                                }
                            }
                        }
                        else {
                            var depthMaterial = this.getDepthMaterial(object, material, isPointLight, _lightPositionWorld);
                            _renderer.renderBufferDirect(shadowCamera, null, geometry, depthMaterial, object, null);
                        }
                    }
                }
            }
            var clearColor = _renderer.getClearColor();
            var clearAlpha = _renderer.getClearAlpha();
            _renderer.setClearColor(clearColor, clearAlpha);
            this.needsUpdate = false;
        };
        ;
        return WebGLShadowMap;
    }());
    THREE.WebGLShadowMap = WebGLShadowMap;
})(THREE || (THREE = {}));
