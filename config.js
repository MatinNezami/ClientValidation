const $ = document
    isExists = selector => $.select(selector);

(_ => {
   
    function event (...args) {
        let events = [],
            handlers = [];
   
        function reset () {
            events = [];
            handlers = [];
        }
   
        function setEvent (elm, propagation = false) {
            const count = events.length > handlers.length? events.length: handlers.length;

            for (let i = 0; i < count; i++)
                for (let j = 0; j < count; j++)
                    events.length > handlers.length?
                    elm.addEventListener((events[i]?? events[events.length - 1]), (handlers[j]?? handlers[handlers.length - 1]), propagation):
                    elm.addEventListener((events[j]?? events[events.length - 1]), (handlers[i]?? handlers[handlers.length - 1]), propagation);
        }
         
        for (let i = 0; i < args.length; i++) {
            if (typeof args[i] == "string")
                events.push(args[i]);
   
            else if (typeof args[i] == "function")
                handlers.push(args[i]);
   
            else if (typeof args[i] == "boolean") {
                setEvent(this, args[i]);
                reset();
            }
   
            if ((typeof args[i] == "function" && typeof args[i + 1] == "string") || !args[i + 1]) {
                setEvent(this);
                reset();
            }
        }
    }
    
    function allEvent (...args) {
        this.forEach(elm => elm.event(...args));
    }
    
    Element.prototype.event = event;
    NodeList.prototype.event = allEvent;

    
    function select (selector, name) {
        let elms;
        this instanceof Element? elms = this.querySelectorAll(selector): elms = $.querySelectorAll(selector);

        if (elms.length == 1) elms = elms[0];
        else if (elms.length == 0) elms = undefined;

        if (name && !(name in $))
            $[name] = elms;
           
        return elms;
    }
       
    Document.prototype.select = select;
    Element.prototype.select = select;
   
})();