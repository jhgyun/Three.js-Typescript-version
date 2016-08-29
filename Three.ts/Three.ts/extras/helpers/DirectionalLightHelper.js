var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var DirectionalLightHelper = (function (_super) {
        __extends(DirectionalLightHelper, _super);
        function DirectionalLightHelper(light, size) {
            _super.call(this);
            this.light = light;
            this.light.updateMatrixWorld();
            this.matrix = light.matrixWorld;
            this.matrixAutoUpdate = false;
            if (size === undefined)
                size = 1;
            var geometry = new THREE.BufferGeometry();
            geometry.addAttribute('position', new THREE.Float32Attribute([
                -size, size, 0,
                size, size, 0,
                size, -size, 0,
                -size, -size, 0,
                -size, size, 0
            ], 3));
            var material = new THREE.LineBasicMaterial({ fog: false });
            this.add(new THREE.Line(geometry, material));
            geometry = new THREE.BufferGeometry();
            geometry.addAttribute('position', new THREE.Float32Attribute([0, 0, 0, 0, 0, 1], 3));
            this.add(new THREE.Line(geometry, material));
            this.update();
        }
        ;
        DirectionalLightHelper.prototype.dispose = function () {
            var lightPlane = this.children[0];
            var targetLine = this.children[1];
            lightPlane.geometry.dispose();
            lightPlane.material.dispose();
            targetLine.geometry.dispose();
            targetLine.material.dispose();
        };
        ;
        DirectionalLightHelper.prototype.update = function () {
            var v1 = DirectionalLightHelper["update_v1"];
            var v2 = DirectionalLightHelper["update_v2"];
            var v3 = DirectionalLightHelper["update_v3"];
            if (v1 === undefined) {
                v1 = DirectionalLightHelper["update_v1"] = new THREE.Vector3();
                v2 = DirectionalLightHelper["update_v2"] = new THREE.Vector3();
                v3 = DirectionalLightHelper["update_v3"] = new THREE.Vector3();
            }
            v1.setFromMatrixPosition(this.light.matrixWorld);
            v2.setFromMatrixPosition(this.light.target.matrixWorld);
            v3.subVectors(v2, v1);
            var lightPlane = this.children[0];
            var targetLine = this.children[1];
            lightPlane.lookAt(v3);
            lightPlane.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);
            targetLine.lookAt(v3);
            targetLine.scale.z = v3.length();
        };
        return DirectionalLightHelper;
    }(THREE.Object3D));
    THREE.DirectionalLightHelper = DirectionalLightHelper;
})(THREE || (THREE = {}));
