/* 
* @author mrdoob / http://mrdoob.com/
*/

namespace THREE
{
    export class WebGLLights
    {
        lights: { [index: number]: Light } = {};
        constructor()
        {
        };
        get(light: Light)
        {
            var lights = this.lights; 
            if (lights[light.id] !== undefined)
            {
                return lights[light.id];
            }

            var uniforms;

            switch (light.type)
            { 
                case 'DirectionalLight':
                    uniforms = {
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
