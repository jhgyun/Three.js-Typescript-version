var THREE;
(function (THREE) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
        }
        EventDispatcher.prototype.addEventListener = function (type, listener, _this) {
            if (this._listeners === undefined) {
                this._listeners = {};
                this._thises = {};
            }
            if (_this == undefined)
                _this = null;
            var listeners = this._listeners;
            var thises = this._thises;
            if (listeners[type] === undefined) {
                listeners[type] = [];
                thises[type] = [];
            }
            var index = listeners[type].indexOf(listener);
            while (index > -1) {
                if (thises[type][index] === _this)
                    break;
                index = listeners[type].indexOf(listener, index + 1);
            }
            if (index === -1) {
                listeners[type].push(listener);
                thises[type].push(_this == undefined ? null : _this);
            }
        };
        EventDispatcher.prototype.hasEventListener = function (type, listener, _this) {
            if (this._listeners === undefined)
                return false;
            if (_this === undefined)
                _this = null;
            var listeners = this._listeners;
            if (listeners[type] !== undefined) {
                var index = listeners[type].indexOf(listener);
                while (index > -1) {
                    if (this._thises[type][index] === _this)
                        return true;
                    index = listeners[type].indexOf(listener, index + 1);
                }
                return false;
            }
            return false;
        };
        EventDispatcher.prototype.removeEventListener = function (type, listener, _this) {
            if (this._listeners === undefined)
                return;
            if (_this === undefined)
                _this = null;
            var listeners = this._listeners;
            var listenerArray = listeners[type];
            var thisArray = this._thises[type];
            if (listenerArray !== undefined) {
                var index = listenerArray.indexOf(listener);
                while (index > -1) {
                    if (thisArray[index] === _this)
                        break;
                    index = listeners[type].indexOf(listener, index + 1);
                }
                if (index !== -1) {
                    listenerArray.splice(index, 1);
                    thisArray.splice(index, 1);
                }
            }
        };
        EventDispatcher.prototype.dispatchEvent = function (event) {
            if (this._listeners === undefined)
                return;
            var listeners = this._listeners;
            var listenerArray = listeners[event.type];
            var thisArray = this._thises[event.type];
            if (listenerArray !== undefined) {
                event.target = this;
                var array = [], i = 0;
                var thisArr = [];
                var length = listenerArray.length;
                for (i = 0; i < length; i++) {
                    array[i] = listenerArray[i];
                    thisArr[i] = thisArray[i] || this;
                }
                for (i = 0; i < length; i++) {
                    var _this = thisArr[i];
                    array[i].call(_this, event);
                }
            }
        };
        return EventDispatcher;
    }());
    THREE.EventDispatcher = EventDispatcher;
})(THREE || (THREE = {}));
