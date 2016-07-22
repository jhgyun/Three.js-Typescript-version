/// <reference path="shadermaterial.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export interface RawShaderMaterialParam extends ShaderMaterialParams
    {
    }
    export class RawShaderMaterial extends ShaderMaterial
    {
        constructor(parameters?: RawShaderMaterialParam)
        {
            super(parameters); 
            this.type = 'RawShaderMaterial';
        };
    }
}
