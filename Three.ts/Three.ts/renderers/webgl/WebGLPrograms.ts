namespace THREE
{ 
    export class WebGLPrograms
    {
        public programs: WebGLProgram[];
        private shaderIDs = {
            MeshDepthMaterial: 'depth',
            MeshNormalMaterial: 'normal',
            MeshBasicMaterial: 'basic',
            MeshLambertMaterial: 'lambert',
            MeshPhongMaterial: 'phong',
            MeshStandardMaterial: 'physical',
            MeshPhysicalMaterial: 'physical',
            LineBasicMaterial: 'basic',
            LineDashedMaterial: 'dashed',
            PointsMaterial: 'points'
        }
        private parameterNames: string[];
        private capabilities: WebGLCapabilities;
        private renderer: WebGLRenderer;

        constructor(renderer: WebGLRenderer, capabilities: WebGLCapabilities)
        {
            this.renderer = renderer;
            this.capabilities = capabilities;

            this.programs = [];
             
            this.parameterNames = [
                "precision", "supportsVertexTextures", "map", "mapEncoding", "envMap", "envMapMode", "envMapEncoding",
                "lightMap", "aoMap", "emissiveMap", "emissiveMapEncoding", "bumpMap", "normalMap", "displacementMap", "specularMap",
                "roughnessMap", "metalnessMap",
                "alphaMap", "combine", "vertexColors", "fog", "useFog", "fogExp",
                "flatShading", "sizeAttenuation", "logarithmicDepthBuffer", "skinning",
                "maxBones", "useVertexTexture", "morphTargets", "morphNormals",
                "maxMorphTargets", "maxMorphNormals", "premultipliedAlpha",
                "numDirLights", "numPointLights", "numSpotLights", "numHemiLights",
                "shadowMapEnabled", "shadowMapType", "toneMapping", 'physicallyCorrectLights',
                "alphaTest", "doubleSided", "flipSided", "numClippingPlanes", "depthPacking"
            ];
        };

        private allocateBones(object)
        {
            var capabilities = this.capabilities;
            if (capabilities.floatVertexTextures && object && object.skeleton && object.skeleton.useVertexTexture)
            {
                return 1024;
            }
            else
            {
                // default for when object is not specified
                // ( for example when prebuilding shader to be used with multiple objects )
                //
                //  - leave some extra space for other uniforms
                //  - limit here is ANGLE's 254 max uniform vectors
                //    (up to 54 should be safe)

                var nVertexUniforms = capabilities.maxVertexUniforms;
                var nVertexMatrices = Math.floor((nVertexUniforms - 20) / 4);

                var maxBones = nVertexMatrices;

                if (object !== undefined && object instanceof SkinnedMesh)
                {
                    maxBones = Math.min(object.skeleton.bones.length, maxBones);

                    if (maxBones < object.skeleton.bones.length)
                    {
                        console.warn('WebGLRenderer: too many bones - ' + object.skeleton.bones.length + ', this GPU supports just ' + maxBones + ' (try OpenGL instead of ANGLE)');
                    }
                }
                return maxBones;
            }
        }
        private getTextureEncodingFromMap(map, gammaOverrideLinear)
        {
            var encoding: number;
            if (!map)
            {
                encoding = LinearEncoding;
            }
            else if (map instanceof Texture)
            {
                encoding = map.encoding;
            }
            else if (map instanceof WebGLRenderTarget)
            {
                console.warn("THREE.WebGLPrograms.getTextureEncodingFromMap: don't use render targets as textures. Use their .texture property instead.");
                encoding = map.texture.encoding;
            }

            // add backwards compatibility for WebGLRenderer.gammaInput/gammaOutput parameter, should probably be removed at some point.
            if (encoding === LinearEncoding && gammaOverrideLinear)
            {
                encoding = GammaEncoding;
            }

            return encoding;
        }
        public getParameters(material: IMaterial, lights: LightArrayCache, fog, nClipPlanes, object)
        {
            var renderer = this.renderer;
            var shaderIDs = this.shaderIDs; 
            var capabilities = this.capabilities;
            
            var shaderID = shaderIDs[material.type];

            // heuristics to create shader parameters according to lights in the scene
            // (not to blow over maxLights budget)

            var maxBones = this.allocateBones(object);
            var precision = renderer.getPrecision();

            if (material.precision !== null)
            {
                precision = capabilities.getMaxPrecision(material.precision);

                if (precision !== material.precision)
                {
                    console.warn('THREE.WebGLProgram.getParameters:', material.precision, 'not supported, using', precision, 'instead.');
                }
            }

            var currentRenderTarget = renderer.getCurrentRenderTarget();

            var parameters: WebGLProgramParameters = {
                shaderID: shaderID, 
                precision: precision,
                supportsVertexTextures: capabilities.vertexTextures,
                outputEncoding: this.getTextureEncodingFromMap((!currentRenderTarget) ? null : currentRenderTarget.texture, renderer.gammaOutput),
                map: !!material.map,
                mapEncoding: this.getTextureEncodingFromMap(material.map, renderer.gammaInput),
                envMap: !!material.envMap,
                envMapMode: material.envMap && material.envMap.mapping,
                envMapEncoding: this.getTextureEncodingFromMap(material.envMap, renderer.gammaInput),
                envMapCubeUV: (!!material.envMap) && ((material.envMap.mapping === CubeUVReflectionMapping) || (material.envMap.mapping === CubeUVRefractionMapping)),
                lightMap: !!material.lightMap,
                aoMap: !!material.aoMap,
                emissiveMap: !!material.emissiveMap,
                emissiveMapEncoding: this.getTextureEncodingFromMap(material.emissiveMap, renderer.gammaInput),
                bumpMap: !!material.bumpMap,
                normalMap: !!material.normalMap,
                displacementMap: !!material.displacementMap,
                roughnessMap: !!material.roughnessMap,
                metalnessMap: !!material.metalnessMap,
                specularMap: !!material.specularMap,
                alphaMap: !!material.alphaMap,

                combine: material.combine,

                vertexColors: material.vertexColors,

                fog: fog,
                useFog: material.fog,
                fogExp: fog instanceof FogExp2,

                flatShading: material.shading === FlatShading,

                sizeAttenuation: material.sizeAttenuation,
                logarithmicDepthBuffer: capabilities.logarithmicDepthBuffer,

                skinning: material.skinning,
                maxBones: maxBones,
                useVertexTexture: capabilities.floatVertexTextures && object && object.skeleton && object.skeleton.useVertexTexture,

                morphTargets: material.morphTargets,
                morphNormals: material.morphNormals,
                maxMorphTargets: renderer.maxMorphTargets,
                maxMorphNormals: renderer.maxMorphNormals,

                numDirLights: lights.directional.length,
                numPointLights: lights.point.length,
                numSpotLights: lights.spot.length,
                numHemiLights: lights.hemi.length,

                numClippingPlanes: nClipPlanes,

                shadowMapEnabled: renderer.shadowMap.enabled && object.receiveShadow && lights.shadows.length > 0,
                shadowMapType: renderer.shadowMap.type,

                toneMapping: renderer.toneMapping,
                physicallyCorrectLights: renderer.physicallyCorrectLights,

                premultipliedAlpha: material.premultipliedAlpha,

                alphaTest: material.alphaTest,
                doubleSided: material.side === DoubleSide,
                flipSided: material.side === BackSide,

                depthPacking: (material.depthPacking !== undefined) ? material.depthPacking : false

            };

            return parameters;

        };
        public getProgramCode(material, parameters)
        {
            var parameterNames = this.parameterNames;

            var array = [];
            if (parameters.shaderID)
            {
                array.push(parameters.shaderID);
            }
            else
            {
                array.push(material.fragmentShader);
                array.push(material.vertexShader);
            }

            if (material.defines !== undefined)
            {
                for (var name in material.defines)
                {
                    array.push(name);
                    array.push(material.defines[name]);
                }
            }

            for (var i = 0; i < parameterNames.length; i++)
            {
                array.push(parameters[parameterNames[i]]);
            }
            return array.join();

        };
        public acquireProgram(material, parameters: WebGLProgramParameters, code: string)
        {
            var programs = this.programs;
            var program: WebGLProgram;
            var renderer = this.renderer;
            // Check if code has been already compiled
            for (var p = 0, pl = programs.length; p < pl; p++)
            {
                var programInfo = programs[p];

                if (programInfo.code === code)
                {
                    program = programInfo;
                    ++program.usedTimes;
                    break;
                }
            }

            if (program === undefined)
            {
                program = new WebGLProgram(renderer, code, material, parameters);
                programs.push(program);
            }

            return program;
        };
        public releaseProgram(program)
        {
            var programs = this.programs;
            if (--program.usedTimes === 0)
            {
                // Remove from unordered set
                var i = programs.indexOf(program);
                programs[i] = programs[programs.length - 1];
                programs.pop();
                // Free WebGL resources
                program.destroy();
            }
        };

        
    }
}
