module res{
    export var log;
    export var debug;
    export var info;
    export var warn;
    export var error;

    if(egret.MainContext.runtimeType == egret.MainContext.RUNTIME_HTML5){
        log = console.log.bind(console);
        debug = console.debug.bind(console);
        info = console.info.bind(console);
        warn = console.warn.bind(console);
        error = console.error.bind(console);
    }
    else{
        log = function(...args:any[]){
            console.log.apply(console, arguments);
        };
        debug = function(...args:any[]){
            console.debug.apply(console, arguments);
        };
        info = function(...args:any[]){
            console.info.apply(console, arguments);
        };
        warn = function(...args:any[]){
            console.warn.apply(console, arguments);
        };
        error = function(...args:any[]){
            console.error.apply(console, arguments);
        };
    }


    export class ResCfgItem{
        public name:string;
        public url:string;
        public type:string;
        public scale9grid:string;
        public cb:()=>void;
        public ctx:any;
        public logEnabled:boolean = true;
    }

    export var _pool:any = {};//资源缓存池
    export var _resCfg:any = {};//资源配置
    export var _aliasCfg:any = {};//资源别名配置
    export var _counter:any = {};//资源加载计数器
    export var _parserDic:any = {};//资源解析器映射库，key为解析器type。
    export var _parserAliasDic:any = {};//资源解析器类型别名映射，key为别名，value为parserType
    export var _defaultLimit:number = 100;//并行加载个数

    export var root:string = "";//资源根路径

    export class ResEvent extends egret.Event{
        static RES_LOADED = "resLoaded";
        resCfgItem:ResCfgItem;
    }
    export var dispatcher = new egret.EventDispatcher();

    export  function setAlias(alias:string, realName:string):void{
        _aliasCfg[alias] = realName;
    }
    export function registerParser(ParserClass, ...alias:string[]){
        var type:string = ParserClass.TYPE;
        if(!egret.Injector.hasMapRule(ResParser, type))
            egret.Injector.mapClass(ResParser, ParserClass, type);
        setParserAlias.apply(res, [type].concat(alias));
    }
    export function setParserAlias(parserType, ...args:string[]){
        var parserAliasDic = _parserAliasDic;
        for(var i = 0, li = args.length; i < li; ++i){
            var alias = args[i].toLocaleLowerCase();
            if(parserAliasDic[alias]) console.warn("资源加载器别名【%s】已经映射了【%s】，将被覆盖成【%s】，请检查！", alias, parserAliasDic[alias], parserType)
            parserAliasDic[alias] = parserType;
        }
    }
    export function getParser(type:string):ResParser{
        return egret.Injector.getInstance(ResParser,type);
    }

    /**
     * 加载资源配置。
     * @param url   可以是：
     *      {string} 配置文件路径
     *      {object} 资源配置数据
     */
    export function loadResCfg(url:any):void{}
    /**
     * 加载资源组配置。
     * @param url   可以是：
     *      {string} 配置文件路径
     *      {object} 资源组配置数据
     */
    export function loadGroupCfg(url:any):void{}
    /**
     * 加载资源别名配置。
     * @param url   可以是：
     *      {string} 配置文件路径
     *      {object} 资源别名配置数据
     */
    export function loadAliasCfg(url:any):void{}

    /**
     * 获取已经缓存了的资源。
     * @param name {string} : 资源的名称
     */
    export function getRes(name:string):any{
        if(name == null) return null;
        var pool = _pool;
        var data = pool[name];
        if(!data){
            name = _aliasCfg[name] || name;
            data =  pool[name];
        }
        if(!data){
            var index:number = name.indexOf("#");
            if(index > 0){//纹理集模式
                var sheetName = name.substring(0, index);
                var frameName = name.substring(index+1);
                var sheet = pool[sheetName];
                if(!sheet){
                    console.warn("未加载SpriteSheet【%s】，请检查！", sheetName);
                    return null;
                }else{
                    return sheet.getTexture(frameName);
                }
            }
        }
        return data;
    }
    export function getResAsync(name:string, cb?:(data)=>void, ctx?:any){
        var data = getRes(name);
        if(data){
            process.nextTick(cb, ctx, data);
        }else{
            var resCfgItem = _resCfg[name];
            if(!resCfgItem) throw new Error("未加载名称为【" + name + "】的资源配置项，请检查！");
            loadResCfgItem(resCfgItem, cb, ctx);
        }
    }

    /**
     * 获取有状态的资源。分成三种状态：
     *      1、穿进去的name就是目标资源对象；
     *      2、穿进去的name为已string或者resItemCfg，并且已经预先加载好资源了；
     *      2、穿进去的name为已string或者resItemCfg，但资源还未加载。只有这种情况，是异步的。
     *  如果获取到的资源会空，则不会执行回调。
     * @param name
     * @param cb
     * @param ctx
     * @param ResClass 资源类型。如果有传，则做校验，如果校验不通过，一样不会调用callback。
     */
    export function getStatusRes(name:any, cb:(resData)=>void, ctx:any, ResClass?:any){
        var warnStr = "【%s】对应的资源不是一个【%s】对象，请检查！";
        var ResClassName = ResClass ? (ResClass.__className || (<any>ResClass.prototype).__class__) : "";
        if(name == null){
            warn("为找到【%s】对应的资源！", name);
        }
        else if(typeof name == "string" || name.url != null){
            var resData = res.getRes(name);
            if(resData) {//如果已经预先加载了
                if(ResClass && !(resData instanceof ResClass)) warn(warnStr, name, ResClassName);
                else cb.call(ctx, resData);
            }
            else {
                res.load([name], function(err, results){
                    resData = results[0];
                    if(!resData) warn("为找到【%s】对应的资源！", name);
                    else if(ResClass && !(resData instanceof ResClass)) warn(warnStr, name, ResClassName);
                    else cb.call(ctx, resData);
                });
            }
        }else{
            if(ResClass && !(name instanceof ResClass)) warn(warnStr, name, ResClassName);
            else cb.call(ctx, name);
        }
    }

