/* 
 *
 * Action provided by AnimationMixer for scheduling clip playback on specific
 * objects.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 *
 */

namespace THREE
{
    //export class AnimationAction
    //{
    //    constructor()
    //    { 
    //        throw new Error("THREE.AnimationAction: " +
    //            "Use mixer.clipAction for construction.");

    //    };
    //}

    export namespace AnimationAction
    {
        export class _new
        {
            _mixer;
            _clip;
            _localRoot;
            _interpolantSettings;
            _interpolants;
            _propertyBindings;
            _cacheIndex;
            _byClipCacheIndex;
            _timeScaleInterpolant;
            _weightInterpolant;
            loop;
            _loopCount;
            _startTime;
            time;
            timeScale;
            _effectiveTimeScale;
            weight;
            _effectiveWeight;
            repetitions: number;
            paused: boolean;
            enabled: boolean;
            clampWhenFinished: boolean;
            zeroSlopeAtStart: boolean;
            zeroSlopeAtEnd;
            loopCount;

            constructor(mixer, clip, localRoot)
            {

                this._mixer = mixer;
                this._clip = clip;
                this._localRoot = localRoot || null;

                var tracks = clip.tracks,
                    nTracks = tracks.length,
                    interpolants = new Array(nTracks);

                var interpolantSettings = {
                    endingStart: THREE.ZeroCurvatureEnding,
                    endingEnd: THREE.ZeroCurvatureEnding
                };

                for (var i = 0; i !== nTracks; ++i)
                {

                    var interpolant = tracks[i].createInterpolant(null);
                    interpolants[i] = interpolant;
                    interpolant.settings = interpolantSettings;

                }

                this._interpolantSettings = interpolantSettings;

                this._interpolants = interpolants;	// bound by the mixer

                // inside: PropertyMixer (managed by the mixer)
                this._propertyBindings = new Array(nTracks);

                this._cacheIndex = null;			// for the memory manager
                this._byClipCacheIndex = null;		// for the memory manager

                this._timeScaleInterpolant = null;
                this._weightInterpolant = null;

                this.loop = THREE.LoopRepeat;
                this._loopCount = -1;

                // global mixer time when the action is to be started
                // it's set back to 'null' upon start of the action
                this._startTime = null;

                // scaled local time of the action
                // gets clamped or wrapped to 0..clip.duration according to loop
                this.time = 0;

                this.timeScale = 1;
                this._effectiveTimeScale = 1;

                this.weight = 1;
                this._effectiveWeight = 1;

                this.repetitions = Infinity; 		// no. of repetitions when looping

                this.paused = false;				// false -> zero effective time scale
                this.enabled = true;				// true -> zero effective weight

                this.clampWhenFinished = false;	// keep feeding the last frame?

                this.zeroSlopeAtStart = true;		// for smooth interpolation w/o separate
                this.zeroSlopeAtEnd = true;		// clips for start, loop and end

            };


            // State & Scheduling

            play()
            {
                this._mixer._activateAction(this);
                return this;
            }
            stop()
            {
                this._mixer._deactivateAction(this);
                return this.reset();
            }
            reset()
            {
                this.paused = false;
                this.enabled = true;

                this.time = 0;			// restart clip
                this._loopCount = -1;	// forget previous loops
                this._startTime = null;	// forget scheduling

                return this.stopFading().stopWarping();
            }
            isRunning()
            {
                var start = this._startTime;
                return this.enabled && !this.paused && this.timeScale !== 0 &&
                    this._startTime === null && this._mixer._isActiveAction(this);
            }

            // return true when play has been called
            isScheduled()
            {
                return this._mixer._isActiveAction(this);
            }

            startAt(time)
            {
                this._startTime = time;
                return this;
            }

            setLoop(mode, repetitions)
            { 
                this.loop = mode;
                this.repetitions = repetitions; 
                return this; 
            } 

            // Weight

            // set the weight stopping any scheduled fading
            // although .enabled = false yields an effective weight of zero, this
            // method does *not* change .enabled, because it would be confusing
            setEffectiveWeight(weight)
            {
                this.weight = weight;
                // note: same logic as when updated at runtime
                this._effectiveWeight = this.enabled ? weight : 0;
                return this.stopFading();
            }

            // return the weight considering fading and .enabled
            getEffectiveWeight()
            {
                return this._effectiveWeight;
            }
            fadeIn(duration)
            {
                return this._scheduleFading(duration, 0, 1);
            }
            fadeOut(duration)
            {
                return this._scheduleFading(duration, 1, 0);
            }
            crossFadeFrom(fadeOutAction, duration, warp)
            {
                var mixer = this._mixer;
                fadeOutAction.fadeOut(duration);
                this.fadeIn(duration);

                if (warp)
                {
                    var fadeInDuration = this._clip.duration,
                        fadeOutDuration = fadeOutAction._clip.duration,

                        startEndRatio = fadeOutDuration / fadeInDuration,
                        endStartRatio = fadeInDuration / fadeOutDuration;

                    fadeOutAction.warp(1.0, startEndRatio, duration);
                    this.warp(endStartRatio, 1.0, duration);
                }
                return this;
            }

