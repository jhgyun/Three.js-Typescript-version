/// <reference path="perspectivecamera.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class StereoCamera  
    {
        type: string;
        aspect: number;
        cameraL: PerspectiveCamera;
        cameraR: PerspectiveCamera;

        constructor()
        { 
            this.type = 'StereoCamera'; 
            this.aspect = 1; 
            this.cameraL = new PerspectiveCamera();
            this.cameraL.layers.enable(1);
            this.cameraL.matrixAutoUpdate = false;

            this.cameraR = new PerspectiveCamera();
            this.cameraR.layers.enable(2);
            this.cameraR.matrixAutoUpdate = false;

        };

        private static __update_static = {
            focus: NaN,
            fov: NaN,
            aspect: NaN,
            near: NaN,
            far: NaN, 
            eyeRight: new Matrix4(),
            eyeLeft: new Matrix4()
        }

        update(camera: PerspectiveCamera)
        {
            var _static = StereoCamera.__update_static;
              
            var needsUpdate = _static.focus !== camera.focus
                || _static.fov !== camera.fov
                ||  _static.aspect !== camera.aspect * this.aspect
                || _static.near !== camera.near
                || _static.far !== camera.far;

            var eyeLeft = _static.eyeLeft;
            var eyeRight = _static.eyeRight;

            if (needsUpdate)
            {
                var focus = _static.focus = camera.focus;
                var fov = _static.fov = camera.fov;
                var aspect = _static.aspect = camera.aspect * this.aspect;
                var near = _static.near = camera.near;
                var far = _static.far = camera.far;
                 
                // Off-axis stereoscopic effect based on
                // http://paulbourke.net/stereographics/stereorender/

                var projectionMatrix = camera.projectionMatrix.clone();
                var eyeSep = 0.064 / 2;
                var eyeSepOnProjection = eyeSep * near / focus;
                var ymax = near * Math.tan(Math.DEG2RAD * fov * 0.5);
                var xmin, xmax;

                // translate xOffset

                eyeLeft.elements[12] = - eyeSep;
                eyeRight.elements[12] = eyeSep;

                // for left eye

                xmin = - ymax * aspect + eyeSepOnProjection;
                xmax = ymax * aspect + eyeSepOnProjection;

                projectionMatrix.elements[0] = 2 * near / (xmax - xmin);
                projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin);

                this.cameraL.projectionMatrix.copy(projectionMatrix);

                // for right eye

                xmin = - ymax * aspect - eyeSepOnProjection;
                xmax = ymax * aspect - eyeSepOnProjection;

                projectionMatrix.elements[0] = 2 * near / (xmax - xmin);
                projectionMatrix.elements[8] = (xmax + xmin) / (xmax - xmin); 
                this.cameraR.projectionMatrix.copy(projectionMatrix); 
            }

            this.cameraL.matrixWorld.copy(camera.matrixWorld).multiply(eyeLeft);
            this.cameraR.matrixWorld.copy(camera.matrixWorld).multiply(eyeRight); 
        }


    }
}