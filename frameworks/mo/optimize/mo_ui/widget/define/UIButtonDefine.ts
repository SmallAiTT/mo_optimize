module mo_opt {
    export class _UIButtonOption extends mo_opt.Option {
        //由于要传给渲染引擎，所以要改成下划线
        _textColor:number;
        _textColorString:string;
        _strokeColor:number;
        _strokeColorString:string;
        _stroke:number;
        _size:number;
        _fontFamily:string;
        textures:egret.Texture[];
        text:string;
        titlePosByPercent:mo.Point;
        pressedActionEnabled:boolean;
        isGray:boolean;
        currentIndex:number;
        textWidth:number;
        _textDirty:boolean;
        oldScale:mo.Point;
        act:egret.action.Action;

        //@override
        _initProp():void {
            super._initProp();
            var self = this;
            if (!self.textures) {
                self.textures = [];
            } else {
                self.textures.length = 0;
            }
            self._textDirty = false;
            self.textWidth = 0;
            self.text = null;
            self._size = 24;
            self._fontFamily = egret.TextField.default_fontFamily;
            self._textColor = 0xffffff;//默认颜色
            self._textColorString = egret.toColorString(0xffffff);//默认颜色
            self._strokeColor = 0xffffff;//默认颜色
            self._strokeColorString = egret.toColorString(0xffffff);//默认颜色
            self._stroke = 0;
            self.titlePosByPercent = mo.p(0.5, 0.5);
            self.pressedActionEnabled = false;
            self.isGray = false;
            self.currentIndex = null;//默认在图片还没加载的时候，是没有的
        }

        setTexture(index:number, texture:egret.Texture) {
            var self = this, textures = self.textures;
            textures[index] = texture;
        }

        _setTextColor(value:number):void {
            if (this._textColor != value) {
                this._textColor = value;
                this._textColorString = egret.toColorString(value);
                this._textDirty = true;
            }
        }

        _setStroke(value:number, lineSize):void {
            if (this._strokeColor != value) {
                this._strokeColor = value;
                this._strokeColorString = egret.toColorString(value);
                this._textDirty = true;
            }
            this._stroke = lineSize;
        }
    }
}