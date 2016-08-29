var THREE;
(function (THREE) {
    var MultiMaterial = (function () {
        function MultiMaterial(materials) {
            this.uuid = THREE.Math.generateUUID();
            this.type = 'MultiMaterial';
            this.visible = true;
            this.materials = materials instanceof Array ? materials : [];
        }
        ;
        MultiMaterial.prototype.toJSON = function (meta) {
            var output = {
                metadata: {
                    version: 4.2,
                    type: 'material',
                    generator: 'MaterialExporter'
                },
                uuid: this.uuid,
                type: this.type,
                materials: []
            };
            var materials = this.materials;
            for (var i = 0, l = materials.length; i < l; i++) {
                var material = materials[i].toJSON(meta);
                delete material.metadata;
                output.materials.push(material);
            }
            output.visible = this.visible;
            return output;
        };
        MultiMaterial.prototype.clone = function () {
            var material = new this.constructor();
            for (var i = 0; i < this.materials.length; i++) {
                material.materials.push(this.materials[i].clone());
            }
            material.visible = this.visible;
            return material;
        };
        return MultiMaterial;
    }());
    THREE.MultiMaterial = MultiMaterial;
})(THREE || (THREE = {}));
