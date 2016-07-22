/// <reference path="material.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  specular: <hex>,
 *  shininess: <float>,
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
 *  bumpMap: new THREE.Texture( <Image> ),
 *  bumpScale: <float>,
 *
 *  normalMap: new THREE.Texture( <Image> ),
 *  normalScale: <Vector2>,
 *
 *  displacementMap: new THREE.Texture( <Image> ),
 *  displacementScale: <float>,
 *  displacementBias: <float>,
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
    export class MeshPhongMaterial extends Material
    {
        type = 'MeshPhongMaterial'; 
        color = new Color(0xffffff); // diffuse
        specular = new Color(0x111111);
        shininess = 30;

        map = null;

        lightMap = null;
        lightMapIntensity = 1.0;

        aoMap = null;
        aoMapIntensity = 1.0;

        emissive = new Color(0x000000);
        emissiveIntensity = 1.0;
        emissiveMap = null;

        bumpMap = null;
        bumpScale = 1;

        normalMap = null;
        normalScale = new Vector2(1, 1);

        displacementMap = null;
        displacementScale = 1;
        displacementBias = 0;

        specularMap = null;

        alphaMap = null;
        
        envMap = null;
        combine = MultiplyOperation;
        reflectivity = 1;
        refractionRatio = 0.98;

        wireframe = false;
        wireframeLinewidth = 1;
        wireframeLinecap = 'round';
        wireframeLinejoin = 'round';

        skinning = false;
        morphTargets = false;
        morphNormals = false;

        constructor(parameters?: IMaterialParams)
        {
            super();   
            this.setValues(parameters); 
        };
         

        copy(source: MeshPhongMaterial)
        { 
            super.copy.call( source);

            this.color.copy(source.color);
            this.specular.copy(source.specular);
            this.shininess = source.shininess;

            this.map = source.map;

            this.lightMap = source.lightMap;
            this.lightMapIntensity = source.lightMapIntensity;

            this.aoMap = source.aoMap;
            this.aoMapIntensity = source.aoMapIntensity;

            this.emissive.copy(source.emissive);
            this.emissiveMap = source.emissiveMap;
            this.emissiveIntensity = source.emissiveIntensity;

            this.bumpMap = source.bumpMap;
            this.bumpScale = source.bumpScale;

            this.normalMap = source.normalMap;
            this.normalScale.copy(source.normalScale);

            this.displacementMap = source.displacementMap;
            this.displacementScale = source.displacementScale;
            this.displacementBias = source.displacementBias;

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
