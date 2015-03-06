/**
 * bright style
 * @type {Object}
 */
module mo_ui.consts.BrightStyle {
    export var none:number = -1;
    export var normal:number = 0;
    export var high_light:number = 1;
}

/**
 * widget style
 * @type {Object}
 */
module mo_ui.consts.WidgetType {
    export var widget:number = 0;
    export var container:number = 1;
}

/**
 * texture resource type
 * @type {Object}
 */
module mo_ui.consts.TextureResType {
    export var local:number = 0;
    export var plist:number = 1;
}

/**
 * size type
 * @type {Object}
 */
module mo_ui.consts.SizeType {
    export var absolute:number = 0;
    export var percent:number = 1;
}

/**
 * position type
 * @type {Object}
 */
module mo_ui.consts.PositionType {
    export var absolute:number = 0;
    export var percent:number = 1;
}

module mo_ui {

    /**
     * Widget的基类
     * @class
     * @extends Node
     */
    export class UIWidget extends mo.Node{
        static __className:string = "UIWidget";

        static NODE_OPTION_CLASS = mo_opt._UIWidgetOption;

        _nodeOption:mo_opt._UIWidgetOption;//子类重新声明下类型而已

        _setSizePercentX(sizePercentX:number){
            var self = this, nodeOption = self._nodeOption;
            var sizePercent = nodeOption.sizePercent;
            sizePercent._setX(sizePercentX);
            if(sizePercent._xDirty) {
                self._dirty = true;
                var parent = self._parent;
                if(parent && nodeOption.sizeType == consts.SizeType.percent){
                    self._setWidth(parent.width * sizePercentX);
                }
            }
        }
        public set sizePercentX(sizePercentX:number){
            this._setSizePercentX(sizePercentX);
        }
        public get sizePercentX():number{
            return this._nodeOption.sizePercent.x;
        }
        _setSizePercentY(sizePercentY:number){
            var self = this, nodeOption = self._nodeOption;
            var sizePercent = nodeOption.sizePercent;
            sizePercent._setY(sizePercentY);
            if(sizePercent._yDirty) {
                self._dirty = true;
                var parent = self._parent;
                if(parent && nodeOption.sizeType == consts.SizeType.percent){
                    self._setHeight(parent.height * sizePercentY);
                }
            }
        }
        public set sizePercentY(sizePercentY:number){
            this._setSizePercentY(sizePercentY);
        }
        public get sizePercentY():number{
            return this._nodeOption.sizePercent.y;
        }
        public setSizePercent(percentX, percentY?:number) {
            var self = this;
            if(arguments.length == 1){
                percentY = percentX._y;
                percentX = percentX._x;
            }
            self._setSizePercentX(percentX);
            self._setSizePercentY(percentY);
            var widgetParent = self.getWidgetParent();
            if (widgetParent) {
                self._setWidth(widgetParent.width * percentX);
                self._setWidth(widgetParent.height * percentY);
            }
        }
        public getSizePercent(temp?:mo.Point) {
            return this._nodeOption.sizePercent.clone(temp);
        }
        _updateSizeByPercent(){
            var self = this, nodeOption = self._nodeOption;
            if(nodeOption.sizeType == consts.SizeType.percent){
                var parent = self.parent;
                if(parent){
                    var sizePercent = nodeOption.sizePercent;
                    self._setWidth(parent.width * sizePercent._x);
                    self._setHeight(parent.height * sizePercent._y);
                }
            }
        }

