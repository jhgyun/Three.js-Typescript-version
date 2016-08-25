/// <reference path="audio.ts" />
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
    var PositionalAudio = (function (_super) {
        __extends(PositionalAudio, _super);
        function PositionalAudio(listener) {
            _super.call(this, listener);
            this.panner = this.context.createPanner();
            this.panner.connect(this.gain);
        }
        ;
        PositionalAudio.prototype.getOutput = function () {
            return this.panner;
        };
        PositionalAudio.prototype.getRefDistance = function () {
            return this.panner.refDistance;
        };
        PositionalAudio.prototype.setRefDistance = function (value) {
            this.panner.refDistance = value;
        };
        PositionalAudio.prototype.getRolloffFactor = function () {
            return this.panner.rolloffFactor;
        };
        PositionalAudio.prototype.setRolloffFactor = function (value) {
            this.panner.rolloffFactor = value;
        };
        PositionalAudio.prototype.getDistanceModel = function () {
            return this.panner.distanceModel;
        };
        PositionalAudio.prototype.setDistanceModel = function (value) {
            this.panner.distanceModel = value;
        };
        PositionalAudio.prototype.getMaxDistance = function () {
            return this.panner.maxDistance;
        };
        PositionalAudio.prototype.setMaxDistance = function (value) {
            this.panner.maxDistance = value;
        };
        PositionalAudio.prototype.updateMatrixWorld = function (force) {
            var position = PositionalAudio[".umw.pos"] || (PositionalAudio[".umw.pos"] = new THREE.Vector3());
            _super.prototype.updateMatrixWorld.call(this, force);
            position.setFromMatrixPosition(this.matrixWorld);
            this.panner.setPosition(position.x, position.y, position.z);
        };
        return PositionalAudio;
    }(THREE.Audio));
    THREE.PositionalAudio = PositionalAudio;
})(THREE || (THREE = {}));
