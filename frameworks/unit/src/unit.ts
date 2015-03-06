module unit{

    export var curRegisterModule:string = "unit";
    export var menuMap = {
    };

    export var stage:egret.Stage;
    export var testContainer:egret.DisplayObjectContainer;
    export var testTitle:egret.TextField;
    export var testButton:egret.TextField;
    export var testMenu:Menu;
    export var subTestMenu:SubMenu;

    export function init(){

        //init_egret();
        //init_mo();
        //init_game();

        stage = egret.MainContext.instance.stage;
        stage.removeChildren();
        var sW = stage.stageWidth, sH = stage.stageHeight;
        testContainer = new egret.DisplayObjectContainer();
        testContainer.width = sW;
        testContainer.height = sH;
        stage.addChild(testContainer);

        testTitle = new egret.TextField();
        testTitle.size = 80;
        testTitle.anchorX = 0.5;
        testTitle.x = sW/2;
        stage.addChild(testTitle);

        testButton = new egret.TextField();
        testButton.size = 80;
        testButton.text = "撸";
        testButton.anchorX = 1;
        testButton.anchorY = 0.5;
        testButton.touchEnabled = true;
        testButton.x = sW;
        testButton.y = sH/2;
        stage.addChild(testButton);
        testButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
            testContainer.visible = false;
            testMenu.visible = true;
            subTestMenu.visible = false;
        }, this);

        //menu创建
        testMenu = new Menu();
        testMenu.visible = false;//先设置成不可见
        stage.addChild(testMenu);
        testMenu.setMenus(menuMap);

        //menu创建
        subTestMenu = new SubMenu();
        subTestMenu.visible = false;//先设置成不可见
        stage.addChild(subTestMenu);
    }

    export class Menu extends egret.DisplayObjectContainer{
        constructor(){
            super();
            var sW = stage.stageWidth, sH = stage.stageHeight;
            this.width = sW;
            this.height = sH;
        }
        setMenus(menuMap){
            var self = this;
            self.removeChildren();
            var width = self.width, height = self.height;
            var beginX = 400, beginY = 100, btnW = 300, btnH = 160;
            var xTotal = beginX, yTotal = beginY;
            var row = 0;
            for (var key in menuMap) {
                var buttonInfo = menuMap[key];
                var text = key;
                var btn = new egret.TextField();
                btn.text = text;
                btn.size = 100;
                btn.touchEnabled = true;
                btn.x = xTotal;
                btn.y = yTotal;
                self.addChild(btn);
                if(xTotal + btnW + btnW > width){
                    xTotal = beginX;
                    row++;
                    yTotal += btnH;
                }else{
                    xTotal += btnW;
                }
                btn.addEventListener(egret.TouchEvent.TOUCH_TAP, function(){
                    var info:any = this;
                    self.visible = false;
                    subTestMenu.visible = true;
                    subTestMenu.setButtons(info.buttonInfo);
                }, {buttonInfo:buttonInfo});
            }
        }
    }

    export class SubMenu extends egret.DisplayObjectContainer{
        constructor(){
            super();
            var sW = stage.stageWidth, sH = stage.stageHeight;
            this.width = sW;
            this.height = sH;
        }
        setButtons(buttonInfoArr){
            var self = this;
            self.removeChildren();
            subTestMenu.visible = true;
            var width = self.width, height = self.height;
            var beginX = 400, beginY = 100, btnW = 400, btnH = 100;
            var xTotal = beginX, yTotal = beginY;
            var row = 0;
            for (var i = 0, l_i = buttonInfoArr.length; i < l_i; i++) {
                var buttonInfo = buttonInfoArr[i];
                var text = buttonInfo.text;
                var btn = new egret.TextField();
                btn.text = text;
                btn.size = 60;
                btn.touchEnabled = true;
                btn.x = xTotal;
                btn.y = yTotal;
                self.addChild(btn);
                if(xTotal + btnW + btnW > width){
                    xTotal = beginX;
                    row++;
                    yTotal += btnH;
                }else{
                    xTotal += btnW;
                }
                btn.addEventListener(egret.TouchEvent.TOUCH_TAP, onTestBtnClick, buttonInfo);
            }
        }
    }


    var _curUnloadFn:()=>void = null;
    var _curUnLoadFnCtx:any = null;
    var _curParam:any = null;
    export function splitLine(name){
        console.debug("------------------", name, "------------------");
    }
    export function registerTestBtn(
        name:string,
        click:(param:any)=>void,
        unload?:(param:any)=>void,
        ctx?:any
    ){
        var cfg = {text:name, cb:click, unload:unload, ctx:ctx};
        var arr = menuMap[curRegisterModule];
        if(!arr){
            arr = menuMap[curRegisterModule] = [];
        }
        arr.push(cfg);
    }

    export var resRoot:string = "resource";
    export function resetStage(){
        res.root = resRoot;//重置资源根路径
        //TODO
        //mo.timer.clear();//清除所有timer注册的invocation
        //mo.clearAllTimeout();//清除所有的timeout
        testContainer.removeChildren();
    }
    export function onTestBtnClick():boolean{
        resetStage();
        testContainer.visible = true;
        testMenu.visible = false;
        subTestMenu.visible = false;
        if(_curUnloadFn) _curUnloadFn.call(_curUnLoadFnCtx, _curParam);
        var cfg:any = this;
        splitLine(cfg.text);
        testTitle.text = cfg.text;
        _curUnloadFn = cfg.unload;
        _curUnLoadFnCtx = cfg.ctx;
        _curParam = {};
        cfg.cb.call(cfg.ctx, _curParam);
        return false;
    }
}