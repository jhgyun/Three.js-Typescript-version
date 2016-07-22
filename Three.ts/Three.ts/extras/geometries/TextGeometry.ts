/// <reference path="extrudegeometry.ts" />
/* 
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author alteredq / http://alteredqualia.com/
 *
 * Text = 3D Text
 *
 * parameters = {
 *  font: <THREE.Font>, // font
 *
 *  size: <float>, // size of the text
 *  height: <float>, // thickness to extrude text
 *  curveSegments: <int>, // number of points on the curves
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into text bevel goes
 *  bevelSize: <float> // how far from text outline is bevel
 * }
 */

namespace THREE
{
    export interface TextGeometryParams extends ExtrudeGeometryOptions
    {
        font?: Font   // font
        size?: number, // size of the text
        height?: number, // thickness to extrude text
        curveSegments?: number, // number of points on the curves

        bevelEnabled?: boolean, // turn on bevel
        bevelThickness?: number, // how deep into text bevel goes
        bevelSize?: number // how far from text outline is bevel
    }

    export class TextGeometry extends ExtrudeGeometry
    {
        constructor(text: string, parameters?: TextGeometryParams)
        { 
            parameters = parameters || {};

            var font = parameters.font;

            if (font instanceof Font === false)
            { 
                console.error('THREE.TextGeometry: font parameter is not an instance of THREE.Font.');
                throw new Error('THREE.TextGeometry: font parameter is not an instance of THREE.Font.');
               // return new Geometry(); 
            }

            var shapes = font.generateShapes(text, parameters.size, parameters.curveSegments);

            // translate parameters to ExtrudeGeometry API

            parameters.amount = parameters.height !== undefined ? parameters.height : 50;

            // defaults

            if (parameters.bevelThickness === undefined) parameters.bevelThickness = 10;
            if (parameters.bevelSize === undefined) parameters.bevelSize = 8;
            if (parameters.bevelEnabled === undefined) parameters.bevelEnabled = false;

            super(shapes, parameters);

            this.type = 'TextGeometry'; 
        }; 
    }
}