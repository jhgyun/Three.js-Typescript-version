var THREE;
(function (THREE) {
    var AnimationAction;
    (function (AnimationAction) {
        var _new = (function () {
            function _new(mixer, clip, localRoot) {
                this._mixer = mixer;
                this._clip = clip;
                this._localRoot = localRoot || null;
                var tracks = clip.tracks, nTracks = tracks.length, interpolants = new Array(nTracks);
                var interpolantSettings = {
                    endingStart: THREE.ZeroCurvatureEnding,
                    endingEnd: THREE.ZeroCurvatureEnding
                };
                for (var i = 0; i !== nTracks; ++i) {
                    var interpolant = tracks[i].createInterpolant(null);
                    interpolants[i] = interpolant;
                    interpolant.settings = interpolantSettings;
                }
                this._interpolantSettings = interpolantSettings;
                this._interpolants = interpolants;
                this._propertyBindings = new Array(nTracks);
                this._cacheIndex = null;
                this._byClipCacheIndex = null;
                this._timeScaleInterpolant = null;
                this._weightInterpolant = null;
                this.loop = THREE.LoopRepeat;
                this._loopCount = -1;
                this._startTime = null;
                this.time = 0;
                this.timeScale = 1;
                this._effectiveTimeScale = 1;
                this.weight = 1;
                this._effectiveWeight = 1;
                this.repetitions = Infinity;
                this.paused = false;
                this.enabled = true;
                this.clampWhenFinished = false;
                this.zeroSlopeAtStart = true;
                this.zeroSlopeAtEnd = true;
            }
            ;
            _new.prototype.play = function () {
                this._mixer._activateAction(this);
                return this;
            };
            _new.prototype.stop = function () {
                this._mixer._deactivateAction(this);
                return this.reset();
            };
            _new.prototype.reset = function () {
                this.paused = false;
                this.enabled = true;
                this.time = 0;
                this._loopCount = -1;
                this._startTime = null;
                return this.stopFading().stopWarping();
            };
            _new.prototype.isRunning = function () {
                var start = this._startTime;
                return this.enabled && !this.paused && this.timeScale !== 0 &&
                    this._startTime === null && this._mixer._isActiveAction(this);
            };
            _new.prototype.isScheduled = function () {
                return this._mixer._isActiveAction(this);
            };
            _new.prototype.startAt = function (time) {
                this._startTime = time;
                return this;
            };
            _new.prototype.setLoop = function (mode, repetitions) {
                this.loop = mode;
                this.repetitions = repetitions;
                return this;
            };
            _new.prototype.setEffectiveWeight = function (weight) {
                this.weight = weight;
                this._effectiveWeight = this.enabled ? weight : 0;
                return this.stopFading();
            };
            _new.prototype.getEffectiveWeight = function () {
                return this._effectiveWeight;
            };
            _new.prototype.fadeIn = function (duration) {
                return this._scheduleFading(duration, 0, 1);
            };
            _new.prototype.fadeOut = function (duration) {
                return this._scheduleFading(duration, 1, 0);
            };
            _new.prototype.crossFadeFrom = function (fadeOutAction, duration, warp) {
                var mixer = this._mixer;
                fadeOutAction.fadeOut(duration);
                this.fadeIn(duration);
                if (warp) {
                    var fadeInDuration = this._clip.duration, fadeOutDuration = fadeOutAction._clip.duration, startEndRatio = fadeOutDuration / fadeInDuration, endStartRatio = fadeInDuration / fadeOutDuration;
                    fadeOutAction.warp(1.0, startEndRatio, duration);
                    this.warp(endStartRatio, 1.0, duration);
                }
                return this;
            };
            _new.prototype.crossFadeTo = function (fadeInAction, duration, warp) {
                return fadeInAction.crossFadeFrom(this, duration, warp);
            };
            _new.prototype.stopFading = function () {
                var weightInterpolant = this._weightInterpolant;
                if (weightInterpolant !== null) {
                    this._weightInterpolant = null;
                    this._mixer._takeBackControlInterpolant(weightInterpolant);
                }
                return this;
            };
            _new.prototype.setEffectiveTimeScale = function (timeScale) {
                this.timeScale = timeScale;
                this._effectiveTimeScale = this.paused ? 0 : timeScale;
                return this.stopWarping();
            };
            _new.prototype.getEffectiveTimeScale = function () {
                return this._effectiveTimeScale;
            };
            _new.prototype.setDuration = function (duration) {
                this.timeScale = this._clip.duration / duration;
                return this.stopWarping();
            };
            _new.prototype.syncWith = function (action) {
                this.time = action.time;
                this.timeScale = action.timeScale;
                return this.stopWarping();
            };
            _new.prototype.halt = function (duration) {
                return this.warp(this._effectiveTimeScale, 0, duration);
            };
            _new.prototype.warp = function (startTimeScale, endTimeScale, duration) {
                var mixer = this._mixer, now = mixer.time, interpolant = this._timeScaleInterpolant, timeScale = this.timeScale;
                if (interpolant === null) {
                    interpolant = mixer._lendControlInterpolant(),
                        this._timeScaleInterpolant = interpolant;
                }
                var times = interpolant.parameterPositions, values = interpolant.sampleValues;
                times[0] = now;
                times[1] = now + duration;
                values[0] = startTimeScale / timeScale;
                values[1] = endTimeScale / timeScale;
                return this;
            };
            _new.prototype.stopWarping = function () {
                var timeScaleInterpolant = this._timeScaleInterpolant;
                if (timeScaleInterpolant !== null) {
                    this._timeScaleInterpolant = null;
                    this._mixer._takeBackControlInterpolant(timeScaleInterpolant);
                }
                return this;
            };
            _new.prototype.getMixer = function () {
                return this._mixer;
            };
            _new.prototype.getClip = function () {
                return this._clip;
            };
            _new.prototype.getRoot = function () {
                return this._localRoot || this._mixer._root;
            };
            _new.prototype._update = function (time, deltaTime, timeDirection, accuIndex) {
                var startTime = this._startTime;
                if (startTime !== null) {
                    var timeRunning = (time - startTime) * timeDirection;
                    if (timeRunning < 0 || timeDirection === 0) {
                        return;
                    }
                    this._startTime = null;
                    deltaTime = timeDirection * timeRunning;
                }
                deltaTime *= this._updateTimeScale(time);
                var clipTime = this._updateTime(deltaTime);
                var weight = this._updateWeight(time);
                if (weight > 0) {
                    var interpolants = this._interpolants;
                    var propertyMixers = this._propertyBindings;
                    for (var j = 0, m = interpolants.length; j !== m; ++j) {
                        interpolants[j].evaluate(clipTime);
                        propertyMixers[j].accumulate(accuIndex, weight);
                    }
                }
            };
            _new.prototype._updateWeight = function (time) {
                var weight = 0;
                if (this.enabled) {
                    weight = this.weight;
                    var interpolant = this._weightInterpolant;
                    if (interpolant !== null) {
                        var interpolantValue = interpolant.evaluate(time)[0];
                        weight *= interpolantValue;
                        if (time > interpolant.parameterPositions[1]) {
                            this.stopFading();
                            if (interpolantValue === 0) {
                                this.enabled = false;
                            }
                        }
                    }
                }
                this._effectiveWeight = weight;
                return weight;
            };
            _new.prototype._updateTimeScale = function (time) {
                var timeScale = 0;
                if (!this.paused) {
                    timeScale = this.timeScale;
                    var interpolant = this._timeScaleInterpolant;
                    if (interpolant !== null) {
                        var interpolantValue = interpolant.evaluate(time)[0];
                        timeScale *= interpolantValue;
                        if (time > interpolant.parameterPositions[1]) {
                            this.stopWarping();
                            if (timeScale === 0) {
                                this.paused = true;
                            }
                            else {
                                this.timeScale = timeScale;
                            }
                        }
                    }
                }
                this._effectiveTimeScale = timeScale;
                return timeScale;
            };
            _new.prototype._updateTime = function (deltaTime) {
                var time = this.time + deltaTime;
                if (deltaTime === 0)
                    return time;
                var duration = this._clip.duration, loop = this.loop, loopCount = this._loopCount;
                if (loop === THREE.LoopOnce) {
                    if (loopCount === -1) {
                        this.loopCount = 0;
                        this._setEndings(true, true, false);
                    }
                    handle_stop: {
                        if (time >= duration) {
                            time = duration;
                        }
                        else if (time < 0) {
                            time = 0;
                        }
                        else
                            break handle_stop;
                        if (this.clampWhenFinished)
                            this.paused = true;
                        else
                            this.enabled = false;
                        this._mixer.dispatchEvent({
                            type: 'finished', action: this,
                            direction: deltaTime < 0 ? -1 : 1
                        });
                    }
                }
                else {
                    var pingPong = (loop === THREE.LoopPingPong);
                    if (loopCount === -1) {
                        if (deltaTime >= 0) {
                            loopCount = 0;
                            this._setEndings(true, this.repetitions === 0, pingPong);
                        }
                        else {
                            this._setEndings(this.repetitions === 0, true, pingPong);
                        }
                    }
                    if (time >= duration || time < 0) {
                        var loopDelta = THREE.Math.floor(time / duration);
                        time -= duration * loopDelta;
                        loopCount += THREE.Math.abs(loopDelta);
                        var pending = this.repetitions - loopCount;
                        if (pending < 0) {
                            if (this.clampWhenFinished)
                                this.paused = true;
                            else
                                this.enabled = false;
                            time = deltaTime > 0 ? duration : 0;
                            this._mixer.dispatchEvent({
                                type: 'finished', action: this,
                                direction: deltaTime > 0 ? 1 : -1
                            });
                        }
                        else {
                            if (pending === 0) {
                                var atStart = deltaTime < 0;
                                this._setEndings(atStart, !atStart, pingPong);
                            }
                            else {
                                this._setEndings(false, false, pingPong);
                            }
                            this._loopCount = loopCount;
                            this._mixer.dispatchEvent({
                                type: 'loop', action: this, loopDelta: loopDelta
                            });
                        }
                    }
                    if (pingPong && (loopCount & 1) === 1) {
                        this.time = time;
                        return duration - time;
                    }
                }
                this.time = time;
                return time;
            };
            _new.prototype._setEndings = function (atStart, atEnd, pingPong) {
                var settings = this._interpolantSettings;
                if (pingPong) {
                    settings.endingStart = THREE.ZeroSlopeEnding;
                    settings.endingEnd = THREE.ZeroSlopeEnding;
                }
                else {
                    if (atStart) {
                        settings.endingStart = this.zeroSlopeAtStart ?
                            THREE.ZeroSlopeEnding : THREE.ZeroCurvatureEnding;
                    }
                    else {
                        settings.endingStart = THREE.WrapAroundEnding;
                    }
                    if (atEnd) {
                        settings.endingEnd = this.zeroSlopeAtEnd ?
                            THREE.ZeroSlopeEnding : THREE.ZeroCurvatureEnding;
                    }
                    else {
                        settings.endingEnd = THREE.WrapAroundEnding;
                    }
                }
            };
            _new.prototype._scheduleFading = function (duration, weightNow, weightThen) {
                var mixer = this._mixer, now = mixer.time, interpolant = this._weightInterpolant;
                if (interpolant === null) {
                    interpolant = mixer._lendControlInterpolant(),
                        this._weightInterpolant = interpolant;
                }
                var times = interpolant.parameterPositions, values = interpolant.sampleValues;
                times[0] = now;
                values[0] = weightNow;
                times[1] = now + duration;
                values[1] = weightThen;
                return this;
            };
            return _new;
        }());
        AnimationAction._new = _new;
    })(AnimationAction = THREE.AnimationAction || (THREE.AnimationAction = {}));
})(THREE || (THREE = {}));
