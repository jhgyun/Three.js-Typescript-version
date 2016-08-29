var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var LensFlare = (function (_super) {
        __extends(LensFlare, _super);
        function LensFlare(texture, size, distance, blending, color) {
            _super.call(this);
            this.lensFlares = [];
            this.positionScreen = new THREE.Vector3();
            if (texture !== undefined) {
                this.add(texture, size, distance, blending, color);
            }
        }
        ;
        LensFlare.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.positionScreen.copy(source.positionScreen);
            this.customUpdateCallback = source.customUpdateCallback;
            for (var i = 0, l = source.lensFlares.length; i < l; i++) {
                this.lensFlares.push(source.lensFlares[i]);
            }
            return this;
        };
        LensFlare.prototype.add = function (texture, size, distance, blending, color, opacity) {
            if (size === undefined)
                size = -1;
            if (distance === undefined)
                distance = 0;
            if (opacity === undefined)
                opacity = 1;
            if (color === undefined)
                color = new THREE.Color(0xffffff);
            if (blending === undefined)
                blending = THREE.NormalBlending;
            distance = THREE.Math.min(distance, THREE.Math.max(0, distance));
            this.lensFlares.push({
                texture: texture,
                size: size,
                distance: distance,
                x: 0, y: 0, z: 0,
                scale: 1,
                rotation: 0,
                opacity: opacity,
                color: color,
                blending: blending
            });
            return this;
        };
        LensFlare.prototype.updateLensFlares = function () {
            var f, fl = this.lensFlares.length;
            var flare;
            var vecX = -this.positionScreen.x * 2;
            var vecY = -this.positionScreen.y * 2;
            for (f = 0; f < fl; f++) {
                flare = this.lensFlares[f];
                flare.x = this.positionScreen.x + vecX * flare.distance;
                flare.y = this.positionScreen.y + vecY * flare.distance;
                flare.wantedRotation = flare.x * THREE.Math.PI * 0.25;
                flare.rotation += (flare.wantedRotation - flare.rotation) * 0.25;
            }
        };
        return LensFlare;
    }(THREE.Object3D));
    THREE.LensFlare = LensFlare;
})(THREE || (THREE = {}));
