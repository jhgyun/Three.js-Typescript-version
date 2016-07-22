/// <reference path="lightshadow.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class SpotLightShadow extends LightShadow
    {
        constructor()
        {
            super(new PerspectiveCamera(50, 1, 0.5, 500));
        }
        update(light: SpotLight)
        {

            var fov = Math.RAD2DEG * 2 * light.angle;
            var aspect = this.mapSize.width / this.mapSize.height;
            var far = light.distance || 500;

            var camera = this.camera as PerspectiveCamera;

            if (fov !== camera.fov || aspect !== camera.aspect || far !== camera.far)
            {
                camera.fov = fov;
                camera.aspect = aspect;
                camera.far = far;
                camera.updateProjectionMatrix();
            }
        }

    }
}