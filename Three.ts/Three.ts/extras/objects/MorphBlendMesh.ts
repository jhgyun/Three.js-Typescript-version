/// <reference path="../../objects/mesh.ts" />
/* 
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    interface IMorpAnimation
    {
        start?: number;
        end?: number;

        length?: number;

        fps?: number;
        duration?: number;

        lastFrame?: number;
        currentFrame?: number;

        active?: boolean;

        time?: number;
        direction?: number;
        weight?: number;

        directionBackwards?: boolean;
        mirroredLoop?: boolean;
    }  
    export class MorphBlendMesh extends Mesh
    {
        private animationsMap: { [index: string]: IMorpAnimation };
        private animationsList: IMorpAnimation[];
        private firstAnimation: IMorpAnimation;

        constructor(geometry: Geometry, material: IMaterial)
        {
            super(geometry, material);

            this.animationsMap = {};
            this.animationsList = [];

            // prepare default animation
            // (all frames played together in 1 second)

            var numFrames = (this.geometry as Geometry).morphTargets.length;

            var name = "__default";

            var startFrame = 0;
            var endFrame = numFrames - 1;

            var fps = numFrames / 1;

            this.createAnimation(name, startFrame, endFrame, fps);
            this.setAnimationWeight(name, 1);

        };
         
        createAnimation(name: string, start: number, end: number, fps: number)
        {
            var animation  = {

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

        autoCreateAnimations(fps: number)
        { 
            var pattern = /([a-z]+)_?(\d+)/i;

            var firstAnimation, frameRanges = {};

            var geometry = this.geometry as Geometry;

            for (var i = 0, il = geometry.morphTargets.length; i < il; i++)
            { 
                var morph = geometry.morphTargets[i];
                var chunks = morph.name.match(pattern);

                if (chunks && chunks.length > 1)
                {

                    var name = chunks[1];

                    if (!frameRanges[name]) frameRanges[name] = { start: Infinity, end: - Infinity };

                    var range = frameRanges[name];

                    if (i < range.start) range.start = i;
                    if (i > range.end) range.end = i;

                    if (!firstAnimation) firstAnimation = name; 
                } 
            }

            for (let name in frameRanges)
            {
                var range = frameRanges[name];
                this.createAnimation(name, range.start, range.end, fps);

            }
            this.firstAnimation = firstAnimation;
        }

        setAnimationDirectionForward(name: string)
        {
            var animation = this.animationsMap[name];

            if (animation)
            {
                animation.direction = 1;
                animation.directionBackwards = false;
            }
        }

        setAnimationDirectionBackward(name: string)
        { 
            var animation = this.animationsMap[name];

            if (animation)
            { 
                animation.direction = - 1;
                animation.directionBackwards = true; 
            } 
        };

        setAnimationFPS(name: string, fps: number)
        {
            var animation = this.animationsMap[name];

            if (animation)
            {
                animation.fps = fps;
                animation.duration = (animation.end - animation.start) / animation.fps;
            } 
        };

        setAnimationDuration(name: string, duration: number)
        {
            var animation = this.animationsMap[name];

            if (animation)
            {
                animation.duration = duration;
                animation.fps = (animation.end - animation.start) / animation.duration;
            }
        }

        setAnimationWeight = function (name: string, weight: number)
        {
            var animation = this.animationsMap[name];
            if (animation)
            {
                animation.weight = weight;
            }
        }

        setAnimationTime = function (name: string, time: number)
        {
            var animation = this.animationsMap[name];
            if (animation)
            {
                animation.time = time;
            }
        }

        getAnimationTime = function (name: string)
        {
            var time = 0;
            var animation = this.animationsMap[name];

            if (animation)
            {
                time = animation.time;
            }
            return time;
        }

        getAnimationDuration(name: string)
        {
            var duration = - 1;
            var animation = this.animationsMap[name];

            if (animation)
            {
                duration = animation.duration;
            }

            return duration;

        };

        playAnimation(name: string)
        {
            var animation = this.animationsMap[name];

            if (animation)
            {
                animation.time = 0;
                animation.active = true;
            }
            else
            {
                console.warn("THREE.MorphBlendMesh: animation[" + name + "] undefined in .playAnimation()");
            }

        };

        stopAnimation(name: string)
        {
            var animation = this.animationsMap[name];
            if (animation)
            {
                animation.active = false;
            }
        };

        update(delta: number)
        {
            for (var i = 0, il = this.animationsList.length; i < il; i++)
            {
                var animation = this.animationsList[i];

                if (!animation.active) continue;

                var frameTime = animation.duration / animation.length;

                animation.time += animation.direction * delta;

                if (animation.mirroredLoop)
                {

                    if (animation.time > animation.duration || animation.time < 0)
                    {

                        animation.direction *= - 1;

                        if (animation.time > animation.duration)
                        {

                            animation.time = animation.duration;
                            animation.directionBackwards = true;

                        }

                        if (animation.time < 0)
                        {

                            animation.time = 0;
                            animation.directionBackwards = false;

                        }

                    }

                } else
                {

                    animation.time = animation.time % animation.duration;

                    if (animation.time < 0) animation.time += animation.duration;

                }

                var keyframe = animation.start + Math.clamp(Math.floor(animation.time / frameTime), 0, animation.length - 1);
                var weight = animation.weight;

                if (keyframe !== animation.currentFrame)
                {

                    this.morphTargetInfluences[animation.lastFrame] = 0;
                    this.morphTargetInfluences[animation.currentFrame] = 1 * weight;

                    this.morphTargetInfluences[keyframe] = 0;

                    animation.lastFrame = animation.currentFrame;
                    animation.currentFrame = keyframe;

                }

                var mix = (animation.time % frameTime) / frameTime;

                if (animation.directionBackwards) mix = 1 - mix;

                if (animation.currentFrame !== animation.lastFrame)
                {

                    this.morphTargetInfluences[animation.currentFrame] = mix * weight;
                    this.morphTargetInfluences[animation.lastFrame] = (1 - mix) * weight;

                } else
                {

                    this.morphTargetInfluences[animation.currentFrame] = weight;

                }

            }

        };
    }
}