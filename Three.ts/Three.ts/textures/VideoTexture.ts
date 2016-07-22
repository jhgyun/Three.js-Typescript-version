/// <reference path="texture.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class VideoTexture extends Texture
    {
        constructor(
            video?,
            mapping?,
            wrapS?: number,
            wrapT?: number,
            magFilter?: number,
            minFilter?: number,
            format?: number,
            type?: number,
            anisotropy?: number)
        { 
            super(video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);

            this.generateMipmaps = false; 
            var scope = this; 

            function update()
            { 
                requestAnimationFrame(update); 
                if (video.readyState >= video.HAVE_CURRENT_DATA)
                { 
                    scope.needsUpdate = true; 
                } 
            } 
            update(); 
        }; 
    }
}
