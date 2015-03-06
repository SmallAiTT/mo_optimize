module mo_evt{
    class _EventStore4Once{
        eventType:string;
        tempListener:Function;
        listener:Function;
        ctx:any;
    }

    export function removeEventListeners(dispatcher:egret.evt.EventDispatcher, eventType?:string, useCapture?:boolean):void{
        var eventsMap:any = (<any>dispatcher)._eventsMap, captureEventsMap:any = (<any>dispatcher)._captureEventsMap;
        if(arguments.length == 0){//没有传参表示移除所有
            if(eventsMap){
                for(var key in eventsMap){
                    delete eventsMap[key];
                }
            }
            if(captureEventsMap){
                for(var key in captureEventsMap){
                    delete eventsMap[key];
                }
            }
        }else if(arguments.length == 1){
            if(typeof eventType == "string"){//移除某个类型所有
                if(eventsMap && eventsMap[eventType]){
                    delete eventsMap[eventType]
                }
                if(captureEventsMap && captureEventsMap[eventType]){
                    delete captureEventsMap[eventType]
                }
            }else{//移除某个阶段所有
                var map:Object = !!eventType ? captureEventsMap : eventsMap;
                if (map){
                    for(var key in map){
                        delete map[key];
                    }
                }
            }
        }else if(arguments.length == 2){//移除某个类型某个阶段所有
            var map:Object = useCapture ? captureEventsMap : eventsMap;
            if (map){
                delete map[eventType];
            }
        }
    }

    //添加只执行一次的监听，监听响应之后就会被立即移除，注意，这种监听没办法重复添加，后续添加的会将之前添加的覆盖掉
    export function addEventListenerOnce(dispatcher:egret.evt.EventDispatcher, eventType:string, listener:Function, ctx?:any){
        removeEventListenerOnce.apply(mo_evt, arguments);//如果之前已经有注册了，就先移除掉

        var map = (<any>dispatcher)._eventsMap4Once;//
        if(!map){
            map = (<any>dispatcher)._eventsMap4Once = {};//动态赋值
        }

        var tempListener = function(event:egret.evt.Event){
            removeEventListenerOnce(dispatcher, eventType, listener, ctx);

            listener.apply(ctx, arguments);
        };

        var eventStore = new _EventStore4Once();
        eventStore.ctx = ctx;
        eventStore.listener = listener;
        eventStore.eventType = eventType;
        eventStore.tempListener = tempListener;

        var arr = map[eventType];
        if(!arr){
            arr = map[eventType] = [];
        }
        arr.push(eventStore);

        dispatcher.addEventListener(eventType, tempListener, null);
    }

    //移除只执行一次的监听
    export function removeEventListenerOnce(dispatcher:egret.evt.EventDispatcher, eventType:string, listener:Function, ctx?:any){
        var map = (<any>dispatcher)._eventsMap4Once;//
        if(!map){
            map = (<any>dispatcher)._eventsMap4Once = {};//动态赋值
        }
        //如果之前已经有注册了，就先移除掉
        var eventStoreArr:_EventStore4Once[] = map[eventType];
        if(eventStoreArr) {
            for(var i = 0; i < eventStoreArr.length; ++i){
                var eventStore:_EventStore4Once = eventStoreArr[i];
                if(eventStore.listener == listener && eventStore.ctx == ctx){
                    dispatcher.removeEventListener(eventType, eventStore.tempListener, null);
                    eventStoreArr.splice(i, 1);
                    break;
                }
            }
        }
    }



    export function addBeforeEventListener(dispatcher:egret.evt.EventDispatcher, eventType:string, listener:Function, ctx:any, useCapture?: boolean, priority?: number): void{
        var args = Array.prototype.slice.call(arguments, 1);
        args[0] = Event.getBeforeEventType(eventType);
        dispatcher.addEventListener.apply(dispatcher, args);
    }

    export function addAfterEventListener(dispatcher:egret.evt.EventDispatcher, eventType:string, listener:Function, ctx:any, useCapture?: boolean, priority?: number): void{
        var args = Array.prototype.slice.call(arguments, 1);
        args[0] = Event.getAfterEventType(eventType);
        dispatcher.addEventListener.apply(dispatcher, args);
    }

    export function removeBeforeEventListener(dispatcher:egret.evt.EventDispatcher, eventType:string, listener:Function, ctx:any, useCapture?: boolean): void{
        var args = Array.prototype.slice.call(arguments, 1);
        args[0] = Event.getBeforeEventType(eventType);
        dispatcher.removeEventListener.apply(dispatcher, args);
    }

    export function removeAfterEventListener(dispatcher:egret.evt.EventDispatcher, eventType:string, listener:Function, ctx:any, useCapture?: boolean): void{
        var args = Array.prototype.slice.call(arguments, 1);
        args[0] = Event.getAfterEventType(eventType);
        dispatcher.removeEventListener.apply(dispatcher, args);
    }

    export function dispatchEvent(dispatcherInfoArr:any[][], dstFunc, sender:any, ...args:any[]){
        var length = dispatcherInfoArr.length;
        for(var i = 0; i < length; ++i){
            var info = dispatcherInfoArr[i];
            var dispatcher:egret.evt.EventDispatcher = info[0];
            var eventType = info[1];
            var beforeType = Event.getBeforeEventType(eventType);
            if(dispatcher.willTrigger(beforeType)){
                var beforeEvent = new Event(beforeType);
                beforeEvent.sender = sender;
                beforeEvent.data = info[3];
                dispatcher.dispatchEvent(beforeEvent);
            }
        }
        var result = dstFunc.apply(sender, args);
        for(var i = length - 1; i >= 0; --i){
            var info = dispatcherInfoArr[i];
            var dispatcher:egret.evt.EventDispatcher = info[0];
            var eventType = info[1];
            var afterType = Event.getAfterEventType(eventType);
            if(dispatcher.willTrigger(afterType)){
                var afterEvent = new Event(afterType);
                afterEvent.sender = sender;
                afterEvent.data = result;
                dispatcher.dispatchEvent(afterEvent);
            }
        }
    }


    export function dispatchEventWidthCallback(dispatcherInfoArr:any[][], dstFunc, sender:any, ...args:any[]){
        var length = dispatcherInfoArr.length;
        for(var i = 0; i < length; ++i){
            var info = dispatcherInfoArr[i];
            var dispatcher:egret.evt.EventDispatcher = info[0];
            var eventType = info[1];
            var beforeType = Event.getBeforeEventType(eventType);
            if(dispatcher.willTrigger(beforeType)){
                var beforeEvent = new Event(beforeType);
                beforeEvent.sender = sender;
                dispatcher.dispatchEvent(beforeEvent);
            }
        }
        args.push(function(){
            for(var i = length - 1; i >= 0; --i){
                var info = dispatcherInfoArr[i];
                var dispatcher:egret.evt.EventDispatcher = info[0];
                var eventType = info[1];
                var afterType = Event.getAfterEventType(eventType);
                if(dispatcher.willTrigger(afterType)){
                    var afterEvent = new Event(afterType);
                    afterEvent.sender = sender;
                    dispatcher.dispatchEvent(afterEvent);
                }
            }
        });
        dstFunc.apply(sender, args);
    }
}