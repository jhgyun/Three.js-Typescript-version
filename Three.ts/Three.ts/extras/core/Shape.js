/// <reference path="path.ts" />
/*
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Defines a 2d shape plane using paths.
 **/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// STEP 1 Create a path.
// STEP 2 Turn path into shape.
// STEP 3 ExtrudeGeometry takes in Shape/Shapes
// STEP 3a - Extract points from each shape, turn to vertices
// STEP 3b - Triangulate each shape, add faces.
var THREE;
(function (THREE) {
    var Shape = (function (_super) {
        __extends(Shape, _super);
        function Shape(points) {
            _super.call(this, points);
            this.holes = [];
        }
        ;
        /** Convenience method to return ExtrudeGeometry */
        Shape.prototype.extrude = function (options) {
            return new THREE.ExtrudeGeometry(this, options);
        };
        // Convenience method to return ShapeGeometry 
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
        // Get points of shape and holes (keypoints based on segments parameter)
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
