/// <reference path="../three.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 * @author *kile / http://kile.stravaganza.org/
 * @author philogb / http://blog.thejit.org/
 * @author mikael emtinger / http://gomo.se/
 * @author egraether / http://egraether.com/
 * @author WestLangley / http://github.com/WestLangley
 */

namespace THREE
{
    export class Vector3
    { 
        constructor(public x = 0, public y = 0, public z = 0)
        {
        }
        set(x: number, y: number, z: number)
        {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        }
        setScalar(scalar: number)
        {
            this.x = scalar;
            this.y = scalar;
            this.z = scalar;
            return this;
        }
        setX(x: number)
        {
            this.x = x;
            return this;
        }
        setY(y: number)
        {
            this.y = y;
            return this;
        }
        setZ(z: number)
        {
            this.z = z;
            return this;
        }
        setComponent(index: number, value: number)
        { 
            switch (index)
            { 
                case 0: this.x = value; break;
                case 1: this.y = value; break;
                case 2: this.z = value; break;
                default: throw new Error('index is out of range: ' + index); 
            } 
        }
        getComponent(index: number)
        { 
            switch (index)
            { 
                case 0: return this.x;
                case 1: return this.y;
                case 2: return this.z;
                default: throw new Error('index is out of range: ' + index); 
            } 
        } 
        clone()
        {
            return new Vector3(this.x, this.y, this.z); 
        }
        copy(v: Vector3)
        { 
            this.x = v.x;
            this.y = v.y;
            this.z = v.z; 
            return this; 
        }
        add(v: Vector3)
        {   
            this.x += v.x;
            this.y += v.y;
            this.z += v.z; 
            return this; 
        }
        addScalar(s: number)
        { 
            this.x += s;
            this.y += s;
            this.z += s; 
            return this; 
        }
        addVectors(a: Vector3, b: Vector3)
        { 
            this.x = a.x + b.x;
            this.y = a.y + b.y;
            this.z = a.z + b.z; 
            return this; 
        }
        addScaledVector(v: Vector3, s: number)
        { 
            this.x += v.x * s;
            this.y += v.y * s;
            this.z += v.z * s; 
            return this; 
        }
        sub(v: Vector3)
        {  
            this.x -= v.x;
            this.y -= v.y;
            this.z -= v.z; 
            return this; 
        }
        subScalar(s: number)
        { 
            this.x -= s;
            this.y -= s;
            this.z -= s; 
            return this; 
        }
        subVectors(a: Vector3, b: Vector3)
        { 
            this.x = a.x - b.x;
            this.y = a.y - b.y;
            this.z = a.z - b.z; 
            return this; 
        }
        multiply(v: Vector3)
        { 
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z; 
            return this; 
        }
        multiplyScalar(scalar: number)
        { 
            if (isFinite(scalar))
            { 
                this.x *= scalar;
                this.y *= scalar;
                this.z *= scalar; 
            }
            else
            { 
                this.x = 0;
                this.y = 0;
                this.z = 0; 
            } 
            return this; 
        }
        multiplyVectors(a: Vector3, b: Vector3)
        { 
            this.x = a.x * b.x;
            this.y = a.y * b.y;
            this.z = a.z * b.z; 
            return this; 
        }
        applyEuler(euler: Euler): this
        { 
            var quaternion = new Quaternion();
            var func = Vector3.prototype.applyEuler = function (euler: Euler)
            {
                this.applyQuaternion(quaternion.setFromEuler(euler)); 
                return this;
            }
            return func.apply(this, arguments);
        }
        applyAxisAngle(axis: Vector3, angle: number): this
        {
            var quaternion = new Quaternion();
            var func = Vector3.prototype.applyAxisAngle = function (axis: Vector3, angle: number)
            {
                this.applyQuaternion(quaternion.setFromAxisAngle(axis, angle)); 
                return this;
            }
            return func.apply(this, arguments);
        }
        applyMatrix3 (m: Matrix3)
        { 
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;

            this.x = e[0] * x + e[3] * y + e[6] * z;
            this.y = e[1] * x + e[4] * y + e[7] * z;
            this.z = e[2] * x + e[5] * y + e[8] * z;

            return this;

        }
        applyMatrix4(m: Matrix4)
        { 
            // input: THREE.Matrix4 affine matrix 
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;

            this.x = e[0] * x + e[4] * y + e[8] * z + e[12];
            this.y = e[1] * x + e[5] * y + e[9] * z + e[13];
            this.z = e[2] * x + e[6] * y + e[10] * z + e[14]; 
            return this; 
        }
        applyProjection(m: Matrix4)
        { 
            // input: THREE.Matrix4 projection matrix 
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;
            var d = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]); // perspective divide

