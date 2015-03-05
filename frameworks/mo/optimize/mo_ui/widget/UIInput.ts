module mo_ui {
    /**
     * 输入框基类
     * @class
     */
    export class UIInput extends UIText {
        static __className:string = "UIInput";

        //@override
        _initProp(){
            var self = this;
            UIWidget.prototype._initProp.call(self);
            self._touchOption.hitEgretEnabled = true;
        }

        /**
         * @private
         */
        initRenderer() {
            super.initRenderer();
            this._nodeOption.textRenderer.type = egret.TextFieldType.INPUT;
            this.addChild(this._nodeOption.textRenderer);
        }

        /**
         * 开启密码样式
         * @param {Boolean} enable
         */
        setPasswordEnabled(enable:boolean) {
            this._nodeOption.textRenderer.displayAsPassword  = enable;
        }

        /**
         * 是否开启密码样式
         * @returns {Boolean}
         */
        isPasswordEnabled():boolean {
            return this._nodeOption.textRenderer.displayAsPassword;
        }

        //@override
        _setTouchEnabled(enable) {
            super._setTouchEnabled(enable);
            this._nodeOption.textRenderer.touchEnabled = enable;
        }

        /**
         * 复制特殊属性
         * @param textField
         */
        copySpecialProps(textField:UIInput) {
            super.copySpecialProps(textField);
            this.setPasswordEnabled(textField.isPasswordEnabled());
        }

        public _render(renderContext:egret.RendererContext):void {
            egret.DisplayObjectContainer.prototype._render.call(this, renderContext);
        }

        //++++++++++++++++++++++extend 开始======================

        setOption (option){
            if(option == null) return option;
            option = super.setOption(option);
            if(option.value != null) {
                var value = option.value;
                this.setText(value);
            }
            return option;
        }
        //++++++++++++++++++++++extend 开始======================
    }
}
