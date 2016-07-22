/// <reference path="../interpolant.ts" />
/* 
 * @author tschw
 */

namespace THREE
{
    export class LinearInterpolant extends Interpolant
    {
        constructor(
            parameterPositions: ArrayLike<number>,
            sampleValues: ArrayLike<number>,
            sampleSize: number,
            resultBuffer?: ArrayLike<number>)
        {
            super(parameterPositions, sampleValues, sampleSize, resultBuffer);
        }

        interpolate_(i1: number, t0: number, t: number, t1: number): ArrayLike<number>
        { 
            var result = this.resultBuffer,
                values = this.sampleValues,
                stride = this.valueSize,

                offset1 = i1 * stride,
                offset0 = offset1 - stride,

                weight1 = (t - t0) / (t1 - t0),
                weight0 = 1 - weight1;

            for (var i = 0; i !== stride; ++i)
            { 
                result[i] =
                    values[offset0 + i] * weight0 +
                    values[offset1 + i] * weight1; 
            } 
            return result; 
        }
    } 
}