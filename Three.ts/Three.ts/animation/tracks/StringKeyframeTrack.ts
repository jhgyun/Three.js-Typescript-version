/// <reference path="../keyframetrack.ts" />
/* 
 *
 * A Track that interpolates Strings
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

namespace THREE
{
    export class StringKeyframeTrack extends KeyframeTrack
    {
        constructor(name, times?, values?, interpolation?)
        {
            super(name, times, values, interpolation); 
        };
    }

    StringKeyframeTrack.prototype.ValueTypeName = 'string';
    StringKeyframeTrack.prototype.ValueBufferType = Array;
    StringKeyframeTrack.prototype.DefaultInterpolation = THREE.InterpolateDiscrete;
    StringKeyframeTrack.prototype.InterpolantFactoryMethodLinear = undefined;
    StringKeyframeTrack.prototype.InterpolantFactoryMethodSmooth = undefined;
}