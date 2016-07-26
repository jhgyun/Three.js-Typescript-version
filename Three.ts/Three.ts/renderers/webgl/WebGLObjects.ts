/* 
* @author mrdoob / http://mrdoob.com/
*/

namespace THREE
{
    interface IAttributeProperties
    {
        __webglBuffer?: WebGLBuffer;
        version?: number;
    }
    export class WebGLObjects
    {
        private gl: WebGLRenderingContext;
        private properties: WebGLProperties;
        private info: WebGLRendererInfo;
        private geometries: WebGLGeometries;

        constructor(gl: WebGLRenderingContext, properties: WebGLProperties, info: WebGLRendererInfo)
        { 
            this.gl = gl;
            this.properties = properties;
            this.info = info;

            this.geometries = new WebGLGeometries(gl, properties, info);
  
        }

        private updateAttribute(attribute: BufferAttribute, bufferType: number)
        {
            var properties = this.properties;
            
            var data: IBufferAttribute = attribute as any;
            if (attribute instanceof InterleavedBufferAttribute)
                data = attribute.data;

            var attributeProperties = properties.get(data) as IAttributeProperties;

            if (attributeProperties.__webglBuffer === undefined)
            { 
                this.createBuffer(attributeProperties, data, bufferType); 
            }
            else if (attributeProperties.version !== data.version)
            { 
                this.updateBuffer(attributeProperties, data, bufferType); 
            } 
        }
        private createBuffer(attributeProperties: IAttributeProperties, data: IBufferAttribute, bufferType: number)
        {
            var gl = this.gl;

            attributeProperties.__webglBuffer = gl.createBuffer();
            gl.bindBuffer(bufferType, attributeProperties.__webglBuffer);

            var usage = data.dynamic ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW; 

            gl.bufferData(bufferType, data.array, usage);

            attributeProperties.version = data.version;

        }
        private updateBuffer(attributeProperties: IAttributeProperties, data: IBufferAttribute, bufferType: number)
        {
            var gl = this.gl;

            gl.bindBuffer(bufferType, attributeProperties.__webglBuffer);

            if (data.dynamic === false || data.updateRange.count === - 1)
            { 
                // Not using update ranges 
                gl.bufferSubData(bufferType, 0, data.array); 
            }
            else if (data.updateRange.count === 0)
            { 
                console.error('THREE.WebGLObjects.updateBuffer: dynamic THREE.BufferAttribute marked as needsUpdate but updateRange.count is 0, ensure you are using set methods or updating manually.');
            }
            else
            { 
                gl.bufferSubData(bufferType, data.updateRange.offset * data.array.BYTES_PER_ELEMENT,
                    data.array.subarray(data.updateRange.offset, data.updateRange.offset + data.updateRange.count));

                data.updateRange.count = 0; // reset range 
            }

            attributeProperties.version = data.version;

        }
        private checkEdge(edges: { [index: string]: number[] }, a: number, b: number)
        {
            if (a > b)
            {
                var tmp = a;
                a = b;
                b = tmp;
            }

            var list = edges[a];

            if (list === undefined)
            {
                edges[a] = [b];
                return true;
            }
            else if (list.indexOf(b) === -1)
            {
                list.push(b);
                return true;
            }

            return false;

        }

        public getAttributeBuffer(attribute: BufferAttribute ): WebGLBuffer
        {
            var properties = this.properties;
            if (attribute instanceof InterleavedBufferAttribute)
            {
                return (properties.get(attribute.data) as IAttributeProperties).__webglBuffer; 
            }

            return (properties.get(attribute) as IAttributeProperties).__webglBuffer;

        } 
        public getWireframeAttribute(geometry: BufferGeometry): BufferAttribute
        {
            var properties = this.properties;
            var checkEdge = this.checkEdge;
            var gl = this.gl;

            var property = properties.get(geometry);
            if (property.wireframe !== undefined)
            {
                return property.wireframe;
            }

            var indices = [];

            var index = geometry.index;
            var attributes = geometry.attributes;
            var position = attributes.position;

            // console.time( 'wireframe' );

            if (index !== null)
            {
                var edges: { [index: string]: number[] } = {};
                var array = index.array;

                for (var i = 0, l = array.length; i < l; i += 3)
                {
                    var a = array[i + 0];
                    var b = array[i + 1];
                    var c = array[i + 2];

                    if (checkEdge(edges, a, b)) indices.push(a, b);
                    if (checkEdge(edges, b, c)) indices.push(b, c);
                    if (checkEdge(edges, c, a)) indices.push(c, a);
                }
            }
            else
            {
                let array = attributes.position.array;
                for (var i = 0, l = (array.length / 3) - 1; i < l; i += 3)
                { 
                    var a = i + 0;
                    var b = i + 1;
                    var c = i + 2; 
                    indices.push(a, b, b, c, c, a); 
                } 
            }

            // console.timeEnd( 'wireframe' ); 
            var TypeArray = position.count > 65535 ? Uint32Array : Uint16Array;
            var attribute = new BufferAttribute(new TypeArray(indices), 1); 
            this.updateAttribute(attribute, gl.ELEMENT_ARRAY_BUFFER);

            property.wireframe = attribute; 
            return attribute;

        }

        public update(object: Object3D)
        { 
            // TODO: Avoid updating twice (when using shadowMap). Maybe add frame counter.
            var gl = this.gl;
            
            var geometry = this.geometries.get(object);

            if (object.geometry instanceof Geometry)
            { 
                geometry.updateFromObject(object); 
            }

            var index = geometry.index;
            var attributes = geometry.attributes;

            if (index !== null)
            { 
                this.updateAttribute(index, gl.ELEMENT_ARRAY_BUFFER); 
            }

            for (var name in attributes)
            { 
                this.updateAttribute(attributes[name], gl.ARRAY_BUFFER); 
            }

            // morph targets

            var morphAttributes = geometry.morphAttributes;
            for (var name in morphAttributes)
            { 
                var array = morphAttributes[name] as BufferAttribute[];

                for (var i = 0, l = array.length; i < l; i++)
                { 
                    this.updateAttribute(array[i], gl.ARRAY_BUFFER); 
                } 
            }
            return geometry;
        }

    }
}