    export var _shortNameEnabledMap = {};
    export function setShortNameEnabledByType(type:string){
        _shortNameEnabledMap[type] = true;
    }

    export function loadResCfgItem(resCfgItem:any, cb:(data:any, resCfgItem:ResCfgItem)=>void, ctx?:any):void{
        var hasName = true;
        if(typeof resCfgItem == "string"){
            if(!_pool[resCfgItem]){
                var resource = getRes(resCfgItem);
                if(resource) {
                    cb.call(ctx, resource, null);
                    return;
                }
            }
            var item = new ResCfgItem();
            item.name = resCfgItem;
            item.url = resCfgItem;
            resCfgItem = item;
            hasName = false;
        }
        if(!resCfgItem.type){//没有类型
            var extname:string = path.extname(resCfgItem.url);
            var type:string;
            if(extname){//有文件后缀名
                type = _parserAliasDic[extname.substring(1).toLocaleLowerCase()];//通过别名找到
                resCfgItem.type = type;
            }
        }
        if(!resCfgItem.type) throw new Error("资源配置数据未定义类型：\n    url:" + resCfgItem.url);

        if(!resCfgItem.name) {
            resCfgItem.name = resCfgItem.url;//如果没有写name，就用其url作为name
            hasName = false;
        }
        if(!resCfgItem.url || resCfgItem.url.trim() == ""){
            throw new Error("资源配置数据未定义url：\n    url:" + resCfgItem.type + resCfgItem.name);
        }
        if(!hasName && _shortNameEnabledMap[resCfgItem.type]){
            var extname = path.extname(resCfgItem.name);
            resCfgItem.name = path.basename(resCfgItem.name, extname);
        }
        var name:string = resCfgItem.name;
        _resCfg[name] = resCfgItem;
        function func(){
            _counter[name] = (_counter[name]||0)+1;//计数需要在回调才能加
            if(dispatcher.willTrigger(ResEvent.RES_LOADED)){
                var event = new ResEvent(ResEvent.RES_LOADED);
                event.resCfgItem = resCfgItem;
                dispatcher.dispatchEvent(event);
            }
            cb.call(ctx, _pool[name], resCfgItem);
        }
        if(_pool[name]){
            func();
        }else{
            var parser:ResParser = getParser(resCfgItem.type);
            parser.load(resCfgItem, func, null);
        }
    }

    export interface LoadOpt4Res{
        onEnd?:(err:any, results:any[])=>void;//结束时调用的回调
        onEndCtx?:any;//结束时调用的回调的上下文
        onEach?:(data:any, resCfgItem:ResCfgItem)=>void;//每个资源加载完毕时的回调
        onEachCtx?:any;//每个资源加载完毕时的回调的上下文
        limit?:number;//并发限制数
    }
    /**
     * 加载资源。
     * @param resources
     * @param cb
     * @param ctx
     */
    export function load(resources:any[], cb?:(err:any, results:any[])=>void, ctx?:any):void{
        loadWidthOption(resources, {onEnd:cb, onEndCtx:ctx});
    }

    export function unload(resources:any[]):void{
        for(var i = 0, li = resources.length; i < li; ++i){
            var resName:any = resources[i];
            if(typeof resName != "string"){
                resName = resName.name;
            }
            if(_counter[resName]){
                _counter[resName]--;
                if(_counter[resName] == 0){//引用计数都用完了，才真正清空
                    unloadSingleByNameForce(resName);
                }
            }
        }
    }

    export function unloadSingleByNameForce(resource):void{
        delete _pool[resource];
        delete _resCfg[resource];
        for (var alias in _aliasCfg) {
            if(_aliasCfg[alias] == resource) delete _aliasCfg[alias];
        }
    }
    /**
     * 加载资源。
     * @param resources
     * @param opt
     */
    export function loadWidthOption(resources:any[], opt:LoadOpt4Res):void{
        var limit = opt.limit || _defaultLimit;
        async.mapLimit(resources, limit, function(resCfgItem:any, index:number, cb1){
            loadResCfgItem(resCfgItem, function(data:any, resCfgItem:ResCfgItem){
                if(opt.onEach) opt.onEach.call(opt.onEachCtx, data, resCfgItem);
                cb1(null, data);
            }, null);
        }, function(err:any, results:any[]){
            if(opt.onEnd) opt.onEnd.call(opt.onEndCtx, err, results);
            else console.error(err);
        });
    }

    export var _map = {};
    export function getResArr(moduleName):any[]{
        return _map[moduleName] || [];
    }

}