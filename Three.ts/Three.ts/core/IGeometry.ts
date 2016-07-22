namespace THREE
{
    export interface IGeometry extends EventDispatcher
    {
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

        // update flags 
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

        //BufferGeometry
        index?: BufferAttribute;
        attributes?: IBufferGeometryAttributes;
        morphAttributes?: IBufferGeometryAttributes;
        groups?: IGeometryGroup[];

        //DirectGeometry
        indices?: any[];
        normals?: Vector3[] ;
        uvs?: Vector2[] ;
        uvs2?: any[]; 

        dispose?();
        computeBoundingSphere?();
    }
}