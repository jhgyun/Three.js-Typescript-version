var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var ImmediateRenderObject = (function (_super) {
        __extends(ImmediateRenderObject, _super);
        function ImmediateRenderObject(material) {
            _super.call(this);
            this.material = material;
            this.render = function (renderCallback) { };
        }
        ;
        return ImmediateRenderObject;
    }(THREE.Object3D));
    THREE.ImmediateRenderObject = ImmediateRenderObject;
})(THREE || (THREE = {}));
