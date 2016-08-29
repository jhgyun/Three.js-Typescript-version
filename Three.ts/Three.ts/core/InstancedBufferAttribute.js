var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var InstancedBufferAttribute = (function (_super) {
        __extends(InstancedBufferAttribute, _super);
        function InstancedBufferAttribute(array, itemSize, meshPerAttribute) {
            if (meshPerAttribute === void 0) { meshPerAttribute = 1; }
            _super.call(this, array, itemSize);
            this.meshPerAttribute = meshPerAttribute;
        }
        InstancedBufferAttribute.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.meshPerAttribute = source.meshPerAttribute;
            return this;
        };
        ;
        return InstancedBufferAttribute;
    }(THREE.BufferAttribute));
    THREE.InstancedBufferAttribute = InstancedBufferAttribute;
})(THREE || (THREE = {}));
