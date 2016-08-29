var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var THREE;
(function (THREE) {
    var MorphBlendMesh = (function (_super) {
        __extends(MorphBlendMesh, _super);
        function MorphBlendMesh(geometry, material) {
            _super.call(this, geometry, material);
            this.setAnimationWeight = function (name, weight) {
                var animation = this.animationsMap[name];
                if (animation) {
                    animation.weight = weight;
                }
            };
            this.setAnimationTime = function (name, time) {
                var animation = this.animationsMap[name];
                if (animation) {
                    animation.time = time;
                }
            };
            this.getAnimationTime = function (name) {
                var time = 0;
                var animation = this.animationsMap[name];
                if (animation) {
                    time = animation.time;
                }
                return time;
            };
            this.animationsMap = {};
            this.animationsList = [];
            var numFrames = this.geometry.morphTargets.length;
            var name = "__default";
            var startFrame = 0;
            var endFrame = numFrames - 1;
            var fps = numFrames / 1;
            this.createAnimation(name, startFrame, endFrame, fps);
            this.setAnimationWeight(name, 1);
        }
        ;
        MorphBlendMesh.prototype.createAnimation = function (name, start, end, fps) {
            var animation = {
                start: start,
                end: end,
                length: end - start + 1,
                fps: fps,
                duration: (end - start) / fps,
                lastFrame: 0,
                currentFrame: 0,
                active: false,
                time: 0,
                direction: 1,
                weight: 1,
                directionBackwards: false,
                mirroredLoop: false
            };
            this.animationsMap[name] = animation;
            this.animationsList.push(animation);
        };
        ;
        MorphBlendMesh.prototype.autoCreateAnimations = function (fps) {
            var pattern = /([a-z]+)_?(\d+)/i;
            var firstAnimation, frameRanges = {};
            var geometry = this.geometry;
            for (var i = 0, il = geometry.morphTargets.length; i < il; i++) {
                var morph = geometry.morphTargets[i];
                var chunks = morph.name.match(pattern);
                if (chunks && chunks.length > 1) {
                    var name = chunks[1];
                    if (!frameRanges[name])
                        frameRanges[name] = { start: Infinity, end: -Infinity };
                    var range = frameRanges[name];
                    if (i < range.start)
                        range.start = i;
                    if (i > range.end)
                        range.end = i;
                    if (!firstAnimation)
                        firstAnimation = name;
                }
            }
            for (var name_1 in frameRanges) {
                var range = frameRanges[name_1];
                this.createAnimation(name_1, range.start, range.end, fps);
            }
            this.firstAnimation = firstAnimation;
        };
        MorphBlendMesh.prototype.setAnimationDirectionForward = function (name) {
            var animation = this.animationsMap[name];
            if (animation) {
                animation.direction = 1;
                animation.directionBackwards = false;
            }
        };
        MorphBlendMesh.prototype.setAnimationDirectionBackward = function (name) {
            var animation = this.animationsMap[name];
            if (animation) {
                animation.direction = -1;
                animation.directionBackwards = true;
            }
        };
        ;
        MorphBlendMesh.prototype.setAnimationFPS = function (name, fps) {
            var animation = this.animationsMap[name];
            if (animation) {
                animation.fps = fps;
                animation.duration = (animation.end - animation.start) / animation.fps;
            }
        };
        ;
        MorphBlendMesh.prototype.setAnimationDuration = function (name, duration) {
            var animation = this.animationsMap[name];
            if (animation) {
                animation.duration = duration;
                animation.fps = (animation.end - animation.start) / animation.duration;
            }
        };
        MorphBlendMesh.prototype.getAnimationDuration = function (name) {
            var duration = -1;
            var animation = this.animationsMap[name];
            if (animation) {
                duration = animation.duration;
            }
            return duration;
        };
        ;
        MorphBlendMesh.prototype.playAnimation = function (name) {
            var animation = this.animationsMap[name];
            if (animation) {
                animation.time = 0;
                animation.active = true;
            }
            else {
                console.warn("THREE.MorphBlendMesh: animation[" + name + "] undefined in .playAnimation()");
            }
        };
        ;
        MorphBlendMesh.prototype.stopAnimation = function (name) {
            var animation = this.animationsMap[name];
            if (animation) {
                animation.active = false;
            }
        };
        ;
        MorphBlendMesh.prototype.update = function (delta) {
            for (var i = 0, il = this.animationsList.length; i < il; i++) {
                var animation = this.animationsList[i];
                if (!animation.active)
                    continue;
                var frameTime = animation.duration / animation.length;
                animation.time += animation.direction * delta;
                if (animation.mirroredLoop) {
                    if (animation.time > animation.duration || animation.time < 0) {
                        animation.direction *= -1;
                        if (animation.time > animation.duration) {
                            animation.time = animation.duration;
                            animation.directionBackwards = true;
                        }
                        if (animation.time < 0) {
                            animation.time = 0;
                            animation.directionBackwards = false;
                        }
                    }
                }
                else {
                    animation.time = animation.time % animation.duration;
                    if (animation.time < 0)
                        animation.time += animation.duration;
                }
                var keyframe = animation.start + THREE.Math.clamp(THREE.Math.floor(animation.time / frameTime), 0, animation.length - 1);
                var weight = animation.weight;
                if (keyframe !== animation.currentFrame) {
                    this.morphTargetInfluences[animation.lastFrame] = 0;
                    this.morphTargetInfluences[animation.currentFrame] = 1 * weight;
                    this.morphTargetInfluences[keyframe] = 0;
                    animation.lastFrame = animation.currentFrame;
                    animation.currentFrame = keyframe;
                }
                var mix = (animation.time % frameTime) / frameTime;
                if (animation.directionBackwards)
                    mix = 1 - mix;
                if (animation.currentFrame !== animation.lastFrame) {
                    this.morphTargetInfluences[animation.currentFrame] = mix * weight;
                    this.morphTargetInfluences[animation.lastFrame] = (1 - mix) * weight;
                }
                else {
                    this.morphTargetInfluences[animation.currentFrame] = weight;
                }
            }
        };
        ;
        return MorphBlendMesh;
    }(THREE.Mesh));
    THREE.MorphBlendMesh = MorphBlendMesh;
})(THREE || (THREE = {}));
