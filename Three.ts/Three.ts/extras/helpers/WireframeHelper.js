/// <reference path="../../objects/linesegments.ts" />
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
    var WireframeHelper = (function (_super) {
        __extends(WireframeHelper, _super);
        function WireframeHelper(object, hex) {
            _super.call(this);
            var color = (hex !== undefined) ? hex : 0xffffff;
            this.geometry = new THREE.WireframeGeometry(object.geometry);
            this.material = new THREE.LineBasicMaterial({ color: color });
            this.matrix = object.matrixWorld;
            this.matrixAutoUpdate = false;
        }
        ;
        return WireframeHelper;
    }(THREE.LineSegments));
    THREE.WireframeHelper = WireframeHelper;
})(THREE || (THREE = {}));
