/// <reference path="eventdispatcher.ts" />
/// <reference path="../math/matrix3.ts" />
/// <reference path="../math/matrix4.ts" />
/// <reference path="../math/vector2.ts" />
/// <reference path="../math/vector3.ts" />
/// <reference path="../math/vector4.ts" />
/// <reference path="../math/color.ts" />
/// <reference path="../math/box2.ts" />
/// <reference path="../math/box3.ts" />
/// <reference path="../math/sphere.ts" />
/// <reference path="../math/spherical.ts" />
/// <reference path="../math/triangle.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author elephantatwork / www.elephantatwork.ch
 */

namespace THREE
{
    export class Object3D extends EventDispatcher
    {
        static DefaultUp = new Vector3(0, 1, 0);
        static DefaultMatrixAutoUpdate = true;

        private _id = Object3DIdCount++;
        get id()
        {
            return this._id;
        }

        uuid = Math.generateUUID();

        name = '';
        type = 'Object3D';

        parent = null;
        children = [];

        up = Object3D.DefaultUp.clone();

        private _position = new Vector3();
        private _rotation = new Euler();
        private _quaternion = new Quaternion();
        private _scale = new Vector3(1, 1, 1);
        private _modelViewMatrix = new Matrix4();
        private _normalMatrix = new Matrix3();

        geometry: IGeometry;
        material: IMaterial;
        matrix = new Matrix4();
        matrixWorld = new Matrix4();

        matrixAutoUpdate = Object3D.DefaultMatrixAutoUpdate;
        matrixWorldNeedsUpdate = false;

        layers = new Layers();
        visible = true;

        castShadow = false;
        receiveShadow = false;

        frustumCulled = true;
        renderOrder = 0;
        userData: any = {};

        constructor()
        {
            super();
            this.rotation.onChange(this.onRotationChange, this);
            this.quaternion.onChange(this.onQuaternionChange,this);
        }
        private onRotationChange()
        {
            this.quaternion.setFromEuler(this.rotation, false);
        }
        private onQuaternionChange()
        {
            this.rotation.setFromQuaternion(this.quaternion, undefined, false);
        }

        get position()
        {
            return this._position;
        }
        get rotation()
        {
            return this._rotation;
        }
        get quaternion()
        {
            return this._quaternion;
        }
        get scale()
        {
            return this._scale;
        }
        get modelViewMatrix()
        {
            return this._modelViewMatrix;
        }
        get normalMatrix()
        {
            return this._normalMatrix;
        }

        applyMatrix(matrix: Matrix4)
        {
            this.matrix.multiplyMatrices(matrix, this.matrix);
            this.matrix.decompose(this.position, this.quaternion, this.scale);
        }
        setRotationFromAxisAngle(axis: Vector3, angle: number)
        {
            // assumes axis is normalized 
            this.quaternion.setFromAxisAngle(axis, angle);
        }
        setRotationFromEuler(euler: Euler)
        {
            this.quaternion.setFromEuler(euler, true);
        }
        setRotationFromMatrix(m: Matrix4)
        {
            // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled) 
            this.quaternion.setFromRotationMatrix(m);
        }
        setRotationFromQuaternion(q: Quaternion)
        {
            // assumes q is normalized 
            this.quaternion.copy(q);
        }
        rotateOnAxis(axis: Vector3, angle: number): this
        {
            var q1 = new Quaternion();

            var func = Object3D.prototype.rotateOnAxis
                = function (axis: Vector3, angle: number)
                {
                    // rotate object on axis in object space
                    // axis is assumed to be normalized 

                    q1.setFromAxisAngle(axis, angle); 
                    this.quaternion.multiply(q1);  
                    return this;
                }
            return func.apply(this, arguments);
        }
        rotateX(angle: number): this
        {
            var v1 = new Vector3(1, 0, 0);
            var func = Object3D.prototype.rotateX = function (angle: number)
            {
                return this.rotateOnAxis(v1, angle);
            };
            return func.apply(this, arguments);
        }
        rotateY(angle: number): this
        {
            var v1 = new Vector3(0, 1, 0);
            var func = Object3D.prototype.rotateY = function (angle: number)
            {
                this.rotateOnAxis(v1, angle);
                return this;
            }
            return func.apply(this, arguments);
        }
        rotateZ(angle: number): this
        {
            var v1 = new Vector3(0, 0, 1);
            var func = Object3D.prototype.rotateZ = function (angle: number)
            {
                this.rotateOnAxis(v1, angle);
                return this;
            }
            return func.apply(this, arguments);
        }

        translateOnAxis(axis: Vector3, distance: number): this
        {
            // translate object by distance along axis in object space
            // axis is assumed to be normalized

            var v1 = new Vector3();
            var func = Object3D.prototype.translateOnAxis = function (axis: Vector3, distance: number)
            {
                v1.copy(axis).applyQuaternion(this.quaternion);
                this.position.add(v1.multiplyScalar(distance));

                return this;
            }
            return func.apply(this, arguments);
        }

