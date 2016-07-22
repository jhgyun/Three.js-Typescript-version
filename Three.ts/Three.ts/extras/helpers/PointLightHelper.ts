/// <reference path="../../objects/mesh.ts" />
/* 
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class PointLightHelper extends Mesh
    {
        light: PointLight;

        constructor(light: PointLight, sphereSize)
        {
            super();

            this.light = light;
            this.light.updateMatrixWorld();

            var geometry = new SphereBufferGeometry(sphereSize, 4, 2);
            var material = new MeshBasicMaterial({ wireframe: true, fog: false });
            material.color.copy(this.light.color).multiplyScalar(this.light.intensity);

            this.geometry = geometry;
            this.material = material; 

            this.matrix = this.light.matrixWorld;
            this.matrixAutoUpdate = false; 
        };
         
        dispose()
        { 
            this.geometry.dispose();
            this.material.dispose(); 
        };

        update()
        { 
            this.material.color.copy(this.light.color).multiplyScalar(this.light.intensity); 
        }
    }
}