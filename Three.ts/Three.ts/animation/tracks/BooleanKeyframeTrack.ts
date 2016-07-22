/// <reference path="../keyframetrack.ts" />
/* 
 *
 * A Track of Boolean keyframe values.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

namespace THREE
{
    export class BooleanKeyframeTrack extends KeyframeTrack
    {
        constructor(name, times?, values?)
        {
            super(name, times, values);
        };

        // Note: Actually this track could have a optimized / compressed
        // representation of a single value and a custom interpolant that
        // computes "firstValue ^ isOdd( index )". 
    }

    BooleanKeyframeTrack.prototype.ValueTypeName = 'bool';
    BooleanKeyframeTrack.prototype.ValueBufferType = Array;
    BooleanKeyframeTrack.prototype.DefaultInterpolation = THREE.InterpolateDiscrete;
    BooleanKeyframeTrack.prototype.InterpolantFactoryMethodLinear = undefined;
    BooleanKeyframeTrack.prototype.InterpolantFactoryMethodSmooth = undefined;
}