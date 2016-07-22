/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class FontLoader
    {
        manager: LoadingManager;
        constructor(manager?: LoadingManager)
        {
            this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;

        };

        load(url, onLoad, onProgress, onError)
        {
            var scope = this;

            var loader = new THREE.XHRLoader(this.manager);
            loader.load(url, function (text)
            {
                var json;

                try
                {
                    json = JSON.parse(text);
                }
                catch (e)
                {
                    console.warn('THREE.FontLoader: typeface.js support is being deprecated. Use typeface.json instead.');
                    json = JSON.parse(text.substring(65, text.length - 2));
                }

                var font = scope.parse(json);
                if (onLoad) onLoad(font);

            }, onProgress, onError);
        }

        parse(json)
        {
            return new THREE.Font(json);
        }
    }
}