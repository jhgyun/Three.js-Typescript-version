var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var TextGeometry = (function (_super) {
        __extends(TextGeometry, _super);
        function TextGeometry(text, parameters) {
            parameters = parameters || {};
            var font = parameters.font;
            if (font instanceof THREE.Font === false) {
                console.error('THREE.TextGeometry: font parameter is not an instance of THREE.Font.');
                throw new Error('THREE.TextGeometry: font parameter is not an instance of THREE.Font.');
            }
            var shapes = font.generateShapes(text, parameters.size, parameters.curveSegments);
            parameters.amount = parameters.height !== undefined ? parameters.height : 50;
            if (parameters.bevelThickness === undefined)
                parameters.bevelThickness = 10;
            if (parameters.bevelSize === undefined)
                parameters.bevelSize = 8;
            if (parameters.bevelEnabled === undefined)
                parameters.bevelEnabled = false;
            _super.call(this, shapes, parameters);
            this.type = 'TextGeometry';
        }
        ;
        return TextGeometry;
    }(THREE.ExtrudeGeometry));
    THREE.TextGeometry = TextGeometry;
})(THREE || (THREE = {}));
