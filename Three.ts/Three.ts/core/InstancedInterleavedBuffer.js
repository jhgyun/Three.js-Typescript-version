/// <reference path="interleavedbuffer.ts" />
/*
 * @author benaadams / https://twitter.com/ben_a_adams
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var InstancedInterleavedBuffer = (function (_super) {
        __extends(InstancedInterleavedBuffer, _super);
        function InstancedInterleavedBuffer(array, stride, meshPerAttribute) {
            _super.call(this, array, stride);
            this.meshPerAttribute = meshPerAttribute || 1;
        }
        ;
        InstancedInterleavedBuffer.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.meshPerAttribute = source.meshPerAttribute;
            return this;
        };
        ;
        return InstancedInterleavedBuffer;
    }(THREE.InterleavedBuffer));
    THREE.InstancedInterleavedBuffer = InstancedInterleavedBuffer;
})(THREE || (THREE = {}));
