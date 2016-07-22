/* 
* @author fordacious / fordacious.github.io
*/

namespace THREE
{
    export class WebGLProperties
    {
        private properties = {};
        constructor()
        {    
        };
        get(object: { uuid: string })
        {
            var uuid = object.uuid;
            var map = this.properties[uuid];

            if (map === undefined)
            {
                map = {};
                this.properties[uuid] = map;
            }

            return map;
        };
        delete(object: { uuid: string })
        {
            delete this.properties[object.uuid];
        };
        clear()
        { 
            this.properties = {}; 
        };
    }
}