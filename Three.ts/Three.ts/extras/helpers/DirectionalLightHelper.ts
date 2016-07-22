/// <reference path="../../core/object3d.ts" />
/* 
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
 */

namespace THREE
{
    export class DirectionalLightHelper extends Object3D
    {
        light: DirectionalLight;

        constructor(light: DirectionalLight, size?: number)
        {
            super(); 

            this.light = light;
            this.light.updateMatrixWorld();

            this.matrix = light.matrixWorld;
            this.matrixAutoUpdate = false;

            if (size === undefined) size = 1;

            var geometry = new BufferGeometry();
            geometry.addAttribute('position', new Float32Attribute([
                - size, size, 0,
                size, size, 0,
                size, - size, 0,
                - size, - size, 0,
                - size, size, 0
            ], 3));

            var material = new LineBasicMaterial({ fog: false });

            this.add(new Line(geometry, material));

            geometry = new BufferGeometry();
            geometry.addAttribute('position', new Float32Attribute([0, 0, 0, 0, 0, 1], 3));

            this.add(new Line(geometry, material)); 
            this.update(); 
        };
         
        dispose()
        {
            var lightPlane = this.children[0];
            var targetLine = this.children[1];

            lightPlane.geometry.dispose();
            lightPlane.material.dispose();
            targetLine.geometry.dispose();
            targetLine.material.dispose(); 
        };

        update()
        {
            var v1: Vector3 = DirectionalLightHelper["update_v1"];
            var v2: Vector3 = DirectionalLightHelper["update_v2"];
            var v3: Vector3 = DirectionalLightHelper["update_v3"];

            if (v1 === undefined)
            {
                v1 = DirectionalLightHelper["update_v1"] = new Vector3();
                v2 = DirectionalLightHelper["update_v2"] = new Vector3();
                v3 = DirectionalLightHelper["update_v3"] = new Vector3();
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
        }
    }
}