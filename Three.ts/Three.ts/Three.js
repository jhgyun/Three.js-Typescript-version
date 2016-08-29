if (typeof define === 'function' && define.amd) {
    define('three', THREE);
}
else if ('undefined' !== typeof exports && 'undefined' !== typeof module) {
    module.exports = THREE;
}
if (Number.EPSILON === undefined) {
    Number.EPSILON = Math.pow(2, -52);
}
if (Math.sign === undefined) {
    Math.sign = function (x) {
        return (x < 0) ? -1 : (x > 0) ? 1 : +x;
    };
}
if (Function.prototype.name === undefined) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function () {
            return this.toString().match(/^\s*function\s*(\S*)\s*\(/)[1];
        }
    });
}
if (Object.assign === undefined) {
    (function () {
        Object.assign = function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}
var THREE;
(function (THREE) {
    THREE.REVISION = '79';
    THREE.MOUSE = { LEFT: 0, MIDDLE: 1, RIGHT: 2 };
    THREE.CullFaceNone = 0;
    THREE.CullFaceBack = 1;
    THREE.CullFaceFront = 2;
    THREE.CullFaceFrontBack = 3;
    THREE.FrontFaceDirectionCW = 0;
    THREE.FrontFaceDirectionCCW = 1;
    THREE.BasicShadowMap = 0;
    THREE.PCFShadowMap = 1;
    THREE.PCFSoftShadowMap = 2;
    THREE.FrontSide = 0;
    THREE.BackSide = 1;
    THREE.DoubleSide = 2;
    THREE.FlatShading = 1;
    THREE.SmoothShading = 2;
    THREE.NoColors = 0;
    THREE.FaceColors = 1;
    THREE.VertexColors = 2;
    THREE.NoBlending = 0;
    THREE.NormalBlending = 1;
    THREE.AdditiveBlending = 2;
    THREE.SubtractiveBlending = 3;
    THREE.MultiplyBlending = 4;
    THREE.CustomBlending = 5;
    THREE.AddEquation = 100;
    THREE.SubtractEquation = 101;
    THREE.ReverseSubtractEquation = 102;
    THREE.MinEquation = 103;
    THREE.MaxEquation = 104;
    THREE.ZeroFactor = 200;
    THREE.OneFactor = 201;
    THREE.SrcColorFactor = 202;
    THREE.OneMinusSrcColorFactor = 203;
    THREE.SrcAlphaFactor = 204;
    THREE.OneMinusSrcAlphaFactor = 205;
    THREE.DstAlphaFactor = 206;
    THREE.OneMinusDstAlphaFactor = 207;
    THREE.DstColorFactor = 208;
    THREE.OneMinusDstColorFactor = 209;
    THREE.SrcAlphaSaturateFactor = 210;
    THREE.NeverDepth = 0;
    THREE.AlwaysDepth = 1;
    THREE.LessDepth = 2;
    THREE.LessEqualDepth = 3;
    THREE.EqualDepth = 4;
    THREE.GreaterEqualDepth = 5;
    THREE.GreaterDepth = 6;
    THREE.NotEqualDepth = 7;
    THREE.MultiplyOperation = 0;
    THREE.MixOperation = 1;
    THREE.AddOperation = 2;
    THREE.NoToneMapping = 0;
    THREE.LinearToneMapping = 1;
    THREE.ReinhardToneMapping = 2;
    THREE.Uncharted2ToneMapping = 3;
    THREE.CineonToneMapping = 4;
    (function (ToneMappingModes) {
        ToneMappingModes[ToneMappingModes["NoToneMapping"] = 0] = "NoToneMapping";
        ToneMappingModes[ToneMappingModes["LinearToneMapping"] = 1] = "LinearToneMapping";
        ToneMappingModes[ToneMappingModes["ReinhardToneMapping"] = 2] = "ReinhardToneMapping";
        ToneMappingModes[ToneMappingModes["Uncharted2ToneMapping"] = 3] = "Uncharted2ToneMapping";
        ToneMappingModes[ToneMappingModes["CineonToneMapping"] = 4] = "CineonToneMapping";
    })(THREE.ToneMappingModes || (THREE.ToneMappingModes = {}));
    var ToneMappingModes = THREE.ToneMappingModes;
    THREE.UVMapping = 300;
    THREE.CubeReflectionMapping = 301;
    THREE.CubeRefractionMapping = 302;
    THREE.EquirectangularReflectionMapping = 303;
    THREE.EquirectangularRefractionMapping = 304;
    THREE.SphericalReflectionMapping = 305;
    THREE.CubeUVReflectionMapping = 306;
    THREE.CubeUVRefractionMapping = 307;
    THREE.RepeatWrapping = 1000;
    THREE.ClampToEdgeWrapping = 1001;
    THREE.MirroredRepeatWrapping = 1002;
    THREE.NearestFilter = 1003;
    THREE.NearestMipMapNearestFilter = 1004;
    THREE.NearestMipMapLinearFilter = 1005;
    THREE.LinearFilter = 1006;
    THREE.LinearMipMapNearestFilter = 1007;
    THREE.LinearMipMapLinearFilter = 1008;
    THREE.UnsignedByteType = 1009;
    THREE.ByteType = 1010;
    THREE.ShortType = 1011;
    THREE.UnsignedShortType = 1012;
    THREE.IntType = 1013;
    THREE.UnsignedIntType = 1014;
    THREE.FloatType = 1015;
    THREE.HalfFloatType = 1025;
    THREE.UnsignedShort4444Type = 1016;
    THREE.UnsignedShort5551Type = 1017;
    THREE.UnsignedShort565Type = 1018;
    THREE.AlphaFormat = 1019;
    THREE.RGBFormat = 1020;
    THREE.RGBAFormat = 1021;
    THREE.LuminanceFormat = 1022;
    THREE.LuminanceAlphaFormat = 1023;
    THREE.RGBEFormat = THREE.RGBAFormat;
    THREE.DepthFormat = 1026;
    THREE.RGB_S3TC_DXT1_Format = 2001;
    THREE.RGBA_S3TC_DXT1_Format = 2002;
    THREE.RGBA_S3TC_DXT3_Format = 2003;
    THREE.RGBA_S3TC_DXT5_Format = 2004;
    THREE.RGB_PVRTC_4BPPV1_Format = 2100;
    THREE.RGB_PVRTC_2BPPV1_Format = 2101;
    THREE.RGBA_PVRTC_4BPPV1_Format = 2102;
    THREE.RGBA_PVRTC_2BPPV1_Format = 2103;
    THREE.RGB_ETC1_Format = 2151;
    THREE.LoopOnce = 2200;
    THREE.LoopRepeat = 2201;
    THREE.LoopPingPong = 2202;
    THREE.InterpolateDiscrete = 2300;
    THREE.InterpolateLinear = 2301;
    THREE.InterpolateSmooth = 2302;
    THREE.ZeroCurvatureEnding = 2400;
    THREE.ZeroSlopeEnding = 2401;
    THREE.WrapAroundEnding = 2402;
    THREE.TrianglesDrawMode = 0;
    THREE.TriangleStripDrawMode = 1;
    THREE.TriangleFanDrawMode = 2;
    THREE.LinearEncoding = 3000;
    THREE.sRGBEncoding = 3001;
    THREE.GammaEncoding = 3007;
    THREE.RGBEEncoding = 3002;
    THREE.LogLuvEncoding = 3003;
    THREE.RGBM7Encoding = 3004;
    THREE.RGBM16Encoding = 3005;
    THREE.RGBDEncoding = 3006;
    THREE.BasicDepthPacking = 3200;
    THREE.RGBADepthPacking = 3201;
})(THREE || (THREE = {}));
