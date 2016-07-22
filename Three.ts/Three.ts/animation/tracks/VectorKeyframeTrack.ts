/// <reference path="../keyframetrack.ts" />
/* 
 *
 * A Track of vectored keyframe values.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

namespace THREE
{
    export class VectorKeyframeTrack extends KeyframeTrack
    {
        constructor (name, times?, values?, interpolation?)
        {
            super(name, times, values, interpolation);  
        }  
    }

    VectorKeyframeTrack.prototype.ValueTypeName = 'vector';
}