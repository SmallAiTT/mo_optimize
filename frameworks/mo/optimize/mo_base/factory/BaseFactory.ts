//缓冲池的基类

module mo_base{
    export class BaseFactory extends mo_base.Class{
        static __className:string = "BaseFactory";


        _queue:any;
        _createCount:number;
        _productClass:any;

        //@override
        _initProp(){
            super._initProp();
            var self = this;
            self._queue = [];
            self._createCount = 3;
        }

        public produce(...args:any[]):any{
            var product =  this._produce.apply(this, arguments);
            product.reset();
            product.isReclaimed = false;
            return product;
        }

        public produce4Recycle(...args:any[]){
            var product = this.produce.apply(this, arguments);
            product.isAutoDtor = false;
            return product;
        }

        public produceDynamic(...args:any[]):any{
            var product = this._produceDynamic.apply(this, arguments);
            product.reset();
            product.isReclaimed = false;
            return product;
        }

        public produceDynamic4Recycle(...args:any[]){
            var product = this.produceDynamic.apply(this, arguments);
            product.isAutoDtor = false;
            return product;
        }

        _produce(...args:any[]):any{
            var self = this, product;
            if (self._queue.length > 0) {
                product = self._queue.shift();
            }
            else {
                product = self._productClass.create.apply(self._productClass, arguments);
                product.setFactory(self);
            }
            return product;
        }

        _produceDynamic(...args:any[]):any{
            var self = this, product;
            if (self._queue.length > 0) {
                product = self._queue.shift();
                if(arguments.length > 1){
                    arguments[arguments.length - 1](product);
                }
            }
            else {
                product = self._productClass.createDynamic.apply(self._productClass, arguments);
                product.setFactory(self);
            }
            return product;
        }

        reclaim(node:any){
            var self = this;
            //如果已经回收了就直接返回
            //如果是自动释放，就认为不能回收
            //如果node对应的factory并不是当前的factory则直接返回
            if(node.isReclaimed || node.isAutoDtor || node.getFactory() != self){
                return;
            }
            var queue = self._queue;
            queue.push(node);
            node.reset();
            node.isReclaimed = true;
        }

        releaseAllProducts():void{
            var queue = this._queue, node;
            for (var i = 0; i < queue.length; i++) {
                node = queue.pop();
                node.doDtor();
            }
        }

        releaseProduct(product:any){
            var queue = this._queue;
            for (var i = 0; i < queue.length; ) {
                if(product == queue[i]){
                    queue.splice(i, 1);//移除
                    product.doDtor();//是否
                }else{
                    i++;
                }
            }
        }

        dtor(){
            super.dtor();
            this.releaseAllProducts();
        }

    }
}
