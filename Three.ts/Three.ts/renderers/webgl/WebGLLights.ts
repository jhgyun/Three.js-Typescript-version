/* 
* @author mrdoob / http://mrdoob.com/
*/

namespace THREE
{
    export interface ILightUniforms
    {
        position?: Vector3;
        direction?: Vector3;
        color?: Color;
        shadow?: boolean;
        shadowBias?: number;
        shadowRadius?: number;
        shadowMapSize?: Vector2;
        distance?: number;
        coneCos?: number;
        penumbraCos?: number;
        decay?: number;
        skyColor?: Color;
        groundColor?: Color;
    }
    export class WebGLLights
    {
        lights: { [index: number]: ILightUniforms } = {};
        constructor()
        {
        };
        get(light: Light): ILightUniforms
        {
            var lights = this.lights; 
            if (lights[light.id] !== undefined)
            {
                return lights[light.id];
            }

            var uniforms: ILightUniforms;

            switch (light.type)
            { 
                case 'DirectionalLight':
                    uniforms  = {
                        direction: new Vector3(),
                        color: new Color(),

                        shadow: false,
                        shadowBias: 0,
                        shadowRadius: 1,
                        shadowMapSize: new Vector2()
                    };
                    break;

                case 'SpotLight':
                    uniforms = {
                        position: new Vector3(),
                        direction: new Vector3(),
                        color: new Color(),
                        distance: 0,
                        coneCos: 0,
                        penumbraCos: 0,
                        decay: 0,

                        shadow: false,
                        shadowBias: 0,
                        shadowRadius: 1,
                        shadowMapSize: new Vector2()
                    };
                    break;

                case 'PointLight':
                    uniforms = {
                        position: new Vector3(),
                        color: new Color(),
                        distance: 0,
                        decay: 0, 
                        shadow: false,
                        shadowBias: 0,
                        shadowRadius: 1,
                        shadowMapSize: new Vector2()
                    };
                    break;

                case 'HemisphereLight':
                    uniforms = {
                        direction: new Vector3(),
                        skyColor: new Color(),
                        groundColor: new Color()
                    };
                    break; 
            }

            lights[light.id] = uniforms; 
            return uniforms; 
        };
    }
}
