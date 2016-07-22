/// <reference path="material.ts" />
/* 
 * @author alteredq / http://alteredqualia.com/
 *
 * parameters = {
 *  color: <hex>,
 *  opacity: <float>,
 *
 *  linewidth: <float>,
 *
 *  scale: <float>,
 *  dashSize: <float>,
 *  gapSize: <float>
 * }
 */

namespace THREE
{
    export interface LineDashedMaterialParams
    {
        color?: number; // <hex>,
        opacity?: number; // <float>, 
        linewidth?: number; // <float>, 
        scale?: number; // <float>,
        dashSize?: number; // <float>,
        gapSize?: number; // <float>
    }

    export class LineDashedMaterial extends Material
    {
        linewidth = 1;
        scale = 1;
        dashSize = 3;
        gapSize = 1;

        constructor(parameters?: LineDashedMaterialParams)
        { 
            super(); 
            this.type = 'LineDashedMaterial'; 
            this.color = new Color(0xffffff); 
            this.lights = false; 
            this.setValues(parameters); 
        };
         
        copy(source: LineDashedMaterial)
        { 
            super.copy(source); 
            this.color.copy(source.color); 
            this.linewidth = source.linewidth; 
            this.scale = source.scale;
            this.dashSize = source.dashSize;
            this.gapSize = source.gapSize; 
            return this; 
        };
    }
}