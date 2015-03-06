module res{
    export class ResMgr extends egret.evt.EventDispatcher{
        public static __className:string = "ResMgr";//为了跟cocos方案保持一致所写

        __className:string;//通过create方法进行赋值
        __class:any;//实例对应的类

        static GLOBAL:string = "global";

        _pool:any;
        _currentModuleName:string;//当前模块名称
        _moduleNameStack:string[];//模块名称栈
        _releaseModuleName:string;//正等待释放的模块名称
        _loadToGlobalCount:number;//是否加载到全局中

        _initProp():void{
            var self = this;
            self._pool = {};
            self._currentModuleName = self.__class.GLOBAL;
            self._moduleNameStack = [];
            self._loadToGlobalCount = 0;
        }
        public _init(...args:any[]){
            var self = this;
            dispatcher.addEventListener(ResEvent.RES_LOADED, self._onResLoaded, self);
        }
        constructor(){
            super();
            var self = this;
            this.__class = this["constructor"];
            self.__className = self.__class.__className;
            self._initProp();
            self._init();
        }
        _onResLoaded(event:ResEvent){
            var self = this;
            var resCfgItem:ResCfgItem = event.resCfgItem;
            var resName = resCfgItem.name;
            var moduleName = self._loadToGlobalCount > 0 ? self.__class.GLOBAL : self._currentModuleName;
            var map = self._pool[moduleName];
            if(!map){
                map = self._pool[moduleName] = {};
            }
            map[resName] = (map[resName] || 0) + 1;

        }

        runModule(moduleName){
            var self = this;
            if(self._currentModuleName == self.__class.GLOBAL && self._moduleNameStack.length == 0){
                //这个证明模块内容都为空，这时候，要保存GLOBAL
                self._moduleNameStack.push(self._currentModuleName);
            }
            if(self._releaseModuleName){//如果存在则先进行释放
                self.releaseModule();
            }
            if(self._currentModuleName != self.__class.GLOBAL){//不是全局的才进行release的设置
                self._releaseModuleName = self._currentModuleName;
            }
            self._currentModuleName = moduleName;
        }

        pushModule(moduleName){
            var self = this;
            self._moduleNameStack.push(self._currentModuleName);
            self._currentModuleName = moduleName;
        }

        popModule(moduleName):void{
            var self = this;
            if(self._currentModuleName == self.__class.GLOBAL && self._moduleNameStack.length == 0){
                //如果说当前的是GLOBAL并且已经到达栈底了，则直接返回
                return;
            }
            if(self._releaseModuleName){//如果存在则先进行释放
                self.releaseModule();
            }
            self._releaseModuleName = self._currentModuleName;
            self._currentModuleName = self._moduleNameStack.pop();
        }

        releaseModule():void{
            var self = this;
            if(!self._releaseModuleName) return;//不需要释放
            var map = self._pool[self._releaseModuleName] || {};
            delete self._pool[self._releaseModuleName];
            self._releaseModuleName = null;
            var arr = [];
            for (var resName in map) {
                var count:number = map[resName];
                var total = res._counter[resName];
                if(!total) continue;//没有计数则继续
                res._counter[resName] -= (count-1);//不全部扣除，而是留了1
                if(res._counter[resName] <= 0){
                    res._counter[resName] = 1;//这时候故意给他1，用于下面真正进行释放
                }
                arr.push(resName);
                delete map[resName];
            }
            res.unload(arr);
        }

        loadToGolabel(resources:any[], cb:Function, ctx?:any){
            var self = this;
            self._loadToGlobalCount++;
            res.load(resources, function(){
                self._loadToGlobalCount--;
                cb.call(ctx);
            })
        }
    }

    export var mgr:ResMgr = new ResMgr();
}