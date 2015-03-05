module mo_opt{
    export class _UIWidgetOption extends mo_opt._NodeOption{
        clickAudioId:any;
        widgetChildren:Array<mo_ui.UIWidget>;
        nodes:Array<egret.DisplayObject>;
        bright:boolean;
        focus:boolean;
        brightStyle:number;
        layoutParameterDictionary:Object;
        ignoreSize:boolean;
        sizeType:number;
        positionType:number;
        flippedX:boolean;
        flippedY:boolean;
        srcRect:mo.Rect;
        sizePercent:mo.Point;
        posPercent:mo.Point;
        isGray:boolean;

        //@override
        _initProp():void{
            super._initProp();
            var self = this;

            if(!self.widgetChildren){
                self.widgetChildren = [];
            }else{
                self.widgetChildren.length = 0;
            }
            if(!self.nodes){
                self.nodes = [];
            }else{
                self.nodes.length = 0;
            }
            self.layoutParameterDictionary = {};
            self.bright = true;
            self.brightStyle = mo_ui.BrightStyle.none;
            self.sizeType = mo_ui.SizeType.absolute;
            self.positionType = mo_ui.PositionType.absolute;

            self.srcRect = mo.rect(0, 0, 0, 0);
            self.sizePercent = mo.p(0, 0);
            self.posPercent = mo.p(0, 0);

            self.isGray = false;
        }

        clone(temp?:_UIWidgetOption):_UIWidgetOption{
            var self = this;
            temp = <_UIWidgetOption>super.clone(temp);
            temp.ignoreSize = self.ignoreSize;
            temp.sizeType = self.sizeType;
            temp.positionType = self.positionType;

            return temp;
        }

        getClickAudioId():any{
            return this.clickAudioId == null ? (<any>mo).audioIdOnClick : this.clickAudioId;
        }
    }
}