module mo{
    var _setTimeoutIdCache:any = {};

    /**
     * 每帧都执行。
     * @param cb
     * @param ctx
     */
    export function tick(cb:(frameTime:number)=>void, ctx?:any):void{
        egret.Ticker.getInstance().register(cb, ctx);
    }
    /**
     * 移除每帧的执行函数。
     * @param cb
     * @param ctx
     */
    export function clearTick(cb:(frameTime:number)=>void, ctx?:any):void{
        egret.Ticker.getInstance().unregister(cb, ctx);
    }
    /**
     * 下一个主循环执行一次。
     * @deprecated
     * @param cb
     * @param ctx
     */
    export function nextTick(cb:(...args)=>void, ctx?:any, ...args:any[]):void{
        logger.warn("这个接口将被废弃，请使用`process.nextTick`接口！");
        process.nextTick.apply(process, arguments);
    }

    /**
     * 在指定的延迟（以毫秒为单位）后运行指定的函数。
     * @method mo.setTimeout
     * @param cb {Function} 侦听函数
     * @param ctx {any} this对象
     * @param delay {number} 延迟时间，以毫秒为单位
     * @param ...args {any} 参数列表
     * @returns {number} 返回索引，可以用于 clearTimeout
     */
    export function setTimeout(cb:(...args)=>void, ctx:any, delay:number, ...args:any[]):number{
        var id = egret.setTimeout(function(){
            delete _setTimeoutIdCache[id];
            cb.apply(ctx, args);
        }, null, delay);
        _setTimeoutIdCache[id] = 1;
        return id;
    }
    /**
     * 清除指定延迟后运行的函数。
     * @method mo.clearTimeout
     * @param key {number}
     */
    export function clearTimeout(key:number):void {
        delete _setTimeoutIdCache[key];
        egret.clearTimeout(key);
    }

    export function clearAllTimeout():void{
        for (var key in _setTimeoutIdCache) {
            delete _setTimeoutIdCache[key];
            egret.clearTimeout(key);
        }
    }

    //添加setInterval相关api。
    var _setIntervalIdCache:any = {};
    var _setIntervalId:number = 1;
    export function setInterval(cb:Function, ctx:any, interval:number):number{
        var timer:egret.Timer = new egret.Timer(interval);
        timer.addEventListener(egret.TimerEvent.TIMER, cb, ctx);
        var id = _setIntervalId++;
        _setIntervalIdCache[id] = {timer:timer, listener:cb, ctx:ctx};
        timer.start();
        return id;
    }

    export function clearInterval(key:number):void{
        var setIntervalInfo = _setIntervalIdCache[key];
        delete _setIntervalIdCache[key];
        if(setIntervalInfo){
            var timer:egret.Timer = setIntervalInfo.timer;
            timer.removeEventListener(egret.TimerEvent.TIMER, setIntervalInfo.listener, setIntervalInfo.ctx);
            timer.stop();
        }
    }

    export function clearAllInterval():void{
        for (var key in _setTimeoutIdCache) {
            var setIntervalInfo = _setIntervalIdCache[key];
            delete _setIntervalIdCache[key];
            if(setIntervalInfo){
                var timer:egret.Timer = setIntervalInfo.timer;
                timer.removeEventListener(egret.TimerEvent.TIMER, setIntervalInfo.listener, setIntervalInfo.ctx);
                timer.stop();
            }
        }
    }

    export function getStage(): egret.Stage{
        return egret.MainContext.instance.stage;
    }

    export function clearStage():egret.Stage{
        var stage:egret.Stage = egret.MainContext.instance.stage;
        stage.removeChildren();
        return stage;
    }

    var _actionMag:egret.action.Manager;
    export function runAction(action:egret.action.Action, target:any, paused?:boolean){
        if(!_actionMag){
            _actionMag = new egret.action.Manager();
            tick(function (dt) {
                _actionMag.update(dt / 1000);
            })
        }
        _actionMag.addAction(action, target, paused);
    }
}