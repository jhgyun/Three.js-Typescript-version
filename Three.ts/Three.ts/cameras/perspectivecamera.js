var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var PerspectiveCamera = (function (_super) {
        __extends(PerspectiveCamera, _super);
        function PerspectiveCamera(fov, aspect, near, far) {
            _super.call(this);
            this.type = 'PerspectiveCamera';
            this.fov = fov !== undefined ? fov : 50;
            this.zoom = 1;
            this.near = near !== undefined ? near : 0.1;
            this.far = far !== undefined ? far : 2000;
            this.focus = 10;
            this.aspect = aspect !== undefined ? aspect : 1;
            this.view = null;
            this.filmGauge = 35;
            this.filmOffset = 0;
            this.updateProjectionMatrix();
        }
        ;
        PerspectiveCamera.prototype.copy = function (source) {
            _super.prototype.copy.call(this, source);
            this.fov = source.fov;
            this.zoom = source.zoom;
            this.near = source.near;
            this.far = source.far;
            this.focus = source.focus;
            this.aspect = source.aspect;
            this.view = source.view === null ? null : Object.assign({}, source.view);
            this.filmGauge = source.filmGauge;
            this.filmOffset = source.filmOffset;
            return this;
        };
        PerspectiveCamera.prototype.setFocalLength = function (focalLength) {
            var vExtentSlope = 0.5 * this.getFilmHeight() / focalLength;
            this.fov = THREE.Math.RAD2DEG * 2 * THREE.Math.atan(vExtentSlope);
            this.updateProjectionMatrix();
        };
        PerspectiveCamera.prototype.getFocalLength = function () {
            var vExtentSlope = THREE.Math.tan(THREE.Math.DEG2RAD * 0.5 * this.fov);
            return 0.5 * this.getFilmHeight() / vExtentSlope;
        };
        PerspectiveCamera.prototype.getEffectiveFOV = function () {
            return THREE.Math.RAD2DEG * 2 * THREE.Math.atan(THREE.Math.tan(THREE.Math.DEG2RAD * 0.5 * this.fov) / this.zoom);
        };
        PerspectiveCamera.prototype.getFilmWidth = function () {
            return this.filmGauge * THREE.Math.min(this.aspect, 1);
        };
        PerspectiveCamera.prototype.getFilmHeight = function () {
            return this.filmGauge / THREE.Math.max(this.aspect, 1);
        };
        PerspectiveCamera.prototype.setViewOffset = function (fullWidth, fullHeight, x, y, width, height) {
            this.aspect = fullWidth / fullHeight;
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
        PerspectiveCamera.prototype.clearViewOffset = function () {
            this.view = null;
            this.updateProjectionMatrix();
        };
        PerspectiveCamera.prototype.updateProjectionMatrix = function () {
            var near = this.near, top = near * THREE.Math.tan(THREE.Math.DEG2RAD * 0.5 * this.fov) / this.zoom, height = 2 * top, width = this.aspect * height, left = -0.5 * width, view = this.view;
            if (view !== null) {
                var fullWidth = view.fullWidth, fullHeight = view.fullHeight;
                left += view.offsetX * width / fullWidth;
                top -= view.offsetY * height / fullHeight;
                width *= view.width / fullWidth;
                height *= view.height / fullHeight;
            }
            var skew = this.filmOffset;
            if (skew !== 0)
                left += near * skew / this.getFilmWidth();
            this.projectionMatrix.makeFrustum(left, left + width, top - height, top, near, this.far);
        };
        PerspectiveCamera.prototype.toJSON = function (meta) {
            var data = _super.prototype.toJSON.call(this, meta);
            data.object.fov = this.fov;
            data.object.zoom = this.zoom;
            data.object.near = this.near;
            data.object.far = this.far;
            data.object.focus = this.focus;
            data.object.aspect = this.aspect;
            if (this.view !== null)
                data.object.view = Object.assign({}, this.view);
            data.object.filmGauge = this.filmGauge;
            data.object.filmOffset = this.filmOffset;
            return data;
        };
        return PerspectiveCamera;
    }(THREE.Camera));
    THREE.PerspectiveCamera = PerspectiveCamera;
})(THREE || (THREE = {}));
