module mo_ui._parser{
    export class UIImageData extends UIScale9Data{
    }


    export class UIImageFactory extends UIWidgetFactory{
        //@override
        static PRODUCT_CLASS:any = UIImage;
        //@override
        _setProductAttr(product:UIImage, data:UIImageData){
            super._setProductAttr(product, data);
            product.loadTexture(data.res);
        }
    }
    uiReader.registerUIFactory(UIImageFactory);
}