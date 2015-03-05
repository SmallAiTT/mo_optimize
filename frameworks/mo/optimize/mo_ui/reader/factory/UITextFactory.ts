module mo_ui._parser{
    export class UITextData extends UIWidgetData{
        public fontName:string;
        public fontSize:number = 32;
        public fontType:number = 0;
        public text:string = "";
        public fontFile:string;//TODO

        public touchScaleEnable:boolean = false;//TODO
        public areaHeight:number = 0;
        public areaWidth:number = 0;
        public hAlignment:number = 0;
        public vAlignment:number = 0;
    }


    var HALIGN_MAP = {}, VALIGN_MAP = {};
    HALIGN_MAP[0] = ALIGN_H_LEFT;
    HALIGN_MAP[1] = ALIGN_H_CENTER;
    HALIGN_MAP[2] = ALIGN_H_RIGHT;
    VALIGN_MAP[0] = ALIGN_V_TOP;
    VALIGN_MAP[1] = ALIGN_V_MIDDLE;
    VALIGN_MAP[2] = ALIGN_V_BOTTOM;

    export class UITextFactory extends UIWidgetFactory{
        //@override
        static PRODUCT_CLASS:any = UIText;
        //@override
        _setProductAttr(product:UIText, data:UITextData){
            super._setProductAttr(product, data);
            product.setFontName(data.fontName);
            product.setFontSize(data.fontSize);
            product.color = data.color;
            product.setHAlign(HALIGN_MAP[data.hAlignment]);
            product.setVAlign(VALIGN_MAP[data.vAlignment]);

            if(data.areaWidth != 0 && data.areaWidth != 0){ //固定宽高
                product.setAreaSize(data.areaWidth, data.areaHeight);
            }
            if(data.areaWidth == 0 && data.areaWidth == 0){ //单行，自动宽度
                product.setAutoSizeWidth(true);
            }
            product.setText(data.text);
        }
    }
    uiReader.registerUIFactory(UITextFactory);
}