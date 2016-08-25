/// <reference path="camera.ts" />
/*
 * @author alteredq / http://alteredqualia.com/
 * @author arose / http://github.com/arose
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var OrthographicCamera = (function (_super) {
        __extends(OrthographicCamera, _super);
        function OrthographicCamera(left, right, top, bottom, near, far) {
            _super.call(this);
            this.type = 'OrthographicCamera';
            this.zoom = 1;
            this.view = null;
            this.left = left;
            this.right = right;
            this.top = top;
            this.bottom = bottom;
            this.near = (near !== undefined) ? near : 0.1;
            this.far = (far !== undefined) ? far : 2000;
            this.updateProjectionMatrix();
        }
        ;
        OrthographicCamera.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.left = source.left;
            this.right = source.right;
            this.top = source.top;
            this.bottom = source.bottom;
            this.near = source.near;
            this.far = source.far;
            this.zoom = source.zoom;
            this.view = source.view === null ? null : Object.assign({}, source.view);
            return this;
        };
        OrthographicCamera.prototype.setViewOffset = function (fullWidth, fullHeight, x, y, width, height) {
            this.view = {
                fullWidth: fullWidth,
                fullHeight: fullHeight,
                offsetX: x,
                offsetY: y,
                width: width,
                height: height
            };
            this.updateProjectionMatrix();
        };
        OrthographicCamera.prototype.clearViewOffset = function () {
            this.view = null;
            this.updateProjectionMatrix();
        };
        OrthographicCamera.prototype.updateProjectionMatrix = function () {
            var dx = (this.right - this.left) / (2 * this.zoom);
            var dy = (this.top - this.bottom) / (2 * this.zoom);
            var cx = (this.right + this.left) / 2;
            var cy = (this.top + this.bottom) / 2;
            var left = cx - dx;
            var right = cx + dx;
            var top = cy + dy;
            var bottom = cy - dy;
            if (this.view !== null) {
                var zoomW = this.zoom / (this.view.width / this.view.fullWidth);
                var zoomH = this.zoom / (this.view.height / this.view.fullHeight);
                var scaleW = (this.right - this.left) / this.view.width;
                var scaleH = (this.top - this.bottom) / this.view.height;
                left += scaleW * (this.view.offsetX / zoomW);
                right = left + scaleW * (this.view.width / zoomW);
                top -= scaleH * (this.view.offsetY / zoomH);
                bottom = top - scaleH * (this.view.height / zoomH);
            }
            this.projectionMatrix.makeOrthographic(left, right, top, bottom, this.near, this.far);
        };
        OrthographicCamera.prototype.toJSON = function (meta) {
            var data = _super.prototype.toJSON.call(this, meta);
            data.object.zoom = this.zoom;
            data.object.left = this.left;
            data.object.right = this.right;
            data.object.top = this.top;
            data.object.bottom = this.bottom;
            data.object.near = this.near;
            data.object.far = this.far;
            if (this.view !== null)
                data.object.view = Object.assign({}, this.view);
            return data;
        };
        return OrthographicCamera;
    }(THREE.Camera));
    THREE.OrthographicCamera = OrthographicCamera;
})(THREE || (THREE = {}));
