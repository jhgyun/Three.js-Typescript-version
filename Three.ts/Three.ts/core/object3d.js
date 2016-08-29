var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Object3D = (function (_super) {
        __extends(Object3D, _super);
        function Object3D() {
            _super.call(this);
            this._id = THREE.Object3DIdCount++;
            this.uuid = THREE.Math.generateUUID();
            this.name = '';
            this.type = 'Object3D';
            this.parent = null;
            this.children = [];
            this.up = Object3D.DefaultUp.clone();
            this._position = new THREE.Vector3();
            this._rotation = new THREE.Euler();
            this._quaternion = new THREE.Quaternion();
            this._scale = new THREE.Vector3(1, 1, 1);
            this._modelViewMatrix = new THREE.Matrix4();
            this._normalMatrix = new THREE.Matrix3();
            this.matrix = new THREE.Matrix4();
            this.matrixWorld = new THREE.Matrix4();
            this.matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate;
            this.matrixWorldNeedsUpdate = false;
            this.layers = new THREE.Layers();
            this.visible = true;
            this.castShadow = false;
            this.receiveShadow = false;
            this.frustumCulled = true;
            this.renderOrder = 0;
            this.userData = {};
            this.rotation.onChange(this.onRotationChange, this);
            this.quaternion.onChange(this.onQuaternionChange, this);
        }
        Object.defineProperty(Object3D.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object3D.prototype.onRotationChange = function () {
            this.quaternion.setFromEuler(this.rotation, false);
        };
        Object3D.prototype.onQuaternionChange = function () {
            this.rotation.setFromQuaternion(this.quaternion, undefined, false);
        };
        Object.defineProperty(Object3D.prototype, "position", {
            get: function () {
                return this._position;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "rotation", {
            get: function () {
                return this._rotation;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "quaternion", {
            get: function () {
                return this._quaternion;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "scale", {
            get: function () {
                return this._scale;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "modelViewMatrix", {
            get: function () {
                return this._modelViewMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Object3D.prototype, "normalMatrix", {
            get: function () {
                return this._normalMatrix;
            },
            enumerable: true,
            configurable: true
        });
        Object3D.prototype.applyMatrix = function (matrix) {
            this.matrix.multiplyMatrices(matrix, this.matrix);
            this.matrix.decompose(this.position, this.quaternion, this.scale);
        };
        Object3D.prototype.setRotationFromAxisAngle = function (axis, angle) {
            this.quaternion.setFromAxisAngle(axis, angle);
        };
        Object3D.prototype.setRotationFromEuler = function (euler) {
            this.quaternion.setFromEuler(euler, true);
        };
        Object3D.prototype.setRotationFromMatrix = function (m) {
            this.quaternion.setFromRotationMatrix(m);
        };
        Object3D.prototype.setRotationFromQuaternion = function (q) {
            this.quaternion.copy(q);
        };
        Object3D.prototype.rotateOnAxis = function (axis, angle) {
            var q1 = new THREE.Quaternion();
            var func = Object3D.prototype.rotateOnAxis
                = function (axis, angle) {
                    q1.setFromAxisAngle(axis, angle);
                    this.quaternion.multiply(q1);
                    return this;
                };
            return func.apply(this, arguments);
        };
        Object3D.prototype.rotateX = function (angle) {
            var v1 = new THREE.Vector3(1, 0, 0);
            var func = Object3D.prototype.rotateX = function (angle) {
                return this.rotateOnAxis(v1, angle);
            };
            return func.apply(this, arguments);
        };
        Object3D.prototype.rotateY = function (angle) {
            var v1 = new THREE.Vector3(0, 1, 0);
            var func = Object3D.prototype.rotateY = function (angle) {
                this.rotateOnAxis(v1, angle);
                return this;
            };
            return func.apply(this, arguments);
        };
        Object3D.prototype.rotateZ = function (angle) {
            var v1 = new THREE.Vector3(0, 0, 1);
            var func = Object3D.prototype.rotateZ = function (angle) {
                this.rotateOnAxis(v1, angle);
                return this;
            };
            return func.apply(this, arguments);
        };
        Object3D.prototype.translateOnAxis = function (axis, distance) {
            var v1 = new THREE.Vector3();
            var func = Object3D.prototype.translateOnAxis = function (axis, distance) {
                v1.copy(axis).applyQuaternion(this.quaternion);
                this.position.add(v1.multiplyScalar(distance));
                return this;
            };
            return func.apply(this, arguments);
        };
        Object3D.prototype.translateX = function (distance) {
            var v1 = new THREE.Vector3(1, 0, 0);
            var func = Object3D.prototype.translateX = function (distance) {
                return this.translateOnAxis(v1, distance);
            };
            return func.apply(this, arguments);
        };
        Object3D.prototype.translateY = function (distance) {
            var v1 = new THREE.Vector3(0, 1, 0);
            var func = Object3D.prototype.translateY = function (distance) {
                return this.translateOnAxis(v1, distance);
            };
            return func.apply(this, arguments);
        };
        Object3D.prototype.translateZ = function (distance) {
            var v1 = new THREE.Vector3(0, 0, 1);
            var func = Object3D.prototype.translateZ = function (distance) {
                return this.translateOnAxis(v1, distance);
            };
            return func.apply(this, arguments);
        };
        Object3D.prototype.localToWorld = function (vector) {
            return vector.applyMatrix4(this.matrixWorld);
        };
        Object3D.prototype.worldToLocal = function (vector) {
            var m1 = new THREE.Matrix4();
            var func = Object3D.prototype.worldToLocal = function (vector) {
                return vector.applyMatrix4(m1.getInverse(this.matrixWorld));
            };
            return func.apply(this, arguments);
        };
        Object3D.prototype.lookAt = function (vector) {
            var m1 = new THREE.Matrix4();
            var func = Object3D.prototype.lookAt = function (vector) {
                m1.lookAt(vector, this.position, this.up);
                this.quaternion.setFromRotationMatrix(m1);
            };
            func.apply(this, arguments);
        };
        Object3D.prototype.add = function (object) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (arguments.length > 1) {
                for (var i = 0; i < arguments.length; i++) {
                    this.add(arguments[i]);
                }
                return this;
            }
            if (object === this) {
                console.error("THREE.Object3D.add: object can't be added as a child of itself.", object);
                return this;
            }
            if (object instanceof Object3D) {
                if (object.parent !== null) {
                    object.parent.remove(object);
                }
                object.parent = this;
                object.dispatchEvent({ type: 'added' });
                this.children.push(object);
            }
            else {
                console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", object);
            }
            return this;
        };
        Object3D.prototype.remove = function (object) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            if (arguments.length > 1) {
                for (var i = 0; i < arguments.length; i++) {
                    this.remove(arguments[i]);
                }
            }
            var index = this.children.indexOf(object);
            if (index !== -1) {
                object.parent = null;
                object.dispatchEvent({ type: 'removed' });
                this.children.splice(index, 1);
            }
        };
        Object3D.prototype.getObjectById = function (id) {
            return this.getObjectByProperty('id', id);
        };
        Object3D.prototype.getObjectByName = function (name) {
            return this.getObjectByProperty('name', name);
        };
        Object3D.prototype.getObjectByProperty = function (name, value) {
            if (this[name] === value)
                return this;
            for (var i = 0, l = this.children.length; i < l; i++) {
                var child = this.children[i];
                var object = child.getObjectByProperty(name, value);
                if (object !== undefined) {
                    return object;
                }
            }
            return undefined;
        };
        Object3D.prototype.getWorldPosition = function (optionalTarget) {
            var result = optionalTarget || new THREE.Vector3();
            this.updateMatrixWorld(true);
            return result.setFromMatrixPosition(this.matrixWorld);
        };
        Object3D.prototype.getWorldQuaternion = function (optionalTarget) {
            var position = new THREE.Vector3();
            var scale = new THREE.Vector3();
            var func = Object3D.prototype.getWorldQuaternion = function (optionalTarget) {
                var result = optionalTarget || new THREE.Quaternion();
                this.updateMatrixWorld(true);
                this.matrixWorld.decompose(position, result, scale);
                return result;
            };
            return func.apply(this, arguments);
        };
        Object3D.prototype.getWorldRotation = function (optionalTarget) {
            var quaternion = new THREE.Quaternion();
            var func = Object3D.prototype.getWorldRotation = function (optionalTarget) {
                var result = optionalTarget || new THREE.Euler();
                this.getWorldQuaternion(quaternion);
                return result.setFromQuaternion(quaternion, this.rotation.order, false);
            };
            return func.apply(this, arguments);
        };
        Object3D.prototype.getWorldScale = function (optionalTarget) {
            var position = new THREE.Vector3();
            var quaternion = new THREE.Quaternion();
            var func = Object3D.prototype.getWorldScale = function (optionalTarget) {
                var result = optionalTarget || new THREE.Vector3();
                this.updateMatrixWorld(true);
                this.matrixWorld.decompose(position, quaternion, result);
                return result;
            };
            return func.apply(this, arguments);
        };
        Object3D.prototype.getWorldDirection = function (optionalTarget) {
            var quaternion = new THREE.Quaternion();
            var func = Object3D.prototype.getWorldDirection = function (optionalTarget) {
                var result = optionalTarget || new THREE.Vector3();
                this.getWorldQuaternion(quaternion);
                return result.set(0, 0, 1).applyQuaternion(quaternion);
            };
            return func.apply(this, arguments);
        };
        Object3D.prototype.raycast = function (raycaster, intersects) { };
        Object3D.prototype.traverse = function (callback) {
            callback(this);
            var children = this.children;
            for (var i = 0, l = children.length; i < l; i++) {
                children[i].traverse(callback);
            }
        };
        Object3D.prototype.traverseVisible = function (callback) {
            if (this.visible === false)
                return;
            callback(this);
            var children = this.children;
            for (var i = 0, l = children.length; i < l; i++) {
                children[i].traverseVisible(callback);
            }
        };
        Object3D.prototype.traverseAncestors = function (callback) {
            var parent = this.parent;
            if (parent !== null) {
                callback(parent);
                parent.traverseAncestors(callback);
            }
        };
        Object3D.prototype.updateMatrix = function () {
            this.matrix.compose(this.position, this.quaternion, this.scale);
            this.matrixWorldNeedsUpdate = true;
        };
        Object3D.prototype.updateMatrixWorld = function (force) {
            if (this.matrixAutoUpdate === true)
                this.updateMatrix();
            if (this.matrixWorldNeedsUpdate === true || force === true) {
                if (this.parent === null) {
                    this.matrixWorld.copy(this.matrix);
                }
                else {
                    this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
                }
                this.matrixWorldNeedsUpdate = false;
                force = true;
            }
            for (var i = 0, l = this.children.length; i < l; i++) {
                this.children[i].updateMatrixWorld(force);
            }
        };
        Object3D.prototype.toJSON = function (meta) {
            var isRootObject = (meta === undefined || meta === '');
            var output = {};
            if (isRootObject) {
                meta = {
                    geometries: {},
                    materials: {},
                    textures: {},
                    images: {}
                };
                output.metadata = {
                    version: 4.4,
                    type: 'Object',
                    generator: 'Object3D.toJSON'
                };
            }
            var object = {};
            object.uuid = this.uuid;
            object.type = this.type;
            if (this.name !== '')
                object.name = this.name;
            if (JSON.stringify(this.userData) !== '{}')
                object.userData = this.userData;
            if (this.castShadow === true)
                object.castShadow = true;
            if (this.receiveShadow === true)
                object.receiveShadow = true;
            if (this.visible === false)
                object.visible = false;
            object.matrix = this.matrix.toArray();
            if (this.geometry !== undefined) {
                if (meta.geometries[this.geometry.uuid] === undefined) {
                    meta.geometries[this.geometry.uuid] = this.geometry.toJSON(meta);
                }
                object.geometry = this.geometry.uuid;
            }
            if (this.material !== undefined) {
                if (meta.materials[this.material.uuid] === undefined) {
                    meta.materials[this.material.uuid] = this.material.toJSON(meta);
                }
                object.material = this.material.uuid;
            }
            if (this.children.length > 0) {
                object.children = [];
                for (var i = 0; i < this.children.length; i++) {
                    object.children.push(this.children[i].toJSON(meta).object);
                }
            }
            if (isRootObject) {
                var geometries = extractFromCache(meta.geometries);
                var materials = extractFromCache(meta.materials);
                var textures = extractFromCache(meta.textures);
                var images = extractFromCache(meta.images);
                if (geometries.length > 0)
                    output.geometries = geometries;
                if (materials.length > 0)
                    output.materials = materials;
                if (textures.length > 0)
                    output.textures = textures;
                if (images.length > 0)
                    output.images = images;
            }
            output.object = object;
            return output;
            function extractFromCache(cache) {
                var values = [];
                for (var key in cache) {
                    var data = cache[key];
                    delete data.metadata;
                    values.push(data);
                }
                return values;
            }
        };
        Object3D.prototype.clone = function (recursive) {
            return new this.constructor().copy(this, recursive);
        };
        Object3D.prototype.copy = function (source, recursive) {
            if (recursive === undefined)
                recursive = true;
            this.name = source.name;
            this.up.copy(source.up);
            this.position.copy(source.position);
            this.quaternion.copy(source.quaternion);
            this.scale.copy(source.scale);
            this.matrix.copy(source.matrix);
            this.matrixWorld.copy(source.matrixWorld);
            this.matrixAutoUpdate = source.matrixAutoUpdate;
            this.matrixWorldNeedsUpdate = source.matrixWorldNeedsUpdate;
            this.visible = source.visible;
            this.castShadow = source.castShadow;
            this.receiveShadow = source.receiveShadow;
            this.frustumCulled = source.frustumCulled;
            this.renderOrder = source.renderOrder;
            this.userData = JSON.parse(JSON.stringify(source.userData));
            if (recursive === true) {
                for (var i = 0; i < source.children.length; i++) {
                    var child = source.children[i];
                    this.add(child.clone());
                }
            }
            return this;
        };
        Object3D.DefaultUp = new THREE.Vector3(0, 1, 0);
        Object3D.DefaultMatrixAutoUpdate = true;
        return Object3D;
    }(THREE.EventDispatcher));
    THREE.Object3D = Object3D;
    THREE.Object3DIdCount = 0;
})(THREE || (THREE = {}));
