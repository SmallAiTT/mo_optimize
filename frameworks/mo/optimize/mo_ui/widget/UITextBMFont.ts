module mo_ui {
    export class UITextBMFont extends UIWidget {
        static __className:string = "UITextBMFont";

        public _bitmapTextRenderer: egret.BitmapText;
        public _fntFileName:string;

        //@override
        _initProp(){
            var self = this;
            self._bitmapTextRenderer = new egret.BitmapText();
            self._bitmapTextRenderer._setAnchorX(0);
            self._bitmapTextRenderer._setAnchorY(0);
            super._initProp();
            self._fntFileName = "";
        }

        public initRenderer () {
            this.addChild(this._bitmapTextRenderer);
        }

        public setFntFile (fileName:string) {
            this._fntFileName = fileName;
            this._bitmapTextRenderer.font = res.getRes(fileName);

            this._labelBMFontScaleChangedWithSize();

            this.setText(this._bitmapTextRenderer.text);
        }

        public setText (value:string) {
            this._bitmapTextRenderer.text = value;
            this._labelBMFontScaleChangedWithSize();
        }

        public getText ():string {
            return this._bitmapTextRenderer.text;
        }

        public _onNodeSizeDirty () {
            super._onNodeSizeDirty.call(this);
            this._labelBMFontScaleChangedWithSize();
        }

        public getRenderer ():egret.BitmapText {
            return this._bitmapTextRenderer;
        }

        private _labelBMFontScaleChangedWithSize () {
            var self = this;
            if (self._nodeOption.ignoreSize) {
                self._bitmapTextRenderer.scaleX = 1;
                self._bitmapTextRenderer.scaleY = 1;
                var labelBmfont = self._bitmapTextRenderer;
                self.width = labelBmfont.width;
                self.height = labelBmfont.height;
            }
            else {
                var labelBmfont = self._bitmapTextRenderer;
                var scaleX = self.width / labelBmfont.width;
                var scaleY = self.height / labelBmfont.height;
                self._bitmapTextRenderer.scaleX = scaleX;
                self._bitmapTextRenderer.scaleY = scaleY;
            }
        }

        public copySpecialProps (labelBMFont:UITextBMFont) {
            this.setFntFile(labelBMFont._fntFileName);
            this.setText(labelBMFont._bitmapTextRenderer.text);
        }
    } 
}

