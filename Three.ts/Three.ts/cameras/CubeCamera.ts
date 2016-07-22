/// <reference path="../core/object3d.ts" />
/* 
 * Camera for rendering cube maps
 *	- renders scene into axis-aligned cube
 *
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    export class CubeCamera extends Object3D
    {
        renderTarget: WebGLRenderTargetCube;
        cameraPX: PerspectiveCamera;
        cameraNX: PerspectiveCamera;
        cameraPY: PerspectiveCamera;
        cameraNY: PerspectiveCamera;
        cameraPZ: PerspectiveCamera;
        cameraNZ: PerspectiveCamera;
        constructor(near, far, cubeResolution)
        {
            super();

            this.type = 'CubeCamera'; 
            var fov = 90, aspect = 1;

            var cameraPX = this.cameraPX = new PerspectiveCamera(fov, aspect, near, far);
            cameraPX.up.set(0, - 1, 0);
            cameraPX.lookAt(new Vector3(1, 0, 0));
            this.add(cameraPX);

            var cameraNX = this.cameraNX = new PerspectiveCamera(fov, aspect, near, far);
            cameraNX.up.set(0, - 1, 0);
            cameraNX.lookAt(new Vector3(- 1, 0, 0));
            this.add(cameraNX);

            var cameraPY = this.cameraPY = new PerspectiveCamera(fov, aspect, near, far);
            cameraPY.up.set(0, 0, 1);
            cameraPY.lookAt(new Vector3(0, 1, 0));
            this.add(cameraPY);

            var cameraNY = this.cameraNY = new PerspectiveCamera(fov, aspect, near, far);
            cameraNY.up.set(0, 0, - 1);
            cameraNY.lookAt(new Vector3(0, - 1, 0));
            this.add(cameraNY);

            var cameraPZ = this.cameraPZ = new PerspectiveCamera(fov, aspect, near, far);
            cameraPZ.up.set(0, - 1, 0);
            cameraPZ.lookAt(new Vector3(0, 0, 1));
            this.add(cameraPZ);

            var cameraNZ = this.cameraPZ = new PerspectiveCamera(fov, aspect, near, far);
            cameraNZ.up.set(0, - 1, 0);
            cameraNZ.lookAt(new Vector3(0, 0, - 1));
            this.add(cameraNZ);

            var options = { format: RGBFormat, magFilter: LinearFilter, minFilter: LinearFilter };

            this.renderTarget = new WebGLRenderTargetCube(cubeResolution, cubeResolution, options);
            
        };
        updateCubeMap(renderer, scene)
        {
            if (this.parent === null) this.updateMatrixWorld();

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
    }
}
