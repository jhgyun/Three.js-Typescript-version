/// <reference path="../core/object3d.ts" />
/*
 * @author mrdoob / http://mrdoob.com/
 * @author Reece Aaron Lecrivain / http://reecenotes.com/
 */

namespace THREE
{
    export class Audio extends Object3D
    {
        context;
        source;
        gain;
        autoplay: boolean;
        startTime: number;
        playbackRate: number;
        isPlaying: boolean;
        hasPlaybackControl: boolean;
        sourceType: string;
        filters: any[];

        constructor(listener)
        {
            super();

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

        };

        public getOutput()
        {
            return this.gain;
        }
        public setNodeSource(audioNode)
        {
            this.hasPlaybackControl = false;
            this.sourceType = 'audioNode';
            this.source = audioNode;
            this.connect();
            return this;
        }
        public setBuffer(audioBuffer)
        {
            this.source.buffer = audioBuffer;
            this.sourceType = 'buffer';
            if (this.autoplay) this.play();

            return this;
        }
        public play()
        {
            if (this.isPlaying === true)
            {
                console.warn('THREE.Audio: Audio is already playing.');
                return;
            }

            if (this.hasPlaybackControl === false)
            {
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
        }
        public pause()
        {
            if (this.hasPlaybackControl === false)
            {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return;
            }

            this.source.stop();
            this.startTime = this.context.currentTime;
            this.isPlaying = false;

            return this;
        }
        public stop()
        {
            if (this.hasPlaybackControl === false)
            {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return;
            }

            this.source.stop();
            this.startTime = 0;
            this.isPlaying = false;

            return this;
        }
        public connect()
        {
            if (this.filters.length > 0)
            {
                this.source.connect(this.filters[0]);

                for (var i = 1, l = this.filters.length; i < l; i++)
                {
                    this.filters[i - 1].connect(this.filters[i]);
                }

                this.filters[this.filters.length - 1].connect(this.getOutput());

            }
            else
            {
                this.source.connect(this.getOutput());
            }

            return this;
        }
        public disconnect()
        {
            if (this.filters.length > 0)
            {
                this.source.disconnect(this.filters[0]);

                for (var i = 1, l = this.filters.length; i < l; i++)
                {
                    this.filters[i - 1].disconnect(this.filters[i]);
                }

                this.filters[this.filters.length - 1].disconnect(this.getOutput());

            }
            else
            {
                this.source.disconnect(this.getOutput());
            }

            return this;
        }
        public getFilters()
        {
            return this.filters;
        }
        public setFilters(value)
        {
            if (!value) value = [];

            if (this.isPlaying === true)
            {
                this.disconnect();
                this.filters = value;
                this.connect();

            }
            else
            {
                this.filters = value;
            }

            return this;
        }
        public getFilter()
        {
            return this.getFilters()[0];
        }
        public setFilter(filter)
        {
            return this.setFilters(filter ? [filter] : []);
        }
        public setPlaybackRate(value)
        {
            if (this.hasPlaybackControl === false)
            {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return;
            }

            this.playbackRate = value;

            if (this.isPlaying === true)
            {
                this.source.playbackRate.value = this.playbackRate;
            }

            return this;
        }
        public getPlaybackRate()
        {
            return this.playbackRate;
        }
        public onEnded()
        {
            this.isPlaying = false;
        }
        public getLoop()
        {
            if (this.hasPlaybackControl === false)
            {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return false;
            }

            return this.source.loop;
        }
        public setLoop(value)
        {
            if (this.hasPlaybackControl === false)
            {
                console.warn('THREE.Audio: this Audio has no playback control.');
                return;
            }

            this.source.loop = value;
        }
        public getVolume()
        {
            return this.gain.gain.value;
        }
        public setVolume(value)
        {
            this.gain.gain.value = value;
            return this;
        }
    }
}
