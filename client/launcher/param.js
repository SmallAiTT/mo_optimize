var global = global || {};
(function(){
    var scripts = document.getElementsByTagName("script");
    var currentScript = scripts[scripts.length - 1];
    global.testMode = currentScript.getAttribute("testMode");

    function parseParam(){
        var gProject = global["project"] = {};
        var src = window.location.href;
        var index = src.indexOf("?");
        if(index > 0){
            var str = src.substring(index + 1);
            console.log(str);
            var arr = str.split("&");
            for (var i = 0, l_i = arr.length; i < l_i; i++) {
                var paramStr = arr[i];
                var param = paramStr.split("=");
                var pKey = param[0], pValue = param[1];
                if(pValue.match(/(^\d+$)/)){
                    pValue = parseInt(pValue);
                }else if(pValue.match(/(^\d+.\d+$)/)){
                    pValue = parseFloat(pValue);
                }
                gProject[pKey] = pValue;
            }
        }
    }
    parseParam();
})();