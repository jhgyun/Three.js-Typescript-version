/// <reference path="curvepath.ts" />
/* 
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * Creates free form 2d path using series of points, lines or curves.
 *
 **/
namespace THREE
{
    export class Path extends CurvePath
    {
        currentPoint: Vector2;
        constructor(points?: Vector2[])
        {
            super();
            this.currentPoint = new THREE.Vector2();

            if (points)
            {
                this.fromPoints(points);
            }

        };
         
        // Create path using straight lines to connect all points
        // - vectors: array of Vector2
        fromPoints(vectors: Vector2[])
        {
            this.moveTo(vectors[0].x, vectors[0].y);

            for (var i = 1, l = vectors.length; i < l; i++)
            {

                this.lineTo(vectors[i].x, vectors[i].y);

            }

        }

        moveTo(x: number, y: number)
        {

            this.currentPoint.set(x, y); // TODO consider referencing vectors instead of copying?

        }

        lineTo(x: number, y: number)
        {

            var curve = new THREE.LineCurve(this.currentPoint.clone(), new THREE.Vector2(x, y));
            this.curves.push(curve);

            this.currentPoint.set(x, y);

        }

        quadraticCurveTo(aCPx: number, aCPy: number, aX: number, aY: number)
        {
            var curve = new THREE.QuadraticBezierCurve(
                this.currentPoint.clone(),
                new THREE.Vector2(aCPx, aCPy),
                new THREE.Vector2(aX, aY)
            );

            this.curves.push(curve);

            this.currentPoint.set(aX, aY);

        }

        bezierCurveTo(aCP1x: number, aCP1y: number, aCP2x: number, aCP2y: number, aX: number, aY: number)
        {

            var curve = new THREE.CubicBezierCurve(
                this.currentPoint.clone(),
                new THREE.Vector2(aCP1x, aCP1y),
                new THREE.Vector2(aCP2x, aCP2y),
                new THREE.Vector2(aX, aY)
            );

            this.curves.push(curve);

            this.currentPoint.set(aX, aY);

        }

        splineThru(pts: Vector2[] /*Array of Vector*/)
        {
            var npts = [this.currentPoint.clone()].concat(pts);

            var curve = new THREE.SplineCurve(npts);
            this.curves.push(curve);

            this.currentPoint.copy(pts[pts.length - 1]);
        }

        arc(aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean)
        {
            var x0 = this.currentPoint.x;
            var y0 = this.currentPoint.y;

            this.absarc(aX + x0, aY + y0, aRadius,
                aStartAngle, aEndAngle, aClockwise);
        }

        absarc(aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean)
        {
            this.absellipse(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);
        }

        ellipse(aX: number, aY: number, xRadius: number, yRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean, aRotation?: number)
        {

            var x0 = this.currentPoint.x;
            var y0 = this.currentPoint.y;

            this.absellipse(aX + x0, aY + y0, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);

        }

        absellipse(aX: number, aY: number, xRadius: number, yRadius: number, aStartAngle: number, aEndAngle: number, aClockwise: boolean, aRotation?: number)
        { 
            var curve = new THREE.EllipseCurve(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);

            if (this.curves.length > 0)
            { 
                // if a previous curve is present, attempt to join
                var firstPoint = curve.getPoint(0);

                if (!firstPoint.equals(this.currentPoint))
                { 
                    this.lineTo(firstPoint.x, firstPoint.y); 
                } 
            }

            this.curves.push(curve); 
            var lastPoint = curve.getPoint(1);
            this.currentPoint.copy(lastPoint); 
        } 
    }

    // minimal class for proxing functions to Path. Replaces old "extractSubpaths()"
    export class ShapePath
    {
        subPaths: Path[];
        currentPath: Path;

        constructor()
        {
            this.subPaths = [];
            this.currentPath = null;
        }

