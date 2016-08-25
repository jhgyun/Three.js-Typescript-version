/*
 * @author mrdoob / http://mrdoob.com/
 */
var THREE;
(function (THREE) {
})(THREE || (THREE = {}));
Object.defineProperty(THREE, 'AudioContext', {
    get: (function () {
        var context;
        return function get() {
            if (context === undefined) {
                context = new (window.AudioContext || window.webkitAudioContext)();
            }
            return context;
        };
    })()
});
