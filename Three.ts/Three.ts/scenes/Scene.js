/// <reference path="../core/object3d.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Scene = (function (_super) {
        __extends(Scene, _super);
        function Scene() {
            _super.call(this);
            this.background = null;
            this.fog = null;
            this.overrideMaterial = null;
            this.autoUpdate = true; // checked by the renderer
            this.type = 'Scene';
        }
        ;
        Scene.prototype.copy = function (source, recursive) {
            _super.prototype.copy.call(this, source, recursive);
            if (source.background !== null)
                this.background = source.background.clone();
            if (source.fog !== null)
                this.fog = source.fog.clone();
            if (source.overrideMaterial !== null)
                this.overrideMaterial = source.overrideMaterial.clone();
            this.autoUpdate = source.autoUpdate;
            this.matrixAutoUpdate = source.matrixAutoUpdate;
            return this;
        };
        ;
        return Scene;
    }(THREE.Object3D));
    THREE.Scene = Scene;
})(THREE || (THREE = {}));
