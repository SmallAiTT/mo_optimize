module mo {

    //多ID的缓冲池
    export class MultiIdBaseFactory extends BaseFactory {
        static __className:string = "MultiIdBaseFactory";

        //@override
        _initProp() {
            super._initProp();
            this._queue = {};
        }

        //@override
        _init() {
            super._init();
        }

        _produce(keyName, ...args:any[]):any{
            var node, queue;
            queue = this._queue[keyName];
            if (queue && queue.length > 0) {
                node = queue.shift();
            }
            else {
                node = this._productClass.create.apply(this._productClass, arguments);
                node.setFactory(this);
                node._keyNameForFactory = keyName;
            }
            return node;
        }

        _produceDynamic(keyName, ...args:any[]):any{
            var node, queue;
            queue = this._queue[keyName];
            if (queue && queue.length > 0) {
                node = queue.shift();
                node.handleDynamic.apply(node, arguments);
            }
            else {
                node = this._productClass.createDynamic.apply(this._productClass, arguments);
                node.setFactory(this);
                node._keyNameForFactory = keyName;
            }
            return node;
        }

        reclaim(node){
            var self = this;
            //如果已经回收了就直接返回
            //如果是自动释放，就认为不能回收
            //如果node对应的factory并不是当前的factory则直接返回
            if(node.isReclaimed || node.isAutoDtor || node.getFactory() != self){
                return;
            }
            var keyName = node._keyNameForFactory;
            var queue = self._queue;
            if(!queue.hasOwnProperty(keyName)){
                queue[keyName] = [];
            }

            queue[keyName].push(node);
            node.reset();
            node.isReclaimed = true;
        }

        releaseAllProducts():void{
            var queue = this._queue;
            for (var keyName in this._queue) {
                var subQueue = queue[keyName];
                if(subQueue){
                    var arm;
                    for (var i = 0; i < subQueue.length; i++) {
                        arm = subQueue.pop();
                    }
                    delete queue[keyName];
                }
            }
        }
    }
}