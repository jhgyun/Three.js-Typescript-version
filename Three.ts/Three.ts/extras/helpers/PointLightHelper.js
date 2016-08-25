/// <reference path="../../objects/mesh.ts" />
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
    var PointLightHelper = (function (_super) {
        __extends(PointLightHelper, _super);
        function PointLightHelper(light, sphereSize) {
            _super.call(this);
            this.light = light;
            this.light.updateMatrixWorld();
            var geometry = new THREE.SphereBufferGeometry(sphereSize, 4, 2);
            var material = new THREE.MeshBasicMaterial({ wireframe: true, fog: false });
            material.color.copy(this.light.color).multiplyScalar(this.light.intensity);
            this.geometry = geometry;
            this.material = material;
            this.matrix = this.light.matrixWorld;
            this.matrixAutoUpdate = false;
        }
        ;
        PointLightHelper.prototype.dispose = function () {
            this.geometry.dispose();
            this.material.dispose();
        };
        ;
        PointLightHelper.prototype.update = function () {
            this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity);
        };
        return PointLightHelper;
    }(THREE.Mesh));
    THREE.PointLightHelper = PointLightHelper;
})(THREE || (THREE = {}));
