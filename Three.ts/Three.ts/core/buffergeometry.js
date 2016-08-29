var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var BufferGeometry = (function (_super) {
        __extends(BufferGeometry, _super);
        function BufferGeometry() {
            _super.call(this);
            this.type = 'BufferGeometry';
            this.index = null;
            this.attributes = {};
            this.morphAttributes = {};
            this.groups = [];
            this.boundingBox = null;
            this.boundingSphere = null;
            this.drawRange = { start: 0, count: Infinity };
            this._id = THREE.GeometryIdCount++;
        }
        Object.defineProperty(BufferGeometry.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        BufferGeometry.prototype.getIndex = function () {
            return this.index;
        };
        BufferGeometry.prototype.setIndex = function (index) {
            this.index = index;
        };
        BufferGeometry.prototype.addAttribute = function (name, attribute) {
            this.attributes[name] = attribute;
            return this;
        };
        BufferGeometry.prototype.getAttribute = function (name) {
            return this.attributes[name];
        };
        BufferGeometry.prototype.removeAttribute = function (name) {
            delete this.attributes[name];
            return this;
        };
        BufferGeometry.prototype.addGroup = function (start, count, materialIndex) {
            if (materialIndex === void 0) { materialIndex = 0; }
            this.groups.push({
                start: start,
                count: count,
                materialIndex: materialIndex
            });
        };
        BufferGeometry.prototype.clearGroups = function () {
            this.groups = [];
        };
        BufferGeometry.prototype.setDrawRange = function (start, count) {
            this.drawRange.start = start;
            this.drawRange.count = count;
        };
        BufferGeometry.prototype.applyMatrix = function (matrix) {
            var position = this.attributes.position;
            if (position !== undefined) {
                matrix.applyToVector3Array(position.array);
                position.needsUpdate = true;
            }
            var normal = this.attributes.normal;
            if (normal !== undefined) {
                var normalMatrix = new THREE.Matrix3().getNormalMatrix(matrix);
                normalMatrix.applyToVector3Array(normal.array);
                normal.needsUpdate = true;
            }
            if (this.boundingBox !== null) {
                this.computeBoundingBox();
            }
            if (this.boundingSphere !== null) {
                this.computeBoundingSphere();
            }
            return this;
        };
        BufferGeometry.prototype.rotateX = function (angle) {
            var m1 = BufferGeometry[".rotateX.m1"] || (BufferGeometry[".rotateX.m1"] = new THREE.Matrix4());
            m1.makeRotationX(angle);
            this.applyMatrix(m1);
            return this;
        };
        BufferGeometry.prototype.rotateY = function (angle) {
            var m1 = BufferGeometry[".rotateY.m1"] || (BufferGeometry[".rotateY.m1"] = new THREE.Matrix4());
            m1.makeRotationY(angle);
            this.applyMatrix(m1);
            return this;
        };
        BufferGeometry.prototype.rotateZ = function (angle) {
            var m1 = BufferGeometry[".rotateZ.m1"] || (BufferGeometry[".rotateZ.m1"] = new THREE.Matrix4());
            m1.makeRotationZ(angle);
            this.applyMatrix(m1);
            return this;
        };
        BufferGeometry.prototype.translate = function (x, y, z) {
            var m1 = BufferGeometry[".translate.m1"] || (BufferGeometry[".translate.m1"] = new THREE.Matrix4());
            m1.makeTranslation(x, y, z);
            this.applyMatrix(m1);
            return this;
        };
        BufferGeometry.prototype.scale = function (x, y, z) {
            var m1 = BufferGeometry[".scale.m1"] || (BufferGeometry[".scale.m1"] = new THREE.Matrix4());
            m1.makeScale(x, y, z);
            this.applyMatrix(m1);
            return this;
        };
        BufferGeometry.prototype.lookAt = function (vector) {
            var obj = BufferGeometry[".lookAt.obj"] || (BufferGeometry[".lookAt.obj"] = new THREE.Object3D());
            obj.lookAt(vector);
            obj.updateMatrix();
            return this.applyMatrix(obj.matrix);
        };
        BufferGeometry.prototype.center = function () {
            this.computeBoundingBox();
            var offset = this.boundingBox.center().negate();
            this.translate(offset.x, offset.y, offset.z);
            return offset;
        };
        BufferGeometry.prototype.setFromObject = function (object) {
            var geometry = object.geometry;
            if (object instanceof THREE.Points || object instanceof THREE.Line) {
                var positions = new THREE.Float32Attribute(geometry.vertices.length * 3, 3);
                var colors = new THREE.Float32Attribute(geometry.colors.length * 3, 3);
                this.addAttribute('position', positions.copyVector3sArray(geometry.vertices));
                this.addAttribute('color', colors.copyColorsArray(geometry.colors));
                if (geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length) {
                    var lineDistances = new THREE.Float32Attribute(geometry.lineDistances.length, 1);
                    this.addAttribute('lineDistance', lineDistances.copyArray(geometry.lineDistances));
                }
                if (geometry.boundingSphere !== null) {
                    this.boundingSphere = geometry.boundingSphere.clone();
                }
                if (geometry.boundingBox !== null) {
                    this.boundingBox = geometry.boundingBox.clone();
                }
            }
            else if (object instanceof THREE.Mesh) {
                if (geometry instanceof THREE.Geometry) {
                    this.fromGeometry(geometry);
                }
            }
            return this;
        };
        BufferGeometry.prototype.updateFromObject = function (object) {
            var geometry = object.geometry;
            if (object instanceof THREE.Mesh) {
                var direct = geometry.__directGeometry;
                if (direct === undefined || geometry.elementsNeedUpdate === true) {
                    return this.fromGeometry(geometry);
                }
                direct.verticesNeedUpdate = geometry.verticesNeedUpdate || geometry.elementsNeedUpdate;
                direct.normalsNeedUpdate = geometry.normalsNeedUpdate || geometry.elementsNeedUpdate;
                direct.colorsNeedUpdate = geometry.colorsNeedUpdate || geometry.elementsNeedUpdate;
                direct.uvsNeedUpdate = geometry.uvsNeedUpdate || geometry.elementsNeedUpdate;
                direct.groupsNeedUpdate = geometry.groupsNeedUpdate || geometry.elementsNeedUpdate;
                geometry.elementsNeedUpdate = false;
                geometry.verticesNeedUpdate = false;
                geometry.normalsNeedUpdate = false;
                geometry.colorsNeedUpdate = false;
                geometry.uvsNeedUpdate = false;
                geometry.groupsNeedUpdate = false;
                geometry = direct;
            }
            var attribute;
            if (geometry.verticesNeedUpdate === true) {
                attribute = this.attributes.position;
                if (attribute !== undefined) {
                    attribute.copyVector3sArray(geometry.vertices);
                    attribute.needsUpdate = true;
                }
                geometry.verticesNeedUpdate = false;
            }
            if (geometry.normalsNeedUpdate === true) {
                attribute = this.attributes.normal;
                if (attribute !== undefined) {
                    attribute.copyVector3sArray(geometry.normals);
                    attribute.needsUpdate = true;
                }
                geometry.normalsNeedUpdate = false;
            }
            if (geometry.colorsNeedUpdate === true) {
                attribute = this.attributes.color;
                if (attribute !== undefined) {
                    attribute.copyColorsArray(geometry.colors);
                    attribute.needsUpdate = true;
                }
                geometry.colorsNeedUpdate = false;
            }
            if (geometry.uvsNeedUpdate) {
                attribute = this.attributes.uv;
                if (attribute !== undefined) {
                    attribute.copyVector2sArray(geometry.uvs);
                    attribute.needsUpdate = true;
                }
                geometry.uvsNeedUpdate = false;
            }
            if (geometry.lineDistancesNeedUpdate) {
                attribute = this.attributes.lineDistance;
                if (attribute !== undefined) {
                    attribute.copyArray(geometry.lineDistances);
                    attribute.needsUpdate = true;
                }
                geometry.lineDistancesNeedUpdate = false;
            }
            if (geometry.groupsNeedUpdate) {
                geometry.computeGroups(object.geometry);
                this.groups = geometry.groups;
                geometry.groupsNeedUpdate = false;
            }
            return this;
        };
        BufferGeometry.prototype.fromGeometry = function (geometry) {
            geometry.__directGeometry = new THREE.DirectGeometry().fromGeometry(geometry);
            return this.fromDirectGeometry(geometry.__directGeometry);
        };
        BufferGeometry.prototype.fromDirectGeometry = function (geometry) {
            var positions = new Float32Array(geometry.vertices.length * 3);
            this.addAttribute('position', new THREE.BufferAttribute(positions, 3).copyVector3sArray(geometry.vertices));
            if (geometry.normals.length > 0) {
                var normals = new Float32Array(geometry.normals.length * 3);
                this.addAttribute('normal', new THREE.BufferAttribute(normals, 3).copyVector3sArray(geometry.normals));
            }
            if (geometry.colors.length > 0) {
                var colors = new Float32Array(geometry.colors.length * 3);
                this.addAttribute('color', new THREE.BufferAttribute(colors, 3).copyColorsArray(geometry.colors));
            }
            if (geometry.uvs.length > 0) {
                var uvs = new Float32Array(geometry.uvs.length * 2);
                this.addAttribute('uv', new THREE.BufferAttribute(uvs, 2).copyVector2sArray(geometry.uvs));
            }
            if (geometry.uvs2.length > 0) {
                var uvs2 = new Float32Array(geometry.uvs2.length * 2);
                this.addAttribute('uv2', new THREE.BufferAttribute(uvs2, 2).copyVector2sArray(geometry.uvs2));
            }
            if (geometry.indices.length > 0) {
                var TypeArray = geometry.vertices.length > 65535 ? Uint32Array : Uint16Array;
                var indices = new TypeArray(geometry.indices.length * 3);
                this.setIndex(new THREE.BufferAttribute(indices, 1).copyIndicesArray(geometry.indices));
            }
            this.groups = geometry.groups;
            for (var name in geometry.morphTargets) {
                var array = [];
                var morphTargets = geometry.morphTargets[name];
                for (var i = 0, l = morphTargets.length; i < l; i++) {
                    var morphTarget = morphTargets[i];
                    var attribute = new THREE.Float32Attribute(morphTarget.length * 3, 3);
                    array.push(attribute.copyVector3sArray(morphTarget));
                }
                this.morphAttributes[name] = array;
            }
            if (geometry.skinIndices.length > 0) {
                var skinIndices = new THREE.Float32Attribute(geometry.skinIndices.length * 4, 4);
                this.addAttribute('skinIndex', skinIndices.copyVector4sArray(geometry.skinIndices));
            }
            if (geometry.skinWeights.length > 0) {
                var skinWeights = new THREE.Float32Attribute(geometry.skinWeights.length * 4, 4);
                this.addAttribute('skinWeight', skinWeights.copyVector4sArray(geometry.skinWeights));
            }
            if (geometry.boundingSphere !== null) {
                this.boundingSphere = geometry.boundingSphere.clone();
            }
            if (geometry.boundingBox !== null) {
                this.boundingBox = geometry.boundingBox.clone();
            }
            return this;
        };
        BufferGeometry.prototype.computeBoundingBox = function () {
            if (this.boundingBox === null) {
                this.boundingBox = new THREE.Box3();
            }
            var positions = this.attributes.position.array;
            if (positions !== undefined) {
                this.boundingBox.setFromArray(positions);
            }
            else {
                this.boundingBox.makeEmpty();
            }
            if (isNaN(this.boundingBox.min.x)
                || isNaN(this.boundingBox.min.y)
                || isNaN(this.boundingBox.min.z)) {
                console.error('THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
            }
        };
        BufferGeometry.prototype.computeBoundingSphere = function () {
            var box = new THREE.Box3();
            var vector = new THREE.Vector3();
            var func = BufferGeometry.prototype.computeBoundingSphere = function () {
                if (this.boundingSphere === null) {
                    this.boundingSphere = new THREE.Sphere();
                }
                var positions = this.attributes.position;
                if (positions) {
                    var array = positions.array;
                    var center = this.boundingSphere.center;
                    box.setFromArray(array);
                    box.center(center);
                    var maxRadiusSq = 0;
                    for (var i = 0, il = array.length; i < il; i += 3) {
                        vector.fromArray(array, i);
                        maxRadiusSq = THREE.Math.max(maxRadiusSq, center.distanceToSquared(vector));
                    }
                    this.boundingSphere.radius = THREE.Math.sqrt(maxRadiusSq);
                    if (isNaN(this.boundingSphere.radius)) {
                        console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
                    }
                }
            };
            func.call(this);
        };
        BufferGeometry.prototype.computeFaceNormals = function () {
        };
        BufferGeometry.prototype.computeVertexNormals = function () {
            var index = this.index;
            var attributes = this.attributes;
            var groups = this.groups;
            if (attributes.position) {
                var positions = attributes.position.array;
                if (attributes.normal === undefined) {
                    this.addAttribute('normal', new THREE.BufferAttribute(new Float32Array(positions.length), 3));
                }
                else {
                    var array = attributes.normal.array;
                    for (var i = 0, il = array.length; i < il; i++) {
                        array[i] = 0;
                    }
                }
                var normals = attributes.normal.array;
                var vA, vB, vC, pA = new THREE.Vector3(), pB = new THREE.Vector3(), pC = new THREE.Vector3(), cb = new THREE.Vector3(), ab = new THREE.Vector3();
                if (index) {
                    var indices = index.array;
                    if (groups.length === 0) {
                        this.addGroup(0, indices.length);
                    }
                    for (var j = 0, jl = groups.length; j < jl; ++j) {
                        var group = groups[j];
                        var start = group.start;
                        var count = group.count;
                        for (var i_1 = start, il_1 = start + count; i_1 < il_1; i_1 += 3) {
                            vA = indices[i_1 + 0] * 3;
                            vB = indices[i_1 + 1] * 3;
                            vC = indices[i_1 + 2] * 3;
                            pA.fromArray(positions, vA);
                            pB.fromArray(positions, vB);
                            pC.fromArray(positions, vC);
                            cb.subVectors(pC, pB);
                            ab.subVectors(pA, pB);
                            cb.cross(ab);
                            normals[vA] += cb.x;
                            normals[vA + 1] += cb.y;
                            normals[vA + 2] += cb.z;
                            normals[vB] += cb.x;
                            normals[vB + 1] += cb.y;
                            normals[vB + 2] += cb.z;
                            normals[vC] += cb.x;
                            normals[vC + 1] += cb.y;
                            normals[vC + 2] += cb.z;
                        }
                    }
                }
                else {
                    for (var i = 0, il = positions.length; i < il; i += 9) {
                        pA.fromArray(positions, i);
                        pB.fromArray(positions, i + 3);
                        pC.fromArray(positions, i + 6);
                        cb.subVectors(pC, pB);
                        ab.subVectors(pA, pB);
                        cb.cross(ab);
                        normals[i] = cb.x;
                        normals[i + 1] = cb.y;
                        normals[i + 2] = cb.z;
                        normals[i + 3] = cb.x;
                        normals[i + 4] = cb.y;
                        normals[i + 5] = cb.z;
                        normals[i + 6] = cb.x;
                        normals[i + 7] = cb.y;
                        normals[i + 8] = cb.z;
                    }
                }
                this.normalizeNormals();
                attributes.normal.needsUpdate = true;
            }
        };
        BufferGeometry.prototype.merge = function (geometry, offset) {
            if (offset === void 0) { offset = 0; }
            var attributes = this.attributes;
            for (var key in attributes) {
                if (geometry.attributes[key] === undefined)
                    continue;
                var attribute1 = attributes[key];
                var attributeArray1 = attribute1.array;
                var attribute2 = geometry.attributes[key];
                var attributeArray2 = attribute2.array;
                var attributeSize = attribute2.itemSize;
                for (var i = 0, j = attributeSize * offset; i < attributeArray2.length; i++, j++) {
                    attributeArray1[j] = attributeArray2[i];
                }
            }
            return this;
        };
        BufferGeometry.prototype.normalizeNormals = function () {
            var normals = this.attributes.normal.array;
            var x, y, z, n;
            for (var i = 0, il = normals.length; i < il; i += 3) {
                x = normals[i];
                y = normals[i + 1];
                z = normals[i + 2];
                n = 1.0 / THREE.Math.sqrt(x * x + y * y + z * z);
                normals[i] *= n;
                normals[i + 1] *= n;
                normals[i + 2] *= n;
            }
        };
        BufferGeometry.prototype.toNonIndexed = function () {
            if (this.index === null) {
                console.warn('THREE.BufferGeometry.toNonIndexed(): Geometry is already non-indexed.');
                return this;
            }
            var geometry2 = new BufferGeometry();
            var indices = this.index.array;
            var attributes = this.attributes;
            for (var name in attributes) {
                var attribute = attributes[name];
                var array = attribute.array;
                var itemSize = attribute.itemSize;
                var array2 = new array.constructor(indices.length * itemSize);
                var index = 0, index2 = 0;
                for (var i = 0, l = indices.length; i < l; i++) {
                    index = indices[i] * itemSize;
                    for (var j = 0; j < itemSize; j++) {
                        array2[index2++] = array[index++];
                    }
                }
                geometry2.addAttribute(name, new THREE.BufferAttribute(array2, itemSize));
            }
            return geometry2;
        };
        BufferGeometry.prototype.toJSON = function () {
            var data = {
                metadata: {
                    version: 4.4,
                    type: 'BufferGeometry',
                    generator: 'BufferGeometry.toJSON'
                }
            };
            data.uuid = this.uuid;
            data.type = this.type;
            if (this.name !== '')
                data.name = this.name;
            if (this.parameters !== undefined) {
                var parameters = this.parameters;
                for (var key in parameters) {
                    if (parameters[key] !== undefined)
                        data[key] = parameters[key];
                }
                return data;
            }
            data.data = { attributes: {} };
            var index = this.index;
            if (index !== null) {
                var array = Array.prototype.slice.call(index.array);
                data.data.index = {
                    type: index.array.constructor.name,
                    array: array
                };
            }
            var attributes = this.attributes;
            for (var key in attributes) {
                var attribute = attributes[key];
                var array = Array.prototype.slice.call(attribute.array);
                data.data.attributes[key] = {
                    itemSize: attribute.itemSize,
                    type: attribute.array.constructor.name,
                    array: array,
                    normalized: attribute.normalized
                };
            }
            var groups = this.groups;
            if (groups.length > 0) {
                data.data.groups = JSON.parse(JSON.stringify(groups));
            }
            var boundingSphere = this.boundingSphere;
            if (boundingSphere !== null) {
                data.data.boundingSphere = {
                    center: boundingSphere.center.toArray(),
                    radius: boundingSphere.radius
                };
            }
            return data;
        };
        BufferGeometry.prototype.clone = function () {
            return new BufferGeometry().copy(this);
        };
        BufferGeometry.prototype.copy = function (source) {
            var index = source.index;
            if (index !== null) {
                this.setIndex(index.clone());
            }
            var attributes = source.attributes;
            for (var name in attributes) {
                var attribute = attributes[name];
                this.addAttribute(name, attribute.clone());
            }
            var groups = source.groups;
            for (var i = 0, l = groups.length; i < l; i++) {
                var group = groups[i];
                this.addGroup(group.start, group.count, group.materialIndex);
            }
            return this;
        };
        BufferGeometry.prototype.dispose = function () {
            this.dispatchEvent({ type: 'dispose' });
        };
        BufferGeometry.MaxIndex = 65535;
        return BufferGeometry;
    }(THREE.EventDispatcher));
    THREE.BufferGeometry = BufferGeometry;
})(THREE || (THREE = {}));
