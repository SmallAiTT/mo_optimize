module mo_ui._parser{
    export class UIWidgetData{
        public className:string;
        public name:string;
        public x:number = 0;
        public y:number = 0;
        public width:number = 0;
        public height:number = 0;
        public anchorX:number = 0;//ccs里面叫做anchorPointX
        public anchorY:number = 0;//ccs里面叫做anchorPointY
        public ignoreSize:boolean = false;
        public posType:number = 0;//ccs里面叫做positionType
        public posPercentX:number = 0;//ccs里面叫做positionPercentX
        public posPercentY:number = 0;//ccs里面叫做positionPercentY
        public sizeType:number = 0;
        public sizePercentX:number = 0;
        public sizePercentY:number = 0;
        public zOrder:number = 0;//ccs里面叫做ZOrder

        public options:any;//TODO 感觉ccs这个设计真是狗屎
        public children:UIWidgetData[];

        //颜色
        public colorType:number = 0;
        public color:number = 0xffffff;
        public customProperty:string;//TODO 目测没用
        public flipX:boolean = false;
        public flipY:boolean = false;
        public opacity:number = 255;//透明度
        public rotation:number = 0;//旋转

        //TODO 令人费解的api
        public scaleX:number = 0;
        public scaleY:number = 0;
        public scaleWidth:number = 1;
        public scaleHeight:number = 1;
        public scale9Enabled:boolean = false;

        public touchEnabled:boolean = false;
        public visible:boolean = true;

        //mo拓展
        public res:string;
        public layoutParameter:UILayoutParameter = null;
    }


    export class UIWidgetFactory{
        static getInstance():UIWidgetFactory{
            var instanceName = "__instance";
            if(!this[instanceName]) this[instanceName] = new this();
            return this[instanceName];
        }

        static PRODUCT_CLASS:any = UIWidget;

        __class:any;
        constructor(){
            this.__class = this["constructor"];
        }

        public produce(data:UIWidgetData){
            var product:UIWidget = new this.__class.PRODUCT_CLASS();
            this._setProductAttr(product, data);
            return product;
        }

        _setProductAttr(product:UIWidget, data:UIWidgetData){
            product.name = data.name;
            product.x = data.x;
            product.y = data.y;
            product.setSrcPos(data.x, data.y);
//            product.setPosition(data.x, data.y);
            product.width = data.width;
            product.height = data.height;
            product.setSrcSize(data.width, data.height);
//            product.setSize(data.width, data.height);
            product.anchorX = data.anchorX;
            product.anchorY = data.anchorY;
//            product.setAnchorPoint(data.anchorX, data.anchorY);
            product.alpha = data.opacity/255;
            product.touchEnabled = data.touchEnabled;
            product.visible = data.visible;
            product.rotation = data.rotation;
            product.zOrder = data.zOrder;

            var layoutParameter:UILayoutParameter = data.layoutParameter;
            if(layoutParameter){
                var param;
                switch (layoutParameter.type){
                    case consts.LayoutParameterType.none:break;
                    case consts.LayoutParameterType.linear:
                        param = new LinearLayoutParameter();
                        param.gravity = layoutParameter.gravity || param.gravity;
                        break;
                    case consts.LayoutParameterType.relative:
                        param = new RelativeLayoutParameter();
                        param.align = layoutParameter.align;
                        break;
                }
                if(param) {
                    param.setMargin(new Margin(layoutParameter.margin));
                    product.setLayoutParameter(param);
                }
            }

            product.scaleX = data.scaleX;
            product.scaleY = data.scaleY;

            product.setPositionType(data.posType);
            product.posPercentX = data.posPercentX;
            product.posPercentY = data.posPercentY;
            product.setSizeType(data.sizeType);
            product.sizePercentX = data.sizePercentX;
            product.sizePercentY = data.sizePercentY;

            //TODO egret还不支持 color设置
            //TODO egret还不支持 flip设置

        }
    }

}