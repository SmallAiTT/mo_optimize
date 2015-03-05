module mo_ui._parser{
    export class UIButtonData extends UIScale9Data{
        public normal:string;
        public pressed:string;
        public disabled:string;

        public text:string;
        public textColor:number = 0;
        public fontSize:number = 20;
        public fontName:string;

        public pressedActionEnabled:boolean = false;
    }


    export class UIButtonFactory extends UIWidgetFactory{
        //@override
        static PRODUCT_CLASS:any = UIButton;
        //@override
        _setProductAttr(product:UIButton, data:UIButtonData){
            super._setProductAttr(product, data);
            product.loadTextures(data.normal, data.pressed, data.disabled);
            product.setPressedActionEnabled(data.pressedActionEnabled);
            if(data.text) {
                product.setTitleText(data.text);
                product.setTitleFontSize(data.fontSize);
                product.setTitleFontName(data.fontName);
                product.setTitleColor(data.textColor);
            }
//            logger.debug("product.touchEnabled--->", product.touchEnabled);
        }
    }
    uiReader.registerUIFactory(UIButtonFactory);
}