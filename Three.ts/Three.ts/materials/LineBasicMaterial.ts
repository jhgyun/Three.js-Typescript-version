/// <reference path="material.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  linewidth: <float>,
 *  linecap: "round",
 *  linejoin: "round"
 * }
 */

namespace THREE
{
    export interface LineBasicMaterialParams
    {
        color?: number; // <hex>,
        opacity?: number; // <float>,

        linewidth?: number; // <float>,
        linecap?: string; // "round",
        linejoin?: string; // "round"
        vertexColors?: number;
        fog?: boolean;
        depthTest?: boolean;
        depthWrite?: boolean;
        transparent?: boolean;
    }

    export class LineBasicMaterial extends Material
    {
        linewidth = 1;
        linecap = 'round';
        linejoin = 'round';

        constructor(parameters?: LineBasicMaterialParams)
        {
            super(); 
            this.type = 'LineBasicMaterial'; 
            this.color = new Color(0xffffff);
            this.lights = false; 
            this.setValues(parameters); 
        };


        copy(source: LineBasicMaterial): this
        {
            super.copy(source);
            this.color.copy(source.color);
            this.linewidth = source.linewidth;
            this.linecap = source.linecap;
            this.linejoin = source.linejoin;
            return this; 
        };
    }
}