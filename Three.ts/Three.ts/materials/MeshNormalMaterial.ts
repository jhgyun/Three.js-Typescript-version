/// <reference path="material.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 *
 * parameters = {
 *  opacity: <float>,
 *
 *  wireframe: <boolean>,
 *  wireframeLinewidth: <float>
 * }
 */

namespace THREE
{
   

    export class MeshNormalMaterial extends Material
    {
        morphTargets = false;

        constructor(parameters?: IMaterialParams)
        {
            super();
            this.type = 'MeshNormalMaterial';

            this.wireframe = false;
            this.wireframeLinewidth = 1;

            this.fog = false;
            this.lights = false;
            this.setValues(parameters);
        }
        copy(source: MeshNormalMaterial)
        {
            super.copy(source);
            this.wireframe = source.wireframe;
            this.wireframeLinewidth = source.wireframeLinewidth;
            return this;
        }
    }
}