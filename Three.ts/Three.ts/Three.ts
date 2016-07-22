/**
 * @author mrdoob / http://mrdoob.com/
 */

interface NumberConstructor
{
    EPSILON?: number;
}
interface Math
{
    sign: (n: number) => number;
}
interface Function
{
    name: string;
}
interface Object
{
    assign: (...arg:any[]) => any;
}

declare var define;
declare var exports;
declare var module;
//

if (typeof define === 'function' && define.amd)
{ 
    define('three', THREE); 
}
else if ('undefined' !== typeof exports && 'undefined' !== typeof module)
{ 
    module.exports = THREE; 
}

// Polyfills 
if (Number.EPSILON === undefined)
{ 
    Number.EPSILON = Math.pow(2, - 52); 
}

// 
if (Math.sign === undefined)
{ 
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign 
    Math.sign = function (x)
    {

        return (x < 0) ? - 1 : (x > 0) ? 1 : + x;

    }; 
}

if (Function.prototype.name === undefined)
{ 
    // Missing in IE9-11.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name 
    Object.defineProperty(Function.prototype, 'name', { 
        get: function ()
        { 
            return this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1]; 
        } 
    });

}

if (Object.assign === undefined)
{ 
    // Missing in IE.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

    (function ()
    { 
        Object.assign = function (target)
        { 
            'use strict'; 
            if (target === undefined || target === null)
            { 
                throw new TypeError('Cannot convert undefined or null to object'); 
            }

            var output = Object(target); 
            for (var index = 1; index < arguments.length; index++)
            { 
                var source = arguments[index]; 
                if (source !== undefined && source !== null)
                { 
                    for (var nextKey in source)
                    { 
                        if (Object.prototype.hasOwnProperty.call(source, nextKey))
                        { 
                            output[nextKey] = source[nextKey]; 
                        } 
                    } 
                } 
            } 
            return output; 
        }; 
    })(); 
}
 
//
namespace THREE
{
    export var REVISION = '78';
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.button

