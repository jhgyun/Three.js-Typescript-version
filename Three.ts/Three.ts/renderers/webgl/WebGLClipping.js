var THREE;
(function (THREE) {
    var WebGLClipping = (function () {
        function WebGLClipping() {
            this.globalState = null;
            this.numGlobalPlanes = 0;
            this.localClippingEnabled = false;
            this.renderingShadows = false;
            this.plane = new THREE.Plane();
            this.viewNormalMatrix = new THREE.Matrix3();
            this.uniform = { value: null, needsUpdate: false };
            this.numPlanes = 0;
        }
        WebGLClipping.prototype.init = function (planes, enableLocalClipping, camera) {
            var enabled = planes.length !== 0 ||
                enableLocalClipping ||
                this.numGlobalPlanes !== 0 ||
                this.localClippingEnabled;
            this.localClippingEnabled = enableLocalClipping;
            this.globalState = this.projectPlanes(planes, camera, 0);
            this.numGlobalPlanes = planes.length;
            return enabled;
        };
        ;
        WebGLClipping.prototype.beginShadows = function () {
            this.renderingShadows = true;
            this.projectPlanes(null);
        };
        ;
        WebGLClipping.prototype.endShadows = function () {
            this.renderingShadows = false;
            this.resetGlobalState();
        };
        ;
        WebGLClipping.prototype.setState = function (planes, clipShadows, camera, cache, fromCache) {
            if (!this.localClippingEnabled ||
                planes === null || planes.length === 0 ||
                this.renderingShadows && !clipShadows) {
                if (this.renderingShadows) {
                    this.projectPlanes(null);
                }
                else {
                    this.resetGlobalState();
                }
            }
            else {
                var nGlobal = this.renderingShadows ? 0 : this.numGlobalPlanes, lGlobal = nGlobal * 4, dstArray = cache.clippingState || null;
                this.uniform.value = dstArray;
                dstArray = this.projectPlanes(planes, camera, lGlobal, fromCache);
                for (var i = 0; i !== lGlobal; ++i) {
                    dstArray[i] = this.globalState[i];
                }
                cache.clippingState = dstArray;
                this.numPlanes += nGlobal;
            }
        };
        ;
        WebGLClipping.prototype.resetGlobalState = function () {
            if (this.uniform.value !== this.globalState) {
                this.uniform.value = this.globalState;
                this.uniform.needsUpdate = this.numGlobalPlanes > 0;
            }
            this.numPlanes = this.numGlobalPlanes;
        };
        WebGLClipping.prototype.projectPlanes = function (planes, camera, dstOffset, skipTransform) {
            var nPlanes = planes !== null ? planes.length : 0, dstArray = null;
            if (nPlanes !== 0) {
                dstArray = this.uniform.value;
                if (skipTransform !== true || dstArray === null) {
                    var flatSize = dstOffset + nPlanes * 4, viewMatrix = camera.matrixWorldInverse;
                    this.viewNormalMatrix.getNormalMatrix(viewMatrix);
                    if (dstArray === null || dstArray.length < flatSize) {
                        dstArray = new Float32Array(flatSize);
                    }
                    for (var i = 0, i4 = dstOffset; i !== nPlanes; ++i, i4 += 4) {
                        this.plane.copy(planes[i]).
                            applyMatrix4(viewMatrix, this.viewNormalMatrix);
                        this.plane.normal.toArray(dstArray, i4);
                        dstArray[i4 + 3] = this.plane.constant;
                    }
                }
                this.uniform.value = dstArray;
                this.uniform.needsUpdate = true;
            }
            this.numPlanes = nPlanes;
            return dstArray;
        };
        return WebGLClipping;
    }());
    THREE.WebGLClipping = WebGLClipping;
})(THREE || (THREE = {}));
