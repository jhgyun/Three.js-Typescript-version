declare namespace THREE {
    namespace AnimationAction {
        class _new {
            _mixer: any;
            _clip: any;
            _localRoot: any;
            _interpolantSettings: any;
            _interpolants: any;
            _propertyBindings: any;
            _cacheIndex: any;
            _byClipCacheIndex: any;
            _timeScaleInterpolant: any;
            _weightInterpolant: any;
            loop: any;
            _loopCount: any;
            _startTime: any;
            time: any;
            timeScale: any;
            _effectiveTimeScale: any;
            weight: any;
            _effectiveWeight: any;
            repetitions: number;
            paused: boolean;
            enabled: boolean;
            clampWhenFinished: boolean;
            zeroSlopeAtStart: boolean;
            zeroSlopeAtEnd: any;
            loopCount: any;
            constructor(mixer: any, clip: any, localRoot: any);
            play(): this;
            stop(): this;
            reset(): this;
            isRunning(): any;
            isScheduled(): any;
            startAt(time: any): this;
            setLoop(mode: any, repetitions: any): this;
            setEffectiveWeight(weight: any): this;
            getEffectiveWeight(): any;
            fadeIn(duration: any): this;
            fadeOut(duration: any): this;
            crossFadeFrom(fadeOutAction: any, duration: any, warp: any): this;
            crossFadeTo(fadeInAction: any, duration: any, warp: any): any;
            stopFading(): this;
            setEffectiveTimeScale(timeScale: any): this;
            getEffectiveTimeScale(): any;
            setDuration(duration: any): this;
            syncWith(action: any): this;
            halt(duration: any): this;
            warp(startTimeScale: any, endTimeScale: any, duration: any): this;
            stopWarping(): this;
            getMixer(): any;
            getClip(): any;
            getRoot(): any;
            _update(time: any, deltaTime: any, timeDirection: any, accuIndex: any): void;
            _updateWeight(time: any): number;
            _updateTimeScale(time: any): number;
            _updateTime(deltaTime: any): any;
            _setEndings(atStart: any, atEnd: any, pingPong: any): void;
            _scheduleFading(duration: any, weightNow: any, weightThen: any): this;
        }
    }
}
declare namespace THREE {
    class AnimationClip {
        name: string;
        duration: number;
        uuid: string;
        tracks: any[];
        constructor(name: any, duration: any, tracks: any);
        resetDuration(): void;
        trim(): this;
        optimize(): this;
        static parse(json: any): AnimationClip;
        static toJSON(clip: AnimationClip): {
            'name': string;
            'duration': number;
            'tracks': any[];
        };
        static CreateFromMorphTargetSequence(name: any, morphTargetSequence: any, fps: any, noLoop: any): AnimationClip;
        static findByName(objectOrClipArray: any, name: string): any;
        static CreateClipsFromMorphTargetSequences(morphTargets: any, fps?: any, noLoop?: any): any[];
        static parseAnimation(animation: any, bones?: any, nodeName?: any): AnimationClip;
    }
}
declare namespace THREE {
    type EventListener = (event: any) => void;
    class EventDispatcher {
        _listeners: {
            [index: string]: EventListener[];
        };
        _thises: {
            [index: string]: any[];
        };
        addEventListener(type: string, listener: EventListener, _this?: any): void;
        hasEventListener(type: string, listener: EventListener, _this?: any): boolean;
        removeEventListener(type: string, listener: EventListener, _this?: any): void;
        dispatchEvent(event: any): void;
    }
}
declare namespace THREE {
    class AnimationMixer extends EventDispatcher {
        _root: any;
        _accuIndex: number;
        time: number;
        timeScale: number;
        _actions: any;
        _actionsByClip: any;
        _controlInterpolants: any;
        _nActiveControlInterpolants: number;
        _nActiveBindings: number;
        _bindings: any;
        _bindingsByRootAndName: any;
        _nActiveActions: number;
        stats: any;
        constructor(root: any);
        clipAction(clip: any, optionalRoot: any): any;
        existingAction(clip: any, optionalRoot: any): any;
        stopAllAction(): this;
        update(deltaTime: any): this;
        getRoot(): any;
        uncacheClip(clip: any): void;
        uncacheRoot(root: any): void;
        uncacheAction(clip: any, optionalRoot: any): void;
        static _Action: typeof AnimationAction._new;
        private _bindAction(action, prototypeAction);
        private _activateAction(action);
        private _deactivateAction(action);
        private _initMemoryManager();
        private _isActiveAction(action);
        private _addInactiveAction(action, clipUuid, rootUuid);
        private _removeInactiveAction(action);
        private _removeInactiveBindingsForAction(action);
        private _lendAction(action);
        private _takeBackAction(action);
        private _addInactiveBinding(binding, rootUuid, trackName);
        private _removeInactiveBinding(binding);
        private _lendBinding(binding);
        private _takeBackBinding(binding);
        private _lendControlInterpolant();
        private _takeBackControlInterpolant(interpolant);
        private _controlInterpolantsResultBuffer;
    }
}
declare namespace THREE {
    class AnimationObjectGroup {
        uuid: string;
        _objects: any[];
        nCachedObjects_: number;
        _indicesByUUID: any;
        _paths: string[];
        _parsedPaths: any[];
        _bindings: any[];
        _bindingsIndicesByPath: any;
        stats: any;
        constructor(var_args: any);
        add(var_args: any): void;
        remove(var_args: any): void;
        uncache(var_args: any): void;
        subscribe_(path: any, parsedPath: any): any;
        unsubscribe_(path: any): void;
    }
}
declare namespace THREE {
    class AnimationUtils {
        static arraySlice(array: any, from: any, to: any): any;
        static convertArray(array: any, type: any, forceClone?: any): any;
        static isTypedArray(object: any): boolean;
        static getKeyframeOrder(times: any): any[];
        static sortedArray(values: any, stride: any, order: any): any;
        static flattenJSON(jsonKeys: any, times: any, values: any, valuePropertyName: any): void;
    }
}
declare namespace THREE {
    class KeyframeTrack {
        name: any;
        times: any;
        values: any;
        TimeBufferType: any;
        ValueBufferType: any;
        ValueTypeName: any;
        createInterpolant: any;
        constructor(name: any, times?: any, values?: any, interpolation?: any);
        DefaultInterpolation: number;
        InterpolantFactoryMethodDiscrete(result: any): DiscreteInterpolant;
        InterpolantFactoryMethodLinear(result: any): LinearInterpolant;
        InterpolantFactoryMethodSmooth(result: any): CubicInterpolant;
        setInterpolation(interpolation: any): void;
        getInterpolation(): number;
        getValueSize(): number;
        shift(timeOffset: any): this;
        scale(timeScale: any): this;
        trim(startTime: any, endTime: any): this;
        validate(): boolean;
        optimize(): this;
        static parse(json: any): any;
        static toJSON(track: any): any;
        static _getTrackTypeForValueTypeName(typeName: any): typeof NumberKeyframeTrack;
    }
}
declare namespace THREE {
    class PropertyBinding {
        path: any;
        parsedPath: any;
        node: any;
        rootNode: any;
        propertyName: any;
        targetObject: any;
        resolvedProperty: any;
        propertyIndex: any;
        constructor(rootNode: any, path: any, parsedPath: any);
        getValue(targetArray?: any, offset?: any): void;
        setValue(sourceArray?: any, offset?: any): void;
        bind(): void;
        unbind(): void;
        _getValue_unavailable(): void;
        _setValue_unavailable(): void;
        _getValue_unbound(): void;
        _setValue_unbound(): void;
        BindingType: {
            Direct: number;
            EntireArray: number;
            ArrayElement: number;
            HasFromToArray: number;
        };
        Versioning: {
            None: number;
            NeedsUpdate: number;
            MatrixWorldNeedsUpdate: number;
        };
        private getValue_direct(buffer, offset);
        private getValue_array(buffer, offset);
        private getValue_arrayElement(buffer, offset);
        private getValue_toArray(buffer, offset);
        GetterByBindingType: ((buffer: any, offset: any) => void)[];
        private setValue_direct(buffer, offset);
        private setValue_direct_setNeedsUpdate(buffer, offset);
        private setValue_direct_setMatrixWorldNeedsUpdate(buffer, offset);
        private setValue_array(buffer, offset);
        private setValue_array_setNeedsUpdate(buffer, offset);
        private setValue_array_setMatrixWorldNeedsUpdate(buffer, offset);
        private setValue_arrayElement(buffer, offset);
        private setValue_arrayElement_setNeedsUpdate(buffer, offset);
        private setValue_arrayElement_setMatrixWorldNeedsUpdate(buffer, offset);
        private setValue_fromArray(buffer, offset);
        private setValue_fromArray_setNeedsUpdate(buffer, offset);
        private setValue_fromArray_setMatrixWorldNeedsUpdate(buffer, offset);
        SetterByBindingTypeAndVersioning: ((buffer: any, offset: any) => void)[][];
        static create(root: any, path: any, parsedPath: any): PropertyBinding | PropertyBindingComposite;
        static parseTrackName(trackName: any): {
            nodeName: string;
            objectName: string;
            objectIndex: string;
            propertyName: string;
            propertyIndex: string;
        };
        static findNode(root: any, nodeName: any): any;
    }
    class PropertyBindingComposite {
        _targetGroup: any;
        _bindings: any;
        constructor(targetGroup: any, path: any, optionalParsedPath: any);
        getValue(array: any, offset: any): void;
        setValue(array: any, offset: any): void;
        bind(): void;
        unbind(): void;
    }
}
declare namespace THREE {
    class PropertyMixer {
        binding: any;
        valueSize: number;
        buffer: any[] | Float64Array;
        _mixBufferRegion: any;
        cumulativeWeight: number;
        useCount: number;
        referenceCount: number;
        constructor(binding: any, typeName: string, valueSize: any);
        accumulate(accuIndex: any, weight: any): void;
        apply(accuIndex: any): void;
        saveOriginalState(): void;
        restoreOriginalState(): void;
        _select(buffer: any, dstOffset: number, srcOffset: number, t: number, stride: number): void;
        _slerp(buffer: any, dstOffset: number, srcOffset: number, t: number, stride: number): void;
        _lerp(buffer: any, dstOffset: any, srcOffset: any, t: any, stride: any): void;
    }
}
declare namespace THREE {
    class BooleanKeyframeTrack extends KeyframeTrack {
        constructor(name: any, times?: any, values?: any);
    }
}
declare namespace THREE {
    class ColorKeyframeTrack extends KeyframeTrack {
        constructor(name: any, times?: any, values?: any, interpolation?: any);
    }
}
declare namespace THREE {
    class NumberKeyframeTrack extends KeyframeTrack {
        constructor(name: any, times?: any, values?: any, interpolation?: any);
    }
}
declare namespace THREE {
    class QuaternionKeyframeTrack extends KeyframeTrack {
        constructor(name?: any, times?: any, values?: any, interpolation?: any);
        InterpolantFactoryMethodLinear(result: any): QuaternionLinearInterpolant;
    }
}
declare namespace THREE {
    class StringKeyframeTrack extends KeyframeTrack {
        constructor(name: any, times?: any, values?: any, interpolation?: any);
    }
}
declare namespace THREE {
    class VectorKeyframeTrack extends KeyframeTrack {
        constructor(name: any, times?: any, values?: any, interpolation?: any);
    }
}
interface NumberConstructor {
    EPSILON?: number;
}
interface Math {
    sign: (n: number) => number;
}
interface Function {
    name: string;
}
interface Object {
    assign: (...arg: any[]) => any;
}
declare var define: any;
declare var exports: any;
declare var module: any;
declare namespace THREE {
    var REVISION: string;
    var MOUSE: {
        LEFT: number;
        MIDDLE: number;
        RIGHT: number;
    };
    var CullFaceNone: number;
    var CullFaceBack: number;
    var CullFaceFront: number;
    var CullFaceFrontBack: number;
    var FrontFaceDirectionCW: number;
    var FrontFaceDirectionCCW: number;
    var BasicShadowMap: number;
    var PCFShadowMap: number;
    var PCFSoftShadowMap: number;
    var FrontSide: number;
    var BackSide: number;
    var DoubleSide: number;
    var FlatShading: number;
    var SmoothShading: number;
    var NoColors: number;
    var FaceColors: number;
    var VertexColors: number;
    var NoBlending: number;
    var NormalBlending: number;
    var AdditiveBlending: number;
    var SubtractiveBlending: number;
    var MultiplyBlending: number;
    var CustomBlending: number;
    var AddEquation: number;
    var SubtractEquation: number;
    var ReverseSubtractEquation: number;
    var MinEquation: number;
    var MaxEquation: number;
    var ZeroFactor: number;
    var OneFactor: number;
    var SrcColorFactor: number;
    var OneMinusSrcColorFactor: number;
    var SrcAlphaFactor: number;
    var OneMinusSrcAlphaFactor: number;
    var DstAlphaFactor: number;
    var OneMinusDstAlphaFactor: number;
    var DstColorFactor: number;
    var OneMinusDstColorFactor: number;
    var SrcAlphaSaturateFactor: number;
    var NeverDepth: number;
    var AlwaysDepth: number;
    var LessDepth: number;
    var LessEqualDepth: number;
    var EqualDepth: number;
    var GreaterEqualDepth: number;
    var GreaterDepth: number;
    var NotEqualDepth: number;
    var MultiplyOperation: number;
    var MixOperation: number;
    var AddOperation: number;
    var NoToneMapping: number;
    var LinearToneMapping: number;
    var ReinhardToneMapping: number;
    var Uncharted2ToneMapping: number;
    var CineonToneMapping: number;
    enum ToneMappingModes {
        NoToneMapping = 0,
        LinearToneMapping = 1,
        ReinhardToneMapping = 2,
        Uncharted2ToneMapping = 3,
        CineonToneMapping = 4,
    }
    var UVMapping: number;
    var CubeReflectionMapping: number;
    var CubeRefractionMapping: number;
    var EquirectangularReflectionMapping: number;
    var EquirectangularRefractionMapping: number;
    var SphericalReflectionMapping: number;
    var CubeUVReflectionMapping: number;
    var CubeUVRefractionMapping: number;
    var RepeatWrapping: number;
    var ClampToEdgeWrapping: number;
    var MirroredRepeatWrapping: number;
    var NearestFilter: number;
    var NearestMipMapNearestFilter: number;
    var NearestMipMapLinearFilter: number;
    var LinearFilter: number;
    var LinearMipMapNearestFilter: number;
    var LinearMipMapLinearFilter: number;
    var UnsignedByteType: number;
    var ByteType: number;
    var ShortType: number;
    var UnsignedShortType: number;
    var IntType: number;
    var UnsignedIntType: number;
    var FloatType: number;
    var HalfFloatType: number;
    var UnsignedShort4444Type: number;
    var UnsignedShort5551Type: number;
    var UnsignedShort565Type: number;
    var AlphaFormat: number;
    var RGBFormat: number;
    var RGBAFormat: number;
    var LuminanceFormat: number;
    var LuminanceAlphaFormat: number;
    var RGBEFormat: number;
    var DepthFormat: number;
    var RGB_S3TC_DXT1_Format: number;
    var RGBA_S3TC_DXT1_Format: number;
    var RGBA_S3TC_DXT3_Format: number;
    var RGBA_S3TC_DXT5_Format: number;
    var RGB_PVRTC_4BPPV1_Format: number;
    var RGB_PVRTC_2BPPV1_Format: number;
    var RGBA_PVRTC_4BPPV1_Format: number;
    var RGBA_PVRTC_2BPPV1_Format: number;
    var RGB_ETC1_Format: number;
    var LoopOnce: number;
    var LoopRepeat: number;
    var LoopPingPong: number;
    var InterpolateDiscrete: number;
    var InterpolateLinear: number;
    var InterpolateSmooth: number;
    var ZeroCurvatureEnding: number;
    var ZeroSlopeEnding: number;
    var WrapAroundEnding: number;
    var TrianglesDrawMode: number;
    var TriangleStripDrawMode: number;
    var TriangleFanDrawMode: number;
    var LinearEncoding: number;
    var sRGBEncoding: number;
    var GammaEncoding: number;
    var RGBEEncoding: number;
    var LogLuvEncoding: number;
    var RGBM7Encoding: number;
    var RGBM16Encoding: number;
    var RGBDEncoding: number;
    var BasicDepthPacking: number;
    var RGBADepthPacking: number;
}
declare namespace THREE {
    interface Buffer {
        getX(idx: number): number;
        getY(idx: number): number;
        getZ(idx: number): number;
        setXYZ(x: number, y: number, z: number): any;
        length: number;
        itemSize: number;
    }
    class Matrix3 {
        elements: Float32Array;
        set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): this;
        identity(): this;
        clone(): Matrix3;
        copy(m: Matrix3): this;
        setFromMatrix4(m: Matrix4): this;
        applyToVector3Array(array: ArrayLike<number>, offset?: number, length?: number): ArrayLike<number>;
        applyToBuffer(buffer: Buffer, offset?: number, length?: number): Buffer;
        multiplyScalar(s: number): this;
        determinant(): number;
        getInverse(matrix: Matrix3, throwOnDegenerate?: boolean): this;
        transpose(): this;
        getNormalMatrix(matrix4: Matrix4): this;
        transposeIntoArray(r: number[] | ArrayBuffer): this;
        fromArray(array: ArrayLike<number>): this;
        toArray(array?: ArrayLike<number>, offset?: number): ArrayLike<number>;
    }
}
declare namespace THREE {
    class Matrix4 {
        elements: Float32Array;
        set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): this;
        identity(): this;
        clone(): Matrix4;
        copy(m: Matrix4): this;
        copyPosition(m: Matrix4): this;
        extractBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): this;
        makeBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): this;
        extractRotation(m: Matrix4): this;
        makeRotationFromEuler(euler: Euler): this;
        makeRotationFromQuaternion(q: Quaternion): this;
        lookAt(eye: Vector3, target: Vector3, up: Vector3): this;
        multiply(m: Matrix4): this;
        premultiply(m: Matrix4): this;
        multiplyMatrices(a: Matrix4, b: Matrix4): this;
        multiplyToArray(a: Matrix4, b: Matrix4, r: ArrayLike<number>): this;
        multiplyScalar(s: number): this;
        applyToVector3Array(array: ArrayLike<number>, offset?: number, length?: number): ArrayLike<number>;
        applyToBuffer(buffer: Buffer, offset?: number, length?: number): Buffer;
        determinant(): number;
        transpose(): this;
        setPosition(v: any): this;
        getInverse(m: Matrix4, throwOnDegenerate?: boolean): this;
        scale(v: Vector3): this;
        getMaxScaleOnAxis(): number;
        makeTranslation(x: number, y: number, z: number): this;
        makeRotationX(theta: number): this;
        makeRotationY(theta: number): this;
        makeRotationZ(theta: number): this;
        makeRotationAxis(axis: Vector3, angle: number): this;
        makeScale(x: number, y: number, z: number): this;
        compose(position: Vector3, quaternion: Quaternion, scale: Vector3): this;
        decompose(position: Vector3, quaternion: Quaternion, scale: Vector3): this;
        makeFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
        makePerspective(fov: number, aspect: number, near: number, far: number): this;
        makeOrthographic(left: number, right: number, top: number, bottom: number, near: number, far: number): this;
        equals(matrix: any): boolean;
        fromArray(array: ArrayLike<number>): this;
        toArray(array?: ArrayLike<number>, offset?: number): ArrayLike<number>;
    }
}
declare namespace THREE {
    class Vector2 {
        x: number;
        y: number;
        constructor(x?: number, y?: number);
        width: number;
        height: number;
        set(x: number, y: number): this;
        setScalar(scalar: number): this;
        setX(x: number): this;
        setY(y: any): this;
        setComponent(index: number, value: number): void;
        getComponent(index: number): number;
        clone(): Vector2;
        copy(v: Vector2): this;
        add(v: Vector2): this;
        addScalar(s: number): this;
        addVectors(a: Vector2, b: Vector2): this;
        addScaledVector(v: Vector2, s: number): this;
        sub(v: Vector2): this;
        subScalar(s: number): this;
        subVectors(a: Vector2, b: Vector2): this;
        multiply(v: Vector2): this;
        multiplyScalar(scalar: number): this;
        divide(v: Vector2): this;
        divideScalar(scalar: number): this;
        min(v: Vector2): this;
        max(v: Vector2): this;
        clamp(min: Vector2, max: Vector2): this;
        clampLength(min: number, max: number): this;
        floor(): this;
        ceil(): this;
        round(): this;
        roundToZero(): this;
        negate(): this;
        dot(v: any): number;
        lengthSq(): number;
        length(): number;
        lengthManhattan(): number;
        normalize(): this;
        angle(): number;
        distanceTo(v: Vector2): number;
        distanceToSquared(v: Vector2): number;
        setLength(length: number): this;
        lerp(v: Vector2, alpha: number): this;
        lerpVectors(v1: Vector2, v2: Vector2, alpha: any): this;
        equals(v: Vector2): boolean;
        fromArray(array: ArrayLike<number>, offset?: number): this;
        toArray(array?: number[], offset?: number): number[];
        fromAttribute(attribute: {
            array: number[];
            itemSize: number;
        }, index: number, offset?: number): this;
        rotateAround(center: Vector2, angle: number): this;
        clampScalar(minVal: number, maxVal: number): this;
    }
}
declare namespace THREE {
    class Vector3 {
        x: number;
        y: number;
        z: number;
        constructor(x?: number, y?: number, z?: number);
        set(x: number, y: number, z: number): this;
        setScalar(scalar: number): this;
        setX(x: number): this;
        setY(y: number): this;
        setZ(z: number): this;
        setComponent(index: number, value: number): void;
        getComponent(index: number): number;
        clone(): Vector3;
        copy(v: Vector3): this;
        add(v: Vector3): this;
        addScalar(s: number): this;
        addVectors(a: Vector3, b: Vector3): this;
        addScaledVector(v: Vector3, s: number): this;
        sub(v: Vector3): this;
        subScalar(s: number): this;
        subVectors(a: Vector3, b: Vector3): this;
        multiply(v: Vector3): this;
        multiplyScalar(scalar: number): this;
        multiplyVectors(a: Vector3, b: Vector3): this;
        applyEuler(euler: Euler): this;
        applyAxisAngle(axis: Vector3, angle: number): this;
        applyMatrix3(m: Matrix3): this;
        applyMatrix4(m: Matrix4): this;
        applyProjection(m: Matrix4): this;
        applyQuaternion(q: any): this;
        project(camera: any): this;
        unproject(camera: any): this;
        transformDirection(m: Matrix4): this;
        divide(v: Vector3): this;
        divideScalar(scalar: number): this;
        min(v: Vector3): this;
        max(v: Vector3): this;
        clamp(min: Vector3, max: Vector3): this;
        clampScalar(minVal: number, maxVal: number): this;
        clampLength(min: number, max: number): this;
        floor(): this;
        ceil(): this;
        round(): this;
        roundToZero(): this;
        negate(): this;
        dot(v: any): number;
        lengthSq(): number;
        length(): number;
        lengthManhattan(): number;
        normalize(): this;
        setLength(length: number): this;
        lerp(v: Vector3, alpha: number): this;
        lerpVectors(v1: Vector3, v2: Vector3, alpha: number): this;
        cross(v: Vector3): this;
        crossVectors(a: Vector3, b: Vector3): this;
        projectOnVector(vector: Vector3): this;
        projectOnPlane(planeNormal: Vector3): this;
        reflect(normal: Vector3): this;
        angleTo(v: Vector3): number;
        distanceTo(v: Vector3): number;
        distanceToSquared(v: Vector3): number;
        setFromSpherical(s: {
            phi: number;
            radius: number;
            theta: number;
        }): this;
        setFromMatrixPosition(m: Matrix3 | Matrix4): this;
        setFromMatrixScale(m: Matrix3 | Matrix4): this;
        setFromMatrixColumn(m: Matrix3 | Matrix4, index: any): this;
        equals(v: any): boolean;
        fromArray(array: ArrayLike<number>, offset?: number): this;
        toArray(array?: ArrayLike<number>, offset?: number): ArrayLike<number>;
        fromAttribute(attribute: {
            itemSize: number;
            array: ArrayLike<number>;
        }, index: number, offset?: number): this;
    }
}
declare namespace THREE {
    class Vector4 {
        x: number;
        y: number;
        z: number;
        w: number;
        constructor(x?: number, y?: number, z?: number, w?: number);
        set(x: number, y: number, z: number, w: number): this;
        setScalar(scalar: number): this;
        setX(x: number): this;
        setY(y: number): this;
        setZ(z: number): this;
        setW(w: number): this;
        setComponent(index: number, value: number): void;
        getComponent(index: number): number;
        clone(): Vector4;
        copy(v: Vector4): this;
        add(v: Vector4): this;
        addScalar(s: number): this;
        addVectors(a: Vector4, b: Vector4): this;
        addScaledVector(v: Vector4, s: number): this;
        sub(v: Vector4): this;
        subScalar(s: number): this;
        subVectors(a: Vector4, b: Vector4): this;
        multiplyScalar(scalar: number): this;
        applyMatrix4(m: Matrix4): this;
        divideScalar(scalar: number): this;
        setAxisAngleFromQuaternion(q: Quaternion): this;
        setAxisAngleFromRotationMatrix(m: Matrix4): this;
        min(v: Vector4): this;
        max(v: Vector4): this;
        clamp(min: Vector4, max: Vector4): this;
        clampScalar(minVal: number, maxVal: number): this;
        floor(): this;
        ceil(): this;
        round(): this;
        roundToZero(): this;
        negate(): this;
        dot(v: any): number;
        lengthSq(): number;
        length(): number;
        lengthManhattan(): number;
        normalize(): this;
        setLength(length: any): this;
        lerp(v: Vector4, alpha: number): this;
        lerpVectors(v1: Vector4, v2: Vector4, alpha: number): this;
        equals(v: any): boolean;
        fromArray(array: ArrayLike<number>, offset?: number): this;
        toArray(array?: ArrayLike<number>, offset?: number): ArrayLike<number>;
        fromAttribute(attribute: {
            itemSize: number;
            array: ArrayLike<number>;
        }, index: number, offset?: number): this;
    }
}
declare namespace THREE {
    class Color {
        r: number;
        g: number;
        b: number;
        constructor(r?: Color | number | string, g?: number, b?: number);
        set(value: number | Color | string): this;
        setScalar(scalar: number): void;
        setHex(hex: number): this;
        setRGB(r: number, g: number, b: number): this;
        static hue2rgb(p: number, q: number, t: number): number;
        setHSL(h: number, s: number, l: number): this;
        setStyle(style: any): this;
        clone(): Color;
        copy(color: Color): this;
        copyGammaToLinear(color: Color, gammaFactor?: number): this;
        copyLinearToGamma(color: Color, gammaFactor?: number): this;
        convertGammaToLinear(): this;
        convertLinearToGamma(): this;
        getHex(): number;
        getHexString(): string;
        getHSL(optionalTarget?: {
            h: number;
            s: number;
            l: number;
        }): {
            h: number;
            s: number;
            l: number;
        };
        getStyle(): string;
        offsetHSL(h: number, s: number, l: number): this;
        add(color: Color): this;
        addColors(color1: Color, color2: Color): this;
        addScalar(s: number): this;
        multiply(color: Color): this;
        multiplyScalar(s: number): this;
        lerp(color: Color, alpha: number): this;
        equals(c: any): boolean;
        fromArray(array: ArrayLike<number>, offset?: number): this;
        toArray(array?: ArrayLike<number>, offset?: number): ArrayLike<number>;
    }
    var ColorKeywords: {
        'aliceblue': number;
        'antiquewhite': number;
        'aqua': number;
        'aquamarine': number;
        'azure': number;
        'beige': number;
        'bisque': number;
        'black': number;
        'blanchedalmond': number;
        'blue': number;
        'blueviolet': number;
        'brown': number;
        'burlywood': number;
        'cadetblue': number;
        'chartreuse': number;
        'chocolate': number;
        'coral': number;
        'cornflowerblue': number;
        'cornsilk': number;
        'crimson': number;
        'cyan': number;
        'darkblue': number;
        'darkcyan': number;
        'darkgoldenrod': number;
        'darkgray': number;
        'darkgreen': number;
        'darkgrey': number;
        'darkkhaki': number;
        'darkmagenta': number;
        'darkolivegreen': number;
        'darkorange': number;
        'darkorchid': number;
        'darkred': number;
        'darksalmon': number;
        'darkseagreen': number;
        'darkslateblue': number;
        'darkslategray': number;
        'darkslategrey': number;
        'darkturquoise': number;
        'darkviolet': number;
        'deeppink': number;
        'deepskyblue': number;
        'dimgray': number;
        'dimgrey': number;
        'dodgerblue': number;
        'firebrick': number;
        'floralwhite': number;
        'forestgreen': number;
        'fuchsia': number;
        'gainsboro': number;
        'ghostwhite': number;
        'gold': number;
        'goldenrod': number;
        'gray': number;
        'green': number;
        'greenyellow': number;
        'grey': number;
        'honeydew': number;
        'hotpink': number;
        'indianred': number;
        'indigo': number;
        'ivory': number;
        'khaki': number;
        'lavender': number;
        'lavenderblush': number;
        'lawngreen': number;
        'lemonchiffon': number;
        'lightblue': number;
        'lightcoral': number;
        'lightcyan': number;
        'lightgoldenrodyellow': number;
        'lightgray': number;
        'lightgreen': number;
        'lightgrey': number;
        'lightpink': number;
        'lightsalmon': number;
        'lightseagreen': number;
        'lightskyblue': number;
        'lightslategray': number;
        'lightslategrey': number;
        'lightsteelblue': number;
        'lightyellow': number;
        'lime': number;
        'limegreen': number;
        'linen': number;
        'magenta': number;
        'maroon': number;
        'mediumaquamarine': number;
        'mediumblue': number;
        'mediumorchid': number;
        'mediumpurple': number;
        'mediumseagreen': number;
        'mediumslateblue': number;
        'mediumspringgreen': number;
        'mediumturquoise': number;
        'mediumvioletred': number;
        'midnightblue': number;
        'mintcream': number;
        'mistyrose': number;
        'moccasin': number;
        'navajowhite': number;
        'navy': number;
        'oldlace': number;
        'olive': number;
        'olivedrab': number;
        'orange': number;
        'orangered': number;
        'orchid': number;
        'palegoldenrod': number;
        'palegreen': number;
        'paleturquoise': number;
        'palevioletred': number;
        'papayawhip': number;
        'peachpuff': number;
        'peru': number;
        'pink': number;
        'plum': number;
        'powderblue': number;
        'purple': number;
        'red': number;
        'rosybrown': number;
        'royalblue': number;
        'saddlebrown': number;
        'salmon': number;
        'sandybrown': number;
        'seagreen': number;
        'seashell': number;
        'sienna': number;
        'silver': number;
        'skyblue': number;
        'slateblue': number;
        'slategray': number;
        'slategrey': number;
        'snow': number;
        'springgreen': number;
        'steelblue': number;
        'tan': number;
        'teal': number;
        'thistle': number;
        'tomato': number;
        'turquoise': number;
        'violet': number;
        'wheat': number;
        'white': number;
        'whitesmoke': number;
        'yellow': number;
        'yellowgreen': number;
    };
}
declare namespace THREE {
    class Box2 {
        min: Vector2;
        max: Vector2;
        constructor(min?: Vector2, max?: Vector2);
        set(min: Vector2, max: Vector2): this;
        setFromPoints(points: ArrayLike<Vector2>): this;
        static setFromCenterAndSize_v1: Vector2;
        setFromCenterAndSize(center: Vector2, size: Vector2): this;
        clone(): Box2;
        copy(box: Box2): this;
        makeEmpty(): this;
        isEmpty(): boolean;
        center(optionalTarget?: Vector2): Vector2;
        size(optionalTarget?: Vector2): Vector2;
        expandByPoint(point: Vector2): this;
        expandByVector(vector: Vector2): this;
        expandByScalar(scalar: number): this;
        containsPoint(point: Vector2): boolean;
        containsBox(box: Box2): boolean;
        getParameter(point: Vector2, optionalTarget?: Vector2): Vector2;
        intersectsBox(box: Box2): boolean;
        clampPoint(point: Vector2, optionalTarget?: Vector2): Vector2;
        private static distanceToPoint_v1;
        distanceToPoint(point: Vector2): this;
        intersect(box: Box2): this;
        union(box: Box2): this;
        translate(offset: Vector2): this;
        equals(box: Box2): boolean;
    }
}
declare namespace THREE {
    class Box3 {
        min: Vector3;
        max: Vector3;
        constructor(min?: Vector3, max?: Vector3);
        set(min: Vector3, max: Vector3): this;
        setFromArray(array: ArrayLike<number>): void;
        setFromPoints(points: ArrayLike<Vector3>): this;
        setFromCenterAndSize(center: Vector3, size: Vector3): this;
        setFromObject(object: {
            updateMatrixWorld: (f) => void;
            traverse: (callback: (n) => void) => void;
        }): this;
        clone(): Box3;
        copy(box: Box3): this;
        makeEmpty(): this;
        isEmpty(): boolean;
        center(optionalTarget?: Vector3): Vector3;
        size(optionalTarget?: Vector3): Vector3;
        expandByPoint(point: Vector3): this;
        expandByVector(vector: Vector3): this;
        expandByScalar(scalar: number): this;
        containsPoint(point: Vector3): boolean;
        containsBox(box: Box3): boolean;
        getParameter(point: Vector3, optionalTarget?: Vector3): Vector3;
        intersectsBox(box: Box3): boolean;
        intersectsSphere(sphere: Sphere): boolean;
        intersectsPlane(plane: Plane): boolean;
        clampPoint(point: Vector3, optionalTarget?: Vector3): Vector3;
        private static distanceToPoint_v1;
        distanceToPoint(point: Vector3): number;
        private static getBoundingSphere_v1;
        getBoundingSphere(optionalTarget?: Sphere): Sphere;
        intersect(box: Box3): this;
        union(box: Box3): this;
        private static applyMatrix4_points;
        applyMatrix4(matrix: Matrix4): this;
        translate(offset: any): this;
        equals(box: Box3): boolean;
    }
}
declare namespace THREE {
    class Sphere {
        center: Vector3;
        radius: number;
        constructor(center?: Vector3, radius?: number);
        set(center: Vector3, radius: number): this;
        setFromPoints(points: ArrayLike<Vector3>, optionalCenter?: Vector3): this;
        clone(): Sphere;
        copy(sphere: Sphere): this;
        empty(): boolean;
        containsPoint(point: Vector3): boolean;
        distanceToPoint(point: Vector3): number;
        intersectsSphere(sphere: Sphere): boolean;
        intersectsBox(box: Box3): boolean;
        intersectsPlane(plane: Plane): boolean;
        clampPoint(point: Vector3, optionalTarget?: Vector3): Vector3;
        getBoundingBox(optionalTarget?: Box3): Box3;
        applyMatrix4(matrix: Matrix4): this;
        translate(offset: Vector3): this;
        equals(sphere: Sphere): boolean;
    }
}
declare namespace THREE {
    class Spherical {
        radius: number;
        phi: number;
        theta: number;
        constructor(radius?: number, phi?: number, theta?: number);
        set(radius: number, phi: number, theta: number): this;
        clone(): Spherical;
        copy(other: Spherical): this;
        makeSafe(): this;
        setFromVector3(vec3: Vector3): this;
    }
}
declare namespace THREE {
    class Triangle {
        a: Vector3;
        b: Vector3;
        c: Vector3;
        constructor(a?: Vector3, b?: Vector3, c?: Vector3);
        static normal(a: Vector3, b: Vector3, c: Vector3, optionalTarget?: Vector3): Vector3;
        static barycoordFromPoint(point: Vector3, a: Vector3, b: Vector3, c: Vector3, optionalTarget?: Vector3): Vector3;
        static containsPoint(point: Vector3, a: Vector3, b: Vector3, c: Vector3): boolean;
        set(a: Vector3, b: Vector3, c: Vector3): this;
        setFromPointsAndIndices(points: Vector3[], i0: number, i1: number, i2: number): this;
        clone(): Triangle;
        copy(triangle: Triangle): this;
        area(): number;
        midpoint(optionalTarget?: Vector3): Vector3;
        normal(optionalTarget?: Vector3): Vector3;
        plane(optionalTarget?: Plane): Plane;
        barycoordFromPoint(point: Vector3, optionalTarget?: Vector3): Vector3;
        containsPoint(point: Vector3): boolean;
        closestPointToPoint(point: Vector3, optionalTarget?: Vector3): Vector3;
        equals(triangle: Triangle): boolean;
    }
}
declare namespace THREE {
    class Object3D extends EventDispatcher {
        static DefaultUp: Vector3;
        static DefaultMatrixAutoUpdate: boolean;
        private _id;
        id: number;
        uuid: string;
        name: string;
        type: string;
        parent: any;
        children: any[];
        up: Vector3;
        private _position;
        private _rotation;
        private _quaternion;
        private _scale;
        private _modelViewMatrix;
        private _normalMatrix;
        geometry: IGeometry;
        material: IMaterial;
        matrix: Matrix4;
        matrixWorld: Matrix4;
        matrixAutoUpdate: boolean;
        matrixWorldNeedsUpdate: boolean;
        layers: Layers;
        visible: boolean;
        castShadow: boolean;
        receiveShadow: boolean;
        frustumCulled: boolean;
        renderOrder: number;
        userData: any;
        constructor();
        private onRotationChange();
        private onQuaternionChange();
        position: Vector3;
        rotation: Euler;
        quaternion: Quaternion;
        scale: Vector3;
        modelViewMatrix: Matrix4;
        normalMatrix: Matrix3;
        applyMatrix(matrix: Matrix4): void;
        setRotationFromAxisAngle(axis: Vector3, angle: number): void;
        setRotationFromEuler(euler: Euler): void;
        setRotationFromMatrix(m: Matrix4): void;
        setRotationFromQuaternion(q: Quaternion): void;
        rotateOnAxis(axis: Vector3, angle: number): this;
        rotateX(angle: number): this;
        rotateY(angle: number): this;
        rotateZ(angle: number): this;
        translateOnAxis(axis: Vector3, distance: number): this;
        translateX(distance: number): this;
        translateY(distance: number): this;
        translateZ(distance: number): this;
        localToWorld(vector: Vector3): Vector3;
        worldToLocal(vector: Vector3): Vector3;
        lookAt(vector: Vector3): void;
        add(object?: Object3D | any, ...args: any[]): this;
        remove(object: Object3D, ...args: Object3D[]): void;
        getObjectById(id: number): any;
        getObjectByName(name: string): any;
        getObjectByProperty(name: string, value: any): any;
        getWorldPosition(optionalTarget?: Vector3): Vector3;
        getWorldQuaternion(optionalTarget?: Quaternion): Quaternion;
        getWorldRotation(optionalTarget?: Euler): Euler;
        getWorldScale(optionalTarget?: Vector3): Vector3;
        getWorldDirection(optionalTarget?: Vector3): any;
        raycast(raycaster: Raycaster, intersects: any): void;
        traverse(callback: (obj: Object3D) => any): void;
        traverseVisible(callback: (obj: Object3D) => any): void;
        traverseAncestors(callback: (obj: Object3D) => any): void;
        updateMatrix(): void;
        updateMatrixWorld(force?: boolean): void;
        toJSON(meta: any): any;
        clone(recursive?: boolean): this;
        copy(source: Object3D, recursive?: boolean): this;
    }
    var Object3DIdCount: number;
}
declare namespace THREE {
    class Audio extends Object3D {
        context: any;
        source: any;
        gain: any;
        autoplay: boolean;
        startTime: number;
        playbackRate: number;
        isPlaying: boolean;
        hasPlaybackControl: boolean;
        sourceType: string;
        filters: any[];
        constructor(listener: any);
        getOutput(): any;
        setNodeSource(audioNode: any): this;
        setBuffer(audioBuffer: any): this;
        play(): this;
        pause(): this;
        stop(): this;
        connect(): this;
        disconnect(): this;
        getFilters(): any[];
        setFilters(value: any): this;
        getFilter(): any;
        setFilter(filter: any): this;
        setPlaybackRate(value: any): this;
        getPlaybackRate(): number;
        onEnded(): void;
        getLoop(): any;
        setLoop(value: any): void;
        getVolume(): any;
        setVolume(value: any): this;
    }
}
declare namespace THREE {
    class AudioAnalyser {
        analyser: any;
        data: Uint8Array;
        constructor(audio: Audio, fftSize?: number);
        getFrequencyData(): Uint8Array;
        getAverageFrequency(): number;
    }
}
declare namespace THREE {
    var AudioContext: any;
}
declare namespace THREE {
    class AudioListener extends Object3D {
        context: any;
        gain: any;
        filter: any;
        constructor();
        getInput(): any;
        removeFilter(): void;
        getFilter(): any;
        setFilter(value: any): void;
        getMasterVolume(): any;
        setMasterVolume(value: any): void;
        updateMatrixWorld(force: any): void;
    }
}
declare namespace THREE {
    class PositionalAudio extends Audio {
        panner: any;
        constructor(listener: any);
        getOutput(): any;
        getRefDistance(): any;
        setRefDistance(value: any): void;
        getRolloffFactor(): any;
        setRolloffFactor(value: any): void;
        getDistanceModel(): any;
        setDistanceModel(value: any): void;
        getMaxDistance(): any;
        setMaxDistance(value: any): void;
        updateMatrixWorld(force?: boolean): void;
    }
}
declare namespace THREE {
    class Camera extends Object3D {
        matrixWorldInverse: Matrix4;
        projectionMatrix: Matrix4;
        constructor();
        getWorldDirection(optionalTarget?: Vector3): Vector3;
        lookAt(vector: Vector3): void;
        clone(): this;
        copy(source: Camera): this;
        updateProjectionMatrix(): void;
    }
}
declare namespace THREE {
    class CubeCamera extends Object3D {
        renderTarget: WebGLRenderTargetCube;
        cameraPX: PerspectiveCamera;
        cameraNX: PerspectiveCamera;
        cameraPY: PerspectiveCamera;
        cameraNY: PerspectiveCamera;
        cameraPZ: PerspectiveCamera;
        cameraNZ: PerspectiveCamera;
        constructor(near: any, far: any, cubeResolution: any);
        updateCubeMap(renderer: any, scene: any): void;
    }
}
declare namespace THREE {
    class OrthographicCamera extends Camera {
        zoom: number;
        view: {
            fullWidth: number;
            fullHeight: number;
            offsetX: number;
            offsetY: number;
            width: number;
            height: number;
        };
        left: number;
        right: number;
        top: number;
        bottom: number;
        near: number;
        far: number;
        constructor(left: number, right: number, top: number, bottom: number, near?: number, far?: number);
        copy(source: OrthographicCamera): this;
        setViewOffset(fullWidth: any, fullHeight: any, x: any, y: any, width: any, height: any): void;
        clearViewOffset(): void;
        updateProjectionMatrix(): void;
        toJSON(meta: any): any;
    }
}
declare namespace THREE {
    class PerspectiveCamera extends Camera {
        fov: number;
        zoom: number;
        near: number;
        far: number;
        focus: number;
        aspect: number;
        view: {
            fullWidth: number;
            fullHeight: number;
            offsetX: number;
            offsetY: number;
            width: number;
            height: number;
        };
        filmGauge: number;
        filmOffset: number;
        constructor(fov?: number, aspect?: number, near?: number, far?: number);
        copy(source: PerspectiveCamera): this;
        setFocalLength(focalLength: number): void;
        getFocalLength(): number;
        getEffectiveFOV(): number;
        getFilmWidth(): number;
        getFilmHeight(): number;
        setViewOffset(fullWidth: number, fullHeight: number, x: number, y: number, width: number, height: number): void;
        clearViewOffset(): void;
        updateProjectionMatrix(): void;
        toJSON(meta: any): any;
    }
}
declare namespace THREE {
    class StereoCamera {
        type: string;
        aspect: number;
        cameraL: PerspectiveCamera;
        cameraR: PerspectiveCamera;
        constructor();
        private static __update_static;
        update(camera: PerspectiveCamera): void;
    }
}
declare namespace THREE {
    type BufferAttributeArray = Float64Array | Float32Array | Uint16Array | Uint32Array | Uint8Array | Int8Array | Int16Array | Int32Array | Uint8ClampedArray;
    class BufferAttribute {
        uuid: string;
        array: BufferAttributeArray;
        itemSize: number;
        dynamic: boolean;
        updateRange: {
            offset: number;
            count: number;
        };
        version: number;
        normalized: boolean;
        constructor(array: BufferAttributeArray, itemSize: number, normalized?: boolean);
        count: number;
        needsUpdate: boolean;
        setDynamic(value: boolean): this;
        copy(source: BufferAttribute): this;
        copyAt(index1: number, attribute: BufferAttribute, index2: number): this;
        copyArray(array: ArrayLike<number>): this;
        copyColorsArray(colors: ArrayLike<Color>): this;
        copyIndicesArray(indices: ArrayLike<{
            a: number;
            b: number;
            c: number;
        }>): this;
        copyVector2sArray(vectors: ArrayLike<Vector2>): this;
        copyVector3sArray(vectors: ArrayLike<Vector3>): this;
        copyVector4sArray(vectors: ArrayLike<Vector4>): this;
        set(value: number, offset: number): this;
        getX(index: number): number;
        setX(index: number, x: number): this;
        getY(index: number): number;
        setY(index: number, y: number): this;
        getZ(index: number): number;
        setZ(index: number, z: number): this;
        getW(index: number): number;
        setW(index: number, w: number): this;
        setXY(index: number, x: number, y: number): this;
        setXYZ(index: number, x: number, y: number, z: number): this;
        setXYZW(index: number, x: number, y: number, z: number, w: number): this;
        clone(): this;
    }
    class Int8Attribute extends BufferAttribute {
        constructor(array: ArrayLike<number>, itemSize: number);
    }
    class Uint8Attribut extends BufferAttribute {
        constructor(array: ArrayLike<number>, itemSize: number);
    }
    class Uint8ClampedAttribute extends BufferAttribute {
        constructor(array: ArrayLike<number>, itemSize: number);
    }
    class Int16Attribute extends BufferAttribute {
        constructor(array: ArrayLike<number>, itemSize: number);
    }
    class Uint16Attribute extends BufferAttribute {
        constructor(array: ArrayLike<number>, itemSize: number);
    }
    class Int32Attribute extends BufferAttribute {
        constructor(array: ArrayLike<number>, itemSize: number);
    }
    class Uint32Attribute extends BufferAttribute {
        constructor(array: ArrayLike<number>, itemSize: number);
    }
    class Float32Attribute extends BufferAttribute {
        constructor(array: ArrayLike<number> | number, itemSize: number);
    }
    class Float64Attribute extends BufferAttribute {
        constructor(array: ArrayLike<number>, itemSize: number);
    }
}
declare namespace THREE {
    class Geometry extends EventDispatcher implements IGeometry {
        private _id;
        uuid: string;
        name: string;
        type: string;
        vertices: Vector3[];
        colors: Color[];
        faces: Face3[];
        faceVertexUvs: Vector2[][][];
        morphTargets: any[];
        morphNormals: any[];
        skinWeights: Vector4[];
        skinIndices: any[];
        lineDistances: number[];
        boundingBox: Box3;
        boundingSphere: Sphere;
        verticesNeedUpdate: boolean;
        elementsNeedUpdate: boolean;
        uvsNeedUpdate: boolean;
        normalsNeedUpdate: boolean;
        colorsNeedUpdate: boolean;
        lineDistancesNeedUpdate: boolean;
        groupsNeedUpdate: boolean;
        dynamic: boolean;
        bones: Bone[];
        animations: any[];
        id: number;
        parameters: any;
        _bufferGeometry: BufferGeometry;
        applyMatrix(matrix: Matrix4): this;
        rotateX(angle: number): this;
        rotateY(angle: number): this;
        rotateZ(angle: number): this;
        translate(x: number, y: number, z: number): this;
        scale(x: number, y: number, z: number): this;
        lookAt(vector: Vector3): void;
        fromBufferGeometry(geometry: BufferGeometry): this;
        center(): Vector3;
        normalize(): this;
        computeFaceNormals(): void;
        computeVertexNormals(areaWeighted?: boolean): void;
        computeMorphNormals(): void;
        computeLineDistances(): void;
        computeBoundingBox(): void;
        computeBoundingSphere(): void;
        merge(geometry: Geometry, matrix?: Matrix4, materialIndexOffset?: number): void;
        mergeMesh(mesh: Mesh): void;
        mergeVertices(): number;
        sortFacesByMaterialIndex(): void;
        toJSON(...args: any[]): any;
        clone(): Geometry;
        copy(source: any): this;
        dispose(): void;
    }
    var GeometryIdCount: number;
}
declare namespace THREE {
    type BufferAttributeType = BufferAttribute | InterleavedBufferAttribute;
    interface IGeometryGroup {
        start?: number;
        count?: number;
        materialIndex?: number;
        instances?: number;
    }
    interface IBufferGeometryAttributes {
        position?: BufferAttribute;
        normal?: BufferAttribute;
        color?: BufferAttribute;
        uv?: BufferAttribute;
        uv2?: BufferAttribute;
        lineDistance?: BufferAttribute;
        skinWeight?: BufferAttribute;
    }
    class BufferGeometry extends EventDispatcher implements IGeometry {
        uuid: string;
        name: string;
        type: string;
        index: BufferAttribute;
        attributes: IBufferGeometryAttributes;
        morphAttributes: IBufferGeometryAttributes;
        groups: IGeometryGroup[];
        boundingBox: Box3;
        boundingSphere: any;
        drawRange: {
            start: number;
            count: number;
        };
        maxInstancedCount: number;
        private _id;
        id: number;
        parameters: any;
        constructor();
        getIndex(): BufferAttribute;
        setIndex(index: any): void;
        addAttribute(name: string, attribute: BufferAttributeType): this;
        getAttribute(name: string): any;
        removeAttribute(name: string): this;
        addGroup(start: number, count: number, materialIndex?: number): void;
        clearGroups(): void;
        setDrawRange(start: number, count: number): void;
        applyMatrix(matrix: Matrix4): this;
        rotateX(angle: number): this;
        rotateY(angle: number): this;
        rotateZ(angle: number): this;
        translate(x: number, y: number, z: number): this;
        scale(x: number, y: number, z: number): this;
        lookAt(vector: Vector3): this;
        center(): Vector3;
        setFromObject(object: Object3D): this;
        updateFromObject(object: any): this;
        fromGeometry(geometry: any): this;
        fromDirectGeometry(geometry: DirectGeometry): this;
        computeBoundingBox(): void;
        computeBoundingSphere(): void;
        computeFaceNormals(): void;
        computeVertexNormals(): void;
        merge(geometry: BufferGeometry, offset?: number): this;
        normalizeNormals(): void;
        toNonIndexed(): BufferGeometry;
        toJSON(): any;
        clone(): BufferGeometry;
        copy(source: any): this;
        dispose(): void;
        static MaxIndex: number;
    }
}
declare namespace THREE {
    class Clock {
        autoStart: boolean;
        startTime: number;
        oldTime: number;
        elapsedTime: number;
        running: boolean;
        constructor(autoStart?: boolean);
        start(): void;
        stop(): void;
        getElapsedTime(): number;
        getDelta(): number;
    }
}
declare namespace THREE {
    class DirectGeometry extends EventDispatcher implements IGeometry {
        private _id;
        id: number;
        uuid: string;
        name: string;
        type: string;
        indices: any[];
        vertices: Vector3[];
        normals: Vector3[];
        colors: Color[];
        uvs: Vector2[];
        uvs2: any[];
        groups: any[];
        morphTargets: any;
        skinWeights: any[];
        skinIndices: any[];
        boundingBox: Box3;
        boundingSphere: Sphere;
        verticesNeedUpdate: boolean;
        normalsNeedUpdate: boolean;
        colorsNeedUpdate: boolean;
        uvsNeedUpdate: boolean;
        groupsNeedUpdate: boolean;
        constructor();
        computeBoundingBox(): void;
        computeBoundingSphere(): void;
        computeGroups(geometry: Geometry): void;
        fromGeometry(geometry: Geometry): this;
        dispose(): void;
    }
}
declare namespace THREE {
    class Face3 {
        a: number;
        b: number;
        c: number;
        materialIndex: number;
        normal: Vector3;
        vertexNormals: Vector3[];
        color: Color;
        vertexColors: Color[];
        constructor(a?: number, b?: number, c?: number, normal?: Vector3 | Vector3[], color?: Color | Color[], materialIndex?: number);
        clone(): Face3;
        copy(source: Face3): this;
        __originalFaceNormal: Vector3;
        __originalVertexNormals: Vector3[];
        _id: number;
    }
}
declare namespace THREE {
    interface IGeometry extends EventDispatcher {
        uuid?: string;
        name?: string;
        type?: string;
        vertices?: Vector3[];
        colors?: Color[];
        faces?: Face3[];
        faceVertexUvs?: Vector2[][][];
        morphTargets?: any;
        morphNormals?: any;
        skinWeights?: Vector4[];
        skinIndices?: any[];
        lineDistances?: number[];
        boundingBox?: Box3;
        boundingSphere?: Sphere;
        verticesNeedUpdate?: boolean;
        elementsNeedUpdate?: boolean;
        uvsNeedUpdate?: boolean;
        normalsNeedUpdate?: boolean;
        colorsNeedUpdate?: boolean;
        lineDistancesNeedUpdate?: boolean;
        groupsNeedUpdate?: boolean;
        dynamic?: boolean;
        bones?: Bone[];
        animations?: any[];
        id?: number;
        parameters?: any;
        index?: BufferAttribute;
        attributes?: IBufferGeometryAttributes;
        morphAttributes?: IBufferGeometryAttributes;
        groups?: IGeometryGroup[];
        indices?: any[];
        normals?: Vector3[];
        uvs?: Vector2[];
        uvs2?: any[];
        dispose?(): any;
        computeBoundingSphere?(): any;
    }
}
declare namespace THREE {
    class InstancedBufferAttribute extends BufferAttribute {
        meshPerAttribute: number;
        constructor(array: any, itemSize: any, meshPerAttribute?: number);
        copy(source: InstancedBufferAttribute): this;
    }
}
declare namespace THREE {
    class InstancedBufferGeometry extends BufferGeometry {
        type: string;
        constructor();
        addGroup(start: number, count: number, instances: number): void;
        copy(source: InstancedBufferGeometry): this;
    }
}
declare namespace THREE {
    class InterleavedBuffer {
        array: any;
        stride: number;
        uuid: string;
        dynamic: boolean;
        updateRange: {
            offset: number;
            count: number;
        };
        version: number;
        constructor(array?: any, stride?: number);
        length: any;
        count: number;
        needsUpdate: any;
        setDynamic(value: boolean): this;
        copy(source: InterleavedBuffer): this;
        copyAt(index1: number, attribute: {
            stride: number;
            array: ArrayLike<number>;
        }, index2: number): this;
        set(value: any, offset: any): this;
        clone(): InterleavedBuffer;
    }
}
declare namespace THREE {
    class InstancedInterleavedBuffer extends InterleavedBuffer {
        meshPerAttribute: number;
        constructor(array: any, stride: any, meshPerAttribute?: number);
        copy(source: InstancedInterleavedBuffer): this;
    }
}
declare namespace THREE {
    class InterleavedBufferAttribute extends BufferAttribute {
        data: InterleavedBuffer;
        offset: number;
        constructor(interleavedBuffer: InterleavedBuffer, itemSize: number, offset: number);
        count: number;
        setX(index: number, x: number): this;
        setY(index: number, y: number): this;
        setZ(index: number, z: number): this;
        setW(index: number, w: number): this;
        getX(index: number): any;
        getY(index: number): any;
        getZ(index: number): any;
        getW(index: number): any;
        setXY(index: number, x: number, y: number): this;
        setXYZ(index: number, x: number, y: number, z: number): this;
        setXYZW(index: number, x: number, y: number, z: number, w: number): this;
    }
}
declare namespace THREE {
    class Layers {
        mask: number;
        set(channel: number): void;
        enable(channel: number): void;
        toggle(channel: number): void;
        disable(channel: number): void;
        test(layers: Layers): boolean;
    }
}
declare namespace THREE {
    class Raycaster {
        ray: Ray;
        near: number;
        far: number;
        params: {
            Mesh: {};
            Line: {};
            LOD: {};
            Points: {
                threshold: number;
            };
            Sprite: {};
        };
        linePrecision: number;
        constructor(origin: Vector3, direction: Vector3, near?: number, far?: number);
        static ascSort(a: any, b: any): number;
        static intersectObject(object: Object3D, raycaster: Raycaster, intersects: any, recursive: any): void;
        set(origin: Vector3, direction: Vector3): void;
        setFromCamera(coords: any, camera: any): void;
        intersectObject(object: Object3D, recursive?: boolean): any[];
        intersectObjects(objects: Object3D[], recursive?: boolean): any[];
    }
}
declare namespace THREE {
    class Uniform {
        value: any;
        dynamic: boolean;
        onUpdateCallback: any;
        constructor(value: any);
        onUpdate(callback: any): this;
    }
}
declare namespace THREE {
    interface ICurvePoint {
        x?: number;
        y?: number;
        z?: number;
        clone(): ICurvePoint;
        sub(other: ICurvePoint): ICurvePoint;
        normalize(): any;
    }
    class Curve<T extends ICurvePoint> {
        private __arcLengthDivisions;
        private cacheArcLengths;
        protected needsUpdate: boolean;
        constructor();
        getPoint(t?: number): T;
        getPointAt(u?: number): T;
        getPoints(divisions?: number): T[];
        getSpacedPoints(divisions?: number): any[];
        getLength(): any;
        getLengths(divisions?: number): any;
        updateArcLengths(): void;
        getUtoTmapping(u: any, distance?: number): number;
        getTangent(t: number): T;
        getTangentAt(u: number): T;
        static create: (constructor: any, getPointFunc: any) => any;
    }
}
declare namespace THREE {
    class CurvePath extends Curve<Vector2> {
        curves: Curve<Vector2>[];
        autoClose: boolean;
        private cacheLengths;
        constructor();
        add(curve: any): void;
        closePath(): void;
        getPoint(t: number): Vector2;
        getLength(): any;
        updateArcLengths(): void;
        getCurveLengths(): any;
        createPointsGeometry(divisions: any): Geometry;
        createSpacedPointsGeometry(divisions: any): Geometry;
        createGeometry(points: any): Geometry;
    }
}
declare namespace THREE {
    class Font {
        data: any;
        constructor(data: any);
        generateShapes(text: any, size: any, divisions: any): any[];
    }
}
declare namespace THREE {
    class Path extends CurvePath {
        actions: {
            action: string;
            args: number[];
        }[];
        constructor(points?: Vector2[]);
        fromPoints(vectors: Vector2[]): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        quadraticCurveTo(aCPx: any, aCPy: any, aX: any, aY: any): void;
        bezierCurveTo(aCP1x: any, aCP1y: any, aCP2x: any, aCP2y: any, aX: any, aY: any): void;
        splineThru(pts: Vector2[]): void;
        arc(aX: any, aY: any, aRadius: any, aStartAngle: any, aEndAngle: any, aClockwise: any): void;
        absarc(aX: any, aY: any, aRadius: any, aStartAngle: any, aEndAngle: any, aClockwise: any): void;
        ellipse(aX: any, aY: any, xRadius: any, yRadius: any, aStartAngle: any, aEndAngle: any, aClockwise: any, aRotation?: number): void;
        absellipse(aX: any, aY: any, xRadius: any, yRadius: any, aStartAngle: any, aEndAngle: any, aClockwise: any, aRotation?: number): void;
        getSpacedPoints(divisions: any): any[];
        getPoints(divisions: any): any[];
        toShapes(isCCW: any, noHoles: any): any[];
    }
}
declare namespace THREE {
    class Shape extends Path {
        holes: any;
        constructor(points?: Vector2[]);
        extrude(options?: ExtrudeGeometryOptions): ExtrudeGeometry;
        makeGeometry(options?: ShapeGeometryOptions): ShapeGeometry;
        getPointsHoles(divisions: any): any[];
        extractAllPoints(divisions: any): {
            shape: any[];
            holes: any[];
        };
        extractPoints(divisions: any): {
            shape: any[];
            holes: any[];
        };
    }
}
declare namespace THREE {
    class EllipseCurve extends Curve<Vector2> {
        aX: number;
        aY: number;
        xRadius: number;
        yRadius: number;
        aStartAngle: number;
        aEndAngle: number;
        aClockwise: boolean;
        aRotation: number;
        constructor(aX: number, aY: number, xRadius: number, yRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean, aRotation?: number);
        getPoint(t: number): Vector2;
    }
}
declare namespace THREE {
    class ArcCurve extends EllipseCurve {
        constructor(aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise?: boolean);
    }
}
declare namespace THREE {
    class CatmullRomCurve3 extends Curve<Vector3> {
        points: Vector3[];
        closed: boolean;
        type: string;
        tension: number;
        constructor(p?: Vector3[]);
        private static tmp;
        private static px;
        private static py;
        private static pz;
        getPoint(t?: number): Vector3;
    }
}
declare namespace THREE {
    class CubicBezierCurve extends Curve<Vector2> {
        v0: Vector2;
        v1: Vector2;
        v2: Vector2;
        v3: Vector2;
        constructor(v0: Vector2, v1: Vector2, v2: Vector2, v3: Vector2);
        getPoint(t: number): Vector2;
        getTangent(t: number): Vector2;
    }
}
declare namespace THREE {
    class CubicBezierCurve3 extends Curve<Vector3> {
        v0: Vector3;
        v1: Vector3;
        v2: Vector3;
        v3: Vector3;
        constructor(v0: Vector3, v1: Vector3, v2: Vector3, v3: Vector3);
        getPoint(t: number): Vector3;
    }
}
declare namespace THREE {
    class LineCurve extends Curve<Vector2> {
        v1: Vector2;
        v2: Vector2;
        constructor(v1: Vector2, v2: Vector2);
        getPoint(t: number): Vector2;
        getPointAt(u: number): Vector2;
        getTangent(t: number): Vector2;
    }
}
declare namespace THREE {
    class LineCurve3 extends Curve<Vector3> {
        v1: Vector3;
        v2: Vector3;
        constructor(v1: any, v2: any);
        getPoint(t?: number): Vector3;
    }
}
declare namespace THREE {
    class QuadraticBezierCurve extends Curve<Vector2> {
        v0: Vector2;
        v1: Vector2;
        v2: Vector2;
        constructor(v0: Vector2, v1: Vector2, v2: Vector2);
        getPoint(t: any): Vector2;
        getTangent(t: any): Vector2;
    }
}
declare namespace THREE {
    class QuadraticBezierCurve3 extends Curve<Vector3> {
        v0: Vector3;
        v1: Vector3;
        v2: Vector3;
        constructor(v0: Vector3, v1: Vector3, v2: Vector3);
        getPoint(t: number): Vector3;
    }
}
declare namespace THREE {
    class SplineCurve extends Curve<Vector2> {
        points: Vector2[];
        constructor(points?: Vector2[]);
        getPoint(t: number): Vector2;
    }
}
declare namespace THREE {
    var CurveUtils: {
        tangentQuadraticBezier: (t: number, p0: number, p1: number, p2: number) => number;
        tangentCubicBezier: (t: number, p0: number, p1: number, p2: number, p3: number) => number;
        tangentSpline: (t: number, p0: number, p1: number, p2: number, p3: number) => number;
        interpolate: (p0: number, p1: number, p2: number, p3: number, t: number) => number;
    };
}
declare namespace THREE {
    class BoxBufferGeometry extends BufferGeometry {
        constructor(width: number, height: number, depth: number, widthSegments?: number, heightSegments?: number, depthSegments?: number);
        private static calculateVertexCount(w, h, d);
        private static calculateIndexCount(w, h, d);
    }
}
declare namespace THREE {
    class BoxGeometry extends Geometry {
        constructor(width: number, height: number, depth: number, widthSegments?: number, heightSegments?: number, depthSegments?: number);
    }
    var CubeGeometry: typeof BoxGeometry;
}
declare namespace THREE {
    class CircleBufferGeometry extends BufferGeometry {
        constructor(radius?: number, segments?: number, thetaStart?: number, thetaLength?: number);
    }
}
declare namespace THREE {
    class CircleGeometry extends Geometry {
        constructor(radius?: number, segments?: number, thetaStart?: number, thetaLength?: number);
    }
}
declare namespace THREE {
    class CylinderBufferGeometry extends BufferGeometry {
        constructor(radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number);
    }
}
declare namespace THREE {
    class ConeBufferGeometry extends CylinderBufferGeometry {
        constructor(radius?: number, height?: number, radialSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number);
    }
}
declare namespace THREE {
    class CylinderGeometry extends Geometry {
        constructor(radiusTop?: number, radiusBottom?: number, height?: number, radialSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number);
    }
}
declare namespace THREE {
    class ConeGeometry extends CylinderGeometry {
        constructor(radius?: number, height?: number, radialSegments?: number, heightSegments?: number, openEnded?: boolean, thetaStart?: number, thetaLength?: number);
    }
}
declare namespace THREE {
    class PolyhedronGeometry extends Geometry {
        constructor(vertices: number[], indices: number[], radius?: number, detail?: number);
    }
}
declare namespace THREE {
    class DodecahedronGeometry extends PolyhedronGeometry {
        constructor(radius?: number, detail?: number);
    }
}
declare namespace THREE {
    class EdgesGeometry extends BufferGeometry {
        constructor(geometry?: Geometry | BufferGeometry, thresholdAngle?: number);
    }
}
declare namespace THREE {
    interface ExtrudeGeometryOptions {
        curveSegments?: number;
        steps?: number;
        amount?: number;
        bevelEnabled?: boolean;
        bevelThickness?: number;
        bevelSize?: number;
        bevelSegments?: number;
        extrudePath?: Curve<Vector3>;
        frames?: any;
        UVGenerator?: any;
    }
    class ExtrudeGeometry extends Geometry {
        constructor(ashapes: Shape | Shape[], options: ExtrudeGeometryOptions);
        addShapeList(shapes: Shape[], options: ExtrudeGeometryOptions): void;
        addShape(shape: any, options: ExtrudeGeometryOptions): void;
        static WorldUVGenerator: {
            generateTopUV: (geometry: any, indexA: any, indexB: any, indexC: any) => Vector2[];
            generateSideWallUV: (geometry: any, indexA: any, indexB: any, indexC: any, indexD: any) => Vector2[];
        };
    }
}
declare namespace THREE {
    class IcosahedronGeometry extends PolyhedronGeometry {
        constructor(radius?: number, detail?: number);
    }
}
declare namespace THREE {
    class LatheBufferGeometry extends BufferGeometry {
        constructor(points: Vector2[], segments?: number, phiStart?: number, phiLength?: number);
    }
}
declare namespace THREE {
    class LatheGeometry extends Geometry {
        constructor(points: Vector2[], segments?: number, phiStart?: number, phiLength?: number);
    }
}
declare namespace THREE {
    class OctahedronGeometry extends PolyhedronGeometry {
        constructor(radius?: number, detail?: number);
    }
}
declare namespace THREE {
    class ParametricGeometry extends Geometry {
        constructor(func: (u: number, v: number) => Vector3, slices: number, stacks: number);
    }
}
declare namespace THREE {
    class PlaneBufferGeometry extends BufferGeometry {
        constructor(width: number, height: number, widthSegments?: number, heightSegments?: number);
    }
}
declare namespace THREE {
    class PlaneGeometry extends Geometry {
        constructor(width: number, height: number, widthSegments: number, heightSegments: number);
    }
}
declare namespace THREE {
    class RingBufferGeometry extends BufferGeometry {
        constructor(innerRadius?: number, outerRadius?: number, thetaSegments?: number, phiSegments?: number, thetaStart?: number, thetaLength?: number);
    }
}
declare namespace THREE {
    class RingGeometry extends Geometry {
        constructor(innerRadius?: number, outerRadius?: number, thetaSegments?: number, phiSegments?: number, thetaStart?: number, thetaLength?: number);
    }
}
declare namespace THREE {
    interface ShapeGeometryOptions {
        curveSegments?: number;
        material?: number;
        UVGenerator?: any;
    }
    class ShapeGeometry extends Geometry {
        constructor(ashapes: Shape | Shape[], options?: ShapeGeometryOptions);
        addShapeList(shapes: Shape[], options?: ShapeGeometryOptions): this;
        addShape(shape: any, options?: ShapeGeometryOptions): void;
    }
}
declare namespace THREE {
    class SphereBufferGeometry extends BufferGeometry {
        constructor(radius?: number, widthSegments?: number, heightSegments?: number, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number);
    }
}
declare namespace THREE {
    class SphereGeometry extends Geometry {
        constructor(radius?: number, widthSegments?: number, heightSegments?: number, phiStart?: number, phiLength?: number, thetaStart?: number, thetaLength?: number);
    }
}
declare namespace THREE {
    class TetrahedronGeometry extends PolyhedronGeometry {
        constructor(radius?: number, detail?: number);
    }
}
declare namespace THREE {
    interface TextGeometryParams extends ExtrudeGeometryOptions {
        font?: Font;
        size?: number;
        height?: number;
        curveSegments?: number;
        bevelEnabled?: boolean;
        bevelThickness?: number;
        bevelSize?: number;
    }
    class TextGeometry extends ExtrudeGeometry {
        constructor(text: string, parameters?: TextGeometryParams);
    }
}
declare namespace THREE {
    class TorusBufferGeometry extends BufferGeometry {
        constructor(radius?: number, tube?: number, radialSegments?: number, tubularSegments?: number, arc?: number);
    }
}
declare namespace THREE {
    class TorusGeometry extends Geometry {
        constructor(radius?: number, tube?: number, radialSegments?: number, tubularSegments?: number, arc?: number);
    }
}
declare namespace THREE {
    class TorusKnotBufferGeometry extends BufferGeometry {
        constructor(radius?: number, tube?: number, tubularSegments?: number, radialSegments?: number, p?: number, q?: number);
    }
}
declare namespace THREE {
    class TorusKnotGeometry extends Geometry {
        constructor(radius?: number, tube?: number, tubularSegments?: number, radialSegments?: number, p?: number, q?: number, heightScale?: number);
    }
}
declare namespace THREE {
    class TubeGeometry extends Geometry {
        private tangents;
        private normals;
        private binormals;
        constructor(path: any, segments: any, radius: any, radialSegments: any, closed: any, taper: any);
        static NoTaper: (u: any) => number;
        static SinusoidalTaper: (u: any) => number;
        static FrenetFrames: (path: any, segments: any, closed: any) => void;
    }
}
declare namespace THREE {
    class WireframeGeometry extends BufferGeometry {
        constructor(geometry: Geometry | BufferGeometry);
    }
}
declare namespace THREE {
    class ArrowHelper extends Object3D {
        private static lineGeometry;
        private static coneGeometry;
        line: Line;
        cone: Mesh;
        constructor(dir: any, origin: any, length: any, color: any, headLength: any, headWidth: any);
        setDirection(dir: any): void;
        setLength(length: number, headLength?: number, headWidth?: number): void;
        setColor(color: Color): void;
    }
}
declare namespace THREE {
    class Line extends Object3D {
        constructor(geometry?: IGeometry, material?: Material, mode?: number);
        private static raycast_inverseMatrix;
        private static raycast_ray;
        private static raycast_sphere;
        raycast(raycaster: any, intersects: any): void;
        clone(): any;
    }
}
declare namespace THREE {
    class LineSegments extends Line {
        constructor(geometry?: IGeometry, material?: Material);
    }
}
declare namespace THREE {
    class AxisHelper extends LineSegments {
        constructor(size?: number);
    }
}
declare namespace THREE {
    interface IntersectResult {
        distance?: number;
        distanceToRay?: number;
        point?: Vector3;
        uv?: Vector2;
        object?: any;
        face?: Face3;
        faceIndex?: number;
        index?: number;
    }
    class Mesh extends Object3D {
        drawMode: number;
        morphTargetBase: any;
        morphTargetInfluences: any;
        morphTargetDictionary: any;
        constructor(geometry?: IGeometry, material?: IMaterial);
        setDrawMode(value: number): void;
        copy(source: Mesh): this;
        updateMorphTargets(): void;
        getMorphTargetIndexByName(name: any): any;
        private static raycast_inverseMatrix;
        private static raycast_ray;
        private static raycast_sphere;
        private static raycast_vA;
        private static raycast_vB;
        private static raycast_vC;
        private static raycast_tempA;
        private static raycast_tempB;
        private static raycast_tempC;
        private static raycast_uvA;
        private static raycast_uvB;
        private static raycast_uvC;
        private static raycast_barycoord;
        private static raycast_intersectionPoint;
        private static raycast_intersectionPointWorld;
        private static initStatic();
        private static uvIntersection(point, p1, p2, p3, uv1, uv2, uv3);
        private static checkIntersection(object, raycaster, ray, pA, pB, pC, point);
        private static checkBufferGeometryIntersection(object, raycaster, ray, positions, uvs, a, b, c);
        raycast(raycaster: Raycaster, intersects: IntersectResult[]): void;
        clone(): this;
    }
}
declare namespace THREE {
    class BoundingBoxHelper extends Mesh {
        object: any;
        box: Box3;
        constructor(object: Object3D, color?: number);
        update(): void;
    }
}
declare namespace THREE {
    class BoxHelper extends LineSegments {
        constructor(object?: Object3D, color?: number);
        update(object: any): void;
    }
}
declare namespace THREE {
    class CameraHelper extends LineSegments {
        camera: Camera;
        pointMap: any;
        constructor(camera: Camera);
        update(): any;
    }
}
declare namespace THREE {
    class DirectionalLightHelper extends Object3D {
        light: DirectionalLight;
        constructor(light: DirectionalLight, size?: number);
        dispose(): void;
        update(): void;
    }
}
declare namespace THREE {
    class EdgesHelper extends LineSegments {
        constructor(object: Object3D, hex: any, thresholdAngle: any);
    }
}
declare namespace THREE {
    class FaceNormalsHelper extends LineSegments {
        object: Object3D;
        size: number;
        constructor(object: Object3D, size?: number, hex?: number, linewidth?: number);
        update(): this;
    }
}
declare namespace THREE {
    class GridHelper extends LineSegments {
        constructor(size: number, step: number, acolor1?: number, acolor2?: number);
    }
}
declare namespace THREE {
    class HemisphereLightHelper extends Object3D {
        light: Light;
        colors: Color[];
        lightSphere: Mesh;
        constructor(light: Light, sphereSize?: number);
        dispose(): void;
        update(): void;
    }
}
declare namespace THREE {
    class PointLightHelper extends Mesh {
        light: PointLight;
        constructor(light: PointLight, sphereSize: any);
        dispose(): void;
        update(): void;
    }
}
declare namespace THREE {
    class SkeletonHelper extends LineSegments {
        bones: Bone[];
        root: Object3D;
        constructor(object: any);
        private getBoneList(object);
        update(): void;
    }
}
declare namespace THREE {
    class SpotLightHelper extends Object3D {
        light: SpotLight;
        cone: LineSegments;
        constructor(light: SpotLight);
        dispose(): void;
        update(): void;
    }
}
declare namespace THREE {
    class VertexNormalsHelper extends LineSegments {
        object: Object3D;
        size: number;
        constructor(object: Object3D, size?: number, hex?: number, linewidth?: number);
        update(): this;
    }
}
declare namespace THREE {
    class WireframeHelper extends LineSegments {
        constructor(object: Object3D, hex?: number);
    }
}
declare namespace THREE {
    class ImmediateRenderObject extends Object3D {
        render: (renderCallback) => any;
        constructor(material: any);
    }
}
declare namespace THREE {
    class MorphBlendMesh extends Mesh {
        animationsMap: any;
        animationsList: any[];
        firstAnimation: any;
        constructor(geometry: Geometry, material: any);
        createAnimation(name: any, start: any, end: any, fps: any): void;
        autoCreateAnimations(fps: any): void;
        setAnimationDirectionForward(name: any): void;
        setAnimationDirectionBackward(name: any): void;
        setAnimationFPS(name: any, fps: any): void;
        setAnimationDuration(name: any, duration: any): void;
        setAnimationWeight: (name: any, weight: any) => void;
        setAnimationTime: (name: any, time: any) => void;
        getAnimationTime: (name: any) => number;
        getAnimationDuration(name: any): number;
        playAnimation(name: any): void;
        stopAnimation(name: any): void;
        update(delta: any): void;
    }
}
declare namespace THREE {
    var SceneUtils: {
        createMultiMaterialObject: (geometry: any, materials: any) => Group;
        detach: (child: Object3D, parent: Object3D, scene: Scene) => void;
        attach: (child: Object3D, scene: Scene, parent: Object3D) => void;
    };
}
declare namespace THREE {
    var ShapeUtils: {
        area: (contour: {
            x: number;
            y: number;
        }[]) => number;
        triangulate: (contour: any, indices: any) => any[];
        triangulateShape: (contour: any, holes: any) => any[];
        isClockWise: (pts: any) => boolean;
        b2: (t: any, p0: any, p1: any, p2: any) => number;
        b3: (t: any, p0: any, p1: any, p2: any, p3: any) => number;
    };
}
declare namespace THREE {
    class Light extends Object3D {
        color: Color;
        intensity: number;
        groundColor: Color;
        angle: number;
        distance: number;
        decay: number;
        penumbra: number;
        shadow: LightShadow;
        target: Object3D;
        constructor(color: number, intensity?: number);
        copy(source: Light): this;
        toJSON(meta: any): any;
    }
}
declare namespace THREE {
    class AmbientLight extends Light {
        constructor(color: number, intensity?: number);
    }
}
declare namespace THREE {
    class DirectionalLight extends Light {
        target: Object3D;
        shadow: DirectionalLightShadow;
        constructor(color: number, intensity?: number);
        copy(source: DirectionalLight): this;
    }
}
declare namespace THREE {
    class LightShadow {
        camera: Camera;
        bias: number;
        radius: number;
        mapSize: Vector2;
        map: WebGLRenderTarget;
        matrix: Matrix4;
        constructor(camera: any);
        copy(source: LightShadow): this;
        clone(): any;
    }
}
declare namespace THREE {
    class DirectionalLightShadow extends LightShadow {
        constructor(light: DirectionalLight);
    }
}
declare namespace THREE {
    class HemisphereLight extends Light {
        constructor(skyColor: number, groundColor: number, intensity?: number);
        copy(source: HemisphereLight): this;
    }
}
declare namespace THREE {
    class PointLight extends Light {
        shadow: LightShadow;
        constructor(color: number, intensity?: number, distance?: number, decay?: number);
        power: number;
        set(power: any): void;
        copy(source: PointLight): this;
    }
}
declare namespace THREE {
    class SpotLight extends Light {
        target: Object3D;
        shadow: SpotLightShadow;
        constructor(color: number, intensity?: number, distance?: number, angle?: number, penumbra?: number, decay?: number);
        power: number;
        copy(source: SpotLight): this;
    }
}
declare namespace THREE {
    class SpotLightShadow extends LightShadow {
        constructor();
        update(light: SpotLight): void;
    }
}
declare namespace THREE {
    class AnimationLoader {
        manager: LoadingManager;
        constructor(manager?: LoadingManager);
        load(url: any, onLoad: any, onProgress: any, onError: any): void;
        parse(json: any, onLoad?: any): void;
    }
}
declare namespace THREE {
    class AudioLoader {
        manager: LoadingManager;
        constructor(manager?: LoadingManager);
        load(url: any, onLoad: any, onProgress: any, onError: any): void;
    }
}
declare namespace THREE {
    class BinaryTextureLoader {
        manager: LoadingManager;
        _parser: any;
        constructor(manager?: LoadingManager);
        load(url: any, onLoad: any, onProgress: any, onError: any): DataTexture;
    }
    var DataTextureLoader: typeof BinaryTextureLoader;
}
declare namespace THREE {
    class BufferGeometryLoader {
        manager: LoadingManager;
        constructor(manager?: LoadingManager);
        load(url: any, onLoad: any, onProgress: any, onError: any): void;
        parse(json: any): BufferGeometry;
    }
}
declare namespace THREE {
    var Cache: {
        enabled: boolean;
        files: {};
        add: (key: any, file: any) => void;
        get: (key: any) => any;
        remove: (key: any) => void;
        clear: () => void;
    };
}
declare namespace THREE {
    class CompressedTextureLoader {
        manager: LoadingManager;
        _parser: any;
        path: string;
        constructor(manager?: LoadingManager);
        load(url: any, onLoad: any, onProgress: any, onError: any): CompressedTexture;
        setPath(value: any): this;
    }
}
declare namespace THREE {
    class CubeTextureLoader {
        manager: LoadingManager;
        path: any;
        crossOrigin: any;
        constructor(manager?: LoadingManager);
        load(urls: any, onLoad: any, onProgress: any, onError: any): CubeTexture;
        setCrossOrigin(value: any): this;
        setPath(value: any): this;
    }
}
declare namespace THREE {
    class FontLoader {
        manager: LoadingManager;
        constructor(manager?: LoadingManager);
        load(url: any, onLoad: any, onProgress: any, onError: any): void;
        parse(json: any): Font;
    }
}
declare namespace THREE {
    class ImageLoader {
        manager: LoadingManager;
        path: any;
        crossOrigin: any;
        constructor(manager?: LoadingManager);
        load(url: any, onLoad?: any, onProgress?: any, onError?: any): HTMLImageElement;
        setCrossOrigin(value: any): this;
        setPath(value: any): this;
    }
}
declare namespace THREE {
    class JSONLoader {
        manager: LoadingManager;
        withCredentials: boolean;
        texturePath: string;
        crossOrigin: boolean;
        constructor(manager?: LoadingManager);
        load(url: any, onLoad: any, onProgress: any, onError: any): void;
        setTexturePath(value: any): void;
        parse(json: any, texturePath: any): {
            geometry?: Geometry;
            materials?: IMaterial[];
        };
    }
}
declare namespace THREE {
    class Loader {
        constructor();
        onLoadStart(): void;
        onLoadProgress(): void;
        onLoadComplete(): void;
        crossOrigin: any;
        extractUrlBase(url: string): string;
        initMaterials(materials: any, texturePath: any, crossOrigin: any): any[];
        private static color;
        private static textureLoader;
        private static materialLoader;
        createMaterial(m: any, texturePath: any, crossOrigin: any): any;
        static Handlers: {
            handlers: any[];
            add: (regex: any, loader: any) => void;
            get: (file: any) => any;
        };
    }
}
declare namespace THREE {
    class LoadingManager {
        onStart: (url?, itemsLoaded?: number, itemsTotal?: number) => any;
        onLoad: () => any;
        onProgress: (url?, itemsLoaded?: number, itemsTotal?: number) => any;
        onError: (url?) => any;
        isLoading: boolean;
        itemsLoaded: number;
        itemsTotal: number;
        constructor(onLoad?: () => any, onProgress?: (url?, itemsLoaded?: number, itemsTotal?: number) => any, onError?: (url?) => any);
        itemStart(url: any): void;
        itemEnd(url: any): void;
        itemError(url: any): void;
    }
    var DefaultLoadingManager: LoadingManager;
}
declare namespace THREE {
    class MaterialLoader {
        manager: LoadingManager;
        textures: any;
        constructor(manager?: LoadingManager);
        load(url: any, onLoad: any, onProgress: any, onError: any): void;
        setTextures(value: any): void;
        getTexture(name: any): any;
        parse(json: any): any;
    }
}
declare namespace THREE {
    class ObjectLoader {
        manager: LoadingManager;
        texturePath: string;
        crossOrigin: any;
        constructor(manager?: LoadingManager);
        load(url: any, onLoad: any, onProgress: any, onError: any): void;
        setTexturePath(value: any): void;
        setCrossOrigin(value: any): void;
        parse(json: any, onLoad: any): any;
        parseGeometries(json: any): {};
        parseMaterials(json: any, textures: any): {};
        parseAnimations(json: any): any[];
        parseImages(json: any, onLoad: any): {};
        parseTextures(json: any, images: any): {};
        parseObject(data: any, geometries: any, materials: any): any;
    }
}
declare namespace THREE {
    class TextureLoader {
        manager: LoadingManager;
        path: any;
        crossOrigin: any;
        constructor(manager?: LoadingManager);
        load(url: any, onLoad?: any, onProgress?: any, onError?: any): Texture;
        setCrossOrigin(value: any): this;
        setPath(value: any): this;
    }
}
declare namespace THREE {
    class XHRLoader {
        manager: LoadingManager;
        path: string;
        responseType: string;
        withCredentials: boolean;
        constructor(manager?: LoadingManager);
        load(url: any, onLoad: any, onProgress: any, onError: any): any;
        setPath(value: string): this;
        setResponseType(value: string): this;
        setWithCredentials(value: any): this;
    }
}
declare namespace THREE {
    interface IMaterial {
        id?: number;
        uuid: string;
        type: string;
        toJSON(meta: any): any;
        clone(): any;
        name?: string;
        fog?: boolean;
        lights?: boolean;
        blending?: number;
        side?: number;
        shading?: number;
        vertexColors?: number;
        opacity?: number;
        transparent?: boolean;
        blendSrc?: number;
        blendDst?: number;
        blendEquation?: number;
        blendSrcAlpha?: number;
        blendDstAlpha?: number;
        blendEquationAlpha?: number;
        depthFunc?: number;
        depthTest?: boolean;
        depthWrite?: boolean;
        clippingPlanes?: Plane[];
        clipShadows?: boolean;
        colorWrite?: boolean;
        precision?: string;
        polygonOffset?: boolean;
        polygonOffsetFactor?: number;
        polygonOffsetUnits?: number;
        alphaTest?: number;
        premultipliedAlpha?: boolean;
        overdraw?: number;
        visible?: boolean;
        _needsUpdate?: boolean;
        color?: Color;
        roughness?: number;
        metalness?: number;
        emissive?: Color;
        specular?: Color;
        shininess?: number;
        map?: Texture;
        alphaMap?: Texture;
        lightMap?: Texture;
        bumpMap?: Texture;
        bumpScale?: number;
        normalMap?: Texture;
        normalScale?: Vector2;
        displacementMap?: Texture;
        displacementScale?: number;
        displacementBias?: number;
        roughnessMap?: Texture;
        metalnessMap?: Texture;
        emissiveMap?: Texture;
        specularMap?: Texture;
        envMap?: Texture;
        aoMap?: Texture;
        reflectivity?: number;
        size?: number;
        sizeAttenuation?: boolean;
        wireframe?: boolean;
        wireframeLinewidth?: number;
        clipping?: boolean;
        uniforms?: any;
        morphTargets?: boolean;
        dispose?(): any;
        __webglShader?: any;
        extensions?: any;
        defines?: any;
        combine?: number;
        depthPacking?: number | boolean;
        index0AttributeName?: any;
        addEventListener?(type: string, listener: EventListener, _this?: any): any;
        vertexShader?: string;
        fragmentShader?: string;
        program?: any;
        numSupportedMorphTargets?: any;
        morphNormals?: any;
        numSupportedMorphNormals?: number;
        skinning?: any;
        needsUpdate?: boolean;
        linewidth?: number;
    }
}
declare namespace THREE {
    interface IMaterialParams {
        color?: number;
        specular?: number;
        shininess?: number;
        opacity?: number;
        shading?: number;
        map?: Texture;
        lightMap?: Texture;
        lightMapIntensity?: number;
        aoMap?: Texture;
        aoMapIntensity?: number;
        emissive?: number;
        emissiveIntensity?: number;
        emissiveMap?: Texture;
        bumpMap?: Texture;
        bumpScale?: number;
        normalMap?: Texture;
        normalScale?: number;
        displacementMap?: Texture;
        displacementScale?: number;
        displacementBias?: number;
        specularMap?: Texture;
        alphaMap?: Texture;
        envMap?: CubeTexture;
        envMapIntensity?: number;
        combine?: number;
        reflectivity?: number;
        refractionRatio?: number;
        wireframe?: boolean;
        wireframeLinewidth?: number;
        skinning?: boolean;
        morphTargets?: boolean;
        morphNormals?: boolean;
        roughnessMap?: Texture;
        roughness?: number;
        metalnessMap?: Texture;
        metalness?: number;
        vertexColors?: number;
        transparent?: boolean;
        depthTest?: boolean;
        depthWrite?: boolean;
        fog?: boolean;
    }
    class Material extends EventDispatcher implements IMaterial {
        private _id;
        id: number;
        uuid: string;
        name: string;
        type: string;
        fog: boolean;
        lights: boolean;
        blending: number;
        side: number;
        shading: number;
        vertexColors: number;
        opacity: number;
        transparent: boolean;
        blendSrc: number;
        blendDst: number;
        blendEquation: number;
        blendSrcAlpha: any;
        blendDstAlpha: any;
        blendEquationAlpha: any;
        depthFunc: number;
        depthTest: boolean;
        depthWrite: boolean;
        clippingPlanes: Plane[];
        clipShadows: boolean;
        colorWrite: boolean;
        precision: any;
        polygonOffset: boolean;
        polygonOffsetFactor: number;
        polygonOffsetUnits: number;
        alphaTest: number;
        premultipliedAlpha: boolean;
        overdraw: number;
        visible: boolean;
        _needsUpdate: boolean;
        color: Color;
        roughness: number;
        metalness: number;
        emissive: Color;
        specular: Color;
        shininess: number;
        map: Texture;
        alphaMap: Texture;
        lightMap: Texture;
        bumpMap: Texture;
        bumpScale: number;
        normalMap: Texture;
        normalScale: Vector2;
        displacementMap: Texture;
        displacementScale: number;
        displacementBias: number;
        roughnessMap: Texture;
        metalnessMap: Texture;
        emissiveMap: Texture;
        specularMap: Texture;
        envMap: Texture;
        reflectivity: number;
        size: number;
        sizeAttenuation: boolean;
        wireframe: boolean;
        wireframeLinewidth: number;
        clipping: boolean;
        uniforms: any;
        constructor();
        needsUpdate: boolean;
        setValues(values: any): void;
        toJSON(meta: any): any;
        clone(): this;
        copy(source: Material): this;
        update(): void;
        dispose(): void;
    }
    var MaterialIdCount: number;
}
declare namespace THREE {
    interface LineBasicMaterialParams {
        color?: number;
        opacity?: number;
        linewidth?: number;
        linecap?: string;
        linejoin?: string;
        vertexColors?: number;
        fog?: boolean;
        depthTest?: boolean;
        depthWrite?: boolean;
        transparent?: boolean;
    }
    class LineBasicMaterial extends Material {
        linewidth: number;
        linecap: string;
        linejoin: string;
        constructor(parameters?: LineBasicMaterialParams);
        copy(source: LineBasicMaterial): this;
    }
}
declare namespace THREE {
    interface LineDashedMaterialParams {
        color?: number;
        opacity?: number;
        linewidth?: number;
        scale?: number;
        dashSize?: number;
        gapSize?: number;
    }
    class LineDashedMaterial extends Material {
        linewidth: number;
        scale: number;
        dashSize: number;
        gapSize: number;
        constructor(parameters?: LineDashedMaterialParams);
        copy(source: LineDashedMaterial): this;
    }
}
declare namespace THREE {
    interface MeshBasicMaterialParams {
        color?: number;
        opacity?: number;
        map?: Texture;
        aoMap?: Texture;
        aoMapIntensity?: number;
        specularMap?: Texture;
        alphaMap?: Texture;
        envMap?: CubeTexture;
        combine?: number;
        reflectivity?: number;
        refractionRatio?: number;
        shading?: number;
        depthTest?: boolean;
        depthWrite?: boolean;
        wireframe?: boolean;
        wireframeLinewidth?: number;
        skinning?: boolean;
        morphTargets?: boolean;
        vertexColors?: number;
        fog?: boolean;
    }
    class MeshBasicMaterial extends Material {
        aoMap: any;
        aoMapIntensity: number;
        combine: number;
        refractionRatio: number;
        wireframeLinecap: string;
        wireframeLinejoin: string;
        skinning: boolean;
        morphTargets: boolean;
        constructor(parameters?: IMaterialParams);
        copy(source: MeshBasicMaterial): this;
    }
}
declare namespace THREE {
    interface MeshDepthMaterialParams {
        opacity?: number;
        map?: Texture;
        displacementMap?: Texture;
        displacementScale?: number;
        displacementBias?: number;
        wireframe?: boolean;
        wireframeLinewidth?: number;
    }
    class MeshDepthMaterial extends Material {
        depthPacking: number;
        skinning: boolean;
        morphTargets: boolean;
        constructor(parameters?: MeshDepthMaterialParams);
        copy(source: MeshDepthMaterial): this;
    }
}
declare namespace THREE {
    interface MeshLambertMaterialParams {
        color?: number;
        opacity?: number;
        map?: Texture;
        lightMap?: Texture;
        lightMapIntensity?: number;
        aoMap?: Texture;
        aoMapIntensity?: number;
        emissive?: number;
        emissiveIntensity?: number;
        emissiveMap?: Texture;
        specularMap?: Texture;
        alphaMap?: Texture;
        envMap?: CubeTexture;
        combine?: number;
        reflectivity?: number;
        refractionRatio?: number;
        wireframe?: boolean;
        wireframeLinewidth?: number;
        skinning?: boolean;
        morphTargets?: boolean;
        morphNormals?: boolean;
    }
    class MeshLambertMaterial extends Material {
        lightMapIntensity: number;
        aoMap: any;
        aoMapIntensity: number;
        emissiveIntensity: number;
        combine: number;
        refractionRatio: number;
        wireframeLinecap: string;
        wireframeLinejoin: string;
        skinning: boolean;
        morphTargets: boolean;
        morphNormals: boolean;
        constructor(parameters?: MeshLambertMaterialParams);
        copy(source: MeshLambertMaterial): this;
    }
}
declare namespace THREE {
    class MeshNormalMaterial extends Material {
        morphTargets: boolean;
        constructor(parameters?: IMaterialParams);
        copy(source: MeshNormalMaterial): this;
    }
}
declare namespace THREE {
    class MeshPhongMaterial extends Material {
        type: string;
        color: Color;
        specular: Color;
        shininess: number;
        map: any;
        lightMap: any;
        lightMapIntensity: number;
        aoMap: any;
        aoMapIntensity: number;
        emissive: Color;
        emissiveIntensity: number;
        emissiveMap: any;
        bumpMap: any;
        bumpScale: number;
        normalMap: any;
        normalScale: Vector2;
        displacementMap: any;
        displacementScale: number;
        displacementBias: number;
        specularMap: any;
        alphaMap: any;
        envMap: any;
        combine: number;
        reflectivity: number;
        refractionRatio: number;
        wireframe: boolean;
        wireframeLinewidth: number;
        wireframeLinecap: string;
        wireframeLinejoin: string;
        skinning: boolean;
        morphTargets: boolean;
        morphNormals: boolean;
        constructor(parameters?: IMaterialParams);
        copy(source: MeshPhongMaterial): this;
    }
}
declare namespace THREE {
    class MeshStandardMaterial extends Material {
        defines: any;
        type: string;
        color: Color;
        roughness: number;
        metalness: number;
        map: any;
        lightMap: any;
        lightMapIntensity: number;
        aoMap: any;
        aoMapIntensity: number;
        emissive: Color;
        emissiveIntensity: number;
        emissiveMap: any;
        bumpMap: any;
        bumpScale: number;
        normalMap: any;
        normalScale: Vector2;
        displacementMap: any;
        displacementScale: number;
        displacementBias: number;
        roughnessMap: any;
        metalnessMap: any;
        alphaMap: any;
        envMap: any;
        envMapIntensity: number;
        refractionRatio: number;
        wireframe: boolean;
        wireframeLinewidth: number;
        wireframeLinecap: string;
        wireframeLinejoin: string;
        skinning: boolean;
        morphTargets: boolean;
        morphNormals: boolean;
        constructor(parameters?: IMaterialParams);
        copy(source: MeshStandardMaterial): this;
    }
}
declare namespace THREE {
    class MeshPhysicalMaterial extends MeshStandardMaterial {
        clearCoat: number;
        clearCoatRoughness: number;
        constructor(parameters?: IMaterialParams);
        copy(source: any): this;
    }
}
declare namespace THREE {
    class MultiMaterial implements IMaterial {
        uuid: string;
        type: string;
        materials: Material[];
        visible: boolean;
        constructor(materials?: Material[]);
        toJSON(meta: any): any;
        clone(): any;
    }
}
declare namespace THREE {
    interface PointsMaterialParams {
        color?: number;
        opacity?: number;
        map?: Texture;
        size?: number;
        sizeAttenuation?: boolean;
    }
    class PointsMaterial extends Material {
        constructor(parameters?: PointsMaterialParams);
        copy(source: PointsMaterial): this;
    }
}
declare namespace THREE {
    interface ShaderMaterialParams extends IMaterialParams {
        defines?: any;
        uniforms?: any;
        fragmentShader?: string;
        vertexShader?: string;
        wireframe?: boolean;
        wireframeLinewidth?: number;
        lights?: boolean;
        skinning?: boolean;
        morphTargets?: boolean;
        morphNormals?: boolean;
        depthTest?: boolean;
        depthWrite?: boolean;
        clipping?: boolean;
        side?: number;
    }
    class ShaderMaterial extends Material {
        defines: any;
        uniforms: any;
        vertexShader: string;
        fragmentShader: string;
        linewidth: number;
        clipping: boolean;
        skinning: boolean;
        morphTargets: boolean;
        morphNormals: boolean;
        extensions: any;
        defaultAttributeValues: any;
        index0AttributeName: string;
        constructor(parameters?: ShaderMaterialParams);
        copy(source: ShaderMaterial): this;
        toJSON(meta: any): any;
    }
}
declare namespace THREE {
    interface RawShaderMaterialParam extends ShaderMaterialParams {
    }
    class RawShaderMaterial extends ShaderMaterial {
        constructor(parameters?: RawShaderMaterialParam);
    }
}
declare namespace THREE {
    class ShadowMaterial extends ShaderMaterial {
        constructor();
        opacity: any;
    }
}
declare namespace THREE {
    interface SpriteMaterialParams {
        color?: number;
        opacity?: number;
        map?: Texture;
        uvOffset?: Vector2;
        uvScale?: Vector2;
    }
    class SpriteMaterial extends Material {
        rotation: number;
        constructor(parameters?: SpriteMaterialParams);
        copy(source: any): this;
    }
}
declare namespace THREE {
    class Euler {
        _x: number;
        _y: number;
        _z: number;
        _order: string;
        static RotationOrders: string[];
        static DefaultOrder: string;
        constructor(_x?: number, _y?: number, _z?: number, _order?: string);
        x: number;
        y: number;
        z: number;
        order: string;
        set(x: number, y: number, z: number, order?: string): this;
        clone(): Euler;
        copy(euler: Euler): this;
        setFromRotationMatrix(m: Matrix4, order: string, update?: boolean): this;
        setFromQuaternion(q: Quaternion, order: string, update?: boolean): this;
        setFromVector3(v: Vector3, order?: string): this;
        reorder(newOrder: string): this;
        equals(euler: Euler): boolean;
        fromArray(array: any[]): this;
        toArray(array?: any[], offset?: number): any[];
        toVector3(optionalResult?: Vector3): Vector3;
        onChange(callback: any, _this: any): this;
        private onChangeCallback_this;
        private onChangeCallback_func;
        onChangeCallback(): void;
    }
}
declare namespace THREE {
    class Frustum {
        planes: Plane[];
        constructor(p0?: Plane, p1?: Plane, p2?: Plane, p3?: Plane, p4?: Plane, p5?: Plane);
        set(p0: Plane, p1: Plane, p2: Plane, p3: Plane, p4: Plane, p5: Plane): this;
        clone(): Frustum;
        copy(frustum: Frustum): this;
        setFromMatrix(m: Matrix4): this;
        intersectsObject(object: Object3D): boolean;
        intersectsSprite(sprite: {
            matrixWorld: Matrix4;
        }): boolean;
        intersectsSphere(sphere: Sphere): boolean;
        intersectsBox(box: Box3): boolean;
        containsPoint(point: Vector3): boolean;
    }
}
declare namespace THREE {
    class Interpolant {
        parameterPositions: ArrayLike<number>;
        _cachedIndex: number;
        resultBuffer: ArrayLike<number>;
        sampleValues: ArrayLike<number>;
        valueSize: number;
        constructor(parameterPositions: ArrayLike<number>, sampleValues: ArrayLike<number>, sampleSize: number, resultBuffer?: ArrayLike<number>);
        evaluate(t: number): ArrayLike<number>;
        settings: any;
        DefaultSettings_: any;
        getSettings_(): any;
        copySampleValue_(index: number): ArrayLike<number>;
        interpolate_(i1: number, t0: number, t: number, t1: number): ArrayLike<number>;
        intervalChanged_(i1: number, t0: number, t1: number): void;
        beforeStart_(i1: any, t0: any, t1: any): ArrayLike<number>;
        afterEnd_(i1: any, t0: any, t1: any): ArrayLike<number>;
    }
}
declare namespace THREE {
    class CubicInterpolant extends Interpolant {
        _weightPrev: number;
        _offsetPrev: number;
        _weightNext: number;
        _offsetNext: number;
        constructor(parameterPositions: ArrayLike<number>, sampleValues: ArrayLike<number>, sampleSize: number, resultBuffer?: ArrayLike<number>);
        intervalChanged_(i1: number, t0: number, t1: number): void;
        interpolate_(i1: number, t0: number, t: number, t1: number): ArrayLike<number>;
    }
}
declare namespace THREE {
    class DiscreteInterpolant extends Interpolant {
        constructor(parameterPositions: ArrayLike<number>, sampleValues: ArrayLike<number>, sampleSize: number, resultBuffer?: ArrayLike<number>);
        interpolate_(i1: number, t0: number, t: number, t1: number): ArrayLike<number>;
    }
}
declare namespace THREE {
    class LinearInterpolant extends Interpolant {
        constructor(parameterPositions: ArrayLike<number>, sampleValues: ArrayLike<number>, sampleSize: number, resultBuffer?: ArrayLike<number>);
        interpolate_(i1: number, t0: number, t: number, t1: number): ArrayLike<number>;
    }
}
declare namespace THREE {
    class QuaternionLinearInterpolant extends Interpolant {
        constructor(parameterPositions: ArrayLike<number>, sampleValues: ArrayLike<number>, sampleSize: number, resultBuffer?: ArrayLike<number>);
        interpolate_(i1: number, t0: number, t: number, t1: number): ArrayLike<number>;
    }
}
declare namespace THREE {
    class Line3 {
        start: Vector3;
        end: Vector3;
        constructor(start?: Vector3, end?: Vector3);
        set(start: Vector3, end: Vector3): this;
        clone(): Line3;
        copy(line: Line3): this;
        center(optionalTarget?: Vector3): Vector3;
        delta(optionalTarget?: Vector3): Vector3;
        distanceSq(): number;
        distance(): number;
        at(t: number, optionalTarget?: Vector3): Vector3;
        closestPointToPointParameter(point: Vector3, clampToLine: boolean): number;
        closestPointToPoint(point: Vector3, clampToLine: boolean, optionalTarget?: Vector3): Vector3;
        applyMatrix4(matrix: Matrix4): this;
        equals(line: any): any;
    }
}
interface Math {
    DEG2RAD: number;
    RAD2DEG: number;
    generateUUID: () => string;
    clamp: (value: number, min: number, max: number) => number;
    euclideanModulo: (n: number, m: number) => number;
    mapLinear: (x: number, a1: number, a2: number, b1: number, b2: number) => number;
    smoothstep: (x: number, min: number, max: number) => number;
    smootherstep: (x: number, min: number, max: number) => number;
    randInt: (low: number, high: number) => number;
    randFloat: (low: number, high: number) => number;
    randFloatSpread: (range: number) => number;
    degToRad: (degrees: number) => number;
    radToDeg: (radians: number) => number;
    isPowerOfTwo: (value: number) => boolean;
    nearestPowerOfTwo: (value: number) => number;
    nextPowerOfTwo: (value: number) => number;
}
declare namespace THREE {
    class Plane {
        normal: Vector3;
        constant: number;
        constructor(normal?: Vector3, constant?: number);
        set(normal: Vector3, constant: number): this;
        setComponents(x: number, y: number, z: number, w: number): this;
        setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): this;
        setFromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): this;
        clone(): Plane;
        copy(plane: Plane): this;
        normalize(): this;
        negate(): this;
        distanceToPoint(point: Vector3): number;
        distanceToSphere(sphere: Sphere): number;
        projectPoint(point: Vector3, optionalTarget?: Vector3): Vector3;
        orthoPoint(point: Vector3, optionalTarget?: Vector3): Vector3;
        intersectLine(line: Line3, optionalTarget?: Vector3): Vector3;
        intersectsLine(line: Line3): boolean;
        intersectsBox(box: Box3): boolean;
        intersectsSphere(sphere: Sphere): boolean;
        coplanarPoint(optionalTarget?: Vector3): Vector3;
        applyMatrix4(matrix: Matrix4, optionalNormalMatrix?: Matrix3): this;
        translate(offset: Vector3): this;
        equals(plane: Plane): boolean;
    }
}
declare namespace THREE {
    class Quaternion {
        private _x;
        private _y;
        private _z;
        private _w;
        constructor(_x?: number, _y?: number, _z?: number, _w?: number);
        x: number;
        y: number;
        z: number;
        w: number;
        set(x: number, y: number, z: number, w: number): this;
        clone(): Quaternion;
        copy(quaternion: any): this;
        setFromEuler(euler: Euler, update?: boolean): this;
        setFromAxisAngle(axis: Vector3, angle: number): this;
        setFromRotationMatrix(m: Matrix4): this;
        setFromUnitVectors(vFrom: Vector3, vTo: Vector3): any;
        inverse(): this;
        conjugate(): this;
        dot(v: Quaternion): number;
        lengthSq(): number;
        length(): number;
        normalize(): this;
        multiply(q: Quaternion): this;
        premultiply(q: Quaternion): this;
        multiplyQuaternions(a: Quaternion, b: Quaternion): this;
        slerp(qb: Quaternion, t: number): this;
        equals(quaternion: Quaternion): boolean;
        fromArray(array: ArrayLike<number>, offset?: number): this;
        toArray(array?: ArrayLike<number>, offset?: number): ArrayLike<number>;
        onChange(callback: any, _this: any): this;
        private onChangeCallback_this;
        private onChangeCallback_func;
        onChangeCallback(): void;
        static slerp(qa: Quaternion, qb: Quaternion, qm: Quaternion, t: number): Quaternion;
        static slerpFlat(dst: ArrayLike<number>, dstOffset: number, src0: ArrayLike<number>, srcOffset0: number, src1: ArrayLike<number>, srcOffset1: number, t: number): void;
    }
}
declare namespace THREE {
    class Ray {
        origin: Vector3;
        direction: Vector3;
        constructor(origin?: Vector3, direction?: Vector3);
        set(origin: Vector3, direction: Vector3): this;
        clone(): Ray;
        copy(ray: Ray): this;
        at(t: number, optionalTarget?: Vector3): Vector3;
        lookAt(v: Vector3): this;
        recast(t: number): this;
        closestPointToPoint(point: Vector3, optionalTarget?: Vector3): Vector3;
        distanceToPoint(point: Vector3): number;
        distanceSqToPoint(point: Vector3): number;
        distanceSqToSegment(v0: Vector3, v1: Vector3, optionalPointOnRay?: Vector3, optionalPointOnSegment?: Vector3): number;
        intersectSphere(sphere: Sphere, optionalTarget?: Vector3): Vector3;
        intersectsSphere(sphere: Sphere): boolean;
        distanceToPlane(plane: Plane): number;
        intersectPlane(plane: Plane, optionalTarget?: Vector3): Vector3;
        intersectsPlane(plane: Plane): boolean;
        intersectBox(box: Box3, optionalTarget?: Vector3): Vector3;
        intersectsBox(box: Box3): boolean;
        intersectTriangle(a: Vector3, b: Vector3, c: Vector3, backfaceCulling: boolean, optionalTarget?: Vector3): Vector3;
        applyMatrix4(matrix4: Matrix4): this;
        equals(ray: Ray): boolean;
    }
}
declare namespace THREE {
    class Spline {
        points: Vector3[];
        private c;
        private v3;
        constructor(points: Vector3[]);
        initFromArray(a: number[][]): void;
        getPoint(k: number): Vector3;
        getControlPointsArray(): number[][];
        getLength(nSubDivisions?: number): {
            chunks: any[];
            total: number;
        };
        static interpolate(p0: number, p1: number, p2: number, p3: number, t: number, t2: number, t3: number): number;
    }
}
declare namespace THREE {
    class Bone extends Object3D {
        skin: any;
        constructor(skin: any);
        copy(source: Bone): this;
    }
}
declare namespace THREE {
    class Group extends Object3D {
        constructor();
    }
}
declare namespace THREE {
    class LensFlare extends Object3D {
        lensFlares: any[];
        positionScreen: Vector3;
        customUpdateCallback: any;
        constructor(texture?: any, size?: number, distance?: number, blending?: number, color?: Color);
        copy(source: LensFlare): this;
        add(texture?: any, size?: number, distance?: number, blending?: number, color?: Color, opacity?: number): this;
        updateLensFlares(): void;
    }
}
declare namespace THREE {
    class LOD extends Object3D {
        private _level;
        constructor();
        levels: {
            distance: number;
            object: Object3D;
        }[];
        copy(source: LOD): this;
        addLevel(object: Object3D, distance: number): void;
        getObjectForDistance(distance: number): Object3D;
        private static raycast_matrixPosition;
        raycast(raycaster: any, intersects: any): void;
        private static update_v1;
        private static update_v2;
        update(camera: any): void;
        toJSON(meta: any): any;
    }
}
declare namespace THREE {
    class Points extends Object3D {
        constructor(geometry?: IGeometry, material?: any);
        private static raycast_inverseMatrix;
        private static raycast_ray;
        private static raycast_sphere;
        raycast(raycaster: Raycaster, intersects: IntersectResult[]): void;
        clone(): this;
    }
}
declare namespace THREE {
    class Skeleton {
        identityMatrix: Matrix4;
        bones: Bone[];
        useVertexTexture: boolean;
        boneTextureWidth: number;
        boneTextureHeight: number;
        boneMatrices: Float32Array;
        boneTexture: any;
        boneInverses: any[];
        constructor(bones?: Bone[], boneInverses?: any, useVertexTexture?: boolean);
        calculateInverses(): void;
        pose(): void;
        private static update_offsetMatrix;
        update(): void;
        clone(): Skeleton;
    }
}
declare namespace THREE {
    class SkinnedMesh extends Mesh {
        bindMode: string;
        bindMatrix: Matrix4;
        bindMatrixInverse: Matrix4;
        skeleton: Skeleton;
        constructor(geometry?: IGeometry, material?: any, useVertexTexture?: boolean);
        bind(skeleton: Skeleton, bindMatrix: Matrix4): void;
        pose(): void;
        normalizeSkinWeights(): void;
        updateMatrixWorld(force?: boolean): void;
        clone(): any;
    }
}
declare namespace THREE {
    class Sprite extends Object3D {
        z: number;
        constructor(material: any);
        private static raycast_matrixPosition;
        raycast(raycaster: Raycaster, intersects: IntersectResult[]): void;
        clone(): this;
    }
}
declare namespace THREE {
    var ShaderChunk: {};
}
declare namespace THREE {
    class Texture extends EventDispatcher {
        private _id;
        id: number;
        uuid: string;
        name: string;
        sourceFile: string;
        image: any;
        mipmaps: any[];
        mapping: number;
        wrapS: number;
        wrapT: number;
        magFilter: number;
        minFilter: number;
        anisotropy: number;
        format: number;
        type: number;
        offset: Vector2;
        repeat: Vector2;
        generateMipmaps: boolean;
        premultiplyAlpha: boolean;
        flipY: boolean;
        unpackAlignment: number;
        encoding: number;
        version: number;
        onUpdate: any;
        constructor(image?: any, mapping?: number, wrapS?: number, wrapT?: number, magFilter?: number, minFilter?: number, format?: number, type?: number, anisotropy?: number, encoding?: number);
        needsUpdate: boolean;
        clone(): this;
        copy(source: Texture): this;
        toJSON(meta: any): any;
        dispose(): void;
        transformUv(uv: any): void;
        static DEFAULT_IMAGE: any;
        static DEFAULT_MAPPING: number;
    }
    var TextureIdCount: number;
}
declare namespace THREE {
    var UniformsUtils: {
        merge: (uniforms: any) => {};
        clone: (uniforms_src: any) => {};
    };
}
declare namespace THREE {
    var UniformsLib: {
        common: {
            "diffuse": {
                value: Color;
            };
            "opacity": {
                value: number;
            };
            "map": {
                value: any;
            };
            "offsetRepeat": {
                value: Vector4;
            };
            "specularMap": {
                value: any;
            };
            "alphaMap": {
                value: any;
            };
            "envMap": {
                value: any;
            };
            "flipEnvMap": {
                value: number;
            };
            "reflectivity": {
                value: number;
            };
            "refractionRatio": {
                value: number;
            };
        };
        aomap: {
            "aoMap": {
                value: any;
            };
            "aoMapIntensity": {
                value: number;
            };
        };
        lightmap: {
            "lightMap": {
                value: any;
            };
            "lightMapIntensity": {
                value: number;
            };
        };
        emissivemap: {
            "emissiveMap": {
                value: any;
            };
        };
        bumpmap: {
            "bumpMap": {
                value: any;
            };
            "bumpScale": {
                value: number;
            };
        };
        normalmap: {
            "normalMap": {
                value: any;
            };
            "normalScale": {
                value: Vector2;
            };
        };
        displacementmap: {
            "displacementMap": {
                value: any;
            };
            "displacementScale": {
                value: number;
            };
            "displacementBias": {
                value: number;
            };
        };
        roughnessmap: {
            "roughnessMap": {
                value: any;
            };
        };
        metalnessmap: {
            "metalnessMap": {
                value: any;
            };
        };
        fog: {
            "fogDensity": {
                value: number;
            };
            "fogNear": {
                value: number;
            };
            "fogFar": {
                value: number;
            };
            "fogColor": {
                value: Color;
            };
        };
        lights: {
            "ambientLightColor": {
                value: any[];
            };
            "directionalLights": {
                value: any[];
                properties: {
                    "direction": {};
                    "color": {};
                    "shadow": {};
                    "shadowBias": {};
                    "shadowRadius": {};
                    "shadowMapSize": {};
                };
            };
            "directionalShadowMap": {
                value: any[];
            };
            "directionalShadowMatrix": {
                value: any[];
            };
            "spotLights": {
                value: any[];
                properties: {
                    "color": {};
                    "position": {};
                    "direction": {};
                    "distance": {};
                    "coneCos": {};
                    "penumbraCos": {};
                    "decay": {};
                    "shadow": {};
                    "shadowBias": {};
                    "shadowRadius": {};
                    "shadowMapSize": {};
                };
            };
            "spotShadowMap": {
                value: any[];
            };
            "spotShadowMatrix": {
                value: any[];
            };
            "pointLights": {
                value: any[];
                properties: {
                    "color": {};
                    "position": {};
                    "decay": {};
                    "distance": {};
                    "shadow": {};
                    "shadowBias": {};
                    "shadowRadius": {};
                    "shadowMapSize": {};
                };
            };
            "pointShadowMap": {
                value: any[];
            };
            "pointShadowMatrix": {
                value: any[];
            };
            "hemisphereLights": {
                value: any[];
                properties: {
                    "direction": {};
                    "skyColor": {};
                    "groundColor": {};
                };
            };
        };
        points: {
            "diffuse": {
                value: Color;
            };
            "opacity": {
                value: number;
            };
            "size": {
                value: number;
            };
            "scale": {
                value: number;
            };
            "map": {
                value: any;
            };
            "offsetRepeat": {
                value: Vector4;
            };
        };
    };
}
declare namespace THREE {
    var ShaderLib: {
        'basic': {
            uniforms: {};
            vertexShader: any;
            fragmentShader: any;
        };
        'lambert': {
            uniforms: {};
            vertexShader: any;
            fragmentShader: any;
        };
        'phong': {
            uniforms: {};
            vertexShader: any;
            fragmentShader: any;
        };
        'standard': {
            uniforms: {};
            vertexShader: any;
            fragmentShader: any;
        };
        'points': {
            uniforms: {};
            vertexShader: any;
            fragmentShader: any;
        };
        'dashed': {
            uniforms: {};
            vertexShader: any;
            fragmentShader: any;
        };
        'depth': {
            uniforms: {};
            vertexShader: any;
            fragmentShader: any;
        };
        'normal': {
            uniforms: {
                "opacity": {
                    value: number;
                };
            };
            vertexShader: any;
            fragmentShader: any;
        };
        'cube': {
            uniforms: {
                "tCube": {
                    value: any;
                };
                "tFlip": {
                    value: number;
                };
            };
            vertexShader: any;
            fragmentShader: any;
        };
        'equirect': {
            uniforms: {
                "tEquirect": {
                    value: any;
                };
                "tFlip": {
                    value: number;
                };
            };
            vertexShader: any;
            fragmentShader: any;
        };
        'distanceRGBA': {
            uniforms: {
                "lightPos": {
                    value: Vector3;
                };
            };
            vertexShader: any;
            fragmentShader: any;
        };
    };
}
declare namespace THREE {
    function paramThreeToGL(renderer: WebGLRenderer, p: number): any;
}
declare namespace THREE {
    function readRenderTargetPixels(renderer: WebGLRenderer, renderTarget: WebGLRenderTarget, x: number, y: number, width: number, height: number, buffer: ArrayBufferView): void;
}
declare namespace THREE {
    interface InfoRenderer {
        calls?: number;
        vertices?: number;
        faces?: number;
        points?: number;
    }
    interface InfoMemory {
        geometries?: number;
        textures?: number;
    }
    interface WebGLRendererInfo {
        render: InfoRenderer;
        memory: InfoMemory;
        programs: any;
    }
    interface LightArrayCache {
        hash: string;
        ambient: number[];
        directional: any[];
        directionalShadowMap: any[];
        directionalShadowMatrix: any[];
        spot: any[];
        spotShadowMap: any[];
        spotShadowMatrix: any[];
        point: any[];
        pointShadowMap: any[];
        pointShadowMatrix: any[];
        hemi: any[];
        shadows: Light[];
    }
    interface WebGLRendererParams {
        canvas?: HTMLCanvasElement;
        context?: any;
        alpha?: boolean;
        depth?: boolean;
        stencil?: boolean;
        antialias?: boolean;
        premultipliedAlpha?: boolean;
        preserveDrawingBuffer?: boolean;
    }
    class WebGLRenderer {
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
        parameters: any;
        _canvas: HTMLCanvasElement;
        _context: any;
        _alpha: boolean;
        _depth: boolean;
        _stencil: boolean;
        _antialias: boolean;
        _premultipliedAlpha: boolean;
        _preserveDrawingBuffer: boolean;
        lights: Light[];
        opaqueObjects: any;
        opaqueObjectsLastIndex: any;
        transparentObjects: any;
        transparentObjectsLastIndex: number;
        morphInfluences: Float32Array;
        sprites: Sprite[];
        lensFlares: LensFlare[];
        _currentRenderTarget: WebGLRenderTarget;
        _currentProgram: number;
        _currentFramebuffer: any;
        _currentMaterialId: number;
        _currentGeometryProgram: any;
        _currentCamera: Camera;
        private _currentScissor;
        private _currentScissorTest;
        private _currentViewport;
        private _usedTextureUnits;
        private _clearColor;
        private _clearAlpha;
        private _width;
        private _height;
        private _pixelRatio;
        private _scissor;
        private _scissorTest;
        private _viewport;
        private _frustum;
        private _clipping;
        private _clippingEnabled;
        private _localClippingEnabled;
        private _sphere;
        private _projScreenMatrix;
        private _vector3;
        private _lights;
        private _infoRender;
        private textures;
        private objects;
        private programCache;
        private lightCache;
        private bufferRenderer;
        private indexedBufferRenderer;
        private backgroundCamera;
        private backgroundCamera2;
        private backgroundPlaneMesh;
        private backgroundBoxShader;
        private backgroundBoxMesh;
        private spritePlugin;
        private lensFlarePlugin;
        constructor(parameters?: WebGLRendererParams);
        private init_context();
        private init_extensions();
        private getTargetPixelRatio();
        private getContext();
        private glClearColor(r, g, b, a);
        private setDefaultGLState();
        resetGLState(): void;
        getContextAttributes(): WebGLContextAttributes;
        forceContextLoss(): void;
        getMaxAnisotropy(): number;
        getPrecision(): string;
        getPixelRatio(): number;
        setPixelRatio(value: number): void;
        getSize(): {
            width: number;
            height: number;
        };
        setSize(width: number, height: number, updateStyle?: boolean): void;
        setViewport(x: number, y: number, width: number, height: number): void;
        setScissor(x: number, y: number, width: number, height: number): void;
        setScissorTest(boolean: boolean): void;
        getClearColor(): Color;
        setClearColor(color: number | Color, alpha?: number): void;
        getClearAlpha(): number;
        setClearAlpha(alpha: any): void;
        clear(color?: boolean, depth?: boolean, stencil?: boolean): void;
        clearColor(): void;
        clearDepth(): void;
        clearStencil(): void;
        clearTarget(renderTarget: WebGLRenderTarget, color?: boolean, depth?: boolean, stencil?: boolean): void;
        dispose(): void;
        private onContextLost_;
        private onMaterialDispose_;
        private onContextLost(event);
        private onMaterialDispose(event);
        private deallocateMaterial(material);
        private releaseMaterialProgramReference(material);
        renderBufferImmediate(object: any, program: WebGLProgram, material: IMaterial): void;
        renderBufferDirect(camera: any, fog: any, geometry: any, material: any, object: any, group: IGeometryGroup): void;
        setupVertexAttributes(material: any, program: any, geometry: any, startIndex?: any): void;
        private absNumericalSort(a, b);
        private painterSortStable(a, b);
        private reversePainterSortStable(a, b);
        render(scene: any, camera: any, renderTarget: any, forceClear: any): void;
        private pushRenderItem(object, geometry, material, z, group);
        private isObjectViewable(object);
        private isSpriteViewable(sprite);
        private isSphereViewable(sphere);
        private projectObject(object, camera);
        private renderObjects(renderList, camera, fog, overrideMaterial?);
        private initMaterial(material, fog, object);
        private setMaterial(material);
        private setProgram(camera, fog, material, object);
        private refreshUniformsCommon(uniforms, material);
        private refreshUniformsLine(uniforms, material);
        private refreshUniformsDash(uniforms, material);
        private refreshUniformsPoints(uniforms, material);
        private refreshUniformsFog(uniforms, fog);
        private refreshUniformsLambert(uniforms, material);
        private refreshUniformsPhong(uniforms, material);
        private refreshUniformsStandard(uniforms, material);
        private refreshUniformsPhysical(uniforms, material);
        private markUniformsLightsNeedsUpdate(uniforms, value);
        private setupShadows(lights);
        private setupLights(lights, camera);
        setFaceCulling(cullFace: number, frontFaceDirection?: number): void;
        allocTextureUnit(): number;
        private static warned;
        setTexture2D(texture: Texture, slot: number): void;
        private static warned_setTextureCube;
        setTextureCube(texture: CubeTexture, slot: any): void;
        getCurrentRenderTarget(): WebGLRenderTarget;
        setRenderTarget(renderTarget: WebGLRenderTarget): void;
        readRenderTargetPixels(renderTarget: WebGLRenderTarget, x: number, y: number, width: number, height: number, buffer: ArrayBufferView): void;
    }
}
declare namespace THREE {
    interface WebGLRenderTargetOptions {
        wrapS?: number;
        wrapT?: number;
        magFilter?: number;
        minFilter?: number;
        format?: number;
        type?: number;
        anisotropy?: number;
        encoding?: number;
        depthBuffer?: boolean;
        stencilBuffer?: boolean;
    }
    class WebGLRenderTarget extends EventDispatcher {
        uuid: string;
        width: number;
        height: number;
        scissor: Vector4;
        scissorTest: boolean;
        viewport: Vector4;
        texture: Texture;
        depthBuffer: boolean;
        stencilBuffer: boolean;
        depthTexture: Texture;
        constructor(width: number, height: number, options?: WebGLRenderTargetOptions);
        setSize(width: number, height: number): void;
        clone(): any;
        copy(source: WebGLRenderTarget): this;
        dispose(): void;
    }
}
declare namespace THREE {
    class WebGLRenderTargetCube extends WebGLRenderTarget {
        activeCubeFace: number;
        activeMipMapLevel: number;
        constructor(width: number, height: number, options?: WebGLRenderTargetOptions);
    }
}
declare namespace THREE {
    class LensFlarePlugin {
        renderer: WebGLRenderer;
        private flares;
        private vertexBuffer;
        private elementBuffer;
        private shader;
        private program;
        private attributes;
        private uniforms;
        private tempTexture;
        private occlusionTexture;
        constructor(renderer: WebGLRenderer);
        private init();
        private createProgram(shader);
        render(scene: Scene, camera: Camera, viewport: Vector4): void;
    }
}
declare namespace THREE {
    class SpritePlugin {
        renderer: WebGLRenderer;
        private sprites;
        private gl;
        private state;
        private vertexBuffer;
        private elementBuffer;
        private program;
        private attributes;
        private uniforms;
        private texture;
        private spritePosition;
        private spriteRotation;
        private spriteScale;
        constructor(renderer: WebGLRenderer);
        private init();
        private createProgram();
        private painterSortStable(a, b);
        render(scene: Scene, camera: Camera): void;
    }
}
declare namespace THREE {
    interface IWebGLBufferRenderer {
        setMode?(value?: number): any;
        render?(start: number, count: number): any;
        renderInstances?(geometry: BufferGeometry, start?: any, count?: any): any;
        setIndex?(index: BufferAttribute): any;
    }
    class WebGLBufferRenderer implements IWebGLBufferRenderer {
        _gl: WebGLRenderingContext;
        extensions: WebGLExtensions;
        _infoRender: InfoRenderer;
        mode: number;
        constructor(_gl: any, extensions: any, _infoRender: any);
        setMode(value: any): void;
        render(start: number, count: number): void;
        renderInstances(geometry: BufferGeometry): void;
    }
}
declare namespace THREE {
    class WebGLCapabilities {
        maxAnisotropy: number;
        extensions: WebGLExtensions;
        gl: WebGLRenderingContext;
        parameters: any;
        precision: string;
        logarithmicDepthBuffer: boolean;
        maxTextures: number;
        maxVertexTextures: number;
        maxTextureSize: number;
        maxCubemapSize: number;
        maxAttributes: number;
        maxVertexUniforms: number;
        maxVaryings: number;
        maxFragmentUniforms: number;
        vertexTextures: boolean;
        floatFragmentTextures: boolean;
        floatVertexTextures: boolean;
        constructor(gl: WebGLRenderingContext, extensions: WebGLExtensions, parameters: any);
        getMaxAnisotropy(): number;
        getMaxPrecision(precision: string): string;
    }
}
declare namespace THREE {
    class WebGLClipping {
        uniform: {
            value: Float32Array;
            needsUpdate: boolean;
        };
        globalState: Float32Array;
        numGlobalPlanes: number;
        localClippingEnabled: boolean;
        renderingShadows: boolean;
        plane: Plane;
        viewNormalMatrix: Matrix3;
        numPlanes: number;
        constructor();
        init(planes: Plane[], enableLocalClipping: boolean, camera: Camera): boolean;
        beginShadows(): void;
        endShadows(): void;
        setState(planes: Plane[], clipShadows: boolean, camera: Camera, cache: any, fromCache: any): void;
        resetGlobalState(): void;
        projectPlanes(planes: Plane[], camera?: Camera, dstOffset?: number, skipTransform?: boolean): Float32Array;
    }
}
declare namespace THREE {
    class WebGLExtensions {
        private extensions;
        private gl;
        constructor(gl: WebGLRenderingContext);
        get(name: string): any;
    }
}
declare namespace THREE {
    class WebGLGeometries {
        gl: WebGLRenderingContext;
        geometries: {
            [index: number]: BufferGeometry;
        };
        properties: WebGLProperties;
        info: WebGLRendererInfo;
        constructor(gl: WebGLRenderingContext, properties: WebGLProperties, info: WebGLRendererInfo);
        private onGeometryDispose(event);
        private getAttributeBuffer(attribute);
        private deleteAttribute(attribute);
        private deleteAttributes(attributes);
        private removeAttributeBuffer(attribute);
        get(object: Object3D): BufferGeometry;
    }
}
declare namespace THREE {
    class WebGLIndexedBufferRenderer implements IWebGLBufferRenderer {
        mode: number;
        _gl: WebGLRenderingContext;
        extensions: WebGLExtensions;
        _infoRender: InfoRenderer;
        type: number;
        size: number;
        constructor(_gl: WebGLRenderingContext, extensions: WebGLExtensions, _infoRender: InfoRenderer);
        setMode(value: number): void;
        setIndex(index: BufferAttribute): void;
        render(start: number, count: number): void;
        renderInstances(geometry: BufferGeometry, start: any, count: any): void;
    }
}
declare namespace THREE {
    interface ILightUniforms {
        position?: Vector3;
        direction?: Vector3;
        color?: Color;
        shadow?: boolean;
        shadowBias?: number;
        shadowRadius?: number;
        shadowMapSize?: Vector2;
        distance?: number;
        coneCos?: number;
        penumbraCos?: number;
        decay?: number;
        skyColor?: Color;
        groundColor?: Color;
    }
    class WebGLLights {
        lights: {
            [index: number]: ILightUniforms;
        };
        constructor();
        get(light: Light): ILightUniforms;
    }
}
declare namespace THREE {
    class WebGLObjects {
        private gl;
        private properties;
        private info;
        private geometries;
        constructor(gl: WebGLRenderingContext, properties: WebGLProperties, info: WebGLRendererInfo);
        private updateAttribute(attribute, bufferType);
        private createBuffer(attributeProperties, data, bufferType);
        private updateBuffer(attributeProperties, data, bufferType);
        private checkEdge(edges, a, b);
        getAttributeBuffer(attribute: BufferAttribute | InterleavedBufferAttribute): WebGLBuffer;
        getWireframeAttribute(geometry: BufferGeometry): BufferAttribute;
        update(object: Object3D): BufferGeometry;
    }
}
declare type _WebGLProgram = WebGLProgram;
declare namespace THREE {
    class WebGLProgram {
        private static programIdCount;
        private static getEncodingComponents(encoding);
        private static getTexelDecodingFunction(functionName, encoding);
        private static getTexelEncodingFunction(functionName, encoding);
        private static getToneMappingFunction(functionName, toneMapping);
        private static generateExtensions(extensions, parameters, rendererExtensions);
        private static generateDefines(defines);
        private static fetchAttributeLocations(gl, program, identifiers?);
        private static filterEmptyLine(string);
        private static replaceLightNums(string, parameters);
        private static parseIncludes(string, ...args);
        private static unrollLoops(string);
        private gl;
        private program;
        private renderer;
        code: string;
        private material;
        private parameters;
        usedTimes: number;
        vertexShader: WebGLShader;
        fragmentShader: WebGLShader;
        constructor(renderer: WebGLRenderer, code: string, material: IMaterial, parameters: IWebGLProgramParameters);
        id: number;
        diagnostics: any;
        private cachedAttributes;
        getAttributes(): any;
        private cachedUniforms;
        getUniforms(): WebGLUniforms;
        destroy(): void;
    }
}
declare namespace THREE {
    interface IWebGLProgramParameters {
        shaderID?: string;
        precision?: string;
        supportsVertexTextures?: boolean;
        outputEncoding?: number;
        map?: boolean;
        mapEncoding?: number;
        envMap?: boolean;
        envMapMode?: number;
        envMapEncoding?: number;
        envMapCubeUV?: boolean;
        lightMap?: boolean;
        aoMap?: boolean;
        emissiveMap?: boolean;
        emissiveMapEncoding?: number;
        bumpMap?: boolean;
        normalMap?: boolean;
        displacementMap?: boolean;
        roughnessMap?: boolean;
        metalnessMap?: boolean;
        specularMap?: boolean;
        alphaMap?: boolean;
        combine?: number;
        vertexColors?: number;
        fog?: any;
        useFog?: boolean;
        fogExp?: boolean;
        flatShading?: boolean;
        sizeAttenuation?: boolean;
        logarithmicDepthBuffer?: boolean;
        skinning?: any;
        maxBones?: number;
        useVertexTexture?: boolean;
        morphTargets?: boolean;
        morphNormals?: boolean;
        maxMorphTargets?: number;
        maxMorphNormals?: number;
        numDirLights?: number;
        numPointLights?: number;
        numSpotLights?: number;
        numHemiLights?: number;
        numClippingPlanes?: number;
        shadowMapEnabled?: boolean;
        shadowMapType?: number;
        toneMapping?: number;
        physicallyCorrectLights?: boolean;
        premultipliedAlpha?: boolean;
        alphaTest?: number;
        doubleSided?: boolean;
        flipSided?: boolean;
        depthPacking?: boolean | number;
    }
}
declare namespace THREE {
    class WebGLPrograms {
        programs: WebGLProgram[];
        private shaderIDs;
        private parameterNames;
        private capabilities;
        private renderer;
        constructor(renderer: WebGLRenderer, capabilities: WebGLCapabilities);
        private allocateBones(object);
        private getTextureEncodingFromMap(map, gammaOverrideLinear);
        getParameters(material: IMaterial, lights: LightArrayCache, fog: any, nClipPlanes: any, object: any): IWebGLProgramParameters;
        getProgramCode(material: any, parameters: any): string;
        acquireProgram(material: any, parameters: IWebGLProgramParameters, code: string): WebGLProgram;
        releaseProgram(program: any): void;
    }
}
declare namespace THREE {
    class WebGLProperties {
        private properties;
        constructor();
        get(object: {
            uuid: string;
        }): any;
        delete(object: {
            uuid: string;
        }): void;
        clear(): void;
    }
}
declare namespace THREE {
    var WebGLShader: (gl: WebGLRenderingContext, type: number, string: string) => WebGLShader;
}
declare namespace THREE {
    class WebGLShadowMap {
        private _renderer;
        private _lights;
        private _objects;
        private _gl;
        private _state;
        private _frustum;
        private _projScreenMatrix;
        private _lightShadows;
        private _shadowMapSize;
        private _lookTarget;
        private _lightPositionWorld;
        private _renderList;
        private _MorphingFlag;
        private _SkinningFlag;
        private _NumberOfMaterialVariants;
        private _depthMaterials;
        private _distanceMaterials;
        private _materialCache;
        private cubeDirections;
        private cubeUps;
        private cube2DViewPorts;
        private depthMaterialTemplate;
        private distanceShader;
        private distanceUniforms;
        enabled: boolean;
        autoUpdate: boolean;
        needsUpdate: boolean;
        type: number;
        renderReverseSided: boolean;
        renderSingleSided: boolean;
        constructor(_renderer: WebGLRenderer, _lights: LightArrayCache, _objects: WebGLObjects);
        private getDepthMaterial(object, material, isPointLight, lightPositionWorld);
        private projectObject(object, camera, shadowCamera);
        render(scene: Scene, camera: Camera): void;
    }
}
declare namespace THREE {
    class WebGLState {
        buffers: {
            color: WebGLColorBuffer;
            depth: WebGLDepthBuffer;
            stencil: WebGLStencilBuffer;
        };
        private gl;
        private newAttributes;
        private maxVertexAttributes;
        private enabledAttributes;
        private attributeDivisors;
        private capabilities;
        private compressedTextureFormats;
        private currentBlending;
        private currentBlendEquation;
        private currentBlendSrc;
        private currentBlendDst;
        private currentBlendEquationAlpha;
        private currentBlendSrcAlpha;
        private currentBlendDstAlpha;
        private currentPremultipledAlpha;
        private currentFlipSided;
        private currentCullFace;
        private currentLineWidth;
        private currentPolygonOffsetFactor;
        private currentPolygonOffsetUnits;
        private currentScissorTest;
        private maxTextures;
        private currentTextureSlot;
        private currentBoundTextures;
        private currentScissor;
        private currentViewport;
        private emptyTextures;
        private extensions;
        private renderer;
        constructor(renderer: WebGLRenderer);
        private createTexture(type, target, count);
        enableAttribute(attribute: any): void;
        enableAttributeAndDivisor(attribute: any, meshPerAttribute: any, extension: any): void;
        disableUnusedAttributes(): void;
        enable(id: number): void;
        disable(id: number): void;
        getCompressedTextureFormats(): any;
        setBlending(blending?: number, blendEquation?: number, blendSrc?: number, blendDst?: number, blendEquationAlpha?: number, blendSrcAlpha?: number, blendDstAlpha?: number, premultipliedAlpha?: number): void;
        setColorWrite(colorWrite: boolean): void;
        setDepthTest(depthTest: boolean): void;
        setDepthWrite(depthWrite: boolean): void;
        setDepthFunc(depthFunc: number): void;
        setStencilTest(stencilTest: boolean): void;
        setStencilWrite(stencilWrite: number): void;
        setStencilFunc(stencilFunc: number, stencilRef: number, stencilMask: number): void;
        setStencilOp(stencilFail: number, stencilZFail: number, stencilZPass: number): void;
        setFlipSided(flipSided: boolean): void;
        setCullFace(cullFace: number): void;
        setLineWidth(width: number): void;
        setPolygonOffset(polygonOffset: boolean, factor: any, units: any): void;
        getScissorTest(): any;
        setScissorTest(scissorTest: boolean): void;
        activeTexture(webglSlot?: number): void;
        bindTexture(webglType: number, webglTexture: WebGLTexture): void;
        compressedTexImage2D(...args: any[]): void;
        texImage2D(...args: any[]): void;
        clearColor(r: number, g: number, b: number, a: number): void;
        clearDepth(depth: number): void;
        clearStencil(stencil: number): void;
        scissor(scissor: Vector4): void;
        viewport(viewport: Vector4): void;
        init(): void;
        initAttributes(): void;
        reset(): void;
    }
    class WebGLColorBuffer {
        setMask: (colorMask: boolean) => void;
        setLocked: (lock: boolean) => void;
        setClear: (r: number, g: number, b: number, a: number) => void;
        reset: () => void;
        constructor(gl: WebGLRenderingContext, state: any);
    }
    class WebGLDepthBuffer {
        setTest: (depthTest: boolean) => void;
        setMask: (depthMask: boolean) => void;
        setFunc: (depthFunc: number) => void;
        setLocked: (lock: boolean) => void;
        setClear: (depth: number) => void;
        reset: () => void;
        constructor(gl: WebGLRenderingContext, state: any);
    }
    class WebGLStencilBuffer {
        setTest: (stencilTest: boolean) => void;
        setMask: (stencilMask: number) => void;
        setFunc: (stencilFunc: number, stencilRef: number, stencilMask: number) => void;
        setOp: (stencilFail: number, stencilZFail: number, stencilZPass: number) => void;
        setLocked: (lock: boolean) => void;
        setClear: (stencil: number) => void;
        reset: () => void;
        constructor(gl: WebGLRenderingContext, state: any);
    }
}
declare var WebGL2RenderingContext: any;
declare namespace THREE {
    class WebGLTextures {
        private _gl;
        private extensions;
        private state;
        private properties;
        private capabilities;
        private info;
        private _infoMemory;
        private _isWebGL2;
        private _renderer;
        constructor(renderer: WebGLRenderer);
        private clampToMaxSize(image, maxSize);
        private isPowerOfTwo(image);
        private makePowerOfTwo(image);
        private textureNeedsPowerOfTwo(texture);
        private filterFallback(f);
        private onTextureDispose(event);
        private onRenderTargetDispose(event);
        private deallocateTexture(texture);
        private deallocateRenderTarget(renderTarget);
        private setTextureParameters(textureType, texture, isPowerOfTwoImage?);
        private uploadTexture(textureProperties, texture, slot);
        private setupFrameBufferTexture(framebuffer, renderTarget, attachment, textureTarget);
        private setupRenderBufferStorage(renderbuffer, renderTarget);
        private setupDepthTexture(framebuffer, renderTarget);
        private setupDepthRenderbuffer(renderTarget);
        setTexture2D(texture: Texture, slot: number): void;
        setTextureCube(texture: CubeTexture, slot: number): void;
        setTextureCubeDynamic(texture: CubeTexture, slot: number): void;
        setupRenderTarget(renderTarget: WebGLRenderTarget): void;
        updateRenderTargetMipmap(renderTarget: WebGLRenderTarget): void;
    }
}
declare namespace THREE {
    class CubeTexture extends Texture {
        constructor(images?: any, mapping?: any, wrapS?: number, wrapT?: number, magFilter?: number, minFilter?: number, format?: number, type?: number, anisotropy?: number, encoding?: number);
        images: any;
    }
}
declare namespace THREE {
    type UniformType = SingleUniform | PureArrayUniform | StructuredUniform;
    type ContainerUniformType = StructuredUniform | WebGLUniforms;
    class StructuredUniform {
        id: any;
        seq: UniformType[];
        map: {
            [index: string]: UniformType;
        };
        constructor(id: any);
        setValue(gl: WebGLRenderingContext, value: any, ...args: any[]): void;
    }
    class SingleUniform {
        id: any;
        addr: WebGLUniformLocation;
        setValue: (gl: WebGLRenderingContext, value, ...args) => void;
        constructor(id: any, activeInfo: any, addr: any, singularSetter: any);
    }
    class PureArrayUniform {
        id: any;
        addr: any;
        size: any;
        setValue: (gl: WebGLRenderingContext, value, ...args) => void;
        constructor(id: any, activeInfo: any, addr: any, pureArraySetter: any);
    }
    class WebGLUniforms {
        private static emptyTexture;
        private static emptyCubeTexture;
        private static arrayCacheF32;
        private static arrayCacheI32;
        id: any;
        private gl;
        seq: UniformType[];
        map: {
            [index: string]: UniformType;
        };
        private addr;
        private size;
        private renderer;
        constructor(gl: WebGLRenderingContext, program: _WebGLProgram, renderer: WebGLRenderer);
        setValue(gl: WebGLRenderingContext, name: string, value: any): void;
        set(gl: WebGLRenderingContext, object: any, name: string): void;
        setOptional(gl: WebGLRenderingContext, object: any, name: string): void;
        static upload(gl: any, seq: any, values: any, renderer: any): void;
        static seqWithValue(seq: UniformType[], values: any): any[];
        static splitDynamic(seq: any, values: any): any;
        static evalDynamic(seq: any, values: any, object: any, camera: any): void;
        private static uncacheTemporaryArrays();
        private static flatten(array, nBlocks, blockSize);
        private static allocTexUnits(renderer, n);
        private static setValue1f;
        private static setValue1i;
        private static setValue2fv;
        private static setValue3fv;
        private static setValue4fv;
        private static setValue2fm;
        private static setValue3fm;
        private static setValue4fm;
        private static setValueT1;
        private static setValueT6;
        private static setValue2iv;
        private static setValue3iv;
        private static setValue4iv;
        private static getSingularSetter(type);
        private static setValue1fv;
        private static setValue1iv;
        private static setValueV2a;
        private static setValueV3a;
        private static setValueV4a;
        private static setValueM2a;
        private static setValueM3a;
        private static setValueM4a;
        private static setValueT1a;
        private static setValueT6a;
        private static getPureArraySetter(type);
        private static RePathPart;
        private static addUniform(container, uniformObject);
        private static parseUniform(activeInfo, addr, container);
    }
}
declare namespace THREE {
    class Fog {
        name: string;
        color: Color;
        near: number;
        far: number;
        constructor(color: number, near?: number, far?: number);
        clone(): Fog;
    }
}
declare namespace THREE {
    class FogExp2 {
        name: string;
        color: Color;
        density: number;
        constructor(color: number, density?: number);
        clone(): FogExp2;
    }
}
declare namespace THREE {
    class Scene extends Object3D {
        background: any;
        fog: any;
        overrideMaterial: any;
        autoUpdate: boolean;
        constructor();
        copy(source: Scene, recursive?: boolean): this;
    }
}
declare namespace THREE {
    class CanvasTexture extends Texture {
        constructor(canvas?: HTMLCanvasElement, mapping?: number, wrapS?: number, wrapT?: number, magFilter?: number, minFilter?: number, format?: number, type?: number, anisotropy?: number);
    }
}
declare namespace THREE {
    class CompressedTexture extends Texture {
        constructor(mipmaps?: any, width?: number, height?: number, format?: number, type?: number, mapping?: any, wrapS?: number, wrapT?: number, magFilter?: number, minFilter?: number, anisotropy?: number, encoding?: number);
    }
}
declare namespace THREE {
    class DataTexture extends Texture {
        constructor(data?: any, width?: number, height?: number, format?: number, type?: number, mapping?: number, wrapS?: number, wrapT?: number, magFilter?: number, minFilter?: number, anisotropy?: number, encoding?: number);
    }
}
declare namespace THREE {
    class DepthTexture extends Texture {
        constructor(width?: number, height?: number, type?: number, mapping?: number, wrapS?: number, wrapT?: number, magFilter?: number, minFilter?: number, anisotropy?: number);
    }
}
declare namespace THREE {
    class VideoTexture extends Texture {
        constructor(video?: any, mapping?: number, wrapS?: number, wrapT?: number, magFilter?: number, minFilter?: number, format?: number, type?: number, anisotropy?: number);
    }
}
