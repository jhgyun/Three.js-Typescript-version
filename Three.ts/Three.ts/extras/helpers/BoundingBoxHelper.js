/// <reference path="../../objects/mesh.ts" />
/*
 * @author WestLangley / http://github.com/WestLangley
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// a helper to show the world-axis-aligned bounding box for an object
var THREE;
(function (THREE) {
    var BoundingBoxHelper = (function (_super) {
        __extends(BoundingBoxHelper, _super);
        function BoundingBoxHelper(object, color) {
            if (color === void 0) { color = 0x888888; }
            _super.call(this, new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: color, wireframe: true }));
            this.box = new THREE.Box3();
            this.object = object;
            this.box = new THREE.Box3();
        }
        ;
        BoundingBoxHelper.prototype.update = function () {
            this.box.setFromObject(this.object);
            this.box.size(this.scale);
            this.box.center(this.position);
        };
        ;
        return BoundingBoxHelper;
    }(THREE.Mesh));
    THREE.BoundingBoxHelper = BoundingBoxHelper;
})(THREE || (THREE = {}));
