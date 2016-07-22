/* 
 * @author mrdoob / http://mrdoob.com/
 * @author bhouston / http://clara.io/
 * @author stephomi / http://stephaneginier.com/
 */

namespace THREE
{
    export class Raycaster
    {
        ray: Ray;
        near: number;
        far: number;
        params = {
            Mesh: {},
            Line: {},
            LOD: {},
            Points: { threshold: 1 },
            Sprite: {}
        };
        linePrecision = 1;

        constructor(origin: Vector3, direction: Vector3, near = 0, far = Infinity)
        {
            this.ray = new Ray(origin, direction);
            // direction is assumed to be normalized (for accurate distance calculations)

            this.near = near || 0;
            this.far = far || Infinity;
        }

        static ascSort(a, b)
        {
            return a.distance - b.distance;
        }
        static intersectObject(object: Object3D, raycaster: Raycaster, intersects, recursive)
        {

            if (object.visible === false) return;

            object.raycast(raycaster, intersects);

            if (recursive === true)
            {
                var children = object.children;

                for (var i = 0, l = children.length; i < l; i++)
                {
                    Raycaster.intersectObject(children[i], raycaster, intersects, true);
                }
            }

        }
        set(origin: Vector3, direction: Vector3)
        {
            // direction is assumed to be normalized (for accurate distance calculations)
            this.ray.set(origin, direction);
        }
        setFromCamera(coords, camera)
        {
            if (camera instanceof PerspectiveCamera)
            {
                this.ray.origin.setFromMatrixPosition(camera.matrixWorld);
                this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(this.ray.origin).normalize();
            }
            else if (camera instanceof OrthographicCamera)
            {
                this.ray.origin.set(coords.x, coords.y, (camera.near + camera.far) / (camera.near - camera.far)).unproject(camera); // set origin in plane of camera
                this.ray.direction.set(0, 0, - 1).transformDirection(camera.matrixWorld);
            }
            else
            {
                console.error('THREE.Raycaster: Unsupported camera type.');
            }
        }
        intersectObject(object: Object3D, recursive?: boolean)
        {
            var intersects = [];
            Raycaster.intersectObject(object, this, intersects, recursive);
            intersects.sort(Raycaster.ascSort);
            return intersects;
        }
        intersectObjects(objects: Object3D[], recursive?: boolean)
        {
            var intersects = [];
            if (Array.isArray(objects) === false)
            {
                console.warn('THREE.Raycaster.intersectObjects: objects is not an Array.');
                return intersects;
            }

            for (var i = 0, l = objects.length; i < l; i++)
            {
                Raycaster.intersectObject(objects[i], this, intersects, recursive);
            }
            intersects.sort(Raycaster.ascSort);
            return intersects;
        }
    }
} 