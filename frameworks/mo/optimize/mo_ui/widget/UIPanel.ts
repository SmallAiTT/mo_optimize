module mo_ui{

    export class UIPanel extends UIWidget{
        static __className:string = "UIPanel";

        static NODE_OPTION_CLASS = mo_opt._UIPanelOption;

        _nodeOption:mo_opt._UIPanelOption;//子类重新声明下类型而已



        _setClippingEnabled(clippingEnabled: boolean){
            var self = this, nodeOption = self._nodeOption;
            if(nodeOption.clippingEnabled == clippingEnabled) return;
            nodeOption.clippingEnabled = clippingEnabled;
            nodeOption.clippingDirty = true;
            self._dirty = true;
        }
        public get clippingEnabled(): boolean{
            return this._nodeOption.clippingEnabled;
        }
        public set clippingEnabled(clippingEnabled: boolean){
            this._setClippingEnabled(clippingEnabled);
        }

        _setLayoutType(layoutType:number){
            var self = this, nodeOption = self._nodeOption;
            if(nodeOption.layoutType == layoutType) return;//直接返回
            nodeOption.layoutType = layoutType;
            var layoutChildrenArray = self._nodeOption.widgetChildren;
            var locChild:UIWidget = null;
            for (var i = 0; i < layoutChildrenArray.length; i++) {
                locChild = layoutChildrenArray[i];
                self.supplyTheLayoutParameterLackToChild(locChild);
            }
            nodeOption.doLayoutDirty = true;
            self._dirty = true;
        }
        public get layoutType(): number{
            return this._nodeOption.layoutType;
        }
        public set layoutType(layoutType: number){
            this._setLayoutType(layoutType);
        }
        public getLayoutType(): number{
            return this._nodeOption.layoutType;
        }
        public setLayoutType(layoutType: number){
            this._setLayoutType(layoutType);
        }

        public get bgOpacity():number{
            return this._nodeOption.bgOpacity;
        }
        public set bgOpacity(bgOpacity:number){
            this._nodeOption.bgOpacity = bgOpacity;
        }

        public get bgColor():number{
            return this._nodeOption.bgColor;
        }
        public set bgColor(color:number){
            var self = this, nodeOption = self._nodeOption;
            if(!nodeOption.bgColorDirty && color != nodeOption.bgColor) {
                nodeOption.bgColorDirty = true;
                self._dirty = true;
            }
            nodeOption.bgColor = color;

        }



        /**
         * 是否开启九宫格
         */
        _setScale9Enabled(scale9Enabled:boolean){
            var self = this, nodeOption = self._nodeOption;
            if (nodeOption.scale9Enabled == scale9Enabled) return;
            nodeOption.scale9Enabled = scale9Enabled;
        }
        public set scale9Enabled(scale9Enabled:boolean){
            this._setScale9Enabled(scale9Enabled);
        }
        public get scale9Enabled():boolean{
            return this._nodeOption.scale9Enabled;
        }

        /**
         * scale9Grid
         */
        _setScale9Grid(scale9Grid:mo.Rect){
            this._nodeOption.scale9Grid = scale9Grid;
        }
        public set scale9Grid(scale9Grid:mo.Rect){
            this._setScale9Grid(scale9Grid);
        }
        public get scale9Grid():mo.Rect{
            var nodeOption = this._nodeOption;
            return nodeOption.scale9Enabled ? nodeOption.scale9Grid : null;
        }
        /**
         * fillMode
         */
        _setFillMode(fillMode:string){
            this._nodeOption.fillMode = fillMode;
        }
        public set fillMode(fillMode:string){
            this._setFillMode(fillMode);
        }
        public get fillMode():string{
            return this._nodeOption.fillMode;
        }

        /**
         * 设置背景纹理
         * @param texture
         */
        public set bgTexture(texture:any){
            var self = this, nodeOption = self._nodeOption;
            if(texture == null) {
                nodeOption.bgTexture = null;
                return;
            }
            res.getStatusRes(texture, function(resData){
                nodeOption.bgTexture = resData;
            }, self, egret.Texture);
        }

        //override
        _initProp(){
            super._initProp();
            var self = this;
            self._dirty = true;
        }
        constructor(width?:number, height?:number){
            super();
            var self = this;
            self._setWidth(width || 0);
            self._setHeight(height || 0);
            self.ignoreContentAdaptWithSize(false);
            self.setBright(true);
            self.setAnchorPoint(0, 0);
        }

        public addChild(widget:egret.DisplayObject):egret.DisplayObject{
            var self = this;
            if(widget instanceof UIWidget) self.supplyTheLayoutParameterLackToChild(<UIWidget>widget);
            var result = super.addChild(widget);
            self._nodeOption.doLayoutDirty = true;
            self._dirty = true;
            return result;
        }
        public removeChild(widget:egret.DisplayObject):egret.DisplayObject{
            var result = super.removeChild(widget);
            this._nodeOption.doLayoutDirty = true;
            this._dirty = true;
            return result;
        }
        public removeChildren(){
            super.removeChildren();
            this._nodeOption.doLayoutDirty = true;
            this._dirty = true;
        }

        //将自身的布局传递到没有布局参数的child中
        supplyTheLayoutParameterLackToChild(locChild:UIWidget){
            if (!locChild) {
                return;
            }
            switch (this._nodeOption.layoutType) {
                case LayoutType.absolute:
                    break;
                case LayoutType.linearHorizontal:
                case LayoutType.linearVertical:
                    var layoutParameter = locChild.getLayoutParameter(LayoutParameterType.linear);
                    if (!layoutParameter) {
                        locChild.setLayoutParameter(new LinearLayoutParameter());
                    }
                    break;
                case LayoutType.relative:
                    var layoutParameter = locChild.getLayoutParameter(LayoutParameterType.relative);
                    if (!layoutParameter) {
                        locChild.setLayoutParameter(new RelativeLayoutParameter());
                    }
                    break;
                default:
                    break;
            }
        }

        /**
         * 请求进行layout。其实只是设置了个flag为true而已。
         */
        public setLayoutDirty(){
            this._nodeOption.doLayoutDirty = true;
            this._dirty = true;
        }

        /**
         * 是否启用自动大小设置。只有当其为线性布局是才有用。
         */
        _setAutoSizeEnabled(autoSizeEnabled:boolean){
            this._nodeOption.autoSizeEnabled = autoSizeEnabled;
        }
        public set autoSizeEnabled(autoSizeEnabled:boolean){
            this._setAutoSizeEnabled(autoSizeEnabled);
        }
        public get autoSizeEnabled():boolean{
            return this._nodeOption.autoSizeEnabled;
        }
        /**
         * 进行线性布局。
         */
        _doLayout_linear(linearType:number = 1){
            var self = this, nodeOption = self._nodeOption;
            var isVertical = linearType == LayoutType.linearVertical;
            //this._sortWidgetChildrenByPosY();
            var layoutChildrenArray = nodeOption.widgetChildren;//TODO 这里需要根据排序权重重新获取children
            var width = self.width, height = self.height;
            var layoutParm = self.getLayoutParameter(LayoutParameterType.linear);
            var padding:Padding = layoutParm ? layoutParm.getPadding() : new Padding();
            var sumX = padding.left || 0, sumY = padding.top || 0;
            var autoSizeEnabled = nodeOption.autoSizeEnabled;
            for (var i = 0; i < layoutChildrenArray.length; ++i) {
                var locChild = layoutChildrenArray[i];
                var locLayoutParameter = locChild.getLayoutParameter(LayoutParameterType.linear);

                if (locLayoutParameter) {
                    var locChildGravity = locLayoutParameter.gravity;
                    var lax = locChild.anchorX, lay = locChild.anchorY;
                    var lw = locChild.width, lh = locChild.height;

                    var posType = locChildGravity ? (locChildGravity-1)%3 : 0;
                    var xPosType = isVertical ? posType : 0;
                    var yPosType = isVertical ? 0 : posType;

                    var  mx = 0, my = 0, locMargin:Margin = locLayoutParameter.getMargin(), mxc = 0, myc = 0;
                    if(isVertical){
                        my = locMargin.top;
                        if(xPosType == 0) mx = locMargin.left;
                        else if(xPosType == 2) mx = -(locMargin.right);
                        else mxc = locMargin.left;
                    }else{
                        mx = locMargin.left;
                        if(yPosType == 0) my = locMargin.top;
                        else if(yPosType == 2) my = -(locMargin.bottom);
                        else myc = locMargin.top;
                    }

                    locChild.x = calLayoutXOrY(width, lw, lax, xPosType) + mx + sumX + mxc;
                    locChild.y = calLayoutXOrY(height, lh, lay, yPosType) + my + sumY + myc;

                    if(isVertical){
                        sumY += lh + my + locMargin.bottom;
                    }else{
                        sumX += lw + mx + locMargin.right;
                    }
                }
                if(autoSizeEnabled){
                    if(isVertical){//垂直
                        self._setHeight(sumY + padding.bottom);
                    }else{
                        self._setWidth(sumX + padding.right);
                    }
                }
            }
        }

        /**
         * 进行相对布局
         */
        _doLayout_relative(){
            var self = this;
            var layoutChildrenArray = self._nodeOption.widgetChildren;
            var length = layoutChildrenArray.length;
            var width = self.width, height = self.height;

            for (var i = 0; i < length; i++) {
                var locChild = layoutChildrenArray[i];
                var locLayoutParameter = locChild.getLayoutParameter(LayoutParameterType.relative);
                if (locLayoutParameter) {
                    var lax = locChild.anchorX, lay = locChild.anchorY;
                    var locAlign = locLayoutParameter.align;
                    var locFinalPosX = 0;
                    var locFinalPosY = 0;

                    var xPosType = locAlign ? (locAlign-1)%3 : 0;
                    var yPosType = locAlign ? Math.floor((locAlign-1)/3) : 0;

                    var mw = 0, mh = 0, locMargin:Margin = locLayoutParameter.getMargin();
                    if(xPosType == 0) mw = locMargin.left || 0;
                    else if(xPosType == 2) mw = -(locMargin.right || 0);
                    if(yPosType == 0) mh = locMargin.top || 0;
                    else if(yPosType == 2) mh = -(locMargin.bottom || 0);

                    locFinalPosX = calLayoutXOrY(width, locChild.width, lax, xPosType) + mw;
                    locFinalPosY = calLayoutXOrY(height, locChild.height, lay, yPosType) + mh;

                    locChild.setPosition(mo.p(locFinalPosX, locFinalPosY));
                }
            }
        }

        /**
         * 进行布局
         */
        _doLayout(){
            var self = this, nodeOption = self._nodeOption;
            if(nodeOption.childSrcSizeMap){
                self._calcTotalSrcSizeChanged();
            }
            switch (nodeOption.layoutType) {
                case LayoutType.absolute:
                    break;
                case LayoutType.linearVertical:
                    self._doLayout_linear(LayoutType.linearVertical);
                    break;
                case LayoutType.linearHorizontal:
                    self._doLayout_linear(LayoutType.linearHorizontal);
                    break;
                case LayoutType.relative:
                    self._doLayout_relative();
                    break;
                default:
                    break;
            }
        }

        public doLayout(layoutDirty:boolean = false){
            this._doLayout();
            this._nodeOption.doLayoutDirty = layoutDirty;
            if(layoutDirty) this._dirty = true;
        }

        _updateGraphics():void{
            var self = this, nodeOption = self._nodeOption;
            var gs = nodeOption.graphics;
            if(!gs){
                gs = nodeOption.graphics = new egret.Graphics();
            }
            gs.clear();
            gs.beginFill(nodeOption.bgColor, nodeOption.bgOpacity/255);
            gs.drawRect(0, 0, self.width, self.height);
            gs.endFill();
        }

        _updateClipping():void{
            var self = this;
            if(self._nodeOption.clippingEnabled) self.mask = mo.rect(0, 0, self.width, self.height);
            else self.mask = null;
        }
        _onNodeSizeDirty(){
            super._onNodeSizeDirty();
            var self = this, nodeOption = self._nodeOption;
            if(nodeOption.richText){ //当前panel被用作富文本
                nodeOption.richText.setAreaSize(self.width, self.height);
                return;
            }
            var children = self._children, l = children.length;
            for(var i = 0; i < l; ++i){
                var child = children[i];
                var cNodeOption = (<UIWidget>child)._nodeOption;
                if(cNodeOption && cNodeOption.sizeType == SizeType.percent){
                    if((<UIWidget>child)._updateSizeByPercent) (<UIWidget>child)._updateSizeByPercent();
                }
            }
        }
        //@override
        _onVisit(){
            super._onVisit();
            var self = this, nodeOption = self._nodeOption;
            if (nodeOption.nodeSizeDirty || nodeOption.doLayoutDirty) self._doLayout();
        }
        //@override
        _onUpdateView(){
            super._onUpdateView();
            var self = this, nodeOption = self._nodeOption, nodeSizeDirty = nodeOption.nodeSizeDirty;
            if (nodeOption.bgOpacity != 0 && (nodeSizeDirty || nodeOption.bgColorDirty || !nodeOption.graphics))
                self._updateGraphics();
            else if(nodeOption.bgOpacity == 0) {
                nodeOption.graphics = null;
            }

            if (nodeOption.clippingDirty) self._updateClipping();
        }
        //@override
        _onAfterVisit(){
            super._onAfterVisit();
            var self = this, nodeOption = self._nodeOption;
            nodeOption.doLayoutDirty = false;
            nodeOption.bgColorDirty = false;
            nodeOption.clippingDirty = false;
        }

        //@override
        public setLayoutParameter(parameter:LayoutParameter){
            super.setLayoutParameter(parameter);
            var parent = this._parent;
            if(parent && parent instanceof UIPanel) (<UIPanel>parent).setLayoutDirty();
        }

        //@override
        _render(renderContext:egret.RendererContext):void {
            var self = this, nodeOption = self._nodeOption;
            var graphics = nodeOption.graphics;
            if(graphics) {
                graphics._draw(renderContext);
            }
            var texture = nodeOption.bgTexture;
            self._texture_to_render = texture;
            if(texture) {
                var destW:number = self._hasWidthSet?self._explicitWidth:texture._textureWidth;
                var destH:number = self._hasHeightSet?self._explicitHeight:texture._textureHeight;
                egret.Bitmap._drawBitmap(renderContext,destW,destH,self);
            }

            super._render(renderContext);
        }

        public setLinearLayout(spacing, align) {
            spacing = spacing || 0;
            var self = this;
            var children:Array<any> = self.getChildren();
            children.sort(_sortFuncByX);
            var p:any;
            align = align || LayoutParameter.LINEAR_ALIGN_HT_LEFT;
            switch (align) {
                case LayoutParameter.LINEAR_ALIGN_HT_LEFT:
                    for (var i = 0, li = children.length; i < li; i++) {
                        var child = children[i];
                        if (!child.isVisible()) continue;

                        var pos:mo.Point = child.getPosition();
                        var w = child.getSize().width;
                        var anchorX = child.getAnchorPoint().x;
                        if (p == null) {
                            p = pos.x;  // 以最左边的child的x坐标为起始点
                        } else {
                            p += w * anchorX;
                            pos.x = p;
                            child.setPosition(pos);
                        }
                        p += w * (1 - anchorX) + spacing;
                    }
                    break;
                case LayoutParameter.LINEAR_ALIGN_HT_RIGHT:
                    for (var i = children.length - 1, li = 0; i >= li; i--) {
                        var child = children[i];
                        if (!child.isVisible()) continue;

                        var pos:mo.Point = child.getPosition();
                        var cw = self.getSize().width;
                        var w = child.getSize().width;
                        var anchorX = child.getAnchorPoint().x;
                        if (p == null) {
                            pos.x = cw - (1 - anchorX) * w;
                            child.setPosition(pos); // 将最右边的child移动到容器的最右边，紧贴容器右边界
                            p = pos.x
                        } else {
                            p -= w * (1 - anchorX);
                            pos.x = p;
                            child.setPosition(pos);
                            logger.debug("p.x = ", pos.x, "p.y = ", pos.y);
                        }
                        p -= w * anchorX + spacing;
                    }
                    break
            }
        }
        copySpecialProps(layout):void {
            var self = this;
            self.clippingEnabled = layout.clippingEnabled;
            self.layoutType = layout.layoutType;
            self.bgOpacity = layout.bgOpacity;
            self.bgColor = layout.bgColor;
            self.scale9Enabled = layout.scale9Enabled;
            self.bgTexture = layout._nodeOption.bgTexture;
        }
        /** widget extend begin **/

        public setOption (option:any){
            if(option == null) return option;
            var self = this, nodeOption = self._nodeOption;
            self.removeChildren();
            nodeOption.richText = null;
            option = super.setOption(option);
            nodeOption.bgOpacity = 0;//设置为无色
            if(option.value != null) {
                var richText:UIText, autoResize = option.autoResize;

                option.hAlign = option.hAlign || ALIGN_H_LEFT;
                option.vAlign = option.vAlign || ALIGN_V_MIDDLE;

                richText = UIText.create();
                richText.setAnchorPoint(0, 0);
                richText.setAreaSize(self.width, self.height);
                richText.setOption(option);

                //重新设置容器panel的大小
                if(autoResize) self.setSize(richText.width, richText.height);
                self.addChild(richText);
                nodeOption.richText = richText;
            }
            return option;
        }

        public enableStroke(strokeColor, strokeSize){
            var richText = this._nodeOption.richText;
            if(richText) richText.enableStroke.apply(richText, arguments);
        }

        public disableStroke(mustUpdateTexture){
            var richText = this._nodeOption.richText;
            if(richText)  richText.disableStroke.apply(richText, arguments);
        }

        public setWidth(width){
            var mySize = this.getSize(), newSize = mo.size(width, mySize.height);
            this.setSize(newSize);
        }

        public setHeight(height){
            var mySize = this.getSize(), newSize = mo.size(mySize.width, height);
            this.setSize(newSize);
        }


        /**
         * 注册要监听原始大小变化的子widget
         * @param name
         */
        public registerSrcSizeByName(name:string){
            var self = this;
            var map = self._nodeOption.childSrcSizeMap;
            if(!map){
                map = self._nodeOption.childSrcSizeMap = {};
            }
            map[name] = self.getWidgetByName(name).getSrcSize();
        }

        /**
         * 累加子项原始大小的变化--为实现自动大小dlg效果
         * @private
         */
        public _calcTotalSrcSizeChanged(){
            var self = this, nodeOption = self._nodeOption;
            var w = 0, h = 0, widget, srcSize;
            var map = nodeOption.childSrcSizeMap;
            for(var key in map){
                widget = self.getWidgetByName(key);
                srcSize = map[key];
                w += widget.width - srcSize.width;
                h += widget.height - srcSize.height;
            }
            var srcRect = nodeOption.srcRect;
            self._setWidth(srcRect.width + w);
            self._setHeight(srcRect.height + h);
        }

        public setPadding(top, right:number=0, bottom:number=0, left:number=0){
            var self = this;
            var para = self.getLayoutParameter(LayoutParameterType.linear);
            if(!para) return;
            if(typeof top == "object"){
                para.setPadding(top);
            }else{
                para.setPadding(new Padding(top||0, right, bottom, left));
            }
        }
        /** widget extend end **/
    }

    /**
     * 通过x排序
     * @param node1
     * @param node2
     * @returns {number}
     * @private
     */
    export function _sortFuncByX (node1:UIWidget, node2:UIWidget){
        return node1.getSrcPos().x >= node2.getSrcPos().x ? 1 : -1;
    }
}