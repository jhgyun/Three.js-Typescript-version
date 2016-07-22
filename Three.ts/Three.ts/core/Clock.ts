/* 
 * @author alteredq / http://alteredqualia.com/
 */

namespace THREE
{
    export class Clock
    {
        startTime = 0;
        oldTime = 0;
        elapsedTime = 0;
        running = false;

        constructor(public autoStart = true)
        {
        };

        start()
        {
            this.startTime = (performance || Date).now();
            this.oldTime = this.startTime;
            this.running = true;
        }
        stop()
        {
            this.getElapsedTime();
            this.running = false;
        }
        getElapsedTime()
        {
            this.getDelta();
            return this.elapsedTime;
        }
        getDelta()
        {
            var diff = 0;
            if (this.autoStart && !this.running)
            {
                this.start();
            }
            if (this.running)
            {
                var newTime = (performance || Date).now();

                diff = (newTime - this.oldTime) / 1000;
                this.oldTime = newTime;
                this.elapsedTime += diff;
            }
            return diff;
        }
    };
}