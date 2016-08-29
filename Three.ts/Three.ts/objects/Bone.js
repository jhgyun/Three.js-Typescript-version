var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Bone = (function (_super) {
        __extends(Bone, _super);
        function Bone(skin) {
            _super.call(this);
            this.type = 'Bone';
            this.skin = skin;
        }
        ;
        Bone.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.skin = source.skin;
            return this;
        };
        return Bone;
    }(THREE.Object3D));
    THREE.Bone = Bone;
})(THREE || (THREE = {}));