        translateX(distance: number): this
        {
            var v1 = new Vector3(1, 0, 0);
            var func = Object3D.prototype.translateX = function (distance: number)
            {
                return this.translateOnAxis(v1, distance);
            }

            return func.apply(this, arguments);
        }

        translateY(distance: number): this
        {
            var v1 = new Vector3(0, 1, 0);
            var func = Object3D.prototype.translateY = function (distance: number)
            {
                return this.translateOnAxis(v1, distance);
            }
            return func.apply(this, arguments);
        }

        translateZ(distance: number): this
        {
            var v1 = new Vector3(0, 0, 1);
            var func = Object3D.prototype.translateZ = function (distance: number)
            {
                return this.translateOnAxis(v1, distance);
            }
            return func.apply(this, arguments);
        }

        localToWorld(vector: Vector3): Vector3
        {
            return vector.applyMatrix4(this.matrixWorld);
        }
        worldToLocal(vector: Vector3): Vector3
        {
            var m1 = new Matrix4();
            var func = Object3D.prototype.worldToLocal = function (vector: Vector3)
            {
                return vector.applyMatrix4(m1.getInverse(this.matrixWorld));
            }

            return func.apply(this, arguments);
        }

        lookAt(vector: Vector3) 
        {
            // This routine does not support objects with rotated and/or translated parent(s)
            var m1 =   new Matrix4() ;

            var func = Object3D.prototype.lookAt = function (vector: Vector3)
            {
                m1.lookAt(vector, this.position, this.up);
                this.quaternion.setFromRotationMatrix(m1);
            }

            func.apply(this, arguments);
        }

        add(object?: Object3D | any, ...args: any[]) 
        {
            if (arguments.length > 1)
            {
                for (var i = 0; i < arguments.length; i++)
                {
                    this.add(arguments[i]);
                }
                return this;
            }

            if (object === this)
            {
                console.error("THREE.Object3D.add: object can't be added as a child of itself.", object);
                return this;
            }

            if (object instanceof Object3D)
            {
                if (object.parent !== null)
                {
                    object.parent.remove(object);
                }
                object.parent = this;
                object.dispatchEvent({ type: 'added' });

                this.children.push(object);
            }
            else
            {
                console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.", object);
            }
            return this;
        }
        remove(object: Object3D, ...args: Object3D[])
        {
            if (arguments.length > 1)
            {
                for (var i = 0; i < arguments.length; i++)
                {
                    this.remove(arguments[i]);
                }
            }

            var index = this.children.indexOf(object);

            if (index !== - 1)
            {
                object.parent = null;
                object.dispatchEvent({ type: 'removed' });
                this.children.splice(index, 1);
            }
        }

        getObjectById(id: number)
        {
            return this.getObjectByProperty('id', id);
        }

        getObjectByName(name: string)
        {
            return this.getObjectByProperty('name', name);
        }

        getObjectByProperty(name: string, value: any)
        {
            if (this[name] === value) return this;

            for (var i = 0, l = this.children.length; i < l; i++)
            {
                var child = this.children[i];
                var object = child.getObjectByProperty(name, value);

                if (object !== undefined)
                {
                    return object;
                }
            }

            return undefined;
        }

        getWorldPosition(optionalTarget?: Vector3)
        {
            var result = optionalTarget || new Vector3();

            this.updateMatrixWorld(true);
            return result.setFromMatrixPosition(this.matrixWorld);
        }

        getWorldQuaternion(optionalTarget?: Quaternion): Quaternion
        {
            var position =   new Vector3() ;
            var scale = new Vector3() ;

            var func = Object3D.prototype.getWorldQuaternion = function (optionalTarget?: Quaternion)
            {
                var result = optionalTarget || new Quaternion();

                this.updateMatrixWorld(true);

                this.matrixWorld.decompose(position, result, scale);

                return result;
            }

            return func.apply(this, arguments);
        }

        getWorldRotation(optionalTarget?: Euler): Euler
        {
            var quaternion =   new Quaternion() ;

            var func =Object3D.prototype.getWorldRotation = function (optionalTarget?: Euler)
            {
                var result = optionalTarget || new Euler();
                this.getWorldQuaternion(quaternion);

                return result.setFromQuaternion(quaternion, this.rotation.order, false);
            }

            return  func.apply(this, arguments);
        }

        getWorldScale(optionalTarget?: Vector3): Vector3
        {
            var position = new Vector3() ;
            var quaternion =  new Quaternion() ;

            var func = Object3D.prototype.getWorldScale = function (optionalTarget?: Vector3)
            {
                var result = optionalTarget || new Vector3();

                this.updateMatrixWorld(true);
                this.matrixWorld.decompose(position, quaternion, result);

                return result;
            }

            return func.apply(this, arguments);
        }

