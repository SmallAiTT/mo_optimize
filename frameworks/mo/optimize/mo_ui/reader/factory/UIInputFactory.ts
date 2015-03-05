module mo_ui._parser{
    export class UIInputData extends UITextData{
//        public maxLengthEnable:boolean = false;//TODO 这个目前没用，解析也不做
        public passwordEnable:boolean = false;
//        public passwordStyleText:string = "*";//TODO 这个目前没用，解析也不做
//        public placeHolder:string = "input words here";//TODO 这个目前没用，解析也不做
    }


    export class UIInputFactory extends UITextFactory{
        //@override
        static PRODUCT_CLASS:any = UIInput;
        //@override
        _setProductAttr(product:UIInput, data:UIInputData){
            super._setProductAttr(product, data);
            product.setPasswordEnabled(data.passwordEnable);
        }
    }
    uiReader.registerUIFactory(UIInputFactory);
}