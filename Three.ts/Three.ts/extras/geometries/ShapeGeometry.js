/// <reference path="../../core/geometry.ts" />
/*
 * @author jonobr1 / http://jonobr1.com
 *
 * Creates a one-sided polygonal geometry from a path shape. Similar to
 * ExtrudeGeometry.
 *
 * parameters = {
 *
 *	curveSegments: <int>, // number of points on the curves. NOT USED AT THE MOMENT.
 *
 *	material: <int> // material index for front and back faces
 *	uvGenerator: <Object> // object that provides UV generator functions
 *
 * }
 **/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var ShapeGeometry = (function (_super) {
        __extends(ShapeGeometry, _super);
        function ShapeGeometry(ashapes, options) {
            _super.call(this);
            this.type = 'ShapeGeometry';
            var shapes = ashapes;
            if (Array.isArray(ashapes) === false)
                shapes = [ashapes];
            this.addShapeList(shapes, options);
            this.computeFaceNormals();
        }
        ;
        /**
         * Add an array of shapes to THREE.ShapeGeometry.
         */
        ShapeGeometry.prototype.addShapeList = function (shapes, options) {
            for (var i = 0, l = shapes.length; i < l; i++) {
                this.addShape(shapes[i], options);
            }
            return this;
        };
        ;
        /**
         * Adds a shape to THREE.ShapeGeometry, based on THREE.ExtrudeGeometry.
         */
        ShapeGeometry.prototype.addShape = function (shape, options) {
            if (options === undefined)
                options = {};
            var curveSegments = options.curveSegments !== undefined ? options.curveSegments : 12;
            var material = options.material;
            var uvgen = options.UVGenerator === undefined ? THREE.ExtrudeGeometry.WorldUVGenerator : options.UVGenerator;
            //
            var i, l, hole;
            var shapesOffset = this.vertices.length;
            var shapePoints = shape.extractPoints(curveSegments);
            var vertices = shapePoints.shape;
            var holes = shapePoints.holes;
            var reverse = !THREE.ShapeUtils.isClockWise(vertices);
            if (reverse) {
                vertices = vertices.reverse();
                // Maybe we should also check if holes are in the opposite direction, just to be safe...
                for (i = 0, l = holes.length; i < l; i++) {
                    hole = holes[i];
                    if (THREE.ShapeUtils.isClockWise(hole)) {
                        holes[i] = hole.reverse();
                    }
                }
                reverse = false;
            }
            var faces = THREE.ShapeUtils.triangulateShape(vertices, holes);
            // Vertices
            for (i = 0, l = holes.length; i < l; i++) {
                hole = holes[i];
                vertices = vertices.concat(hole);
            }
            //
            var vert, vlen = vertices.length;
            var face, flen = faces.length;
            for (i = 0; i < vlen; i++) {
                vert = vertices[i];
                this.vertices.push(new THREE.Vector3(vert.x, vert.y, 0));
            }
            for (i = 0; i < flen; i++) {
                face = faces[i];
                var a = face[0] + shapesOffset;
                var b = face[1] + shapesOffset;
                var c = face[2] + shapesOffset;
                this.faces.push(new THREE.Face3(a, b, c, null, null, material));
                this.faceVertexUvs[0].push(uvgen.generateTopUV(this, a, b, c));
            }
        };
        ;
        return ShapeGeometry;
    }(THREE.Geometry));
    THREE.ShapeGeometry = ShapeGeometry;
})(THREE || (THREE = {}));
