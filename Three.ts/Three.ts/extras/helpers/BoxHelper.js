var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var BoxHelper = (function (_super) {
        __extends(BoxHelper, _super);
        function BoxHelper(object, color) {
            if (color === void 0) { color = 0xffff00; }
            _super.call(this);
            var indices = new Uint16Array([0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7]);
            var positions = new Float32Array(8 * 3);
            var geometry = new THREE.BufferGeometry();
            geometry.setIndex(new THREE.BufferAttribute(indices, 1));
            geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.geometry = geometry;
            this.material = new THREE.LineBasicMaterial({ color: color });
            if (object !== undefined) {
                this.update(object);
            }
        }
        ;
        BoxHelper.prototype.update = function (object) {
            var box = BoxHelper["update.box"]
                || (BoxHelper["update.box"] = new THREE.Box3());
            if (object instanceof THREE.Box3) {
                box.copy(object);
            }
            else {
                box.setFromObject(object);
            }
            if (box.isEmpty())
                return;
            var min = box.min;
            var max = box.max;
            var position = this.geometry.attributes.position;
            var array = position.array;
            array[0] = max.x;
            array[1] = max.y;
            array[2] = max.z;
            array[3] = min.x;
            array[4] = max.y;
            array[5] = max.z;
            array[6] = min.x;
            array[7] = min.y;
            array[8] = max.z;
            array[9] = max.x;
            array[10] = min.y;
            array[11] = max.z;
            array[12] = max.x;
            array[13] = max.y;
            array[14] = min.z;
            array[15] = min.x;
            array[16] = max.y;
            array[17] = min.z;
            array[18] = min.x;
            array[19] = min.y;
            array[20] = min.z;
            array[21] = max.x;
            array[22] = min.y;
            array[23] = min.z;
            position.needsUpdate = true;
            this.geometry.computeBoundingSphere();
        };
        return BoxHelper;
    }(THREE.LineSegments));
    THREE.BoxHelper = BoxHelper;
})(THREE || (THREE = {}));
