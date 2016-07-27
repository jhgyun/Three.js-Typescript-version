/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class TextureLoader
    {
        manager: LoadingManager;
        path;
        crossOrigin;

        constructor(manager?: LoadingManager)
        {
            this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;
        };


        load(url, onLoad?, onProgress?, onError?)
        { 
            var texture = new Texture(); 
            var loader = new ImageLoader(this.manager);
            loader.setCrossOrigin(this.crossOrigin);
            loader.setPath(this.path);
            loader.load(url, function (image)
            { 
                // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
                var isJPEG = url.search(/\.(jpg|jpeg)$/) > 0 || url.search(/^data\:image\/jpeg/) === 0;

                texture.format = isJPEG ? THREE.RGBFormat : THREE.RGBAFormat;
                texture.image = image;
                texture.needsUpdate = true;

                if (onLoad !== undefined)
                { 
                    onLoad(texture); 
                }
            }, onProgress, onError);

            return texture;
        }

        setCrossOrigin(value)
        {
            this.crossOrigin = value;
            return this;
        }

        setPath(value)
        {
            this.path = value;
            return this;
        }
    }
}
