var THREE;
(function (THREE) {
    var Clock = (function () {
        function Clock(autoStart) {
            if (autoStart === void 0) { autoStart = true; }
            this.autoStart = autoStart;
            this.startTime = 0;
            this.oldTime = 0;
            this.elapsedTime = 0;
            this.running = false;
        }
        ;
        Clock.prototype.start = function () {
            this.startTime = (performance || Date).now();
            this.oldTime = this.startTime;
            this.running = true;
        };
        Clock.prototype.stop = function () {
            this.getElapsedTime();
            this.running = false;
        };
        Clock.prototype.getElapsedTime = function () {
            this.getDelta();
            return this.elapsedTime;
        };
        Clock.prototype.getDelta = function () {
            var diff = 0;
            if (this.autoStart && !this.running) {
                this.start();
            }
            if (this.running) {
                var newTime = (performance || Date).now();
                diff = (newTime - this.oldTime) / 1000;
                this.oldTime = newTime;
                this.elapsedTime += diff;
            }
            return diff;
        };
        return Clock;
    }());
    THREE.Clock = Clock;
    ;
})(THREE || (THREE = {}));
