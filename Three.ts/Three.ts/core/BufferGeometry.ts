/// <reference path="eventdispatcher.ts" />
/// <reference path="geometry.ts" />
/* 
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export type BufferAttributeType = BufferAttribute | InterleavedBufferAttribute;
    export interface IGeometryGroup
    {
        start?: number;
        count?: number;
        materialIndex?: number;
        instances?: number; 
    }
    export interface IBufferGeometryAttributes
    {
        position?: BufferAttribute;
        normal?: BufferAttribute;
        color?: BufferAttribute;
        uv?: BufferAttribute;
        uv2?: BufferAttribute;
        lineDistance?: BufferAttribute;
        skinWeight?: BufferAttribute;
        vertices?: BufferAttribute;
        vertexNormals?: BufferAttribute; 
    } 
    export interface IBufferGeometryMorphAttributes
    {
        position?: BufferAttribute[];
        normal?: BufferAttribute[];
    }
    export class BufferGeometry extends EventDispatcher implements IGeometry
    {
        uuid: string;
        name: string;
        type = 'BufferGeometry';
        index: BufferAttribute = null;
        attributes: IBufferGeometryAttributes = {}; 

        morphAttributes: IBufferGeometryMorphAttributes = {};
        groups: IGeometryGroup[] = []; 
        boundingBox: Box3 = null;
        boundingSphere = null;
        drawRange = { start: 0, count: Infinity };
        maxInstancedCount: number;

        private _id = GeometryIdCount++;
        get id()
        {
            return this._id;
        }
        parameters: any;

        constructor()
        {
            super();
        }

        getIndex()
        {
            return this.index;
        }
        setIndex(index)
        {
            this.index = index;
        }
        addAttribute(name: string, attribute: BufferAttribute)
        {
            this.attributes[name] = attribute;
            return this;
        }
        getAttribute(name: string)
        {
            return this.attributes[name];
        }

        removeAttribute(name: string)
        {
            delete this.attributes[name];
            return this;
        }
        addGroup(start: number, count: number, materialIndex: number = 0)
        {
            this.groups.push({
                start: start,
                count: count,
                materialIndex: materialIndex
            });
        }
        clearGroups()
        {
            this.groups = [];
        }
        setDrawRange(start: number, count: number)
        {
            this.drawRange.start = start;
            this.drawRange.count = count;
        }

        applyMatrix(matrix: Matrix4)
        {
            var position = this.attributes.position as BufferAttribute;

            if (position !== undefined)
            {
                matrix.applyToVector3Array(position.array);
                position.needsUpdate = true;
            }

            var normal = this.attributes.normal;
            if (normal !== undefined)
            {
                var normalMatrix = new Matrix3().getNormalMatrix(matrix);
                normalMatrix.applyToVector3Array(normal.array);
                normal.needsUpdate = true;
            }

            if (this.boundingBox !== null)
            {
                this.computeBoundingBox();
            }

            if (this.boundingSphere !== null)
            {
                this.computeBoundingSphere();
            }
            return this;
        }
         
        rotateX(angle: number): this
        {
            var m1: Matrix4 = BufferGeometry[".rotateX.m1"] || (BufferGeometry[".rotateX.m1"] = new Matrix4()); 
            m1.makeRotationX(angle);
            this.applyMatrix(m1);
            return this; 
        } 
        rotateY(angle: number): this
        {
            var m1: Matrix4 = BufferGeometry[".rotateY.m1"] || (BufferGeometry[".rotateY.m1"] = new Matrix4());  
            // rotate geometry around world y-axis  
            m1.makeRotationY(angle);
            this.applyMatrix(m1);
            return this;
        } 
        rotateZ(angle: number): this
        {
            var m1: Matrix4 = BufferGeometry[".rotateZ.m1"] || (BufferGeometry[".rotateZ.m1"] = new Matrix4());  

            // rotate geometry around world z-axis   
            m1.makeRotationZ(angle);
            this.applyMatrix(m1);
            return this;
        }
         
        translate(x: number, y: number, z: number): this
        {
            // translate geometry 
            var m1: Matrix4 = BufferGeometry[".translate.m1"] || (BufferGeometry[".translate.m1"] = new Matrix4());   
            m1.makeTranslation(x, y, z);
            this.applyMatrix(m1);
            return this;
        } 
        scale(x: number, y: number, z: number): this
        {
            // scale geometry  
            var m1: Matrix4 = BufferGeometry[".scale.m1"] || (BufferGeometry[".scale.m1"] = new Matrix4()); 
            m1.makeScale(x, y, z);
            this.applyMatrix(m1);
            return this;
        }
         
        lookAt(vector: Vector3): this
        {
            var obj: Object3D = BufferGeometry[".lookAt.obj"] || (BufferGeometry[".lookAt.obj"] = new Object3D());
             
            obj.lookAt(vector);
            obj.updateMatrix();

            return this.applyMatrix(obj.matrix);
        }
        center()
        {
            this.computeBoundingBox();
            var offset = this.boundingBox.center().negate();
            this.translate(offset.x, offset.y, offset.z);
            return offset;
        }

        setFromObject(object: Object3D)
        {
            // console.log( 'THREE.BufferGeometry.setFromObject(). Converting', object, this ); 
            var geometry = object.geometry as Geometry;

            if (object instanceof Points || object instanceof Line)
            { 
                var positions = new Float32Attribute(geometry.vertices.length * 3, 3);
                var colors = new Float32Attribute(geometry.colors.length * 3, 3);

                this.addAttribute('position', positions.copyVector3sArray(geometry.vertices));
                this.addAttribute('color', colors.copyColorsArray(geometry.colors));

                if (geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length)
                {
                    var lineDistances = new Float32Attribute(geometry.lineDistances.length, 1);
                    this.addAttribute('lineDistance', lineDistances.copyArray(geometry.lineDistances));
                }

                if (geometry.boundingSphere !== null)
                {
                    this.boundingSphere = geometry.boundingSphere.clone();
                }
                if (geometry.boundingBox !== null)
                {
                    this.boundingBox = geometry.boundingBox.clone();
                }

            }
            else if (object instanceof Mesh)
            {
                if (geometry instanceof Geometry)
                {
                    this.fromGeometry(geometry);
                }
            }
            return this;
        } 
        updateFromObject(object: Object3D)
        { 
            var geometry = object.geometry;

            if (object instanceof THREE.Mesh)
            { 
                var direct = geometry.__directGeometry; 
                if (direct === undefined || geometry.elementsNeedUpdate === true)
                { 
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

            if (geometry.verticesNeedUpdate === true)
            { 
                attribute = this.attributes.position; 
                if (attribute !== undefined)
                { 
                    attribute.copyVector3sArray(geometry.vertices);
                    attribute.needsUpdate = true; 
                }

                geometry.verticesNeedUpdate = false; 
            }

            if (geometry.normalsNeedUpdate === true)
            { 
                attribute = this.attributes.normal;

                if (attribute !== undefined)
                { 
                    attribute.copyVector3sArray(geometry.normals);
                    attribute.needsUpdate = true; 
                }

                geometry.normalsNeedUpdate = false; 
            }

            if (geometry.colorsNeedUpdate === true)
            { 
                attribute = this.attributes.color; 
                if (attribute !== undefined)
                { 
                    attribute.copyColorsArray(geometry.colors);
                    attribute.needsUpdate = true; 
                }

                geometry.colorsNeedUpdate = false; 
            }

            if (geometry.uvsNeedUpdate)
            { 
                attribute = this.attributes.uv;

                if (attribute !== undefined)
                { 
                    attribute.copyVector2sArray(geometry.uvs);
                    attribute.needsUpdate = true; 
                }

                geometry.uvsNeedUpdate = false; 
            }

            if (geometry.lineDistancesNeedUpdate)
            { 
                attribute = this.attributes.lineDistance; 
                if (attribute !== undefined)
                { 
                    attribute.copyArray(geometry.lineDistances);
                    attribute.needsUpdate = true; 
                }

                geometry.lineDistancesNeedUpdate = false;

            }

            if (geometry.groupsNeedUpdate)
            { 
                geometry.computeGroups(object.geometry);
                this.groups = geometry.groups; 
                geometry.groupsNeedUpdate = false; 
            } 
            return this; 
        } 
        fromGeometry(geometry)
        {
            geometry.__directGeometry = new DirectGeometry().fromGeometry(geometry);
            return this.fromDirectGeometry(geometry.__directGeometry);
        }
        fromDirectGeometry(geometry: DirectGeometry)
        {

            var positions = new Float32Array(geometry.vertices.length * 3);
            this.addAttribute('position', new BufferAttribute(positions, 3).copyVector3sArray(geometry.vertices));

            if (geometry.normals.length > 0)
            { 
                var normals = new Float32Array(geometry.normals.length * 3);
                this.addAttribute('normal', new BufferAttribute(normals, 3).copyVector3sArray(geometry.normals));
            }

            if (geometry.colors.length > 0)
            {
                var colors = new Float32Array(geometry.colors.length * 3);
                this.addAttribute('color', new BufferAttribute(colors, 3).copyColorsArray(geometry.colors));
            }

            if (geometry.uvs.length > 0)
            {
                var uvs = new Float32Array(geometry.uvs.length * 2);
                this.addAttribute('uv', new BufferAttribute(uvs, 2).copyVector2sArray(geometry.uvs));
            }

            if (geometry.uvs2.length > 0)
            {
                var uvs2 = new Float32Array(geometry.uvs2.length * 2);
                this.addAttribute('uv2', new BufferAttribute(uvs2, 2).copyVector2sArray(geometry.uvs2));
            }

            if (geometry.indices.length > 0)
            {
                var TypeArray = geometry.vertices.length > 65535 ? Uint32Array : Uint16Array;
                var indices = new TypeArray(geometry.indices.length * 3);
                this.setIndex(new BufferAttribute(indices, 1).copyIndicesArray(geometry.indices));
            }

            // groups 
            this.groups = geometry.groups;
            // morphs

            for (var name in geometry.morphTargets)
            {
                var array: Float32Attribute[] = [];
                var morphTargets = geometry.morphTargets[name];

                for (var i = 0, l = morphTargets.length; i < l; i++)
                {
                    var morphTarget = morphTargets[i];
                    var attribute = new Float32Attribute(morphTarget.length * 3, 3);
                    array.push(attribute.copyVector3sArray(morphTarget));
                }
                this.morphAttributes[name] = array;
            }

            // skinning

            if (geometry.skinIndices.length > 0)
            {
                var skinIndices = new Float32Attribute(geometry.skinIndices.length * 4, 4);
                this.addAttribute('skinIndex', skinIndices.copyVector4sArray(geometry.skinIndices));
            }

            if (geometry.skinWeights.length > 0)
            {
                var skinWeights = new Float32Attribute(geometry.skinWeights.length * 4, 4);
                this.addAttribute('skinWeight', skinWeights.copyVector4sArray(geometry.skinWeights));
            }

            // 
            if (geometry.boundingSphere !== null)
            {
                this.boundingSphere = geometry.boundingSphere.clone();
            }

            if (geometry.boundingBox !== null)
            {
                this.boundingBox = geometry.boundingBox.clone();
            }
            return this;
        }

        computeBoundingBox()
        {
            if (this.boundingBox === null)
            {
                this.boundingBox = new Box3();
            }

            var positions = this.attributes.position.array;
            if (positions !== undefined)
            {
                this.boundingBox.setFromArray(positions);
            }
            else
            {
                this.boundingBox.makeEmpty();
            }

            if (isNaN(this.boundingBox.min.x)
                || isNaN(this.boundingBox.min.y)
                || isNaN(this.boundingBox.min.z))
            {
                console.error('THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
            }
        }
        computeBoundingSphere()
        {
            var box =   new Box3() ;
            var vector =   new Vector3() ;

            var func = BufferGeometry.prototype.computeBoundingSphere = function ()
            {
                if (this.boundingSphere === null)
                {
                    this.boundingSphere = new Sphere();
                }

                var positions = this.attributes.position;

                if (positions)
                {
                    var array = positions.array;
                    var center = this.boundingSphere.center;

                    box.setFromArray(array);
                    box.center(center);

                    // hoping to find a boundingSphere with a radius smaller than the
                    // boundingSphere of the boundingBox: sqrt(3) smaller in the best case

                    var maxRadiusSq = 0;

                    for (var i = 0, il = array.length; i < il; i += 3)
                    {
                        vector.fromArray(array, i);
                        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));
                    }

                    this.boundingSphere.radius = Math.sqrt(maxRadiusSq);

                    if (isNaN(this.boundingSphere.radius))
                    {
                        console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
                    }
                }
            } 
            func.call(this);
        }
        computeFaceNormals()
        {
            // backwards compatibility 
        }
        computeVertexNormals()
        {
            var index = this.index;
            var attributes = this.attributes;
            var groups = this.groups;

            if (attributes.position)
            {
                var positions = attributes.position.array;
                if (attributes.normal === undefined)
                {
                    this.addAttribute('normal', new BufferAttribute(new Float32Array(positions.length), 3));

                }
                else
                {
                    // reset existing normals to zero 
                    var array = attributes.normal.array;

                    for (var i = 0, il = array.length; i < il; i++)
                    {
                        array[i] = 0;
                    }

                }

                var normals = attributes.normal.array;

                var vA, vB, vC,

                    pA = new Vector3(),
                    pB = new Vector3(),
                    pC = new Vector3(),

                    cb = new Vector3(),
                    ab = new Vector3();

                // indexed elements

                if (index)
                {
                    var indices = index.array;

                    if (groups.length === 0)
                    {
                        this.addGroup(0, indices.length);
                    }

                    for (var j = 0, jl = groups.length; j < jl; ++j)
                    {
                        var group = groups[j];
                        var start = group.start;
                        var count = group.count;

                        for (let i = start, il = start + count; i < il; i += 3)
                        { 
                            vA = indices[i + 0] * 3;
                            vB = indices[i + 1] * 3;
                            vC = indices[i + 2] * 3;

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
                else
                {
                    // non-indexed elements (unconnected triangle soup)

                    for (var i = 0, il = positions.length; i < il; i += 9)
                    {
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
        }
        merge(geometry: BufferGeometry, offset = 0)
        {
            var attributes = this.attributes;

            for (var key in attributes)
            {
                if (geometry.attributes[key] === undefined) continue;

                var attribute1 = attributes[key];
                var attributeArray1 = attribute1.array;

                var attribute2 = geometry.attributes[key];
                var attributeArray2 = attribute2.array;

                var attributeSize = attribute2.itemSize;

                for (var i = 0, j = attributeSize * offset; i < attributeArray2.length; i++ , j++)
                {
                    attributeArray1[j] = attributeArray2[i];
                }
            }
            return this;
        }
        normalizeNormals()
        {
            var normals = this.attributes.normal.array;
            var x: number, y: number, z: number, n: number;

            for (var i = 0, il = normals.length; i < il; i += 3)
            {
                x = normals[i];
                y = normals[i + 1];
                z = normals[i + 2];

                n = 1.0 / Math.sqrt(x * x + y * y + z * z);
                normals[i] *= n;
                normals[i + 1] *= n;
                normals[i + 2] *= n;
            }
        }
        toNonIndexed()
        {
            if (this.index === null)
            {
                console.warn('THREE.BufferGeometry.toNonIndexed(): Geometry is already non-indexed.');
                return this;
            }

            var geometry2 = new BufferGeometry();

            var indices = this.index.array;
            var attributes = this.attributes;

            for (var name in attributes)
            {
                var attribute = attributes[name];

                var array = attribute.array;
                var itemSize = attribute.itemSize;

                var array2 = new (array.constructor as any)(indices.length * itemSize);

                var index = 0, index2 = 0;

                for (var i = 0, l = indices.length; i < l; i++)
                {
                    index = indices[i] * itemSize;

                    for (var j = 0; j < itemSize; j++)
                    {
                        array2[index2++] = array[index++];
                    }
                }

                geometry2.addAttribute(name, new BufferAttribute(array2, itemSize));

            }
            return geometry2;
        }
        toJSON()
        {
            var data: any = {
                metadata: {
                    version: 4.4,
                    type: 'BufferGeometry',
                    generator: 'BufferGeometry.toJSON'
                }
            };

            // standard BufferGeometry serialization

            data.uuid = this.uuid;
            data.type = this.type;
            if (this.name !== '') data.name = this.name;

            if (this.parameters !== undefined)
            {
                var parameters = this.parameters;

                for (var key in parameters)
                {
                    if (parameters[key] !== undefined) data[key] = parameters[key];
                }
                return data;
            }

            data.data = { attributes: {} };

            var index = this.index;

            if (index !== null)
            {
                var array = Array.prototype.slice.call(index.array);
                data.data.index = {
                    type: index.array.constructor.name,
                    array: array
                };
            }

            var attributes = this.attributes;

            for (var key in attributes)
            {
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

            if (groups.length > 0)
            {
                data.data.groups = JSON.parse(JSON.stringify(groups));
            }

            var boundingSphere = this.boundingSphere;

            if (boundingSphere !== null)
            {
                data.data.boundingSphere = {
                    center: boundingSphere.center.toArray(),
                    radius: boundingSphere.radius
                };
            }
            return data;
        }
        clone()
        {
            return new BufferGeometry().copy(this);
        }
        copy(source)
        {
            var index = source.index;
            if (index !== null)
            {
                this.setIndex(index.clone());
            }

            var attributes = source.attributes;

            for (var name in attributes)
            {
                var attribute = attributes[name];
                this.addAttribute(name, attribute.clone());
            }

            var groups = source.groups;

            for (var i = 0, l = groups.length; i < l; i++)
            {
                var group = groups[i];
                this.addGroup(group.start, group.count, group.materialIndex);
            }
            return this;
        }
        dispose()
        {
            this.dispatchEvent({ type: 'dispose' });
        }

        static MaxIndex = 65535;
    } 
}