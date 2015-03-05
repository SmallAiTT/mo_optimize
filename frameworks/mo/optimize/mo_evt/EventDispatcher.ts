/**
 * Created by SmallAiTT on 2015/3/4.
 */
module mo_evt{
    export class EventDispatcher extends egret.EventDispatcher{
        public static __className:string = "EventDispatcher";//通过className，可以方便程序许多操作

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

        public static create(...args:any[]):EventDispatcher{
            return mo_base.Class.create.apply(this, arguments);
        }
        public static createDynamic(...args:any[]):EventDispatcher{
            return mo_base.Class.createDynamic.apply(this, arguments);
        }
        public static getInstance(...args:any[]):EventDispatcher{
            return mo_base.Class.getInstance.apply(this, arguments);
        }
        public static purgeInstance(...args:any[]):EventDispatcher{
            return mo_base.Class.purgeInstance.apply(this, arguments);
        }
    }
}