    export var MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2 };

    // GL STATE CONSTANTS

    export var CullFaceNone = 0;
    export var CullFaceBack = 1;
    export var CullFaceFront = 2;
    export var CullFaceFrontBack = 3;

    export var FrontFaceDirectionCW = 0;
    export var FrontFaceDirectionCCW = 1;

    // SHADOWING TYPES 
    export var BasicShadowMap = 0;
    export var PCFShadowMap = 1;
    export var PCFSoftShadowMap = 2;

    // MATERIAL CONSTANTS 
    // side

    export var FrontSide = 0;
    export var BackSide = 1;
    export var DoubleSide = 2;

    // shading

    export var FlatShading = 1;
    export var SmoothShading = 2;

    // colors

    export var NoColors = 0;
    export var FaceColors = 1;
    export var VertexColors = 2;

    // blending modes

    export var NoBlending = 0;
    export var NormalBlending = 1;
    export var AdditiveBlending = 2;
    export var SubtractiveBlending = 3;
    export var MultiplyBlending = 4;
    export var CustomBlending = 5;

    // custom blending equations
    // (numbers start from 100 not to clash with other
    // mappings to OpenGL constants defined in Texture.js)

    export var AddEquation = 100;
    export var SubtractEquation = 101;
    export var ReverseSubtractEquation = 102;
    export var MinEquation = 103;
    export var MaxEquation = 104;

    // custom blending destination factors

    export var ZeroFactor = 200;
    export var OneFactor = 201;
    export var SrcColorFactor = 202;
    export var OneMinusSrcColorFactor = 203;
    export var SrcAlphaFactor = 204;
    export var OneMinusSrcAlphaFactor = 205;
    export var DstAlphaFactor = 206;
    export var OneMinusDstAlphaFactor = 207;

    // custom blending source factors

    //ZeroFactor: 200;
    //OneFactor: 201;
    //SrcAlphaFactor: 204;
    //OneMinusSrcAlphaFactor: 205;
    //DstAlphaFactor: 206;
    //OneMinusDstAlphaFactor: 207;
    export var DstColorFactor = 208;
    export var OneMinusDstColorFactor = 209;
    export var SrcAlphaSaturateFactor = 210;

    // depth modes

    export var NeverDepth = 0;
    export var AlwaysDepth = 1;
    export var LessDepth = 2;
    export var LessEqualDepth = 3;
    export var EqualDepth = 4;
    export var GreaterEqualDepth = 5;
    export var GreaterDepth = 6;
    export var NotEqualDepth = 7;


    // TEXTURE CONSTANTS

    export var MultiplyOperation = 0;
    export var MixOperation = 1;
    export var AddOperation = 2;

    // Tone Mapping modes 
    export var NoToneMapping = 0; // do not do any tone mapping, not even exposure (required for special purpose passes.)
    export var LinearToneMapping = 1; // only apply exposure.
    export var ReinhardToneMapping = 2;
    export var Uncharted2ToneMapping = 3; // John Hable
    export var CineonToneMapping = 4; // optimized filmic operator by Jim Hejl and Richard Burgess-Dawson

    export enum ToneMappingModes
    {
        NoToneMapping = 0,
        LinearToneMapping = 1,
        ReinhardToneMapping = 2,
        Uncharted2ToneMapping = 3,
        CineonToneMapping = 4
    }

    // Mapping modes

    export var UVMapping = 300; 
    export var CubeReflectionMapping = 301;
    export var CubeRefractionMapping = 302;

    export var EquirectangularReflectionMapping = 303;
    export var EquirectangularRefractionMapping = 304;

    export var SphericalReflectionMapping = 305;
    export var CubeUVReflectionMapping = 306;
    export var CubeUVRefractionMapping = 307;

    // Wrapping modes 
    export var RepeatWrapping = 1000;
    export var ClampToEdgeWrapping = 1001;
    export var MirroredRepeatWrapping = 1002;

    // Filters

    export var NearestFilter = 1003;
    export var NearestMipMapNearestFilter = 1004;
    export var NearestMipMapLinearFilter = 1005;
    export var LinearFilter = 1006;
    export var LinearMipMapNearestFilter = 1007;
    export var LinearMipMapLinearFilter = 1008;

    // Data types

    export var UnsignedByteType = 1009;
    export var ByteType = 1010;
    export var ShortType = 1011;
    export var UnsignedShortType = 1012;
    export var IntType = 1013;
    export var UnsignedIntType = 1014;
    export var FloatType = 1015;
    export var HalfFloatType = 1025;

    // Pixel types

    //UnsignedByteType: 1009;
    export var UnsignedShort4444Type = 1016;
    export var UnsignedShort5551Type = 1017;
    export var UnsignedShort565Type = 1018;

    // Pixel formats 
    export var AlphaFormat = 1019;
    export var RGBFormat = 1020;
    export var RGBAFormat = 1021;
    export var LuminanceFormat = 1022;
    export var LuminanceAlphaFormat = 1023;

    // THREE.RGBEFormat handled as THREE.RGBAFormat in shaders
    export var RGBEFormat = RGBAFormat; //1024;
    export var DepthFormat = 1026;

    // DDS / ST3C Compressed texture formats

    export var RGB_S3TC_DXT1_Format = 2001;
    export var RGBA_S3TC_DXT1_Format = 2002;
    export var RGBA_S3TC_DXT3_Format = 2003;
    export var RGBA_S3TC_DXT5_Format = 2004;

    // PVRTC compressed texture formats

    export var RGB_PVRTC_4BPPV1_Format = 2100;
    export var RGB_PVRTC_2BPPV1_Format = 2101;
    export var RGBA_PVRTC_4BPPV1_Format = 2102;
    export var RGBA_PVRTC_2BPPV1_Format = 2103;

    // ETC compressed texture formats

    export var RGB_ETC1_Format = 2151;

    // Loop styles for AnimationAction

    export var LoopOnce = 2200;
    export var LoopRepeat = 2201;
    export var LoopPingPong = 2202;

    // Interpolation

    export var InterpolateDiscrete = 2300;
    export var InterpolateLinear = 2301;
    export var InterpolateSmooth = 2302;

    // Interpolant ending modes

    export var ZeroCurvatureEnding = 2400;
    export var ZeroSlopeEnding = 2401;
    export var WrapAroundEnding = 2402;

    // Triangle Draw modes

    export var TrianglesDrawMode = 0;
    export var TriangleStripDrawMode = 1;
    export var TriangleFanDrawMode = 2;

    // Texture Encodings

    export var LinearEncoding = 3000; // No encoding at all.
    export var sRGBEncoding = 3001;
    export var GammaEncoding = 3007; // uses GAMMA_FACTOR, for backwards compatibility with WebGLRenderer.gammaInput/gammaOutput

    // The following Texture Encodings are for RGB-only (no alpha) HDR light emission sources.
    // These encodings should not specified as output encodings except in rare situations.
    export var RGBEEncoding = 3002; // AKA Radiance.
    export var LogLuvEncoding = 3003;
    export var RGBM7Encoding = 3004;
    export var RGBM16Encoding = 3005;
    export var RGBDEncoding = 3006; // MaxRange is 256.

    // Depth packing strategies

    export var BasicDepthPacking = 3200; // for writing to float textures for high precision or for visualizing results in RGB buffers
    export var RGBADepthPacking = 3201 // for packing into RGBA buffers.
}
 

