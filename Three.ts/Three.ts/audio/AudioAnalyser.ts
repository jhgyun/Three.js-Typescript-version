/* 
 * @author mrdoob / http://mrdoob.com/
 */

namespace THREE
{
    export class AudioAnalyser
    {
        analyser;
        data: Uint8Array;

        constructor(audio: Audio, fftSize?: number)
        {
            this.analyser = audio.context.createAnalyser();
            this.analyser.fftSize = fftSize !== undefined ? fftSize : 2048;
            this.data = new Uint8Array(this.analyser.frequencyBinCount);
            audio.getOutput().connect(this.analyser);
        };
         
        public getFrequencyData()
        {
            this.analyser.getByteFrequencyData(this.data);
            return this.data;
        } 
        public getAverageFrequency()
        {
            var value = 0, data = this.getFrequencyData();
            for (var i = 0; i < data.length; i++)
            {
                value += data[i];
            }
            return value / data.length;
        }
    }
}