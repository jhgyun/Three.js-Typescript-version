/// <reference path="../keyframetrack.ts" />
/* 
 *
 * A Track of quaternion keyframe values.
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */

namespace THREE
{
    export class QuaternionKeyframeTrack extends KeyframeTrack
    {
        constructor(name?, times?, values?, interpolation?)
        {
            super(name, times, values, interpolation); 
        };

        InterpolantFactoryMethodLinear(result)
        {
            return new THREE.QuaternionLinearInterpolant(
                this.times, this.values, this.getValueSize(), result);
        } 
    }

    QuaternionKeyframeTrack.prototype.ValueTypeName = 'quaternion';
    QuaternionKeyframeTrack.prototype.DefaultInterpolation = THREE.InterpolateLinear; 
    QuaternionKeyframeTrack.prototype.InterpolantFactoryMethodSmooth = undefined;
}