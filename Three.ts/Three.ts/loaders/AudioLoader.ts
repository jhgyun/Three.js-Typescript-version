/* 
 * @author Reece Aaron Lecrivain / http://reecenotes.com/
 */

namespace THREE
{
    export class AudioLoader
    {
        manager: LoadingManager;
        constructor(manager?: LoadingManager)
        {
            this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
        };
         
        load(url, onLoad, onProgress, onError)
        {
            var loader = new THREE.XHRLoader(this.manager);
            loader.setResponseType('arraybuffer');
            loader.load(url, function (buffer)
            {
                var context = THREE.AudioContext;

                context.decodeAudioData(buffer, function (audioBuffer)
                {
                    onLoad(audioBuffer);
                });

            }, onProgress, onError);
        }
    }
}