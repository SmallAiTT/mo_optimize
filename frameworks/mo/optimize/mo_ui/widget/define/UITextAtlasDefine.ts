module mo_opt{
    export class _UITextAtlasOption extends _UIWidgetOption{

        string:string;//文本内容
        mapStartChar:string;//第一个字符
        spriteSheet:egret.SpriteSheet; //纹理集
        itemWidth:number;//一个字符的宽度
        itemHeight:number;//一个字符的高度
        itemsPerRow:number; //一行几个字
        itemsPerColumn:number;//一列几个字
        textureFile:string;

        //@override
        _initProp():void{
            super._initProp();
            var self = this;

            self.string = "";
            self.mapStartChar = "";
            self.itemWidth = 0;
            self.itemHeight = 0;
            self.itemsPerRow = 0;
            self.itemsPerColumn = 0;
            self.itemWidth = 0;
            self.textureFile = "";

        }

        dtor(){
            super.dtor();
            var self = this;
            self.spriteSheet = null;
        }
    }
}