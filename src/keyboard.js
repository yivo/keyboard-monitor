var Keyboard = (function() {

    var instance;

    var callbacks = {};
    var holdingKeys = [];

    window.c = callbacks;

    var keyName2Code = {
        'a' : 65, 'b' : 66, 'c' : 67, 'd' : 68, 'e' : 69, 'f' : 70,
        'g' : 71, 'h' : 72, 'i' : 73, 'j' : 74, 'k' : 75, 'l' : 76,
        'm' : 77, 'n' : 78, 'o' : 79, 'p' : 80, 'q' : 81, 'r' : 82,
        's' : 83, 't' : 84, 'u' : 85, 'v' : 86, 'w' : 87, 'x' : 88,
        'y' : 89, 'z' : 90, 'enter' : 13, 'esc' : 27, 'space' : 32,
        'left' : 37, 'up' : 38, 'right' : 39, 'down' : 40,
        'arrow-left' : 37, 'arrow-right' : 39, 'arrow-up' : 38,
        'arrow-down' : 40, 'ctrl' : 17, 'alt' : 18, 'backspace' : 8
    };

    var Keyboard = function() {

        if (instance) return instance;

        instance = this;

        document.addEventListener('keydown', function(e) {
            if (holdingKeys.indexOf(e.keyCode) === -1) {
                handleEvent('pressed', e.keyCode);
                holdingKeys.push(e.keyCode);
            }
        });

        document.addEventListener('keyup', function(e) {
            handleEvent('released', e.keyCode);
            holdingKeys.splice(holdingKeys.indexOf(e.keyCode), 1);
        });

        document.addEventListener('blur', function() {
            holdingKeys = [];
            console.log('blur');
        });

        handleAllHoldingEvents();

    };

    var extend = function(a, b){
        for(var key in b)
            if(b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        return a;
    };

    var api = {};

    api.registerKey = function(keyName, keyCode) {
        keyName2Code[keyName] = keyCode;
        return this;
    };

    api.codeOf = function(keyName) {
        return keyName2Code[keyName];
    };

    api.bind = function(event, keys, callback) {
        if (!callbacks[event]) callbacks[event] = {};
        eachKey(keys, function(keyName) {
            var keyCode = instance.codeOf(keyName) || keyName;
            (callbacks[event][keyCode] || (callbacks[event][keyCode] = [])).push(callback);
        });
    };

    api.isHolding = function(keyName) {
        return holdingKeys.indexOf(this.codeOf(keyName) || keyName) !== -1;
    };

    var event, events = ['pressed', 'holding', 'released'];
    while (event = events.pop()) {
        api[event] = (function(event) {
            return function(keys, callback) {
                return this.bind(event, keys, callback);
            }
        })(event);
    }

    extend(Keyboard.prototype, api);

    var handleEvent = function(event, key) {
        if (!callbacks[event]) return;
        var cbs = callbacks[event][key];
        if (!cbs) return;
        var length = cbs.length;
        for (var i = 0; i < length; ++i) {
            cbs[i](key, event);
        }
    };

    var handleHoldingEvent = function() {
        var event = 'holding';
        var length = holdingKeys.length;
        for (var i = 0; i < length; ++i) {
            handleEvent(event, holdingKeys[i]);
        }
    };

    var handleAllHoldingEvents = function() {
        handleHoldingEvent();
        requestAnimationFrame(handleAllHoldingEvents);
    };

    var eachKey = function(keys, callback) {

        if (typeof keys === 'string') {
            keys = keys.toLowerCase().split(' ');
        }

        for (var i = 0; i < keys.length; ++i) {
            callback(keys[i]);
        }

    };

    return Keyboard;

})();

var keyboard = new Keyboard();