module mo {
    class _DataControllerApi{
        _changed:boolean;
        __baseInited:boolean;
        __registers:Function[];
        __registerTargets:any[];
        __registersForKey:any;
        _initBase(){
            var self = this;
            if(self.__baseInited){
                return;
            }
            if(!self.__registers){
                self.__registers = [];
            }
            if(!self.__registerTargets){
                self.__registerTargets = [];
            }
            if(!self.__registersForKey){
                self.__registersForKey = {};
            }
            self.__baseInited = true;
        }
        public register(selector:Function, target?:any):any{
            var clazz = this;
            clazz._initBase();
            var registers = clazz.__registers;
            var registerTargets = clazz.__registerTargets;
            for(var i = 0, li = registers.length; i < li; ++i){
                if(registers[i] == selector && (target == registerTargets[i])){
                    return;
                }
            }
            registers.push(selector);
            registerTargets.push(target);
        }
        public registerByKey(key:string, selector:Function, target?:any){
            this._initBase();
            var registersForKey = this.__registersForKey;
            if(!registersForKey[key]){
                registersForKey[key] = {registers : [], registerTargets : []};
            }
            var registers = registersForKey[key].registers;
            var registerTargets = registersForKey[key].registerTargets;
            for(var i = 0, li = registers.length; i < li; ++i){
                if(registers[i] == selector && (target == registerTargets[i])){
                    return;
                }
            }
            registers.push(selector);
            registerTargets.push(target);
        }
        public unregister(selector:Function, target?:any){
            var self = this;
            if(!self.__baseInited){
                return;
            }
            var registers = self.__registers;
            var registerTargets = self.__registerTargets;
            for(var i = 0, li = registers.length; i < li; i++){
                if(registers[i] == selector && (!target || target == registerTargets[i])){
                    registers[i] = null;
                    registerTargets[i] = null;
                    mo.DataController._pushResetTarget(self);
                }
            }
        }
        public unregisterByKey(key:string, selector:Function, target?:any){
            var self = this;
            if(!self.__baseInited){
                return;
            }
            var registersForKey = self.__registersForKey;
            var info = registersForKey[key];
            if(!info) return;
            var registers = info.registers;
            var registerTargets = info.registerTargets;
            for(var i = 0; i < registers.length; ++i){
                if(registers[i] == selector && (!target || target == registerTargets[i])){
                    registers[i] = null;
                    registerTargets[i] = null;
                    mo.DataController._pushResetTarget(self);
                }
            }
        }
        public unregisterAll(){
            var self = this;
            self.__registers.length = 0;
            self.__registerTargets.length = 0;
            var map = self.__registersForKey;
            for(var key in map){
                delete map[key];
            }
            self._changed = false;
        }
    }

    export class DataController extends mo_evt.EventDispatcher{
        static __className:string = "DataController";

        static ON_RESET:string = "onReset";

        public resModuleName:string;

        _data:any;//数据
        DATA_KEY:any;//数据KEY常量
        _keyChangedMap:any;
        _customArgMap:any;//自定义参数保存

        _autoNotify:boolean;//是否自动通知，默认为false

        _initProp():void{
            var self = this;
            self._keyChangedMap = {};
            self._customArgMap = {};
            self._autoNotify = true;
            self._changed = false;

            self._initBase();
        }
        constructor(){
            super();
            _startScheduler4DataController();
        }

        public reset(...args:any[]){
            this.init.apply(this, arguments);
            this.pushNotify(this.__class.ON_RESET);
        }

        public dtor(){
            var self = this;
            super.dtor();
            self.setAutoNotify(false);
            self.unregisterAll();
            if(self.resModuleName != null){
//                mo.resMgr.exitModule();//TODO
                self.resModuleName = null;
            }
            (<any>self)._eventTarget = null;
        }

        public init(...args:any[]){
            this._data = args[0];
            this.setAutoNotify(true);
        }

        public setAutoNotify(isAuto:boolean){
            if (this._autoNotify == isAuto) return;
            this._autoNotify = isAuto;
        }

        public isAutoNotify():boolean{
            return this._autoNotify;
        }

        _notifyArr(selectors:Function[], targets:any[], args:any[]){
            if(!selectors)
                return;
            for(var i = 0, li = selectors.length; i < li; ++i){
                if(selectors[i]) selectors[i].apply(targets[i], args);
            }
            // 清理已经unregister的监听
            for(var i = 0; i < selectors.length; ){
                if(!selectors[i]){
                    selectors.splice(i, 1);
                    targets.splice(i, 1);
                }else{
                    ++i;
                }
            }
        }

        _setChanged(key:any){
            var self = this;
            self._changed = true;
            var eventName = "*";
            if(key != null){
                self._keyChangedMap[key] = true;
                eventName = key;
            }
            if(self._autoNotify) mo.DataController._pushInv(self, eventName);
        }
        public get(key:any):any{
            return this._data[key];
        }
        public set(key:any, value:any){
            if(typeof value != "object" && value == this._data[key]){
                return;
            }
            this._setChanged(key);
            this._data[key] = value;
        }

        public add(key:any, value:any){
            var oldValue = this.get(key) || 0;
            this.set(key, oldValue + value);
        }

        public getData():any{
            return this._data;
        }

        _cloneObj(obj):any{
            var result = {};
            for (var key in obj) {
                result[key] = obj[key];
            }
            return result;
        }

        public pushNotify(key:any, value?:any, ...args:any[]){
            var arr = Array.prototype.slice.apply(arguments);
            key = arr[0];
            arr.splice(0, 1);
            this._customArgMap[key] = arr;
            this._setChanged(key);
        }

