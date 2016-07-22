/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class MultiMaterial implements IMaterial
    {
        uuid = Math.generateUUID();
        type = 'MultiMaterial';
        materials: Material[];
        visible = true
        constructor(materials?: Material[])
        {
            this.materials = materials instanceof Array ? materials : [];
        };
         
        toJSON(meta)
        { 
            var output: any = {
                metadata: {
                    version: 4.2,
                    type: 'material',
                    generator: 'MaterialExporter'
                },
                uuid: this.uuid,
                type: this.type,
                materials: []
            };

            var materials = this.materials;

            for (var i = 0, l = materials.length; i < l; i++)
            {

                var material = materials[i].toJSON(meta);
                delete material.metadata;

                output.materials.push(material);

            }

            output.visible = this.visible; 
            return output; 
        } 
        clone()
        {
            var material = new (this.constructor as any)();
            for (var i = 0; i < this.materials.length; i++)
            {
                material.materials.push(this.materials[i].clone());
            }

            material.visible = this.visible;
            return material;
        }
    }
}