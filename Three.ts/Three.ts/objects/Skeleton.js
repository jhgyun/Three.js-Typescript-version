var THREE;
(function (THREE) {
    var Skeleton = (function () {
        function Skeleton(bones, boneInverses, useVertexTexture) {
            this.identityMatrix = new THREE.Matrix4();
            this.useVertexTexture = useVertexTexture !== undefined ? useVertexTexture : true;
            this.identityMatrix = new THREE.Matrix4();
            bones = bones || [];
            this.bones = bones.slice(0);
            if (this.useVertexTexture) {
                var size = THREE.Math.sqrt(this.bones.length * 4);
                size = THREE.Math.nextPowerOfTwo(THREE.Math.ceil(size));
                size = THREE.Math.max(size, 4);
                this.boneTextureWidth = size;
                this.boneTextureHeight = size;
                this.boneMatrices = new Float32Array(this.boneTextureWidth * this.boneTextureHeight * 4);
                this.boneTexture = new THREE.DataTexture(this.boneMatrices, this.boneTextureWidth, this.boneTextureHeight, THREE.RGBAFormat, THREE.FloatType);
            }
            else {
                this.boneMatrices = new Float32Array(16 * this.bones.length);
            }
            if (boneInverses === undefined) {
                this.calculateInverses();
            }
            else {
                if (this.bones.length === boneInverses.length) {
                    this.boneInverses = boneInverses.slice(0);
                }
                else {
                    console.warn('THREE.Skeleton bonInverses is the wrong length.');
                    this.boneInverses = [];
                    for (var b = 0, bl = this.bones.length; b < bl; b++) {
                        this.boneInverses.push(new THREE.Matrix4());
                    }
                }
            }
        }
        ;
        Skeleton.prototype.calculateInverses = function () {
            this.boneInverses = [];
            for (var b = 0, bl = this.bones.length; b < bl; b++) {
                var inverse = new THREE.Matrix4();
                if (this.bones[b]) {
                    inverse.getInverse(this.bones[b].matrixWorld);
                }
                this.boneInverses.push(inverse);
            }
        };
        Skeleton.prototype.pose = function () {
            var bone;
            for (var b = 0, bl = this.bones.length; b < bl; b++) {
                bone = this.bones[b];
                if (bone) {
                    bone.matrixWorld.getInverse(this.boneInverses[b]);
                }
            }
            for (var b = 0, bl = this.bones.length; b < bl; b++) {
                bone = this.bones[b];
                if (bone) {
                    if (bone.parent instanceof THREE.Bone) {
                        bone.matrix.getInverse(bone.parent.matrixWorld);
                        bone.matrix.multiply(bone.matrixWorld);
                    }
                    else {
                        bone.matrix.copy(bone.matrixWorld);
                    }
                    bone.matrix.decompose(bone.position, bone.quaternion, bone.scale);
                }
            }
        };
        Skeleton.prototype.update = function () {
            var offsetMatrix = Skeleton.update_offsetMatrix;
            for (var b = 0, bl = this.bones.length; b < bl; b++) {
                var matrix = this.bones[b] ? this.bones[b].matrixWorld : this.identityMatrix;
                offsetMatrix.multiplyMatrices(matrix, this.boneInverses[b]);
                offsetMatrix.toArray(this.boneMatrices, b * 16);
            }
            if (this.useVertexTexture) {
                this.boneTexture.needsUpdate = true;
            }
        };
        Skeleton.prototype.clone = function () {
            return new Skeleton(this.bones, this.boneInverses, this.useVertexTexture);
        };
        Skeleton.update_offsetMatrix = new THREE.Matrix4();
        return Skeleton;
    }());
    THREE.Skeleton = Skeleton;
})(THREE || (THREE = {}));
