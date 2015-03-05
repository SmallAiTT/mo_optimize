/**
 * Created by SmallAiTT on 2015/3/4.
 */
module logger{
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

    export function resetByMode(mode){
        if(mode > 1){
            logger.log = function(){};
            logger.debug = function(){};
        }
        if(mode > 2) logger.warn = function(){};
        if(mode > 3) logger.error = function(){};
    }

    export var _MsgDlgClassMap:any = {};
    export var _msgData:any = {};

    //设置提示信息数据type的key值，如果没有设置，则直接取数据的【.type】值
    export var msgTypeKey:any;

    /**
     * 显示提示信息
     * @param msgCode 消息的ID
     * @param args 最后4个分别是确定和取消的回调参数，之前的是要替换的字符串
     */
    export function showMsg(msgCode:any, ...args:any[]):boolean{
        var info = _msgData[msgCode];
        if(info == null) warn(logCode.c_102, msgCode);
        else{
            var type = msgTypeKey == null ? info.type : info[msgTypeKey];
            var MsgDlgClass = _MsgDlgClassMap[type];//获取到MsgDlg类
            args.splice(0, 0, info);
            if(MsgDlgClass){
                MsgDlgClass.show.apply(MsgDlgClass, args);
            }else{
                warn(logCode.c_105, type);
            }
        }
        return false;
    }

    /**
     * 按照类型注册弹出框类
     * @param type
     * @param MsgDlgClass
     */
    export function registerMsgDlg(type:any, MsgDlgClass:any){
        _MsgDlgClassMap[type] = MsgDlgClass;
    }

    /**
     * 设置提示消息数据
     * @param data
     */
    export function setMsgData(data:any){
        _msgData = data;
    }
}