        _setPosPercentX(posPercentX:number){
            var self = this, nodeOption = self._nodeOption;
            var posPercent = nodeOption.posPercent;
            posPercent._setX(posPercentX);
            if(nodeOption.positionType == consts.PositionType.percent && posPercent._xDirty) {
                self._dirty = true;
            }
        }
        public set posPercentX(posPercentX:number){
            this._setPosPercentX(posPercentX);
        }
        public get posPercentX():number{
            return this._nodeOption.posPercent._x;
        }
        _setPosPercentY(posPercentY:number){
            var self = this, nodeOption = self._nodeOption;
            var posPercent = nodeOption.posPercent;
            posPercent._setY(posPercentY);
            if(nodeOption.positionType == consts.PositionType.percent && posPercent._yDirty) {
                self._dirty = true;
            }
        }
        public set posPercentY(posPercentY:number){
            this._setPosPercentY(posPercentY);
        }
        public get posPercentY():number{
            return this._nodeOption.posPercent._y;
        }
        _updatePosByPercent(){
            var self = this, nodeOption = self._nodeOption;
            if(nodeOption.positionType == consts.PositionType.percent){
                var parent = self.parent;
                if(parent){
                    var posPercent = nodeOption.posPercent;
                    self._setX(parent.width * posPercent._x);
                    self._setY(parent.height * posPercent._y);
                }
            }
        }
        public setPositionPercent(percentX, percentY?:number) {
            var self = this;
            if(arguments.length == 1){
                percentY = percentX._y;
                percentX = percentX._x;
            }
            self._setPosPercentX(percentX);
            self._setPosPercentY(percentY);
            var widgetParent = this.getWidgetParent();
            if (widgetParent) {
                self._setX(widgetParent.width * percentX);
                self._setY(widgetParent.height * percentX);
            }
        }
        public getPositionPercent(temp?:mo.Point) {
            return this._nodeOption.posPercent.clone(temp);
        }
        //@override
        public setPosition(pos:any, posY?:number) {
            var self = this;
            var parent = self.getWidgetParent();
            if (parent) {
                var w = parent.width, h = parent.height;
                var x = 0, y = 0;
                if (w > 0 && h > 0) {
                    if (posY !== undefined) {
                        x = pos / w;
                        y = posY / h;
                    } else {
                        x = pos.x / w;
                        y = pos.y / h;
                    }
                }
                self._setPosPercentX(x);
                self._setPosPercentY(y);
            }

            super.setPosition.apply(self, arguments);
        }

        //@override
        _initProp(){
            super._initProp();
            var self = this;
            self.name = "default";
            self._dirty = true;

            self.anchorX = 0.5;
            self.anchorY = 0.5;
            self.width = 0;
            self.height = 0;
        }

        //@override
        _init(){
            super._init();
            this.initRenderer();
            this.setBright(true);
            this.ignoreContentAdaptWithSize(true);
        }

        dtor(){
            super.dtor();
            //TODO
        }

        /**
         * 初始化渲染
         */
        initRenderer():void {
            //override me, come on baby
        }

        soundOnClick (clickAudioId:any){
            if(clickAudioId == null) return;
            this._nodeOption.clickAudioId = clickAudioId;
        }

        _playDefaultSoundOnClick (){
            var audioId = this._nodeOption.getClickAudioId();
            var mo_:any = <any>mo;
            if(audioId != null && mo_.playUIAudio && this._nodeOption.clickCb) {
                mo_.playUIAudio(audioId);
            }
        }

        public setOption(option:any):any{
            if(option == null) return option;
            option = (typeof option == "string" || typeof option == "number") ? {value : option} : option;
            var self = this;
            if(option.visible != null) self.setVisible(option.visible);
            if(option.touchEnabled != null) self.touchEnabled = (option.touchEnabled);
            if(option.isGray != null){
                self.setGray(option.isGray);
            }
            return option;
        }

        public addChild (widget:any):egret.DisplayObject{
            super.addChild(widget);
            var self = this, nodeOption = self._nodeOption;
            if(widget instanceof UIWidget){
                nodeOption.widgetChildren.push(widget);
            }else{
                nodeOption.nodes.push(widget);
            }
            if(widget.sizeType == consts.SizeType.percent){
                widget._updateSizeByPercent();
                widget.updateSizeByPercentForChildren();//改变子节点百分比大小
            }
            return widget;
        }

