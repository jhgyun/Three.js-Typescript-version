/// <reference path="ellipsecurve.ts" />
/* *************************************************************
 *	Arc curve
 **************************************************************/
namespace THREE
{
    export class ArcCurve extends EllipseCurve
    {
        constructor(aX: number, aY: number, aRadius: number, aStartAngle: number, aEndAngle: number, aClockwise?: boolean)
        { 
            super( aX, aY, aRadius, aRadius, aStartAngle, aEndAngle, aClockwise); 
        }; 
    }
}
