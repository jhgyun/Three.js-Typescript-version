/*
* @author mrdoob / http://mrdoob.com/
* @author bhouston / http://clara.io/
* @author stephomi / http://stephaneginier.com/
*/
var THREE;
(function (THREE) {
    var Raycaster = (function () {
        function Raycaster(origin, direction, near, far) {
            this.params = {
                Mesh: {},
                Line: {},
                LOD: {},
                Points: { threshold: 1 },
                Sprite: {}
            };
            this.linePrecision = 1;
            this.ray = new THREE.Ray(origin, direction);
            // direction is assumed to be normalized (for accurate distance calculations)
            this.near = near || 0;
            this.far = far || Infinity;
        }
        Raycaster.ascSort = function (a, b) {
            return a.distance - b.distance;
        };
        Raycaster.intersectObject = function (object, raycaster, intersects, recursive) {
            if (object.visible === false)
                return;
            object.raycast(raycaster, intersects);
            if (recursive === true) {
                var children = object.children;
                for (var i = 0, l = children.length; i < l; i++) {
                    Raycaster.intersectObject(children[i], raycaster, intersects, true);
                }
            }
        };
        Raycaster.prototype.set = function (origin, direction) {
            // direction is assumed to be normalized (for accurate distance calculations)
            this.ray.set(origin, direction);
        };
        Raycaster.prototype.setFromCamera = function (coords, camera) {
            if (camera instanceof THREE.PerspectiveCamera) {
                this.ray.origin.setFromMatrixPosition(camera.matrixWorld);
                this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(this.ray.origin).normalize();
            }
            else if (camera instanceof THREE.OrthographicCamera) {
                this.ray.origin.set(coords.x, coords.y, (camera.near + camera.far) / (camera.near - camera.far)).unproject(camera); // set origin in plane of camera
                this.ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld);
            }
            else {
                console.error('THREE.Raycaster: Unsupported camera type.');
            }
        };
        Raycaster.prototype.intersectObject = function (object, recursive) {
            var intersects = [];
            Raycaster.intersectObject(object, this, intersects, recursive);
            intersects.sort(Raycaster.ascSort);
            return intersects;
        };
        Raycaster.prototype.intersectObjects = function (objects, recursive) {
            var intersects = [];
            if (Array.isArray(objects) === false) {
                console.warn('THREE.Raycaster.intersectObjects: objects is not an Array.');
                return intersects;
            }
            for (var i = 0, l = objects.length; i < l; i++) {
                Raycaster.intersectObject(objects[i], this, intersects, recursive);
            }
            intersects.sort(Raycaster.ascSort);
            return intersects;
        };
        return Raycaster;
    }());
    THREE.Raycaster = Raycaster;
})(THREE || (THREE = {}));
