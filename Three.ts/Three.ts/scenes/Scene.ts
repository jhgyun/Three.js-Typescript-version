/// <reference path="../core/object3d.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class Scene extends Object3D
    {
        background = null;
        fog = null;
        overrideMaterial = null;

        autoUpdate = true; // checked by the renderer

        constructor()
        {
            super();
            this.type = 'Scene';
        };


        copy(source: Scene, recursive?: boolean)
        {
            super.copy(source, recursive);

            if (source.background !== null) this.background = source.background.clone();
            if (source.fog !== null) this.fog = source.fog.clone();
            if (source.overrideMaterial !== null) this.overrideMaterial = source.overrideMaterial.clone();

            this.autoUpdate = source.autoUpdate;
            this.matrixAutoUpdate = source.matrixAutoUpdate;

            return this;

        };
    }
}