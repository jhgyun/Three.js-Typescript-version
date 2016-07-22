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
