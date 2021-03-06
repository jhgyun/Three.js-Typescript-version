﻿type _WebGLProgram = WebGLProgram; 
namespace THREE
{ 
    export class WebGLProgram    
    {
        private static programIdCount = 0;

        private static getEncodingComponents(encoding: number)
        {
            switch (encoding)
            { 
                case LinearEncoding:
                    return ['Linear', '( value )'];
                case sRGBEncoding:
                    return ['sRGB', '( value )'];
                case RGBEEncoding:
                    return ['RGBE', '( value )'];
                case RGBM7Encoding:
                    return ['RGBM', '( value, 7.0 )'];
                case RGBM16Encoding:
                    return ['RGBM', '( value, 16.0 )'];
                case RGBDEncoding:
                    return ['RGBD', '( value, 256.0 )'];
                case GammaEncoding:
                    return ['Gamma', '( value, float( GAMMA_FACTOR ) )'];
                default:
                    throw new Error('unsupported encoding: ' + encoding);
            }
        }
        private static getTexelDecodingFunction(functionName: string, encoding: number)
        { 
            var components = WebGLProgram.getEncodingComponents(encoding);
            return "vec4 " + functionName + "( vec4 value ) { return " + components[0] + "ToLinear" + components[1] + "; }";
        }
        private static getTexelEncodingFunction(functionName: string, encoding: number)
        { 
            var components = WebGLProgram.getEncodingComponents(encoding);
            return "vec4 " + functionName + "( vec4 value ) { return LinearTo" + components[0] + components[1] + "; }";
        }
        private static getToneMappingFunction(functionName, toneMapping: number)
        { 
            var toneMappingName;

            switch (toneMapping)
            { 
                case LinearToneMapping:
                    toneMappingName = "Linear";
                    break;

                case ReinhardToneMapping:
                    toneMappingName = "Reinhard";
                    break;

                case Uncharted2ToneMapping:
                    toneMappingName = "Uncharted2";
                    break;

                case CineonToneMapping:
                    toneMappingName = "OptimizedCineon";
                    break;

                default:
                    throw new Error('unsupported toneMapping: ' + toneMapping); 
            }

            return "vec3 " + functionName + "( vec3 color ) { return " + toneMappingName + "ToneMapping( color ); }";

        }
        private static generateExtensions(extensions, parameters: IWebGLProgramParameters, rendererExtensions: WebGLExtensions)
        { 
            extensions = extensions || {};

            var chunks = [
                (extensions.derivatives || parameters.envMapCubeUV || parameters.bumpMap || parameters.normalMap || parameters.flatShading) ? '#extension GL_OES_standard_derivatives : enable' : '',
                (extensions.fragDepth || parameters.logarithmicDepthBuffer) && rendererExtensions.get('EXT_frag_depth') ? '#extension GL_EXT_frag_depth : enable' : '',
                (extensions.drawBuffers) && rendererExtensions.get('WEBGL_draw_buffers') ? '#extension GL_EXT_draw_buffers : require' : '',
                (extensions.shaderTextureLOD || parameters.envMap) && rendererExtensions.get('EXT_shader_texture_lod') ? '#extension GL_EXT_shader_texture_lod : enable' : '',
            ];

            return chunks.filter(WebGLProgram.filterEmptyLine).join('\n');

        }
        private static generateDefines(defines)
        { 
            var chunks = []; 
            for (var name in defines)
            { 
                var value = defines[name]; 
                if (value === false) continue; 
                chunks.push('#define ' + name + ' ' + value); 
            } 
            return chunks.join('\n'); 
        }
        private static fetchAttributeLocations(gl: WebGLRenderingContext, program: _WebGLProgram, identifiers?)
        {
            var attributes: { [index: string]: number } = {}; 
            var n = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

            for (var i = 0; i < n; i++)
            { 
                var info = gl.getActiveAttrib(program, i);
                var name = info.name;

                // console.log("THREE.WebGLProgram: ACTIVE VERTEX ATTRIBUTE:", name, i ); 
                attributes[name] = gl.getAttribLocation(program, name); 
            }

            return attributes;

        }
        private static filterEmptyLine(string: string)
        { 
            return string !== ''; 
        }
        private static replaceLightNums(string: string, parameters: any)//WebGLProgramParameters)
        { 
            return string
                .replace(/NUM_DIR_LIGHTS/g,     parameters.numDirLights)
                .replace(/NUM_SPOT_LIGHTS/g,    parameters.numSpotLights)
                .replace(/NUM_POINT_LIGHTS/g,   parameters.numPointLights)
                .replace(/NUM_HEMI_LIGHTS/g,    parameters.numHemiLights);

        }
        private static parseIncludes(string,...args)
        { 
            var pattern = /#include +<([\w\d.]+)>/g; 
            function replace(match, include)
            { 
                var replace = ShaderChunk[include];

                if (replace === undefined)
                { 
                    throw new Error('Can not resolve #include <' + include + '>'); 
                }

                return WebGLProgram.parseIncludes(replace); 
            }

            return string.replace(pattern, replace);

        }
        private static unrollLoops(string)
        { 
            var pattern = /for \( int i \= (\d+)\; i < (\d+)\; i \+\+ \) \{([\s\S]+?)(?=\})\}/g; 
            function replace(match, start, end, snippet)
            { 
                var unroll = ''; 
                for (var i = parseInt(start); i < parseInt(end); i++)
                { 
                    unroll += snippet.replace(/\[ i \]/g, '[ ' + i + ' ]'); 
                }

                return unroll; 
            }

