/// <reference path="../../core/buffergeometry.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var WireframeGeometry = (function (_super) {
        __extends(WireframeGeometry, _super);
        function WireframeGeometry(geometry) {
            _super.call(this);
            var edge = [0, 0], hash = {};
            function sortFunction(a, b) {
                return a - b;
            }
            var keys = ['a', 'b', 'c'];
            if (geometry instanceof THREE.Geometry) {
                var vertices_1 = geometry.vertices;
                var faces = geometry.faces;
                var numEdges_1 = 0;
                // allocate maximal size
                var edges = new Uint32Array(6 * faces.length);
                for (var i = 0, l = faces.length; i < l; i++) {
                    var face = faces[i];
                    for (var j = 0; j < 3; j++) {
                        edge[0] = face[keys[j]];
                        edge[1] = face[keys[(j + 1) % 3]];
                        edge.sort(sortFunction);
                        var key = edge.toString();
                        if (hash[key] === undefined) {
                            edges[2 * numEdges_1] = edge[0];
                            edges[2 * numEdges_1 + 1] = edge[1];
                            hash[key] = true;
                            numEdges_1++;
                        }
                    }
                }
                var coords = new Float32Array(numEdges_1 * 2 * 3);
                for (var i = 0, l = numEdges_1; i < l; i++) {
                    for (var j = 0; j < 2; j++) {
                        var vertex = vertices_1[edges[2 * i + j]];
                        var index = 6 * i + 3 * j;
                        coords[index + 0] = vertex.x;
                        coords[index + 1] = vertex.y;
                        coords[index + 2] = vertex.z;
                    }
                }
                this.addAttribute('position', new THREE.BufferAttribute(coords, 3));
            }
            else if (geometry instanceof THREE.BufferGeometry) {
                if (geometry.index !== null) {
                    // Indexed BufferGeometry
                    var indices = geometry.index.array;
                    var vertices_2 = geometry.attributes.position;
                    var groups = geometry.groups;
                    var numEdges_2 = 0;
                    if (groups.length === 0) {
                        geometry.addGroup(0, indices.length);
                    }
                    // allocate maximal size
                    var edges = new Uint32Array(2 * indices.length);
                    for (var o = 0, ol = groups.length; o < ol; ++o) {
                        var group = groups[o];
                        var start = group.start;
                        var count = group.count;
                        for (var i = start, il = start + count; i < il; i += 3) {
                            for (var j = 0; j < 3; j++) {
                                edge[0] = indices[i + j];
                                edge[1] = indices[i + (j + 1) % 3];
                                edge.sort(sortFunction);
                                var key = edge.toString();
                                if (hash[key] === undefined) {
                                    edges[2 * numEdges_2] = edge[0];
                                    edges[2 * numEdges_2 + 1] = edge[1];
                                    hash[key] = true;
                                    numEdges_2++;
                                }
                            }
                        }
                    }
                    var coords = new Float32Array(numEdges_2 * 2 * 3);
                    for (var i = 0, l = numEdges_2; i < l; i++) {
                        for (var j = 0; j < 2; j++) {
                            var index = 6 * i + 3 * j;
                            var index2 = edges[2 * i + j];
                            coords[index + 0] = vertices_2.getX(index2);
                            coords[index + 1] = vertices_2.getY(index2);
                            coords[index + 2] = vertices_2.getZ(index2);
                        }
                    }
                    this.addAttribute('position', new THREE.BufferAttribute(coords, 3));
                }
                else {
                    // non-indexed BufferGeometry 
                    var vertices = geometry.attributes.position.array;
                    var numEdges = vertices.length / 3;
                    var numTris = numEdges / 3;
                    var coords = new Float32Array(numEdges * 2 * 3);
                    for (var i = 0, l = numTris; i < l; i++) {
                        for (var j = 0; j < 3; j++) {
                            var index = 18 * i + 6 * j;
                            var index1 = 9 * i + 3 * j;
                            coords[index + 0] = vertices[index1];
                            coords[index + 1] = vertices[index1 + 1];
                            coords[index + 2] = vertices[index1 + 2];
                            var index2 = 9 * i + 3 * ((j + 1) % 3);
                            coords[index + 3] = vertices[index2];
                            coords[index + 4] = vertices[index2 + 1];
                            coords[index + 5] = vertices[index2 + 2];
                        }
                    }
                    this.addAttribute('position', new THREE.BufferAttribute(coords, 3));
                }
            }
        }
        ;
        return WireframeGeometry;
    }(THREE.BufferGeometry));
    THREE.WireframeGeometry = WireframeGeometry;
})(THREE || (THREE = {}));
