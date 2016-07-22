/// <reference path="webglrendertarget.ts" />
/* 
 * @author alteredq / http://alteredqualia.com
 */

namespace THREE
{
    export class WebGLRenderTargetCube extends WebGLRenderTarget
    {
        /**
        * PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
        */
        activeCubeFace: number;
        activeMipMapLevel: number;
        constructor(width: number, height: number, options?: WebGLRenderTargetOptions)
        { 
            super(width, height, options);

            this.activeCubeFace = 0; // PX 0, NX 1, PY 2, NY 3, PZ 4, NZ 5
            this.activeMipMapLevel = 0; 
        }; 
    }
}