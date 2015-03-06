module mo_evt{
    export var actionDispatcher = new egret.evt.EventDispatcher();
    export var visibleDispatcher = new egret.evt.EventDispatcher();
    export var invisibleDispatcher = new egret.evt.EventDispatcher();
    export var exitDispatcher = new egret.evt.EventDispatcher();
    export var enterDispatcher = new egret.evt.EventDispatcher();
    export var clickDispatcher = new egret.evt.EventDispatcher();
    export var cellClickDispatcher = new egret.evt.EventDispatcher();
    export var widgetCtrlClickDispatcher = new egret.evt.EventDispatcher();
}