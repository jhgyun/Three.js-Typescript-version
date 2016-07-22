/* 
 * @author bhouston / http://clara.io/
 */
namespace THREE
{
    export class AnimationLoader
    {
        manager: LoadingManager;
        constructor(manager?: LoadingManager)
        {
            this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
        };
         

        load (url, onLoad, onProgress, onError)
        { 
            var scope = this;

            var loader = new THREE.XHRLoader(scope.manager);
            loader.load(url, function (text)
            { 
                onLoad(scope.parse(JSON.parse(text))); 
            }, onProgress, onError);

        } 

        parse (json, onLoad?)
        { 
            var animations = [];

            for (var i = 0; i < json.length; i++)
            { 
                var clip = THREE.AnimationClip.parse(json[i]); 
                animations.push(clip); 
            }

            if (onload !== undefined)
                onLoad(animations); 
        } 
    }
}