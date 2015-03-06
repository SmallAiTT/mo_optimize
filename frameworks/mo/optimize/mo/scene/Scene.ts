module mo{
    export class Scene extends Node{
        static __className:string = "Scene";

        topTray:TopTray;//顶层托盘
        loadingTray:LoadingTray;//loading托盘
        guideTray:GuideTray;//引导托盘
        msgTray:MsgTray;//提示信息托盘
        dlgTray:DlgTray;//弹出框托盘
        menuTray:MenuTray;//菜单托盘
        displayTray:DisplayTray;//内容展示托盘


        //@override
        _initProp(){
            super._initProp();
            var self = this;

            self._trayStackToHide = [];

            self.anchorX = 0;
            self.anchorY = 0;
            self.isAutoDtor = false;//都设置成不自动释放
            var stage:egret.Stage = getStage();
            self._setWidth(stage.stageWidth);
            self._setHeight(stage.stageHeight);

            //显示层
            self.displayTray = new DisplayTray();
            self.addChild(self.displayTray);

            //菜单层
            self.menuTray = new MenuTray();
            self.addChild(self.menuTray);

            //弹窗层
            self.dlgTray = new DlgTray();
            self.addChild(self.dlgTray);

            //消息层
            self.msgTray = new MsgTray();
            self.addChild(self.msgTray);

            //引导层
            self.guideTray = new GuideTray();
            self.addChild(self.guideTray);

            //加载层
            self.loadingTray = new LoadingTray();
            self.addChild(self.loadingTray);

            //顶层
            self.topTray = new TopTray();
            self.addChild(self.topTray);
        }

        show(...args:any[]){

        }

        _trayStackToHide:Tray[][];
        hideTraysUnder(tray:Tray){
            var children = this._children, li = children.length;
            var arr = [];
            for(var i = 0; i < li; ++i){
                var child = children[i];
                if(child == tray){//相等是就退出
                    break;
                }
                if(child.visible){//可见时才进行推送入栈
                    arr.push(child);
                    child.visible = false;//设置成不可见
                    mo_evt.dispatchEvent([
                        [mo_evt.invisibleDispatcher, (<Node>child).__className],
                        [child, gEventType.invisible]
                    ], (<Layer>child)._onHide, child);
                    mo.dispatchLayerInvisible(<Node>child);
                }
            }
            this._trayStackToHide.push(arr);
        }
        recoverTrays(){
            var arr:Tray[] = this._trayStackToHide.pop();
            if(arr){
                for(var i = 0; i < arr.length; ++i){
                    var tray = arr[i];
                    tray.visible = true;
                    mo_evt.dispatchEvent([
                        [mo_evt.visibleDispatcher, tray.__className],
                        [tray, gEventType.visible]
                    ], tray._onShowReady, tray);
                    mo.dispatchLayerVisible(arr[i]);
                }
            }
        }

        dtor(){
            super.dtor();
            var self = this;

            self.removeChildren();

            self._trayStackToHide = null;
            self.displayTray = null;
            self.menuTray = null;
            self.dlgTray = null;
            self.msgTray = null;
            self.guideTray = null;
            self.loadingTray = null;
            self.topTray = null;
        }

        static preload(cb?:Function, ...args:any[]) {
            cb();
        }
    }


    export function dispatchLayerVisible(parent:Node){
        var children = parent.getChildren();
        for(var i = 0; i < children.length; ++i){
            var child = children[i];
            if(child && !child.visible && child instanceof mo.Layer){
                mo_evt.dispatchEvent([
                    [mo_evt.visibleDispatcher, (<Layer>child).__className],
                    [child, gEventType.visible]
                ], (<Layer>child)._onShowReady, child);
                mo.dispatchLayerVisible(<Node>child);
            }
        }
    }
    export function dispatchLayerInvisible(parent:Node){
        var children = parent.getChildren();
        for(var i = 0; i < children.length; ++i){
            var child = children[i];
            if(child && child.visible && child instanceof mo.Layer){
                mo_evt.dispatchEvent([
                    [mo_evt.invisibleDispatcher, (<Node>child).__className],
                    [child, gEventType.invisible]
                ], (<Layer>child)._onHide, child);
                mo.dispatchLayerInvisible(<Node>child);
            }
        }
    }
}