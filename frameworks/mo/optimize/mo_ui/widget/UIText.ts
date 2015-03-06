module mo_ui {
    /**
     * @class UIText
     * 文本类
     */
    export class UIText extends UIWidget {
        static __className:string = "UIText";

        static NODE_OPTION_CLASS = mo_opt._UITextOption;

        _nodeOption:mo_opt._UITextOption;//子类重新声明下类型而已

        _initProp(){
            super._initProp();

            var mc = egret.MainContext, self:any = this;
            if(mc.runtimeType == mc.RUNTIME_HTML5){
                self._cacheAsBitmap = true;
            }
        }

        /**
         * 设置文本内容
         * @param {String} text
         */
        public setText(text:any) {
            var textRenderer = this._nodeOption.textRenderer;
            if(textRenderer){
                if(text instanceof Array){
                    textRenderer.textFlow = <Array<egret.ITextElement>>text;
                }else{
                    textRenderer.text = text;
                }

                this._labelScaleChangedWithSize();
            }
        }

        /**
         * 获取文本内容
         * @returns {String}
         */
        public getText():string {
            return this._nodeOption.textRenderer.text;
        }

        /**
         * 获取文本长度
         * @returns {Number}
         */
        public getTextLength():number {
            var str = this.getText();
            return str.length || 0;
        }

        /**
         * 设置字体大小
         * @param {Number} fontSize
         */
        public setFontSize(fontSize:number) {
            var self = this, textRenderer = self._nodeOption.textRenderer;
            textRenderer.size = fontSize;
            textRenderer.lineSpacing = textRenderer.size * 0.3;
            self.height = fontSize; //此时若没有设置文本时，width和height可能都为零
            self._labelScaleChangedWithSize();
        }

        /**
         * 获取字体大小
         * @returns {Number}
         */
        public getFontSize():number{
            return this._nodeOption.textRenderer.size;
        }

        /**
         * 设置字体
         * @param {String} name
         */
        public setFontName(name:string) {
            this._nodeOption.textRenderer.fontFamily = name;
            this._labelScaleChangedWithSize();
        }

        /**
         * 获取字体
         * @returns {String}
         */
        public getFontName ():string {
            return this._nodeOption.textRenderer.fontFamily;
        }

        /**
         * 设置文本域宽度
         * @param {Number} width
         * @param {Number} height
         */
        public setAreaSize(width:number, height:number) {
            var self = this, textRenderer = self._nodeOption.textRenderer;
            textRenderer.width = width;
            textRenderer.height = height;
            self._labelScaleChangedWithSize();
        }

        /**
         * 获取文本域大小
         * @returns {mo.Size}
         */
        public getAreaSize ():mo.Size {
            var self = this, textRenderer = self._nodeOption.textRenderer;
            return mo.size(textRenderer.width, textRenderer.height);
        }

        /**
         * 设置文本的横向对齐方式
         * @param {consts.ALIGN_H_LEFT | consts.ALIGN_H_CENTER | consts.ALIGN_H_RIGHT} hAlign Horizontal Alignment
         */
        public setHAlign(hAlign:string) {
            this._nodeOption.textRenderer.textAlign = hAlign;
        }

        /**
         * 获取文本的横向对齐方式
         * @returns {consts.ALIGN_H_LEFT | consts.ALIGN_H_CENTER | consts.ALIGN_H_RIGHT}
         */
        public getHAlign():string {
            return this._nodeOption.textRenderer.textAlign;
        }

        /**
         * 设置文本的垂直对齐方式
         * @param {consts.ALIGN_V_TOP|consts.ALIGN_V_MIDDLE|consts.ALIGN_V_BOTTOM} vAlign
         */
        public setVAlign(vAlign:string) {
            this._nodeOption.textRenderer.verticalAlign = vAlign;
        }

        /**
         * 获取文本的垂直对齐方式
         * @returns {consts.ALIGN_V_TOP|consts.ALIGN_V_MIDDLE|consts.ALIGN_V_BOTTOM}
         */
        public getVAlign():string {
            return this._nodeOption.textRenderer.verticalAlign;
        }

        /**
         * 设置斜体
         * @param isItalic
         */
        public setItalic(isItalic:boolean) {
            this._nodeOption.textRenderer.italic = isItalic;
        }

        /**
         * 是否斜体
         * @returns {boolean}
         */
        public getItalic():boolean {
            return this._nodeOption.textRenderer.italic;
        }

        /**
         * 设置粗体
         * @param bold
         */
        public setBold(bold:boolean) {
            this._nodeOption.textRenderer.bold = bold;
        }

        /**
         * 是否粗体
         * @returns {boolean}
         */
        public getBold():boolean {
            return this._nodeOption.textRenderer.bold;
        }

        /**
         * 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
         */
        _setColor(color:number){
            var nodeOption = this._nodeOption;
            nodeOption.color = color;
            if(color != null) nodeOption.textRenderer.textColor = color;
        }
        public set color(color:number){
            this._setColor(color);
        }
        public get color():number{
            return this._nodeOption.color;
        }
        /**
         * @deprecated
         * @param color
         */
        public setColor(color:number){
            this._setColor(color);
        }
        /**
         * @deprecated
         */
        public getColor():number{
            return this._nodeOption.color;
        }

        /**
         * 设置描边颜色，颜色值同setColor
         * @param color
         * @param lineSize
         */
        public enableStroke(color:number, lineSize?:number) {
            var self = this, textRenderer = self._nodeOption.textRenderer;
            if(lineSize == null) lineSize = 2;
            textRenderer.strokeColor = color;
            textRenderer.stroke = lineSize;
        }

        /**
         * 禁用描边
         */
        public disableStroke(){
            this._nodeOption.textRenderer.stroke = 0;
        }

        /**
         * 获取行数
         * @returns {number}
         */
        public getNumLines():number {
            return this._nodeOption.textRenderer.numLines;
        }

        /**
         * 设置行距
         * @param value
         */
        public setLineSpacing(value:number) {
            this._nodeOption.textRenderer.lineSpacing = value;
        }

        /**
         * 获取行距
         * @returns {number}
         */
        public getLineSpacing():number {
            return this._nodeOption.textRenderer.lineSpacing;
        }

        /**
         * 设置点击时候是否可放大
         * @param {Boolean} enable
         */
        public setTouchScaleEnabled(enable:boolean) {
            this._nodeOption.touchScaleEnabled = enable;
        }

        /**
         * 点击时是否可放大
         * @returns {Boolean}
         */
        public isTouchScaleEnabled():boolean {
            return this._nodeOption.touchScaleEnabled;
        }

        /**
         * 设置单行最大长度（单位：像素）
         * @param {Number} length
         */
        public setMaxLength(length:number) {
            this._nodeOption.textRenderer.maxWidth = length;
        }

        /**
         * 获取单行最大宽度（单位：像素）
         * @returns {Number} length
         */
        public getMaxLength():number {
            return this._nodeOption.textRenderer.maxWidth;
        }

        /**
         * @Override
         */
        public _onPressStateChanged(index:number):void {
            var self = this, nodeOption = self._nodeOption;
            if (nodeOption.touchScaleEnabled) {
                var textRenderer = nodeOption.textRenderer, nsx = nodeOption.normalScaleValueX, nsy = nodeOption.normalScaleValueY;
                if(index == 0){
                    textRenderer.scaleX = nsx;
                    textRenderer.scaleY = nsy;
                }else if(index == 1){
                    textRenderer.scaleX = nsx + nodeOption.onSelectedScaleOffset;
                    textRenderer.scaleY = nsy + nodeOption.onSelectedScaleOffset;
                }
            }
        }

        /**
         * @Override
         */
        public _onNodeSizeDirty() {
            super._onNodeSizeDirty();
            this._labelScaleChangedWithSize();
        }

        /**
         * @private
         */
        private _labelScaleChangedWithSize():void {
            var self:any = this, nodeOption = self._nodeOption, textRenderer = nodeOption.textRenderer;
            var rendererWidth = Math.max(self.width, textRenderer.width);
            var rendererHeight = Math.max(self.height, textRenderer.height);

            if(nodeOption.autoSizeWidth){
                self._setWidth(textRenderer.width);
                self._setHeight(rendererHeight);
            }else if(nodeOption.autoSizeHeight){
                self._setWidth(rendererWidth);
                self._setHeight(textRenderer.height);
            }else{
                self._setWidth(rendererWidth);
                self._setHeight(rendererHeight);
            }

            self._cacheDirty = true;
        }
        /**
         * 专门给WEBGL用的啊亲，这是一个HACK!
         * @returns {boolean}
         */
        public _makeBitmapCache ():boolean {
            return egret.TextField.prototype._makeBitmapCache.call(this);
        }

        public _render(renderContext:egret.RendererContext):void {
            var self = this,
                textRenderer:any = self._nodeOption.textRenderer;

            if(textRenderer._isArrayChanged){
                textRenderer._getLinesArr();
            }
            //单行并且不是富文本走这个逻辑
            if(textRenderer._numLines == 1 && !textRenderer._isFlow &&
                textRenderer._text && textRenderer._text != ""){
                var destW:number = self._explicitWidth;
                var destH:number = self._explicitHeight;
                //y
                var y, valign = 0;
                if (textRenderer._verticalAlign == consts.ALIGN_V_MIDDLE)
                    valign = 0.5;
                else if (textRenderer._verticalAlign == consts.ALIGN_V_BOTTOM)
                    valign = 1;
                y = valign * destH - textRenderer._size * (valign - 0.5);

                //x
                var x, halign = 0;
                if (textRenderer._textAlign == consts.ALIGN_H_CENTER) {
                    halign = 0.5;
                }
                else if (textRenderer._textAlign == consts.ALIGN_H_RIGHT) {
                    halign = 1;
                }
                x = halign * destW - textRenderer._textMaxWidth * halign;

                renderContext.drawText(textRenderer, textRenderer._text, x, y,0);
            }
            else{
                //多行或则富文本走原来逻辑
                egret.TextField.prototype._render.call(textRenderer, renderContext);
            }
            super._render(renderContext);
        }

        //@override
        public copySpecialProps(uiLabel){
            super.copySpecialProps(uiLabel);
            this.setFontName(uiLabel.getFontName());
            this.setFontSize(uiLabel.getFontSize());
            this.setAreaSize(uiLabel.width, uiLabel.height);
            this.setHAlign(uiLabel.getHAlign());
            this.setVAlign(uiLabel.getVAlign());
            this.color = uiLabel.color;
            this.setText(uiLabel.getText());
        }

        public format(...args:any[]){
            var self = this, nodeOption = self._nodeOption;
            var str:string = nodeOption.str4Format;
            if(!str){
                str = nodeOption.str4Format = self.getText();
            }
            var arr = Array.prototype.slice.apply(arguments);
            arr.splice(0, 0, str);
            str = mo_base.formatStr.apply(mo, arr);
            self.setText(str);
        }

        setOption(option:any):any{
            if(option == null) return option;
            var self = this, nodeOption = self._nodeOption;
            var ubbParser = nodeOption.ubbParser;
            if(!ubbParser){
                ubbParser = nodeOption.ubbParser = new UBBParser();
            }
            var option = super.setOption(option);
            if(option.value != null){
                var value:any = option.value.toString();
                if(option.autoResize != null) self.setAutoSizeHeight(option.autoResize);

                var color;
                if(option.color != null){
                    if(typeof option.color == "string"){
                        color = cc.hexToColor(option.color);
                    }
                    else{
                        color = option.color;
                    }
                }

                if(option.fontSize != null) self.setFontSize(option.fontSize);
                if(color != null) self.color = color;
                if(option.fontName) self.setFontName(option.fontName);

                if(ubbParser.checkIsExitUBB(value)){
                    ubbParser.resetDefault(self.getFontSize(), self.getFontName(), self.color);
                    value = ubbParser.ubb2TextFlow(value);
                }

                if(option.hAlign) self.setHAlign(option.hAlign);
                if(option.vAlign) self.setVAlign(option.vAlign);
                self.setText(value);
            }
            return option;
        }

        setAutoSizeHeight (aH){
            var self = this, nodeOption = self._nodeOption;
            nodeOption.autoSizeHeight = aH;
            if(aH){
                nodeOption.textRenderer.height = NaN;
            }
        }

        setAutoSizeWidth(aW){
            var self = this, nodeOption = self._nodeOption;
            nodeOption.autoSizeWidth = aW;
            if(aW){
                nodeOption.textRenderer.width = NaN;
            }
        }
    }
}