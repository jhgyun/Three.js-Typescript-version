/// <reference path="../../core/object3d.ts" />
/* 
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class HemisphereLightHelper extends Object3D
    {
        light: Light;
        colors: Color[];
        lightSphere: Mesh;

        constructor(light: Light, sphereSize?: number)
        {
            super();

            this.light = light;
            this.light.updateMatrixWorld();

            this.matrix = light.matrixWorld;
            this.matrixAutoUpdate = false;

            this.colors = [new Color(), new Color()];

            var geometry = new SphereGeometry(sphereSize, 4, 2);
            geometry.rotateX(- Math.PI / 2);

            for (var i = 0, il = 8; i < il; i++)
            {
                geometry.faces[i].color = this.colors[i < 4 ? 0 : 1];
            }

            var material = new MeshBasicMaterial({ vertexColors: FaceColors, wireframe: true });

            this.lightSphere = new Mesh(geometry, material);
            this.add(this.lightSphere);

            this.update();

        };

        dispose()
        {
            this.lightSphere.geometry.dispose();
            this.lightSphere.material.dispose();
        };

        update()
        {
            var vector = HemisphereLightHelper["upeate_v1"] ||
                (HemisphereLightHelper["upeate_v1"] = new Vector3());

            this.colors[0].copy(this.light.color).multiplyScalar(this.light.intensity);
            this.colors[1].copy(this.light.groundColor).multiplyScalar(this.light.intensity);

            this.lightSphere.lookAt(vector.setFromMatrixPosition(this.light.matrixWorld).negate());
            (this.lightSphere.geometry as SphereGeometry).colorsNeedUpdate = true;
        }
    }
}
