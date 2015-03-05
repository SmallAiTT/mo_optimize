module mo_ui._parser{
    export class UITextAtlasData extends UITextData{
        public itemWidth:number = 0;
        public itemHeight:number = 0;
        public startCharMap:string = "0";
    }


    //TODO
    export class UITextAtlasFactory extends UIWidgetFactory{
        //@override
        static PRODUCT_CLASS:any = UITextAtlas;
        //@override
        _setProductAttr(product:UITextAtlas, data:UITextAtlasData){
            super._setProductAttr(product, data);
            product.setProperty(data.text, data.res, data.itemWidth, data.itemHeight, data.startCharMap);
        }
    }
    uiReader.registerUIFactory(UITextAtlasFactory);
}