            return string.replace(pattern, replace); 
        }

        private gl: WebGLRenderingContext;
        public program: _WebGLProgram;
        public renderer: WebGLRenderer;
        public code: string;
        private material;
        private parameters: IWebGLProgramParameters;
        public usedTimes: number;
        public vertexShader: WebGLShader;
        public fragmentShader: WebGLShader;

        constructor(renderer: WebGLRenderer,
            code: string,
            material: IMaterial,
            parameters: IWebGLProgramParameters)
        {
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

            if (parameters.shadowMapType === PCFShadowMap)
            { 
                shadowMapTypeDefine = 'SHADOWMAP_TYPE_PCF';

            } else if (parameters.shadowMapType === PCFSoftShadowMap)
            { 
                shadowMapTypeDefine = 'SHADOWMAP_TYPE_PCF_SOFT'; 
            }

            var envMapTypeDefine = 'ENVMAP_TYPE_CUBE';
            var envMapModeDefine = 'ENVMAP_MODE_REFLECTION';
            var envMapBlendingDefine = 'ENVMAP_BLENDING_MULTIPLY';

            if (parameters.envMap)
            { 
                switch (material.envMap.mapping)
                { 
                    case CubeReflectionMapping:
                    case CubeRefractionMapping:
                        envMapTypeDefine = 'ENVMAP_TYPE_CUBE';
                        break;

                    case CubeUVReflectionMapping:
                    case CubeUVRefractionMapping:
                        envMapTypeDefine = 'ENVMAP_TYPE_CUBE_UV';
                        break;

                    case EquirectangularReflectionMapping:
                    case EquirectangularRefractionMapping:
                        envMapTypeDefine = 'ENVMAP_TYPE_EQUIREC';
                        break;

                    case SphericalReflectionMapping:
                        envMapTypeDefine = 'ENVMAP_TYPE_SPHERE';
                        break;

                }

                switch (material.envMap.mapping)
                {
                    case CubeRefractionMapping:
                    case EquirectangularRefractionMapping:
                        envMapModeDefine = 'ENVMAP_MODE_REFRACTION';
                        break;

                }

                switch (material.combine)
                { 
                    case MultiplyOperation:
                        envMapBlendingDefine = 'ENVMAP_BLENDING_MULTIPLY';
                        break; 
                    case MixOperation:
                        envMapBlendingDefine = 'ENVMAP_BLENDING_MIX';
                        break; 
                    case AddOperation:
                        envMapBlendingDefine = 'ENVMAP_BLENDING_ADD';
                        break; 
                }

            }

            var gammaFactorDefine = (renderer.gammaFactor > 0) ? renderer.gammaFactor : 1.0;

            // console.log( 'building new program ' ); 
            // 
            var customExtensions = WebGLProgram.generateExtensions(extensions, parameters, renderer.extensions); 
            var customDefines = WebGLProgram.generateDefines(defines); 
            //

            var program = gl.createProgram();
            var prefixVertex: string;
            var prefixFragment: string;

            if (material instanceof RawShaderMaterial)
            { 
                prefixVertex = [ 
                    customDefines

                ].filter(filterEmptyLine).join('\n');

                prefixFragment = [ 
                    customDefines 
                ].filter(filterEmptyLine).join('\n');

            }
            else
            { 
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

                    (parameters.toneMapping !== NoToneMapping) ? "#define TONE_MAPPING" : '',
                    (parameters.toneMapping !== NoToneMapping) ? ShaderChunk['tonemapping_pars_fragment'] : '',  // this code is required here because it is used by the toneMapping() function defined below
                    (parameters.toneMapping !== NoToneMapping) ? WebGLProgram.getToneMappingFunction("toneMapping", parameters.toneMapping) : '',

                    (parameters.outputEncoding || parameters.mapEncoding || parameters.envMapEncoding || parameters.emissiveMapEncoding) ? ShaderChunk['encodings_pars_fragment'] : '', // this code is required here because it is used by the various encoding/decoding function defined below
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

            if (material instanceof ShaderMaterial === false)
            { 
                vertexShader = WebGLProgram.unrollLoops(vertexShader);
                fragmentShader = WebGLProgram.unrollLoops(fragmentShader); 
            }

            var vertexGlsl = prefixVertex + vertexShader;
            var fragmentGlsl = prefixFragment + fragmentShader;

            // console.log( '*VERTEX*', vertexGlsl );
            // console.log( '*FRAGMENT*', fragmentGlsl );

            var glVertexShader = WebGLShader(gl, gl.VERTEX_SHADER, vertexGlsl);
            var glFragmentShader = WebGLShader(gl, gl.FRAGMENT_SHADER, fragmentGlsl);

            gl.attachShader(program, glVertexShader);
            gl.attachShader(program, glFragmentShader);

            // Force a particular attribute to index 0.

            if (material.index0AttributeName !== undefined)
            { 
                gl.bindAttribLocation(program, 0, material.index0AttributeName);

            }
            else if (parameters.morphTargets === true)
            { 
                // programs with morphTargets displace position out of attribute 0
                gl.bindAttribLocation(program, 0, 'position');

            }

            gl.linkProgram(program);

            var programLog = gl.getProgramInfoLog(program);
            var vertexLog = gl.getShaderInfoLog(glVertexShader);
            var fragmentLog = gl.getShaderInfoLog(glFragmentShader);

            var runnable = true;
            var haveDiagnostics = true;

            // console.log( '**VERTEX**', gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( glVertexShader ) );
            // console.log( '**FRAGMENT**', gl.getExtension( 'WEBGL_debug_shaders' ).getTranslatedShaderSource( glFragmentShader ) );

            if (gl.getProgramParameter(program, gl.LINK_STATUS) === false)
            { 
                runnable = false; 
                console.error('THREE.WebGLProgram: shader error: ', gl.getError(), 'gl.VALIDATE_STATUS', gl.getProgramParameter(program, gl.VALIDATE_STATUS), 'gl.getProgramInfoLog', programLog, vertexLog, fragmentLog);

            }
            else if (programLog !== '')
            { 
                console.warn('THREE.WebGLProgram: gl.getProgramInfoLog()', programLog);
            }
            else if (vertexLog === '' || fragmentLog === '')
            { 
                haveDiagnostics = false; 
            }

            if (haveDiagnostics)
            { 
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

            // clean up

            gl.deleteShader(glVertexShader);
            gl.deleteShader(glFragmentShader);


            this.code = code;
            this.usedTimes = 1;
            this.program = program;
            this.vertexShader = glVertexShader;
            this.fragmentShader = glFragmentShader;  
        };

        public id = WebGLProgram.programIdCount++;
        public diagnostics: any; 
         
        private cachedAttributes: { [index: string]: number }; 
        public getAttributes(): { [index: string]: number }
        { 
            if (this.cachedAttributes === undefined)
            {
                this.cachedAttributes = WebGLProgram.fetchAttributeLocations(this.gl, this.program); 
            } 
            return this.cachedAttributes; 
        };

        private cachedUniforms: WebGLUniforms;
        public getUniforms(): WebGLUniforms
        {
            if (this.cachedUniforms === undefined)
            {
                this.cachedUniforms =
                    new WebGLUniforms(this.gl, this.program, this.renderer);
            }

            return this.cachedUniforms;

        };
        public destroy()
        { 
            this.gl.deleteProgram(this.program);
            this.program = undefined; 
        };
    }

}