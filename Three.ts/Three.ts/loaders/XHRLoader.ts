/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class XHRLoader
    {
        manager: LoadingManager;
        path: string;
        responseType: string;
        withCredentials: boolean;

        constructor(manager?: LoadingManager)
        {
            this.manager = (manager !== undefined) ? manager : DefaultLoadingManager;

        };



        load(url, onLoad, onProgress, onError)
        {

            if (this.path !== undefined) url = this.path + url;

            var scope = this;

            var cached = Cache.get(url);

            if (cached !== undefined)
            {
                scope.manager.itemStart(url);

                setTimeout(function ()
                { 
                    if (onLoad) onLoad(cached); 
                    scope.manager.itemEnd(url); 
                }, 0);

                return cached;
            }

            var request = new XMLHttpRequest();
            request.overrideMimeType('text/plain');
            request.open('GET', url, true);

            request.addEventListener('load', function (event: any)
            {
                var response = event.target.response;
                Cache.add(url, response);

                if (this.status === 200)
                {

                    if (onLoad) onLoad(response);

                    scope.manager.itemEnd(url);

                }
                else if (this.status === 0)
                {
                    // Some browsers return HTTP Status 0 when using non-http protocol
                    // e.g. 'file://' or 'data://'. Handle as success.

                    console.warn('THREE.XHRLoader: HTTP Status 0 received.');

                    if (onLoad) onLoad(response);

                    scope.manager.itemEnd(url);

                }
                else
                {
                    if (onError) onError(event);
                    scope.manager.itemError(url);
                }

            }, false);

            if (onProgress !== undefined)
            {
                request.addEventListener('progress', function (event)
                {
                    onProgress(event);
                }, false);

            }

            request.addEventListener('error', function (event)
            {
                if (onError) onError(event);

                scope.manager.itemError(url);

            }, false);

            if (this.responseType !== undefined) request.responseType = this.responseType;
            if (this.withCredentials !== undefined) request.withCredentials = this.withCredentials;

            request.send(null);

            scope.manager.itemStart(url);
            return request;
        }

        setPath(value: string)
        {
            this.path = value;
            return this;
        }

        setResponseType(value: string)
        {
            this.responseType = value;
            return this;
        }

        setWithCredentials(value)
        {
            this.withCredentials = value;
            return this;
        }

    }
}