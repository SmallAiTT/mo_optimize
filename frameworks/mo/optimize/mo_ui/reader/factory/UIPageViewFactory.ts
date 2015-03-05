module mo_ui._parser{
    export class UIPageViewData extends UIPanelData{

    }


    export class UIPageViewFactory extends UIPanelFactory{
//        @override
        static PRODUCT_CLASS:any = UIPageView;
    }
    uiReader.registerUIFactory(UIPageViewFactory);
}