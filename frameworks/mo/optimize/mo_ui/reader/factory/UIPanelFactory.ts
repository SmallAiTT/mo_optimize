module mo_ui._parser{
    export class UIPanelData extends UIScale9Data{
        public adaptScreen:boolean = false;
        public bgColor:number = 0xffffff;
        public bgOpacity:number = 255;

        //目前bgStartColor和bgEndColor没有用，因为当前egret还不支持渐变色
        public bgStartColor:number = 0xffffff;
        public bgEndColor:number = 0xffffff;

        public clippingEnabled:boolean = false;//TODO 以后可能会修改名称
        public layoutType:number = 0;
        public vectorX:number = 0;//TODO 不知道干嘛的
        public vectorY:number = 0;//TODO 不知道干嘛的
    }


    export class UIPanelFactory extends UIWidgetFactory{
        //@override
        static PRODUCT_CLASS:any = UIPanel;
        //@override
        _setProductAttr(product:UIPanel, data:UIPanelData){
            super._setProductAttr(product, data);
            product.bgColor = data.bgColor;
//            console.log("data.bgColor--->", data.bgColor, data.bgOpacity);
            product.bgOpacity = data.bgOpacity;
            product.clippingEnabled = data.clippingEnabled;

            product.bgTexture = res.getRes(data.res);
            product.layoutType = data.layoutType;

            var s9e = data.scale9Enabled;
            if(s9e){
                product.scale9Enabled = s9e;
                var s9g = data.scale9Grid;
                product.scale9Grid = mo.rect(s9g[0], s9g[1], s9g[2], s9g[3]);
            }
        }
    }
    uiReader.registerUIFactory(UIPanelFactory);
}