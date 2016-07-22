/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{

    export class Layers
    {
        mask = 1

        set(channel: number)
        {
            this.mask = 1 << channel;
        }
        enable(channel: number)
        {
            this.mask |= 1 << channel;
        }
        toggle(channel: number)
        {
            this.mask ^= 1 << channel;
        }
        disable(channel: number)
        {
            this.mask &= ~(1 << channel);
        }
        test(layers: Layers)
        {
            return (this.mask & layers.mask) !== 0;
        }
    }
}