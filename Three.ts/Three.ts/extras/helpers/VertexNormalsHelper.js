/// <reference path="../../objects/linesegments.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 * @author WestLangley / http://github.com/WestLangley
*/
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var VertexNormalsHelper = (function (_super) {
        __extends(VertexNormalsHelper, _super);
        function VertexNormalsHelper(object, size, hex, linewidth) {
            _super.call(this);
            this.object = object;
            this.size = (size !== undefined) ? size : 1;
            var color = (hex !== undefined) ? hex : 0xff0000;
            var width = (linewidth !== undefined) ? linewidth : 1;
            //
            var nNormals = 0;
            var objGeometry = this.object.geometry;
            if (objGeometry instanceof THREE.Geometry) {
                nNormals = objGeometry.faces.length * 3;
            }
            else if (objGeometry instanceof THREE.BufferGeometry) {
                nNormals = objGeometry.attributes.normal.count;
            }
            //
            var geometry = new THREE.BufferGeometry();
            var positions = new THREE.Float32Attribute(nNormals * 2 * 3, 3);
            geometry.addAttribute('position', positions);
            this.geometry = geometry;
            this.material = new THREE.LineBasicMaterial({ color: color, linewidth: width });
            // 
            this.matrixAutoUpdate = false;
            this.update();
        }
        VertexNormalsHelper.prototype.update = function () {
            var v1 = VertexNormalsHelper["__update_v1"] || (VertexNormalsHelper["__update_v1"] = new THREE.Vector3());
            var v2 = VertexNormalsHelper["__update_v2"] || (VertexNormalsHelper["__update_v2"] = new THREE.Vector3());
            var normalMatrix = VertexNormalsHelper["__update_normalMatrix"] || (VertexNormalsHelper["__update_normalMatrix"] = new THREE.Matrix3());
            var keys = ['a', 'b', 'c'];
            this.object.updateMatrixWorld(true);
            normalMatrix.getNormalMatrix(this.object.matrixWorld);
            var matrixWorld = this.object.matrixWorld;
            var position = this.geometry.attributes.position;
            //
            var objGeometry = this.object.geometry;
            if (objGeometry instanceof THREE.Geometry) {
                var vertices = objGeometry.vertices;
                var faces = objGeometry.faces;
                var idx = 0;
                for (var i = 0, l = faces.length; i < l; i++) {
                    var face = faces[i];
                    for (var j = 0, jl = face.vertexNormals.length; j < jl; j++) {
                        var vertex = vertices[face[keys[j]]];
                        var normal = face.vertexNormals[j];
                        v1.copy(vertex).applyMatrix4(matrixWorld);
                        v2.copy(normal).applyMatrix3(normalMatrix).normalize().multiplyScalar(this.size).add(v1);
                        position.setXYZ(idx, v1.x, v1.y, v1.z);
                        idx = idx + 1;
                        position.setXYZ(idx, v2.x, v2.y, v2.z);
                        idx = idx + 1;
                    }
                }
            }
            else if (objGeometry instanceof THREE.BufferGeometry) {
                var objPos = objGeometry.attributes.position;
                var objNorm = objGeometry.attributes.normal;
                var idx = 0;
                // for simplicity, ignore index and drawcalls, and render every normal
                for (var j_1 = 0, jl_1 = objPos.count; j_1 < jl_1; j_1++) {
                    v1.set(objPos.getX(j_1), objPos.getY(j_1), objPos.getZ(j_1)).applyMatrix4(matrixWorld);
                    v2.set(objNorm.getX(j_1), objNorm.getY(j_1), objNorm.getZ(j_1));
                    v2.applyMatrix3(normalMatrix).normalize().multiplyScalar(this.size).add(v1);
                    position.setXYZ(idx, v1.x, v1.y, v1.z);
                    idx = idx + 1;
                    position.setXYZ(idx, v2.x, v2.y, v2.z);
                    idx = idx + 1;
                }
            }
            position.needsUpdate = true;
            return this;
        };
        return VertexNormalsHelper;
    }(THREE.LineSegments));
    THREE.VertexNormalsHelper = VertexNormalsHelper;
})(THREE || (THREE = {}));
