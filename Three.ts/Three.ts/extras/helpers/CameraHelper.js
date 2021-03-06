var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var CameraHelper = (function (_super) {
        __extends(CameraHelper, _super);
        function CameraHelper(camera) {
            _super.call(this);
            var geometry = new THREE.Geometry();
            var material = new THREE.LineBasicMaterial({ color: 0xffffff, vertexColors: THREE.FaceColors });
            var pointMap = {};
            var hexFrustum = 0xffaa00;
            var hexCone = 0xff0000;
            var hexUp = 0x00aaff;
            var hexTarget = 0xffffff;
            var hexCross = 0x333333;
            addLine("n1", "n2", hexFrustum);
            addLine("n2", "n4", hexFrustum);
            addLine("n4", "n3", hexFrustum);
            addLine("n3", "n1", hexFrustum);
            addLine("f1", "f2", hexFrustum);
            addLine("f2", "f4", hexFrustum);
            addLine("f4", "f3", hexFrustum);
            addLine("f3", "f1", hexFrustum);
            addLine("n1", "f1", hexFrustum);
            addLine("n2", "f2", hexFrustum);
            addLine("n3", "f3", hexFrustum);
            addLine("n4", "f4", hexFrustum);
            addLine("p", "n1", hexCone);
            addLine("p", "n2", hexCone);
            addLine("p", "n3", hexCone);
            addLine("p", "n4", hexCone);
            addLine("u1", "u2", hexUp);
            addLine("u2", "u3", hexUp);
            addLine("u3", "u1", hexUp);
            addLine("c", "t", hexTarget);
            addLine("p", "c", hexCross);
            addLine("cn1", "cn2", hexCross);
            addLine("cn3", "cn4", hexCross);
            addLine("cf1", "cf2", hexCross);
            addLine("cf3", "cf4", hexCross);
            function addLine(a, b, hex) {
                addPoint(a, hex);
                addPoint(b, hex);
            }
            function addPoint(id, hex) {
                geometry.vertices.push(new THREE.Vector3());
                geometry.colors.push(new THREE.Color(hex));
                if (pointMap[id] === undefined) {
                    pointMap[id] = [];
                }
                pointMap[id].push(geometry.vertices.length - 1);
            }
            this.geometry = geometry;
            this.material = material;
            this.camera = camera;
            if (this.camera.updateProjectionMatrix)
                this.camera.updateProjectionMatrix();
            this.matrix = camera.matrixWorld;
            this.matrixAutoUpdate = false;
            this.pointMap = pointMap;
            this.update();
        }
        ;
        CameraHelper.prototype.update = function () {
            var geometry, pointMap;
            var vector = new THREE.Vector3();
            var camera = new THREE.Camera();
            function setPoint(point, x, y, z) {
                vector.set(x, y, z).unproject(camera);
                var points = pointMap[point];
                if (points !== undefined) {
                    for (var i = 0, il = points.length; i < il; i++) {
                        geometry.vertices[points[i]].copy(vector);
                    }
                }
            }
            var func = CameraHelper.prototype.update = function update() {
                geometry = this.geometry;
                pointMap = this.pointMap;
                var w = 1, h = 1;
                camera.projectionMatrix.copy(this.camera.projectionMatrix);
                setPoint("c", 0, 0, -1);
                setPoint("t", 0, 0, 1);
                setPoint("n1", -w, -h, -1);
                setPoint("n2", w, -h, -1);
                setPoint("n3", -w, h, -1);
                setPoint("n4", w, h, -1);
                setPoint("f1", -w, -h, 1);
                setPoint("f2", w, -h, 1);
                setPoint("f3", -w, h, 1);
                setPoint("f4", w, h, 1);
                setPoint("u1", w * 0.7, h * 1.1, -1);
                setPoint("u2", -w * 0.7, h * 1.1, -1);
                setPoint("u3", 0, h * 2, -1);
                setPoint("cf1", -w, 0, 1);
                setPoint("cf2", w, 0, 1);
                setPoint("cf3", 0, -h, 1);
                setPoint("cf4", 0, h, 1);
                setPoint("cn1", -w, 0, -1);
                setPoint("cn2", w, 0, -1);
                setPoint("cn3", 0, -h, -1);
                setPoint("cn4", 0, h, -1);
                geometry.verticesNeedUpdate = true;
            };
            return func.apply(this, arguments);
        };
        return CameraHelper;
    }(THREE.LineSegments));
    THREE.CameraHelper = CameraHelper;
})(THREE || (THREE = {}));
