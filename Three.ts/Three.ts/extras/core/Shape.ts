/// <reference path="path.ts" />
/*
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Defines a 2d shape plane using paths.
 **/

// STEP 1 Create a path.
// STEP 2 Turn path into shape.
// STEP 3 ExtrudeGeometry takes in Shape/Shapes
// STEP 3a - Extract points from each shape, turn to vertices
// STEP 3b - Triangulate each shape, add faces.

namespace THREE
{
    export class Shape extends Path
    {
        holes;

        constructor(points?: Vector2[])
        {
            super(points);
            this.holes = [];

        };
         

        /** Convenience method to return ExtrudeGeometry */
        extrude(options?: ExtrudeGeometryOptions)
        { 
            return new ExtrudeGeometry(this, options); 
        } 

        // Convenience method to return ShapeGeometry 
        makeGeometry(options?: ShapeGeometryOptions)
        { 
            return new ShapeGeometry(this, options); 
        } 

        getPointsHoles(divisions)
        { 
            var holesPts = [];

            for (var i = 0, l = this.holes.length; i < l; i++)
            { 
                holesPts[i] = this.holes[i].getPoints(divisions); 
            } 
            return holesPts; 
        } 

        // Get points of shape and holes (keypoints based on segments parameter)

        extractAllPoints (divisions)
        { 
            return {

                shape: this.getPoints(divisions),
                holes: this.getPointsHoles(divisions)

            }; 
        } 

        extractPoints (divisions)
        { 
            return this.extractAllPoints(divisions); 
        } 
    }
}
