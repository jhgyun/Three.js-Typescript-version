/// <reference path="../../objects/mesh.ts" />
/* 
 * @author WestLangley / http://github.com/WestLangley
 */

// a helper to show the world-axis-aligned bounding box for an object

namespace THREE
{
    export class BoundingBoxHelper extends Mesh
    {
        object: any;
        box: Box3 = new Box3();
        constructor(object: Object3D, color: number = 0x888888)
        {
            super(new BoxGeometry(1, 1, 1), new MeshBasicMaterial({ color: color, wireframe: true }));
            this.object = object;
            this.box = new Box3();
        };
         
        update()
        { 
            this.box.setFromObject(this.object); 
            this.box.size(this.scale); 
            this.box.center(this.position); 
        };
    }
}