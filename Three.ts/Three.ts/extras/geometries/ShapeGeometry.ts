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

namespace THREE
{
    export interface ShapeGeometryOptions
    {
        /**number of points on the curves. NOT USED AT THE MOMENT.*/
        curveSegments?: number;// <int>,  

        /** material index for front and back faces*/
        material?: number;// <int> 

        /**object that provides UV generator functions*/
        UVGenerator?: any;// <Object>  
    }
    export class ShapeGeometry extends Geometry
    {
        constructor(ashapes: Shape | Shape[], options?: ShapeGeometryOptions)
        { 
            super();

            this.type = 'ShapeGeometry';
            var shapes: any = ashapes;

            if (Array.isArray(ashapes) === false) shapes = [ashapes];

            this.addShapeList(shapes, options); 
            this.computeFaceNormals(); 
        };

        
        /**
         * Add an array of shapes to THREE.ShapeGeometry.
         */
        addShapeList(shapes: Shape[], options?: ShapeGeometryOptions)
        { 
            for (var i = 0, l = shapes.length; i < l; i++)
            { 
                this.addShape(shapes[i], options); 
            } 
            return this; 
        };

        /**
         * Adds a shape to THREE.ShapeGeometry, based on THREE.ExtrudeGeometry.
         */
        addShape(shape, options?: ShapeGeometryOptions)
        { 
            if (options === undefined) options = {};
            var curveSegments = options.curveSegments !== undefined ? options.curveSegments : 12;

            var material = options.material;
            var uvgen = options.UVGenerator === undefined ? ExtrudeGeometry.WorldUVGenerator : options.UVGenerator;

            //

            var i, l, hole;

            var shapesOffset = this.vertices.length;
            var shapePoints = shape.extractPoints(curveSegments);

            var vertices = shapePoints.shape;
            var holes = shapePoints.holes;

            var reverse = !ShapeUtils.isClockWise(vertices);

            if (reverse)
            { 
                vertices = vertices.reverse();

                // Maybe we should also check if holes are in the opposite direction, just to be safe...

                for (i = 0, l = holes.length; i < l; i++)
                { 
                    hole = holes[i];

                    if (ShapeUtils.isClockWise(hole))
                    { 
                        holes[i] = hole.reverse(); 
                    } 
                }

                reverse = false;

            }

            var faces = ShapeUtils.triangulateShape(vertices, holes);

            // Vertices

            for (i = 0, l = holes.length; i < l; i++)
            {

                hole = holes[i];
                vertices = vertices.concat(hole);

            }

            //

            var vert, vlen = vertices.length;
            var face, flen = faces.length;

            for (i = 0; i < vlen; i++)
            { 
                vert = vertices[i];

                this.vertices.push(new Vector3(vert.x, vert.y, 0)); 
            }

            for (i = 0; i < flen; i++)
            {

                face = faces[i];

                var a = face[0] + shapesOffset;
                var b = face[1] + shapesOffset;
                var c = face[2] + shapesOffset;

                this.faces.push(new Face3(a, b, c, null, null, material));
                this.faceVertexUvs[0].push(uvgen.generateTopUV(this, a, b, c));

            }

        };
    }
}
