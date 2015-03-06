/**
 * Created by SmallAiTT on 2015/2/25.
 */
module tm{
    var _timeoutIdCounter:number = 1;//tickOutId计数器
    var _intervalIdCounter:number = 1;//tickInter
    var _timeoutMap:any = {};//tickOut映射列表
    var _intervalMap = {};//tickInterval映射列表
    var _inited:boolean = false;//是否已经初始化过了

    var _getArgs1 = function(cb:Function, ctxOrDelay:any, delayOrArg0?:any, ...args:any[]){
        var tempCtx = ctxOrDelay, tempDelay = delayOrArg0, tempArgs = args;
        var l = arguments.length;
        if(typeof ctxOrDelay == "number"){//如果第二个参数是一个数字，那么其就是delay
            tempCtx = null;
            tempDelay = ctxOrDelay;
            if(l > 2){//如果参数个数大于2个，那么第三个参数就是args的第一项
                tempArgs.splice(0, 0, delayOrArg0);
            }
        }else if((l == 2 && typeof ctxOrDelay != "number") || (l > 2 && typeof delayOrArg0 != "number")) {
            throw "参数有误"
        }
        return [cb, tempCtx, tempDelay, tempArgs];
    };

    /**
     * 这个api用于代替原生的setTimeout，并且加入了context和args的支持
     * @param cb
     * @param ctxOrDelay
     * @param delayOrArg0
     * @param args
     * @returns {number}
     */
    export function setTimeout(cb:Function, ctxOrDelay:any, delayOrArg0?:any, ...args:any[]):number{
        var id = _timeoutIdCounter++;
        var arr = _getArgs1.apply(null, arguments);
        var tempCtx = arr[1], tempDelay = arr[2], tempArgs = arr[3];
        if(tempDelay == 0){//如果delay==0则表示立即执行
            cb.apply(tempCtx, tempArgs);
        }else{
            arr.push(0, true);//毫秒计数器、是否需要根据真实事件走
            _timeoutMap[id] = arr;
        }
        return id;
    }

    /**
     * 这个是跟着tick走的。也就是说不是跟着真实时间走的。休眠时将停止，激活时根据上次停止处继续。
     * @param cb
     * @param ctxOrDelay
     * @param delayOrArg0
     * @param args
     * @returns {number}
     */
    export function setTimeout4Tick(cb:Function, ctxOrDelay:any, delayOrArg0?:any, ...args:any[]):number{
        var id = _timeoutIdCounter++;
        var arr = _getArgs1.apply(null, arguments);
        var tempCtx = arr[1], tempDelay = arr[2], tempArgs = arr[3];
        if(tempDelay == 0){//如果delay==0则表示立即执行
            cb.apply(tempCtx, tempArgs);
        }else{
            arr.push(0, false);//毫秒计数器、是否需要根据真实事件走
            _timeoutMap[id] = arr;
        }
        return id;
    }
    export function clearTimeout(tickOutId:number){
        delete _timeoutMap[tickOutId];
    }
    export function setInterval(cb:Function, ctxOrDelay:any, intervalOrArg0?:any, ...args:any[]):number{
        var id = _intervalIdCounter++;
        var arr = _getArgs1.apply(null, arguments);
        var tempCtx = arr[1], tempDelay = arr[2], tempArgs = arr[3];
        if(tempDelay == 0){//如果interval==0则表示立即执行，且以后每一次主循环都需要执行一次
            cb.apply(tempCtx, tempArgs);
        }
        arr.push(0, true);//毫秒计数器、是否需要根据真实事件走
        _intervalMap[id] = arr;
        return id;
    }
    export function setInterval4Tick(cb:Function, ctxOrDelay:any, intervalOrArg0?:any, ...args:any[]):number{
        var id = _intervalIdCounter++;
        var arr = _getArgs1.apply(null, arguments);
        var tempCtx = arr[1], tempDelay = arr[2], tempArgs = arr[3];
        if(tempDelay == 0){//如果interval==0则表示立即执行，且以后每一次主循环都需要执行一次
            cb.apply(tempCtx, tempArgs);
        }
        arr.push(0, false);//毫秒计数器、是否需要根据真实事件走
        _intervalMap[id] = arr;
        return id;
    }
    export function clearInterval(tickIntervalId:number){
        delete _intervalMap[tickIntervalId];
    }

