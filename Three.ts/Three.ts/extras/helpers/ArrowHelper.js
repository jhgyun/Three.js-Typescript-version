var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var ArrowHelper = (function (_super) {
        __extends(ArrowHelper, _super);
        function ArrowHelper(dir, origin, length, color, headLength, headWidth) {
            _super.call(this);
            var lineGeometry = ArrowHelper.lineGeometry;
            if (lineGeometry === undefined) {
                lineGeometry = ArrowHelper.lineGeometry = new THREE.BufferGeometry();
                lineGeometry.addAttribute('position', new THREE.Float32Attribute([0, 0, 0, 0, 1, 0], 3));
            }
            var coneGeometry = ArrowHelper.coneGeometry;
            if (coneGeometry === undefined) {
                coneGeometry = ArrowHelper.coneGeometry = new THREE.CylinderBufferGeometry(0, 0.5, 1, 5, 1);
                coneGeometry.translate(0, -0.5, 0);
            }
            if (color === undefined)
                color = 0xffff00;
            if (length === undefined)
                length = 1;
            if (headLength === undefined)
                headLength = 0.2 * length;
            if (headWidth === undefined)
                headWidth = 0.2 * headLength;
            this.position.copy(origin);
            this.line = new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: color }));
            this.line.matrixAutoUpdate = false;
            this.add(this.line);
            this.cone = new THREE.Mesh(coneGeometry, new THREE.MeshBasicMaterial({ color: color }));
            this.cone.matrixAutoUpdate = false;
            this.add(this.cone);
            this.setDirection(dir);
            this.setLength(length, headLength, headWidth);
        }
        ArrowHelper.prototype.setDirection = function (dir) {
            var axis = ArrowHelper["setDirection_axis"]
                || (ArrowHelper["setDirection_axis"] = new THREE.Vector3());
            var radians;
            if (dir.y > 0.99999) {
                this.quaternion.set(0, 0, 0, 1);
            }
            else if (dir.y < -0.99999) {
                this.quaternion.set(1, 0, 0, 0);
            }
            else {
                axis.set(dir.z, 0, -dir.x).normalize();
                radians = THREE.Math.acos(dir.y);
                this.quaternion.setFromAxisAngle(axis, radians);
            }
        };
        ArrowHelper.prototype.setLength = function (length, headLength, headWidth) {
            if (headLength === undefined)
                headLength = 0.2 * length;
            if (headWidth === undefined)
                headWidth = 0.2 * headLength;
            this.line.scale.set(1, THREE.Math.max(0, length - headLength), 1);
            this.line.updateMatrix();
            this.cone.scale.set(headWidth, headLength, headWidth);
            this.cone.position.y = length;
            this.cone.updateMatrix();
        };
        ArrowHelper.prototype.setColor = function (color) {
            this.line.material.color.copy(color);
            this.cone.material.color.copy(color);
        };
        return ArrowHelper;
    }(THREE.Object3D));
    THREE.ArrowHelper = ArrowHelper;
})(THREE || (THREE = {}));
