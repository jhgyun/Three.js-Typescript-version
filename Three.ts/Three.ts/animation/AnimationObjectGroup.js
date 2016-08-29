var THREE;
(function (THREE) {
    var AnimationObjectGroup = (function () {
        function AnimationObjectGroup(var_args) {
            this.uuid = THREE.Math.generateUUID();
            this._objects = Array.prototype.slice.call(arguments);
            this.nCachedObjects_ = 0;
            var indices = {};
            this._indicesByUUID = indices;
            for (var i = 0, n = arguments.length; i !== n; ++i) {
                indices[arguments[i].uuid] = i;
            }
            this._paths = [];
            this._parsedPaths = [];
            this._bindings = [];
            this._bindingsIndicesByPath = {};
            var scope = this;
            this.stats = {
                objects: {
                    get total() { return scope._objects.length; },
                    get inUse() { return this.total - scope.nCachedObjects_; }
                },
                get bindingsPerObject() { return scope._bindings.length; }
            };
        }
        AnimationObjectGroup.prototype.add = function (var_args) {
            var objects = this._objects, nObjects = objects.length, nCachedObjects = this.nCachedObjects_, indicesByUUID = this._indicesByUUID, paths = this._paths, parsedPaths = this._parsedPaths, bindings = this._bindings, nBindings = bindings.length;
            for (var i = 0, n = arguments.length; i !== n; ++i) {
                var object = arguments[i], uuid = object.uuid, index = indicesByUUID[uuid];
                if (index === undefined) {
                    index = nObjects++;
                    indicesByUUID[uuid] = index;
                    objects.push(object);
                    for (var j = 0, m = nBindings; j !== m; ++j) {
                        bindings[j].push(new THREE.PropertyBinding(object, paths[j], parsedPaths[j]));
                    }
                }
                else if (index < nCachedObjects) {
                    var knownObject = objects[index];
                    var firstActiveIndex = --nCachedObjects, lastCachedObject = objects[firstActiveIndex];
                    indicesByUUID[lastCachedObject.uuid] = index;
                    objects[index] = lastCachedObject;
                    indicesByUUID[uuid] = firstActiveIndex;
                    objects[firstActiveIndex] = object;
                    for (var j = 0, m = nBindings; j !== m; ++j) {
                        var bindingsForPath = bindings[j], lastCached = bindingsForPath[firstActiveIndex], binding = bindingsForPath[index];
                        bindingsForPath[index] = lastCached;
                        if (binding === undefined) {
                            binding = new THREE.PropertyBinding(object, paths[j], parsedPaths[j]);
                        }
                        bindingsForPath[firstActiveIndex] = binding;
                    }
                }
                else if (objects[index] !== knownObject) {
                    console.error("Different objects with the same UUID " +
                        "detected. Clean the caches or recreate your " +
                        "infrastructure when reloading scenes...");
                }
            }
            this.nCachedObjects_ = nCachedObjects;
        };
        AnimationObjectGroup.prototype.remove = function (var_args) {
            var objects = this._objects, nObjects = objects.length, nCachedObjects = this.nCachedObjects_, indicesByUUID = this._indicesByUUID, bindings = this._bindings, nBindings = bindings.length;
            for (var i = 0, n = arguments.length; i !== n; ++i) {
                var object = arguments[i], uuid = object.uuid, index = indicesByUUID[uuid];
                if (index !== undefined && index >= nCachedObjects) {
                    var lastCachedIndex = nCachedObjects++, firstActiveObject = objects[lastCachedIndex];
                    indicesByUUID[firstActiveObject.uuid] = index;
                    objects[index] = firstActiveObject;
                    indicesByUUID[uuid] = lastCachedIndex;
                    objects[lastCachedIndex] = object;
                    for (var j = 0, m = nBindings; j !== m; ++j) {
                        var bindingsForPath = bindings[j], firstActive = bindingsForPath[lastCachedIndex], binding = bindingsForPath[index];
                        bindingsForPath[index] = firstActive;
                        bindingsForPath[lastCachedIndex] = binding;
                    }
                }
            }
            this.nCachedObjects_ = nCachedObjects;
        };
        AnimationObjectGroup.prototype.uncache = function (var_args) {
            var objects = this._objects, nObjects = objects.length, nCachedObjects = this.nCachedObjects_, indicesByUUID = this._indicesByUUID, bindings = this._bindings, nBindings = bindings.length;
            for (var i = 0, n = arguments.length; i !== n; ++i) {
                var object = arguments[i], uuid = object.uuid, index = indicesByUUID[uuid];
                if (index !== undefined) {
                    delete indicesByUUID[uuid];
                    if (index < nCachedObjects) {
                        var firstActiveIndex = --nCachedObjects, lastCachedObject = objects[firstActiveIndex], lastIndex = --nObjects, lastObject = objects[lastIndex];
                        indicesByUUID[lastCachedObject.uuid] = index;
                        objects[index] = lastCachedObject;
                        indicesByUUID[lastObject.uuid] = firstActiveIndex;
                        objects[firstActiveIndex] = lastObject;
                        objects.pop();
                        for (var j = 0, m = nBindings; j !== m; ++j) {
                            var bindingsForPath = bindings[j], lastCached = bindingsForPath[firstActiveIndex], last = bindingsForPath[lastIndex];
                            bindingsForPath[index] = lastCached;
                            bindingsForPath[firstActiveIndex] = last;
                            bindingsForPath.pop();
                        }
                    }
                    else {
                        var lastIndex = --nObjects, lastObject = objects[lastIndex];
                        indicesByUUID[lastObject.uuid] = index;
                        objects[index] = lastObject;
                        objects.pop();
                        for (var j = 0, m = nBindings; j !== m; ++j) {
                            var bindingsForPath = bindings[j];
                            bindingsForPath[index] = bindingsForPath[lastIndex];
                            bindingsForPath.pop();
                        }
                    }
                }
            }
            this.nCachedObjects_ = nCachedObjects;
        };
        AnimationObjectGroup.prototype.subscribe_ = function (path, parsedPath) {
            var indicesByPath = this._bindingsIndicesByPath, index = indicesByPath[path], bindings = this._bindings;
            if (index !== undefined)
                return bindings[index];
            var paths = this._paths, parsedPaths = this._parsedPaths, objects = this._objects, nObjects = objects.length, nCachedObjects = this.nCachedObjects_, bindingsForPath = new Array(nObjects);
            index = bindings.length;
            indicesByPath[path] = index;
            paths.push(path);
            parsedPaths.push(parsedPath);
            bindings.push(bindingsForPath);
            for (var i = nCachedObjects, n = objects.length; i !== n; ++i) {
                var object = objects[i];
                bindingsForPath[i] =
                    new THREE.PropertyBinding(object, path, parsedPath);
            }
            return bindingsForPath;
        };
        AnimationObjectGroup.prototype.unsubscribe_ = function (path) {
            var indicesByPath = this._bindingsIndicesByPath, index = indicesByPath[path];
            if (index !== undefined) {
                var paths = this._paths, parsedPaths = this._parsedPaths, bindings = this._bindings, lastBindingsIndex = bindings.length - 1, lastBindings = bindings[lastBindingsIndex], lastBindingsPath = path[lastBindingsIndex];
                indicesByPath[lastBindingsPath] = index;
                bindings[index] = lastBindings;
                bindings.pop();
                parsedPaths[index] = parsedPaths[lastBindingsIndex];
                parsedPaths.pop();
                paths[index] = paths[lastBindingsIndex];
                paths.pop();
            }
        };
        return AnimationObjectGroup;
    }());
    THREE.AnimationObjectGroup = AnimationObjectGroup;
})(THREE || (THREE = {}));
