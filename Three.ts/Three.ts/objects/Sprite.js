var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(material) {
            _super.call(this);
            this.type = 'Sprite';
            this.material = (material !== undefined) ? material : new THREE.SpriteMaterial();
        }
        ;
        Sprite.prototype.raycast = function (raycaster, intersects) {
            var matrixPosition = Sprite.raycast_matrixPosition;
            matrixPosition.setFromMatrixPosition(this.matrixWorld);
            var distanceSq = raycaster.ray.distanceSqToPoint(matrixPosition);
            var guessSizeSq = this.scale.x * this.scale.y / 4;
            if (distanceSq > guessSizeSq) {
                return;
            }
            intersects.push({
                distance: THREE.Math.sqrt(distanceSq),
                point: this.position,
                face: null,
                object: this
            });
        };
        Sprite.prototype.clone = function () {
            return new this.constructor(this.material).copy(this);
        };
        Sprite.raycast_matrixPosition = new THREE.Vector3();
        return Sprite;
    }(THREE.Object3D));
    THREE.Sprite = Sprite;
})(THREE || (THREE = {}));
