/**
 * Created by SmallAiTT on 2015/3/4.
 */
module mo_base{

    /**
     * 遍历对象或者数组。
     * @param obj
     * @param iterator
     * @param context
     */
    export function each(obj, iterator:(value:any, index?:any)=>any, context?:any){
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

    /**
     * 格式化参数成String。
     * 参数和h5的console.log保持一致。
     * @returns {*}
     */
    export function formatStr(...args:any[]):string{
        var l = args.length;
        if(l < 1){
            return "";
        }
        var str = args[0];
        var needToFormat = true;
        if(typeof str == "object"){
            str = JSON.stringify(str);
            needToFormat = false;
        }
        var count = 1;
        if(needToFormat){
            return str.replace(/(%d)|(%i)|(%s)|(%f)|(%o)/g, function(world){
                if(args.length <= count) return world;
                var value = args[count++];
                if(world == "%d" || world == "%i"){
                    return parseInt(value);
                }else{
                    return value;
                }
            });
        }else{
            for(var i = 1; i < l; ++i){
                var arg = args[i];
                arg = typeof arg == "object" ? JSON.stringify(arg) : arg;
                str += "    " + arg;
            }
            return str;
        }
    }

    var _tempStrRegExp = /\$\{[^\s\{\}]*\}/g;

    export function formatPlaceholder(tempStr, map){
        function change(word){
            var key = word.substring(2, word.length - 1)
            var value = map[key];
            if(value == null) {
                console.error("formatTempStr时，map中缺少变量【%s】的设置，请检查！", key);
                return word;
            }
            return value;
        }
        return tempStr.replace(_tempStrRegExp, change);
    }


    export var __ipCfgName:string = "";
    export var __areaId:string = "";
    export function _getLocalStorageKeyPre(key, withoutAreaPrefix){
        withoutAreaPrefix = withoutAreaPrefix || false;
        return formatStr("%s_%s_%s", __ipCfgName, (withoutAreaPrefix ? "" : __areaId), key)
    }
    /**
     * localStorage api的进一步封装。
     * @param key
     * @param value
     */
    export function setLocalStorageItem(key, value, withoutAreaPrefix?:boolean){
        var realKey = _getLocalStorageKeyPre(key, withoutAreaPrefix);
        value = JSON.stringify(value);
        egret.localStorage.setItem(realKey, value);
    }
    /**
     * localStorage api的进一步封装。
     * @param key
     * @returns {*}
     */
    export function getLocalStorageItem(key, withoutAreaPrefix?:boolean):any{
        var realKey = _getLocalStorageKeyPre(key, withoutAreaPrefix);
        var value = egret.localStorage.getItem(realKey);
        try{
            return JSON.parse(value);
        }catch(e){
            return value;
        }
    }
    /**
     * localStorage api的进一步封装。
     * @param key
     * @returns {*}
     */
    export function removeLocalStorageItem(key, withoutAreaPrefix){
        var realKey = _getLocalStorageKeyPre(key, withoutAreaPrefix);
        egret.localStorage.removeItem(realKey);
    }
}