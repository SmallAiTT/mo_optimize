/**
 * Created by huanghaiying on 14/12/5.
 */
var console = {};
var window = {};

console.log = function (message) {
    egtlog(message);
}
console.warn = function (message) {
    egtlog(message);
}
console.error = function (message) {
    egtlog(message);
}
console.debug = function (message) {
    egtlog(message);
}
console.timeEnd = function (message) {
    egtlog(message);
}
console.time = function (message) {
    egtlog(message);
}

egret_native.setSearchPaths([""]);

egret_native.requireFiles = function () {
    require("bin-debug/lib/egret_file_list.js");
    require("bin-debug/src/game_file_list.js");
    for (var key in egret_file_list) {
        var src = "libs/" + egret_file_list[key];
        require(src);

    }
    for (var key in game_file_list) {
        var src = "bin-debug/src/" + game_file_list[key];
        require(src);
    }
};

egret_native.egretInit = function () {
    var needCompile = false;
    if (!needCompile) {
        egret_native.requireFiles();
    }
    else {
        require("launcher/game-min-native.js");
    }

    //egret.dom为空实现
    egret.dom = {};
    egret.dom.drawAsCanvas = function () {
    };

    egret.MainContext.type = egret.MainContext.TYPE_NATIVE;
    var context = egret.MainContext.instance;
    context.rendererContext = new egret.NativeRendererContext();
    context.netContext = new egret.NativeNetContext();
    context.touchContext = new egret.NativeTouchContext();
    context.deviceContext = new egret.NativeDeviceContext();

    egret.resolution.StageDelegate.getInstance().setDesignSize(2304, 1536);
    context.stage = new egret.Stage();
    var StageScaleMode = egret.consts.StageScaleMode;
    egret.Stage.registerScaleMode(StageScaleMode.NO_BORDER, new egret.resolution.FixedHeight(), true);
    context.stage.scaleMode = StageScaleMode.NO_BORDER;

    egret.MainContext.instance.rendererContext.texture_scale_factor = 2304/720;

    context.run();
};

egret_native.loadVersion = function (completeCall) {
    var ctr = egret.MainContext.instance.netContext._versionCtr;
    ctr.addEventListener(egret.IOErrorEvent.IO_ERROR, loadError, this);
    ctr.addEventListener(egret.Event.COMPLETE, loadComplete, this);
    ctr.fetchVersion();

    function loadError(e) {
        ctr.removeEventListener(egret.IOErrorEvent.IO_ERROR, loadError, this);
        ctr.removeEventListener(egret.Event.COMPLETE, loadComplete, this);

        console.log("版本控制文件加载失败，请检查");
        completeCall();
    }

    function loadComplete(e) {
        ctr.removeEventListener(egret.IOErrorEvent.IO_ERROR, loadError, this);
        ctr.removeEventListener(egret.Event.COMPLETE, loadComplete, this);

        completeCall();
    }
};

egret_native.egretStart = function () {

//    Object.defineProperty(egret.DisplayObject.prototype, "cacheAsBitmap", {
//        get: function () {
//            return false;
//        },
//        set: function (bool) {
//        },
//        enumerable: true,
//        configurable: true
//    });

    var document_class = "Main";
    var rootClass;
    if (document_class) {
        rootClass = Main;//TODO 注意，这里直接写死了直接写死
    }
    var context = egret.MainContext.instance;
    if (rootClass) {
        var rootContainer = new rootClass();
        if (rootContainer instanceof egret.DisplayObjectContainer) {
            context.stage.addChild(rootContainer);
        }
        else {
            throw new Error("文档类必须是egret.DisplayObjectContainer的子类!");
        }
    }
    else {
        throw new Error("找不到文档类！");
    }
};

egret_native.pauseApp = function () {
    console.log("pauseApp");
    egret_native.Audio.pauseBackgroundMusic();
    egret_native.Audio.pauseAllEffects();
};

egret_native.resumeApp = function () {
    console.log("resumeApp");
    egret_native.Audio.resumeBackgroundMusic();
    egret_native.Audio.resumeAllEffects();
};