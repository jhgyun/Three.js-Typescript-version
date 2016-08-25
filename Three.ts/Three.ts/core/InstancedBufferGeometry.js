/// <reference path="buffergeometry.ts" />
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
    var InstancedBufferGeometry = (function (_super) {
        __extends(InstancedBufferGeometry, _super);
        function InstancedBufferGeometry() {
            _super.call(this);
            this.type = 'InstancedBufferGeometry';
        }
        InstancedBufferGeometry.prototype.addGroup = function (start, count, instances) {
            this.groups.push({
                start: start,
                count: count,
                instances: instances
            });
        };
        InstancedBufferGeometry.prototype.copy = function (source) {
            var index = source.index;
            if (index !== null) {
                this.setIndex(index.clone());
            }
            var attributes = source.attributes;
            for (var name in attributes) {
                var attribute = attributes[name];
                this.addAttribute(name, attribute.clone());
            }
            var groups = source.groups;
            for (var i = 0, l = groups.length; i < l; i++) {
                var group = groups[i];
                this.addGroup(group.start, group.count, group.instances);
            }
            return this;
        };
        ;
        return InstancedBufferGeometry;
    }(THREE.BufferGeometry));
    THREE.InstancedBufferGeometry = InstancedBufferGeometry;
})(THREE || (THREE = {}));
