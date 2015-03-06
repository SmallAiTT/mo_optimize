module mo_opt{
    //注意，由于loadingBar属性比较多，所以不继承_UIWidgetOption
    export class _UILoadingBarOption extends mo_opt.Option{
        barType:number;
        percent:number;
        texture:egret.Texture;

        queueBaseNumber:any;
        queueBaseNumberSum:any;
        actionQueueRunning:any;
        curValue:any;
        totalValue:any;
        switchMode:any;
        curBaseNumIndex:any;

        // 动态进度条相关变量
        diffValue:any;
        curTargetValue:any;
        finalCurValue:any;
        finalTotalValue:any;
        finalTargetValue:any;

        //进度条基数跳变监听
        runActionQueueCb:any;
        runActionQueueCbTarget:any;
        //进度掉停止走动的监听
        stopActionCb:any;
        stopActionCbTarget:any;
        //进度条走动时的监听
        runningActionCb:any;
        runningActionCbTarget:any;
        lightWidget:mo_ui.UIImage;
        innerLabel:mo_ui.UIText;

        //@override
        _initProp():void{
            super._initProp();
            var self = this;
            self.barType = mo_ui.consts.LoadingBarType.LEFT;
            self.percent = 100;
        }

        dtor(){
            super.dtor();
            var self = this;
            self.lightWidget = null;
            self.innerLabel = null;
            self.texture = null;
        }
    }
}