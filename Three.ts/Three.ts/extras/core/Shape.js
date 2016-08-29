var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape(points) {
            _super.call(this, points);
            this.holes = [];
        }
        ;
        Shape.prototype.extrude = function (options) {
            return new THREE.ExtrudeGeometry(this, options);
        };
        Shape.prototype.makeGeometry = function (options) {
            return new THREE.ShapeGeometry(this, options);
        };
        Shape.prototype.getPointsHoles = function (divisions) {
            var holesPts = [];
            for (var i = 0, l = this.holes.length; i < l; i++) {
                holesPts[i] = this.holes[i].getPoints(divisions);
            }
            return holesPts;
        };
        Shape.prototype.extractAllPoints = function (divisions) {
            return {
                shape: this.getPoints(divisions),
                holes: this.getPointsHoles(divisions)
            };
        };
        Shape.prototype.extractPoints = function (divisions) {
            return this.extractAllPoints(divisions);
        };
        return Shape;
    }(THREE.Path));
    THREE.Shape = Shape;
})(THREE || (THREE = {}));