        public updateSizeByPercentForChildren(){
            var self = this;
            if(self._nodeOption.nodeSizeDirty){
                var child:any;
                var children = self._children;
                for (var i = 0, l_i = children.length; i < l_i; i++) {
                    child = children[i];
                    if(child._sizeType == consts.SizeType.percent){
                        child._updateSizeByPercent();//改变自身大小
                        child.updateSizeByPercentForChildren();//改变子节点百分比大小
                    }
                }
            }
        }

        public getWidgetParent ():UIWidget{
            var widget = this.getParent();
            if(widget instanceof UIWidget){
                return widget;
            }
            return null;
        }

        _onNodeSizeDirty(){
            var children = this._children;
            for (var i = 0, l_i = children.length; i < l_i; i++) {
                var child:UIWidget = <UIWidget>children[i];
                var cNodeOption = child._nodeOption;
                if(cNodeOption && cNodeOption.positionType == consts.PositionType.percent){
                    var posPercent = cNodeOption.posPercent;
                    posPercent._setDirty(true);
                    child._dirty = true;
                }
            }
        }


        //@override
        _onBeforeVisit(){
            super._onBeforeVisit();
            var self = this;
            var parent = self._parent;
            var nodeOption = self._nodeOption;
            var pNodeOption = (<any>parent)._nodeOption;
            var pLayoutType = pNodeOption ? (<any>pNodeOption).layoutType : null;
            if(pLayoutType == null || pLayoutType == consts.LayoutType.absolute){
                if(nodeOption.posPercent._dirty
                    || (nodeOption.positionType == consts.PositionType.percent && (<mo.Node>parent)._nodeOption.nodeSizeDirty)){
                    self._updatePosByPercent();
                }
            }
        }
        //@override
        _onAfterVisit(){
            super._onAfterVisit();
            var self = this;
            var nodeOption = self._nodeOption;
            nodeOption.sizePercent._setDirty(false);
            nodeOption.posPercent._setDirty(false);
        }


        public setSizeType(type) {
            this._nodeOption.sizeType = type;
        }

        public getSizeType() {
            return this._nodeOption.sizeType;
        }

        get sizeType():number{
            return this._nodeOption.sizeType;
        }

        public ignoreContentAdaptWithSize(ignore) {//TODO
            this._nodeOption.ignoreSize = ignore;
        }

        public isIgnoreContentAdaptWithSize():boolean{
            return this._nodeOption.ignoreSize;
        }

        public isFocused():boolean{
            return this._nodeOption.focus;
        }

        public setFocused(focus) {
            var self = this, nodeOption = self._nodeOption;
            if (focus == nodeOption.focus) {
                return;
            }
            nodeOption.focus = focus;
            if (nodeOption.bright) {
                if (focus) {
                    self.setBrightStyle(consts.BrightStyle.high_light);
                }
                else {
                    self.setBrightStyle(consts.BrightStyle.normal);
                }
            }
            else {
                self._onPressStateChanged(2);
            }
        }

        public setBright(bright:boolean) {
            var self = this, nodeOption = self._nodeOption;
            nodeOption.bright = bright;
            if (bright) {
                nodeOption.brightStyle = consts.BrightStyle.none;
                self.setBrightStyle(consts.BrightStyle.normal);
            }
            else {
                self._onPressStateChanged(2);
            }
        }

        public setBrightStyle(style) {
            var self = this, nodeOption = self._nodeOption;
            if (nodeOption.brightStyle == style) {
                return;
            }
            style = style || consts.BrightStyle.normal;
            nodeOption.brightStyle = style;
            switch (style) {
                case consts.BrightStyle.normal:
                    self._onPressStateChanged(0);
                    break;
                case consts.BrightStyle.high_light:
                    self._onPressStateChanged(1);
                    break;
                default:
                    break;
            }
        }

        /**
         * 0:normal, 1:pressed, 2:disabled
         * @param index
         * @private
         */
        _onPressStateChanged(index:number) {

        }


        //@override
        public onTouchLongClicked(event:egret.evt.TouchEvent) {
            this.longClickEvent();
        }

