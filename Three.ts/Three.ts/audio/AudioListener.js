/// <reference path="../core/object3d.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var AudioListener = (function (_super) {
        __extends(AudioListener, _super);
        function AudioListener() {
            _super.call(this);
            this.type = 'AudioListener';
            this.context = THREE.AudioContext;
            this.gain = this.context.createGain();
            this.gain.connect(this.context.destination);
            this.filter = null;
        }
        ;
        AudioListener.prototype.getInput = function () {
            return this.gain;
        };
        AudioListener.prototype.removeFilter = function () {
            if (this.filter !== null) {
                this.gain.disconnect(this.filter);
                this.filter.disconnect(this.context.destination);
                this.gain.connect(this.context.destination);
                this.filter = null;
            }
        };
        AudioListener.prototype.getFilter = function () {
            return this.filter;
        };
        AudioListener.prototype.setFilter = function (value) {
            if (this.filter !== null) {
                this.gain.disconnect(this.filter);
                this.filter.disconnect(this.context.destination);
            }
            else {
                this.gain.disconnect(this.context.destination);
            }
            this.filter = value;
            this.gain.connect(this.filter);
            this.filter.connect(this.context.destination);
        };
        AudioListener.prototype.getMasterVolume = function () {
            return this.gain.gain.value;
        };
        AudioListener.prototype.setMasterVolume = function (value) {
            this.gain.gain.value = value;
        };
        AudioListener.prototype.updateMatrixWorld = function (force) {
            var position = AudioListener[".umw.position"];
            var quaternion = AudioListener[".umw.quaternion"];
            var scale = AudioListener[".umw.scale"];
            var orientation = AudioListener[".umw.orientation"];
            if (position === undefined) {
                position = AudioListener[".umw.position"] = new THREE.Vector3();
                quaternion = AudioListener[".umw.quaternion"] = new THREE.Quaternion();
                scale = AudioListener[".umw.scale"] = new THREE.Vector3();
                orientation = AudioListener[".umw.orientation"] = new THREE.Vector3();
            }
            _super.prototype.updateMatrixWorld.call(this, force);
            var listener = this.context.listener;
            var up = this.up;
            this.matrixWorld.decompose(position, quaternion, scale);
            orientation.set(0, 0, -1).applyQuaternion(quaternion);
            listener.setPosition(position.x, position.y, position.z);
            listener.setOrientation(orientation.x, orientation.y, orientation.z, up.x, up.y, up.z);
        };
        return AudioListener;
    }(THREE.Object3D));
    THREE.AudioListener = AudioListener;
})(THREE || (THREE = {}));
