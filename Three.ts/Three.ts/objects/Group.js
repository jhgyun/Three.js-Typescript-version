/// <reference path="../core/object3d.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Group = (function (_super) {
        __extends(Group, _super);
        function Group() {
            _super.call(this);
            this.type = 'Group';
        }
        ;
        return Group;
    }(THREE.Object3D));
    THREE.Group = Group;
})(THREE || (THREE = {}));