        moveTo(x: number, y: number)
        {
            this.currentPath = new THREE.Path();
            this.subPaths.push(this.currentPath);
            this.currentPath.moveTo(x, y);
        } 
        lineTo(x: number, y: number)
        {
            this.currentPath.lineTo(x, y);
        } 
        quadraticCurveTo(aCPx: number, aCPy: number, aX: number, aY: number)
        {
            this.currentPath.quadraticCurveTo(aCPx, aCPy, aX, aY);
        }
        bezierCurveTo(aCP1x: number, aCP1y: number, aCP2x: number, aCP2y: number, aX: number, aY: number)
        {
            this.currentPath.bezierCurveTo(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY);
        }
        splineThru(pts: Vector2[])
        {
            this.currentPath.splineThru(pts);
        }  
        toShapes (isCCW, noHoles)
        { 
            function toShapesNoHoles(inSubpaths)
            { 
                var shapes = [];

                for (var i = 0, l = inSubpaths.length; i < l; i++)
                {

                    var tmpPath = inSubpaths[i];

                    var tmpShape = new THREE.Shape();
                    tmpShape.curves = tmpPath.curves;

                    shapes.push(tmpShape);

                }

                return shapes;

            }

            function isPointInsidePolygon(inPt, inPolygon)
            {

                var polyLen = inPolygon.length;

                // inPt on polygon contour => immediate success    or
                // toggling of inside/outside at every single! intersection point of an edge
                //  with the horizontal line through inPt, left of inPt
                //  not counting lowerY endpoints of edges and whole edges on that line
                var inside = false;
                for (var p = polyLen - 1, q = 0; q < polyLen; p = q++)
                {

                    var edgeLowPt = inPolygon[p];
                    var edgeHighPt = inPolygon[q];

                    var edgeDx = edgeHighPt.x - edgeLowPt.x;
                    var edgeDy = edgeHighPt.y - edgeLowPt.y;

                    if (Math.abs(edgeDy) > Number.EPSILON)
                    {

                        // not parallel
                        if (edgeDy < 0)
                        {

                            edgeLowPt = inPolygon[q]; edgeDx = - edgeDx;
                            edgeHighPt = inPolygon[p]; edgeDy = - edgeDy;

                        }
                        if ((inPt.y < edgeLowPt.y) || (inPt.y > edgeHighPt.y)) continue;

                        if (inPt.y === edgeLowPt.y)
                        {

                            if (inPt.x === edgeLowPt.x) return true;		// inPt is on contour ?
                            // continue;				// no intersection or edgeLowPt => doesn't count !!!

                        } else
                        {

                            var perpEdge = edgeDy * (inPt.x - edgeLowPt.x) - edgeDx * (inPt.y - edgeLowPt.y);
                            if (perpEdge === 0) return true;		// inPt is on contour ?
                            if (perpEdge < 0) continue;
                            inside = !inside;		// true intersection left of inPt

                        }

                    } else
                    {

                        // parallel or collinear
                        if (inPt.y !== edgeLowPt.y) continue;			// parallel
                        // edge lies on the same horizontal line as inPt
                        if (((edgeHighPt.x <= inPt.x) && (inPt.x <= edgeLowPt.x)) ||
                            ((edgeLowPt.x <= inPt.x) && (inPt.x <= edgeHighPt.x))) return true;	// inPt: Point on contour !
                        // continue;

                    }

                }

                return inside;

            }

            var isClockWise = THREE.ShapeUtils.isClockWise;

            var subPaths = this.subPaths;
            if (subPaths.length === 0) return [];

            if (noHoles === true) return toShapesNoHoles(subPaths);
             
            var solid, tmpPath, tmpShape, shapes = [];

            if (subPaths.length === 1)
            { 
                tmpPath = subPaths[0];
                tmpShape = new THREE.Shape();
                tmpShape.curves = tmpPath.curves;
                shapes.push(tmpShape);
                return shapes;
            }

            var holesFirst = !isClockWise(subPaths[0].getPoints());
            holesFirst = isCCW ? !holesFirst : holesFirst;

            // console.log("Holes first", holesFirst);

            var betterShapeHoles = [];
            var newShapes = [];
            var newShapeHoles = [];
            var mainIdx = 0;
            var tmpPoints;

            newShapes[mainIdx] = undefined;
            newShapeHoles[mainIdx] = [];

            for (var i = 0, l = subPaths.length; i < l; i++)
            {
                tmpPath = subPaths[i];
                tmpPoints = tmpPath.getPoints();
                solid = isClockWise(tmpPoints);
                solid = isCCW ? !solid : solid;

                if (solid)
                {
                    if ((!holesFirst) && (newShapes[mainIdx])) mainIdx++;

                    newShapes[mainIdx] = { s: new THREE.Shape(), p: tmpPoints };
                    newShapes[mainIdx].s.curves = tmpPath.curves;

                    if (holesFirst) mainIdx++;
                    newShapeHoles[mainIdx] = []; 
                    //console.log('cw', i); 
                }
                else
                { 
                    newShapeHoles[mainIdx].push({ h: tmpPath, p: tmpPoints[0] }); 
                    //console.log('ccw', i); 
                }

            }

            // only Holes? -> probably all Shapes with wrong orientation
            if (!newShapes[0]) return toShapesNoHoles(subPaths);
             
            if (newShapes.length > 1)
            { 
                var ambiguous = false;
                var toChange = [];

                for (var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx++)
                { 
                    betterShapeHoles[sIdx] = []; 
                }

                for (var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx++)
                { 
                    var sho = newShapeHoles[sIdx];

                    for (var hIdx = 0; hIdx < sho.length; hIdx++)
                    { 
                        var ho = sho[hIdx];
                        var hole_unassigned = true;

                        for (var s2Idx = 0; s2Idx < newShapes.length; s2Idx++)
                        { 
                            if (isPointInsidePolygon(ho.p, newShapes[s2Idx].p))
                            { 
                                if (sIdx !== s2Idx) toChange.push({ froms: sIdx, tos: s2Idx, hole: hIdx });
                                if (hole_unassigned)
                                { 
                                    hole_unassigned = false;
                                    betterShapeHoles[s2Idx].push(ho); 
                                }
                                else
                                { 
                                    ambiguous = true; 
                                } 
                            }

                        }
                        if (hole_unassigned)
                        { 
                            betterShapeHoles[sIdx].push(ho); 
                        } 
                    } 
                }
                // console.log("ambiguous: ", ambiguous);
                if (toChange.length > 0)
                { 
                    // console.log("to change: ", toChange);
                    if (!ambiguous) newShapeHoles = betterShapeHoles;
                } 
            }

            var tmpHoles;

            for (var i = 0, il = newShapes.length; i < il; i++)
            { 
                tmpShape = newShapes[i].s;
                shapes.push(tmpShape);
                tmpHoles = newShapeHoles[i];

                for (var j = 0, jl = tmpHoles.length; j < jl; j++)
                { 
                    tmpShape.holes.push(tmpHoles[j].h);
                }
            }

            //console.log("shape", shapes); 
            return shapes; 
        }

    }
}