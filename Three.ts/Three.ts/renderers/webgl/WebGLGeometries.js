/*
* @author mrdoob / http://mrdoob.com/
*/
var THREE;
(function (THREE) {
    var WebGLGeometries = (function () {
        function WebGLGeometries(gl, properties, info) {
            this.gl = gl;
            this.geometries = {};
            this.properties = properties;
            this.info = info;
        }
        WebGLGeometries.prototype.onGeometryDispose = function (event) {
            var geometries = this.geometries;
            var properties = this.properties;
            var geometry = event.target;
            var buffergeometry = geometries[geometry.id];
            if (buffergeometry.index !== null) {
                this.deleteAttribute(buffergeometry.index);
            }
            this.deleteAttributes(buffergeometry.attributes);
            geometry.removeEventListener('dispose', this.onGeometryDispose, this);
            delete geometries[geometry.id];
            // TODO
            var property = properties.get(geometry);
            if (property.wireframe) {
                this.deleteAttribute(property.wireframe);
            }
            properties.delete(geometry);
            var bufferproperty = properties.get(buffergeometry);
            if (bufferproperty.wireframe) {
                this.deleteAttribute(bufferproperty.wireframe);
            }
            properties.delete(buffergeometry);
            //
            this.info.memory.geometries--;
        };
        WebGLGeometries.prototype.getAttributeBuffer = function (attribute) {
            var properties = this.properties;
            if (attribute instanceof THREE.InterleavedBufferAttribute) {
                return properties.get(attribute.data).__webglBuffer;
            }
            return properties.get(attribute).__webglBuffer;
        };
        WebGLGeometries.prototype.deleteAttribute = function (attribute) {
            var buffer = this.getAttributeBuffer(attribute);
            if (buffer !== undefined) {
                this.gl.deleteBuffer(buffer);
                this.removeAttributeBuffer(attribute);
            }
        };
        WebGLGeometries.prototype.deleteAttributes = function (attributes) {
            for (var name in attributes) {
                this.deleteAttribute(attributes[name]);
            }
        };
        WebGLGeometries.prototype.removeAttributeBuffer = function (attribute) {
            var properties = this.properties;
            if (attribute instanceof THREE.InterleavedBufferAttribute) {
                properties.delete(attribute.data);
            }
            else {
                properties.delete(attribute);
            }
        };
        WebGLGeometries.prototype.get = function (object) {
            var geometry = object.geometry;
            var geometries = this.geometries;
            if (geometries[geometry.id] !== undefined) {
                return geometries[geometry.id];
            }
            geometry.addEventListener('dispose', this.onGeometryDispose, this);
            var buffergeometry;
            if (geometry instanceof THREE.BufferGeometry) {
                buffergeometry = geometry;
            }
            else if (geometry instanceof THREE.Geometry) {
                if (geometry._bufferGeometry === undefined) {
                    geometry._bufferGeometry = new THREE.BufferGeometry().setFromObject(object);
                }
                buffergeometry = geometry._bufferGeometry;
            }
            geometries[geometry.id] = buffergeometry;
            this.info.memory.geometries++;
            return buffergeometry;
        };
        return WebGLGeometries;
    }());
    THREE.WebGLGeometries = WebGLGeometries;
})(THREE || (THREE = {}));
