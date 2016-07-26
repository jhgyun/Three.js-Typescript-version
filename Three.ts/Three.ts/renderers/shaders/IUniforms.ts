namespace THREE
{
    export interface IUniformsValueBase
    {
        value?: any;
        needsUpdate?: boolean;
        dynamic?: boolean;
        onUpdateCallback?: (object, camera) => any;
    }
    export interface IUniformsValue<T> extends IUniformsValueBase
    {
        value?: T;
    }
    export interface IUniformsTextureValue extends IUniformsValue<Texture>
    {
    }
    export interface IUniformsValueProperties<T, S> extends IUniformsValue<T>
    {
        properties?: S;
    }

    export interface IUniforms
    {
        //common
        diffuse?: IUniformsValue<Color>;
        emissive?: IUniformsValue<Color>;
        opacity?: IUniformsValue<number>;
        map?: IUniformsTextureValue;  
        offsetRepeat?: IUniformsValue<Vector4>;   
        specularMap?: IUniformsTextureValue;  
        alphaMap?: IUniformsTextureValue;   
        envMap?: IUniformsTextureValue;
        flipEnvMap?: IUniformsValue<number>;    
        reflectivity?: IUniformsValue<number>;    
        refractionRatio?: IUniformsValue<number>;
        emissiveMap?: IUniformsTextureValue; 
        //aomap
        aoMap?: IUniformsTextureValue;    
        aoMapIntensity?: IUniformsValue<number>;    
        //lightmap
        lightMap?: IUniformsTextureValue;     
        lightMapIntensity?: IUniformsValue<number>; 
        //bumpmap
        bumpMap?: IUniformsTextureValue; 
        bumpScale?: IUniformsValue<number>;  
        //normalmap
        normalMap?: IUniformsTextureValue; 
        normalScale?: IUniformsValue<Vector2>;  
        //displacementMap
        displacementMap?: IUniformsTextureValue;
        displacementScale?: IUniformsValue<number>; 
        displacementBias?: IUniformsValue<number>;  

        //roughnessMap
        roughnessMap?: IUniformsTextureValue; 

        //metalnessMap
        metalnessMap?: IUniformsTextureValue;  

        //fog
        fogDensity?: IUniformsValue<number>;
        fogNear?: IUniformsValue<number>;
        fogFar?: IUniformsValue<number>;
        fogColor?: IUniformsValue<Color>;

        ambientLightColor?: IUniformsValue<any[]>;
        directionalLights?: IUniformsValueProperties<any[], {
            direction: any,
            color: any, 
            shadow: any,
            shadowBias: any,
            shadowRadius: any,
            shadowMapSize: any
        }>;

        directionalShadowMap?: IUniformsValue<Texture[]>; 
        directionalShadowMatrix?: IUniformsValue<any[]>;  

        spotLights?: IUniformsValueProperties<
        any[],
        {
            color: any,
            position: any,
            direction: any,
            distance: any,
            coneCos: any,
            penumbraCos: any,
            decay: any,

            shadow: any,
            shadowBias: any,
            shadowRadius: any,
            shadowMapSize: any
        }>;

        spotShadowMap?: IUniformsValue<Texture[]>; 
        spotShadowMatrix?: IUniformsValue<any[]>;
        pointLights?: IUniformsValueProperties<any[],
        {
            color?: any;
            position?: any;
            decay?: any;
            distance?: any;

            shadow?: any;
            shadowBias?: any;
            shadowRadius?: any;
            shadowMapSize?: any;
        }>;

        pointShadowMap?: IUniformsValue<Texture[]>; 
        pointShadowMatrix?: IUniformsValue<any[]>;  

        hemisphereLights?: IUniformsValueProperties<any[], {
            direction?: any;
            skyColor?: any;
            groundColor?: any;
        }
        >;

        size?: IUniformsValue<number>;  
        scale?: IUniformsValue<number>;   

        clearCoat?: IUniformsValue<number>;  
        clearCoatRoughness?: IUniformsValue<number>;  

        dashSize?: IUniformsValue<number>;
        totalSize?: IUniformsValue<number>;

        specular?: IUniformsValue<Color>;
        shininess?: IUniformsValue<number>; 
         
        roughness?: IUniformsValue<number>; 
        metalness?: IUniformsValue<number>; 
        envMapIntensity?: IUniformsValue<number>;   

        tCube?: IUniformsValue<any>;
        tFlip?: IUniformsValue<number>;   

        tEquirect?: IUniformsValue<any>;  

        lightPos?: IUniformsValue<Vector3>;   

        clippingPlanes?: IUniformsValue<Float32Array>;

        [index: string]: IUniformsValueBase;
    }
}