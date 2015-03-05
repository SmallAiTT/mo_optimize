module mo_ui._parser{
    export class UILoadingBarData extends UIScale9Data{
        public direction:number = 0;
        public percent:number = 100;
    }


    export class UILoadingBarFactory extends UIWidgetFactory{
        //@override
        static PRODUCT_CLASS:any = UILoadingBar;
        //@override
        _setProductAttr(product:UILoadingBar, data:UILoadingBarData){
            super._setProductAttr(product, data);
            product.loadTexture(data.res);
            product.setPercent(data.percent);
            product.setDirection(data.direction);
        }
    }
    uiReader.registerUIFactory(UILoadingBarFactory);
}