            crossFadeTo(fadeInAction, duration, warp)
            {
                return fadeInAction.crossFadeFrom(this, duration, warp);
            }

            stopFading()
            {
                var weightInterpolant = this._weightInterpolant;
                if (weightInterpolant !== null)
                {
                    this._weightInterpolant = null;
                    this._mixer._takeBackControlInterpolant(weightInterpolant);
                }
                return this;
            }

            // Time Scale Control

            // set the weight stopping any scheduled warping
            // although .paused = true yields an effective time scale of zero, this
            // method does *not* change .paused, because it would be confusing
            setEffectiveTimeScale(timeScale)
            {
                this.timeScale = timeScale;
                this._effectiveTimeScale = this.paused ? 0 : timeScale;
                return this.stopWarping();
            }

            // return the time scale considering warping and .paused
            getEffectiveTimeScale()
            {
                return this._effectiveTimeScale;
            }

            setDuration(duration)
            {
                this.timeScale = this._clip.duration / duration;
                return this.stopWarping();
            }

            syncWith(action)
            {
                this.time = action.time;
                this.timeScale = action.timeScale;
                return this.stopWarping();
            }
            halt(duration)
            {
                return this.warp(this._effectiveTimeScale, 0, duration);
            }

            warp(startTimeScale, endTimeScale, duration)
            {
                var mixer = this._mixer, now = mixer.time,
                    interpolant = this._timeScaleInterpolant,

                    timeScale = this.timeScale;

                if (interpolant === null)
                {
                    interpolant = mixer._lendControlInterpolant(),
                        this._timeScaleInterpolant = interpolant;
                }

                var times = interpolant.parameterPositions,
                    values = interpolant.sampleValues;

                times[0] = now;
                times[1] = now + duration;

                values[0] = startTimeScale / timeScale;
                values[1] = endTimeScale / timeScale;
                return this;
            }

            stopWarping()
            {
                var timeScaleInterpolant = this._timeScaleInterpolant;

                if (timeScaleInterpolant !== null)
                {
                    this._timeScaleInterpolant = null;
                    this._mixer._takeBackControlInterpolant(timeScaleInterpolant);
                }
                return this;
            }

            // Object Accessors 
            getMixer()
            {
                return this._mixer;
            }

            getClip()
            {
                return this._clip;
            }

            getRoot()
            {
                return this._localRoot || this._mixer._root;
            }

            // Interna

            _update(time, deltaTime, timeDirection, accuIndex)
            {
                // called by the mixer 
                var startTime = this._startTime;

                if (startTime !== null)
                {
                    // check for scheduled start of action

                    var timeRunning = (time - startTime) * timeDirection;
                    if (timeRunning < 0 || timeDirection === 0)
                    {
                        return; // yet to come / don't decide when delta = 0 
                    }
                    // start 
                    this._startTime = null; // unschedule
                    deltaTime = timeDirection * timeRunning;
                }

                // apply time scale and advance time

                deltaTime *= this._updateTimeScale(time);
                var clipTime = this._updateTime(deltaTime);

                // note: _updateTime may disable the action resulting in
                // an effective weight of 0

                var weight = this._updateWeight(time);

                if (weight > 0)
                {
                    var interpolants = this._interpolants;
                    var propertyMixers = this._propertyBindings;

                    for (var j = 0, m = interpolants.length; j !== m; ++j)
                    {
                        interpolants[j].evaluate(clipTime);
                        propertyMixers[j].accumulate(accuIndex, weight);
                    }
                }
            }

            _updateWeight(time)
            {
                var weight = 0;
                if (this.enabled)
                {
                    weight = this.weight;
                    var interpolant = this._weightInterpolant;

                    if (interpolant !== null)
                    {
                        var interpolantValue = interpolant.evaluate(time)[0];

                        weight *= interpolantValue;

                        if (time > interpolant.parameterPositions[1])
                        {
                            this.stopFading();

                            if (interpolantValue === 0)
                            {
                                // faded out, disable
                                this.enabled = false;
                            }
                        }
                    }
                }

                this._effectiveWeight = weight;
                return weight;
            }

