/// <reference path="../core/object3d.ts" />
/* 
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{ 
    export class Light extends Object3D
    {
        color: Color;
        intensity: number;
        groundColor: Color;
        angle: number;
        distance: number;
        decay: number;
        penumbra: number;

        shadow: LightShadow;
        target: Object3D;

        constructor(color: number, intensity?: number)
        {
            super();

            this.type = 'Light';
            this.color = new Color(color);
            this.intensity = intensity !== undefined ? intensity : 1;
            this.receiveShadow = undefined;
        }; 
        copy(source: Light)
        {
            super.copy(source);
            this.color.copy(source.color);
            this.intensity = source.intensity;

            return this;
        } 
        toJSON(meta)
        {
            var data = super.toJSON(meta);

            data.object.color = this.color.getHex();
            data.object.intensity = this.intensity;

            if (this.groundColor !== undefined) data.object.groundColor = this.groundColor.getHex();

            if (this.distance !== undefined) data.object.distance = this.distance;
            if (this.angle !== undefined) data.object.angle = this.angle;
            if (this.decay !== undefined) data.object.decay = this.decay;
            if (this.penumbra !== undefined) data.object.penumbra = this.penumbra;

            return data; 
        } 
    }
}
