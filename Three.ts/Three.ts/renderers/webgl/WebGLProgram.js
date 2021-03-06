var THREE;
(function (THREE) {
    var WebGLProgram = (function () {
        function WebGLProgram(renderer, code, material, parameters) {
            this.id = WebGLProgram.programIdCount++;
            this.renderer = renderer;
            this.code = code;
            this.material = material;
            this.parameters = parameters;
            var filterEmptyLine = WebGLProgram.filterEmptyLine;
            var gl = this.gl = renderer.context;
            var extensions = material.extensions;
            var defines = material.defines;
            var vertexShader = material.__webglShader.vertexShader;
            var fragmentShader = material.__webglShader.fragmentShader;
            var shadowMapTypeDefine = 'SHADOWMAP_TYPE_BASIC';
            if (parameters.shadowMapType === THREE.PCFShadowMap) {
                shadowMapTypeDefine = 'SHADOWMAP_TYPE_PCF';
            }
            else if (parameters.shadowMapType === THREE.PCFSoftShadowMap) {
                shadowMapTypeDefine = 'SHADOWMAP_TYPE_PCF_SOFT';
            }
            var envMapTypeDefine = 'ENVMAP_TYPE_CUBE';
            var envMapModeDefine = 'ENVMAP_MODE_REFLECTION';
            var envMapBlendingDefine = 'ENVMAP_BLENDING_MULTIPLY';
            if (parameters.envMap) {
                switch (material.envMap.mapping) {
                    case THREE.CubeReflectionMapping:
                    case THREE.CubeRefractionMapping:
                        envMapTypeDefine = 'ENVMAP_TYPE_CUBE';
                        break;
                    case THREE.CubeUVReflectionMapping:
                    case THREE.CubeUVRefractionMapping:
                        envMapTypeDefine = 'ENVMAP_TYPE_CUBE_UV';
                        break;
                    case THREE.EquirectangularReflectionMapping:
                    case THREE.EquirectangularRefractionMapping:
                        envMapTypeDefine = 'ENVMAP_TYPE_EQUIREC';
                        break;
                    case THREE.SphericalReflectionMapping:
                        envMapTypeDefine = 'ENVMAP_TYPE_SPHERE';
                        break;
                }
                switch (material.envMap.mapping) {
                    case THREE.CubeRefractionMapping:
                    case THREE.EquirectangularRefractionMapping:
                        envMapModeDefine = 'ENVMAP_MODE_REFRACTION';
                        break;
                }
                switch (material.combine) {
                    case THREE.MultiplyOperation:
                        envMapBlendingDefine = 'ENVMAP_BLENDING_MULTIPLY';
                        break;
                    case THREE.MixOperation:
                        envMapBlendingDefine = 'ENVMAP_BLENDING_MIX';
                        break;
                    case THREE.AddOperation:
                        envMapBlendingDefine = 'ENVMAP_BLENDING_ADD';
                        break;
                }
            }
            var gammaFactorDefine = (renderer.gammaFactor > 0) ? renderer.gammaFactor : 1.0;
            var customExtensions = WebGLProgram.generateExtensions(extensions, parameters, renderer.extensions);
            var customDefines = WebGLProgram.generateDefines(defines);
            var program = gl.createProgram();
            var prefixVertex;
            var prefixFragment;
            if (material instanceof THREE.RawShaderMaterial) {
                prefixVertex = [
                    customDefines
                ].filter(filterEmptyLine).join('\n');
                prefixFragment = [
                    customDefines
                ].filter(filterEmptyLine).join('\n');
            }
            else {
                prefixVertex = [
                    'precision ' + parameters.precision + ' float;',
                    'precision ' + parameters.precision + ' int;',
                    '#define SHADER_NAME ' + material.__webglShader.name,
                    customDefines,
                    parameters.supportsVertexTextures ? '#define VERTEX_TEXTURES' : '',
                    '#define GAMMA_FACTOR ' + gammaFactorDefine,
                    '#define MAX_BONES ' + parameters.maxBones,
                    parameters.map ? '#define USE_MAP' : '',
                    parameters.envMap ? '#define USE_ENVMAP' : '',
                    parameters.envMap ? '#define ' + envMapModeDefine : '',
                    parameters.lightMap ? '#define USE_LIGHTMAP' : '',
                    parameters.aoMap ? '#define USE_AOMAP' : '',
                    parameters.emissiveMap ? '#define USE_EMISSIVEMAP' : '',
                    parameters.bumpMap ? '#define USE_BUMPMAP' : '',
                    parameters.normalMap ? '#define USE_NORMALMAP' : '',
                    parameters.displacementMap && parameters.supportsVertexTextures ? '#define USE_DISPLACEMENTMAP' : '',
                    parameters.specularMap ? '#define USE_SPECULARMAP' : '',
                    parameters.roughnessMap ? '#define USE_ROUGHNESSMAP' : '',
                    parameters.metalnessMap ? '#define USE_METALNESSMAP' : '',
                    parameters.alphaMap ? '#define USE_ALPHAMAP' : '',
                    parameters.vertexColors ? '#define USE_COLOR' : '',
                    parameters.flatShading ? '#define FLAT_SHADED' : '',
                    parameters.skinning ? '#define USE_SKINNING' : '',
                    parameters.useVertexTexture ? '#define BONE_TEXTURE' : '',
                    parameters.morphTargets ? '#define USE_MORPHTARGETS' : '',
                    parameters.morphNormals && parameters.flatShading === false ? '#define USE_MORPHNORMALS' : '',
                    parameters.doubleSided ? '#define DOUBLE_SIDED' : '',
                    parameters.flipSided ? '#define FLIP_SIDED' : '',
                    '#define NUM_CLIPPING_PLANES ' + parameters.numClippingPlanes,
                    parameters.shadowMapEnabled ? '#define USE_SHADOWMAP' : '',
                    parameters.shadowMapEnabled ? '#define ' + shadowMapTypeDefine : '',
                    parameters.sizeAttenuation ? '#define USE_SIZEATTENUATION' : '',
                    parameters.logarithmicDepthBuffer ? '#define USE_LOGDEPTHBUF' : '',
                    parameters.logarithmicDepthBuffer && renderer.extensions.get('EXT_frag_depth') ? '#define USE_LOGDEPTHBUF_EXT' : '',
                    'uniform mat4 modelMatrix;',
                    'uniform mat4 modelViewMatrix;',
                    'uniform mat4 projectionMatrix;',
                    'uniform mat4 viewMatrix;',
                    'uniform mat3 normalMatrix;',
                    'uniform vec3 cameraPosition;',
                    'attribute vec3 position;',
                    'attribute vec3 normal;',
                    'attribute vec2 uv;',
                    '#ifdef USE_COLOR',
                    '	attribute vec3 color;',
                    '#endif',
                    '#ifdef USE_MORPHTARGETS',
                    '	attribute vec3 morphTarget0;',
                    '	attribute vec3 morphTarget1;',
                    '	attribute vec3 morphTarget2;',
                    '	attribute vec3 morphTarget3;',
                    '	#ifdef USE_MORPHNORMALS',
                    '		attribute vec3 morphNormal0;',
                    '		attribute vec3 morphNormal1;',
                    '		attribute vec3 morphNormal2;',
                    '		attribute vec3 morphNormal3;',
                    '	#else',
                    '		attribute vec3 morphTarget4;',
                    '		attribute vec3 morphTarget5;',
                    '		attribute vec3 morphTarget6;',
                    '		attribute vec3 morphTarget7;',
                    '	#endif',
                    '#endif',
                    '#ifdef USE_SKINNING',
                    '	attribute vec4 skinIndex;',
                    '	attribute vec4 skinWeight;',
                    '#endif',
                    '\n'
                ].filter(filterEmptyLine).join('\n');
                prefixFragment = [
                    customExtensions,
                    'precision ' + parameters.precision + ' float;',
                    'precision ' + parameters.precision + ' int;',
                    '#define SHADER_NAME ' + material.__webglShader.name,
                    customDefines,
                    parameters.alphaTest ? '#define ALPHATEST ' + parameters.alphaTest : '',
                    '#define GAMMA_FACTOR ' + gammaFactorDefine,
                    (parameters.useFog && parameters.fog) ? '#define USE_FOG' : '',
                    (parameters.useFog && parameters.fogExp) ? '#define FOG_EXP2' : '',
                    parameters.map ? '#define USE_MAP' : '',
                    parameters.envMap ? '#define USE_ENVMAP' : '',
                    parameters.envMap ? '#define ' + envMapTypeDefine : '',
                    parameters.envMap ? '#define ' + envMapModeDefine : '',
                    parameters.envMap ? '#define ' + envMapBlendingDefine : '',
                    parameters.lightMap ? '#define USE_LIGHTMAP' : '',
                    parameters.aoMap ? '#define USE_AOMAP' : '',
                    parameters.emissiveMap ? '#define USE_EMISSIVEMAP' : '',
                    parameters.bumpMap ? '#define USE_BUMPMAP' : '',
                    parameters.normalMap ? '#define USE_NORMALMAP' : '',
                    parameters.specularMap ? '#define USE_SPECULARMAP' : '',
                    parameters.roughnessMap ? '#define USE_ROUGHNESSMAP' : '',
                    parameters.metalnessMap ? '#define USE_METALNESSMAP' : '',
                    parameters.alphaMap ? '#define USE_ALPHAMAP' : '',
                    parameters.vertexColors ? '#define USE_COLOR' : '',
                    parameters.flatShading ? '#define FLAT_SHADED' : '',
                    parameters.doubleSided ? '#define DOUBLE_SIDED' : '',
                    parameters.flipSided ? '#define FLIP_SIDED' : '',
                    '#define NUM_CLIPPING_PLANES ' + parameters.numClippingPlanes,
                    parameters.shadowMapEnabled ? '#define USE_SHADOWMAP' : '',
                    parameters.shadowMapEnabled ? '#define ' + shadowMapTypeDefine : '',
                    parameters.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : '',
                    parameters.physicallyCorrectLights ? "#define PHYSICALLY_CORRECT_LIGHTS" : '',
                    parameters.logarithmicDepthBuffer ? '#define USE_LOGDEPTHBUF' : '',
                    parameters.logarithmicDepthBuffer && renderer.extensions.get('EXT_frag_depth') ? '#define USE_LOGDEPTHBUF_EXT' : '',
                    parameters.envMap && renderer.extensions.get('EXT_shader_texture_lod') ? '#define TEXTURE_LOD_EXT' : '',
                    'uniform mat4 viewMatrix;',
                    'uniform vec3 cameraPosition;',
                    (parameters.toneMapping !== THREE.NoToneMapping) ? "#define TONE_MAPPING" : '',
                    (parameters.toneMapping !== THREE.NoToneMapping) ? THREE.ShaderChunk['tonemapping_pars_fragment'] : '',
                    (parameters.toneMapping !== THREE.NoToneMapping) ? WebGLProgram.getToneMappingFunction("toneMapping", parameters.toneMapping) : '',
                    (parameters.outputEncoding || parameters.mapEncoding || parameters.envMapEncoding || parameters.emissiveMapEncoding) ? THREE.ShaderChunk['encodings_pars_fragment'] : '',
                    parameters.mapEncoding ? WebGLProgram.getTexelDecodingFunction('mapTexelToLinear', parameters.mapEncoding) : '',
                    parameters.envMapEncoding ? WebGLProgram.getTexelDecodingFunction('envMapTexelToLinear', parameters.envMapEncoding) : '',
                    parameters.emissiveMapEncoding ? WebGLProgram.getTexelDecodingFunction('emissiveMapTexelToLinear', parameters.emissiveMapEncoding) : '',
                    parameters.outputEncoding ? WebGLProgram.getTexelEncodingFunction("linearToOutputTexel", parameters.outputEncoding) : '',
                    parameters.depthPacking ? "#define DEPTH_PACKING " + material.depthPacking : '',
                    '\n'
                ].filter(filterEmptyLine).join('\n');
            }
            vertexShader = WebGLProgram.parseIncludes(vertexShader, parameters);
            vertexShader = WebGLProgram.replaceLightNums(vertexShader, parameters);
            fragmentShader = WebGLProgram.parseIncludes(fragmentShader, parameters);
            fragmentShader = WebGLProgram.replaceLightNums(fragmentShader, parameters);
            if (material instanceof THREE.ShaderMaterial === false) {
                vertexShader = WebGLProgram.unrollLoops(vertexShader);
                fragmentShader = WebGLProgram.unrollLoops(fragmentShader);
            }
            var vertexGlsl = prefixVertex + vertexShader;
            var fragmentGlsl = prefixFragment + fragmentShader;
            var glVertexShader = THREE.WebGLShader(gl, gl.VERTEX_SHADER, vertexGlsl);
            var glFragmentShader = THREE.WebGLShader(gl, gl.FRAGMENT_SHADER, fragmentGlsl);
            gl.attachShader(program, glVertexShader);
            gl.attachShader(program, glFragmentShader);
            if (material.index0AttributeName !== undefined) {
                gl.bindAttribLocation(program, 0, material.index0AttributeName);
            }
            else if (parameters.morphTargets === true) {
                gl.bindAttribLocation(program, 0, 'position');
            }
            gl.linkProgram(program);
            var programLog = gl.getProgramInfoLog(program);
            var vertexLog = gl.getShaderInfoLog(glVertexShader);
            var fragmentLog = gl.getShaderInfoLog(glFragmentShader);
            var runnable = true;
            var haveDiagnostics = true;
            if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
                runnable = false;
                console.error('THREE.WebGLProgram: shader error: ', gl.getError(), 'gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS), 'gl.getProgramInfoLog', programLog, vertexLog, fragmentLog);
            }
            else if (programLog !== '') {
                console.warn('THREE.WebGLProgram: gl.getProgramInfoLog()', programLog);
            }
            else if (vertexLog === '' || fragmentLog === '') {
                haveDiagnostics = false;
            }
            if (haveDiagnostics) {
                this.diagnostics = {
                    runnable: runnable,
                    material: material,
                    programLog: programLog,
                    vertexShader: {
                        log: vertexLog,
                        prefix: prefixVertex
                    },
                    fragmentShader: {
                        log: fragmentLog,
                        prefix: prefixFragment
                    }
                };
            }
            gl.deleteShader(glVertexShader);
            gl.deleteShader(glFragmentShader);
            this.code = code;
            this.usedTimes = 1;
            this.program = program;
            this.vertexShader = glVertexShader;
            this.fragmentShader = glFragmentShader;
        }
        WebGLProgram.getEncodingComponents = function (encoding) {
            switch (encoding) {
                case THREE.LinearEncoding:
                    return ['Linear', '( value )'];
                case THREE.sRGBEncoding:
                    return ['sRGB', '( value )'];
                case THREE.RGBEEncoding:
                    return ['RGBE', '( value )'];
                case THREE.RGBM7Encoding:
                    return ['RGBM', '( value, 7.0 )'];
                case THREE.RGBM16Encoding:
                    return ['RGBM', '( value, 16.0 )'];
                case THREE.RGBDEncoding:
                    return ['RGBD', '( value, 256.0 )'];
                case THREE.GammaEncoding:
                    return ['Gamma', '( value, float( GAMMA_FACTOR ) )'];
                default:
                    throw new Error('unsupported encoding: ' + encoding);
            }
        };
        WebGLProgram.getTexelDecodingFunction = function (functionName, encoding) {
            var components = WebGLProgram.getEncodingComponents(encoding);
            return "vec4 " + functionName + "( vec4 value ) { return " + components[0] + "ToLinear" + components[1] + "; }";
        };
        WebGLProgram.getTexelEncodingFunction = function (functionName, encoding) {
            var components = WebGLProgram.getEncodingComponents(encoding);
            return "vec4 " + functionName + "( vec4 value ) { return LinearTo" + components[0] + components[1] + "; }";
        };
        WebGLProgram.getToneMappingFunction = function (functionName, toneMapping) {
            var toneMappingName;
            switch (toneMapping) {
                case THREE.LinearToneMapping:
                    toneMappingName = "Linear";
                    break;
                case THREE.ReinhardToneMapping:
                    toneMappingName = "Reinhard";
                    break;
                case THREE.Uncharted2ToneMapping:
                    toneMappingName = "Uncharted2";
                    break;
                case THREE.CineonToneMapping:
                    toneMappingName = "OptimizedCineon";
                    break;
                default:
                    throw new Error('unsupported toneMapping: ' + toneMapping);
            }
            return "vec3 " + functionName + "( vec3 color ) { return " + toneMappingName + "ToneMapping( color ); }";
        };
        WebGLProgram.generateExtensions = function (extensions, parameters, rendererExtensions) {
            extensions = extensions || {};
            var chunks = [
                (extensions.derivatives || parameters.envMapCubeUV || parameters.bumpMap || parameters.normalMap || parameters.flatShading) ? '#extension GL_OES_standard_derivatives : enable' : '',
                (extensions.fragDepth || parameters.logarithmicDepthBuffer) && rendererExtensions.get('EXT_frag_depth') ? '#extension GL_EXT_frag_depth : enable' : '',
                (extensions.drawBuffers) && rendererExtensions.get('WEBGL_draw_buffers') ? '#extension GL_EXT_draw_buffers : require' : '',
                (extensions.shaderTextureLOD || parameters.envMap) && rendererExtensions.get('EXT_shader_texture_lod') ? '#extension GL_EXT_shader_texture_lod : enable' : '',
            ];
            return chunks.filter(WebGLProgram.filterEmptyLine).join('\n');
        };
        WebGLProgram.generateDefines = function (defines) {
            var chunks = [];
            for (var name in defines) {
                var value = defines[name];
                if (value === false)
                    continue;
                chunks.push('#define ' + name + ' ' + value);
            }
            return chunks.join('\n');
        };
        WebGLProgram.fetchAttributeLocations = function (gl, program, identifiers) {
            var attributes = {};
            var n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < n; i++) {
                var info = gl.getActiveAttrib(program, i);
                var name = info.name;
                attributes[name] = gl.getAttribLocation(program, name);
            }
            return attributes;
        };
        WebGLProgram.filterEmptyLine = function (string) {
            return string !== '';
        };
        WebGLProgram.replaceLightNums = function (string, parameters) {
            return string
                .replace(/NUM_DIR_LIGHTS/g, parameters.numDirLights)
                .replace(/NUM_SPOT_LIGHTS/g, parameters.numSpotLights)
                .replace(/NUM_POINT_LIGHTS/g, parameters.numPointLights)
                .replace(/NUM_HEMI_LIGHTS/g, parameters.numHemiLights);
        };
        WebGLProgram.parseIncludes = function (string) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var pattern = /#include +<([\w\d.]+)>/g;
            function replace(match, include) {
                var replace = THREE.ShaderChunk[include];
                if (replace === undefined) {
                    throw new Error('Can not resolve #include <' + include + '>');
                }
                return WebGLProgram.parseIncludes(replace);
            }
            return string.replace(pattern, replace);
        };
        WebGLProgram.unrollLoops = function (string) {
            var pattern = /for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g;
            function replace(match, start, end, snippet) {
                var unroll = '';
                for (var i = parseInt(start); i < parseInt(end); i++) {
                    unroll += snippet.replace(/\[ i \]/g, '[ ' + i + ' ]');
                }
                return unroll;
            }
            return string.replace(pattern, replace);
        };
        ;
        WebGLProgram.prototype.getAttributes = function () {
            if (this.cachedAttributes === undefined) {
                this.cachedAttributes = WebGLProgram.fetchAttributeLocations(this.gl, this.program);
            }
            return this.cachedAttributes;
        };
        ;
        WebGLProgram.prototype.getUniforms = function () {
            if (this.cachedUniforms === undefined) {
                this.cachedUniforms =
                    new THREE.WebGLUniforms(this.gl, this.program, this.renderer);
            }
            return this.cachedUniforms;
        };
        ;
        WebGLProgram.prototype.destroy = function () {
            this.gl.deleteProgram(this.program);
            this.program = undefined;
        };
        ;
        WebGLProgram.programIdCount = 0;
        return WebGLProgram;
    }());
    THREE.WebGLProgram = WebGLProgram;
})(THREE || (THREE = {}));