        public pushNotifyAtOnce(eventName:any, value:any, ...args:any[]){
            var self = this, clazz = self.__class;
            var arr = Array.prototype.slice.apply(arguments);
            eventName = arr[0];
            arr.splice(0, 1);
            var customArgMap = {};
            customArgMap[eventName] = arr;
            self._notifyEvent(eventName, self.__registersForKey, customArgMap);
            self._notifyEvent(eventName, clazz.__registersForKey, customArgMap);
        }

        public _notifyEvent(eventName:any, registersForKey, customArgMap){
            if(!registersForKey)
                return;
            var self = this;
            var map:any = registersForKey[eventName];
            if(map && map.registers && map.registers.length > 0){
                var args = customArgMap[eventName];
                args = (args == null && self._data != null) ? [self._data[eventName]] : args;
                args = args || [];
                args.push(self);
                self._notifyArr(map.registers, map.registerTargets, args);
            }
        }

        public notifyEvent(eventName:any) {
            var self = this, clazz = self.__class;
            if(self._changed){
                var keyChangeMap = self._keyChangedMap;
                var customArgMap = self._customArgMap;
                delete keyChangeMap[eventName];//从对象中移除
                self._notifyEvent(eventName, self.__registersForKey, customArgMap);
                self._notifyEvent(eventName, clazz.__registersForKey, customArgMap);
                var keys = Object.keys(keyChangeMap);
                if(!keys || keys.length == 0){
                    self._changed = false;
                    self._notifyArr(self.__registers, self.__registerTargets, [null, self]);//通知全属性变化事件（实例注册级别）
                    self._notifyArr(clazz.__registers, clazz.__registerTargets, [null, self]);//通知全属性变化事件（类注册级别）
                }
            }
        }

        public notifyAll(){
            var self = this;
            var keyChangeMap = self._cloneObj(self._keyChangedMap);
            for (var eventName in keyChangeMap) {
                self.notifyEvent(eventName);
            }
        }


        _changed:boolean;
        __baseInited:boolean;
        __registers:Function[];
        __registerTargets:any[];
        __registersForKey:any;
        _initBase(){
            _DataControllerApi.prototype._initBase.apply(this, arguments);
        }
        public register(selector:Function, target?:any):any{
            _DataControllerApi.prototype.register.apply(this, arguments);
        }
        public registerByKey(key:any, selector:Function, target?:any){
            _DataControllerApi.prototype.registerByKey.apply(this, arguments);
        }
        public unregister(selector:Function, target?:any){
            _DataControllerApi.prototype.unregister.apply(this, arguments);
        }

        public unregisterByKey(key:any, selector:Function, target?:any){
            _DataControllerApi.prototype.unregisterByKey.apply(this, arguments);
        }
        public unregisterAll(){
            _DataControllerApi.prototype.unregisterAll.apply(this, arguments);
        }




        static _changed:boolean;
        static __baseInited:boolean;
        static __registers:Function[];
        static __registerTargets:any[];
        static __registersForKey:any;
        static _initBase(){
            _DataControllerApi.prototype._initBase.apply(this, arguments);
        }
        public static register(selector:Function, target?:any):any{
            _DataControllerApi.prototype.register.apply(this, arguments);
        }
        public static registerByKey(key:any, selector:Function, target?:any){
            _DataControllerApi.prototype.registerByKey.apply(this, arguments);
        }
        public static unregister(selector:Function, target?:any){
            _DataControllerApi.prototype.unregister.apply(this, arguments);
        }

        public static unregisterByKey(key:any, selector:Function, target?:any){
            _DataControllerApi.prototype.unregisterByKey.apply(this, arguments);
        }
        public static unregisterAll(){
            _DataControllerApi.prototype.unregisterAll.apply(this, arguments);
        }

        public static registerTargetByKey(key:any, listener:Function, target:any){
            var clazz = this;
            var eventStoreForClass = target._eventStoreForClass = target._eventStoreForClass || [];
            for(var i = 0, li = eventStoreForClass.length; i < li; i++){
                var info = eventStoreForClass[i];
                if(clazz == info[0] && key == info[1] && listener == info[2]) return;
            }
            eventStoreForClass.push([clazz, key, listener]);
            clazz.registerByKey(key, listener, target);
        }


        static _registerQueue:any[] = [];
        static _pushInv(target, eventName){
            var queue = mo.DataController._registerQueue;
            for(var i = 0; i < queue.length; i++){
                var info = queue[i];
                if(info.target == target && eventName == info.eventName) return;//已经存在直接返回
            }
            queue.push({target:target, eventName:eventName});
        }

        static _resetList:any[] = [];
        static _pushResetTarget(target){
            var list = this._resetList;
            if(list.indexOf(target) < 0) list.push(target);
        }
    }

    var _isScheduler4DataControllerStarted:boolean = false;
    var _startScheduler4DataController = function(){
        if(_isScheduler4DataControllerStarted) return;
        _isScheduler4DataControllerStarted = true;//这个一定要放在前面
        mo.tick(function(){
            var resetList = mo.DataController._resetList;
            while(resetList.length){
                var obj = resetList.pop();
                mo_arr.resetArr(obj.__registers);
                mo_arr.resetArr(obj.__registerTargets);
                var registersForKey = obj.__registersForKey;
                for (var key in registersForKey) {
                    var info = registersForKey[key];
                    if(!info) return;
                    mo_arr.resetArr(info.registers);
                    mo_arr.resetArr(info.registerTargets);
                }
            }
            var arr = mo.DataController._registerQueue;
            while(arr.length > 0){
                var info = arr.shift();
                if(info.eventName == "*") info.target.notifyAll();
                else info.target.notifyEvent(info.eventName);
            }
        }, mo.DataController);

    };

}