module mo_ui._parser{
    export class UIScrollViewData extends UIPanelData{
        public direction:number = 1;
        public innerWidth:number = 200;//TODO
        public innerHeight:number = 200;//TODO
    }


    export class UIScrollViewFactory extends UIPanelFactory{
        //@override
        static PRODUCT_CLASS:any = UIScrollView;
        //@override
        _setProductAttr(product:UIScrollView, data:UIScrollViewData){
            super._setProductAttr(product, data);
            product.direction = data.direction;
            product.setInnerContainerSize(mo.size(data.innerWidth, data.innerHeight));
            //TODO
        }
    }
    uiReader.registerUIFactory(UIScrollViewFactory);
}