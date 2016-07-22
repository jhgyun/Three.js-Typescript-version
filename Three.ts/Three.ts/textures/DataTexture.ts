/// <reference path="texture.ts" />
/* 
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    export class DataTexture extends Texture
    {
        constructor(data?: any,
            width?: number,
            height?: number,
            format?: number,
            type?: number,
            mapping?: number,
            wrapS?: number,
            wrapT?: number,
            magFilter?: number,
            minFilter?: number,
            anisotropy?: number,
            encoding?: number)
        {
            super(null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

            this.image = { data: data, width: width, height: height };

            this.magFilter = magFilter !== undefined ? magFilter : NearestFilter;
            this.minFilter = minFilter !== undefined ? minFilter : NearestFilter;

            this.flipY = false;
            this.generateMipmaps = false; 
        };
    }
}
