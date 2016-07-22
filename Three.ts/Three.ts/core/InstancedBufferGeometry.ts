/// <reference path="buffergeometry.ts" />
/* 
 * @author benaadams / https://twitter.com/ben_a_adams
 */

namespace THREE
{
    export class InstancedBufferGeometry extends BufferGeometry
    {
        type = 'InstancedBufferGeometry';
      
        constructor()
        {
            super();
        }

        addGroup(start: number, count: number, instances: number)
        {
            this.groups.push({
                start: start,
                count: count,
                instances: instances
            });
        } 
        copy(source: InstancedBufferGeometry)
        { 
            var index = source.index; 
            if (index !== null)
            { 
                this.setIndex(index.clone()); 
            }

            var attributes = source.attributes;

            for (var name in attributes)
            { 
                var attribute = attributes[name];
                this.addAttribute(name, attribute.clone()); 
            }

            var groups = source.groups;

            for (var i = 0, l = groups.length; i < l; i++)
            { 
                var group = groups[i];
                this.addGroup(group.start, group.count, group.instances); 
            } 
            return this; 
        };
    }
}