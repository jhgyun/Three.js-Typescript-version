var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Path = (function (_super) {
        __extends(Path, _super);
        function Path(points) {
            _super.call(this);
            this.currentPoint = new THREE.Vector2();
            if (points) {
                this.fromPoints(points);
            }
        }
        ;
        Path.prototype.fromPoints = function (vectors) {
            this.moveTo(vectors[0].x, vectors[0].y);
            for (var i = 1, l = vectors.length; i < l; i++) {
                this.lineTo(vectors[i].x, vectors[i].y);
            }
        };
        Path.prototype.moveTo = function (x, y) {
            this.currentPoint.set(x, y);
        };
        Path.prototype.lineTo = function (x, y) {
            var curve = new THREE.LineCurve(this.currentPoint.clone(), new THREE.Vector2(x, y));
            this.curves.push(curve);
            this.currentPoint.set(x, y);
        };
        Path.prototype.quadraticCurveTo = function (aCPx, aCPy, aX, aY) {
            var curve = new THREE.QuadraticBezierCurve(this.currentPoint.clone(), new THREE.Vector2(aCPx, aCPy), new THREE.Vector2(aX, aY));
            this.curves.push(curve);
            this.currentPoint.set(aX, aY);
        };
        Path.prototype.bezierCurveTo = function (aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
            var curve = new THREE.CubicBezierCurve(this.currentPoint.clone(), new THREE.Vector2(aCP1x, aCP1y), new THREE.Vector2(aCP2x, aCP2y), new THREE.Vector2(aX, aY));
            this.curves.push(curve);
            this.currentPoint.set(aX, aY);
        };
        Path.prototype.splineThru = function (pts) {
            var npts = [this.currentPoint.clone()].concat(pts);
            var curve = new THREE.SplineCurve(npts);
            this.curves.push(curve);
            this.currentPoint.copy(pts[pts.length - 1]);
        };
        Path.prototype.arc = function (aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
            var x0 = this.currentPoint.x;
            var y0 = this.currentPoint.y;
            this.absarc(aX + x0, aY + y0, aRadius, aStartAngle, aEndAngle, aClockwise);
        };
        Path.prototype.absarc = function (aX, aY, aRadius, aStartAngle, aEndAngle, aClockwise) {
            this.absellipse(aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise);
        };
        Path.prototype.ellipse = function (aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
            var x0 = this.currentPoint.x;
            var y0 = this.currentPoint.y;
            this.absellipse(aX + x0, aY + y0, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);
        };
        Path.prototype.absellipse = function (aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation) {
            var curve = new THREE.EllipseCurve(aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation);
            if (this.curves.length > 0) {
                var firstPoint = curve.getPoint(0);
                if (!firstPoint.equals(this.currentPoint)) {
                    this.lineTo(firstPoint.x, firstPoint.y);
                }
            }
            this.curves.push(curve);
            var lastPoint = curve.getPoint(1);
            this.currentPoint.copy(lastPoint);
        };
        return Path;
    }(THREE.CurvePath));
    THREE.Path = Path;
    var ShapePath = (function () {
        function ShapePath() {
            this.subPaths = [];
            this.currentPath = null;
        }
        ShapePath.prototype.moveTo = function (x, y) {
            this.currentPath = new THREE.Path();
            this.subPaths.push(this.currentPath);
            this.currentPath.moveTo(x, y);
        };
        ShapePath.prototype.lineTo = function (x, y) {
            this.currentPath.lineTo(x, y);
        };
        ShapePath.prototype.quadraticCurveTo = function (aCPx, aCPy, aX, aY) {
            this.currentPath.quadraticCurveTo(aCPx, aCPy, aX, aY);
        };
        ShapePath.prototype.bezierCurveTo = function (aCP1x, aCP1y, aCP2x, aCP2y, aX, aY) {
            this.currentPath.bezierCurveTo(aCP1x, aCP1y, aCP2x, aCP2y, aX, aY);
        };
        ShapePath.prototype.splineThru = function (pts) {
            this.currentPath.splineThru(pts);
        };
        ShapePath.prototype.toShapes = function (isCCW, noHoles) {
            function toShapesNoHoles(inSubpaths) {
                var shapes = [];
                for (var i = 0, l = inSubpaths.length; i < l; i++) {
                    var tmpPath = inSubpaths[i];
                    var tmpShape = new THREE.Shape();
                    tmpShape.curves = tmpPath.curves;
                    shapes.push(tmpShape);
                }
                return shapes;
            }
            function isPointInsidePolygon(inPt, inPolygon) {
                var polyLen = inPolygon.length;
                var inside = false;
                for (var p = polyLen - 1, q = 0; q < polyLen; p = q++) {
                    var edgeLowPt = inPolygon[p];
                    var edgeHighPt = inPolygon[q];
                    var edgeDx = edgeHighPt.x - edgeLowPt.x;
                    var edgeDy = edgeHighPt.y - edgeLowPt.y;
                    if (THREE.Math.abs(edgeDy) > Number.EPSILON) {
                        if (edgeDy < 0) {
                            edgeLowPt = inPolygon[q];
                            edgeDx = -edgeDx;
                            edgeHighPt = inPolygon[p];
                            edgeDy = -edgeDy;
                        }
                        if ((inPt.y < edgeLowPt.y) || (inPt.y > edgeHighPt.y))
                            continue;
                        if (inPt.y === edgeLowPt.y) {
                            if (inPt.x === edgeLowPt.x)
                                return true;
                        }
                        else {
                            var perpEdge = edgeDy * (inPt.x - edgeLowPt.x) - edgeDx * (inPt.y - edgeLowPt.y);
                            if (perpEdge === 0)
                                return true;
                            if (perpEdge < 0)
                                continue;
                            inside = !inside;
                        }
                    }
                    else {
                        if (inPt.y !== edgeLowPt.y)
                            continue;
                        if (((edgeHighPt.x <= inPt.x) && (inPt.x <= edgeLowPt.x)) ||
                            ((edgeLowPt.x <= inPt.x) && (inPt.x <= edgeHighPt.x)))
                            return true;
                    }
                }
                return inside;
            }
            var isClockWise = THREE.ShapeUtils.isClockWise;
            var subPaths = this.subPaths;
            if (subPaths.length === 0)
                return [];
            if (noHoles === true)
                return toShapesNoHoles(subPaths);
            var solid, tmpPath, tmpShape, shapes = [];
            if (subPaths.length === 1) {
                tmpPath = subPaths[0];
                tmpShape = new THREE.Shape();
                tmpShape.curves = tmpPath.curves;
                shapes.push(tmpShape);
                return shapes;
            }
            var holesFirst = !isClockWise(subPaths[0].getPoints());
            holesFirst = isCCW ? !holesFirst : holesFirst;
            var betterShapeHoles = [];
            var newShapes = [];
            var newShapeHoles = [];
            var mainIdx = 0;
            var tmpPoints;
            newShapes[mainIdx] = undefined;
            newShapeHoles[mainIdx] = [];
            for (var i = 0, l = subPaths.length; i < l; i++) {
                tmpPath = subPaths[i];
                tmpPoints = tmpPath.getPoints();
                solid = isClockWise(tmpPoints);
                solid = isCCW ? !solid : solid;
                if (solid) {
                    if ((!holesFirst) && (newShapes[mainIdx]))
                        mainIdx++;
                    newShapes[mainIdx] = { s: new THREE.Shape(), p: tmpPoints };
                    newShapes[mainIdx].s.curves = tmpPath.curves;
                    if (holesFirst)
                        mainIdx++;
                    newShapeHoles[mainIdx] = [];
                }
                else {
                    newShapeHoles[mainIdx].push({ h: tmpPath, p: tmpPoints[0] });
                }
            }
            if (!newShapes[0])
                return toShapesNoHoles(subPaths);
            if (newShapes.length > 1) {
                var ambiguous = false;
                var toChange = [];
                for (var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx++) {
                    betterShapeHoles[sIdx] = [];
                }
                for (var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx++) {
                    var sho = newShapeHoles[sIdx];
                    for (var hIdx = 0; hIdx < sho.length; hIdx++) {
                        var ho = sho[hIdx];
                        var hole_unassigned = true;
                        for (var s2Idx = 0; s2Idx < newShapes.length; s2Idx++) {
                            if (isPointInsidePolygon(ho.p, newShapes[s2Idx].p)) {
                                if (sIdx !== s2Idx)
                                    toChange.push({ froms: sIdx, tos: s2Idx, hole: hIdx });
                                if (hole_unassigned) {
                                    hole_unassigned = false;
                                    betterShapeHoles[s2Idx].push(ho);
                                }
                                else {
                                    ambiguous = true;
                                }
                            }
                        }
                        if (hole_unassigned) {
                            betterShapeHoles[sIdx].push(ho);
                        }
                    }
                }
                if (toChange.length > 0) {
                    if (!ambiguous)
                        newShapeHoles = betterShapeHoles;
                }
            }
            var tmpHoles;
            for (var i = 0, il = newShapes.length; i < il; i++) {
                tmpShape = newShapes[i].s;
                shapes.push(tmpShape);
                tmpHoles = newShapeHoles[i];
                for (var j = 0, jl = tmpHoles.length; j < jl; j++) {
                    tmpShape.holes.push(tmpHoles[j].h);
                }
            }
            return shapes;
        };
        return ShapePath;
    }());
    THREE.ShapePath = ShapePath;
})(THREE || (THREE = {}));
