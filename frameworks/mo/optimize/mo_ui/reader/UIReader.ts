module mo_ui._parser{

    export class UIReader {
        private _factoryDic:any = {};
        public genWidget(data:any):any{
            if(typeof data == "string"){
                var dataName = data;
                data = res.getRes(data);//如果是字符串则从res中获取下数据先
                if(!data) {
                    logger.warn("请确保已经加载了ui资源：【%s】", dataName);
                    return null;
                }
            }
            var widgetTree = data.widgetTree;
            return this._genWidget(widgetTree);
        }

        public _genWidget(data:UIWidgetData):any{
            var factory:UIWidgetFactory = this._factoryDic[data.className].getInstance();
            var widget = factory.produce(data);
            var childrenData:UIWidgetData[] = data.children;
            if(childrenData){
                for(var i = 0, li = childrenData.length; i < li; ++i){
                    var childData:UIWidgetData = childrenData[i];
                    var child = this._genWidget(childData);
                    if(child) widget.addChild(child);
                }
            }
            return widget;
        }

        public registerUIFactory(factoryClass):void{
            var name:string = factoryClass.PRODUCT_CLASS.__className;
            this._factoryDic[name] = factoryClass;
        }
    }


    res.setParserAlias(res.TextParser, "fnt");
}
module mo_ui{
    export var uiReader = new _parser.UIReader();
}