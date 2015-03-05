module mo_ui._parser{

    export class UIDataParser extends res.JsonParser{
        //@override
        static TYPE:string = "ui";

        //@override
        public _onLoadFinish(event:egret.Event):void{
            var self = this;
            var loader:egret.URLLoader = <egret.URLLoader> (event.target);
            var itemInfo:any = self._itemInfoDic[loader.hashCode];
            var data:any = loader.data;
            delete self._itemInfoDic[loader.hashCode];
            self._recycler.push(loader);
            var resCfgItem:res.ResCfgItem = itemInfo.item;
            var compFunc:Function = itemInfo.cb;
            if(event.type==egret.Event.COMPLETE){
                var uiRootData:UIRootData = self._parse(resCfgItem, data);
                var dirPath = path.dirname(resCfgItem.url);
                var resArr = [];
                var textures = uiRootData.textures;
                for(var i = 0, li = textures.length; i < li; ++i){
                    var texture = textures[i];
                    var textureCfg = new res.ResCfgItem();
                    var extname = path.extname(texture);
                    if(extname && extname.toLocaleLowerCase() == ".sheet") textureCfg.name = path.basename(texture, extname);
                    else textureCfg.name = texture;
                    textureCfg.url = path.join(dirPath, texture);
                    resArr.push(textureCfg);
                }
                res.load(resArr, function(){
                    var result:any = self._cache(resCfgItem, uiRootData);
                    compFunc.call(itemInfo.ctx, result, resCfgItem);
                });
                return;
            }else{
                self._handleError(event, resCfgItem);
                compFunc.call(itemInfo.ctx, null, resCfgItem);
            }
        }

        //@override
        public _parse(resCfgItem:res.ResCfgItem, parseResult):any{
            //这里对解析结果进行缓存操作，将缓存的数据返回
            parseResult = super._parse(resCfgItem, parseResult);
            return this._parseUIRootData(parseResult);
        }

        public _parseChildren(data, uiKey:UIKey, uiData:UIWidgetData){
            var children = uiData.children = [];
            var childrenData = data[uiKey.children];
            if(!childrenData) return;
            for(var i = 0, li = childrenData.length; i < li; ++i){
                children.push(this._parseWidgetData(childrenData[i], uiKey));
            }
        }
        public _parseUIRootData(data):UIRootData{
            var rootData = new UIRootData();
            var uiKey:UIKey = getUIKey();
            rootData.dataScale = data[uiKey.dataScale] == null ? rootData.dataScale : data[uiKey.dataScale];
            rootData.designWidth = data[uiKey.designWidth];
            rootData.designHeight = data[uiKey.designHeight];
            rootData.textures = data[uiKey.textures]||[];
            rootData.widgetTree = this._parseWidgetData(data[uiKey.widgetTree], uiKey);
            return rootData;
        }

        public _parseLayoutParameter(data, uiKey:UIKey){
            var uiData = new UILayoutParameter();
            uiData.type = data[uiKey.type] == null ? uiData.type : data[uiKey.type];
            uiData.align = data[uiKey.align] == null ? uiData.align : data[uiKey.align];
            uiData.gravity = data[uiKey.gravity] == null ? uiData.gravity : data[uiKey.gravity];
//            uiData.eageType = data[uiKey.eageType] == null ? uiData.eageType : data[uiKey.eageType];//TODO
            uiData.normalHorizontal = data[uiKey.normalHorizontal] == null ? uiData.normalHorizontal : data[uiKey.normalHorizontal];
            uiData.normalVertical = data[uiKey.normalVertical] == null ? uiData.normalVertical : data[uiKey.normalVertical];
            uiData.parentHorizontal = data[uiKey.parentHorizontal] == null ? uiData.parentHorizontal : data[uiKey.parentHorizontal];
            uiData.parentVertical = data[uiKey.parentVertical] == null ? uiData.parentVertical : data[uiKey.parentVertical];
            uiData.margin = data[uiKey.margin] == null ? uiData.margin : data[uiKey.margin];
            return uiData;
        }

        //widget基础数据解析
        public _parseBaseUIWidgetData(data, uiKey:UIKey, uiData:UIWidgetData):UIWidgetData{
            //UIWidgetData公共部分
            uiData.className = data[uiKey.className] == null ? uiData.className : data[uiKey.className];
            uiData.name = data[uiKey.name] == null ? uiData.name : data[uiKey.name];
            uiData.x = data[uiKey.x] == null ? uiData.x : data[uiKey.x];
            uiData.y = data[uiKey.y] == null ? uiData.y : data[uiKey.y];
            uiData.width = data[uiKey.width] == null ? uiData.width : data[uiKey.width];
            uiData.height = data[uiKey.height] == null ? uiData.height : data[uiKey.height];
            uiData.anchorX = data[uiKey.anchorX] == null ? uiData.anchorX : data[uiKey.anchorX];
            uiData.anchorY = data[uiKey.anchorY] == null ? uiData.anchorY : data[uiKey.anchorY];
            uiData.ignoreSize = data[uiKey.ignoreSize] == null ? uiData.ignoreSize : data[uiKey.ignoreSize];
            uiData.posType = data[uiKey.posType] == null ? uiData.posType : data[uiKey.posType];
            uiData.posPercentX = data[uiKey.posPercentX] == null ? uiData.posPercentX : data[uiKey.posPercentX];
            uiData.posPercentY = data[uiKey.posPercentY] == null ? uiData.posPercentY : data[uiKey.posPercentY];
            uiData.sizeType = data[uiKey.sizeType] == null ? uiData.sizeType : data[uiKey.sizeType];
            uiData.sizePercentX = data[uiKey.sizePercentX] == null ? uiData.sizePercentX : data[uiKey.sizePercentX];
            uiData.sizePercentY = data[uiKey.sizePercentY] == null ? uiData.sizePercentY : data[uiKey.sizePercentY];
            uiData.zOrder = data[uiKey.zOrder] == null ? uiData.zOrder : data[uiKey.zOrder];
            uiData.colorType = data[uiKey.colorType] == null ? uiData.colorType : data[uiKey.colorType];
            uiData.color = data[uiKey.color] == null ? uiData.color : data[uiKey.color];
            uiData.customProperty = data[uiKey.customProperty] == null ? uiData.customProperty : data[uiKey.customProperty];//TODO
            uiData.flipX = data[uiKey.flipX] == null ? uiData.flipX : data[uiKey.flipX];
            uiData.flipY = data[uiKey.flipY] == null ? uiData.flipY : data[uiKey.flipY];
            uiData.opacity = data[uiKey.opacity] == null ? uiData.opacity : data[uiKey.opacity];
            uiData.rotation = data[uiKey.rotation] == null ? uiData.rotation : data[uiKey.rotation];
            uiData.scaleX = data[uiKey.scaleX] == null ? uiData.scaleX : data[uiKey.scaleX];
            uiData.scaleY = data[uiKey.scaleY] == null ? uiData.scaleY : data[uiKey.scaleY];
            uiData.scale9Enabled = data[uiKey.scale9Enabled] == null ? uiData.scale9Enabled : data[uiKey.scale9Enabled];
            uiData.scaleWidth = data[uiKey.scaleWidth] == null ? uiData.scaleWidth : data[uiKey.scaleWidth];
            uiData.scaleHeight = data[uiKey.scaleHeight] == null ? uiData.scaleHeight : data[uiKey.scaleHeight];
            uiData.touchEnabled = data[uiKey.touchEnabled] == null ? uiData.touchEnabled : data[uiKey.touchEnabled];
            uiData.visible = data[uiKey.visible] == null ? uiData.visible : data[uiKey.visible];

            uiData.res = data[uiKey.res] == null ? uiData.res : data[uiKey.res];

            if(data[uiKey.layoutParameter]) uiData.layoutParameter = this._parseLayoutParameter(data[uiKey.layoutParameter], uiKey);
            this._parseChildren(data, uiKey, uiData);
            return uiData;
        }

        //9宫格相关数据解析
        public _parseUIScale9Data(data, uiKey:UIKey, uiData:UIScale9Data):UIScale9Data{
            uiData.scale9Enabled = data[uiKey.scale9Enabled] == null ? uiData.scale9Enabled : data[uiKey.scale9Enabled];
//            if(uiData.scale9Enabled) logger.debug("data[uiKey.scale9Grid]----->", data[uiKey.scale9Grid]);
            uiData.scale9Grid = data[uiKey.scale9Grid] == null ? uiData.scale9Grid : data[uiKey.scale9Grid];
            this._parseBaseUIWidgetData(data, uiKey, uiData);
            return uiData;
        }
        public _parseUITextData(data, uiKey:UIKey, uiData:UITextData):UITextData{
            uiData.fontName = data[uiKey.fontName] == null ? uiData.fontName : data[uiKey.fontName];
            uiData.fontSize = data[uiKey.fontSize] == null ? uiData.fontSize : data[uiKey.fontSize];
            uiData.text = data[uiKey.text] == null ? uiData.text : data[uiKey.text];
            uiData.areaHeight = data[uiKey.areaHeight] == null ? uiData.areaHeight : data[uiKey.areaHeight];
            uiData.areaWidth = data[uiKey.areaWidth] == null ? uiData.areaWidth : data[uiKey.areaWidth];
            uiData.hAlignment = data[uiKey.hAlignment] == null ? uiData.hAlignment : data[uiKey.hAlignment];
            uiData.vAlignment = data[uiKey.vAlignment] == null ? uiData.vAlignment : data[uiKey.vAlignment];
            uiData.touchScaleEnable = data[uiKey.touchScaleEnable] == null ? uiData.touchScaleEnable : data[uiKey.touchScaleEnable];
            this._parseBaseUIWidgetData(data, uiKey, uiData);
            return uiData;
        }
        public _parseUTextAtlasData(data, uiKey:UIKey, uiData:UITextAtlasData):UITextAtlasData{
            uiData.itemWidth = data[uiKey.itemWidth] == null ? uiData.itemWidth : data[uiKey.itemWidth];
            uiData.itemHeight = data[uiKey.itemHeight] == null ? uiData.itemHeight : data[uiKey.itemHeight];
            uiData.startCharMap = data[uiKey.startCharMap] == null ? uiData.startCharMap : data[uiKey.startCharMap];
            this._parseUITextData(data, uiKey, uiData);
            return uiData;
        }
        public _parseUIInputData(data, uiKey:UIKey, uiData:UIInputData):UIInputData{
            uiData.passwordEnable = data[uiKey.passwordEnable] == null ? uiData.passwordEnable : data[uiKey.passwordEnable];
            this._parseUITextData(data, uiKey, uiData);
            return uiData;
        }

        //图片数据解析
        public _parseUIImageData(data, uiKey:UIKey, uiData:UIImageData):UIImageData{
            this._parseUIScale9Data(data, uiKey, uiData);
            return uiData;
        }
        //图片数据解析
        public _parseUILoadingBarData(data, uiKey:UIKey, uiData:UILoadingBarData):UILoadingBarData{
            uiData.direction = data[uiKey.direction] == null ? uiData.direction : data[uiKey.direction];
            uiData.percent = data[uiKey.percent] == null ? uiData.percent : data[uiKey.percent];
            this._parseUIScale9Data(data, uiKey, uiData);
            return uiData;
        }
        //button数据解析
        public _parseUIButtonData(data, uiKey:UIKey, uiData:UIButtonData):UIButtonData{
            uiData.normal = data[uiKey.normal];
            uiData.pressed = data[uiKey.pressed];
            uiData.disabled = data[uiKey.disabled];
            if(uiData.normal && !uiData.pressed){
                uiData.pressed = uiData.normal;
                uiData.pressedActionEnabled = true;
            }
            uiData.text = data[uiKey.text] == null ? uiData.text : data[uiKey.text];
            uiData.textColor = data[uiKey.textColor] == null ? uiData.textColor : data[uiKey.textColor];
            uiData.fontName = data[uiKey.fontName] == null ? uiData.fontName : data[uiKey.fontName];
            uiData.fontSize = data[uiKey.fontSize] == null ? uiData.fontSize : data[uiKey.fontSize];
            this._parseUIScale9Data(data, uiKey, uiData);
            return uiData;
        }

        public _parseUIPanelData(data, uiKey:UIKey, uiData:UIPanelData):UIPanelData{
            uiData.layoutParameter = data[uiKey.layoutParameter] == null ? uiData.layoutParameter : data[uiKey.layoutParameter];
            uiData.adaptScreen = data[uiKey.adaptScreen] == null ? uiData.adaptScreen : data[uiKey.adaptScreen];
            uiData.res = data[uiKey.res] == null ? uiData.res : data[uiKey.res];
            uiData.bgColor = data[uiKey.bgColor] == null ? uiData.bgColor : data[uiKey.bgColor];
            uiData.bgOpacity = data[uiKey.bgOpacity] == null ? uiData.bgOpacity : data[uiKey.bgOpacity];
            uiData.bgStartColor = data[uiKey.bgStartColor] == null ? uiData.bgStartColor : data[uiKey.bgStartColor];
            uiData.bgEndColor = data[uiKey.bgEndColor] == null ? uiData.bgEndColor : data[uiKey.bgEndColor];
            uiData.clippingEnabled = data[uiKey.clippingEnabled] == null ? uiData.clippingEnabled : data[uiKey.clippingEnabled];
            uiData.layoutType = data[uiKey.layoutType] == null ? uiData.layoutType : data[uiKey.layoutType];
            uiData.vectorX = data[uiKey.vectorX] == null ? uiData.vectorX : data[uiKey.vectorX];
            uiData.vectorY = data[uiKey.vectorY] == null ? uiData.vectorY : data[uiKey.vectorY];
            this._parseUIScale9Data(data, uiKey, uiData);
            this._parseBaseUIWidgetData(data, uiKey, uiData);
            return uiData;
        }
        public _parseUIScrollViewData(data, uiKey:UIKey, uiData:UIScrollViewData):UIScrollViewData{
            uiData.direction = data[uiKey.direction] == null ? uiData.direction : data[uiKey.direction];
            uiData.innerWidth = data[uiKey.innerWidth] == null ? uiData.innerWidth : data[uiKey.innerWidth];
            uiData.innerHeight = data[uiKey.innerHeight] == null ? uiData.innerHeight : data[uiKey.innerHeight];
            this._parseUIPanelData(data, uiKey, uiData);
            return uiData;
        }
        public _parseUIListViewData(data, uiKey:UIKey, uiData:UIListViewData):UIListViewData{
            uiData.direction = data[uiKey.direction] == null ? uiData.direction : data[uiKey.direction];
            uiData.gravity = data[uiKey.gravity] == null ? uiData.gravity : data[uiKey.gravity];
            uiData.itemMargin = data[uiKey.itemMargin] == null ? uiData.itemMargin : data[uiKey.itemMargin];
            this._parseUIScrollViewData(data, uiKey, uiData);
            return uiData;
        }
        public _parseUIPageViewData(data, uiKey:UIKey, uiData:UIPageViewData):UIPageViewData{
            this._parseUIPanelData(data, uiKey, uiData);
            return uiData;
        }

        public _parseWidgetData(data, uiKey:UIKey):any{
            var className = data[uiKey.className];
            switch (className){
                case UIText.__className: return this._parseUITextData(data, uiKey, new UITextData());
                case UITextAtlas.__className: return this._parseUTextAtlasData(data, uiKey, new UITextAtlasData());
                case UIInput.__className: return this._parseUIInputData(data, uiKey, new UIInputData());
                case UIImage.__className: return this._parseUIImageData(data, uiKey, new UIImageData());
                case UIButton.__className: return this._parseUIButtonData(data, uiKey, new UIButtonData());
                case UILoadingBar.__className: return this._parseUILoadingBarData(data, uiKey, new UILoadingBarData());
                case UIPanel.__className: return this._parseUIPanelData(data, uiKey, new UIPanelData());
                case UIScrollView.__className: return this._parseUIScrollViewData(data, uiKey, new UIScrollViewData());
                case UIListView.__className: return this._parseUIListViewData(data, uiKey, new UIListViewData());
                case UIPageView.__className: return this._parseUIPageViewData(data, uiKey, new UIPageViewData());
            }
            logger.warn("未找到【%s】类型的ui数据解析器！", className);
            return null;
        }
    }

    res.registerParser(UIDataParser, "ui");

}