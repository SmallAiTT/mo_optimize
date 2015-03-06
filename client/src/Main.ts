class Main extends egret.DisplayObjectContainer{
    _onAddToStage() {
        super._onAddToStage();
        egret.MainContext.__use_new_draw = false;//关掉连续相同纹理的批处理功能


        egret.Profiler.getInstance().run();
        egret.Profiler.getInstance()._setTxtFontSize(60);

        var self = this, stage = self.stage;
        self.width = stage.stageWidth;
        self.height = stage.stageHeight;

        unit.init();
    }

}


