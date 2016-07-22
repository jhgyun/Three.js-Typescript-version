/// <reference path="material.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  map: new THREE.Texture( <Image> ),
 *
 *  lightMap: new THREE.Texture( <Image> ),
 *  lightMapIntensity: <float>
 *
 *  aoMap: new THREE.Texture( <Image> ),
 *  aoMapIntensity: <float>
 *
 *  emissive: <hex>,
 *  emissiveIntensity: <float>
 *  emissiveMap: new THREE.Texture( <Image> ),
 *
 *  specularMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.TextureCube( [posx, negx, posy, negy, posz, negz] ),
 *  combine: THREE.Multiply,
 *  reflectivity: <float>,
 *  refractionRatio: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>,
 *  morphNormals: <bool>
 * }
 */

namespace THREE
{
    export interface MeshLambertMaterialParams
    {
        color?: number;// <hex>,
        opacity?: number;//<float>,

        map?: Texture;// new THREE.Texture(<Image> ),
        lightMap?: Texture;//  new THREE.Texture(<Image> ),
        lightMapIntensity?: number;// <float>

        aoMap?: Texture;//new THREE.Texture(<Image> ),
        aoMapIntensity?: number;// <float>

        emissive?: number;// <hex>,
        emissiveIntensity?: number;// <float>
        emissiveMap?: Texture;// new THREE.Texture(<Image> ),

        specularMap?: Texture;// new THREE.Texture(<Image> ),

        alphaMap?: Texture;// new THREE.Texture(<Image> ),

        envMap?: CubeTexture;// new THREE.CubeTexture([posx, negx, posy, negy, posz, negz]),
        combine?: number;// THREE.Multiply,
        reflectivity?: number;// <float>,
        refractionRatio?: number;// <float>,

        wireframe?: boolean;// <boolean>,
        wireframeLinewidth?: number;// <float>,

        skinning?: boolean;// <bool>,
        morphTargets?: boolean;// <bool>,
        morphNormals?: boolean; //<bool>
    }

    export class MeshLambertMaterial extends Material
    {
        lightMapIntensity = 1.0;
        aoMap = null;
        aoMapIntensity = 1.0;
        emissiveIntensity = 1.0;
        combine = MultiplyOperation;
        refractionRatio = 0.98;
        wireframeLinecap = 'round';
        wireframeLinejoin = 'round';
        skinning = false;
        morphTargets = false;
        morphNormals = false;

        constructor(parameters?: MeshLambertMaterialParams)
        {
            super();
            this.type = 'MeshLambertMaterial';

            this.color = new Color(0xffffff); // diffuse

            this.map = null;
            this.lightMap = null;
            this.aoMap = null;

            this.emissive = new Color(0x000000);
            this.emissiveMap = null;

            this.specularMap = null;

            this.alphaMap = null;

            this.envMap = null;
            this.reflectivity = 1;

            this.wireframe = false;
            this.wireframeLinewidth = 1;
            this.setValues(parameters); 
        }; 
        copy(source: MeshLambertMaterial)
        {
            super.copy(source);
            this.color.copy(source.color);

            this.map = source.map;

            this.lightMap = source.lightMap;
            this.lightMapIntensity = source.lightMapIntensity;

            this.aoMap = source.aoMap;
            this.aoMapIntensity = source.aoMapIntensity;

            this.emissive.copy(source.emissive);
            this.emissiveMap = source.emissiveMap;
            this.emissiveIntensity = source.emissiveIntensity;

            this.specularMap = source.specularMap;

            this.alphaMap = source.alphaMap;

            this.envMap = source.envMap;
            this.combine = source.combine;
            this.reflectivity = source.reflectivity;
            this.refractionRatio = source.refractionRatio;

            this.wireframe = source.wireframe;
            this.wireframeLinewidth = source.wireframeLinewidth;
            this.wireframeLinecap = source.wireframeLinecap;
            this.wireframeLinejoin = source.wireframeLinejoin;

            this.skinning = source.skinning;
            this.morphTargets = source.morphTargets;
            this.morphNormals = source.morphNormals;
            return this;
        };
    }
}