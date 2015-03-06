/**
 * asyncjs模块的api模拟。只模拟了部分觉得有用的api。
 */
module async {

    /**
     * 异步池
     */
    export class AsyncPool{
        private _srcObj = null;
        private _limit:number = 0;
        private _pool:any[] = [];
        private _iterator:Function = null;
        private _iteratorCtx:any = null;
        private _onEnd:Function = null;
        private _onEndCtx:any = null;
        private _results:any = null;
        private _isErr:boolean = false;

        /** 总大小 */
        public size:number = 0;
        /** 已完成的大小 */
        public finishedSize:number = 0;
        /** 正在工作的大小 **/
        public _workingSize:number = 0;

        constructor(srcObj:any, limit:number, iterator:Function, onEnd:Function, ctx?:any){
            var self = this;
            self._srcObj = srcObj;
            self._iterator = iterator;
            self._iteratorCtx = ctx;
            self._onEnd = onEnd;
            self._onEndCtx = ctx;
            self._results = srcObj instanceof Array ? [] : {};

            self._each(srcObj, function(value:any, index?:any){
                self._pool.push({index : index, value : value});
            });

            self.size = self._pool.length;//总大小
            self._limit = limit || self.size;
        }

        _each(obj, iterator:(value:any, index?:any)=>any, context?:any){
            if(!obj) return;
            if(obj instanceof Array){
                for(var i = 0, li = obj.length; i < li; i++){
                    if(iterator.call(context, obj[i], i) === false) return;
                }
            }else{
                for (var key in obj) {
                    if(iterator.call(context, obj[key], key) === false) return;
                }
            }
        }

        public onIterator(iterator:Function, target:any):void{
            this._iterator = iterator;
            this._iteratorCtx = target;
        }

        public onEnd(endCb:Function, endCbTarget:any):void{
            this._onEnd = endCb;
            this._onEndCtx = endCbTarget;
        }

        private _handleItem():void{
            var self = this;
            if(self._pool.length == 0) return;//数组长度为0直接返回不操作了
            if(self._workingSize >= self._limit) return;//正在工作的数量应达到限制上限则直接返回
            var item:any = self._pool.shift();
            var value = item.value;
            var index = item.index;
            self._workingSize++;//正在工作的大小+1
            self._iterator.call(self._iteratorCtx, value, index, function(err){
                if(self._isErr) return;//已经出错了，就直接返回了

                self.finishedSize++;//完成数量+1
                self._workingSize--;//正在工作的大小-1

                if(err) {
                    self._isErr = true;//设置成已经出错了
                    if(self._onEnd) self._onEnd.call(self._onEndCtx, err);//如果出错了
                    return
                }

                var arr = Array.prototype.slice.call(arguments);
                arr.splice(0, 1);//去除第一个参数
                self._results[this.index] = arr[0];//保存迭代器返回结果
                if(self.finishedSize == self.size) {//已经结束
                    if(self._onEnd) self._onEnd.call(self._onEndCtx, null, self._results);
                    return
                }

                self._handleItem();//继续执行下一个
            }.bind(item), self);
        }

        public flow():void{
            var self = this;
            var onFlow = function(){
                if(self._pool.length == 0) {
                    if (self._onEnd) self._onEnd.call(self._onEndCtx, null, []);//数组长度为0，直接结束
                }else{
                    for(var i = 0; i < self._limit; i++){
                        self._handleItem();
                    }
                }
            };

            if(typeof process != "undefined"){
                process.nextTick(onFlow, self);
            }else if(typeof egret != "undefined"){
                egret.setTimeout(function(){
                    onFlow();
                }, this, 1);
            }else{
                //实在没有就用自带的（浏览器环境下才会进）
                setTimeout(function(){
                    onFlow();
                }, 1);
            }
        }

    }

    /**
     * 序列执行异步任务。
     * @param tasks
     * @param cb
     * @param ctx
     */
    export function series(
        tasks:Array<(cb:(err?:any, arg?:any)=>void)=>void>,
        cb:(err:any, results:any[])=>void,
        ctx?:any):void{
        var asyncPool = new AsyncPool(tasks, 1, function(func, index, cb1){
            func.call(ctx, cb1);
        }, cb, ctx);
        asyncPool.flow();
    }

    /**
     * 平行执行异步任务。
     * @param tasks
     * @param cb
     * @param ctx
     */
    export function parallel(
        tasks:Array<(cb:(err?:any, arg?:any)=>void)=>void>,
        cb:(err:any, results:any[])=>void,
        ctx?:any):void{
        var asyncPool = new AsyncPool(tasks, 0, function(func, index, cb1){
            func.call(ctx, cb1);
        }, cb, ctx);
        asyncPool.flow();
    }

    /**
     * 瀑布模式执行异步任务。
     * @param tasks
     * @param cb
     * @param ctx
     */
    export function waterfall(
        tasks:Array<(...args:any[])=>void>,
        cb:(err:any, argFromLastTask?:any)=>void,
        ctx?:any):void{

        var args:any[] = [];//参数
        var asyncPool = new AsyncPool(tasks, 1, function(func, index, cb1){
            args.push(function(err){
                //在这里重新设置传递给各个任务的参数
                args = Array.prototype.slice.apply(arguments);//保存当前任务的返回值
                args.splice(0, 1);//去掉err项
                cb1.apply(null, arguments);
            });//将回调添加进去
            func.apply(ctx, args);
        }, function(err, results){
            if(!cb) return;//没有回调，不处理
            if(err) return cb.call(ctx, err);//如果出错了

            cb.call(ctx, null, results[results.length - 1]);
        }, null);
        asyncPool.flow();
    }

    /**
     * 使用map方式迭代执行列表或者对象数据，进行异步操作。
     * @param tasks {Array|Object}
     * @param iterator  迭代的异步操作
     * @param cb
     * @param ctx
     */
    export function map(
        tasks:any,
        iterator:(value:any, index:any, cb:(err:any, ...args:any[])=>void)=>void,
        cb:(err:any, results:any[])=>void,
        ctx?:any):void{
        var asyncPool = new AsyncPool(tasks, 0, iterator, cb, ctx);
        asyncPool.flow();
    }

    /**
     * 使用map方式迭代执行列表或者对象数据，进行异步操作。但是可以限制每次并行的数量。
     * @param tasks {Array|Object}
     * @param limit 每次并行限制数量
     * @param iterator  迭代的异步操作
     * @param cb
     * @param ctx
     */
    export function mapLimit(
        tasks:any,
        limit:number,
        iterator:(value:any, index:any, cb:(err:any, ...args:any[])=>void)=>void,
        cb:(err:any, results:any[])=>void,
        ctx?:any):void{
        var asyncPool = new AsyncPool(tasks, limit, iterator, cb, ctx);
        asyncPool.flow();
    }

}