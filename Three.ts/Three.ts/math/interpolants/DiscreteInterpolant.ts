/// <reference path="../interpolant.ts" />
/* 
 *
 * Interpolant that evaluates to the sample value at the position preceeding
 * the parameter.
 *
 * @author tschw
 */

namespace THREE
{
    export class DiscreteInterpolant extends Interpolant
    {
        constructor(
            parameterPositions: ArrayLike<number>,
            sampleValues: ArrayLike<number>,
            sampleSize: number,
            resultBuffer?: ArrayLike<number>)
        {
            super(parameterPositions, sampleValues, sampleSize, resultBuffer);
        }

        interpolate_(i1: number, t0: number, t: number, t1: number)
        {
            return this.copySampleValue_(i1 - 1);
        }
    }
}