/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{ 
    export var AudioContext;
}

Object.defineProperty(THREE, 'AudioContext', { 
    get: (function ()
    { 
        var context; 
        return function get()
        { 
            if (context === undefined)
            { 
                context = new ((window as any).AudioContext || (window as any).webkitAudioContext)(); 
            } 
            return context; 
        }; 
    })() 
});

 