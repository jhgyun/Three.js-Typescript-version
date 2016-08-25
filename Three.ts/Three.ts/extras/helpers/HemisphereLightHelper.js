/// <reference path="../../core/object3d.ts" />
/*
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var HemisphereLightHelper = (function (_super) {
        __extends(HemisphereLightHelper, _super);
        function HemisphereLightHelper(light, sphereSize) {
            _super.call(this);
            this.light = light;
            this.light.updateMatrixWorld();
            this.matrix = light.matrixWorld;
            this.matrixAutoUpdate = false;
            this.colors = [new THREE.Color(), new THREE.Color()];
            var geometry = new THREE.SphereGeometry(sphereSize, 4, 2);
            geometry.rotateX(-THREE.Math.PI / 2);
            for (var i = 0, il = 8; i < il; i++) {
                geometry.faces[i].color = this.colors[i < 4 ? 0 : 1];
            }
            var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.FaceColors, wireframe: true });
            this.lightSphere = new THREE.Mesh(geometry, material);
            this.add(this.lightSphere);
            this.update();
        }
        ;
        HemisphereLightHelper.prototype.dispose = function () {
            this.lightSphere.geometry.dispose();
            this.lightSphere.material.dispose();
        };
        ;
        HemisphereLightHelper.prototype.update = function () {
            var vector = HemisphereLightHelper["upeate_v1"] ||
                (HemisphereLightHelper["upeate_v1"] = new THREE.Vector3());
            this.colors[0].copy(this.light.color).multiplyScalar(this.light.intensity);
            this.colors[1].copy(this.light.groundColor).multiplyScalar(this.light.intensity);
            this.lightSphere.lookAt(vector.setFromMatrixPosition(this.light.matrixWorld).negate());
            this.lightSphere.geometry.colorsNeedUpdate = true;
        };
        return HemisphereLightHelper;
    }(THREE.Object3D));
    THREE.HemisphereLightHelper = HemisphereLightHelper;
})(THREE || (THREE = {}));
