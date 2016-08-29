var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera() {
            _super.call(this);
            this.matrixWorldInverse = new THREE.Matrix4();
            this.projectionMatrix = new THREE.Matrix4();
            this.type = 'Camera';
        }
        ;
        Camera.prototype.getWorldDirection = function (optionalTarget) {
            var quaternion = Camera[".getWorldDirection.quaternion."] || (Camera[".getWorldDirection.quaternion."] = new THREE.Quaternion());
            var result = optionalTarget || new THREE.Vector3();
            this.getWorldQuaternion(quaternion);
            return result.set(0, 0, -1).applyQuaternion(quaternion);
        };
        Camera.prototype.lookAt = function (vector) {
            var m1 = Camera[".lookAt.m1."] || (Camera[".lookAt.m1."] = new THREE.Matrix4());
            m1.lookAt(this.position, vector, this.up);
            this.quaternion.setFromRotationMatrix(m1);
        };
        Camera.prototype.clone = function () {
            return new this.constructor().copy(this);
        };
        ;
        Camera.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.matrixWorldInverse.copy(source.matrixWorldInverse);
            this.projectionMatrix.copy(source.projectionMatrix);
            return this;
        };
        ;
        Camera.prototype.updateProjectionMatrix = function () { };
        ;
        return Camera;
    }(THREE.Object3D));
    THREE.Camera = Camera;
})(THREE || (THREE = {}));
