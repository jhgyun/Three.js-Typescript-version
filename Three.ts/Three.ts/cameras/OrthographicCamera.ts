/// <reference path="camera.ts" />
/* 
 * @author alteredq / http://alteredqualia.com/
 * @author arose / http://github.com/arose
 */

namespace THREE
{
    export class OrthographicCamera extends Camera
    {
        zoom: number;
        view: {
            fullWidth: number,
            fullHeight: number,
            offsetX: number,
            offsetY: number,
            width: number,
            height: number
        };
        left: number;
        right: number;
        top: number;
        bottom: number;
        near: number;
        far: number;

        constructor(left: number, right: number, top: number, bottom: number, near?: number, far?: number)
        {
            super();

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
        };

        copy(source: OrthographicCamera)
        {
            super.copy(source);
            this.left = source.left;
            this.right = source.right;
            this.top = source.top;
            this.bottom = source.bottom;
            this.near = source.near;
            this.far = source.far;

            this.zoom = source.zoom;
            this.view = source.view === null ? null : Object.assign({}, source.view);
            return this;

        }

        setViewOffset(fullWidth: number, fullHeight: number, x: number, y: number, width: number, height: number)
        {
            this.view = {
                fullWidth: fullWidth,
                fullHeight: fullHeight,
                offsetX: x,
                offsetY: y,
                width: width,
                height: height
            };

            this.updateProjectionMatrix();
        }

        clearViewOffset()
        {
            this.view = null;
            this.updateProjectionMatrix();
        }

        updateProjectionMatrix()
        {

            var dx = (this.right - this.left) / (2 * this.zoom);
            var dy = (this.top - this.bottom) / (2 * this.zoom);
            var cx = (this.right + this.left) / 2;
            var cy = (this.top + this.bottom) / 2;

            var left = cx - dx;
            var right = cx + dx;
            var top = cy + dy;
            var bottom = cy - dy;

            if (this.view !== null)
            {
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
        }

        toJSON(meta)
        { 
            var data = super.toJSON(meta); 
            data.object.zoom = this.zoom;
            data.object.left = this.left;
            data.object.right = this.right;
            data.object.top = this.top;
            data.object.bottom = this.bottom;
            data.object.near = this.near;
            data.object.far = this.far;

            if (this.view !== null) data.object.view = Object.assign({}, this.view);

            return data; 
        } 
    }
}
