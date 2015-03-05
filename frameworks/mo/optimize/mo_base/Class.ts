module mo_base{
    export class Class extends egret.HashObject{
        public static __className:string = "Class";//通过className，可以方便程序许多操作

        __className:string;//通过create方法进行赋值
        __class:any;//实例对应的类

        _isInstance:boolean;
        _hasDtored:boolean;

        _initProp():void{
            var self = this;
            self._isInstance = false;
            self._hasDtored = false;
        }
        constructor(){
            super();
            var self = this;
            this.__class = this["constructor"];
            self.__className = self.__class.__className;
            self._initProp();
            self._init();
        }

        public init(...args:any[]){
        }

        public _init(...args:any[]){
            var self = this;
        }

        doDtor(){
            var self = this;
            if(self._hasDtored) return;
            self._hasDtored = true;
            self.dtor();
        }

        dtor(){
        }


        public static create(...args:any[]):any{
            var Class:any = this;
            var obj:any = new Class();
            if(obj.init) obj.init.apply(obj, arguments);
            return obj;
        }
        public static createDynamic(...args:any[]):any{
            var Class:any = this;
            var obj:any = new Class();
            if(obj.initDynamic) obj.initDynamic.apply(obj, arguments);
            return obj;
        }
        public static getInstance(...args:any[]):any{
            var Class:any = this;
            if(!Class._instance){
                var instance:any = Class._instance = Class.create.apply(Class, arguments);
                instance._isInstance = true;
            }
            return Class._instance;
        }
        public static purgeInstance(...args:any[]):any{
            var Class:any = this;
            var instance:any = Class._instance;
            if(instance){
                if(instance.doDtor) instance.doDtor();
                Class._instance = null;
            }
        }
    }
}