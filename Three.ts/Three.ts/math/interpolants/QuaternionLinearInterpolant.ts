﻿/// <reference path="../interpolant.ts" />
/* 
 * Spherical linear unit quaternion interpolant.
 *
 * @author tschw
 */

namespace THREE
{
    export class QuaternionLinearInterpolant extends Interpolant
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

            var result = this.resultBuffer,
                values = this.sampleValues,
                stride = this.valueSize,

                offset = i1 * stride,

                alpha = (t - t0) / (t1 - t0);

            for (var end = offset + stride; offset !== end; offset += 4)
            {

                Quaternion.slerpFlat(result, 0,
                    values, offset - stride, values, offset, alpha);
            } 
            return result;
        }
    }
}