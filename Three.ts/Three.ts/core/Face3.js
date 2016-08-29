var THREE;
(function (THREE) {
    var Face3 = (function () {
        function Face3(a, b, c, normal, color, materialIndex) {
            if (materialIndex === void 0) { materialIndex = 0; }
            this.a = a;
            this.b = b;
            this.c = c;
            this.materialIndex = materialIndex;
            this.a = a;
            this.b = b;
            this.c = c;
            this.normal = normal instanceof THREE.Vector3 ? normal : new THREE.Vector3();
            this.vertexNormals = Array.isArray(normal) ? normal : [];
            this.color = color instanceof THREE.Color ? color : new THREE.Color();
            this.vertexColors = Array.isArray(color) ? color : [];
        }
        ;
        Face3.prototype.clone = function () {
            return new Face3().copy(this);
        };
        Face3.prototype.copy = function (source) {
            this.a = source.a;
            this.b = source.b;
            this.c = source.c;
            this.normal.copy(source.normal);
            this.color.copy(source.color);
            this.materialIndex = source.materialIndex;
            for (var i = 0, il = source.vertexNormals.length; i < il; i++) {
                this.vertexNormals[i] = source.vertexNormals[i].clone();
            }
            for (var i = 0, il = source.vertexColors.length; i < il; i++) {
                this.vertexColors[i] = source.vertexColors[i].clone();
            }
            return this;
        };
        return Face3;
    }());
    THREE.Face3 = Face3;
})(THREE || (THREE = {}));
