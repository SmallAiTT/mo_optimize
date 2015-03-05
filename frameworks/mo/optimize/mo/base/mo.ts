/**
 * Created by SmallAiTT on 2015/3/5.
 */
module mo{
    export class RESOLUTION_POLICY {
        static NO_BORDER: string = "noBorder";

        static SHOW_ALL: string = "showAll";

        static EXACT_FIT: string = "ExactFit";

        static FIXED_WIDTH: string = "FixedWidth";

        static FIXED_HEIGHT: string = "FixedHeight";
    }

    //框架相关的初始化操作
    export function init(){
        visibleRect = VisibleRect.create();
        //mo.audioEnabled = mo_base.project.audioEnabled;

        egret.RendererContext.registerBlendModeForGL("mask", 772, 0);
        egret.RendererContext.registerBlendModeForGL("clear", 1, 0);
    }
}