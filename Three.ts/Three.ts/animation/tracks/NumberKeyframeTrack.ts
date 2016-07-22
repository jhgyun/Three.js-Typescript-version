/// <reference path="../keyframetrack.ts" />
/* 
 *
 * A Track of numeric keyframe values.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

namespace THREE
{
    export class NumberKeyframeTrack extends KeyframeTrack
    {
        constructor(name, times?, values?, interpolation?)
        {
            super(name, times, values, interpolation); 
        }; 
    }

    NumberKeyframeTrack.prototype.ValueTypeName = 'number';
}