            this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * d;
            this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * d;
            this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * d;

            return this;

        }
        applyQuaternion(q: Quaternion)
        { 
            var x = this.x, y = this.y, z = this.z;
            var qx = q.x, qy = q.y, qz = q.z, qw = q.w;

            // calculate quat * vector

            var ix = qw * x + qy * z - qz * y;
            var iy = qw * y + qz * x - qx * z;
            var iz = qw * z + qx * y - qy * x;
            var iw = - qx * x - qy * y - qz * z;

            // calculate result * inverse quat

            this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
            this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
            this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx; 
            return this; 
        }
        project(camera: Camera): this
        {
            var matrix = new Matrix4();
            var func = Vector3.prototype.project
                = function (camera)
                {
                    matrix.multiplyMatrices(camera.projectionMatrix, matrix.getInverse(camera.matrixWorld));

                    this.applyProjection(matrix); 
                    return this;
                }
            return func.apply(this, arguments);
        }
        unproject(camera: Camera): this
        {
            var matrix = new Matrix4();
            var func = Vector3.prototype.unproject
                = function (camera)
                {
                    matrix.multiplyMatrices(camera.matrixWorld, matrix.getInverse(camera.projectionMatrix));
                    this.applyProjection(matrix); 

                    return this;
                }
            return func.apply(this, arguments);
        }
        transformDirection(m: Matrix4)
        { 
            // input: THREE.Matrix4 affine matrix
            // vector interpreted as a direction 
            var x = this.x, y = this.y, z = this.z;
            var e = m.elements;

            this.x = e[0] * x + e[4] * y + e[8] * z;
            this.y = e[1] * x + e[5] * y + e[9] * z;
            this.z = e[2] * x + e[6] * y + e[10] * z; 
            return this.normalize(); 
        }
        divide(v: Vector3)
        { 
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z; 
            return this; 
        }
        divideScalar(scalar: number)
        { 
            return this.multiplyScalar(1 / scalar); 
        }
        min(v: Vector3)
        { 
            this.x = Math.min(this.x, v.x);
            this.y = Math.min(this.y, v.y);
            this.z = Math.min(this.z, v.z); 
            return this; 
        }
        max(v: Vector3)
        { 
            this.x = Math.max(this.x, v.x);
            this.y = Math.max(this.y, v.y);
            this.z = Math.max(this.z, v.z); 
            return this; 
        }
        clamp(min: Vector3, max: Vector3)
        { 
            // This function assumes min < max, if this assumption isn't true it will not operate correctly
            this.x = Math.max(min.x, Math.min(max.x, this.x));
            this.y = Math.max(min.y, Math.min(max.y, this.y));
            this.z = Math.max(min.z, Math.min(max.z, this.z)); 
            return this; 
        }
        clampScalar(minVal: number, maxVal: number): this
        {
            var min = new Vector3();
            var max = new Vector3(); 

            var func = Vector3.prototype.clampScalar
                = function (minVal: number, maxVal: number)
                {
                    min.set(minVal, minVal, minVal);
                    max.set(maxVal, maxVal, maxVal);
                    this.clamp(min, max); 

                    return this;
                }
            return func.apply(this, arguments);
        }
        clampLength(min: number, max: number)
        { 
            var length = this.length(); 
            return this.multiplyScalar(Math.max(min, Math.min(max, length)) / length); 
        }
        floor ()
        { 
            this.x = Math.floor(this.x);
            this.y = Math.floor(this.y);
            this.z = Math.floor(this.z); 
            return this; 
        }
        ceil()
        { 
            this.x = Math.ceil(this.x);
            this.y = Math.ceil(this.y);
            this.z = Math.ceil(this.z); 
            return this; 
        }
        round ()
        { 
            this.x = Math.round(this.x);
            this.y = Math.round(this.y);
            this.z = Math.round(this.z); 
            return this; 
        }
        roundToZero ()
        { 
            this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
            this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
            this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z); 
            return this; 
        } 
        negate ()
        { 
            this.x = - this.x;
            this.y = - this.y;
            this.z = - this.z; 
            return this; 
        }
        dot(v: Vector3)
        { 
            return this.x * v.x + this.y * v.y + this.z * v.z; 
        }
        lengthSq ()
        { 
            return this.x * this.x + this.y * this.y + this.z * this.z; 
        }
        length ()
        { 
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); 
        } 
        lengthManhattan ()
        { 
            return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z); 
        }
        normalize ()
        { 
            return this.divideScalar(this.length()); 
        }
        setLength(length: number)
        { 
            return this.multiplyScalar(length / this.length()); 
        }
        lerp(v: Vector3, alpha: number)
        { 
            this.x += (v.x - this.x) * alpha;
            this.y += (v.y - this.y) * alpha;
            this.z += (v.z - this.z) * alpha; 
            return this; 
        }
        lerpVectors(v1: Vector3, v2: Vector3, alpha: number)
        { 
            return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1); 
        }
        cross(v: Vector3)
        { 
            var x = this.x, y = this.y, z = this.z;

            this.x = y * v.z - z * v.y;
            this.y = z * v.x - x * v.z;
            this.z = x * v.y - y * v.x; 
            return this; 
        }
        crossVectors(a: Vector3, b: Vector3)
        { 
            var ax = a.x, ay = a.y, az = a.z;
            var bx = b.x, by = b.y, bz = b.z; 
            this.x = ay * bz - az * by;
            this.y = az * bx - ax * bz;
            this.z = ax * by - ay * bx; 
            return this; 
        }
        projectOnVector(vector: Vector3)
        { 
            var scalar = vector.dot(this) / vector.lengthSq(); 
            return this.copy(vector).multiplyScalar(scalar); 
        }
        projectOnPlane(planeNormal: Vector3): this
        {
            var v1 = new Vector3();
            var func = Vector3.prototype.projectOnPlane
                = function (planeNormal: Vector3)
            {
                v1.copy(this).projectOnVector(planeNormal);
                this.sub(v1); 
                return this;
            }
            return func.apply(this, arguments);
        }
        reflect(normal: Vector3): this
        {
            var v1 = new Vector3();
            var func = Vector3.prototype.reflect = function (normal: Vector3)
            {
                this.sub(v1.copy(normal).multiplyScalar(2 * this.dot(normal))); 
                return this;
            }
            return func.apply(this, arguments);
        }
        angleTo(v: Vector3)
        { 
            var theta = this.dot(v) / (Math.sqrt(this.lengthSq() * v.lengthSq())); 
            // clamp, to handle numerical problems 
            return Math.acos(Math.clamp(theta, - 1, 1)); 
        }
        distanceTo(v: Vector3)
        { 
            return Math.sqrt(this.distanceToSquared(v)); 
        }
        distanceToSquared(v: Vector3)
        { 
            var dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z; 
            return dx * dx + dy * dy + dz * dz; 
        }
        distanceToManhattan(v: Vector3)
        { 
            return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z); 
        } 
        setFromSpherical(s: { phi: number, radius: number, theta: number })
        { 
            var sinPhiRadius = Math.sin(s.phi) * s.radius; 
            this.x = sinPhiRadius * Math.sin(s.theta);
            this.y = Math.cos(s.phi) * s.radius;
            this.z = sinPhiRadius * Math.cos(s.theta); 
            return this; 
        }
        setFromMatrixPosition(m: Matrix4)
        { 
            return this.setFromMatrixColumn(m, 3); 
        }
        setFromMatrixScale(m: Matrix4)
        { 
            var sx = this.setFromMatrixColumn(m, 0).length();
            var sy = this.setFromMatrixColumn(m, 1).length();
            var sz = this.setFromMatrixColumn(m, 2).length(); 
            this.x = sx;
            this.y = sy;
            this.z = sz; 
            return this; 
        }
        setFromMatrixColumn(m: Matrix4, index: number)
        { 
            return this.fromArray(m.elements, index * 4); 
        }
        equals(v: Vector3)
        { 
            return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z)); 
        }
        fromArray (array:ArrayLike<number>, offset =0)
        {  
            this.x = array[offset];
            this.y = array[offset + 1];
            this.z = array[offset + 2]; 
            return this; 
        }
        toArray (array:ArrayLike<number>=[], offset=0)
        {  
            array[offset] = this.x;
            array[offset + 1] = this.y;
            array[offset + 2] = this.z; 
            return array; 
        }
        fromAttribute(attribute: { itemSize: number, array: ArrayLike<number> } , index:number, offset=0)
        {  
            index = index * attribute.itemSize + offset; 
            this.x = attribute.array[index];
            this.y = attribute.array[index + 1];
            this.z = attribute.array[index + 2]; 
            return this; 
        } 
    } 
}  