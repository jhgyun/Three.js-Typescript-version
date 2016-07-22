/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class LoadingManager
    {
        onStart: (url?, itemsLoaded?: number, itemsTotal?: number) => any;
        onLoad: () => any;
        onProgress: (url?, itemsLoaded?: number, itemsTotal?: number) => any;
        onError: (url?) => any;

        isLoading = false;
        itemsLoaded = 0;
        itemsTotal = 0;

        constructor(
            onLoad?: () => any,
            onProgress?: (url?, itemsLoaded?: number, itemsTotal?: number) => any,
            onError?: (url?) => any)
        {
            var scope = this; 

            this.onStart = undefined;
            this.onLoad = onLoad;
            this.onProgress = onProgress;
            this.onError = onError;
        }

        itemStart(url)
        {
            this.itemsTotal++;

            if (this.isLoading === false)
            {
                if (this.onStart !== undefined)
                {
                    this.onStart(url, this.itemsLoaded, this.itemsTotal);
                }
            }

            this.isLoading = true;
        }
        itemEnd(url)
        {
            this.itemsLoaded++;

            if (this.onProgress !== undefined)
            {
                this.onProgress(url, this.itemsLoaded, this.itemsTotal);
            }

            if (this.itemsLoaded === this.itemsTotal)
            {
                this.isLoading = false;

                if (this.onLoad !== undefined)
                {
                    this.onLoad();
                }
            }

        }

        itemError(url)
        {
            if (this.onError !== undefined)
            {
                this.onError(url);
            }
        };
    } 

    export var DefaultLoadingManager = new LoadingManager();
}