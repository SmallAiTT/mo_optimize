module mo_opt{
    export class _UIImageOption extends mo_opt._UIWidgetOption{

        scale9Enabled:boolean;//是否开启九宫格
        scale9Grid:mo.Rect;//九宫格区域
        prevIgnoreSize:boolean;
        imageRenderer:egret.Bitmap;
        texture:egret.Texture;//这个只是用于内部进行保存，没有实际去绘制
        maskTextureFile:string;
        maskEnabled:boolean;
        currDynamicImg:any;

//        _imageTextureSize:Size = size(0,0);

        //@override
        _initProp():void{
            super._initProp();
            var self = this;
            self.scale9Enabled = false;//是否开启九宫格
            self.scale9Grid = mo.rect(0, 0, 0, 0);//九宫格区域
            self.prevIgnoreSize = true;
            var imageRenderer = self.imageRenderer;
            if(!imageRenderer) imageRenderer = self.imageRenderer = new egret.Bitmap();
            imageRenderer._setAnchorX(0);
            imageRenderer._setAnchorY(0);
            self.texture = null;//这个只是用于内部进行保存，没有实际去绘制
            self.maskTextureFile = null;
            self.maskEnabled = false;
            self.currDynamicImg = null;
        }

        dtor(){
            super.dtor();
            var self = this;
            self.scale9Grid = null;//九宫格区域
            self.imageRenderer = new egret.Bitmap();
            self.texture = null;//这个只是用于内部进行保存，没有实际去绘制
            self.maskTextureFile = null;
            self.currDynamicImg = null;
        }
    }
}