/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class ImageLoader
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
            var scope = this;
            var image = document.createElementNS('http://www.w3.org/1999/xhtml', 'img') as HTMLImageElement;
            image.onload = function ()
            {
                URL.revokeObjectURL(image.src);
                if (onLoad) onLoad(image);
                scope.manager.itemEnd(url);
            };

            if (url.indexOf('data:') === 0)
            {
                image.src = url;
            }
            else
            {
                var loader = new THREE.XHRLoader();
                loader.setPath(this.path);
                loader.setResponseType('blob');
                loader.load(url, function (blob)
                {
                    image.src = URL.createObjectURL(blob);
                }, onProgress, onError);

            }

            scope.manager.itemStart(url);
            return image;

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