    export function init(){
        if(_inited) return;
        _inited = true;

        //++++++++++++++++++++++++++注册主循环 开始+++++++++++++++++
        //写在这里的目的是直接放在闭包内部，一是确保只会有一个主循环，二是减少tm下的挂接数量。
        egret.Ticker.getInstance().register(function (ms:number){
            var timeoutMap = _timeoutMap;
            for (var timeoutId in timeoutMap) {
                var arr = timeoutMap[timeoutId];
                var cb = arr[0], ctx = arr[1], delay = arr[2], args = arr[3], sumMs = arr[4] + ms;
                if(sumMs >= delay){//倒数计时到了
                    cb.apply(ctx, args);
                    delete timeoutMap[timeoutId];
                }else{
                    arr[4] = sumMs;
                }
            }

            var intervalMap = _intervalMap;
            for (var intervalId in intervalMap) {
                var arr = intervalMap[intervalId];
                var cb = arr[0], ctx = arr[1], interval = arr[2] || 1, args = arr[3], sumMs = arr[4] + ms;
                var leftMs = sumMs - interval;
                if(leftMs >= 0){//如果已经到了计时点
                    while(leftMs >= 0){
                        cb.apply(ctx, args);
                        leftMs -= interval;
                    }
                    arr[4] = leftMs + interval;//设置成残余的毫秒数
                }else{//否则直接累加上时间
                    arr[4] = sumMs;
                }
            }
        }, tm);
        //++++++++++++++++++++++++++注册主循环 结束+++++++++++++++++

        //+++++++++++++++++++++++游戏激活与否相关监听 开始+++++++++++
        var stage:egret.Stage = egret.MainContext.instance.stage;
        var obj = {
            deactivateTime : 0
        };
        stage.addEventListener(egret.Event.DEACTIVATE, function(){//取消激活
            this.deactivateTime = egret.getTimer();
        }, obj);
        stage.addEventListener(egret.Event.ACTIVATE, function(){//激活
            var ms = egret.getTimer() - this.deactivateTime;
            console.debug("休眠了 %d 毫秒", ms);

            var timeoutMap = _timeoutMap, execArr = [];
            for (var timeoutId in timeoutMap) {
                var arr = timeoutMap[timeoutId];
                var cb = arr[0], ctx = arr[1], delay = arr[2], args = arr[3], sumMs = arr[4] + ms, follow = arr[5];
                if(!follow) continue;//不跟着真实时间走，而是跟着主循环走
                if(sumMs >= delay){//倒数计时到了
                    //回调、上下文、延迟、传参、顺序比较用的毫秒数、类型、id
                    execArr.push([cb, ctx, delay, args, delay - arr[4], 1, timeoutId]);//先保存到数组
                }else{
                    arr[4] = sumMs;
                }
            }

            var intervalMap = _intervalMap;
            for (var intervalId in intervalMap) {
                var arr = intervalMap[intervalId];
                var cb = arr[0], ctx = arr[1], interval = arr[2]||1, args = arr[3], follow = arr[5];
                if(!follow) continue;//不跟着真实时间走，而是跟着主循环走
                var lastLeftMs = interval - arr[4];//上一次剩余多久就可以继续执行回调
                if(lastLeftMs <= ms){
                    while(lastLeftMs <= ms){
                        //回调、上下文、延迟、传参、顺序比较用的毫秒数、类型、id
                        execArr.push([cb, ctx, delay, args, lastLeftMs, 2, intervalId]);//先保存到数组
                        lastLeftMs += interval;//如果为0就弄成1毫秒一次
                    }
                    arr[4] = lastLeftMs - interval;//设置成残余的毫秒数
                }else{
                    arr[4] += ms;//设置成残余的毫秒数
                }
            }

            //对执行列表进行升序排序
            execArr.sort(function(arr1:any[], arr2:any[]){
                var c1 = arr1[4], c2 = arr2[4];
                if(c1 > c2) return 1;
                else if(c1 == c2) return 0;
                else return -1;
            });
            //执行回调
            for (var i = 0, l_i = execArr.length; i < l_i; i++) {
                var arr = execArr[i];
                var cb = arr[0], ctx = arr[1], delay = arr[2], args = arr[3], type = arr[5], id = arr[6];
                if(type == 1){//tickOut
                    if(!_timeoutMap[id]){//已经被移除了
                        continue;
                    }else{
                        delete _timeoutMap[id];//进行移除
                    }
                }else{//tickInterval
                    if(!_intervalMap[id]) {//已经被移除了
                        continue;
                    }
                }
                cb.apply(ctx, args);
            }
        }, obj);
        //+++++++++++++++++++++++游戏激活与否相关监听 结束+++++++++++
    }
}