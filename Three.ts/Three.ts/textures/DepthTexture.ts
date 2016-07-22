/// <reference path="texture.ts" />
/* 
 * @author Matt DesLauriers / @mattdesl
 */

namespace THREE
{
    export class DepthTexture extends Texture
    {
        constructor(
            width?: number,
            height?: number,
            type?: number,
            mapping?: number,
            wrapS?: number,
            wrapT?: number,
            magFilter?: number,
            minFilter?: number,
            anisotropy?: number)
        { 
            super(null, mapping, wrapS, wrapT, magFilter, minFilter, DepthFormat, type, anisotropy);

            this.image = { width: width, height: height };

            this.type = type !== undefined ? type : UnsignedShortType;

            this.magFilter = magFilter !== undefined ? magFilter : NearestFilter;
            this.minFilter = minFilter !== undefined ? minFilter : NearestFilter;

            this.flipY = false;
            this.generateMipmaps = false; 
        }; 
    }
}
