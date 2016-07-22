/// <reference path="../core/object3d.ts" />
/* 
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class LOD extends Object3D
    {
        private _level: {
            distance: number,
            object: Object3D
        }[] = [];

        constructor()
        {
            super();
            this.type = 'LOD';
        };

        get levels()
        {
            return this._level;
        }

        copy(source: LOD)
        {
            super.copy(source, false)

            var levels = source.levels;

            for (var i = 0, l = levels.length; i < l; i++)
            {
                var level = levels[i];
                this.addLevel(level.object.clone(), level.distance);
            }
            return this;
        }

        addLevel(object: Object3D, distance: number)
        {
            if (distance === undefined) distance = 0;

            distance = Math.abs(distance);

            var levels = this.levels;

            for (var l = 0; l < levels.length; l++)
            {
                if (distance < levels[l].distance)
                {
                    break;
                }
            }

            levels.splice(l, 0, { distance: distance, object: object });

            this.add(object);
        }

        getObjectForDistance(distance: number)
        {
            var levels = this.levels;

            for (var i = 1, l = levels.length; i < l; i++)
            {
                if (distance < levels[i].distance)
                {
                    break;
                }
            }

            return levels[i - 1].object;

        }

        private static raycast_matrixPosition = new Vector3();
        raycast(raycaster, intersects)
        {
            var matrixPosition = LOD.raycast_matrixPosition;
            matrixPosition.setFromMatrixPosition(this.matrixWorld);
            var distance = raycaster.ray.origin.distanceTo(matrixPosition);
            this.getObjectForDistance(distance).raycast(raycaster, intersects);
        }
        private static update_v1 = new Vector3();
        private static update_v2 = new Vector3();
        update(camera)
        {
            var v1 = LOD.update_v1;
            var v2 = LOD.update_v2;
            var levels = this.levels;
            if (levels.length > 1)
            {
                v1.setFromMatrixPosition(camera.matrixWorld);
                v2.setFromMatrixPosition(this.matrixWorld);

                var distance = v1.distanceTo(v2);

                levels[0].object.visible = true;

                for (var i = 1, l = levels.length; i < l; i++)
                {
                    if (distance >= levels[i].distance)
                    {
                        levels[i - 1].object.visible = false;
                        levels[i].object.visible = true;

                    }
                    else
                    {
                        break;
                    }

                }

                for (; i < l; i++)
                {
                    levels[i].object.visible = false;
                }
            }
        }

        toJSON(meta)
        {
            var data = super.toJSON(meta);

            data.object.levels = [];

            var levels = this.levels;

            for (var i = 0, l = levels.length; i < l; i++)
            {
                var level = levels[i];

                data.object.levels.push({
                    object: level.object.uuid,
                    distance: level.distance
                });
            }
            return data;
        }
    }
}