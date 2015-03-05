module mo_evt{
    export var actionDispatcher = new egret.EventDispatcher();
    export var visibleDispatcher = new egret.EventDispatcher();
    export var invisibleDispatcher = new egret.EventDispatcher();
    export var exitDispatcher = new egret.EventDispatcher();
    export var enterDispatcher = new egret.EventDispatcher();
    export var clickDispatcher = new egret.EventDispatcher();
    export var cellClickDispatcher = new egret.EventDispatcher();
    export var widgetCtrlClickDispatcher = new egret.EventDispatcher();
}