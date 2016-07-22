/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class CubeTexture extends Texture
    {
        constructor(images?: any,
            mapping?: any,
            wrapS?: number,
            wrapT?: number,
            magFilter?: number,
            minFilter?: number,
            format?: number,
            type?: number,
            anisotropy?: number,
            encoding?: number)
        {

            images = images !== undefined ? images : [];
            mapping = mapping !== undefined ? mapping : CubeReflectionMapping;

            super(images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding);

            this.flipY = false;
        }

        get images()
        {
            return this.image;
        }
        set images(value)
        {
            this.image = value;
        }
    }
} 