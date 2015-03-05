module mo_ui._parser{
    export class UIListViewData extends UIScrollViewData{
        public gravity:number = 3;
        public itemMargin:number = 0;
    }


    export class UIListViewFactory extends UIScrollViewFactory{
        //@override
        static PRODUCT_CLASS:any = UIListView;
        //@override
        _setProductAttr(product:UIListView, data:UIListViewData){
            super._setProductAttr(product, data);
            product.setGravity(data.gravity);
            product.setItemsMargin(data.itemMargin);
        }
    }
    uiReader.registerUIFactory(UIListViewFactory);
}