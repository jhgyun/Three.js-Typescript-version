var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var ExtrudeGeometry = (function (_super) {
        __extends(ExtrudeGeometry, _super);
        function ExtrudeGeometry(ashapes, options) {
            _super.call(this);
            var shapes = ashapes;
            if (typeof (shapes) === "undefined") {
                shapes = [];
                return;
            }
            this.type = 'ExtrudeGeometry';
            shapes = Array.isArray(shapes) ? shapes : [shapes];
            this.addShapeList(shapes, options);
            this.computeFaceNormals();
        }
        ;
        ExtrudeGeometry.prototype.addShapeList = function (shapes, options) {
            var sl = shapes.length;
            for (var s = 0; s < sl; s++) {
                var shape = shapes[s];
                this.addShape(shape, options);
            }
        };
        ;
        ExtrudeGeometry.prototype.addShape = function (shape, options) {
            var amount = options.amount !== undefined ? options.amount : 100;
            var bevelThickness = options.bevelThickness !== undefined ? options.bevelThickness : 6;
            var bevelSize = options.bevelSize !== undefined ? options.bevelSize : bevelThickness - 2;
            var bevelSegments = options.bevelSegments !== undefined ? options.bevelSegments : 3;
            var bevelEnabled = options.bevelEnabled !== undefined ? options.bevelEnabled : true;
            var curveSegments = options.curveSegments !== undefined ? options.curveSegments : 12;
            var steps = options.steps !== undefined ? options.steps : 1;
            var extrudePath = options.extrudePath;
            var extrudePts, extrudeByPath = false;
            var uvgen = options.UVGenerator !== undefined ? options.UVGenerator : ExtrudeGeometry.WorldUVGenerator;
            var splineTube, binormal, normal, position2;
            if (extrudePath) {
                extrudePts = extrudePath.getSpacedPoints(steps);
                extrudeByPath = true;
                bevelEnabled = false;
                splineTube = options.frames !== undefined ? options.frames : new THREE.TubeGeometry.FrenetFrames(extrudePath, steps, false);
                binormal = new THREE.Vector3();
                normal = new THREE.Vector3();
                position2 = new THREE.Vector3();
            }
            if (!bevelEnabled) {
                bevelSegments = 0;
                bevelThickness = 0;
                bevelSize = 0;
            }
            var ahole, h, hl;
            var scope = this;
            var shapesOffset = this.vertices.length;
            var shapePoints = shape.extractPoints(curveSegments);
            var vertices = shapePoints.shape;
            var holes = shapePoints.holes;
            var reverse = !THREE.ShapeUtils.isClockWise(vertices);
            if (reverse) {
                vertices = vertices.reverse();
                for (h = 0, hl = holes.length; h < hl; h++) {
                    ahole = holes[h];
                    if (THREE.ShapeUtils.isClockWise(ahole)) {
                        holes[h] = ahole.reverse();
                    }
                }
                reverse = false;
            }
            var faces = THREE.ShapeUtils.triangulateShape(vertices, holes);
            var contour = vertices;
            for (h = 0, hl = holes.length; h < hl; h++) {
                ahole = holes[h];
                vertices = vertices.concat(ahole);
            }
            function scalePt2(pt, vec, size) {
                if (!vec)
                    console.error("THREE.ExtrudeGeometry: vec does not exist");
                return vec.clone().multiplyScalar(size).add(pt);
            }
            var b, bs, t, z, vert, vlen = vertices.length, face, flen = faces.length;
            function getBevelVec(inPt, inPrev, inNext) {
                var v_trans_x, v_trans_y, shrink_by = 1;
                var v_prev_x = inPt.x - inPrev.x, v_prev_y = inPt.y - inPrev.y;
                var v_next_x = inNext.x - inPt.x, v_next_y = inNext.y - inPt.y;
                var v_prev_lensq = (v_prev_x * v_prev_x + v_prev_y * v_prev_y);
                var collinear0 = (v_prev_x * v_next_y - v_prev_y * v_next_x);
                if (THREE.Math.abs(collinear0) > Number.EPSILON) {
                    var v_prev_len = THREE.Math.sqrt(v_prev_lensq);
                    var v_next_len = THREE.Math.sqrt(v_next_x * v_next_x + v_next_y * v_next_y);
                    var ptPrevShift_x = (inPrev.x - v_prev_y / v_prev_len);
                    var ptPrevShift_y = (inPrev.y + v_prev_x / v_prev_len);
                    var ptNextShift_x = (inNext.x - v_next_y / v_next_len);
                    var ptNextShift_y = (inNext.y + v_next_x / v_next_len);
                    var sf = ((ptNextShift_x - ptPrevShift_x) * v_next_y -
                        (ptNextShift_y - ptPrevShift_y) * v_next_x) /
                        (v_prev_x * v_next_y - v_prev_y * v_next_x);
                    v_trans_x = (ptPrevShift_x + v_prev_x * sf - inPt.x);
                    v_trans_y = (ptPrevShift_y + v_prev_y * sf - inPt.y);
                    var v_trans_lensq = (v_trans_x * v_trans_x + v_trans_y * v_trans_y);
                    if (v_trans_lensq <= 2) {
                        return new THREE.Vector2(v_trans_x, v_trans_y);
                    }
                    else {
                        shrink_by = THREE.Math.sqrt(v_trans_lensq / 2);
                    }
                }
                else {
                    var direction_eq = false;
                    if (v_prev_x > Number.EPSILON) {
                        if (v_next_x > Number.EPSILON) {
                            direction_eq = true;
                        }
                    }
                    else {
                        if (v_prev_x < -Number.EPSILON) {
                            if (v_next_x < -Number.EPSILON) {
                                direction_eq = true;
                            }
                        }
                        else {
                            if (THREE.Math.sign(v_prev_y) === THREE.Math.sign(v_next_y)) {
                                direction_eq = true;
                            }
                        }
                    }
                    if (direction_eq) {
                        v_trans_x = -v_prev_y;
                        v_trans_y = v_prev_x;
                        shrink_by = THREE.Math.sqrt(v_prev_lensq);
                    }
                    else {
                        v_trans_x = v_prev_x;
                        v_trans_y = v_prev_y;
                        shrink_by = THREE.Math.sqrt(v_prev_lensq / 2);
                    }
                }
                return new THREE.Vector2(v_trans_x / shrink_by, v_trans_y / shrink_by);
            }
            var contourMovements = [];
            for (var i = 0, il = contour.length, j = il - 1, k = i + 1; i < il; i++, j++, k++) {
                if (j === il)
                    j = 0;
                if (k === il)
                    k = 0;
                contourMovements[i] = getBevelVec(contour[i], contour[j], contour[k]);
            }
            var holesMovements = [], oneHoleMovements, verticesMovements = contourMovements.concat();
            for (h = 0, hl = holes.length; h < hl; h++) {
                ahole = holes[h];
                oneHoleMovements = [];
                for (i = 0, il = ahole.length, j = il - 1, k = i + 1; i < il; i++, j++, k++) {
                    if (j === il)
                        j = 0;
                    if (k === il)
                        k = 0;
                    oneHoleMovements[i] = getBevelVec(ahole[i], ahole[j], ahole[k]);
                }
                holesMovements.push(oneHoleMovements);
                verticesMovements = verticesMovements.concat(oneHoleMovements);
            }
            for (b = 0; b < bevelSegments; b++) {
                t = b / bevelSegments;
                z = bevelThickness * (1 - t);
                bs = bevelSize * (THREE.Math.sin(t * THREE.Math.PI / 2));
                for (i = 0, il = contour.length; i < il; i++) {
                    vert = scalePt2(contour[i], contourMovements[i], bs);
                    v(vert.x, vert.y, -z);
                }
                for (h = 0, hl = holes.length; h < hl; h++) {
                    ahole = holes[h];
                    oneHoleMovements = holesMovements[h];
                    for (i = 0, il = ahole.length; i < il; i++) {
                        vert = scalePt2(ahole[i], oneHoleMovements[i], bs);
                        v(vert.x, vert.y, -z);
                    }
                }
            }
            bs = bevelSize;
            for (i = 0; i < vlen; i++) {
                vert = bevelEnabled ? scalePt2(vertices[i], verticesMovements[i], bs) : vertices[i];
                if (!extrudeByPath) {
                    v(vert.x, vert.y, 0);
                }
                else {
                    normal.copy(splineTube.normals[0]).multiplyScalar(vert.x);
                    binormal.copy(splineTube.binormals[0]).multiplyScalar(vert.y);
                    position2.copy(extrudePts[0]).add(normal).add(binormal);
                    v(position2.x, position2.y, position2.z);
                }
            }
            var s;
            for (s = 1; s <= steps; s++) {
                for (i = 0; i < vlen; i++) {
                    vert = bevelEnabled ? scalePt2(vertices[i], verticesMovements[i], bs) : vertices[i];
                    if (!extrudeByPath) {
                        v(vert.x, vert.y, amount / steps * s);
                    }
                    else {
                        normal.copy(splineTube.normals[s]).multiplyScalar(vert.x);
                        binormal.copy(splineTube.binormals[s]).multiplyScalar(vert.y);
                        position2.copy(extrudePts[s]).add(normal).add(binormal);
                        v(position2.x, position2.y, position2.z);
                    }
                }
            }
            for (b = bevelSegments - 1; b >= 0; b--) {
                t = b / bevelSegments;
                z = bevelThickness * (1 - t);
                bs = bevelSize * THREE.Math.sin(t * THREE.Math.PI / 2);
                for (i = 0, il = contour.length; i < il; i++) {
                    vert = scalePt2(contour[i], contourMovements[i], bs);
                    v(vert.x, vert.y, amount + z);
                }
                for (h = 0, hl = holes.length; h < hl; h++) {
                    ahole = holes[h];
                    oneHoleMovements = holesMovements[h];
                    for (i = 0, il = ahole.length; i < il; i++) {
                        vert = scalePt2(ahole[i], oneHoleMovements[i], bs);
                        if (!extrudeByPath) {
                            v(vert.x, vert.y, amount + z);
                        }
                        else {
                            v(vert.x, vert.y + extrudePts[steps - 1].y, extrudePts[steps - 1].x + z);
                        }
                    }
                }
            }
            buildLidFaces();
            buildSideFaces();
            function buildLidFaces() {
                if (bevelEnabled) {
                    var layer = 0;
                    var offset = vlen * layer;
                    for (i = 0; i < flen; i++) {
                        face = faces[i];
                        f3(face[2] + offset, face[1] + offset, face[0] + offset);
                    }
                    layer = steps + bevelSegments * 2;
                    offset = vlen * layer;
                    for (i = 0; i < flen; i++) {
                        face = faces[i];
                        f3(face[0] + offset, face[1] + offset, face[2] + offset);
                    }
                }
                else {
                    for (i = 0; i < flen; i++) {
                        face = faces[i];
                        f3(face[2], face[1], face[0]);
                    }
                    for (i = 0; i < flen; i++) {
                        face = faces[i];
                        f3(face[0] + vlen * steps, face[1] + vlen * steps, face[2] + vlen * steps);
                    }
                }
            }
            function buildSideFaces() {
                var layeroffset = 0;
                sidewalls(contour, layeroffset);
                layeroffset += contour.length;
                for (h = 0, hl = holes.length; h < hl; h++) {
                    ahole = holes[h];
                    sidewalls(ahole, layeroffset);
                    layeroffset += ahole.length;
                }
            }
            function sidewalls(contour, layeroffset) {
                var j, k;
                i = contour.length;
                while (--i >= 0) {
                    j = i;
                    k = i - 1;
                    if (k < 0)
                        k = contour.length - 1;
                    var s = 0, sl = steps + bevelSegments * 2;
                    for (s = 0; s < sl; s++) {
                        var slen1 = vlen * s;
                        var slen2 = vlen * (s + 1);
                        var a = layeroffset + j + slen1, b = layeroffset + k + slen1, c = layeroffset + k + slen2, d = layeroffset + j + slen2;
                        f4(a, b, c, d, contour, s, sl, j, k);
                    }
                }
            }
            function v(x, y, z) {
                scope.vertices.push(new THREE.Vector3(x, y, z));
            }
            function f3(a, b, c) {
                a += shapesOffset;
                b += shapesOffset;
                c += shapesOffset;
                scope.faces.push(new THREE.Face3(a, b, c, null, null, 0));
                var uvs = uvgen.generateTopUV(scope, a, b, c);
                scope.faceVertexUvs[0].push(uvs);
            }
            function f4(a, b, c, d, wallContour, stepIndex, stepsLength, contourIndex1, contourIndex2) {
                a += shapesOffset;
                b += shapesOffset;
                c += shapesOffset;
                d += shapesOffset;
                scope.faces.push(new THREE.Face3(a, b, d, null, null, 1));
                scope.faces.push(new THREE.Face3(b, c, d, null, null, 1));
                var uvs = uvgen.generateSideWallUV(scope, a, b, c, d);
                scope.faceVertexUvs[0].push([uvs[0], uvs[1], uvs[3]]);
                scope.faceVertexUvs[0].push([uvs[1], uvs[2], uvs[3]]);
            }
        };
        ;
        ExtrudeGeometry.WorldUVGenerator = {
            generateTopUV: function (geometry, indexA, indexB, indexC) {
                var vertices = geometry.vertices;
                var a = vertices[indexA];
                var b = vertices[indexB];
                var c = vertices[indexC];
                return [
                    new THREE.Vector2(a.x, a.y),
                    new THREE.Vector2(b.x, b.y),
                    new THREE.Vector2(c.x, c.y)
                ];
            },
            generateSideWallUV: function (geometry, indexA, indexB, indexC, indexD) {
                var vertices = geometry.vertices;
                var a = vertices[indexA];
                var b = vertices[indexB];
                var c = vertices[indexC];
                var d = vertices[indexD];
                if (THREE.Math.abs(a.y - b.y) < 0.01) {
                    return [
                        new THREE.Vector2(a.x, 1 - a.z),
                        new THREE.Vector2(b.x, 1 - b.z),
                        new THREE.Vector2(c.x, 1 - c.z),
                        new THREE.Vector2(d.x, 1 - d.z)
                    ];
                }
                else {
                    return [
                        new THREE.Vector2(a.y, 1 - a.z),
                        new THREE.Vector2(b.y, 1 - b.z),
                        new THREE.Vector2(c.y, 1 - c.z),
                        new THREE.Vector2(d.y, 1 - d.z)
                    ];
                }
            }
        };
        return ExtrudeGeometry;
    }(THREE.Geometry));
    THREE.ExtrudeGeometry = ExtrudeGeometry;
})(THREE || (THREE = {}));