        private longClickEvent() {

        }

        public setPositionType(type) {
            this._nodeOption.positionType = type;
        }

        public getPositionType() {
            return this._nodeOption.positionType;
        }

        public setFlippedX(flipX) {
            var self = this, nodeOption = self._nodeOption;
            if(flipX == nodeOption.flippedX) return;
            nodeOption.flippedX = flipX;
            self.scaleX = (flipX ? -1 : 1) * Math.abs(this.scaleX);
        }

        public isFlippedX() {
            return this._nodeOption.flippedX;
        }

        public setFlippedY(flipY) {
            var self = this, nodeOption = self._nodeOption;
            if(flipY == nodeOption.flippedY) return;
            nodeOption.flippedY = flipY;
            self.scaleY = (flipY ? -1 : 1) * self.scaleY;
        }

        public isFlippedY() {
            return this._nodeOption.flippedY;
        }

        public isBright() {
            return this._nodeOption.bright;
        }

        public getLeftInParent():number {
            return this.x - this.anchorX * this.width;
        }

        public getBottomInParent():number {
            return this.y + (1 - this.anchorY) * this.height;
        }

        public getRightInParent():number {
            return this.x + (1 - this.anchorX) * this.width;
        }


        public getTopInParent():number {
            return this.y - this.anchorY * this.height;
        }

        public setLayoutParameter(parameter:LayoutParameter) {
            this._nodeOption.layoutParameterDictionary[parameter.getType()] = parameter;
        }

        public getLayoutParameter(type) {
            return this._nodeOption.layoutParameterDictionary[type];
        }
        public setGray(isGray:boolean){
            var self = this, nodeOption = self._nodeOption;
            if(nodeOption.isGray == isGray) return;//不变则直接返回
            nodeOption.isGray = isGray;
            if(isGray){
                self.colorTransform = ColorTransformUtils.getTransform(ColorTransformType.gray);
            }else{
                self.colorTransform = null;
            }
        }

        public clone() {
            var clonedWidget = new this.__class();
            clonedWidget.copyProps(this);
            clonedWidget.copyClonedWidgetChildren(this);
            return clonedWidget;
        }

        public copyClonedWidgetChildren(model:UIWidget) {
            var children = model._nodeOption.widgetChildren;
            for (var i = 0; i < children.length; i++) {
                var locChild = children[i];
                if (locChild instanceof UIWidget) {
                    this.addChild(locChild.clone());
                }
            }
        }

        public copySpecialProps(model) {

        }

        public copyProps(widget:UIWidget) {
            var self = this, nodeOption = self._nodeOption, wNodeOption = widget._nodeOption;
            self.setVisible(widget.isVisible());
            self.setBright(widget.isBright());
            self._setTouchEnabled(widget.touchEnabled);
            self._setZOrder(widget.zOrder);
            self.setTag(widget.getTag());
            self.setName(widget.getName());
            nodeOption.ignoreSize = wNodeOption.ignoreSize;
            self.copySpecialProps(widget);
            self.setSizeType(widget.getSizeType());
            self.setPositionType(widget.getPositionType());
            self.setPosition(widget.getPosition());
            self.setAnchorPoint(widget.getAnchorPoint());
            self.setScaleX(widget.getScaleX());
            self.setScaleY(widget.getScaleY());
            self.setRotation(widget.getRotation());
//            this.setRotationX(widget.getRotationX());
//            this.setRotationY(widget.getRotationY());
            self.setFlippedX(widget.isFlippedX());
            self.setFlippedY(widget.isFlippedY());
            self.setOpacity(widget.getOpacity());
            var wDict = wNodeOption.layoutParameterDictionary;
            for (var key in wDict) {
                var parameter = wDict[key];
                if (parameter)
                    this.setLayoutParameter(parameter.clone());
            }
            this.setSize(widget.getSize());
        }

        private _sortWidgetChildrenByPosX():void {
            this._children.sort(function (w1, w2) {
                return w1.x >= w2.x ? 1 : -1;
            })
        }

