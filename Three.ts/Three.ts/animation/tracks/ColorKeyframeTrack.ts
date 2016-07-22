/// <reference path="../keyframetrack.ts" />
/* 
 *
 * A Track of keyframe values that represent color.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

namespace THREE
{
    export class ColorKeyframeTrack extends KeyframeTrack
    { 
        constructor(name, times?, values?, interpolation?)
        { 
            super(name, times, values, interpolation);  
        }; 
    }

    ColorKeyframeTrack.prototype.ValueTypeName = 'color';
}