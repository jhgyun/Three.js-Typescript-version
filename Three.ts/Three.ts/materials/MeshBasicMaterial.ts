/// <reference path="material.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *  map: new THREE.Texture( <Image> ),
 *
 *  aoMap: new THREE.Texture( <Image> ),
 *  aoMapIntensity: <float>
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
 *  shading: THREE.SmoothShading,
 *  depthTest: <bool>,
 *  depthWrite: <bool>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>,
 *
 *  skinning: <bool>,
 *  morphTargets: <bool>
 * }
 */

namespace THREE
{
    export interface MeshBasicMaterialParams
    {
        color?: number ; // <hex>,
        opacity?: number ; // <float>,
        map?: Texture ; // new THREE.Texture(<Image> ),
        
        aoMap?: Texture ; // new THREE.Texture(<Image> ),
        aoMapIntensity?: number ; // <float>
        
        specularMap?: Texture ; // new THREE.Texture(<Image> ),
        
        alphaMap?: Texture ; // new THREE.Texture(<Image> ),

        envMap?: CubeTexture; // new THREE.TextureCube([posx, negx, posy, negy, posz, negz]),
        combine?: number ; // THREE.Multiply,
        reflectivity?: number ; // <float>,
        refractionRatio?: number ; // <float>,
        
        shading?: number; // THREE.SmoothShading,
        depthTest?: boolean; // <bool>,
        depthWrite?: boolean ; // <bool>,
        
        wireframe?: boolean ; // <boolean>,
        wireframeLinewidth?: number ; // <float>,
        
        skinning?: boolean ; // <bool>,
        morphTargets?: boolean; // <bool>
        vertexColors?: number;
        fog?: boolean;
    }
    export class MeshBasicMaterial extends Material
    {
        aoMap = null;
        aoMapIntensity = 1.0;
        combine = MultiplyOperation;
        refractionRatio = 0.98;
        wireframeLinecap = 'round';
        wireframeLinejoin = 'round';
        skinning = false;
        morphTargets = false;

        constructor(parameters?: IMaterialParams)
        {
            super();
            this.type = 'MeshBasicMaterial';
            this.color = new Color(0xffffff); // emissive

            this.map = null;
            this.specularMap = null;
            this.alphaMap = null;

            this.envMap = null;
            this.reflectivity = 1;
             
            this.wireframe = false;
            this.wireframeLinewidth = 1;
             
            this.lights = false; 
            this.setValues(parameters);

        };
        copy(source: MeshBasicMaterial)
        {
            super.copy(source);
            this.color.copy(source.color);

            this.map = source.map;

            this.aoMap = source.aoMap;
            this.aoMapIntensity = source.aoMapIntensity;

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

            return this; 
        };
    }
}