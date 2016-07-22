/// <reference path="material.ts" />
/* 
 * @author WestLangley / http://github.com/WestLangley
 *
 * parameters = {
 *  color: <hex>,
 *  roughness: <float>,
 *  metalness: <float>,
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
 *  roughnessMap: new THREE.Texture( <Image> ),
 *
 *  metalnessMap: new THREE.Texture( <Image> ),
 *
 *  alphaMap: new THREE.Texture( <Image> ),
 *
 *  envMap: new THREE.CubeTexture( [posx, negx, posy, negy, posz, negz] ),
 *  envMapIntensity: <float>
 *
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
    

    export class MeshStandardMaterial extends Material
    {
        defines: any = { 'STANDARD': '' };

        type = 'MeshStandardMaterial';

        color = new Color(0xffffff); // diffuse
        roughness = 0.5;
        metalness = 0.5;

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

        roughnessMap = null;

        metalnessMap = null;

        alphaMap = null;

        envMap = null;
        envMapIntensity = 1.0;

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


        copy(source: MeshStandardMaterial)
        {
            super.copy(source);
            this.defines = { 'STANDARD': '' };

            this.color.copy(source.color);
            this.roughness = source.roughness;
            this.metalness = source.metalness;

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

            this.roughnessMap = source.roughnessMap;

            this.metalnessMap = source.metalnessMap;

            this.alphaMap = source.alphaMap;

            this.envMap = source.envMap;
            this.envMapIntensity = source.envMapIntensity;

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
