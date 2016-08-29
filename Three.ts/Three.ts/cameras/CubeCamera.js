var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var CubeCamera = (function (_super) {
        __extends(CubeCamera, _super);
        function CubeCamera(near, far, cubeResolution) {
            _super.call(this);
            this.type = 'CubeCamera';
            var fov = 90, aspect = 1;
            var cameraPX = this.cameraPX = new THREE.PerspectiveCamera(fov, aspect, near, far);
            cameraPX.up.set(0, -1, 0);
            cameraPX.lookAt(new THREE.Vector3(1, 0, 0));
            this.add(cameraPX);
            var cameraNX = this.cameraNX = new THREE.PerspectiveCamera(fov, aspect, near, far);
            cameraNX.up.set(0, -1, 0);
            cameraNX.lookAt(new THREE.Vector3(-1, 0, 0));
            this.add(cameraNX);
            var cameraPY = this.cameraPY = new THREE.PerspectiveCamera(fov, aspect, near, far);
            cameraPY.up.set(0, 0, 1);
            cameraPY.lookAt(new THREE.Vector3(0, 1, 0));
            this.add(cameraPY);
            var cameraNY = this.cameraNY = new THREE.PerspectiveCamera(fov, aspect, near, far);
            cameraNY.up.set(0, 0, -1);
            cameraNY.lookAt(new THREE.Vector3(0, -1, 0));
            this.add(cameraNY);
            var cameraPZ = this.cameraPZ = new THREE.PerspectiveCamera(fov, aspect, near, far);
            cameraPZ.up.set(0, -1, 0);
            cameraPZ.lookAt(new THREE.Vector3(0, 0, 1));
            this.add(cameraPZ);
            var cameraNZ = this.cameraPZ = new THREE.PerspectiveCamera(fov, aspect, near, far);
            cameraNZ.up.set(0, -1, 0);
            cameraNZ.lookAt(new THREE.Vector3(0, 0, -1));
            this.add(cameraNZ);
            var options = { format: THREE.RGBFormat, magFilter: THREE.LinearFilter, minFilter: THREE.LinearFilter };
            this.renderTarget = new THREE.WebGLRenderTargetCube(cubeResolution, cubeResolution, options);
        }
        ;
        CubeCamera.prototype.updateCubeMap = function (renderer, scene) {
            if (this.parent === null)
                this.updateMatrixWorld();
            var renderTarget = this.renderTarget;
            var generateMipmaps = renderTarget.texture.generateMipmaps;
            renderTarget.texture.generateMipmaps = false;
            renderTarget.activeCubeFace = 0;
            renderer.render(scene, this.cameraPX, renderTarget);
            renderTarget.activeCubeFace = 1;
            renderer.render(scene, this.cameraNX, renderTarget);
            renderTarget.activeCubeFace = 2;
            renderer.render(scene, this.cameraPY, renderTarget);
            renderTarget.activeCubeFace = 3;
            renderer.render(scene, this.cameraNY, renderTarget);
            renderTarget.activeCubeFace = 4;
            renderer.render(scene, this.cameraPZ, renderTarget);
            renderTarget.texture.generateMipmaps = generateMipmaps;
            renderTarget.activeCubeFace = 5;
            renderer.render(scene, this.cameraNZ, renderTarget);
            renderer.setRenderTarget(null);
        };
        ;
        return CubeCamera;
    }(THREE.Object3D));
    THREE.CubeCamera = CubeCamera;
})(THREE || (THREE = {}));
