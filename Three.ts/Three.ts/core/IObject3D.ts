namespace THREE
{
    export interface IObject3D extends EventDispatcher
    {
        id?: number;
        uuid?: string;
        name?: string;
        type?: string;
        parent?: Object3D;
        children?: Object3D[];
        up?: Vector3;
        geometry?: IGeometry;
        material?: IMaterial;
        matrix?: Matrix4;
        matrixWorld?: Matrix4;

        matrixAutoUpdate?: boolean;
        matrixWorldNeedsUpdate?: boolean;

        layers?: Layers;
        visible?: boolean;

        castShadow?: boolean;
        receiveShadow?: boolean;

        frustumCulled?: boolean;
        renderOrder?: number;
        userData: any;

        //Bone
        skin?: any;

        //LensFlare
        lensFlares?: any[];
        positionScreen?: Vector3;
        customUpdateCallback?: any;

        //LOD
        levels?: ILODLevel[];

        //Mesh
        drawMode?: number;
        morphTargetBase?: any;
        morphTargetInfluences?: number[];
        morphTargetDictionary?: any;

        //SkinnedMesh
        bindMode?: string;
        bindMatrix?: Matrix4;
        bindMatrixInverse?: Matrix4;
        skeleton?: Skeleton;

        //Sprite
        z?: number;
    }
}