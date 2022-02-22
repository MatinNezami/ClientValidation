const $ = document;

function isExists (selector) {
    return $.select(selector);
}

(_ => {
   
    function event (...args) {
        let events = [],
            handlers = [];
   
        function reset () {
            events = [];
            handlers = [];
        }
   
        function setEvent (elm, propagation = false) {
            for (let i = 0; i < (events.length > handlers.length? events.length: handlers.length); i++)
                for (let j = 0; j < (events.length < handlers.length? events.length: handlers.length); j++)
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

    
    function select (selector, name = undefined) {
        let elms;
        this instanceof Element?elms = this.querySelectorAll(selector) :elms = $.querySelectorAll(selector);
           
        if (typeof name == "string" && !(name in $))
            elms.length > 1? $[name] = elms: $[name] = elms[0];
           
        return elms.length > 1? elms: elms[0];
    }
       
    Document.prototype.select = select;
    Element.prototype.select = select;
   
})();
