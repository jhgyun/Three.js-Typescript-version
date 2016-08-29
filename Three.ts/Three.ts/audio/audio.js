var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var Audio = (function (_super) {
        __extends(Audio, _super);
        function Audio(listener) {
            _super.call(this);
            this.type = 'Audio';
            this.context = listener.context;
            this.source = this.context.createBufferSource();
            this.source.onended = this.onEnded.bind(this);
            this.gain = this.context.createGain();
            this.gain.connect(listener.getInput());
            this.autoplay = false;
            this.startTime = 0;
            this.playbackRate = 1;
            this.isPlaying = false;
            this.hasPlaybackControl = true;
            this.sourceType = 'empty';
            this.filters = [];
        }
        ;
        Audio.prototype.getOutput = function () {
            return this.gain;
        };
        Audio.prototype.setNodeSource = function (audioNode) {
            this.hasPlaybackControl = false;
            this.sourceType = 'audioNode';
            this.source = audioNode;
            this.connect();
            return this;
        };
        Audio.prototype.setBuffer = function (audioBuffer) {
            this.source.buffer = audioBuffer;
            this.sourceType = 'buffer';
            if (this.autoplay)
                this.play();
            return this;
        };
        Audio.prototype.play = function () {
            if (this.isPlaying === true) {
                console.warn('THREE.Audio: Audio is already playing.');
                return;
            }
            if (this.hasPlaybackControl === false) {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return;
            }
            var source = this.context.createBufferSource();
            source.buffer = this.source.buffer;
            source.loop = this.source.loop;
            source.onended = this.source.onended;
            source.start(0, this.startTime);
            source.playbackRate.value = this.playbackRate;
            this.isPlaying = true;
            this.source = source;
            return this.connect();
        };
        Audio.prototype.pause = function () {
            if (this.hasPlaybackControl === false) {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return;
            }
            this.source.stop();
            this.startTime = this.context.currentTime;
            this.isPlaying = false;
            return this;
        };
        Audio.prototype.stop = function () {
            if (this.hasPlaybackControl === false) {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return;
            }
            this.source.stop();
            this.startTime = 0;
            this.isPlaying = false;
            return this;
        };
        Audio.prototype.connect = function () {
            if (this.filters.length > 0) {
                this.source.connect(this.filters[0]);
                for (var i = 1, l = this.filters.length; i < l; i++) {
                    this.filters[i - 1].connect(this.filters[i]);
                }
                this.filters[this.filters.length - 1].connect(this.getOutput());
            }
            else {
                this.source.connect(this.getOutput());
            }
            return this;
        };
        Audio.prototype.disconnect = function () {
            if (this.filters.length > 0) {
                this.source.disconnect(this.filters[0]);
                for (var i = 1, l = this.filters.length; i < l; i++) {
                    this.filters[i - 1].disconnect(this.filters[i]);
                }
                this.filters[this.filters.length - 1].disconnect(this.getOutput());
            }
            else {
                this.source.disconnect(this.getOutput());
            }
            return this;
        };
        Audio.prototype.getFilters = function () {
            return this.filters;
        };
        Audio.prototype.setFilters = function (value) {
            if (!value)
                value = [];
            if (this.isPlaying === true) {
                this.disconnect();
                this.filters = value;
                this.connect();
            }
            else {
                this.filters = value;
            }
            return this;
        };
        Audio.prototype.getFilter = function () {
            return this.getFilters()[0];
        };
        Audio.prototype.setFilter = function (filter) {
            return this.setFilters(filter ? [filter] : []);
        };
        Audio.prototype.setPlaybackRate = function (value) {
            if (this.hasPlaybackControl === false) {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return;
            }
            this.playbackRate = value;
            if (this.isPlaying === true) {
                this.source.playbackRate.value = this.playbackRate;
            }
            return this;
        };
        Audio.prototype.getPlaybackRate = function () {
            return this.playbackRate;
        };
        Audio.prototype.onEnded = function () {
            this.isPlaying = false;
        };
        Audio.prototype.getLoop = function () {
            if (this.hasPlaybackControl === false) {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return false;
            }
            return this.source.loop;
        };
        Audio.prototype.setLoop = function (value) {
            if (this.hasPlaybackControl === false) {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return;
            }
            this.source.loop = value;
        };
        Audio.prototype.getVolume = function () {
            return this.gain.gain.value;
        };
        Audio.prototype.setVolume = function (value) {
            this.gain.gain.value = value;
            return this;
        };
        return Audio;
    }(THREE.Object3D));
    THREE.Audio = Audio;
})(THREE || (THREE = {}));
