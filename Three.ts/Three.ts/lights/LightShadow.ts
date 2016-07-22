/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class LightShadow
    {
        camera: Camera;
        bias: number;
        radius: number;
        mapSize: Vector2;
        map: WebGLRenderTarget;
        matrix: Matrix4;

        constructor(camera)
        { 
            this.camera = camera;

            this.bias = 0;
            this.radius = 1;

            this.mapSize = new Vector2(512, 512);

            this.map = null;
            this.matrix = new Matrix4(); 
        }         
        copy(source: LightShadow)
        { 
            this.camera = source.camera.clone(); 
            this.bias = source.bias;
            this.radius = source.radius; 
            this.mapSize.copy(source.mapSize); 
            return this; 
        }  
        clone()
        {
            return new (this.constructor as any)().copy(this);
        }
    }
}
