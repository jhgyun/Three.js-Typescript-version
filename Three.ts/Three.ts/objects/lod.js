var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var LOD = (function (_super) {
        __extends(LOD, _super);
        function LOD() {
            _super.call(this);
            this._level = [];
            this.type = 'LOD';
        }
        ;
        Object.defineProperty(LOD.prototype, "levels", {
            get: function () {
                return this._level;
            },
            enumerable: true,
            configurable: true
        });
        LOD.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source, false);
            var levels = source.levels;
            for (var i = 0, l = levels.length; i < l; i++) {
                var level = levels[i];
                this.addLevel(level.object.clone(), level.distance);
            }
            return this;
        };
        LOD.prototype.addLevel = function (object, distance) {
            if (distance === undefined)
                distance = 0;
            distance = THREE.Math.abs(distance);
            var levels = this.levels;
            for (var l = 0; l < levels.length; l++) {
                if (distance < levels[l].distance) {
                    break;
                }
            }
            levels.splice(l, 0, { distance: distance, object: object });
            this.add(object);
        };
        LOD.prototype.getObjectForDistance = function (distance) {
            var levels = this.levels;
            for (var i = 1, l = levels.length; i < l; i++) {
                if (distance < levels[i].distance) {
                    break;
                }
            }
            return levels[i - 1].object;
        };
        LOD.prototype.raycast = function (raycaster, intersects) {
            var matrixPosition = LOD.raycast_matrixPosition;
            matrixPosition.setFromMatrixPosition(this.matrixWorld);
            var distance = raycaster.ray.origin.distanceTo(matrixPosition);
            this.getObjectForDistance(distance).raycast(raycaster, intersects);
        };
        LOD.prototype.update = function (camera) {
            var v1 = LOD.update_v1;
            var v2 = LOD.update_v2;
            var levels = this.levels;
            if (levels.length > 1) {
                v1.setFromMatrixPosition(camera.matrixWorld);
                v2.setFromMatrixPosition(this.matrixWorld);
                var distance = v1.distanceTo(v2);
                levels[0].object.visible = true;
                for (var i = 1, l = levels.length; i < l; i++) {
                    if (distance >= levels[i].distance) {
                        levels[i - 1].object.visible = false;
                        levels[i].object.visible = true;
                    }
                    else {
                        break;
                    }
                }
                for (; i < l; i++) {
                    levels[i].object.visible = false;
                }
            }
        };
        LOD.prototype.toJSON = function (meta) {
            var data = _super.prototype.toJSON.call(this, meta);
            data.object.levels = [];
            var levels = this.levels;
            for (var i = 0, l = levels.length; i < l; i++) {
                var level = levels[i];
                data.object.levels.push({
                    object: level.object.uuid,
                    distance: level.distance
                });
            }
            return data;
        };
        LOD.raycast_matrixPosition = new THREE.Vector3();
        LOD.update_v1 = new THREE.Vector3();
        LOD.update_v2 = new THREE.Vector3();
        return LOD;
    }(THREE.Object3D));
    THREE.LOD = LOD;
})(THREE || (THREE = {}));