            _updateTimeScale(time)
            {
                var timeScale = 0;
                if (!this.paused)
                {
                    timeScale = this.timeScale;
                    var interpolant = this._timeScaleInterpolant;

                    if (interpolant !== null)
                    {
                        var interpolantValue = interpolant.evaluate(time)[0];

                        timeScale *= interpolantValue;

                        if (time > interpolant.parameterPositions[1])
                        {
                            this.stopWarping();

                            if (timeScale === 0)
                            {
                                // motion has halted, pause
                                this.paused = true;
                            }
                            else
                            {
                                // warp done - apply final time scale
                                this.timeScale = timeScale;
                            }
                        }
                    }
                }

                this._effectiveTimeScale = timeScale;
                return timeScale;
            }

            _updateTime(deltaTime)
            {
                var time = this.time + deltaTime;

                if (deltaTime === 0) return time;

                var duration = this._clip.duration,

                    loop = this.loop,
                    loopCount = this._loopCount;

                if (loop === THREE.LoopOnce)
                {
                    if (loopCount === -1)
                    {
                        // just started

                        this.loopCount = 0;
                        this._setEndings(true, true, false);
                    }

                    handle_stop: {

                        if (time >= duration)
                        {
                            time = duration;
                        }
                        else if (time < 0)
                        {
                            time = 0;
                        }
                        else break handle_stop;

                        if (this.clampWhenFinished) this.paused = true;
                        else this.enabled = false;

                        this._mixer.dispatchEvent({
                            type: 'finished', action: this,
                            direction: deltaTime < 0 ? -1 : 1
                        });

                    }

                }
                else
                { // repetitive Repeat or PingPong

                    var pingPong = (loop === THREE.LoopPingPong);

                    if (loopCount === -1)
                    {
                        // just started 
                        if (deltaTime >= 0)
                        {
                            loopCount = 0;

                            this._setEndings(
                                true, this.repetitions === 0, pingPong);
                        }
                        else
                        {
                            // when looping in reverse direction, the initial
                            // transition through zero counts as a repetition,
                            // so leave loopCount at -1

                            this._setEndings(
                                this.repetitions === 0, true, pingPong);
                        }
                    }

                    if (time >= duration || time < 0)
                    {
                        // wrap around

                        var loopDelta = Math.floor(time / duration); // signed
                        time -= duration * loopDelta;

                        loopCount += Math.abs(loopDelta);

                        var pending = this.repetitions - loopCount;

                        if (pending < 0)
                        {
                            // have to stop (switch state, clamp time, fire event)

                            if (this.clampWhenFinished) this.paused = true;
                            else this.enabled = false;

                            time = deltaTime > 0 ? duration : 0;

                            this._mixer.dispatchEvent({
                                type: 'finished', action: this,
                                direction: deltaTime > 0 ? 1 : -1
                            });
                        }
                        else
                        {
                            // keep running

                            if (pending === 0)
                            {
                                // entering the last round 
                                var atStart = deltaTime < 0;
                                this._setEndings(atStart, !atStart, pingPong);
                            }
                            else
                            {
                                this._setEndings(false, false, pingPong);
                            }

                            this._loopCount = loopCount;
                            this._mixer.dispatchEvent({
                                type: 'loop', action: this, loopDelta: loopDelta
                            });
                        }
                    }

                    if (pingPong && (loopCount & 1) === 1)
                    {
                        // invert time for the "pong round"

                        this.time = time;
                        return duration - time;
                    }
                }

                this.time = time;
                return time;
            }

            _setEndings(atStart, atEnd, pingPong)
            {
                var settings = this._interpolantSettings;

                if (pingPong)
                {
                    settings.endingStart = THREE.ZeroSlopeEnding;
                    settings.endingEnd = THREE.ZeroSlopeEnding;
                }
                else
                {
                    // assuming for LoopOnce atStart == atEnd == true 
                    if (atStart)
                    {
                        settings.endingStart = this.zeroSlopeAtStart ?
                            THREE.ZeroSlopeEnding : THREE.ZeroCurvatureEnding;
                    }
                    else
                    {
                        settings.endingStart = THREE.WrapAroundEnding;
                    }

                    if (atEnd)
                    {
                        settings.endingEnd = this.zeroSlopeAtEnd ?
                            THREE.ZeroSlopeEnding : THREE.ZeroCurvatureEnding;
                    }
                    else
                    {
                        settings.endingEnd = THREE.WrapAroundEnding;
                    }
                }
            }
            _scheduleFading(duration, weightNow, weightThen)
            {
                var mixer = this._mixer, now = mixer.time,
                    interpolant = this._weightInterpolant;

                if (interpolant === null)
                {
                    interpolant = mixer._lendControlInterpolant(),
                        this._weightInterpolant = interpolant;
                }

                var times = interpolant.parameterPositions,
                    values = interpolant.sampleValues;

                times[0] = now; values[0] = weightNow;
                times[1] = now + duration; values[1] = weightThen;

                return this;
            }
        }
    }
}