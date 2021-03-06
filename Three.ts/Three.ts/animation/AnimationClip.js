var THREE;
(function (THREE) {
    var AnimationClip = (function () {
        function AnimationClip(name, duration, tracks) {
            this.name = name;
            this.tracks = tracks;
            this.duration = (duration !== undefined) ? duration : -1;
            this.uuid = THREE.Math.generateUUID();
            if (this.duration < 0) {
                this.resetDuration();
            }
            this.trim();
            this.optimize();
        }
        ;
        AnimationClip.prototype.resetDuration = function () {
            var tracks = this.tracks, duration = 0;
            for (var i = 0, n = tracks.length; i !== n; ++i) {
                var track = this.tracks[i];
                duration = THREE.Math.max(duration, track.times[track.times.length - 1]);
            }
            this.duration = duration;
        };
        AnimationClip.prototype.trim = function () {
            for (var i = 0; i < this.tracks.length; i++) {
                this.tracks[i].trim(0, this.duration);
            }
            return this;
        };
        AnimationClip.prototype.optimize = function () {
            for (var i = 0; i < this.tracks.length; i++) {
                this.tracks[i].optimize();
            }
            return this;
        };
        AnimationClip.parse = function (json) {
            var tracks = [], jsonTracks = json.tracks, frameTime = 1.0 / (json.fps || 1.0);
            for (var i = 0, n = jsonTracks.length; i !== n; ++i) {
                tracks.push(THREE.KeyframeTrack.parse(jsonTracks[i]).scale(frameTime));
            }
            return new AnimationClip(json.name, json.duration, tracks);
        };
        AnimationClip.toJSON = function (clip) {
            var tracks = [], clipTracks = clip.tracks;
            var json = {
                'name': clip.name,
                'duration': clip.duration,
                'tracks': tracks
            };
            for (var i = 0, n = clipTracks.length; i !== n; ++i) {
                tracks.push(THREE.KeyframeTrack.toJSON(clipTracks[i]));
            }
            return json;
        };
        AnimationClip.CreateFromMorphTargetSequence = function (name, morphTargetSequence, fps, noLoop) {
            var numMorphTargets = morphTargetSequence.length;
            var tracks = [];
            for (var i = 0; i < numMorphTargets; i++) {
                var times = [];
                var values = [];
                times.push((i + numMorphTargets - 1) % numMorphTargets, i, (i + 1) % numMorphTargets);
                values.push(0, 1, 0);
                var order = THREE.AnimationUtils.getKeyframeOrder(times);
                times = THREE.AnimationUtils.sortedArray(times, 1, order);
                values = THREE.AnimationUtils.sortedArray(values, 1, order);
                if (!noLoop && times[0] === 0) {
                    times.push(numMorphTargets);
                    values.push(values[0]);
                }
                tracks.push(new THREE.NumberKeyframeTrack('.morphTargetInfluences[' + morphTargetSequence[i].name + ']', times, values).scale(1.0 / fps));
            }
            return new AnimationClip(name, -1, tracks);
        };
        AnimationClip.findByName = function (objectOrClipArray, name) {
            var clipArray = objectOrClipArray;
            if (!Array.isArray(objectOrClipArray)) {
                var o = objectOrClipArray;
                clipArray = o.geometry && o.geometry.animations || o.animations;
            }
            for (var i = 0; i < clipArray.length; i++) {
                if (clipArray[i].name === name) {
                    return clipArray[i];
                }
            }
            return null;
        };
        AnimationClip.CreateClipsFromMorphTargetSequences = function (morphTargets, fps, noLoop) {
            var animationToMorphTargets = {};
            var pattern = /^([\w-]*?)([\d]+)$/;
            for (var i = 0, il = morphTargets.length; i < il; i++) {
                var morphTarget = morphTargets[i];
                var parts = morphTarget.name.match(pattern);
                if (parts && parts.length > 1) {
                    var name_1 = parts[1];
                    var animationMorphTargets = animationToMorphTargets[name_1];
                    if (!animationMorphTargets) {
                        animationToMorphTargets[name_1] = animationMorphTargets = [];
                    }
                    animationMorphTargets.push(morphTarget);
                }
            }
            var clips = [];
            for (var name_2 in animationToMorphTargets) {
                clips.push(AnimationClip.CreateFromMorphTargetSequence(name_2, animationToMorphTargets[name_2], fps, noLoop));
            }
            return clips;
        };
        AnimationClip.parseAnimation = function (animation, bones, nodeName) {
            if (!animation) {
                console.error("  no animation in JSONLoader data");
                return null;
            }
            var addNonemptyTrack = function (trackType, trackName, animationKeys, propertyName, destTracks) {
                if (animationKeys.length !== 0) {
                    var times = [];
                    var values = [];
                    THREE.AnimationUtils.flattenJSON(animationKeys, times, values, propertyName);
                    if (times.length !== 0) {
                        destTracks.push(new trackType(trackName, times, values));
                    }
                }
            };
            var tracks = [];
            var clipName = animation.name || 'default';
            var duration = animation.length || -1;
            var fps = animation.fps || 30;
            var hierarchyTracks = animation.hierarchy || [];
            for (var h = 0; h < hierarchyTracks.length; h++) {
                var animationKeys = hierarchyTracks[h].keys;
                if (!animationKeys || animationKeys.length === 0)
                    continue;
                if (animationKeys[0].morphTargets) {
                    var morphTargetNames = {};
                    for (var k = 0; k < animationKeys.length; k++) {
                        if (animationKeys[k].morphTargets) {
                            for (var m = 0; m < animationKeys[k].morphTargets.length; m++) {
                                morphTargetNames[animationKeys[k].morphTargets[m]] = -1;
                            }
                        }
                    }
                    for (var morphTargetName in morphTargetNames) {
                        var times = [];
                        var values = [];
                        for (var m = 0; m !== animationKeys[k].morphTargets.length; ++m) {
                            var animationKey = animationKeys[k];
                            times.push(animationKey.time);
                            values.push((animationKey.morphTarget === morphTargetName) ? 1 : 0);
                        }
                        tracks.push(new THREE.NumberKeyframeTrack('.morphTargetInfluence[' + morphTargetName + ']', times, values));
                    }
                    duration = morphTargetNames.length * (fps || 1.0);
                }
                else {
                    var boneName = '.bones[' + bones[h].name + ']';
                    addNonemptyTrack(THREE.VectorKeyframeTrack, boneName + '.position', animationKeys, 'pos', tracks);
                    addNonemptyTrack(THREE.QuaternionKeyframeTrack, boneName + '.quaternion', animationKeys, 'rot', tracks);
                    addNonemptyTrack(THREE.VectorKeyframeTrack, boneName + '.scale', animationKeys, 'scl', tracks);
                }
            }
            if (tracks.length === 0) {
                return null;
            }
            var clip = new AnimationClip(clipName, duration, tracks);
            return clip;
        };
        return AnimationClip;
    }());
    THREE.AnimationClip = AnimationClip;
})(THREE || (THREE = {}));
