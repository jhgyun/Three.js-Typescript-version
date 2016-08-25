/// <reference path="../../core/object3d.ts" />
/*
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var SpotLightHelper = (function (_super) {
        __extends(SpotLightHelper, _super);
        function SpotLightHelper(light) {
            _super.call(this);
            this.light = light;
            this.light.updateMatrixWorld();
            this.matrix = light.matrixWorld;
            this.matrixAutoUpdate = false;
            var geometry = new THREE.BufferGeometry();
            var positions = [
                0, 0, 0, 0, 0, 1,
                0, 0, 0, 1, 0, 1,
                0, 0, 0, -1, 0, 1,
                0, 0, 0, 0, 1, 1,
                0, 0, 0, 0, -1, 1
            ];
            for (var i = 0, j = 1, l = 32; i < l; i++, j++) {
                var p1 = (i / l) * THREE.Math.PI * 2;
                var p2 = (j / l) * THREE.Math.PI * 2;
                positions.push(THREE.Math.cos(p1), THREE.Math.sin(p1), 1, THREE.Math.cos(p2), THREE.Math.sin(p2), 1);
            }
            geometry.addAttribute('position', new THREE.Float32Attribute(positions, 3));
            var material = new THREE.LineBasicMaterial({ fog: false });
            this.cone = new THREE.LineSegments(geometry, material);
            this.add(this.cone);
            this.update();
        }
        SpotLightHelper.prototype.dispose = function () {
            this.cone.geometry.dispose();
            this.cone.material.dispose();
        };
        SpotLightHelper.prototype.update = function () {
            var vector = SpotLightHelper["update_vector"] || (SpotLightHelper["update_vector"] = new THREE.Vector3());
            var vector2 = SpotLightHelper["update_vector2"] || (SpotLightHelper["update_vector2"] = new THREE.Vector3());
            var coneLength = this.light.distance ? this.light.distance : 1000;
            var coneWidth = coneLength * THREE.Math.tan(this.light.angle);
            this.cone.scale.set(coneWidth, coneWidth, coneLength);
            vector.setFromMatrixPosition(this.light.matrixWorld);
            vector2.setFromMatrixPosition(this.light.target.matrixWorld);
            this.cone.lookAt(vector2.sub(vector));
            this.cone.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);
        };
        return SpotLightHelper;
    }(THREE.Object3D));
    THREE.SpotLightHelper = SpotLightHelper;
})(THREE || (THREE = {}));
