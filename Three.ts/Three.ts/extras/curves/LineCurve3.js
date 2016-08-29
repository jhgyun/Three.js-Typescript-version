var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var LineCurve3 = (function (_super) {
        __extends(LineCurve3, _super);
        function LineCurve3(v1, v2) {
            _super.call(this);
            this.v1 = v1;
            this.v2 = v2;
        }
        LineCurve3.prototype.getPoint = function (t) {
            var vector = new THREE.Vector3();
            vector.subVectors(this.v2, this.v1);
            vector.multiplyScalar(t);
            vector.add(this.v1);
            return vector;
        };
        return LineCurve3;
    }(THREE.Curve));
    THREE.LineCurve3 = LineCurve3;
})(THREE || (THREE = {}));
