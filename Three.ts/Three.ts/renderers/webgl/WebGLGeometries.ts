/* 
* @author mrdoob / http://mrdoob.com/
*/

namespace THREE
{
    export class WebGLGeometries
    {
        gl: WebGLRenderingContext;
        geometries: {
            [index: number]: BufferGeometry
        };
        properties: WebGLProperties;
        info: WebGLRendererInfo; 

        constructor(gl: WebGLRenderingContext, properties: WebGLProperties, info: WebGLRendererInfo)
        {
            this.gl = gl;
            this.geometries = {};
            this.properties = properties;
            this.info = info;
              
        }

        private onGeometryDispose(event)
        {
            var geometries = this.geometries;
            var properties = this.properties;

            var geometry = event.target;
            var buffergeometry = geometries[geometry.id];

            if (buffergeometry.index !== null)
            { 
                this.deleteAttribute(buffergeometry.index); 
            }

            this.deleteAttributes(buffergeometry.attributes);

            geometry.removeEventListener('dispose', this.onGeometryDispose, this); 
            delete geometries[geometry.id];

            // TODO

            var property = properties.get(geometry);

            if (property.wireframe)
            { 
                this.deleteAttribute(property.wireframe); 
            }

            properties.delete(geometry);

            var bufferproperty = properties.get(buffergeometry);

            if (bufferproperty.wireframe)
            { 
                this.deleteAttribute(bufferproperty.wireframe); 
            }

            properties.delete(buffergeometry);

            //

            this.info.memory.geometries--;

        }
        private getAttributeBuffer(attribute: BufferAttribute | InterleavedBufferAttribute): WebGLBuffer
        {
            var properties = this.properties;
            if (attribute instanceof InterleavedBufferAttribute)
            { 
                return properties.get(attribute.data).__webglBuffer; 
            } 
            return properties.get(attribute).__webglBuffer; 
        }
        private deleteAttribute(attribute) 
        {
            var buffer = this.getAttributeBuffer(attribute) as WebGLBuffer; 
            if (buffer !== undefined)
            {
                this.gl.deleteBuffer(buffer);
                this.removeAttributeBuffer(attribute);
            }
        }
        private deleteAttributes(attributes)
        { 
            for (var name in attributes)
            { 
                this.deleteAttribute(attributes[name]); 
            } 
        }
        private removeAttributeBuffer(attribute: BufferAttribute | InterleavedBufferAttribute)
        {
            var properties = this.properties;
            if (attribute instanceof InterleavedBufferAttribute)
            { 
                properties.delete(attribute.data); 
            }
            else
            { 
                properties.delete(attribute); 
            } 
        }

        public get(object: Object3D): BufferGeometry
        { 
            var geometry = object.geometry;
            var geometries = this.geometries;

            if (geometries[geometry.id] !== undefined)
            {
                return geometries[geometry.id];
            }

            geometry.addEventListener('dispose', this.onGeometryDispose, this);

            var buffergeometry: BufferGeometry;

            if (geometry instanceof BufferGeometry)
            { 
                buffergeometry = geometry; 
            }
            else if (geometry instanceof Geometry)
            {
                if (geometry._bufferGeometry === undefined)
                {
                    geometry._bufferGeometry = new BufferGeometry().setFromObject(object);
                }

                buffergeometry = geometry._bufferGeometry;
            }

            geometries[geometry.id] = buffergeometry;

            this.info.memory.geometries++;
            return buffergeometry; 
        }
    }
}