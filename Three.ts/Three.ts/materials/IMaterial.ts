namespace THREE
{
    export interface IMaterial
    {
        id?: number;
        uuid: string;
        type: string;
        toJSON(meta);
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

        precision?: string; // override the renderer's default precision for this material

        polygonOffset?: boolean;
        polygonOffsetFactor?: number;
        polygonOffsetUnits?: number;

        alphaTest?: number;
        premultipliedAlpha?: boolean;

        overdraw?: number; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer

        visible?: boolean;
        _needsUpdate?: boolean;

        color?: Color;
        roughness?: number;
        metalness?: number;
        emissive?: Color;
        emissiveIntensity?: number;
        specular?: Color;
        shininess?: number;
        map?: Texture;
        alphaMap?: Texture;
        lightMap?: Texture;
        lightMapIntensity?: number;
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
        aoMapIntensity?: number;
        reflectivity?: number;
        refractionRatio?: number;
        size?: number;
        sizeAttenuation?: boolean;
        wireframe?: boolean;
        wireframeLinewidth?: number;
        clipping?: boolean;
        uniforms?: IUniforms;
        morphTargets?: boolean;
        dispose?();

        __webglShader?;
        extensions?;
        defines?;
        combine?: number;
        depthPacking?: number | boolean;
        index0AttributeName?;

        addEventListener?(type: string, listener: EventListener, _this?: any);
        vertexShader?: string;
        fragmentShader?: string;
        program?;
        numSupportedMorphTargets?: number;
        morphNormals?: boolean;
        numSupportedMorphNormals?: number;
        skinning?;
        needsUpdate?: boolean;
        linewidth?: number;

        defaultAttributeValues?: { [index: string]: number[] };  

        materials?: IMaterial[];
    }
}