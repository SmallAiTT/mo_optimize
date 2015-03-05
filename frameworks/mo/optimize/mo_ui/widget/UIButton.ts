module mo_ui {
    export class UIButton extends UIWidget {
        static __className:string = "UIButton";

        _buttonOption:mo_opt._UIButtonOption;
        _buttonTexture;

        //@override
        _initProp() {
            super._initProp();
            var self = this;
            self._buttonOption = new mo_opt._UIButtonOption();
            self._setTouchEnabled(true);
        }

        /**
         * 加载资源
         * @param normal
         * @param selected
         * @param disabled
         */
        public loadTextures(normal:any, selected?:any, disabled?:any) {
            if (selected == null || selected == "") {
                selected = normal;
            }

            if (disabled == null || disabled == "") {
                disabled = normal;
            }

            var self = this;
            async.parallel([
                function(cb1){
                    self.loadTextureNormal(normal, cb1);
                },
                function(cb1){
                    self.loadTexturePressed(selected, cb1);
                },
                function(cb1){
                    self.loadTextureDisabled(disabled, cb1);
                }
            ], function(){
                var buttonOption:mo_opt._UIButtonOption = self._buttonOption;
                var currIndex = buttonOption.currentIndex;
                currIndex = currIndex == null ? 0 : currIndex;
                var texture = buttonOption.textures[currIndex];

                self._buttonTexture = texture;

                self._setWidth(texture.textureWidth);
                self._setHeight(texture.textureHeight);
            });
        }

        /**
         * @param texture
         * @param index
         * @param cb
         * @param ctx
         * @private
         */
        private _setBitmapTexture(texture:any, index:number, cb?:Function, ctx?:any):void {
            var self = this, buttonOption = self._buttonOption;
            res.getStatusRes(texture, function(resData){
                buttonOption.setTexture(index, resData);
                self.setSize(resData.textureWidth, resData.textureHeight);
                if(cb) cb.call(ctx);
            }, self, egret.Texture);
        }

        /**
         * 加载正常状态资源
         * @param texture
         * @param cb
         * @param ctx
         */
        public loadTextureNormal(texture:any, cb?:Function, ctx?:any):void {
            this._setBitmapTexture(texture, 0, cb, ctx);
        }

        /**
         * 加载被按下去状态资源
         * @param texture
         * @param cb
         * @param ctx
         */
        public loadTexturePressed(texture:any, cb?:Function, ctx?:any):void {
            this._setBitmapTexture(texture, 1, cb, ctx);
        }

        /**
         * 加载禁用状态资源
         * @param texture
         * @param cb
         * @param ctx
         */
        public loadTextureDisabled(texture:any, cb?:Function, ctx?:any):void {
            this._setBitmapTexture(texture, 2, cb, ctx);
        }

        /**
         * @Override
         */
        _onPressStateChanged(index:number):void {
            var self = this, buttonOption = self._buttonOption;
            var textures = buttonOption.textures;
            if(textures.length > 0){
                var texture = textures[index] || textures[0];
                self._buttonTexture = texture;
                self._setWidth(texture.textureWidth);
                self._setHeight(texture.textureHeight);
            }

            buttonOption.currentIndex = index;
            if (buttonOption.pressedActionEnabled) {
                var seq:egret.action.Action;
                if(index == 0){
                    var oldScale = buttonOption.oldScale || mo.p(1, 1);
                    var scaleToAct = mo.scaleTo(0.03, oldScale.x, oldScale.y);
                    var callFunc = mo.callFunc(function(){
                        buttonOption.oldScale = null;
                    });
                    seq = buttonOption.act = mo.sequence(scaleToAct, callFunc);
                    self.runAction(seq);
                }else if(index == 1){
                    var oldScale = buttonOption.oldScale;
                    if(buttonOption.act) {
                        self.stopAction(buttonOption.act);
                        if(oldScale){
                            self.scaleX = oldScale.x;
                            self.scaleY = oldScale.y;
                        }
                    }
                    if(!oldScale){
                        oldScale = buttonOption.oldScale = mo.p(0, 0);
                        oldScale.x = self.scaleX;
                        oldScale.y = self.scaleY;
                    }
                    seq = buttonOption.act = mo.scaleTo(0.03, 1.1*self.scaleX, 1.1*self.scaleY);
                    self.runAction(seq);
                }
            }
        }

        /**
         * 按钮被点击是否能缩放
         * @param {Boolean} enabled
         */
        public setPressedActionEnabled(enabled:boolean) {
            this._buttonOption.pressedActionEnabled = enabled;
        }

        /**
         * 标题的位置百分比
         * @param point
         * @param y
         */
        public setTitlePosByPercent(point:any, y?:number) {
            var self = this, buttonOption = self._buttonOption;
            if (arguments.length === 1) {
                y = point.y;
                point = point.x;
            }
            var titlePosByPercent = buttonOption.titlePosByPercent;
            titlePosByPercent._setX(point);
            titlePosByPercent._setY(y);
            buttonOption._textDirty = true;
        }

        /**
         * 设置标题文本
         * @param {String} text
         */
        public setTitleText(text:string) {
            var self = this, buttonOption = self._buttonOption;
            buttonOption.text = text;
            buttonOption._textDirty = true;
        }

        /**
         * 获取标题文本
         * @returns {String} text
         */
        public getTitleText():string {
            return this._buttonOption.text;
        }

        /**
         * 设置标题颜色
         * @param {number} color
         */
        public setTitleColor(color:number) {
            var self = this, buttonOption = self._buttonOption;
            buttonOption._setTextColor(color);
            buttonOption._textDirty = true;
        }

        /**
         * 获取标题颜色
         * @returns {number}
         */
        public getTitleColor():number {
            return this._buttonOption._textColor;
        }

        /**
         * 设置标题描边颜色，颜色值同setColor
         * @param color
         * @param lineSize
         */
        public enableStroke(color:number, lineSize:number = 2) {
            var buttonOption = this._buttonOption;
            buttonOption._setStroke(color, lineSize);
        }

        /**
         * 禁用标题描边
         */
        public disableStroke() {
            var buttonOption = this._buttonOption;
            buttonOption._setStroke(0, 0);
        }

        /**
         * 设置标题字体大小
         * @param {Number} size
         */
        public setTitleFontSize(size:number) {
            var self = this, buttonOption = self._buttonOption;
            buttonOption._size = size;
            buttonOption._textDirty = true;
        }

        /**
         * 获取标题字体大小
         * @returns {Number}
         */
        public getTitleFontSize():number {
            return this._buttonOption._size;
        }

        /**
         * 设置标题字体大小
         * @param {String} fontName
         */
        public setTitleFontName(fontName:string) {
            var self = this, buttonOption = self._buttonOption;
            buttonOption._fontFamily = fontName;
            buttonOption._textDirty = true;
        }

        /**
         * 获取标题字体大小
         * @returns {String}
         */
        public getTitleFontName():string {
            return this._buttonOption._fontFamily;
        }

        /**
         * 置灰
         * @param isGray
         */
        public setGray(isGray:boolean) {
            super.setGray(isGray);
            var self = this;
            self.touchEnabled = !isGray;
        }

        /**
         * 专门给WEBGL用的啊亲，这是一个HACK!
         * @returns {boolean}
         */
        public _makeBitmapCache ():boolean {
            return egret.TextField.prototype._makeBitmapCache.call(this);
        }

        _draw(renderContext){
            var self:any = this, _buttonOption = self._buttonOption;
            if(_buttonOption.text && _buttonOption._textDirty){
                _buttonOption._textDirty = false;
                var rendererContext:egret.RendererContext = egret.MainContext.instance.rendererContext;
                rendererContext.setupFont(<any>_buttonOption);
                _buttonOption.textWidth = rendererContext.measureText(_buttonOption.text);

                var mc = egret.MainContext;
                if(mc.runtimeType == mc.RUNTIME_HTML5){
                    self._cacheAsBitmap = true;
                    self._cacheDirty = true;
                }
            }
            egret.DisplayObject.prototype._draw.call(self, renderContext);
        }

        public _render(renderContext:egret.RendererContext):void {
            var self = this, texture = self._buttonTexture;
            if (!texture) {
                self._texture_to_render = null;
                return;
            }
            self._texture_to_render = texture;

            var _buttonOption = self._buttonOption;
            var destW:number = self._hasWidthSet?self._explicitWidth:texture._textureWidth;
            var destH:number = self._hasHeightSet?self._explicitHeight:texture._textureHeight;

            //画按钮纹理
            if(texture){
                egret.Bitmap._drawBitmap(renderContext, destW, destH, self);
            }

            //画按钮文本
            if(_buttonOption.text && _buttonOption.text != ""){
                var posPercent = _buttonOption.titlePosByPercent;
                var x = destW * posPercent.x - _buttonOption.textWidth/2;
                var y = destH * posPercent.y;
                renderContext.drawText(<any>_buttonOption, _buttonOption.text, x, y,0);
            }
            super._render(renderContext);
        }

        /**
         * @Override
         * 设置特殊属性
         */
        public copySpecialProps(uiButton:UIButton) {
            var self = this, buttonOption1 = self._buttonOption, buttonOption2 = uiButton._buttonOption;
            var textures1 = buttonOption1.textures, textures2 = buttonOption2.textures;
            textures1[0] = textures2[0];
            textures1[1] = textures2[1];
            textures1[2] = textures2[2];

            self.setTitleText(uiButton.getTitleText());
            self.setTitleFontName(uiButton.getTitleFontName());
            self.setTitleFontSize(uiButton.getTitleFontSize());
            self.setTitleColor(uiButton.getTitleColor());
            self.setPressedActionEnabled(buttonOption2.pressedActionEnabled);
        }

        //+++++++++++++++++++++++++++extend 开始++++++++++++++++++++++++
        setOption(option) {
            if (option == null) return option;
            var self = this;
            option = super.setOption(option);
            if (option.value != null) {
                var value = option.value;
                self.setTitleText(value);
            }
            return option;
        }

        setButtonImg(frameName) {
            var self = this;
            self.loadTextures(frameName, frameName, frameName);
        }

        dtor(){
            super.dtor();
            this._buttonOption.doDtor();
        }

        reset(){
            super.reset();
            this._buttonOption.reset();
        }

        //+++++++++++++++++++++++++++extend 结束++++++++++++++++++++++++
    }
}
