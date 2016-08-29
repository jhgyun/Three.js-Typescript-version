var THREE;
(function (THREE) {
    THREE.ShapeUtils = {
        area: function (contour) {
            var n = contour.length;
            var a = 0.0;
            for (var p = n - 1, q = 0; q < n; p = q++) {
                a += contour[p].x * contour[q].y - contour[q].x * contour[p].y;
            }
            return a * 0.5;
        },
        triangulate: (function () {
            function snip(contour, u, v, w, n, verts) {
                var p;
                var ax, ay, bx, by;
                var cx, cy, px, py;
                ax = contour[verts[u]].x;
                ay = contour[verts[u]].y;
                bx = contour[verts[v]].x;
                by = contour[verts[v]].y;
                cx = contour[verts[w]].x;
                cy = contour[verts[w]].y;
                if (Number.EPSILON > (((bx - ax) * (cy - ay)) - ((by - ay) * (cx - ax))))
                    return false;
                var aX, aY, bX, bY, cX, cY;
                var apx, apy, bpx, bpy, cpx, cpy;
                var cCROSSap, bCROSScp, aCROSSbp;
                aX = cx - bx;
                aY = cy - by;
                bX = ax - cx;
                bY = ay - cy;
                cX = bx - ax;
                cY = by - ay;
                for (p = 0; p < n; p++) {
                    px = contour[verts[p]].x;
                    py = contour[verts[p]].y;
                    if (((px === ax) && (py === ay)) ||
                        ((px === bx) && (py === by)) ||
                        ((px === cx) && (py === cy)))
                        continue;
                    apx = px - ax;
                    apy = py - ay;
                    bpx = px - bx;
                    bpy = py - by;
                    cpx = px - cx;
                    cpy = py - cy;
                    aCROSSbp = aX * bpy - aY * bpx;
                    cCROSSap = cX * apy - cY * apx;
                    bCROSScp = bX * cpy - bY * cpx;
                    if ((aCROSSbp >= -Number.EPSILON) && (bCROSScp >= -Number.EPSILON) && (cCROSSap >= -Number.EPSILON))
                        return false;
                }
                return true;
            }
            return function triangulate(contour, indices) {
                var n = contour.length;
                if (n < 3)
                    return null;
                var result = [], verts = [], vertIndices = [];
                var u, v, w;
                if (THREE.ShapeUtils.area(contour) > 0.0) {
                    for (v = 0; v < n; v++)
                        verts[v] = v;
                }
                else {
                    for (v = 0; v < n; v++)
                        verts[v] = (n - 1) - v;
                }
                var nv = n;
                var count = 2 * nv;
                for (v = nv - 1; nv > 2;) {
                    if ((count--) <= 0) {
                        console.warn('THREE.ShapeUtils: Unable to triangulate polygon! in triangulate()');
                        if (indices)
                            return vertIndices;
                        return result;
                    }
                    u = v;
                    if (nv <= u)
                        u = 0;
                    v = u + 1;
                    if (nv <= v)
                        v = 0;
                    w = v + 1;
                    if (nv <= w)
                        w = 0;
                    if (snip(contour, u, v, w, nv, verts)) {
                        var a, b, c, s, t;
                        a = verts[u];
                        b = verts[v];
                        c = verts[w];
                        result.push([contour[a],
                            contour[b],
                            contour[c]]);
                        vertIndices.push([verts[u], verts[v], verts[w]]);
                        for (s = v, t = v + 1; t < nv; s++, t++) {
                            verts[s] = verts[t];
                        }
                        nv--;
                        count = 2 * nv;
                    }
                }
                if (indices)
                    return vertIndices;
                return result;
            };
        })(),
        triangulateShape: function (contour, holes) {
            function removeDupEndPts(points) {
                var l = points.length;
                if (l > 2 && points[l - 1].equals(points[0])) {
                    points.pop();
                }
            }
            removeDupEndPts(contour);
            holes.forEach(removeDupEndPts);
            function point_in_segment_2D_colin(inSegPt1, inSegPt2, inOtherPt) {
                if (inSegPt1.x !== inSegPt2.x) {
                    if (inSegPt1.x < inSegPt2.x) {
                        return ((inSegPt1.x <= inOtherPt.x) && (inOtherPt.x <= inSegPt2.x));
                    }
                    else {
                        return ((inSegPt2.x <= inOtherPt.x) && (inOtherPt.x <= inSegPt1.x));
                    }
                }
                else {
                    if (inSegPt1.y < inSegPt2.y) {
                        return ((inSegPt1.y <= inOtherPt.y) && (inOtherPt.y <= inSegPt2.y));
                    }
                    else {
                        return ((inSegPt2.y <= inOtherPt.y) && (inOtherPt.y <= inSegPt1.y));
                    }
                }
            }
            function intersect_segments_2D(inSeg1Pt1, inSeg1Pt2, inSeg2Pt1, inSeg2Pt2, inExcludeAdjacentSegs) {
                var seg1dx = inSeg1Pt2.x - inSeg1Pt1.x, seg1dy = inSeg1Pt2.y - inSeg1Pt1.y;
                var seg2dx = inSeg2Pt2.x - inSeg2Pt1.x, seg2dy = inSeg2Pt2.y - inSeg2Pt1.y;
                var seg1seg2dx = inSeg1Pt1.x - inSeg2Pt1.x;
                var seg1seg2dy = inSeg1Pt1.y - inSeg2Pt1.y;
                var limit = seg1dy * seg2dx - seg1dx * seg2dy;
                var perpSeg1 = seg1dy * seg1seg2dx - seg1dx * seg1seg2dy;
                if (THREE.Math.abs(limit) > Number.EPSILON) {
                    var perpSeg2;
                    if (limit > 0) {
                        if ((perpSeg1 < 0) || (perpSeg1 > limit))
                            return [];
                        perpSeg2 = seg2dy * seg1seg2dx - seg2dx * seg1seg2dy;
                        if ((perpSeg2 < 0) || (perpSeg2 > limit))
                            return [];
                    }
                    else {
                        if ((perpSeg1 > 0) || (perpSeg1 < limit))
                            return [];
                        perpSeg2 = seg2dy * seg1seg2dx - seg2dx * seg1seg2dy;
                        if ((perpSeg2 > 0) || (perpSeg2 < limit))
                            return [];
                    }
                    if (perpSeg2 === 0) {
                        if ((inExcludeAdjacentSegs) &&
                            ((perpSeg1 === 0) || (perpSeg1 === limit)))
                            return [];
                        return [inSeg1Pt1];
                    }
                    if (perpSeg2 === limit) {
                        if ((inExcludeAdjacentSegs) &&
                            ((perpSeg1 === 0) || (perpSeg1 === limit)))
                            return [];
                        return [inSeg1Pt2];
                    }
                    if (perpSeg1 === 0)
                        return [inSeg2Pt1];
                    if (perpSeg1 === limit)
                        return [inSeg2Pt2];
                    var factorSeg1 = perpSeg2 / limit;
                    return [{
                            x: inSeg1Pt1.x + factorSeg1 * seg1dx,
                            y: inSeg1Pt1.y + factorSeg1 * seg1dy
                        }];
                }
                else {
                    if ((perpSeg1 !== 0) ||
                        (seg2dy * seg1seg2dx !== seg2dx * seg1seg2dy))
                        return [];
                    var seg1Pt = ((seg1dx === 0) && (seg1dy === 0));
                    var seg2Pt = ((seg2dx === 0) && (seg2dy === 0));
                    if (seg1Pt && seg2Pt) {
                        if ((inSeg1Pt1.x !== inSeg2Pt1.x) ||
                            (inSeg1Pt1.y !== inSeg2Pt1.y))
                            return [];
                        return [inSeg1Pt1];
                    }
                    if (seg1Pt) {
                        if (!point_in_segment_2D_colin(inSeg2Pt1, inSeg2Pt2, inSeg1Pt1))
                            return [];
                        return [inSeg1Pt1];
                    }
                    if (seg2Pt) {
                        if (!point_in_segment_2D_colin(inSeg1Pt1, inSeg1Pt2, inSeg2Pt1))
                            return [];
                        return [inSeg2Pt1];
                    }
                    var seg1min, seg1max, seg1minVal, seg1maxVal;
                    var seg2min, seg2max, seg2minVal, seg2maxVal;
                    if (seg1dx !== 0) {
                        if (inSeg1Pt1.x < inSeg1Pt2.x) {
                            seg1min = inSeg1Pt1;
                            seg1minVal = inSeg1Pt1.x;
                            seg1max = inSeg1Pt2;
                            seg1maxVal = inSeg1Pt2.x;
                        }
                        else {
                            seg1min = inSeg1Pt2;
                            seg1minVal = inSeg1Pt2.x;
                            seg1max = inSeg1Pt1;
                            seg1maxVal = inSeg1Pt1.x;
                        }
                        if (inSeg2Pt1.x < inSeg2Pt2.x) {
                            seg2min = inSeg2Pt1;
                            seg2minVal = inSeg2Pt1.x;
                            seg2max = inSeg2Pt2;
                            seg2maxVal = inSeg2Pt2.x;
                        }
                        else {
                            seg2min = inSeg2Pt2;
                            seg2minVal = inSeg2Pt2.x;
                            seg2max = inSeg2Pt1;
                            seg2maxVal = inSeg2Pt1.x;
                        }
                    }
                    else {
                        if (inSeg1Pt1.y < inSeg1Pt2.y) {
                            seg1min = inSeg1Pt1;
                            seg1minVal = inSeg1Pt1.y;
                            seg1max = inSeg1Pt2;
                            seg1maxVal = inSeg1Pt2.y;
                        }
                        else {
                            seg1min = inSeg1Pt2;
                            seg1minVal = inSeg1Pt2.y;
                            seg1max = inSeg1Pt1;
                            seg1maxVal = inSeg1Pt1.y;
                        }
                        if (inSeg2Pt1.y < inSeg2Pt2.y) {
                            seg2min = inSeg2Pt1;
                            seg2minVal = inSeg2Pt1.y;
                            seg2max = inSeg2Pt2;
                            seg2maxVal = inSeg2Pt2.y;
                        }
                        else {
                            seg2min = inSeg2Pt2;
                            seg2minVal = inSeg2Pt2.y;
                            seg2max = inSeg2Pt1;
                            seg2maxVal = inSeg2Pt1.y;
                        }
                    }
                    if (seg1minVal <= seg2minVal) {
                        if (seg1maxVal < seg2minVal)
                            return [];
                        if (seg1maxVal === seg2minVal) {
                            if (inExcludeAdjacentSegs)
                                return [];
                            return [seg2min];
                        }
                        if (seg1maxVal <= seg2maxVal)
                            return [seg2min, seg1max];
                        return [seg2min, seg2max];
                    }
                    else {
                        if (seg1minVal > seg2maxVal)
                            return [];
                        if (seg1minVal === seg2maxVal) {
                            if (inExcludeAdjacentSegs)
                                return [];
                            return [seg1min];
                        }
                        if (seg1maxVal <= seg2maxVal)
                            return [seg1min, seg1max];
                        return [seg1min, seg2max];
                    }
                }
            }
            function isPointInsideAngle(inVertex, inLegFromPt, inLegToPt, inOtherPt) {
                var legFromPtX = inLegFromPt.x - inVertex.x, legFromPtY = inLegFromPt.y - inVertex.y;
                var legToPtX = inLegToPt.x - inVertex.x, legToPtY = inLegToPt.y - inVertex.y;
                var otherPtX = inOtherPt.x - inVertex.x, otherPtY = inOtherPt.y - inVertex.y;
                var from2toAngle = legFromPtX * legToPtY - legFromPtY * legToPtX;
                var from2otherAngle = legFromPtX * otherPtY - legFromPtY * otherPtX;
                if (THREE.Math.abs(from2toAngle) > Number.EPSILON) {
                    var other2toAngle = otherPtX * legToPtY - otherPtY * legToPtX;
                    if (from2toAngle > 0) {
                        return ((from2otherAngle >= 0) && (other2toAngle >= 0));
                    }
                    else {
                        return ((from2otherAngle >= 0) || (other2toAngle >= 0));
                    }
                }
                else {
                    return (from2otherAngle > 0);
                }
            }
            function removeHoles(contour, holes) {
                var shape = contour.concat();
                var hole;
                function isCutLineInsideAngles(inShapeIdx, inHoleIdx) {
                    var lastShapeIdx = shape.length - 1;
                    var prevShapeIdx = inShapeIdx - 1;
                    if (prevShapeIdx < 0)
                        prevShapeIdx = lastShapeIdx;
                    var nextShapeIdx = inShapeIdx + 1;
                    if (nextShapeIdx > lastShapeIdx)
                        nextShapeIdx = 0;
                    var insideAngle = isPointInsideAngle(shape[inShapeIdx], shape[prevShapeIdx], shape[nextShapeIdx], hole[inHoleIdx]);
                    if (!insideAngle) {
                        return false;
                    }
                    var lastHoleIdx = hole.length - 1;
                    var prevHoleIdx = inHoleIdx - 1;
                    if (prevHoleIdx < 0)
                        prevHoleIdx = lastHoleIdx;
                    var nextHoleIdx = inHoleIdx + 1;
                    if (nextHoleIdx > lastHoleIdx)
                        nextHoleIdx = 0;
                    insideAngle = isPointInsideAngle(hole[inHoleIdx], hole[prevHoleIdx], hole[nextHoleIdx], shape[inShapeIdx]);
                    if (!insideAngle) {
                        return false;
                    }
                    return true;
                }
                function intersectsShapeEdge(inShapePt, inHolePt) {
                    var sIdx, nextIdx, intersection;
                    for (sIdx = 0; sIdx < shape.length; sIdx++) {
                        nextIdx = sIdx + 1;
                        nextIdx %= shape.length;
                        intersection = intersect_segments_2D(inShapePt, inHolePt, shape[sIdx], shape[nextIdx], true);
                        if (intersection.length > 0)
                            return true;
                    }
                    return false;
                }
                var indepHoles = [];
                function intersectsHoleEdge(inShapePt, inHolePt) {
                    var ihIdx, chkHole, hIdx, nextIdx, intersection;
                    for (ihIdx = 0; ihIdx < indepHoles.length; ihIdx++) {
                        chkHole = holes[indepHoles[ihIdx]];
                        for (hIdx = 0; hIdx < chkHole.length; hIdx++) {
                            nextIdx = hIdx + 1;
                            nextIdx %= chkHole.length;
                            intersection = intersect_segments_2D(inShapePt, inHolePt, chkHole[hIdx], chkHole[nextIdx], true);
                            if (intersection.length > 0)
                                return true;
                        }
                    }
                    return false;
                }
                var holeIndex, shapeIndex, shapePt, holePt, holeIdx, cutKey, failedCuts = [], tmpShape1, tmpShape2, tmpHole1, tmpHole2;
                for (var h = 0, hl = holes.length; h < hl; h++) {
                    indepHoles.push(h);
                }
                var minShapeIndex = 0;
                var counter = indepHoles.length * 2;
                while (indepHoles.length > 0) {
                    counter--;
                    if (counter < 0) {
                        console.log("Infinite Loop! Holes left:" + indepHoles.length + ", Probably Hole outside Shape!");
                        break;
                    }
                    for (shapeIndex = minShapeIndex; shapeIndex < shape.length; shapeIndex++) {
                        shapePt = shape[shapeIndex];
                        holeIndex = -1;
                        for (var h = 0; h < indepHoles.length; h++) {
                            holeIdx = indepHoles[h];
                            cutKey = shapePt.x + ":" + shapePt.y + ":" + holeIdx;
                            if (failedCuts[cutKey] !== undefined)
                                continue;
                            hole = holes[holeIdx];
                            for (var h2 = 0; h2 < hole.length; h2++) {
                                holePt = hole[h2];
                                if (!isCutLineInsideAngles(shapeIndex, h2))
                                    continue;
                                if (intersectsShapeEdge(shapePt, holePt))
                                    continue;
                                if (intersectsHoleEdge(shapePt, holePt))
                                    continue;
                                holeIndex = h2;
                                indepHoles.splice(h, 1);
                                tmpShape1 = shape.slice(0, shapeIndex + 1);
                                tmpShape2 = shape.slice(shapeIndex);
                                tmpHole1 = hole.slice(holeIndex);
                                tmpHole2 = hole.slice(0, holeIndex + 1);
                                shape = tmpShape1.concat(tmpHole1).concat(tmpHole2).concat(tmpShape2);
                                minShapeIndex = shapeIndex;
                                break;
                            }
                            if (holeIndex >= 0)
                                break;
                            failedCuts[cutKey] = true;
                        }
                        if (holeIndex >= 0)
                            break;
                    }
                }
                return shape;
            }
            var i, il, f, face, key, index, allPointsMap = {};
            var allpoints = contour.concat();
            for (var h = 0, hl = holes.length; h < hl; h++) {
                Array.prototype.push.apply(allpoints, holes[h]);
            }
            for (i = 0, il = allpoints.length; i < il; i++) {
                key = allpoints[i].x + ":" + allpoints[i].y;
                if (allPointsMap[key] !== undefined) {
                    console.warn("THREE.Shape: Duplicate point", key, i);
                }
                allPointsMap[key] = i;
            }
            var shapeWithoutHoles = removeHoles(contour, holes);
            var triangles = THREE.ShapeUtils.triangulate(shapeWithoutHoles, false);
            for (i = 0, il = triangles.length; i < il; i++) {
                face = triangles[i];
                for (f = 0; f < 3; f++) {
                    key = face[f].x + ":" + face[f].y;
                    index = allPointsMap[key];
                    if (index !== undefined) {
                        face[f] = index;
                    }
                }
            }
            return triangles.concat();
        },
        isClockWise: function (pts) {
            return THREE.ShapeUtils.area(pts) < 0;
        },
        b2: (function () {
            function b2p0(t, p) {
                var k = 1 - t;
                return k * k * p;
            }
            function b2p1(t, p) {
                return 2 * (1 - t) * t * p;
            }
            function b2p2(t, p) {
                return t * t * p;
            }
            return function b2(t, p0, p1, p2) {
                return b2p0(t, p0) + b2p1(t, p1) + b2p2(t, p2);
            };
        })(),
        b3: (function () {
            function b3p0(t, p) {
                var k = 1 - t;
                return k * k * k * p;
            }
            function b3p1(t, p) {
                var k = 1 - t;
                return 3 * k * k * t * p;
            }
            function b3p2(t, p) {
                var k = 1 - t;
                return 3 * k * t * t * p;
            }
            function b3p3(t, p) {
                return t * t * t * p;
            }
            return function b3(t, p0, p1, p2, p3) {
                return b3p0(t, p0) + b3p1(t, p1) + b3p2(t, p2) + b3p3(t, p3);
            };
        })()
    };
})(THREE || (THREE = {}));
