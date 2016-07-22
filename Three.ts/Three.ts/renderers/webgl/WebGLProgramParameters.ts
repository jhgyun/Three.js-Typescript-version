namespace THREE
{
    export interface IWebGLProgramParameters
    {
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
        fog?;
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