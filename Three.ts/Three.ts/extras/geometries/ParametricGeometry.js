var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var ParametricGeometry = (function (_super) {
        __extends(ParametricGeometry, _super);
        function ParametricGeometry(func, slices, stacks) {
            _super.call(this);
            this.type = 'ParametricGeometry';
            this.parameters = {
                func: func,
                slices: slices,
                stacks: stacks
            };
            var verts = this.vertices;
            var faces = this.faces;
            var uvs = this.faceVertexUvs[0];
            var i, j, p;
            var u, v;
            var sliceCount = slices + 1;
            for (i = 0; i <= stacks; i++) {
                v = i / stacks;
                for (j = 0; j <= slices; j++) {
                    u = j / slices;
                    p = func(u, v);
                    verts.push(p);
                }
            }
            var a, b, c, d;
            var uva, uvb, uvc, uvd;
            for (i = 0; i < stacks; i++) {
                for (j = 0; j < slices; j++) {
                    a = i * sliceCount + j;
                    b = i * sliceCount + j + 1;
                    c = (i + 1) * sliceCount + j + 1;
                    d = (i + 1) * sliceCount + j;
                    uva = new THREE.Vector2(j / slices, i / stacks);
                    uvb = new THREE.Vector2((j + 1) / slices, i / stacks);
                    uvc = new THREE.Vector2((j + 1) / slices, (i + 1) / stacks);
                    uvd = new THREE.Vector2(j / slices, (i + 1) / stacks);
                    faces.push(new THREE.Face3(a, b, d));
                    uvs.push([uva, uvb, uvd]);
                    faces.push(new THREE.Face3(b, c, d));
                    uvs.push([uvb.clone(), uvc, uvd.clone()]);
                }
            }
            this.computeFaceNormals();
            this.computeVertexNormals();
        }
        ;
        return ParametricGeometry;
    }(THREE.Geometry));
    THREE.ParametricGeometry = ParametricGeometry;
})(THREE || (THREE = {}));
