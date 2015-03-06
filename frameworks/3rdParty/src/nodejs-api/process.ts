/**
 * 该api值保留了在h5端需要的几个接口而已
 */
module process{
    /**
     * 下一个主循环执行一次。
     * 这个和nodejs不同的是，多了执行回调的上下文和传参。
     * @param cb
     * @param ctx
     */
    export function nextTick(cb:(...args)=>void, ctx?:any, ...args:any[]):void{
        egret.MainContext.instance.addEventListener(egret.evt.Event.FINISH_RENDER, function(){
            egret.MainContext.instance.removeEventListener(egret.evt.Event.FINISH_RENDER, arguments.callee, null);
            cb.apply(ctx, args);
        }, null);
    }
}