        private _sortWidgetChildrenByPosY():void {
            this._children.sort(function (w1, w2) {
                return w1.y >= w2.y ? -1 : 1;
            })
        }

        public removeChild(child:egret.DisplayObject):egret.DisplayObject {
            var nodeOption = this._nodeOption;
            var arr = child instanceof UIWidget ? nodeOption.widgetChildren : nodeOption.nodes;
            for (var i = arr.length - 1; i >= 0; i--) {
                if (arr[i] == child) {
                    arr.splice(i, 1);
                    break;
                }
            }
            return super.removeChild(child);
        }

        public removeWidgets(){
            var arr = this._nodeOption.widgetChildren;
            for(var i = arr.length; i > 0; i--){
                this.removeChild(arr.pop());
            }
        }
        public removeNodes(){
            var arr = this._nodeOption.nodes;
            for(var i = arr.length - 1; i >= 0; i--){
                this.removeChild(arr.pop());
            }
        }

        /**
         * 通过widget的名称获取到widget对象。
         * 或则通过层级名字的获取widget对象，例如 aWidget.b.c
         * @param name
         * @returns {*}
         */
        public getWidgetByName(name:string):any{
            if(name.indexOf(".") != -1){
                var nameArr = name.split("."), widget;
                var baseWidget = this._seekWidgetByName(nameArr[0]);
                for (var i = 1; i < nameArr.length; i++) {
                    widget = baseWidget._seekWidgetByName(nameArr[i]);
                    if(widget) {
                        baseWidget = widget;
                    }
                    else{
                        logger.log("%s里找不到:%s", baseWidget.name, nameArr[i]);
                        return null;
                    }
                }
                return widget;
            }
            else{
                return this._seekWidgetByName(name);
            }
        }

        private _seekWidgetByName(name:string){
            var widgets = this._nodeOption.widgetChildren;
            //先遍历子节点
            for(var i = 0, li = widgets.length; i < li; ++i){
                var widget = widgets[i];
                if(widget.name == name) return widget;
            }
            //再遍历子节点的子节点
            for(var i = 0, li = widgets.length; i < li; ++i){
                var target = widgets[i]._seekWidgetByName(name);
                if(target) return target;
            }
            return null;
        }

        onTouchBegan(event:egret.evt.TouchEvent){
            this.setFocused(true);
            event.stopPropagation();
        }
        _moving(){
            this.setFocused(true);
            super._moving();
        }
        _end(event:egret.evt.TouchEvent){
            var self = this, touchOption = self._touchOption;
            self.setFocused(false);
            if(touchOption.isIn && touchOption.canTap) {
                self._playDefaultSoundOnClick();
                super._end(event);
            }
        }

        setPositionOffset(pos){
            var curPos = this.getPosition();
            this.setPosition(curPos.x + pos.x, curPos.y + pos.y);
        }
        onLongTouch(...args:any[]):void{
            var self = this;
        }

        setSrcPos(point:any, y?:number){
            var self = this;
            if(y != null){
                //两个参数
                var x = point;
            }
            else{
                //一个参数时候
                var x = point.x;
                y = point.y;
            }
            var srcRect = self._nodeOption.srcRect;
            srcRect.x = x;
            srcRect.y = y;
        }
        getSrcPos(temp?:mo.Point){
            return mo.p(this._nodeOption.srcRect, temp);
        }

        setSrcSize(size:any, height?:number){
            var self = this;
            if(height != null){
                //两个参数
                var width = size;
            }
            else{
                //一个参数时候
                var width = size.width;
                height = size.height;
            }
            var srcRect = self._nodeOption.srcRect;
            srcRect.width = width;
            srcRect.height = height;
        }
        public getSrcSize(temp?:mo.Size):mo.Size{
            var srcRect = this._nodeOption.srcRect;
            return mo.size(srcRect.width, srcRect.height, temp);
        }

    }

    //impl(UIWidget, _widgetByNameApi);
}