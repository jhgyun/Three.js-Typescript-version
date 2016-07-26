/// <reference path="../core/object3d.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author WestLangley / http://github.com/WestLangley
*/

namespace THREE
{
    export class Camera extends Object3D
    {
        matrixWorldInverse = new Matrix4();
        projectionMatrix = new Matrix4();
        far: number;

        constructor()
        {
            super();
            this.type = 'Camera';
        };
         
        getWorldDirection(optionalTarget?: Vector3): Vector3
        {
            var quaternion: Quaternion = Camera[".getWorldDirection.quaternion."] || (Camera[".getWorldDirection.quaternion."] = new Quaternion());

            var result = optionalTarget || new Vector3();

            this.getWorldQuaternion(quaternion);

            return result.set(0, 0, - 1).applyQuaternion(quaternion);
        }
         
        lookAt(vector: Vector3)
        {
            // This routine does not support cameras with rotated and/or translated parent(s)  
            var m1: Matrix4 = Camera[".lookAt.m1."] || (Camera[".lookAt.m1."] = new Matrix4());

            m1.lookAt(this.position, vector, this.up);
            this.quaternion.setFromRotationMatrix(m1);
        }

        clone(): this
        {
            return new (this.constructor as any)().copy(this);
        }; 
        copy(source: Camera): this
        {
            super.copy(source);

            this.matrixWorldInverse.copy(source.matrixWorldInverse);
            this.projectionMatrix.copy(source.projectionMatrix);
            return this;
        };
        updateProjectionMatrix() { };
    }
}