        getWorldDirection(optionalTarget?: Vector3)
        {
            var quaternion =   new Quaternion() ;

            var func = Object3D.prototype.getWorldDirection = function (optionalTarget?: Vector3)
            {
                var result = optionalTarget || new Vector3();

                this.getWorldQuaternion(quaternion);

                return result.set(0, 0, 1).applyQuaternion(quaternion);
            }

            return func.apply(this, arguments);
        }

        raycast(raycaster: Raycaster, intersects) { }

        traverse(callback: (obj: Object3D) => any)
        {
            callback(this);

            var children = this.children;

            for (var i = 0, l = children.length; i < l; i++)
            {
                children[i].traverse(callback);
            }
        }

        traverseVisible(callback: (obj: Object3D) => any)
        {
            if (this.visible === false) return;
            callback(this);
            var children = this.children;

            for (var i = 0, l = children.length; i < l; i++)
            {
                children[i].traverseVisible(callback);
            }
        }

        traverseAncestors(callback: (obj: Object3D) => any)
        {
            var parent = this.parent;

            if (parent !== null)
            {
                callback(parent);
                parent.traverseAncestors(callback);
            }
        }

        updateMatrix()
        {
            this.matrix.compose(this.position, this.quaternion, this.scale);
            this.matrixWorldNeedsUpdate = true;
        }

        updateMatrixWorld(force?: boolean)
        {
            if (this.matrixAutoUpdate === true) this.updateMatrix();

            if (this.matrixWorldNeedsUpdate === true || force === true)
            {
                if (this.parent === null)
                {
                    this.matrixWorld.copy(this.matrix);
                }
                else
                {
                    this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix);
                }

                this.matrixWorldNeedsUpdate = false;
                force = true;
            }

            // update children
            for (var i = 0, l = this.children.length; i < l; i++)
            {
                this.children[i].updateMatrixWorld(force);
            }
        }

        toJSON(meta)
        {

            // meta is '' when called from JSON.stringify
            var isRootObject = (meta === undefined || meta === '');

            var output: any = {};

            // meta is a hash used to collect geometries, materials.
            // not providing it implies that this is the root object
            // being serialized.
            if (isRootObject)
            {

                // initialize meta obj
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

            // standard Object3D serialization

            var object: any = {};

            object.uuid = this.uuid;
            object.type = this.type;

            if (this.name !== '') object.name = this.name;
            if (JSON.stringify(this.userData) !== '{}') object.userData = this.userData;
            if (this.castShadow === true) object.castShadow = true;
            if (this.receiveShadow === true) object.receiveShadow = true;
            if (this.visible === false) object.visible = false;

            object.matrix = this.matrix.toArray();

            //

            if (this.geometry !== undefined)
            {
                if (meta.geometries[this.geometry.uuid] === undefined)
                {
                    meta.geometries[this.geometry.uuid] = (this.geometry as any).toJSON(meta);
                }

                object.geometry = this.geometry.uuid;
            }

            if (this.material !== undefined)
            {
                if (meta.materials[this.material.uuid] === undefined)
                {
                    meta.materials[this.material.uuid] = this.material.toJSON(meta);
                }

                object.material = this.material.uuid;
            }

            //

            if (this.children.length > 0)
            {
                object.children = [];
                for (var i = 0; i < this.children.length; i++)
                {
                    object.children.push(this.children[i].toJSON(meta).object);
                }
            }

            if (isRootObject)
            {
                var geometries = extractFromCache(meta.geometries);
                var materials = extractFromCache(meta.materials);
                var textures = extractFromCache(meta.textures);
                var images = extractFromCache(meta.images);

                if (geometries.length > 0) output.geometries = geometries;
                if (materials.length > 0) output.materials = materials;
                if (textures.length > 0) output.textures = textures;
                if (images.length > 0) output.images = images;
            }

            output.object = object;

            return output;

            // extract data from the cache hash
            // remove metadata on each item
            // and return as array
            function extractFromCache(cache)
            {

                var values = [];
                for (var key in cache)
                {

                    var data = cache[key];
                    delete data.metadata;
                    values.push(data);

                }
                return values;

            }

        }

        clone(recursive?: boolean): this
        {
            return new (this.constructor as any)().copy(this, recursive);
        }

        copy(source: Object3D, recursive?: boolean)
        {
            if (recursive === undefined) recursive = true;

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

            if (recursive === true)
            {
                for (var i = 0; i < source.children.length; i++)
                {
                    var child = source.children[i];
                    this.add(child.clone());
                }
            }
            return this;
        }
    }

    export var Object3DIdCount = 0;
}