/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class CubeTextureLoader
    {
        manager: LoadingManager;
        path;
        crossOrigin;

        constructor(manager?: LoadingManager)
        {
            this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
        }


        load (urls, onLoad, onProgress, onError)
        { 
            var texture = new THREE.CubeTexture(); 
            var loader = new THREE.ImageLoader(this.manager);
            loader.setCrossOrigin(this.crossOrigin);
            loader.setPath(this.path);

            var loaded = 0;

            function loadTexture(i)
            { 
                loader.load(urls[i], function (image)
                { 
                    texture.images[i] = image; 
                    loaded++; 
                    if (loaded === 6)
                    { 
                        texture.needsUpdate = true; 
                        if (onLoad) onLoad(texture); 
                    } 
                }, undefined, onError); 
            }

            for (var i = 0; i < urls.length; ++i)
            { 
                loadTexture(i); 
            } 
            return texture; 
        } 

        setCrossOrigin (value)
        { 
            this.crossOrigin = value;
            return this; 
        } 

        setPath (value)
        { 
            this.path = value;
            return this; 
        }  
    }
}