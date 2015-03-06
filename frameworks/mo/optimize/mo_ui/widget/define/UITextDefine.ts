module mo_ui.consts {
    export var ALIGN_H_LEFT:string = egret.HorizontalAlign.LEFT;
    export var ALIGN_H_CENTER:string = egret.HorizontalAlign.CENTER;
    export var ALIGN_H_RIGHT:string = egret.HorizontalAlign.RIGHT;

    export var ALIGN_V_TOP:string = egret.VerticalAlign.TOP;
    export var ALIGN_V_MIDDLE:string = egret.VerticalAlign.MIDDLE;
    export var ALIGN_V_BOTTOM:string = egret.VerticalAlign.BOTTOM;

}
module mo_opt{
    export class _UITextOption extends _UIWidgetOption{

        touchScaleEnabled:boolean;
        normalScaleValueX:number;
        normalScaleValueY:number;
        onSelectedScaleOffset:number;
        textRenderer:egret.TextField;
        color:number;//包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
        str4Format:string;
        ubbParser:mo_ui.UBBParser;
        autoSizeHeight:boolean;
        autoSizeWidth:boolean;
        //@override
        _initProp():void{
            super._initProp();
            var self = this;

            if(!self.textRenderer) self.textRenderer = new egret.TextField();//需要先初始化好textRender
            self.textRenderer.lineSpacing = self.textRenderer.size * 0.3;

            self.touchScaleEnabled = false;
            self.normalScaleValueX = 0;
            self.normalScaleValueY = 0;
            self.onSelectedScaleOffset = 0.5;
        }

        dtor(){
            super.dtor();
            var self = this;
            //self.textRenderer = null;//需要先初始化好textRender
        }
    }
}